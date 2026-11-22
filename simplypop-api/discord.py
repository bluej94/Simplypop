import requests
import os

DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")

def send_discord_alert(name, phone, email, description, budget, image_url=None):
    """Send a properly-formatted Discord webhook message."""
    # Trim overly long descriptions (Discord limit 2000 chars)
    if len(description) > 1900:
        description = description[:1900] + "…"

    # Build the message
    content = (
        f"📩 **New Inquiry Received!**\n"
        f"**Name:** {name}\n"
        f"**Phone:** {phone}\n"
        f"**Email:** {email}\n"
        f"**Budget:** {budget or 'N/A'}\n"
        f"**Message:** {description}"
    )

    # Discord allows either 'content' or 'embeds' or both — but embeds must be a list of dicts
    payload = {"content": content}

    image = f"https://simplypopcreations.com/api{image_url}"
    
    # Only add embed if we have a valid image URL
    if image and image.lower().startswith(("http://", "https://")):
        payload["embeds"] = [
            {
                "title": "🎨 Inspiration Image",
                "image": {"url": image},
            }
        ]

    try:
        response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
        if response.status_code != 204 and response.status_code != 200:
            print("⚠️ Discord response:", response.status_code, response.text)
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Failed to send Discord notification: {e}")
