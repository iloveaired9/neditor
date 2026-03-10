import httpx
from bs4 import BeautifulSoup

def get_metadata(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        with httpx.Client(follow_redirects=True, timeout=10.0) as client:
            response = client.get(url, headers=headers)
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

            title = get_meta("title") or (soup.title.string if soup.title else None)
            description = get_meta("description") or get_meta(name="description")
            image = get_meta("image")
            site_name = get_meta("site_name")
            
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
        return {"error": str(e)}

url = "https://v.daum.net/v/20260310082425406"
print(get_metadata(url))
