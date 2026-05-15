import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

boss_map = {
    'assets/image46.png': 'boss_level_1_1.html',
    'assets/image57.png': 'boss_level_1_2.html',
    'assets/image56.png': 'boss_level_1_3.html',
    'assets/image52.png': 'boss_level_1_4.html',
    'assets/image61.png': 'boss_level_2_1.html',
    'assets/image34.png': 'boss_level_2_2.html',
    'assets/image51.png': 'boss_level_2_3.html',
    'assets/image21.png': 'boss_level_2_4.html',
    'assets/image38.png': 'boss_level_2_5.html',
    'assets/image49.png': 'boss_level_2_6.html',
    'assets/image60.png': 'boss_level_2_7.html',
    'assets/image58.png': 'boss_level_3_1.html',
    'assets/image26.png': 'boss_level_3_2.html',
    'assets/image55.png': 'boss_level_3_3.html',
    'assets/image39.png': 'boss_level_3_4.html',
    'assets/image30.png': 'boss_level_3_5.html',
    'assets/image59.png': 'boss_level_3_6.html',
    'assets/image54.png': 'boss_level_3_7.html'
}

player_map = {
    'assets/player_1.jpg': 'player_1.html',
    'assets/player_2.jpg': 'player_2.html',
    'assets/player_3.jpg': 'player_3.html',
    'assets/player_4.jpg': 'player_4.html',
    'assets/player_5.jpg': 'player_5.html',
    'assets/player_6.jpg': 'player_6.html',
}

all_map = {**boss_map, **player_map}

lines = html.splitlines(True)
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if '<article class="card"' in line:
        # Check if this article contains an image in all_map
        is_target = False
        link = ""
        # look ahead 5 lines
        for j in range(1, 6):
            if i + j < len(lines):
                for img_src, target_link in all_map.items():
                    if img_src in lines[i+j]:
                        is_target = True
                        link = target_link
                        break
            if is_target: break
            
        if is_target:
            # Revert the article tag to just <article class="card">
            line = re.sub(r'<article class="card"[^>]*>', '<article class="card">', line)
            
            # Wrap with <a> tag
            new_lines.append(f'<a href="{link}" target="_blank" style="text-decoration: none; display: block; color: inherit; height: 100%;">\n')
            new_lines.append(line)
            
            # Now we need to find the closing </article> and add </a> after it
            # Read lines until we find </article>
            i += 1
            nest_level = 1
            while i < len(lines):
                inner_line = lines[i]
                if '<article' in inner_line:
                    nest_level += 1
                if '</article>' in inner_line:
                    nest_level -= 1
                    if nest_level == 0:
                        new_lines.append(inner_line)
                        new_lines.append('</a>\n')
                        break
                new_lines.append(inner_line)
                i += 1
        else:
            new_lines.append(line)
    else:
        new_lines.append(line)
    i += 1

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("index.html wrapped with <a> tags successfully!")
