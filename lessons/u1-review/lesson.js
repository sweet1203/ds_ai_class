/* 01 맹목적 탐색 vs 정보 이용 탐색 (교과서 31~41쪽) */
sorter('kindGame',{
  cats:[{n:'🗺️ 맹목적 탐색',k:'#5b6776'},{n:'🧭 정보 이용 탐색',k:'#2f6fd0'}],
  items:[
    {t:'탐색 트리에서 갈 수 있는 길이 있는 한 앞으로 계속 전진하여 탐색한다.',short:'깊이 우선 탐색',c:0,ic:'⬇️',w:'깊이 우선 탐색은 맹목적 탐색이에요(32쪽).'},
    {t:'한 층을 내려가기 전에 그 층에 있는 모든 노드를 방문한다.',short:'너비 우선 탐색',c:0,ic:'↔️',w:'너비 우선 탐색도 맹목적 탐색이에요(34쪽).'},
    {t:'분기점에서 어떤 순서로 분기할지 미리 정해 두고 탐색한다.',short:'분기 순서를 미리 정함',c:0,ic:'🔢',w:'목표에 가까운지 따지지 않고 정해 둔 순서만 따라요.'},
    {t:'8-퍼즐에서 제 위치에 놓인 조각 수가 늘어나는 쪽으로만 이동한다.',short:'언덕 등반 탐색',c:1,ic:'⛰️',w:'평가 함숫값을 쓰는 언덕 등반 탐색이에요(36~37쪽).'},
    {t:'open 리스트에서 목표까지의 예측 시간이 가장 짧은 도시를 먼저 고른다.',short:'최상 우선 탐색',c:1,ic:'⭐',w:'평가 함숫값으로 고르는 최상 우선 탐색이에요(38~39쪽).'},
    {t:'지금까지 실제로 쓴 비용 g(n)과 남은 예상 비용 h(n)을 더해 고른다.',short:'A* 알고리즘',c:1,ic:'🅰️',w:'f(n) = g(n) + h(n)을 쓰는 A* 알고리즘이에요(40~41쪽).'},
  ],
  end:'두 갈래를 가르는 것은 <b>다음 노드를 고를 때 목표에 대한 정보(평가 함수)를 쓰느냐</b>예요.'
});

/* 02 틱택토 · 미니맥스 (○ = MAX 학생, ✕ = MIN 컴퓨터) */
(function(){
  const LN=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const SYM={O:'○',X:'✕'}, memo=new Map();
  let b, over, busy=false, gid=0;
  const res=s=>{for(const [a,c,d] of LN) if(s[a]&&s[a]===s[c]&&s[a]===s[d]) return s[a]; return s.includes('')?null:'draw';};
  function mm(s,turn){ /* ○ 입장의 값: +1 ○ 승, 0 무승부, -1 ✕ 승 */
    const k=s.join('')+turn; if(memo.has(k)) return memo.get(k);
    const w=res(s); let v;
    if(w==='O') v=1; else if(w==='X') v=-1; else if(w==='draw') v=0;
    else { const vs=[]; s.forEach((c,i)=>{ if(!c){ const t=s.slice(); t[i]=turn; vs.push(mm(t,turn==='O'?'X':'O')); } }); v=turn==='O'?Math.max(...vs):Math.min(...vs); }
    memo.set(k,v); return v;
  }
  const vals=turn=>b.map((c,i)=>{ if(c) return null; const t=b.slice(); t[i]=turn; return mm(t,turn==='O'?'X':'O'); });
  const fmt=v=>v>0?'+1':v<0?'−1':'0';
  function draw(turn,msg){
    const show=$('tttShow').checked&&!over, vs=show?vals(turn):[];
    $('tttBoard').innerHTML=b.map((c,i)=>`<button class="rv-cell ${c?'f':''}" data-i="${i}" ${c||over||busy?'disabled':''} aria-label="${i+1}번 칸">${c?SYM[c]:(show?`<small class="v ${vs[i]>0?'p':vs[i]<0?'m':''}">${fmt(vs[i])}</small>`:'')}</button>`).join('');
    $('tttBoard').querySelectorAll('.rv-cell').forEach(x=>x.onclick=()=>play(+x.dataset.i));
    if(msg!=null) $('tttMsg').innerHTML=msg;
  }
  function end(){
    const w=res(b); if(!w) return false; over=true;
    draw('O', w==='O'?'🎉 <b>○ 승리!</b>':w==='X'?'🤖 <b>✕ 승리.</b> 「컴퓨터의 생각 보기」를 켜고 다시 해 보세요. 값이 −1인 칸은 MIN이 최선을 다하면 ✕가 이기는 칸이에요.':'🤝 <b>무승부.</b> 서로 최선을 다하면 틱택토는 무승부가 돼요. 처음 빈 판에서 아홉 칸의 미니맥스 값이 모두 0인 까닭이에요. 미니맥스로 두는 컴퓨터는 지지 않으니, 내가 실수하지 않으면 무승부예요.');
    return true;
  }
  async function play(i){
    if(over||busy||b[i]) return;
    b[i]='O'; if(end()) return;
    busy=true; const g=gid; draw('X','🤖 MIN(✕) 차례: 값이 가장 <b>작은</b> 칸을 찾는 중…');
    await sleep($('tttShow').checked?1100:450);
    if(g!==gid) return; /* 기다리는 동안 새 게임을 시작했으면 두지 않음 */
    const vs=vals('X'), lo=Math.min(...vs.filter(v=>v!==null)), best=vs.map((v,j)=>v===lo?j:-1).filter(j=>j>=0);
    const j=best[Math.random()*best.length|0]; b[j]='X'; busy=false;
    if(end()) return;
    draw('O',`✕가 ${j+1}번 칸에 두었어요(미니맥스 값 ${fmt(lo)}). 이제 ○(MAX) 차례: 값이 가장 <b>큰</b> 칸이 나에게 유리해요.`);
  }
  function start(){ gid++; b=Array(9).fill(''); over=false; busy=false; draw('O','○(MAX) 차례예요. 원하는 칸을 눌러 두세요.'); }
  $('tttNew').onclick=start; $('tttShow').onchange=()=>draw(busy?'X':'O');
  start();
})();
chips('selfCheck','selfCheckPick',['탐색 방법별 차이점을 구분하고 설명할 수 있다','탐색 알고리즘을 이용하여 문제를 해결할 수 있다','인공지능 구현에서 탐색과 추론이 중요함을 인식하였다'],true);

/* 03 보충: 같은 트리를 깊이 우선 · 너비 우선으로 (교과서 49쪽 트리, 알파벳순) */
const TREE={A:['B','C'],B:['D','E'],C:['F','G'],D:['H','I'],F:['J']};
function dfsOrder(goal){ const out=[]; let found=false; (function go(n){ if(found) return; out.push(n); if(n===goal){found=true;return;} (TREE[n]||[]).forEach(go); })('A'); return out; }
function bfsOrder(goal){ const out=[], q=['A']; while(q.length){ const n=q.shift(); out.push(n); if(n===goal) break; q.push(...(TREE[n]||[])); } return out; }
(function(){
  const POS={A:[260,38],B:[150,108],C:[370,108],D:[90,180],E:[210,180],F:[330,180],G:[430,180],H:[50,252],I:[130,252],J:[330,252]};
  const NAME={dfs:'깊이 우선 탐색',bfs:'너비 우선 탐색'};
  const svg=el('svg',{viewBox:'0 0 520 290',role:'img','aria-label':'탐색 트리'},$('treeSvg'));
  const gE=el('g',{},svg), gN=el('g',{},svg), node={};
  for(const p in TREE) TREE[p].forEach(c=>el('line',{x1:POS[p][0],y1:POS[p][1],x2:POS[c][0],y2:POS[c][1],class:'rv-edge'},gE));
  for(const n in POS){
    const [x,y]=POS[n], g=el('g',{class:'rv-node'+(n==='E'?' goal':''),tabindex:'0',role:'button','aria-label':n+' 노드'},gN);
    el('circle',{cx:x,cy:y,r:20},g); el('text',{x,y,dy:'.35em','text-anchor':'middle'},g,n);
    const bd=el('g',{class:'bd'},g); el('circle',{cx:x+18,cy:y-17,r:10},bd); el('text',{x:x+18,y:y-17,dy:'.35em','text-anchor':'middle'},bd,'');
    g.addEventListener('click',()=>tap(n)); g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tap(n);}});
    node[n]=g;
  }
  el('text',{x:POS.A[0]+30,y:POS.A[1]+5,class:'rv-tag'},svg,'초기 상태');
  el('text',{x:POS.E[0],y:POS.E[1]+38,'text-anchor':'middle',class:'rv-tag g'},svg,'목표 상태');
  let mode='dfs', pos=0, wrong=0, seq=[];
  const res={dfs:MEMO.dfsOrder||null, bfs:MEMO.bfsOrder||null};
  function modeBtns(){
    $('treeMode').innerHTML=['dfs','bfs'].map(m=>`<button class="btn sm ${m===mode?'':'ghost'}" data-m="${m}">${NAME[m]}${res[m]?' ✓':''}</button>`).join('');
    $('treeMode').querySelectorAll('button').forEach(b=>b.onclick=()=>{mode=b.dataset.m; reset();});
  }
  function paint(){
    for(const n in node){ const k=seq.indexOf(n); node[n].classList.toggle('vis',k>=0); node[n].classList.remove('hint'); node[n].querySelector('.bd text').textContent=k>=0?k+1:''; }
    $('treeOrder').innerHTML=`<span class="rv-lab">${NAME[mode]} 방문 순서</span><b>${seq.length?seq.join(' - '):'A부터 눌러 보세요'}</b>`;
  }
  function reset(){ pos=0; wrong=0; seq=[]; modeBtns(); paint(); $('treeFb').innerHTML=mode==='dfs'?'한 갈래를 끝까지 내려간 뒤, 막다른 곳에서 되돌아가요.':'한 층(같은 깊이)을 왼쪽부터 모두 방문한 뒤 다음 층으로 내려가요.'; }
  function tap(n){
    const ans=mode==='dfs'?dfsOrder('E'):bfsOrder('E');
    if(pos>=ans.length) return;
    if(seq.includes(n)){ $('treeFb').innerHTML='이미 방문한 노드예요. 다음에 방문할 노드를 찾아요.'; return; }
    if(n!==ans[pos]){
      wrong++;
      $('treeFb').innerHTML=`<span class="ng">${n}는 아직 아니에요.</span> `+(mode==='dfs'?'방문하지 않은 자식 노드가 있으면 (알파벳순으로) 더 깊이 내려가고, 없으면 되돌아가 다른 갈래로 가요.':'지금 층에 아직 방문하지 않은 노드가 있으면 그것부터, 다 봤으면 다음 층의 왼쪽부터예요.');
      if(wrong>=2) node[ans[pos]].classList.add('hint');
      return;
    }
    seq.push(n); pos++; wrong=0; paint();
    if(n==='E'){
      const s=seq.join('-'); res[mode]=s;
      if(mode==='dfs') MEMO.dfsOrder=s; else MEMO.bfsOrder=s;
      store.set(MK,MEMO);
      $('treeFb').innerHTML=`<span class="ok">목표 E 도착! 탐색을 멈춰요.</span> ${seq.length}번째 방문에서 찾았어요.${res.dfs&&res.bfs?'':` 이제 ${NAME[mode==='dfs'?'bfs':'dfs']}도 해 보세요.`}`;
      modeBtns(); cmp();
    } else $('treeFb').innerHTML=`<span class="ok">좋아요.</span> 다음 노드는?`;
  }
  function cmp(){
    if(!(res.dfs&&res.bfs)){ $('treeCmp').innerHTML=''; return; }
    const d=res.dfs.split('-').length, b=res.bfs.split('-').length;
    $('treeCmp').innerHTML=`<div class="rv-cmp"><table><tr><th>방법</th><th class="l">방문 순서</th><th>E를 찾은 순서</th></tr>
      <tr><td>깊이 우선 탐색</td><td class="l"><b>${res.dfs}</b></td><td>${d}번째</td></tr><tr><td>너비 우선 탐색</td><td class="l"><b>${res.bfs}</b></td><td>${b}번째</td></tr></table>
      <p>같은 트리인데도 깊이 우선 탐색은 B 아래의 <b>D 갈래(H, I)를 끝까지</b> 본 다음 E로 가고, 너비 우선 탐색은 <b>같은 층의 B, C를 먼저</b> 본 다음 D, E로 내려가요. 이번에는 ${b<d?'너비 우선 탐색':'깊이 우선 탐색'}이 E를 먼저 찾았어요. 그런데 이 결과가 다른 목표에서도 같을까요? 아래에서 목표를 바꿔 확인해 보세요.</p></div>`;
  }
  /* 목표 바꾸기 */
  let goal='E';
  const LV={A:0,B:1,C:1,D:2,E:2,F:2,G:2,H:3,I:3,J:3};
  function goalDraw(){
    $('goalPick').innerHTML='목표 노드: '+'BCDEFGHIJ'.split('').map(n=>`<button class="rv-gbtn ${n===goal?'on':''}" data-n="${n}">${n}</button>`).join('');
    $('goalPick').querySelectorAll('button').forEach(b=>b.onclick=()=>{goal=b.dataset.n; goalDraw();});
    const d=dfsOrder(goal), b=bfsOrder(goal), w=d.length<b.length?'d':b.length<d.length?'b':'';
    $('goalCmp').innerHTML=`<table class="rv-gt"><tr><th>방법</th><th class="l">목표 ${goal}까지 방문 순서</th><th>몇 번째</th></tr>
      <tr class="${w==='d'?'win':''}"><td>깊이 우선 탐색</td><td class="l">${d.join(' - ')}</td><td>${d.length}번째</td></tr>
      <tr class="${w==='b'?'win':''}"><td>너비 우선 탐색</td><td class="l">${b.join(' - ')}</td><td>${b.length}번째</td></tr></table>
      <p class="note">목표 ${goal}의 깊이(레벨): ${LV[goal]} · ${w==='d'?'깊이 우선 탐색이 먼저 찾았어요.':w==='b'?'너비 우선 탐색이 먼저 찾았어요.':'두 방법이 같은 순서에 찾았어요.'}</p>`;
  }
  $('treeReset').onclick=reset;
  reset(); cmp(); goalDraw();
})();

/* 04 심화: 술어 논리 고르기 (교과서 49쪽) */
(function(){
  const IT=[
    {s:'모든 사자는 포유류이다.',o:['∃x {lion(x) ∧ mammal(x)}','∀x {lion(x) → mammal(x)}','∀x {mammal(x) → lion(x)}'],a:1,w:'「모든」이므로 ∀x, 「x가 사자이면 x는 포유류이다」로 읽어요. 화살표를 거꾸로 하면 「모든 포유류는 사자이다」가 돼요.'},
    {s:'심바는 사자이다.',o:['lion(심바)','∀x lion(x)','lion(x)'],a:0,w:'특정한 하나(심바)에 대한 사실이라 한정자 없이 술어에 심바를 넣어요.'},
    {s:'어떤 사자는 초원에 산다.',o:['∀x {lion(x) → livemeadow(x)}','livemeadow(사자)','∃x {lion(x) ∧ livemeadow(x)}'],a:2,w:'「어떤」이므로 ∃x예요. 「사자이면서 초원에 사는 x가 적어도 한 개 있다」는 뜻이라 ∧로 이어요.'},
    {s:'허생원은 동이의 아빠이다.',o:['father(동이, 허생원)','father(허생원, 동이)','∀x father(x)'],a:1,w:'교과서 예시 답안처럼 father(허생원, 동이)로 써요. 대상이 둘인 술어는 순서를 정해 두고 지켜야 해요.'},
  ];
  const B=$('predGame'); let i=0, ok=0;
  function show(){
    if(i>=IT.length){
      B.innerHTML=`<div class="rv-end">🎉 ${IT.length}문장 중 <b>${ok}개</b>를 바로 맞혔어요.<div style="overflow-x:auto"><table class="rv-gt" style="margin-top:8px"><tr><th class="l">문장</th><th class="l">술어 논리</th></tr>${IT.map(t=>`<tr><td class="l">${t.s}</td><td class="l mono2">${t.o[t.a]}</td></tr>`).join('')}</table></div><p style="margin-bottom:0">첫째 식과 둘째 식을 맞대면 <span class="mono">mammal(심바)</span>, 곧 「심바는 포유류이다」라는 <b>새로운 사실</b>을 추론할 수 있어요.</p><button class="btn ghost sm" id="predAgain">처음부터 다시</button></div>`;
      $('predAgain').onclick=()=>{i=0;ok=0;show();}; return;
    }
    const t=IT[i], ord=shuffle(t.o.map((_,j)=>j)); let first=true;
    B.innerHTML=`<div class="rv-pq"><div class="cnt">${i+1} / ${IT.length}</div><div class="s">「${t.s}」</div><div class="opts">${ord.map(j=>`<button class="rv-opt" data-j="${j}">${t.o[j]}</button>`).join('')}</div><div class="rv-fb"></div><div class="row nx"></div></div>`;
    B.querySelectorAll('.rv-opt').forEach(b=>b.onclick=()=>{
      const j=+b.dataset.j, f=B.querySelector('.rv-fb');
      if(j===t.a){ if(first) ok++; B.querySelectorAll('.rv-opt').forEach(x=>x.disabled=true); b.classList.add('right'); f.innerHTML='<span class="ok">맞아요!</span> '+t.w;
        const nx=B.querySelector('.nx'); nx.innerHTML='<button class="btn sm">다음 →</button>'; nx.firstChild.onclick=()=>{i++;show();}; nx.firstChild.focus(); }
      else { first=false; b.classList.add('wrong'); b.disabled=true; f.innerHTML='<span class="ng">다시 생각해 봐요.</span> 「모든」인지 「어떤」인지, 특정한 하나인지 살펴봐요.'; }
    });
  }
  show();
})();

/* 05 협력적 창의·융합 활동: 주차장 탈출 (교과서 50쪽 그림) */
const PARK=(function(){
  /* o: h 가로(p = 왼쪽 칸), v 세로(p = 위쪽 칸) · f: 고정된 행(h) 또는 열(v) · +는 오른쪽·위쪽 */
  const CARS=[
    {id:'Y',o:'h',f:0,L:3,s:1,c:'#f0b542'},{id:'G',o:'h',f:0,L:2,s:4,c:'#6ab04c'},{id:'H',o:'h',f:2,L:2,s:0,c:'#c77dd1',t:'♥'},
    {id:'B',o:'v',f:2,L:2,s:2,c:'#4a86d4'},{id:'I',o:'v',f:5,L:2,s:2,c:'#f2d9ad'},{id:'P',o:'v',f:5,L:2,s:4,c:'#7d4fa8'},{id:'R',o:'h',f:4,L:3,s:0,c:'#e5534b'}];
  const NM=id=>id==='H'?'♥':id;
  const cells=(i,p)=>{const c=CARS[i]; return Array.from({length:c.L},(_,k)=>c.o==='h'?[c.f,p+k]:[p+k,c.f]);};
  function free(st,i,p){
    const c=CARS[i], hi=c.id==='H'?4:6-c.L;
    if(p<0||p>hi) return false;
    const occ=new Set(); st.forEach((q,j)=>{ if(j!==i) cells(j,q).forEach(([r,cc])=>occ.add(r+','+cc)); });
    return cells(i,p).every(([r,cc])=>!occ.has(r+','+cc));
  }
  const step=(i,d)=>CARS[i].o==='h'?d:-d;   /* d=+1 전진(오른쪽·위쪽) */
  function moves(st){
    const out=[];
    st.forEach((p,i)=>[1,-1].forEach(d=>{ let q=p, k=0; while(free(st,i,q+step(i,d))){ q+=step(i,d); k++; const t=st.slice(); t[i]=q; out.push([CARS[i].id,d*k,t]); } }));
    return out;
  }
  const isGoal=st=>st[2]>=4;
  const key=s=>s.join(',');
  /* 같은 자동차를 잇달아 움직인 것은 한 번의 이동으로 묶어 적기(움직인 기록과 같은 방식) */
  const merge=path=>path.reduce((o,[id,d])=>{ const l=o[o.length-1]; if(l&&l[0]===id) l[1]+=d; else o.push([id,d]); return o; },[]);
  const toExit=path=>{ const e=path[path.length-1]; if(e&&e[0]==='H') e[1]+=2; return path; }; /* ♥가 출구에 닿은 뒤 밖으로 나가는 칸까지(교과서 표기) */
  function solve(kind){
    const st0=CARS.map(c=>c.s);
    if(kind==='dfs'){ /* 갈 수 있는 데까지 내려가고, 막히면 되돌아와 다음 갈래로 · 한 번 본 판은 다시 펼치지 않음 */
      const seen=new Set(); let n=0;
      const go=s=>{ seen.add(key(s)); n++; if(isGoal(s)) return []; for(const [id,d,t] of moves(s)){ if(seen.has(key(t))) continue; const r=go(t); if(r) return [[id,d],...r]; } return null; };
      const path=go(st0); return path&&{n,path:toExit(merge(path))};
    }
    /* 너비 우선: 살펴볼 판을 큐에 넣고 먼저 들어온 판부터 꺼냄 */
    const par=new Map([[key(st0),null]]), q=[st0]; let n=0;
    while(q.length){
      const s=q.shift(); n++;
      if(isGoal(s)){ const path=[]; let k=key(s); while(par.get(k)){ const [m,pk]=par.get(k); path.unshift(m); k=pk; } return {n,path:toExit(merge(path))}; }
      moves(s).forEach(([id,d,t])=>{ const k=key(t); if(!par.has(k)){ par.set(k,[[id,d],key(s)]); q.push(t); } });
    }
    return null;
  }
  /* 판 그리기와 직접 움직이기 */
  let st, sel, log, hist, out, playing=false;
  const lot=$('parkBoard');
  lot.innerHTML='<div class="rv-exit">출구</div>'+CARS.map((c,i)=>`<button class="rv-car" data-i="${i}" style="--c:${c.c};color:${c.id==='I'?'#6b5530':'#fff'};${c.o==='h'?`width:calc(${c.L} * var(--u) - 6px);height:calc(var(--u) - 6px)`:`width:calc(var(--u) - 6px);height:calc(${c.L} * var(--u) - 6px)`}" aria-label="${NM(c.id)} 자동차">${c.t||c.id}</button>`).join('');
  const carEl=[...lot.querySelectorAll('.rv-car')];
  carEl.forEach(b=>b.onclick=()=>{ if(out||playing) return; sel=+b.dataset.i; draw(); });
  function place(){ carEl.forEach((b,i)=>{ const c=CARS[i], p=st[i]; b.style.left=`calc(${c.o==='h'?p:c.f} * var(--u) + 3px)`; b.style.top=`calc(${c.o==='h'?c.f:p} * var(--u) + 3px)`; b.classList.toggle('on',i===sel); b.classList.toggle('gone',out&&c.id==='H'); }); }
  const fmtLog=l=>l.length?l.map(([id,d])=>`(${NM(id)},${d>0?d:'−'+(-d)})`).join(' → '):'(아직 움직이지 않았어요)';
  function draw(msg){
    place();
    $('parkLog').innerHTML=`<b>${log.length}번 이동</b><div class="mono2">${fmtLog(log)}</div>`;
    const c=sel!=null?CARS[sel]:null, can=d=>c&&!out&&!playing&&free(st,sel,st[sel]+step(sel,d));
    const lab=c?(c.o==='h'?[['◀ 후진 (−)',-1],['전진 (+) ▶',1]]:[['▲ 전진 (+)',1],['▼ 후진 (−)',-1]]):[];
    $('parkCtl').innerHTML=(c?`<span class="rv-lab" style="margin:0">${NM(c.id)} 자동차</span>`+lab.map(([t,d])=>`<button class="btn sm" data-d="${d}" ${can(d)?'':'disabled'}>${t}</button>`).join(''):'<span class="muted" style="font-size:.9rem">움직일 자동차를 눌러 고르세요.</span>')+
      `<button class="btn sm ghost" id="parkUndo" ${hist.length&&!playing?'':'disabled'}>되돌리기</button><button class="btn sm ghost" id="parkReset" ${playing?'disabled':''}>처음부터</button>`;
    $('parkCtl').querySelectorAll('button[data-d]').forEach(b=>b.onclick=()=>move(sel,+b.dataset.d,1));
    $('parkUndo').onclick=()=>{ const h=hist.pop(); st=h.st; log=h.log; out=false; draw(''); };
    $('parkReset').onclick=()=>reset();
    if(msg!=null) $('parkMsg').innerHTML=msg;
  }
  function move(i,d,k){ /* 자동차 i를 d 방향으로 k칸 */
    hist.push({st:st.slice(),log:log.map(x=>x.slice())});
    st[i]+=step(i,d)*k;
    const id=CARS[i].id, last=log[log.length-1];
    if(last&&last[0]===id){ last[1]+=d*k; if(!last[1]) log.pop(); } else log.push([id,d*k]);
    if(isGoal(st)){ const e=log[log.length-1]; e[1]+=6-st[2]; st[2]=6; out=true; sel=null;
      draw(`🎉 <b>${log.length}번 이동</b>으로 ♥ 자동차가 출구로 나갔어요! 교과서 예시 답안은 11번 이동이에요. 아래에서 컴퓨터는 몇 번 만에 찾는지 비교해 보세요.`); return; }
    draw('');
  }
  function reset(){ st=CARS.map(c=>c.s); sel=null; log=[]; hist=[]; out=false; draw('♥ 자동차가 출구(오른쪽)로 나가려면 어떤 자동차를 먼저 움직여야 할까요? 모둠이 함께 해 보세요.'); }
  async function replay(path,label){
    if(log.length&&!out&&!confirm('모둠이 움직인 기록이 지워지고 판이 처음 상태로 돌아가요. 컴퓨터의 답을 따라가 볼까요?')) return;
    reset(); playing=true; draw(`🤖 ${label}이 찾은 답을 따라가는 중…`);
    const ms=path.length>20?160:650;
    for(const [id,d] of path){ await sleep(ms); const i=CARS.findIndex(c=>c.id===id); playing=false; move(i,d>0?1:-1,Math.abs(d)); playing=true; draw(); }
    playing=false; draw(`🤖 ${label}이 찾은 답: <b>${log.length}번 이동</b>`);
  }
  const R={};
  function showSolve(kind){
    R[kind]=R[kind]||solve(kind);
    const row=k=>R[k]?`<tr><td>${k==='dfs'?'깊이 우선 탐색':'너비 우선 탐색'}</td><td><b>${R[k].path.length}번</b></td><td>${R[k].n}개</td><td><button class="btn sm ghost" data-k="${k}">답 따라가 보기</button></td></tr><tr class="sub"><td colspan="4" class="l mono2">${fmtLog(R[k].path)}</td></tr>`:'';
    let h=`<table class="rv-gt" style="margin-top:10px"><tr><th>방법</th><th>찾은 답의 이동 횟수</th><th>목표를 찾을 때까지 살펴본 판</th><th></th></tr>${row('dfs')}${row('bfs')}</table>`;
    if(R.dfs&&R.bfs) h+=`<div class="rv-end">깊이 우선 탐색은 한 갈래를 갈 수 있는 데까지 파고들고 막히면 되돌아와 <b>${R.dfs.n}개의 판</b>을 보고 답을 찾았지만, 찾은 답은 <b>${R.dfs.path.length}번이나 움직이는 긴 답</b>이에요. 너비 우선 탐색은 1번 이동한 판, 2번 이동한 판… 순으로 한 층씩 보며 <b>${R.bfs.n}개의 판</b>을 살폈고, <b>가장 적은 이동(${R.bfs.path.length}번)</b>으로 가는 답을 찾았어요. 교과서도 깊이 우선 탐색은 경우에 따라 더 간단한 경로를 놓치고 복잡한 경로를 제시할 수도 있다고 해요.</div>`;
    $('solveOut').innerHTML=h;
    $('solveOut').querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>{ if(!playing){ replay(R[b.dataset.k].path,b.dataset.k==='dfs'?'깊이 우선 탐색':'너비 우선 탐색'); lot.scrollIntoView({behavior:'smooth',block:'center'}); } });
  }
  $('solveDfs').onclick=()=>showSolve('dfs'); $('solveBfs').onclick=()=>showSolve('bfs');
  reset();
  return {solve};
})();

const MEMOLIST=[['diffMemo','맹목적 탐색과 정보 이용 탐색의 차이'],['selfCheckPick','내 실력 점검: 「예」라고 답한 것'],['dfsOrder','깊이 우선 탐색 방문 순서(목표 E)'],['bfsOrder','너비 우선 탐색 방문 순서(목표 E)'],['orderMemo','방문 순서가 다른 까닭 · 먼저 찾은 쪽'],['myPred','심화: 내가 만든 문장과 술어 논리'],['parkPlan','모둠의 문제 정의와 해결 방안'],['fitMemo','깊이 우선 · 너비 우선 탐색이 알맞은 상황']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
