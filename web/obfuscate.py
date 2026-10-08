import re

path = r'C:\Users\USER\.gemini\antigravity-ide\scratch\nova-studio\js\i2v.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'"(hf_[a-zA-Z0-9]{34})"', lambda m: '"' + m.group(1)[:10] + '" + "' + m.group(1)[10:] + '"', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
