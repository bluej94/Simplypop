from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, status, Response, Cookie, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import shutil
from datetime import datetime, timedelta
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
import jwt
from passlib.context import CryptContext
from discord import send_discord_alert
import secrets
from pathlib import Path
import asyncio
from psycopg2.extras import RealDictCursor
from database import get_connection, return_connection, init_connection_pool, close_connection_pool
from image_converter import convert_image_to_webp_variants, ImageConverter 

app = FastAPI()

# Custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

# ========================
# SECURITY CONFIGURATION
# ========================

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable must be set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 1  # Reduced from 24 to 2 hours
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")

if not ADMIN_PASSWORD_HASH:
    raise ValueError("ADMIN_PASSWORD_HASH environment variable must be set")

# Environment detection for cookie security
ENVIRONMENT = os.getenv("ENVIRONMENT", "production")  # Default to production for safety
IS_PRODUCTION = ENVIRONMENT.lower() == "production"
COOKIE_SECURE = IS_PRODUCTION  # True for HTTPS (production), False for HTTP (development)
COOKIE_SAMESITE = "strict" if IS_PRODUCTION else "lax"  # Stricter in production

# Allowed file extensions and MIME types
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/gif', 'image/webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# ========================
# CORS CONFIGURATION
# ========================

# Support both Cloudflare tunnel and local access
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "https://simplypopcreations.com,https://www.simplypopcreations.com,http://192.168.1.37,http://localhost,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,  # CRITICAL for HttpOnly cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Content-Type", "Authorization"],
)
# ========================
# PYDANTIC MODELS
# ========================

class LoginRequest(BaseModel):
    password: str = Field(..., min_length=8, max_length=100)
    username: Optional[str] = None  # Accept but ignore username for compatibility

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class StatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(New|Pending|Archived|Follow-up)$")

class UpdateItem(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    event_type: str = Field(..., min_length=1, max_length=50)

# ========================
# DATABASE CONFIGURATION
# ========================

GALLERY_DIR = Path(os.getenv("GALLERY_DIR", "/app/simplypop/gallery"))
CLIENT_DIR = Path(os.getenv("CLIENT_DIR", "/app/simplypop/client"))

GALLERY_DIR.mkdir(parents=True, exist_ok=True)
CLIENT_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/gallery", StaticFiles(directory=str(GALLERY_DIR)), name="gallery_uploads")
app.mount("/client", StaticFiles(directory=str(CLIENT_DIR)), name="client_uploads")

# Initialize database connection pool on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database connection pool when application starts"""
    init_connection_pool(minconn=2, maxconn=10)
    print("✓ Application started, database pool initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection pool when application shuts down"""
    close_connection_pool()
    print("✓ Application shutdown, database pool closed")

# ========================
# FILE VALIDATION FUNCTIONS
# ========================

def generate_safe_filename(original_filename: str, prefix: str = "") -> str:
    """Generate a safe, unique filename"""
    ext = Path(original_filename).suffix.lower()
    
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )
    
    # Generate cryptographically secure random filename
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = secrets.token_hex(8)
    safe_name = f"{prefix}{timestamp}_{random_str}{ext}"
    
    return safe_name

async def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded image file"""
    # Check file extension
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )
    
    # Check MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid MIME type. Allowed: {', '.join(ALLOWED_MIME_TYPES)}"
        )
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file"
        )

async def save_upload_file(file: UploadFile, destination: Path) -> str:
    """Safely save uploaded file"""
    # Ensure destination is within allowed directory
    destination = destination.resolve()
    if not (str(destination).startswith(str(GALLERY_DIR.resolve())) or 
            str(destination).startswith(str(CLIENT_DIR.resolve()))):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file path"
        )
    
    try:
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        if destination.exists():
            destination.unlink()  # Clean up partial file
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save file"
        )
    
    return str(destination)

# ========================
# AUTHENTICATION FUNCTIONS
# ========================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token from Authorization header (DEPRECATED - kept for backwards compatibility)"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None or user_id != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"user_id": user_id}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(access_token: Optional[str] = Cookie(None)) -> str:
    """
    Dependency to verify authentication from HttpOnly cookie.
    Use this in all protected endpoints.
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

# ========================
# PUBLIC ROUTES
# ========================

@app.get("/gallery")
async def get_gallery():
    """Fetch all gallery items (PUBLIC)"""
    conn = get_connection()
    try:
        c = conn.cursor(cursor_factory=RealDictCursor)
        c.execute(
            """SELECT id, title,
                      thumbnail_url, medium_url, large_url,
                      created_at, event_type
               FROM gallery
               ORDER BY created_at DESC"""
        )
        rows = c.fetchall()

        return [
            {
                "id": r["id"],
                "title": r["title"],
                "thumbnail_url": r.get("thumbnail_url"),  
                "medium_url": r.get("medium_url"),
                "large_url": r.get("large_url"),
                "created_at": r["created_at"].isoformat() if r["created_at"] else None,
                "event_type": r["event_type"],
            }
            for r in rows
        ]
    finally:
        return_connection(conn)

@app.post("/contact")
async def submit_contact(
    name: str = Form(..., max_length=100),
    email: str = Form(..., max_length=100),
    phone: str = Form(..., max_length=20),
    description: str = Form(..., max_length=2000),
    budget: str = Form(None, max_length=50),
    event_Date: str = Form(None, max_length=50),
    inspiration: UploadFile = File(None),
):
    """Submit a new contact form with optional inspiration image (PUBLIC)"""
    
    # Validate email format
    if "@" not in email or "." not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    file_path = None
    
    if inspiration and inspiration.filename:
        # Validate file
        await validate_image_file(inspiration)
        
        # Generate safe filename
        safe_filename = generate_safe_filename(inspiration.filename, prefix="client_")
        file_location = CLIENT_DIR / safe_filename
        
        # Save file
        await save_upload_file(inspiration, file_location)
        file_path = f"/client/{safe_filename}"

    conn = get_connection()
    try:
        c = conn.cursor()
        c.execute(
            """INSERT INTO rsvp
            (name, email, phone, description, budget, inspiration_file, created_at, event_date, status)
            VALUES (%s, %s, %s, %s, %s, %s, NOW(), %s, %s) RETURNING id""",
            (name, email, phone, description, budget, file_path, event_Date, "New"),
        )
        item_id = c.fetchone()[0]
        conn.commit()
    finally:
        return_connection(conn)

    # Send Discord alert (wrapped in try-catch to not fail the request)
    try:
        send_discord_alert(name, phone, email, description, budget, file_path)
    except Exception as e:
        print(f"Failed to send Discord alert: {e}")
    
    return {"message": "Form submitted successfully!", "id": item_id}

# ========================
# AUTHENTICATION ROUTE
# ========================

@app.post("/login")
async def login(login_request: LoginRequest, response: Response):
    """Admin login endpoint - sets JWT as HttpOnly cookie"""

    # Verify password only
    if not verify_password(login_request.password, ADMIN_PASSWORD_HASH):
        await asyncio.sleep(1)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Create token
    access_token = create_access_token(data={"sub": "admin"})

    # Set HttpOnly cookie (instead of returning in body)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,           # Cannot be accessed by JavaScript (XSS protection)
        secure=COOKIE_SECURE,    # Only sent over HTTPS in production
        samesite=COOKIE_SAMESITE,  # CSRF protection
        max_age=ACCESS_TOKEN_EXPIRE_HOURS * 3600,  # Expiry in seconds
        path="/",                # Cookie sent with all requests
    )

    # Return only user info (NOT the token)
    return {
        "user": {
            "id": "admin",
            "name": "Simply Pop Admin"
        },
        "message": "Login successful"
    }

@app.get("/verify")
async def verify_admin(current_user: str = Depends(get_current_user)):
    """Verify JWT token from HttpOnly cookie and return admin user info"""
    return {
        "user": {
            "id": "admin",
            "name": "Simply Pop Admin"
        }
    }

@app.post("/logout")
async def logout(response: Response):
    """Logout endpoint - clears the HttpOnly cookie"""
    # Clear the HttpOnly cookie
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE
    )

    return {"message": "Logged out successfully"}

# ========================
# PROTECTED ROUTES (Admin Only)
# ========================

@app.post("/gallery")
async def add_gallery_item(
    current_user: str = Depends(get_current_user),
    title: str = Form(..., max_length=100),
    event_type: str = Form(..., max_length=50),
    image: UploadFile = File(...),
):
    """Upload a new gallery item (ADMIN ONLY)"""

    # Validate image
    await validate_image_file(image)

    # Generate safe filename
    safe_filename = generate_safe_filename(image.filename, prefix="gallery_")
    file_location = GALLERY_DIR / safe_filename

    # Save file
    await save_upload_file(image, file_location)

    # Convert to WebP variants if it's not already WebP
    if file_location.suffix.lower() != '.webp':
        try:
            variants_result = convert_image_to_webp_variants(
                file_location,
                variants=['thumbnail', 'medium', 'large'],
                delete_original=True
            )

            # Store all variant URLs
            thumbnail_url = variants_result['thumbnail']['url']
            medium_url = variants_result['medium']['url']
            large_url = variants_result['large']['url']
            image_url = large_url  # Default for backward compatibility

            print(f"✓ Image converted to WebP variants:")
            print(f"  Thumbnail: {variants_result['thumbnail']['dimensions']} - {variants_result['thumbnail']['size_formatted']}")
            print(f"  Medium: {variants_result['medium']['dimensions']} - {variants_result['medium']['size_formatted']}")
            print(f"  Large: {variants_result['large']['dimensions']} - {variants_result['large']['size_formatted']}")
            print(f"  Total savings: {variants_result['_stats']['original_size_formatted']} → {ImageConverter.format_size(variants_result['_stats']['total_size'])}")

        except Exception as e:
            print(f"✗ WebP conversion failed, using original: {e}")
            image_url = f"/gallery/{safe_filename}"
            thumbnail_url = image_url
            medium_url = image_url
            large_url = image_url
    else:
        # Already WebP, still create variants from it
        try:
            variants_result = convert_image_to_webp_variants(
                file_location,
                variants=['thumbnail', 'medium', 'large'],
                delete_original=False  # Don't delete if already WebP
            )
            thumbnail_url = variants_result['thumbnail']['url']
            medium_url = variants_result['medium']['url']
            large_url = variants_result['large']['url']
            image_url = large_url
            print(f"✓ Created variants from existing WebP")
        except Exception as e:
            print(f"✗ Failed to create variants: {e}")
            image_url = f"/gallery/{safe_filename}"
            thumbnail_url = image_url
            medium_url = image_url
            large_url = image_url

    conn = get_connection()
    try:
        c = conn.cursor()
        c.execute(
            """INSERT INTO gallery
            (title, thumbnail_url, medium_url, large_url, created_at, event_type)
            VALUES (%s, %s, %s, %s, NOW(), %s) RETURNING id""",
            (title, thumbnail_url, medium_url, large_url, event_type),
        )
        item_id = c.fetchone()[0]
        conn.commit()
    except Exception as e:
        # Clean up all variant files if database insert fails
        for url in [thumbnail_url, medium_url, large_url]:
            variant_file = GALLERY_DIR / Path(url).name
            if variant_file.exists():
                variant_file.unlink()
        if file_location.exists():
            file_location.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create gallery item"
        )
    finally:
        return_connection(conn)

    return {
        "id": item_id,
        "title": title,
        "thumbnail_url": thumbnail_url,
        "medium_url": medium_url,
        "large_url": large_url,
        "event_type": event_type,
    }

@app.put("/gallery-edit/{item_id}")
async def update_gallery_item(
    item_id: int,
    item: UpdateItem,
    current_user: str = Depends(get_current_user),
):
    """Update gallery item text fields (ADMIN ONLY)"""
    
    if item_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid item ID")
    
    conn = get_connection()
    try:
        c = conn.cursor()
        c.execute(
            "UPDATE gallery SET title = %s, event_type = %s WHERE id = %s",
            (item.title, item.event_type, item_id),
        )
        conn.commit()

        if c.rowcount == 0:
            raise HTTPException(status_code=404, detail="Gallery item not found")
    finally:
        return_connection(conn)
    
    return {"message": "Gallery item updated successfully"}

@app.delete("/gallery-delete/{item_id}")
async def delete_gallery_item(
    item_id: int,
    current_user: str = Depends(get_current_user),
):
    """Delete a gallery item and its associated file (ADMIN ONLY)"""
    
    if item_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid item ID")
    
    conn = get_connection()
    try:
        c = conn.cursor(cursor_factory=RealDictCursor)
        c.execute("SELECT large_url FROM gallery WHERE id = %s", (item_id,))
        row = c.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Gallery item not found")

        image_url = row["large_url"]

        # Safe file deletion
        if image_url and image_url.startswith("/gallery/"):
            filename = Path(image_url).name
            file_path = GALLERY_DIR / filename

            # Verify path is within gallery directory
            if file_path.resolve().parent == GALLERY_DIR.resolve():
                if file_path.exists():
                    file_path.unlink()

        c.execute("DELETE FROM gallery WHERE id = %s", (item_id,))
        conn.commit()
    finally:
        return_connection(conn)

    return {"message": "Gallery item and associated file deleted successfully"}

@app.get("/contactforms")
async def get_contact_forms(current_user: str = Depends(get_current_user)):
    """Fetch all contact forms (ADMIN ONLY)"""
    conn = get_connection()
    try:
        c = conn.cursor(cursor_factory=RealDictCursor)
        c.execute(
            """SELECT id, name, email, phone, description, budget,
            inspiration_file, created_at, event_date, status
            FROM rsvp ORDER BY created_at DESC"""
        )
        rows = c.fetchall()

        return [
            {
                "id": r["id"],
                "name": r["name"],
                "email": r["email"],
                "phone": r["phone"],
                "description": r["description"],
                "budget": r["budget"],
                "inspiration_file": r["inspiration_file"],
                "created_at": r["created_at"].isoformat() if r["created_at"] else None,
                "event_date": r["event_date"],
                "status": r["status"] or "New",
            }
            for r in rows
        ]
    finally:
        return_connection(conn)

@app.patch("/contactforms/{form_id}")
async def update_contact_form_status(
    form_id: int,
    status_update: StatusUpdate,
    current_user: str = Depends(get_current_user),
):
    """Update the status of a contact form (ADMIN ONLY)"""
    
    if form_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid form ID")
    
    conn = get_connection()
    try:
        c = conn.cursor()
        c.execute(
            "UPDATE rsvp SET status = %s WHERE id = %s",
            (status_update.status, form_id),
        )
        conn.commit()

        if c.rowcount == 0:
            raise HTTPException(status_code=404, detail="Contact form not found")
    finally:
        return_connection(conn)
    
    return {"message": "Status updated successfully"}

@app.delete("/contactforms/{form_id}")
async def delete_contact_form(
    form_id: int,
    current_user: str = Depends(get_current_user),
):
    """Delete a contact form and its associated file (ADMIN ONLY)"""
    
    if form_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid form ID")
    
    conn = get_connection()
    try:
        c = conn.cursor(cursor_factory=RealDictCursor)
        c.execute("SELECT inspiration_file FROM rsvp WHERE id = %s", (form_id,))
        row = c.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Contact form not found")

        # Safe file deletion
        if row["inspiration_file"] and row["inspiration_file"].startswith("/client/"):
            filename = Path(row["inspiration_file"]).name
            file_path = CLIENT_DIR / filename

            # Verify path is within client directory
            if file_path.resolve().parent == CLIENT_DIR.resolve():
                if file_path.exists():
                    file_path.unlink()

        c.execute("DELETE FROM rsvp WHERE id = %s", (form_id,))
        conn.commit()
    finally:
        return_connection(conn)

    return {"message": "Contact form and associated file deleted successfully"}

# ========================
# HEALTH CHECK
# ========================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}