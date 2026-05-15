import os
import json
import shutil
from rembg import remove

with open('parsed_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

src_dir = 'docx_extracted/word/media'
base_dest_dir = 'public/unity-game/assets'

os.makedirs(os.path.join(base_dest_dir, 'characters'), exist_ok=True)
os.makedirs(os.path.join(base_dest_dir, 'bosses'), exist_ok=True)
os.makedirs(os.path.join(base_dest_dir, 'skills'), exist_ok=True)

skill_images = set()
char_boss_images = set()

for char in data['characters']:
    for img in char['images']:
        char_boss_images.add((img, 'characters'))
    for skill in char['skills']:
        for img in skill['images']:
            skill_images.add(img)

for boss in data['bosses']:
    for img in boss['images']:
        char_boss_images.add((img, 'bosses'))
    for skill in boss['skills']:
        for img in skill['images']:
            skill_images.add(img)

print(f"Total character/boss images: {len(char_boss_images)}")
print(f"Total skill images to process: {len(skill_images)}")

print("Copying Character/Boss images...")
for img, folder in char_boss_images:
    src_path = os.path.join(src_dir, img)
    if os.path.exists(src_path):
        dest_path = os.path.join(base_dest_dir, folder, img)
        shutil.copy2(src_path, dest_path)
    else:
        print(f"Missing: {src_path}")

print("Processing Skill images with rembg...")
total = len(skill_images)
for i, img in enumerate(skill_images):
    src_path = os.path.join(src_dir, img)
    if os.path.exists(src_path):
        name, _ = os.path.splitext(img)
        dest_path = os.path.join(base_dest_dir, 'skills', name + '.png')
        if os.path.exists(dest_path):
             continue
        print(f"[{i+1}/{total}] Processing {img}...")
        try:
            with open(src_path, 'rb') as i_f:
                input_data = i_f.read()
            output_data = remove(input_data)
            with open(dest_path, 'wb') as o_f:
                o_f.write(output_data)
        except Exception as e:
            print(f"Error processing {img}: {e}")
    else:
        print(f"Missing skill image: {src_path}")

print("Done processing images.")
