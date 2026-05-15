import json
import os
import re

with open('../../parsed_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Players
player_html = '\n'
for i, char in enumerate(data['characters']):
    img = f'assets/characters/{char["images"][0]}' if char.get('images') else ''
    tag = ['Flame Tech', 'Holy Blade', 'Soul Lantern', 'Ion Strike', 'Shadow Blade', 'Wind Archer'][i]
    player_html += f'''        <a href="player_{i+1}.html"
          style="text-decoration: none; display: block; color: inherit; height: 100%;">
          <article class="card">
            <div class="card-img-wrapper"><img src="{img}" alt="{char['name']}" class="card-img" /></div>
            <div class="card-content">
              <span class="card-tag">{tag}</span>
              <h3 class="card-title">{char['name']}</h3>
            </div>
          </article>
        </a>\n'''

# Bosses
boss_html = '\n'
boss_idx = 0
level_counts = [4, 7, 7]
for level, count in enumerate(level_counts):
    boss_html += f'        <h2 class="section-group-title">👑 第 {level+1} 關首領 (Stage {level+1} Bosses)</h2>\n'
    for j in range(count):
        boss = data['bosses'][boss_idx]
        img = f'assets/bosses/{boss["images"][0]}' if boss.get('images') else ''
        boss_html += f'''        <a href="boss_level_{level+1}_{j+1}.html"
          style="text-decoration: none; display: block; color: inherit; height: 100%;">
          <article class="card">
            <div class="card-img-wrapper"><img src="{img}" alt="{boss['name']}" class="card-img" /></div>
            <div class="card-content">
              <span class="card-tag">Stage {level+1}</span>
              <h3 class="card-title">{boss['name']}</h3>
            </div>
          </article>
        </a>\n'''
        boss_idx += 1

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace players
html = re.sub(r'(<div id="players" class="gallery-section">).*?(</div>\s*<!-- Relics Section -->)',
              r'\g<1>' + player_html + r'      \g<2>', html, flags=re.DOTALL)

# Replace bosses
html = re.sub(r'(<div id="bosses" class="gallery-section">).*?(</div>\s*<!-- Props Section -->)',
              r'\g<1>' + boss_html + r'      \g<2>', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('index.html updated successfully!')
