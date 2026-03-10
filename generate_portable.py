
import os

# Paths to the assets (Verified from dist/index.html after second build)
css_path = r'c:\rnd\claude\editor\neditor\dist\assets\index-D1ZszOPm.css'
js_path = r'c:\rnd\claude\editor\neditor\dist\assets\index-DVPMMCez.js'
html_template_path = r'c:\rnd\claude\editor\neditor\index.html'
output_path = r'c:\rnd\claude\editor\neditor\sindex.html'

def generate_portable_html():
    print(f"Loading CSS from {css_path}...")
    if not os.path.exists(css_path):
        print(f"Error: {css_path} not found!")
        return
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    print(f"Loading JS from {js_path}...")
    if not os.path.exists(js_path):
        print(f"Error: {js_path} not found!")
        return
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
        
    print(f"Reading template from {html_template_path}...")
    with open(html_template_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    # Use plain string replacement instead of regex to avoid escape issues in minified JS
    css_tag = '<link rel="stylesheet" crossorigin href="./assets/index-D1ZszOPm.css">'
    if css_tag in html_content:
        print("Inlining CSS...")
        html_content = html_content.replace(css_tag, f'<style>{css_content}</style>')
    else:
        print("Warning: CSS tag not found literally, check template.")

    js_tag = '<script type="module" crossorigin src="./assets/index-DVPMMCez.js"></script>'
    if js_tag in html_content:
        print("Inlining JS...")
        html_content = html_content.replace(js_tag, f'<script>{js_content}</script>')
    else:
        print("Warning: JS tag not found literally, check template.")
                         
    print(f"Writing portable HTML to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Success! Portable sindex.html updated.")

if __name__ == "__main__":
    generate_portable_html()
