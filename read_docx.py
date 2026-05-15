import sys
import zipfile
import xml.etree.ElementTree as ET

try:
    doc = zipfile.ZipFile(r'c:\Users\leon\Desktop\111210510\Interactive_Web_Programming\2d遊戲腳本.docx')
    xml_content = doc.read('word/document.xml')
    tree = ET.XML(xml_content)
    namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = [node.text for node in tree.findall('.//w:t', namespace) if node.text]
    with open(r'c:\Users\leon\Desktop\111210510\Interactive_Web_Programming\scratch_docx.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(paragraphs))
except Exception as e:
    print(e)
