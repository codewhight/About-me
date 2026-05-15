import os
import json
import math

with open('../../parsed_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

html_template = """<!doctype html>
<html lang="zh-Hant" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{name}｜Gole：破滅與新生</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../styles.css" />
  <style>
    :root {{
      --accent: #ff4d4d;
      --accent-glow: rgba(255, 77, 77, 0.3);
      --bg-panel: rgba(20, 20, 25, 0.85);
    }}
    body {{
      font-family: 'Inter', 'Noto Sans TC', sans-serif;
      background: linear-gradient(rgba(10, 10, 12, 0.85), rgba(10, 10, 12, 0.85)), url('assets/Illustrated Background.png');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      color: #e0e0e0;
      min-height: 100vh;
      margin: 0;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
    }}
    .back-btn {{
      position: absolute;
      top: 2rem;
      left: 2rem;
      padding: 0.6rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ccc;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      z-index: 100;
    }}
    .back-btn:hover {{
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 0 15px var(--accent-glow);
    }}
    .book-container {{
      display: flex;
      flex: 1;
      max-width: 1400px;
      margin: 6rem auto 2rem;
      width: 90%;
      background: var(--bg-panel);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
      position: relative;
    }}
    .book-container::after {{
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: url('assets/Illustrated Page.png');
      background-size: cover;
      background-position: center;
      opacity: 0.25;
      z-index: 0;
      pointer-events: none;
    }}
    
    .left-col {{
      flex: 0 0 45%;
      border-right: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      z-index: 1;
      background: rgba(0,0,0,0.2);
    }}
    
    .right-col {{
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
    }}
    
    .page {{
      display: none;
      flex-direction: column;
      height: 100%;
      padding: 3rem;
      animation: fadeIn 0.4s ease-out;
    }}
    .page.active {{
      display: flex;
    }}
    
    @keyframes fadeIn {{
      from {{ opacity: 0; transform: translateX(10px); }}
      to {{ opacity: 1; transform: translateX(0); }}
    }}
    
    .big-img {{
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }}
    .left-col:hover .big-img {{
      transform: scale(1.05);
    }}
    
    .placeholder-img {{
      width: 100%;
      height: 100%;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed rgba(255,255,255,0.2);
      border-radius: 10px;
      color: #888;
      font-size: 1.5rem;
      font-weight: 600;
      background: rgba(0,0,0,0.3);
    }}
    
    .title-area {{
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }}
    .tag {{
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
      display: block;
    }}
    .title {{
      font-size: 2.5rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }}
    
    .content-area {{
      flex: 1;
      overflow-y: auto;
      padding-right: 1rem;
    }}
    .content-area::-webkit-scrollbar {{
      width: 6px;
    }}
    .content-area::-webkit-scrollbar-thumb {{
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
    }}
    
    .desc {{
      font-size: 1.05rem;
      line-height: 1.8;
      color: #ccc;
      margin-bottom: 1.5rem;
    }}
    .desc p {{ margin-top: 0; margin-bottom: 1rem; }}
    
    .quote {{
      font-style: italic;
      color: var(--accent);
      border-left: 3px solid var(--accent);
      padding-left: 1rem;
      margin: 1.5rem 0;
      font-size: 1.1rem;
      background: rgba(255, 77, 77, 0.05);
      padding: 1rem;
      border-radius: 0 8px 8px 0;
    }}
    
    .stats-area {{
      margin-top: 2rem;
      padding: 1.5rem;
      background: rgba(0,0,0,0.3);
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.05);
    }}
    .stats-title {{
      font-size: 0.9rem;
      color: #888;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }}
    .stats-val {{
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
      font-family: monospace;
    }}
    
    .skill-card {{
      background: rgba(0,0,0,0.3);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.05);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }}
    .skill-card:hover {{
      border-color: rgba(255, 77, 77, 0.4);
      background: rgba(255, 77, 77, 0.03);
      transform: translateX(5px);
    }}
    
    .skill-header {{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 1rem;
    }}
    
    .skill-icon-container {{
      width: 100%;
      max-width: 500px;
      background: rgba(0,0,0,0.5);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255,255,255,0.1);
      overflow: hidden;
    }}
    
    .skill-icon {{
      width: 100%;
      height: auto;
      object-fit: contain;
    }}
    
    .skill-title-group {{
      flex: 1;
      width: 100%;
    }}
    
    .skill-name {{
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }}
    
    .skill-body p {{
      margin: 0 0 0.8rem 0;
      line-height: 1.6;
      color: #bbb;
    }}
    .skill-body p:last-child {{
      margin-bottom: 0;
    }}
    
    .skill-visuals {{
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }}
    .skill-visuals img {{
      max-width: 100%;
      max-height: 500px;
      border-radius: 8px;
      display: block;
      margin: 1rem 0;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(0,0,0,0.5);
      object-fit: contain;
    }}
    
    .pagination {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 1rem;
      flex-shrink: 0;
    }}
    .page-btn {{
      padding: 0.5rem 1.5rem;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .page-btn:hover:not(:disabled) {{
      background: rgba(255,255,255,0.1);
      border-color: #fff;
    }}
    .page-btn:disabled {{
      opacity: 0.3;
      cursor: not-allowed;
    }}
    .page-dots {{
      display: flex;
      gap: 0.5rem;
    }}
    .dot {{
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      cursor: pointer;
    }}
    .dot.active {{
      background: var(--accent);
      box-shadow: 0 0 10px var(--accent-glow);
    }}
    
    @media (max-width: 992px) {{
      .book-container {{ flex-direction: column; height: auto; }}
      .left-col {{ border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 2rem 1rem; }}
      .big-img {{ max-height: 300px; }}
    }}
  </style>
</head>
<body>
  <a href="index.html" class="back-btn">← 返回圖鑑</a>
  
  <div class="book-container">
    <div class="left-col">
      <img src="{detail_img}" class="big-img" alt="{name}" />
    </div>
    
    <div class="right-col">
      <!-- Page 1: Story & Stats -->
      <div class="page active" id="page-1">
        <div class="title-area">
          <span class="tag">{tag}</span>
          <h1 class="title">{name}</h1>
        </div>
        <div class="content-area">
          <div class="desc">{desc}</div>
          {quote_html}
        </div>
        <div class="stats-area">
          <div class="stats-title">Attributes</div>
          <div class="stats-val">{stats}</div>
        </div>
        <div class="pagination">
          <button class="page-btn prev-btn" disabled>上一頁</button>
          <div class="page-dots">
            {dots_html_1}
          </div>
          <button class="page-btn next-btn" onclick="goToPage(2)">下一頁</button>
        </div>
      </div>
      
      {pages_html}
      
    </div>
  </div>

  <script>
    function goToPage(pageNum) {{
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('page-' + pageNum).classList.add('active');
    }}
  </script>
</body>
</html>
"""

def split_skills(skills, max_per_page=2):
    pages = []
    for i in range(0, len(skills), max_per_page):
        pages.append(skills[i:i+max_per_page])
    return pages

def get_desc_html(text):
    if not text:
        return ""
    paras = [p for p in text.strip().split('\\n') if p]
    if len(paras) == 1:
        # maybe it used actual newlines
        paras = [p for p in text.strip().split('\n') if p]
    
    # filter out quote and stats if they were mixed in desc
    clean_paras = []
    quote = ""
    stats = ""
    for p in paras:
        if p.startswith('「') and p.endswith('」'):
            quote = p
        elif p.lower().startswith('hp:') or p.lower().startswith('boss屬性'):
            stats += p + " "
        elif p.startswith('boss描述:') or p.startswith('boss介紹:'):
            continue
        elif p.startswith('角色背景故事'):
            continue
        else:
            clean_paras.append(f"<p>{p}</p>")
    
    return "".join(clean_paras), quote, stats

def split_complex_skills(skills):
    new_skills = []
    for skill in skills:
        lines = skill['desc'].split('\n')
        sub_skills = []
        current_sub = None
        main_desc = []
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue
            
            if i + 1 < len(lines) and lines[i+1].strip().startswith('描述：'):
                if current_sub:
                    sub_skills.append(current_sub)
                current_sub = {'name': line, 'desc': '', 'images': []}
                i += 1
                current_sub['desc'] += lines[i].strip() + '\n'
                if i + 1 < len(lines) and lines[i+1].strip().startswith('視覺感：'):
                    i += 1
                    current_sub['desc'] += lines[i].strip() + '\n'
            elif current_sub:
                current_sub['desc'] += line + '\n'
            else:
                main_desc.append(line)
            i += 1
            
        if current_sub:
            sub_skills.append(current_sub)
            
        if not sub_skills:
            new_skills.append(skill)
        else:
            main_text = '\n'.join(main_desc).strip()
            images = skill.get('images', [])
            
            if main_text:
                new_skills.append({
                    'name': skill['name'],
                    'desc': main_text,
                    'images': images[:1] if len(images) > len(sub_skills) else []
                })
            
            img_start = 1 if len(images) > len(sub_skills) and main_text else 0
            for idx, sub in enumerate(sub_skills):
                img_idx = img_start + idx
                sub_img = [images[img_idx]] if img_idx < len(images) else []
                new_skills.append({
                    'name': skill['name'] + ' - ' + sub['name'],
                    'desc': sub['desc'],
                    'images': sub_img
                })
    return new_skills

char_tags = ["Flame Tech", "Holy Blade", "Soul Lantern", "Ion Strike", "Shadow Blade", "Wind Archer"]

def build_skill_html(skill):
    images = skill.get('images', [])
    icon_img = ""
    other_imgs = ""
    icon_html = ""
    if len(images) > 0:
        icon_img = f"assets/original/{images[0]}"
        icon_html = f'<div class="skill-icon-container"><img src="{icon_img}" class="skill-icon" onerror="this.style.display=\'none\'" /></div>'
        for i in range(1, len(images)):
            other_imgs += f'<img src="assets/original/{images[i]}" alt="Skill Visual" />'
            
    desc_html = ""
    for p in skill['desc'].split('\n'):
        if p.strip():
            desc_html += f"<p>{p.strip()}</p>"
            
    return f'''
        <div class="skill-card">
          <div class="skill-header" style="justify-content: center;">
            {icon_html}
          </div>
          <div class="skill-body">
            {desc_html}
            <div class="skill-visuals">
              {other_imgs}
            </div>
          </div>
        </div>
    '''

def process_entity(entity, file_name, tag, folder):
    # Images: index is [0], detail is [1]
    detail_img = ""
    if len(entity.get('images', [])) > 1:
        detail_img = f"assets/{folder}/{entity['images'][1]}"
    elif len(entity.get('images', [])) > 0:
        detail_img = f"assets/{folder}/{entity['images'][0]}"

    desc, quote, stats = get_desc_html(entity.get('desc', ''))
    
    if not stats:
        stats = "N/A"
        
    quote_html = f'<div class="quote">{quote}</div>' if quote else ""
    
    skill_pages = split_skills(split_complex_skills(entity.get('skills', [])), 1)
    total_pages = len(skill_pages) + 1
    
    dots_html_1 = ""
    for i in range(1, total_pages + 1):
        active = "active" if i == 1 else ""
        dots_html_1 += f'<div class="dot {active}" onclick="goToPage({i})"></div>'
        
    pages_html = ""
    for page_idx, skills in enumerate(skill_pages):
        current_page = page_idx + 2
        
        dots_html = ""
        for i in range(1, total_pages + 1):
            active = "active" if i == current_page else ""
            dots_html += f'<div class="dot {active}" onclick="goToPage({i})"></div>'
            
        prev_btn = f'<button class="page-btn prev-btn" onclick="goToPage({current_page-1})">上一頁</button>'
        next_btn = f'<button class="page-btn next-btn" onclick="goToPage({current_page+1})">下一頁</button>' if current_page < total_pages else '<button class="page-btn next-btn" disabled>下一頁</button>'
        
        skills_html = ""
        for s in skills:
            skills_html += build_skill_html(s)
            
        skill_title = skills[0]['name'] if skills else "Skill"
        pages_html += f'''
      <div class="page" id="page-{current_page}">
        <div class="title-area">
          <span class="tag">Skills - Page {current_page-1}</span>
          <h2 class="title" style="font-size: 2rem; margin-top: 0.5rem;">{skill_title}</h2>
        </div>
        <div class="content-area">
            {skills_html}
        </div>
        <div class="pagination">
          {prev_btn}
          <div class="page-dots">
            {dots_html}
          </div>
          {next_btn}
        </div>
      </div>
        '''
        
    html = html_template.format(
        name=entity['name'],
        detail_img=detail_img,
        tag=tag,
        desc=desc,
        quote_html=quote_html,
        stats=stats,
        dots_html_1=dots_html_1,
        pages_html=pages_html
    )
    
    with open(file_name, 'w', encoding='utf-8') as f:
        f.write(html)


print("Generating character pages...")
for i, char in enumerate(data['characters']):
    process_entity(char, f"player_{i+1}.html", char_tags[i], "characters")

print("Generating boss pages...")
level_counts = [4, 7, 7]
boss_idx = 0
for level, count in enumerate(level_counts):
    for j in range(count):
        process_entity(data['bosses'][boss_idx], f"boss_level_{level+1}_{j+1}.html", f"Stage {level+1} Boss", "bosses")
        boss_idx += 1

print("All 24 pages generated successfully.")
