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

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i in range(len(lines)):
    line = lines[i]
    if '<article class="card">' in line:
        # look ahead to next line to find the img src
        next_line = lines[i+1] if i+1 < len(lines) else ""
        for img_src, link in all_map.items():
            if img_src in next_line:
                line = line.replace('<article class="card">', f'<article class="card" onclick="window.open(\'{link}\', \'_blank\')" style="cursor:pointer">')
                break
    new_lines.append(line)

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("index.html fixed!")
