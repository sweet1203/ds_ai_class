/* 공통: 부모-자식 목록으로 탐색 트리 SVG 만들기
   nodes: [{id, p(부모 id, 루트는 null), label, cls, edge(링크 위 작은 글씨)}], 첫 노드가 루트 */
function bsTreeSVG(nodes,o){
  o=o||{};
  const W=o.nw||74,H=o.nh||28,GX=o.gx||10,GY=o.gy||30;
  const kids={},pos={}; nodes.forEach(n=>kids[n.id]=[]); nodes.forEach(n=>{if(n.p!=null&&kids[n.p]) kids[n.p].push(n.id);});
  let leaf=0,maxD=0;
  (function lay(id,d){maxD=Math.max(maxD,d); const k=kids[id]; if(!k.length){pos[id]={x:leaf++,d}; return;} k.forEach(c=>lay(c,d+1)); pos[id]={x:(pos[k[0]].x+pos[k[k.length-1]].x)/2,d};})(nodes[0].id,0);
  const cw=W+GX,ch=H+GY,vw=Math.max(leaf*cw,o.minW||0),off=(vw-leaf*cw)/2,vh=(maxD+1)*ch-GY+12;
  const X=id=>off+pos[id].x*cw+cw/2, Y=id=>6+pos[id].d*ch;
  let s='';
  nodes.forEach(n=>{ if(n.p==null) return; const x1=X(n.p),y1=Y(n.p)+H,x2=X(n.id),y2=Y(n.id);
    s+=`<line class="e" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    if(n.edge) s+=`<text class="el" x="${(x1+x2)/2}" y="${(y1+y2)/2+4}">${n.edge}</text>`; });
  nodes.forEach(n=>{ s+=`<g class="n ${n.cls||''}" data-id="${n.id}" transform="translate(${X(n.id)-W/2} ${Y(n.id)})">`
    +(o.draw?o.draw(n,W,H):`<rect width="${W}" height="${H}" rx="8"/><text x="${W/2}" y="${H/2+5}">${n.label}</text>`)+`<title>${n.tip||n.label||''}</title></g>`; });
  return `<svg viewBox="0 0 ${vw} ${vh}" style="max-width:${Math.round(vw*(o.scale||1.2))}px" class="bs-tree" role="img" aria-label="탐색 트리">${s}</svg>`;
}

/* 01 4-queen: 1행부터 한 행에 하나씩, 놓은 상태가 탐색 트리로 자람 */
(function(){
  const B=$('qGame'); let nodes,cur,backs,keyOf;
  const safe=(q,col)=>q.every((c,r)=>c!==col&&Math.abs(c-col)!==q.length-r);
  const okCols=q=>[0,1,2,3].filter(c=>safe(q,c));
  const status=n=>n.q.length===4?'goal':okCols(n.q).length?'':'bad';
  const mini=(n,W,H)=>{ let s=`<rect class="bg" width="${W}" height="${H}" rx="5"/>`;
    for(let r=0;r<4;r++) for(let c=0;c<4;c++) s+=`<rect x="${1+c*8}" y="${1+r*8}" width="8" height="8" class="${(r+c)%2?'d':'l'}"/>`;
    n.q.forEach((c,r)=>{s+=`<circle cx="${5+c*8}" cy="${5+r*8}" r="3" class="qq"/>`;}); return s; };
  function reset(){ nodes=[{id:0,p:null,q:[]}]; keyOf={'':0}; cur=0; backs=0; draw('1행의 네 칸 중 하나를 눌러 첫 번째 퀸을 놓아 보세요.'); }
  function place(col){
    const q=[...nodes[cur].q,col], k=q.join(',');
    if(keyOf[k]!=null) cur=keyOf[k]; else { const id=nodes.length; nodes.push({id,p:cur,q}); keyOf[k]=id; cur=id; }
    const st=status(nodes[cur]);
    if(st==='goal') draw(`🎉 <b>목표 상태!</b> 퀸 4개가 서로 공격하지 않아요. 해답 하나를 찾았으니 여기까지예요. (시간이 남으면 다른 해답도 찾아보세요.)`);
    else if(st==='bad') draw(`<b>막다른 길!</b> ${q.length+1}행에는 공격받지 않는 칸이 없어요. 「한 단계 되돌아가기」로 이전 행의 퀸을 다른 칸에 놓아 보세요.`);
    else draw(`${q.length+1}행에서 공격받지 않는 칸(✕가 없는 칸)에 퀸을 놓아요.`);
  }
  function back(){ if(nodes[cur].p==null) return; cur=nodes[cur].p; backs++; draw(`${nodes[cur].q.length+1}행으로 되돌아왔어요. 아직 가 보지 않은 칸을 골라 보세요. 트리의 판을 눌러 그 상태로 옮겨 갈 수도 있어요.`); }
  function draw(msg){
    const q=nodes[cur].q, row=q.length, ok=okCols(q); let g='';
    for(let r=0;r<4;r++) for(let c=0;c<4;c++){
      const isRow=r===row&&row<4, can=isRow&&ok.includes(c), att=isRow&&!can;
      g+=`<button class="qc${(r+c)%2?' d':''}${isRow?' now':''}${att?' att':''}" data-c="${c}" ${can?'':'disabled'} aria-label="${r+1}행 ${c+1}열">${q[r]===c?'♛':att?'✕':''}</button>`;
    }
    const goals=nodes.filter(n=>n.q.length===4).length;
    const tree=bsTreeSVG(nodes.map(n=>({id:n.id,p:n.p,q:n.q,cls:status(n)+(n.id===cur?' cur':''),tip:n.q.length?n.q.map((c,r)=>`${r+1}행 ${c+1}열`).join(', '):'빈 체스판(초기 상태)'})),{nw:34,nh:34,gx:10,gy:22,draw:mini,scale:1.5});
    B.innerHTML=`<div class="q-wrap"><div><div class="q-board">${g}</div><div class="row" style="margin-top:8px"><button class="btn sm ghost" data-k="back" ${cur?'':'disabled'}>↩ 한 단계 되돌아가기</button><button class="btn sm ghost" data-k="reset">처음부터</button></div></div>
      <div class="q-side"><div class="q-msg">${msg}</div><div class="q-stat">만든 상태(노드) <b>${nodes.length}</b>개 · 되돌아가기 <b>${backs}</b>번 · 찾은 해답 <b>${goals}</b>개</div>
      <div class="q-tree">${tree}</div><small class="muted">내가 놓아 본 순서대로 자라는 탐색 트리예요. 맨 위가 빈 체스판(초기 상태), 빨간 판은 막다른 길, 금색 판은 목표 상태예요.</small></div></div>`;
    B.querySelectorAll('.qc').forEach(b=>b.onclick=()=>place(+b.dataset.c));
    B.querySelector('[data-k="back"]').onclick=back; B.querySelector('[data-k="reset"]').onclick=reset;
    B.querySelectorAll('.q-tree g.n').forEach(n=>n.onclick=()=>{const id=+n.dataset.id; if(id===cur) return; cur=id; draw('트리에서 고른 상태로 옮겨 왔어요. 다른 칸을 골라 보세요.');});
  }
  reset();
})();

/* 02 DFS·BFS 한 단계씩 (그림 Ⅰ-10·Ⅰ-12의 트리, 교과서 코드의 딕셔너리와 같은 모양) */
(function(){
  const T={A:['B','C','D'],B:['E'],C:['F'],D:['G','H'],E:['I','J'],F:[],G:[],H:['K'],I:[],J:[],K:[]};
  const P={}; for(const k in T) T[k].forEach(c=>P[c]=k);
  const XY={A:[320,32],B:[130,108],C:[320,108],D:[510,108],E:[130,184],F:[320,184],G:[450,184],H:[570,184],I:[75,260],J:[185,260],K:[570,260]};
  const B=$('tvGame'); let mode='dfs', goal='K', ev=[], step=0, timer=null;
  function dfs(g){ const ev=[],seen=new Set(),path=[]; let found=false;
    (function rec(n){
      const prev=ev.length?ev[ev.length-1].n:null; seen.add(n); path.push(n);
      const pend=[]; for(let i=path.length-1;i>=0;i--) T[path[i]].forEach(c=>{if(!seen.has(c)) pend.push(c);});
      let msg=!prev?'루트 노드 A에서 시작해요. 자식 노드 B, C, D 중 왼쪽 B부터 깊게 들어가요.'
        :P[n]===prev?`${prev}의 자식 노드 ${n}로 더 깊이 들어가요.`
        :`${prev}에서는 더 갈 곳이 없어요(막다른 길). 다른 길이 남은 분기점 <b>${P[n]}</b>까지 되돌아가 ${n}를 탐색해요.`;
      if(n===g){found=true; msg+=` <b class="ok">목표 노드 ${n}를 찾았어요!</b>`;}
      ev.push({n,order:[...seen],path:[...path],list:pend,msg});
      if(found) return;
      for(const c of T[n]){ if(found) return; if(!seen.has(c)) rec(c); }
      path.pop();
    })('A'); return ev; }
  function bfs(g){ const ev=[],seen=new Set(['A']),q=['A'],order=[];
    while(q.length){ const n=q.shift(); order.push(n); const add=T[n].filter(c=>!seen.has(c)); add.forEach(c=>{seen.add(c); q.push(c);});
      let msg=(n==='A'?'루트 노드 A를 방문해요.':`큐 맨 앞의 ${n}를 꺼내 방문해요.`)+(add.length?` 자식 노드 ${add.join(', ')}를 큐 뒤에 넣어요.`:' 자식 노드가 없어 큐에 넣을 것이 없어요.');
      const hit=n===g; if(hit) msg+=` <b class="ok">목표 노드 ${n}를 찾았어요!</b>`;
      ev.push({n,order:[...order],path:[],list:[...q],msg}); if(hit) break; }
    return ev; }
  B.innerHTML=`<div class="tv-top"><div class="tv-mode"><button data-m="dfs">⬇️ 깊이 우선 탐색</button><button data-m="bfs">➡️ 너비 우선 탐색</button></div>
    <div class="tv-goal"><span>목표 노드</span>${Object.keys(T).slice(1).map(k=>`<button data-g="${k}">${k}</button>`).join('')}</div></div>
    <div class="tv-main"><div class="tv-svg"></div><div class="tv-side"><div class="tv-msg"></div><div class="tv-row"><span>방문 순서</span><div class="tv-order"></div></div><div class="tv-row"><span class="tv-lt"></span><div class="tv-list"></div></div>
    <div class="row" style="margin-top:10px"><button class="btn sm" data-k="step">한 단계 ▶</button><button class="btn sm ghost" data-k="auto">자동 재생</button><button class="btn sm ghost" data-k="reset">처음부터</button></div></div></div>
    <div class="tv-cmp"></div>`;
  const q=s=>B.querySelector(s);
  function build(){ stop(); ev=mode==='dfs'?dfs(goal):bfs(goal); step=0; render(); }
  function render(){
    B.querySelectorAll('.tv-mode button').forEach(b=>b.classList.toggle('on',b.dataset.m===mode));
    B.querySelectorAll('.tv-goal button').forEach(b=>b.classList.toggle('on',b.dataset.g===goal));
    const e=step?ev[step-1]:null, order=e?e.order:[], list=e?e.list:['A'];
    let s='';
    for(const k in T) T[k].forEach(c=>{const on=order.includes(c)&&order.includes(k); s+=`<line class="e${on?' on':''}" x1="${XY[k][0]}" y1="${XY[k][1]}" x2="${XY[c][0]}" y2="${XY[c][1]}"/>`;});
    for(const k in XY){ const i=order.indexOf(k), [x,y]=XY[k];
      const cls=[i>=0?'vis':'', e&&e.n===k?'cur':'', list.includes(k)?'wait':'', k===goal?'goal':''].join(' ');
      s+=`<g class="tn ${cls}"><circle cx="${x}" cy="${y}" r="22"/><text x="${x}" y="${y+6}">${k}</text>`
        +(i>=0?`<circle class="bd" cx="${x+20}" cy="${y-18}" r="11"/><text class="bdt" x="${x+20}" y="${y-14}">${i+1}</text>`:'')
        +(k===goal?`<text class="gl" x="${x}" y="${y+40}">목표</text>`:'')+`</g>`; }
    q('.tv-svg').innerHTML=`<svg viewBox="0 0 640 310" role="img" aria-label="그림 Ⅰ-10 트리">${s}</svg>`;
    q('.tv-msg').innerHTML=e?e.msg:(mode==='dfs'?'<b>깊이 우선 탐색</b>: 갈 수 있는 길이 있는 한 앞으로 계속 전진해요. 「한 단계」를 눌러 시작하세요.':'<b>너비 우선 탐색</b>: 같은 깊이의 노드를 먼저 다 확인해요. 「한 단계」를 눌러 시작하세요.');
    q('.tv-order').innerHTML=order.length?order.map(k=>`<i>${k}</i>`).join('<em>→</em>'):'<span class="muted">아직 없음</span>';
    q('.tv-lt').innerHTML=mode==='dfs'?'아직 가 보지 않은 길<small>가장 최근 분기점부터</small>':'큐<small>앞에서 꺼내고 뒤에 넣어요</small>';
    q('.tv-list').innerHTML=(mode==='dfs'&&e?`<div class="muted" style="font-size:.85rem">지금 내려온 길: ${e.path.join(' › ')}</div>`:'')+(list.length?list.map(k=>`<i class="w">${k}</i>`).join(''):'<span class="muted">비어 있음</span>');
    const end=step>=ev.length; q('[data-k="step"]').disabled=end; q('[data-k="auto"]').disabled=end;
    if(end){ const d=dfs(goal).length, b=bfs(goal).length;
      q('.tv-cmp').innerHTML=`목표 노드가 <b>${goal}</b>일 때 · 깊이 우선 탐색은 <b>${d}번째</b>, 너비 우선 탐색은 <b>${b}번째</b> 방문에서 찾아요. ${d===b?'이번에는 같네요.':d<b?'이번에는 깊이 우선 탐색이 먼저 찾았어요.':'이번에는 너비 우선 탐색이 먼저 찾았어요.'} 목표 노드를 바꿔 보세요.`;
      q('.tv-cmp').classList.add('on'); } else { q('.tv-cmp').classList.remove('on'); q('.tv-cmp').innerHTML=''; }
  }
  function stop(){ if(timer){clearInterval(timer); timer=null;} const a=q('[data-k="auto"]'); if(a) a.textContent='자동 재생'; }
  q('[data-k="step"]').onclick=()=>{ if(step<ev.length){step++; render();} };
  q('[data-k="auto"]').onclick=()=>{ if(timer){stop(); return;} q('[data-k="auto"]').textContent='멈춤'; timer=setInterval(()=>{ if(step>=ev.length){stop(); return;} step++; render(); },900); };
  q('[data-k="reset"]').onclick=build;
  B.querySelectorAll('.tv-mode button').forEach(b=>b.onclick=()=>{mode=b.dataset.m; build();});
  B.querySelectorAll('.tv-goal button').forEach(b=>b.onclick=()=>{goal=b.dataset.g; build();});
  build();
})();

/* 03 강 건너기: 직접 옮기기 + 교과서 탐색 트리(그림 Ⅰ-11·Ⅰ-13)와 비교 */
const RIVER=(function(){
  const NAME={f:'농부',s:'양',w:'늑대',c:'양배추'}, OBJ={s:'양을',w:'늑대를',c:'양배추를'}, IC={f:'🧑‍🌾',s:'🐑',w:'🐺',c:'🥬'}, ORD=['f','c','s','w'];
  const key=p=>ORD.filter(k=>!p[k]).join('')+'|'+ORD.filter(k=>p[k]).join('');
  const show=k=>k.replace('|',' | ').trim();
  function danger(p){ for(const side of [0,1]){ if(p.f===side) continue; const bank=side?'동쪽':'서쪽';
    if(p.s===side&&p.w===side) return {side,t:`${bank} 둑에 양과 늑대가 남아 늑대가 양을 잡아먹어요`};
    if(p.s===side&&p.c===side) return {side,t:`${bank} 둑에 양과 양배추가 남아 양이 양배추를 먹어요`}; } return null; }
  const B=$('rvGame'); let P,hist,safeP,bad,log,visited,trans,st,onChange=()=>{};
  function reset(){ P={f:0,s:0,w:0,c:0}; hist=[]; safeP=null; bad=null; log=[]; visited=new Set([key(P)]); trans=new Set(); st={mv:0,bad:0,back:0}; draw(); onChange(); }
  const goal=()=>P.f&&P.s&&P.w&&P.c;
  function move(x){
    if(bad||goal()||P[x]!==P.f) return;
    const n={...P}; n.f=1-n.f; if(x!=='f') n[x]=1-n[x];
    const go=P.f===0, act=x==='f'?(go?'농부만 건넌다':'농부만 되돌아간다'):(go?`${OBJ[x]} 옮긴다`:`${OBJ[x]} 데리고 되돌아간다`);
    const k=key(n), d=danger(n); st.mv++; trans.add(key(P)+'>'+k);
    if(d){ safeP=P; P=n; bad=d; st.bad++; visited.add(k); log.push([act,show(k),'✗ 금지 상태','ng']); }
    else { const again=visited.has(k); visited.add(k); hist.push(P); P=n;
      log.push([act,show(k),goal()?'🎉 목표 상태':again?'↺ 이미 나온 상태':'○',goal()?'ok':'']); }
    draw(); onChange();
  }
  function back(){
    if(bad){ P=safeP; bad=null; } else if(hist.length){ P=hist.pop(); } else return;
    st.back++; log.push(['되돌아가기',show(key(P)),'↩ 되돌아감','bk']); draw(); onChange();
  }
  function bankHTML(side){ const ks=['f','s','w','c'].filter(k=>P[k]===side); const red=bad&&bad.side===side;
    return `<div class="rv-bank${red?' bad':''}"><h5>${side?'동쪽 둑 (목표)':'서쪽 둑 (출발)'}</h5><div class="rv-pcs">${ks.map(k=>`<span class="pc"><i>${IC[k]}</i>${NAME[k]}</span>`).join('')||'<span class="muted">비어 있음</span>'}</div></div>`; }
  function draw(){
    const g=goal(), dir=P.f?'←':'→';
    const btns=['f','s','w','c'].map(x=>{ const can=!bad&&!g&&P[x]===P.f;
      return `<button class="btn sm${x==='f'?' ghost':''}" data-x="${x}" ${can?'':'disabled'}>${x==='f'?`${IC.f} 농부만 ${dir}`:`${IC[x]} ${NAME[x]} 태우고 ${dir}`}</button>`; }).join('');
    const alert=bad?`<div class="rv-alert ng">⚠️ <b>금지 상태!</b> ${bad.t}. 「되돌아가기」를 눌러 이전 상태로 돌아가 다른 방법을 시도해요.</div>`
      :g?`<div class="rv-alert ok">🎉 <b>목표 상태!</b> 모두 손실 없이 강을 건넜어요. 이동 ${st.mv}번 · 금지 상태 ${st.bad}번 · 되돌아가기 ${st.back}번. 아래 교과서 탐색 트리와 내가 간 길을 비교해 보세요.</div>`
      :`<div class="rv-alert">농부가 있는 쪽에서 함께 태울 것을 골라요. 배에는 농부와 <b>한 가지만</b> 탈 수 있어요.</div>`;
    B.innerHTML=`<div class="rv-stage">${bankHTML(0)}<div class="rv-river"><span class="rv-boat ${P.f?'r':'l'}">🛶</span></div>${bankHTML(1)}</div>
      <div class="rv-state">현재 상태 <b class="mono">${show(key(P))}</b> <span class="muted">(‘|’ 왼쪽이 서쪽 둑)</span></div>${alert}
      <div class="row rv-btns">${btns}</div>
      <div class="row" style="margin-top:8px"><button class="btn sm${bad?'':' ghost'}" data-k="back" ${bad||hist.length?'':'disabled'}>↩ 되돌아가기</button><button class="btn sm ghost" data-k="reset">처음부터</button><span class="muted" style="font-size:.88rem">이동 ${st.mv} · 금지 상태 ${st.bad} · 되돌아가기 ${st.back}</span></div>
      <div class="bs-log"><table><tr><th>단계</th><th>한 행동</th><th>상태</th><th>결과</th></tr><tr><td>0</td><td>시작</td><td class="mono">fcsw |</td><td>초기 상태</td></tr>${log.map((r,i)=>`<tr class="${r[3]}"><td>${i+1}</td><td>${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></div>`;
    B.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>move(b.dataset.x));
    B.querySelector('[data-k="back"]').onclick=back; B.querySelector('[data-k="reset"]').onclick=reset;
    const lg=B.querySelector('.bs-log'); lg.scrollTop=lg.scrollHeight;
  }
  reset();
  return {visited:()=>visited, trans:()=>trans, show, set onChange(f){onChange=f; f();}};
})();

(function(){
  /* 그림 Ⅰ-11·Ⅰ-13: 번호는 행동(링크). 13과 14는 같은 상태 s | fcw 로 이어짐 */
  const N={S0:['fcsw|',380,10],N1:['csw|f',80,80],N2:['sw|fc',270,80],N3:['cw|fs',475,80],N4:['cs|fw',675,80],N5:['fcw|s',475,150],N6:['w|fcs',300,220],N7:['c|fsw',600,220],
    N8:['fw|cs',165,290],N9:['fsw|c',360,290],N10:['fcs|w',545,290],N11:['fc|sw',695,290],N12:['sw|fc',235,360],N13:['s|fcw',455,360],N15:['cs|fw',640,360],N16:['fs|cw',455,430],N17:['|fcsw',455,500]};
  const BAD=['N1','N2','N4','N8','N11','N12','N15'];
  const E=[[1,'S0','N1','농부만 건넌다'],[2,'S0','N2','양배추를 옮긴다'],[3,'S0','N3','양을 옮긴다'],[4,'S0','N4','늑대를 옮긴다'],[5,'N3','N5','농부만 되돌아간다'],[6,'N5','N6','양배추를 옮긴다'],[7,'N5','N7','늑대를 옮긴다'],
    [8,'N6','N8','농부만 되돌아간다'],[9,'N6','N9','양을 데리고 되돌아간다'],[10,'N7','N10','양을 데리고 되돌아간다'],[11,'N7','N11','농부만 되돌아간다'],[12,'N9','N12','농부만 건넌다'],[13,'N9','N13','늑대를 옮긴다'],
    [14,'N10','N13','양배추를 옮긴다'],[15,'N10','N15','농부만 건넌다'],[16,'N13','N16','농부만 되돌아간다'],[17,'N16','N17','양을 옮긴다']];
  const ORDER={dfs:[1,2,3,5,6,8,9,12,13,16,17],bfs:E.map(e=>e[0])};
  const W=104,H=30, B=$('rvTree'); let mode='dfs', step=0, timer=null;
  B.innerHTML=`<div class="tv-top"><div class="tv-mode"><button data-m="dfs">⬇️ 깊이 우선 탐색 순서</button><button data-m="bfs">➡️ 너비 우선 탐색 순서</button></div>
    <div class="row"><button class="btn sm" data-k="step">한 단계 ▶</button><button class="btn sm ghost" data-k="auto">자동 재생</button><button class="btn sm ghost" data-k="reset">처음부터</button></div></div>
    <div class="rt-svg"></div><div class="tv-msg rt-msg"></div><div class="tv-order rt-order"></div>`;
  const q=s=>B.querySelector(s);
  function render(){
    B.querySelectorAll('.tv-mode button').forEach(b=>b.classList.toggle('on',b.dataset.m===mode));
    const seq=ORDER[mode].slice(0,step), done=new Set(seq), tr=RIVER.trans();
    const myE=new Set(E.filter(e=>tr.has(N[e[1]][0]+'>'+N[e[2]][0])).map(e=>e[0])), mine=new Set(['S0']); E.forEach(e=>{if(myE.has(e[0])) mine.add(e[2]);});
    const reached=new Set(['S0']); E.forEach(e=>{if(done.has(e[0])) reached.add(e[2]);});
    let s=`<text class="rt-lb" x="${N.S0[1]-W/2-8}" y="${N.S0[2]+20}" text-anchor="end">초기 상태</text><text class="rt-lb" x="${N.N17[1]-W/2-8}" y="${N.N17[2]+20}" text-anchor="end">목표 상태</text>`;
    E.forEach(([no,a,b])=>{ const x1=N[a][1],y1=N[a][2]+H,x2=N[b][1],y2=N[b][2], on=done.has(no), last=seq[seq.length-1]===no, mx=(x1+x2)/2, my=(y1+y2)/2;
      s+=`<line class="e${on?' on':''}${myE.has(no)?' mine':''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><g class="eb${on?' on':''}${last?' last':''}"><circle cx="${mx}" cy="${my}" r="11"/><text x="${mx}" y="${my+4}">${no}</text></g>`; });
    for(const id in N){ const [k,x,y]=N[id], cls=[BAD.includes(id)?'bad':'', id==='N17'?'goal':'', reached.has(id)?'on':'', mine.has(id)?'mine':''].join(' ');
      s+=`<g class="rn ${cls}" transform="translate(${x-W/2} ${y})"><rect width="${W}" height="${H}" rx="8"/><text x="${W/2}" y="${H/2+5}">${RIVER.show(k)}</text>${BAD.includes(id)?`<text class="fb" x="${W/2}" y="${H+12}">금지 상태</text>`:''}</g>`; }
    q('.rt-svg').innerHTML=`<svg viewBox="0 0 760 540" role="img" aria-label="강 건너기 탐색 트리">${s}</svg>`;
    const no=seq[seq.length-1], e=E.find(x=>x[0]===no);
    let msg;
    if(!step) msg=`${mode==='dfs'?'깊이 우선 탐색':'너비 우선 탐색'} 순서를 한 단계씩 재생해 보세요. 파란 테두리·파란 선은 내가 퍼즐에서 실제로 지나간 상태와 행동이에요.`;
    else { const k=N[e[2]][0]; msg=`<b>${step}번째</b> · ${no}. ${e[3]} → <span class="mono">${RIVER.show(k)}</span>`;
      if(BAD.includes(e[2])) msg+=' — 금지 상태라 더 내려가지 않아요.';
      else if(no===14) msg+=' — 13에서 이미 나온 상태라 다시 탐색하지 않아요.';
      else if(e[2]==='N17') msg+=` — <b class="ok">목표 상태 도달!</b> ${mode==='dfs'?'깊이 우선 탐색':'너비 우선 탐색'}은 행동 ${ORDER[mode].length}개를 확인했어요.`; }
    q('.rt-msg').innerHTML=msg;
    q('.rt-order').innerHTML='<span class="muted" style="margin-right:6px">순서</span>초기 상태 '+ORDER[mode].map((n,i)=>`<i class="${i<step?'':'off'}">${n}</i>`).join('')+' 목표 상태';
    const end=step>=ORDER[mode].length; q('[data-k="step"]').disabled=end; q('[data-k="auto"]').disabled=end;
  }
  function stop(){ if(timer){clearInterval(timer); timer=null;} q('[data-k="auto"]').textContent='자동 재생'; }
  q('[data-k="step"]').onclick=()=>{ if(step<ORDER[mode].length){step++; render();} };
  q('[data-k="auto"]').onclick=()=>{ if(timer){stop(); return;} q('[data-k="auto"]').textContent='멈춤'; timer=setInterval(()=>{ if(step>=ORDER[mode].length){stop(); return;} step++; render(); },800); };
  q('[data-k="reset"]').onclick=()=>{stop(); step=0; render();};
  B.querySelectorAll('.tv-mode button').forEach(b=>b.onclick=()=>{mode=b.dataset.m; stop(); step=0; render();});
  RIVER.onChange=render;
})();

/* 04 물통: 상태 (5L, 3L), 할 수 있는 행동만 켜짐, 처음 나온 상태만 트리에 붙음 */
(function(){
  const ACT=[['5L 가득 채우기','+5',(a,b)=>[5,b]],['3L 가득 채우기','+3',(a,b)=>[a,3]],['5L 비우기','−5',(a,b)=>[0,b]],['3L 비우기','−3',(a,b)=>[a,0]],
    ['5L → 3L 붓기','5→3',(a,b)=>{const t=Math.min(a,3-b); return [a-t,b+t];}],['3L → 5L 붓기','3→5',(a,b)=>{const t=Math.min(b,5-a); return [a+t,b-t];}]];
  const S=(a,b)=>`(${a}, ${b})`;
  const next=(a,b)=>ACT.map((x,i)=>{const [na,nb]=x[2](a,b); return {i,na,nb,ok:na!==a||nb!==b};});
  const B=$('jgGame'); let nodes,cur,log,cpu={};
  function reset(){ nodes=[{id:0,p:null,a:0,b:0,edge:''}]; cur=0; log=[]; draw('두 물통이 모두 비어 있어요. 어떤 행동부터 해 볼까요?'); }
  function act(i){
    const n=nodes[cur], [a,b]=ACT[i][2](n.a,n.b); if(a===n.a&&b===n.b) return;
    const ex=nodes.find(m=>m.a===a&&m.b===b); let res,msg;
    if(ex){ cur=ex.id; res='↺ 이미 나온 상태'; msg=`<b>${S(a,b)}</b> — 이미 나온 상태예요. 트리에 새로 붙이지 않고 그 노드로 옮겨 갔어요.`; }
    else { nodes.push({id:nodes.length,p:cur,a,b,edge:ACT[i][1]}); cur=nodes.length-1; res=a===4?'🎉 목표':'○ 새 상태'; msg=`<b>${S(a,b)}</b> — 처음 나온 상태라 탐색 트리에 새 노드로 붙었어요.`; }
    if(a===4){ const path=[]; for(let x=nodes[cur]; x; x=x.p==null?null:nodes[x.p]) path.unshift(S(x.a,x.b));
      msg=`🎉 <b>4L를 만들었어요!</b> 트리에서 찾은 길: ${path.join(' → ')} (행동 ${path.length-1}번). 다른 방법도 있을지 노드를 눌러 되돌아가 보세요.`; }
    log.push([ACT[i][0],S(a,b),res,a===4?'ok':ex?'bk':'']); draw(msg);
  }
  function jump(id){ if(id===cur) return; cur=id; const n=nodes[id]; log.push(['되돌아가기',S(n.a,n.b),'↩ 되돌아감','bk']); draw(`${S(n.a,n.b)} 상태로 되돌아왔어요. 아직 해 보지 않은 행동을 골라 보세요.`); }
  function jug(x,cap,amt,lab){ const u=20, h=cap*u, y0=130-h;
    return `<rect class="jw" x="${x}" y="${y0}" width="${cap===5?72:58}" height="${h}" style="transform:scaleY(${amt/cap})"/><rect class="jb" x="${x}" y="${y0}" width="${cap===5?72:58}" height="${h}" rx="4"/>
      <text class="jt" x="${x+(cap===5?36:29)}" y="${y0-8}">${amt}L</text><text class="jl" x="${x+(cap===5?36:29)}" y="148">${lab}</text>`; }
  function draw(msg){
    const n=nodes[cur], nx=next(n.a,n.b), can=nx.filter(x=>x.ok);
    const tree=bsTreeSVG(nodes.map(m=>({id:m.id,p:m.p,label:S(m.a,m.b),edge:m.edge,cls:(m.a===4?'goal':'')+(m.id===cur?' cur':'')})),{nw:62,nh:26,gx:8,gy:30,scale:1.3});
    B.innerHTML=`<div class="jg-top"><svg viewBox="0 0 250 156" class="jg-svg" role="img" aria-label="5L 물통에 ${n.a}L, 3L 물통에 ${n.b}L">${jug(40,5,n.a,'5L 물통')}${jug(150,3,n.b,'3L 물통')}</svg>
      <div class="jg-side"><div class="rv-state">현재 상태 <b class="mono">${S(n.a,n.b)}</b></div><div class="jg-can">이 상태에서 할 수 있는 행동 <b>${can.length}가지</b>: ${can.map(x=>ACT[x.i][0]+' → '+S(x.na,x.nb)).join(' · ')}</div>
      <div class="jg-btns">${ACT.map((x,i)=>`<button class="btn sm" data-i="${i}" ${nx[i].ok?'':'disabled title="지금은 상태가 바뀌지 않아요"'}>${x[0]}</button>`).join('')}</div>
      <div class="jg-msg">${msg}</div></div></div>
      <div class="jg-tree"><div class="jg-th"><b>내가 만든 탐색 트리</b> <span class="muted">상태 ${nodes.length}개 · 노드를 누르면 되돌아가요</span></div>${tree}
      <div class="note">+5 5L 가득 채우기 · +3 3L 가득 채우기 · −5 5L 비우기 · −3 3L 비우기 · 5→3, 3→5 붓기 · 금색은 목표 상태</div></div>
      <div class="row" style="margin-top:6px"><button class="btn sm ghost" data-k="reset">처음부터</button></div>
      <div class="bs-log"><table><tr><th>단계</th><th>한 행동</th><th>상태 (5L, 3L)</th><th>결과</th></tr><tr><td>0</td><td>시작</td><td class="mono">(0, 0)</td><td>초기 상태</td></tr>${log.map((r,i)=>`<tr class="${r[3]}"><td>${i+1}</td><td>${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></div>
      <div class="jg-cpu"><b>🤖 컴퓨터라면? 맹목적 탐색으로 풀어 보기</b><p class="muted" style="margin:4px 0 8px;font-size:.88rem">분기점에서 위 버튼 순서(채우기 → 비우기 → 붓기)대로 가기로 미리 정해 두고, 방문한 상태는 다시 방문하지 않아요.</p>
      <div class="row"><button class="btn sm" data-m="dfs">⬇️ 깊이 우선 탐색으로 풀기</button><button class="btn sm" data-m="bfs">➡️ 너비 우선 탐색으로 풀기</button></div><div class="jg-cres">${cpuHTML()}</div></div>`;
    B.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>act(+b.dataset.i));
    B.querySelectorAll('.jg-tree g.n').forEach(g=>g.onclick=()=>jump(+g.dataset.id));
    B.querySelector('[data-k="reset"]').onclick=reset;
    B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{cpu[b.dataset.m]=solve(b.dataset.m); B.querySelector('.jg-cres').innerHTML=cpuHTML();});
    const lg=B.querySelector('.bs-log'); lg.scrollTop=lg.scrollHeight;
  }
  function solve(m){
    const K=(a,b)=>a+','+b, order=[];
    if(m==='bfs'){ const par={'0,0':null}, qu=[[0,0]]; let end=null;
      while(qu.length){ const [a,b]=qu.shift(); order.push(K(a,b)); if(a===4){end=K(a,b); break;}
        next(a,b).filter(x=>x.ok).forEach(x=>{const k=K(x.na,x.nb); if(!(k in par)){par[k]=K(a,b); qu.push([x.na,x.nb]);}}); }
      const path=[]; for(let k=end; k; k=par[k]) path.unshift(k); return {order,path}; }
    const seen=new Set(), path=[];
    (function rec(a,b){ const k=K(a,b); seen.add(k); order.push(k); path.push(k); if(a===4) return true;
      for(const x of next(a,b)) if(x.ok&&!seen.has(K(x.na,x.nb))&&rec(x.na,x.nb)) return true; path.pop(); return false; })(0,0);
    return {order,path};
  }
  function cpuHTML(){
    const f=k=>'('+k.replace(',',', ')+')';
    const one=(m,t)=>{ const r=cpu[m]; if(!r) return ''; const on=new Set(r.path);
      return `<div class="jg-r"><b>${t}</b> · 상태 <b>${r.order.length}개</b>를 방문해 행동 <b>${r.path.length-1}번</b>짜리 방법을 찾았어요.<div class="tv-order">${r.order.map((k,i)=>`<i class="${on.has(k)?'p':'off'}" title="${i+1}번째 방문">${f(k)}</i>`).join('')}</div><small class="muted">진한 칸이 찾은 길: ${r.path.map(f).join(' → ')}</small></div>`; };
    let h=one('dfs','깊이 우선 탐색')+one('bfs','너비 우선 탐색');
    if(cpu.dfs&&cpu.bfs) h+=`<div class="callout" style="margin-bottom:0">같은 문제인데 깊이 우선 탐색은 <b>${cpu.dfs.path.length-1}번</b>, 너비 우선 탐색은 <b>${cpu.bfs.path.length-1}번</b> 만에 4L를 만들었어요. 물통 문제의 상태는 모두 16가지뿐이라 금방 끝나지만, 상태가 수백만 가지인 문제라면 어떨까요?</div>`;
    return h;
  }
  reset();
})();

/* 05 확인할 상태 수 계산기 */
(function(){
  const B=$('calc');
  B.innerHTML=`<div class="ctrl"><label>갈림길</label><input type="range" id="cB" min="2" max="10" value="3"><output id="cBo"></output></div>
    <div class="ctrl"><label>깊이</label><input type="range" id="cD" min="1" max="30" value="5"><output id="cDo"></output></div>
    <p class="muted" style="font-size:.85rem;margin:2px 0 8px">갈림길: 분기점마다 갈 수 있는 길의 수 · 깊이: 목표 상태까지 행동해야 하는 횟수</p>
    <div class="calc-out"></div>`;
  const kr=n=>{ if(n<1e4) return Math.round(n).toLocaleString('ko-KR');
    for(const [v,u] of [[1e16,'경'],[1e12,'조'],[1e8,'억'],[1e4,'만']]) if(n>=v){ const x=n/v; if(x>=1e4) return `약 10<sup>${Math.floor(Math.log10(n))}</sup>`; return (x<10?x.toFixed(1):Math.round(x).toLocaleString('ko-KR'))+u; } };
  function time(sec){ if(sec<1) return '1초도 안 걸려요';
    if(sec<60) return `약 ${sec.toFixed(1)}초`; if(sec<3600) return `약 ${(sec/60).toFixed(1)}분`; if(sec<86400) return `약 ${(sec/3600).toFixed(1)}시간`;
    if(sec<31536000) return `약 ${(sec/86400).toFixed(1)}일`; const y=sec/31536000; return `약 ${kr(y)}년`+(y>1.38e10?' (우주의 나이 약 138억 년보다 길어요!)':''); }
  function upd(){ const b=+$('cB').value, d=+$('cD').value; $('cBo').textContent=b; $('cDo').textContent=d;
    let n=0; for(let i=0;i<=d;i++) n+=Math.pow(b,i);
    B.querySelector('.calc-out').innerHTML=`<div class="calc-n">최악의 경우 확인할 상태 <b>${kr(n)}</b>개</div><div>1초에 100만 개를 확인하는 컴퓨터라면 <b>${time(n/1e6)}</b></div>
      <small class="muted">깊이 0부터 ${d}까지 1 + ${b} + ${b}<sup>2</sup> + … + ${b}<sup>${d}</sup>개. 금지 상태나 이미 나온 상태를 걸러 내면 이보다 줄지만, 갈림길과 깊이가 커지면 수가 급격히 늘어나요.</small>`; }
  $('cB').oninput=upd; $('cD').oninput=upd; upd();
})();

/* 05 빈칸 확인 · 스스로 점검 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['다양한 탐색 트리를 표현할 수 있다','깊이 우선 탐색으로 문제를 해결할 수 있다','너비 우선 탐색으로 문제를 해결할 수 있다','맹목적 탐색과 정보 이용 탐색의 차이를 말할 수 있다'],true);

const MEMOLIST=[['naviPlan','내비게이션은 목적지를 어떻게 찾을까'],['riverWay','강 건너기: 내가 푼 방식과 다시 시도한 방법'],['jugState','물통 문제: 상태를 구분한 기준과 다음 행동'],['blindWhy','맹목적 탐색이 실제 문제에서 잘 안 쓰이는 이유'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
