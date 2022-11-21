import sys
import json

# Read full text
text_file_path = sys.argv[1]
with open(text_file_path, encoding='utf-8') as f:
    t = f.read()

# Create object to write
d = [{ "text": t }]

# Save new file in json
with open('books.js', 'w') as f:
    f.write('books = ' + json.dumps(d))
