#!/usr/bin/env python3
"""2026-2 ai-worksheets 의 한 장짜리 코스웨어(index.html)를 lessons/<차시ID>/ 파일로 나눈다(이식용, 한 번 쓰는 도구).
    python3 tools/split_legacy.py <원본 index.html> <차시ID> "<제목>"
"""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
src, lid, title = pathlib.Path(sys.argv[1]), sys.argv[2], sys.argv[3]
s = src.read_text(encoding='utf-8')
o = ROOT / 'lessons' / lid; o.mkdir(parents=True, exist_ok=True)
base = (ROOT / 'framework' / 'base.css').read_text(encoding='utf-8')
css = s[s.index('<style>') + len('<style>\n'):s.index('</style>')]
if css.startswith(base): css = css[len(base):]
main = s[s.index('<main id="main">') + len('<main id="main">'):s.index('</main>')].strip('\n') + '\n'
i = s.index('<script>\n') + len('<script>\n'); js = s[i:s.index('</script>', i)]
q0 = js.index('/* 퀴즈 */'); qk = js.index('const QK')
head_std = (ROOT / 'framework' / 'core_head.js').read_text(encoding='utf-8')
pre = js[:q0]
std_lines = set(l.strip() for l in head_std.splitlines() if l.strip())
pre_extra = '\n'.join(l for l in pre.splitlines() if l.strip() and l.strip() not in std_lines)
quiz = js[q0:qk]
k = js.index("$('quizReset').onclick"); b = js.index('\n', k) + 1
les = js[b:]
cut = les.rfind('updScore();')
les = les[:cut].rstrip() + '\n'
les = re.sub(r'\n/\* 시작 \*/\s*$', '\n', les)
(o / 'screens.html').write_text(main, encoding='utf-8')
(o / 'quiz.js').write_text(quiz, encoding='utf-8')
(o / 'lesson.js').write_text(les, encoding='utf-8')
(o / 'lesson.css').write_text(css, encoding='utf-8')
if pre_extra.strip(): (o / 'pre.js').write_text(pre_extra + '\n', encoding='utf-8')
(o / 'lesson.json').write_text(json.dumps({'title': title, 'source': str(src.relative_to(src.parents[1]))}, ensure_ascii=False), encoding='utf-8')
print(lid, {p.name: p.stat().st_size for p in o.iterdir()})
