# Backend Changes Required for HttpOnly Cookie Authentication

## Overview
The frontend has been updated to use **HttpOnly cookies** instead of localStorage for JWT token storage. This eliminates XSS vulnerabilities where malicious JavaScript could steal authentication tokens.

## What Changed on Frontend
- ✅ Removed `localStorage.setItem('adminToken', token)`
- ✅ Removed manual `Authorization: Bearer` header injection
- ✅ Added `withCredentials: true` to axios (already present)
- ✅ Updated logout to call backend `/logout` endpoint

## Required Backend Changes (FastAPI)

### 1. Update Login Endpoint (`POST /api/login`)

**Current behavior:** Returns JWT token in response body
**New behavior:** Set JWT as HttpOnly cookie, return user info only

```python
from fastapi import Response
from fastapi.responses import JSONResponse

@app.post("/login")
async def login(credentials: LoginRequest, response: Response):
    # Validate password
    if not verify_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Generate JWT token
    token = create_access_token(data={"sub": "admin"})

    # ✅ SET HTTPONLY COOKIE (instead of returning in body)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,        # ✅ Cannot be accessed by JavaScript
        secure=True,          # ✅ Only sent over HTTPS (set to False for local dev)
        samesite="lax",       # ✅ CSRF protection (or "strict" for more security)
        max_age=86400,        # ✅ 24 hours in seconds
        path="/",             # ✅ Cookie sent with all requests
    )

    # ✅ Return only user info (NOT the token)
    return {
        "user": {
            "name": "Admin",
            "role": "administrator"
        },
        "message": "Login successful"
    }
```

### 2. Update Verify Endpoint (`GET /api/verify`)

**Current behavior:** Expects `Authorization: Bearer <token>` header
**New behavior:** Read JWT from cookie

```python
from fastapi import Cookie, HTTPException
from typing import Optional

@app.get("/verify")
async def verify_token(access_token: Optional[str] = Cookie(None)):
    # ✅ Read token from cookie instead of Authorization header
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        # Decode and verify JWT
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {
            "user": {
                "name": "Admin",
                "role": "administrator"
            }
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### 3. Create Logout Endpoint (`POST /api/logout`)

**New endpoint:** Clears the HttpOnly cookie

```python
@app.post("/logout")
async def logout(response: Response):
    # ✅ Clear the HttpOnly cookie
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=True,
        samesite="lax"
    )

    return {"message": "Logged out successfully"}
```

### 4. Update Authentication Dependency

**Current:** Reads from Authorization header
**New:** Reads from cookie

```python
from fastapi import Depends, Cookie, HTTPException
from typing import Optional

async def get_current_user(access_token: Optional[str] = Cookie(None)):
    """
    Dependency to verify authentication from HttpOnly cookie
    Use this in all protected endpoints
    """
    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )

    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Example usage in protected endpoint
@app.get("/api/contactforms")
async def get_contact_forms(current_user: str = Depends(get_current_user)):
    # Only authenticated users can access this
    # ...
```

### 5. Update All Protected Endpoints

Replace the old authentication dependency with the new cookie-based one:

```python
# OLD (Authorization header)
@app.post("/api/gallery")
async def upload_gallery(token: str = Depends(verify_token)):
    pass

# NEW (HttpOnly cookie)
@app.post("/api/gallery")
async def upload_gallery(current_user: str = Depends(get_current_user)):
    pass
```

## CORS Configuration

Ensure your FastAPI backend has proper CORS settings for cookies:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost",       # Production Nginx
        "https://simplypopcreations.com",
        "http://192.168.1.37"
    ],
    allow_credentials=True,  # ✅ CRITICAL for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Nginx Configuration (Already Correct)

Your nginx.conf already has the correct settings:
- ✅ `client_max_body_size 10M`
- ✅ Rate limiting enabled
- ✅ Proxy headers configured

**No Nginx changes needed** - cookies are automatically forwarded.

## Environment-Specific Settings

### Development (local)
```python
response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=False,      # ✅ False for HTTP (localhost)
    samesite="lax",
    max_age=86400,
    path="/"
)
```

### Production (HTTPS)
```python
response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=True,       # ✅ True for HTTPS only
    samesite="strict", # ✅ Stricter CSRF protection
    max_age=86400,
    path="/"
)
```

## Testing the Changes

### 1. Test Login
```bash
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_password"}' \
  -c cookies.txt  # Save cookies

# Should see Set-Cookie header in response
# Should NOT see token in response body
```

### 2. Test Protected Endpoint
```bash
curl -X GET http://localhost/api/verify \
  -b cookies.txt  # Send saved cookies

# Should return user info
```

### 3. Test Logout
```bash
curl -X POST http://localhost/api/logout \
  -b cookies.txt

# Should clear the cookie
```

## Security Benefits

✅ **XSS Protection:** JavaScript cannot access HttpOnly cookies
✅ **Auto-expiry:** Cookie expires after 24 hours (configurable)
✅ **CSRF Protection:** SameSite=lax prevents cross-site attacks
✅ **Secure Transport:** Only sent over HTTPS in production
✅ **No Token Exposure:** Token never appears in JavaScript or localStorage

## Migration Checklist

- [ ] Update `/login` to set HttpOnly cookie
- [ ] Create `/logout` endpoint to clear cookie
- [ ] Update `/verify` to read from cookie
- [ ] Update `get_current_user` dependency
- [ ] Update all protected endpoints to use new dependency
- [ ] Verify CORS `allow_credentials=True`
- [ ] Test login flow in browser DevTools (Application > Cookies)
- [ ] Test logout flow
- [ ] Test protected endpoints
- [ ] Test token expiration
- [ ] Deploy to staging and test
- [ ] Clear localStorage on user browsers (they may have old tokens)

## Rollback Plan

If issues occur, you can temporarily support both methods:

```python
async def get_current_user(
    access_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = Header(None)
):
    token = access_token  # Try cookie first

    if not token and authorization:
        # Fallback to Authorization header (old method)
        token = authorization.replace("Bearer ", "")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # ... verify token
```

## Questions?

If you need help implementing these backend changes, let me know! The frontend is now ready and waiting for the backend to set HttpOnly cookies.
