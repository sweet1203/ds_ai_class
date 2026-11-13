#!/usr/bin/env python3
"""2026-2 딥러닝 10화면 페이지(deep-learning/lesson.html)를 3개 차시로 나눈다 (이식용, 한 번 쓰는 도구)."""
import json, pathlib, re, subprocess, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
s = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
F = {f['id']: f for f in json.loads((ROOT / 'forms/forms.json').read_text(encoding='utf-8'))['forms']}
C = {l['id']: l for u in json.loads((ROOT / 'course.json').read_text(encoding='utf-8'))['units'] for l in u['lessons']}
PARTS = {'u2-dl-1': ([1, 2, 3], '딥러닝 ① 퍼셉트론 · 조정 · 신경망 구조', [0, 1]),
         'u2-dl-2': ([4, 5, 6], '딥러닝 ② 활성화 함수 · 학습 과정 · 손실 함수', [2, 3]),
         'u2-dl-3': ([7, 8, 9], '딥러닝 ③ 경사 하강법 · 배치와 에포크 · 정리', [4, 5])}
base = (ROOT / 'framework/base.css').read_text(encoding='utf-8')
css = s[s.index('<style>') + 8:s.index('</style>')]
if css.startswith(base): css = css[len(base):]
main = s[s.index('<main id="main">') + len('<main id="main">'):s.index('</main>')]
secs = re.split(r'(?=<!-- \d+ )', main)
secs = [x for x in secs if x.strip().startswith('<!--')]
assert len(secs) == 10, len(secs)
names = [re.search(r'data-name="([^"]*)"', x).group(1) for x in secs]
i = s.index('<script>\n') + 9; js = s[i:s.index('</script>', i)]
head_std = set(l.strip() for l in (ROOT / 'framework/core_head.js').read_text(encoding='utf-8').splitlines() if l.strip())
pre = '\n'.join(l for l in js[:js.index('/* 퀴즈 */')].splitlines() if l.strip() and l.strip() not in head_std) + '\n'
quizsrc = js[js.index('/* 퀴즈 */'):js.index('const QK')]
Q = json.loads(subprocess.run(['node', '-e', quizsrc + ';console.log(JSON.stringify(QUIZ))'], capture_output=True, text=True, check=True).stdout)
k = js.index("$('quizReset').onclick"); les = js[js.index('\n', k) + 1:]
les = les[:les.rfind('updScore();')]
jsecs = {int(m.group(1)): m.start() for m in re.finditer(r'^/\* (\d+) ', les, re.M)}
order = sorted(jsecs); bounds = {n: (jsecs[n], jsecs[order[order.index(n) + 1]] if order.index(n) + 1 < len(order) else len(les)) for n in order}
cover = secs[0]
cover = cover.replace(cover[cover.index('<ol>'):cover.index('</ol>') + 5], '{{OL}}')
can = re.search(r'<ul class="can">(.*?)</ul>', cover, re.S); can_items = re.findall(r'<li>.*?</li>', can.group(1), re.S)
gl = re.search(r'<div class="glossary">(.*?)\n    </div>\n', cover, re.S); cards = re.findall(r'<div class="gcard".*?</dl></div>', gl.group(1), re.S)
for lid, (scr, title, cani) in PARTS.items():
    o = ROOT / 'lessons' / lid; o.mkdir(parents=True, exist_ok=True)
    m = {old: new for new, old in enumerate(scr, 1)}
    cv = cover.replace('{{OL}}', '<ol>' + ''.join(f'<li>{names[k]}</li>' for k in scr) + '<li>마무리 · 질문폼</li></ol>' if lid != 'u2-dl-3' else '<ol>' + ''.join(f'<li>{names[k]}</li>' for k in scr) + '</ol>')
    cv = cv.replace(can.group(1), '\n          ' + '\n          '.join(can_items[j] for j in cani) + '\n        ')
    keep = []
    for c in cards:
        g = int(re.search(r'go\((\d+)\)', c).group(1))
        if g in m: keep.append(re.sub(r'go\(\d+\)', f'go({m[g]})', c).replace(f'<i>0{g}</i>', f'<i>0{m[g]}</i>'))
    cv = cv.replace(gl.group(1), '\n      ' + '\n      '.join(keep))
    cv = cv.replace('인공지능 기초 · Ⅱ-2 딥러닝</span>', f'인공지능 기초 · Ⅱ-2 딥러닝 · {"①②③"[list(PARTS).index(lid)]}</span>')
    cv = re.sub(r'>01 퍼셉트론부터 시작하기 →<', f'>01 {names[scr[0]]}부터 시작하기 →<', cv)
    body = [cv]
    for old in scr:
        x = secs[old]
        x = x.replace(f'<div class="num">0{old}</div>', f'<div class="num">0{m[old]}</div>').replace(f'data-quiz="{old}"', f'data-quiz="{m[old]}"')
        body.append(x)
    f = F[C[lid]['form']]
    formgo = ('  <div class="formgo">\n    <span class="kicker">생각 정리 과제</span>\n    <h3>질문폼에 내 생각 쓰기</h3>\n    <ol>'
              + ''.join(f'<li>{q}</li>' for q in f['questions']) + '</ol>\n    <p>질문폼에는 붙여넣기가 되지 않아요. 직접 써 주세요.</p>\n'
              '    <a class="go" href="{{FORM_URL}}" target="_blank" rel="noopener">질문폼 열기 →</a>\n  </div>\n')
    if lid == 'u2-dl-3':
        last = body[-1]; j = last.rstrip().rfind('</section>'); body[-1] = last[:j] + formgo + '</section>\n'
    else:
        n = len(scr) + 1
        body.append(f'''<!-- {n} 마무리 -->
<section class="page" data-name="마무리" data-acc="#0f2742">
  <div class="head"><div class="num">0{n}</div><div><h2>마무리</h2><p>오늘 배운 것 확인 · 질문폼</p></div></div>
  <div class="card">
    <h3>개념 퀴즈 결과</h3>
    <table id="result"></table>
    <button class="btn ghost" id="quizReset">퀴즈 다시 풀기</button>
  </div>
{formgo}</section>
''')
    (o / 'screens.html').write_text('\n'.join(b.strip('\n') + '\n' for b in body), encoding='utf-8')
    q = {str(m[int(kk)]): v for kk, v in Q.items() if int(kk) in m}
    (o / 'quiz.js').write_text('/* 퀴즈 */\nconst QUIZ=' + json.dumps(q, ensure_ascii=False, indent=0) + ';\n', encoding='utf-8')
    code = les[bounds[0][0]:bounds[0][1]]
    for old in scr:
        if old in bounds:
            seg = les[bounds[old][0]:bounds[old][1]]
            seg = re.sub(r'onShow\[(\d+)\]', lambda mm: f'onShow[{m.get(int(mm.group(1)), mm.group(1))}]', seg)
            code += seg
    (o / 'lesson.js').write_text(code, encoding='utf-8')
    (o / 'pre.js').write_text(pre, encoding='utf-8')
    (o / 'lesson.css').write_text(css, encoding='utf-8')
    (o / 'lesson.json').write_text(json.dumps({'title': title, 'source': 'ai-worksheets deep-learning/lesson.html'}, ensure_ascii=False), encoding='utf-8')
    print(lid, len(body), 'screens', sum(len(v) for v in q.values()), 'quiz', len(keep), 'glossary')
