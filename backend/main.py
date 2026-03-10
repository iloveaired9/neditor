import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import aiofiles

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify the actual frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Serve uploaded files statically
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    # Validate file type
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")

    # Generate unique filename
    file_extension = os.path.splitext(image.filename)[1]
    if not file_extension:
        # Fallback extension based on content type
        content_type_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
        }
        file_extension = content_type_map.get(image.content_type, ".png")

    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save the file — explicit 500 on any I/O failure (Design Section 8.2)
    try:
        content = await image.read()
        async with aiofiles.open(file_path, "wb") as out_file:
            await out_file.write(content)
    except OSError as exc:
        print(f"File save failed for {unique_filename}: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Failed to save the uploaded file. Please try again."
        )

    # Return the URL of the uploaded image
    # Assuming the server runs on http://localhost:8000
    file_url = f"http://localhost:8000/uploads/{unique_filename}"
    return {"url": file_url}

@app.get("/files")
async def list_files():
    files = []
    for filename in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.isfile(file_path):
            files.append({
                "name": filename,
                "url": f"http://localhost:8000/uploads/{filename}",
                "size": os.path.getsize(file_path)
            })
    return files

@app.delete("/files/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return {"message": "File deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")
    else:
        raise HTTPException(status_code=404, detail="File not found")

@app.get("/metadata")
async def get_metadata(url: str):
    import httpx
    from bs4 import BeautifulSoup
    import re

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Helper to get meta tags
            def get_meta(property_name=None, name=None):
                if property_name:
                    tag = soup.find("meta", property={"og:" + property_name}) or \
                          soup.find("meta", property=property_name)
                else:
                    tag = soup.find("meta", attrs={"name": name})
                return tag.get("content") if tag else None

            title = get_meta("title") or soup.title.string if soup.title else None
            description = get_meta("description") or get_meta(name="description")
            image = get_meta("image")
            site_name = get_meta("site_name")
            
            # Fallback for title if it's too long or has extra stuff
            if title:
                title = title.strip()
            
            return {
                "title": title or url,
                "description": description or "",
                "image": image or "",
                "site_name": site_name or "",
                "url": str(response.url)
            }
    except Exception as e:
        print(f"Error fetching metadata for {url}: {e}")
        return {
            "title": url,
            "description": "Failed to fetch metadata",
            "image": "",
            "site_name": "",
            "url": url
        }

if __name__ == "__main__":
    import uvicorn
    # Change directory to the script's location so uvicorn can find 'main:app'
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
