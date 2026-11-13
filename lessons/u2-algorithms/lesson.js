/* 공통: 그래프 좌표 변환 (값 → SVG 좌표) */
function alAxes(o){ // o: {W,H,L,R,T,B,x0,x1,y0,y1}
  const sx=v=>o.L+(v-o.x0)/(o.x1-o.x0)*(o.W-o.L-o.R), sy=v=>o.H-o.B-(v-o.y0)/(o.y1-o.y0)*(o.H-o.T-o.B);
  return {sx,sy};
}
function alGrid(o,xt,yt,xl,yl,fx,fy){
  const {sx,sy}=alAxes(o); let s='';
  xt.forEach(v=>{s+=`<line class="gl" x1="${sx(v)}" y1="${sy(o.y0)}" x2="${sx(v)}" y2="${sy(o.y1)}"/><text class="tk" x="${sx(v)}" y="${sy(o.y0)+14}" text-anchor="middle">${fx?fx(v):v}</text>`;});
  yt.forEach(v=>{s+=`<line class="gl" x1="${sx(o.x0)}" y1="${sy(v)}" x2="${sx(o.x1)}" y2="${sy(v)}"/><text class="tk" x="${sx(o.x0)-5}" y="${sy(v)+4}" text-anchor="end">${fy?fy(v):v}</text>`;});
  s+=`<line class="ax" x1="${sx(o.x0)}" y1="${sy(o.y0)}" x2="${sx(o.x1)}" y2="${sy(o.y0)}"/><line class="ax" x1="${sx(o.x0)}" y1="${sy(o.y0)}" x2="${sx(o.x0)}" y2="${sy(o.y1)}"/>`;
  s+=`<text class="axl" x="${sx(o.x1)}" y="${o.H-4}" text-anchor="end">${xl}</text><text class="axl" x="${sx(o.x0)+4}" y="${o.T+2}">${yl}</text>`;
  return s;
}

/* 01 같은 데이터 · 두 질문 (선형 회귀 / 로지스틱 회귀) */
(function(){
  const B=$('lgGame');
  /* 그림 Ⅱ-7의 점을 어림해 읽은 값 (연습 시간, 타율). (14, 0) 점은 뺌 */
  const PT=[[3,.122],[5,.145],[7,.157],[8,.188],[9,.18],[10,.224],[11,.29],[15,.331],[15,.29],[16,.30],[19,.351],[20,.389]];
  const n=PT.length, mx=PT.reduce((s,p)=>s+p[0],0)/n, my=PT.reduce((s,p)=>s+p[1],0)/n;
  let sxy=0,sxx=0; PT.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my); sxx+=(p[0]-mx)**2;});
  const M=sxy/sxx, C=my-M*mx;               // 최소제곱 회귀선 y = Mx + C
  const sig=x=>1/(1+Math.exp(-60*(x-0.3)));  // 예시 S자 곡선: 타율 0.300에서 0.5
  const oL={W:300,H:220,L:40,R:12,T:16,B:30,x0:0,x1:25,y0:0,y1:.45};
  const oR={W:300,H:220,L:40,R:12,T:16,B:30,x0:0,x1:.45,y0:0,y1:1};
  B.innerHTML=`<div class="al-two">
    <div class="al-pane" style="--k:#1f9d74"><h4>📈 선형 회귀 · 「타율은 얼마일까?」</h4><svg id="lgL" viewBox="0 0 300 220" role="img" aria-label="연습 시간과 타율 산점도와 회귀선"></svg>
      <div class="ctrl"><label>연습 시간</label><input type="range" id="lgH" min="0" max="23" step="1" value="12"><output id="lgHo"></output></div>
      <div class="al-out" id="lgLo"></div></div>
    <div class="al-pane" style="--k:#c98a00"><h4>〰️ 로지스틱 회귀 · 「3할 타자일까?」</h4><svg id="lgR" viewBox="0 0 300 220" role="img" aria-label="타율에 따른 3할 이상 확률 S자 곡선"></svg>
      <div class="ctrl"><label>타율</label><input type="range" id="lgA" min="0.1" max="0.45" step="0.005" value="0.27"><output id="lgAo"></output></div>
      <div class="al-out" id="lgRo"></div></div>
  </div>
  <div class="al-cmp"><div><b>입력</b><span>연습 시간</span><span>타율</span></div><div><b>알고리즘이 내놓는 답</b><span id="lgC1"></span><span id="lgC2"></span></div><div><b>답의 모양</b><span>0.1, 0.25, 0.38 … 처럼 <b>이어지는 숫자</b></span><span><b>1 또는 0</b>, 두 가지 중 하나(범주)</span></div></div>`;
  function left(){
    const h=+$('lgH').value, p=M*h+C, {sx,sy}=alAxes(oL);
    let s=alGrid(oL,[0,5,10,15,20,25],[0,.1,.2,.3,.4],'연습 시간','타율',null,v=>v.toFixed(1));
    s+=`<line class="al-reg" x1="${sx(0)}" y1="${sy(C)}" x2="${sx(23)}" y2="${sy(M*23+C)}"/>`;
    PT.forEach(q=>s+=`<circle class="al-pt" cx="${sx(q[0])}" cy="${sy(q[1])}" r="3.6"/>`);
    s+=`<line class="al-guide" x1="${sx(h)}" y1="${sy(0)}" x2="${sx(h)}" y2="${sy(p)}"/><line class="al-guide" x1="${sx(0)}" y1="${sy(p)}" x2="${sx(h)}" y2="${sy(p)}"/><circle class="al-mark" cx="${sx(h)}" cy="${sy(p)}" r="6"/>`;
    $('lgL').innerHTML=s; $('lgHo').textContent=h+'시간';
    $('lgLo').innerHTML=`연습 <b>${h}시간</b> → 회귀선 위의 높이 = 예상 타율 <b class="big">${p.toFixed(3)}</b><small>회귀선: y = ${M.toFixed(4)}x + ${C.toFixed(3)} (m 기울기, b 절편)</small>`;
    $('lgC1').innerHTML=`예상 타율 <b>${p.toFixed(3)}</b>`;
  }
  function right(){
    const a=+$('lgA').value, pr=sig(a), cls=pr>=.5?1:0, {sx,sy}=alAxes(oR);
    let s=alGrid(oR,[0,.1,.2,.3,.4],[0,.5,1],'타율','확률',v=>v.toFixed(1),null);
    s+=`<line class="al-half" x1="${sx(0)}" y1="${sy(.5)}" x2="${sx(.45)}" y2="${sy(.5)}"/><text class="tk" x="${sx(.45)}" y="${sy(.5)-4}" text-anchor="end">기준 0.5</text>`;
    let d=''; for(let x=0;x<=.45001;x+=.005) d+=(d?'L':'M')+sx(x).toFixed(1)+' '+sy(sig(x)).toFixed(1);
    s+=`<path class="al-sig" d="${d}"/>`;
    PT.forEach(q=>s+=`<circle class="al-pt ${q[1]>=.3?'one':''}" cx="${sx(q[1])}" cy="${sy(q[1]>=.3?1:0)}" r="3.6"/>`);
    s+=`<line class="al-guide" x1="${sx(a)}" y1="${sy(0)}" x2="${sx(a)}" y2="${sy(pr)}"/><circle class="al-mark ${cls?'one':''}" cx="${sx(a)}" cy="${sy(pr)}" r="6"/>`;
    $('lgR').innerHTML=s; $('lgAo').textContent=a.toFixed(3);
    $('lgRo').innerHTML=`타율 <b>${a.toFixed(3)}</b> → 3할 이상일 확률 <b>${pr.toFixed(2)}</b> → ${pr>=.5?'0.5 이상':'0.5 미만'}이므로 <b class="big">${cls}</b> <span class="al-tag ${cls?'one':''}">${cls?'3할 이상인 타자':'3할 미만인 타자'}</span><small>점: 3할 이상(1)은 위, 3할 미만(0)은 아래</small>`;
    $('lgC2').innerHTML=`확률 ${pr.toFixed(2)} → <b>${cls}</b>`;
  }
  $('lgH').oninput=left; $('lgA').oninput=right; left(); right();
})();

/* 02 의사결정트리 따라가기 (그림 Ⅱ-10) */
(function(){
  const B=$('dtGame');
  const N={root:{x:290,y:26,t:'타율 > 0.250 ?',s:14},bat:{x:110,y:118,t:'타자',s:7,leaf:1},n2:{x:420,y:118,t:'방어율 > 2.0 ?',s:7},
    mid:{x:300,y:210,t:'중간 투수',s:5,leaf:1},n3:{x:520,y:210,t:'방어율 > 1.0 ?',s:2},close:{x:450,y:302,t:'마무리 투수',s:1,leaf:1},start:{x:580,y:302,t:'선발 투수',s:1,leaf:1}};
  const E=[['root','bat','예'],['root','n2','아니요'],['n2','mid','예'],['n2','n3','아니요'],['n3','close','예'],['n3','start','아니요']];
  const PL=[['1번',.122,2.43,'투수'],['2번',.224,2.42,'투수'],['3번',.145,2.41,'투수'],['12번',.351,2.23,'타자'],['13번',.389,4.31,'타자'],['14번',.25,3.10,'?']];
  B.innerHTML=`<div class="row al-pl">${PL.map((p,i)=>`<button class="btn sm ghost" data-p="${i}">${p[0]} <small>(${p[1].toFixed(3)}, ${p[2].toFixed(2)})</small></button>`).join('')}</div>
    <div class="ctrl al-ctrl"><label>타율</label><input type="range" id="dtA" min="0.1" max="0.4" step="0.001" value="0.122"><output id="dtAo"></output></div>
    <div class="ctrl al-ctrl"><label>방어율</label><input type="range" id="dtE" min="0" max="5" step="0.01" value="2.43"><output id="dtEo"></output></div>
    <div class="al-tree"><svg id="dtSvg" viewBox="0 0 650 340" role="img" aria-label="선발 포지션을 분류하는 의사결정트리"></svg></div>
    <div class="al-trace" id="dtOut"></div>`;
  let who=0;
  function path(a,e){ const p=['root']; if(a>.25){p.push('bat');return p;} p.push('n2'); if(e>2){p.push('mid');return p;} p.push('n3'); p.push(e>1?'close':'start'); return p; }
  function draw(){
    const a=+$('dtA').value, e=+$('dtE').value, P=path(a,e), on=new Set(P);
    $('dtAo').textContent=a.toFixed(3); $('dtEo').textContent=e.toFixed(2);
    let s='';
    E.forEach(([f,t,l])=>{const A=N[f],Bn=N[t],o=on.has(f)&&on.has(t); s+=`<line class="e ${o?'on':''}" x1="${A.x}" y1="${A.y+42}" x2="${Bn.x}" y2="${Bn.y}"/><text class="el ${o?'on':''}" x="${(A.x+Bn.x)/2+(Bn.x<A.x?-14:14)}" y="${(A.y+42+Bn.y)/2+4}" text-anchor="middle">${l}</text>`;});
    Object.entries(N).forEach(([k,v])=>{ s+=`<g class="nd ${v.leaf?'leaf':''} ${on.has(k)?'on':''} ${k===P[P.length-1]?'end':''}" transform="translate(${v.x-62} ${v.y})"><rect width="124" height="42" rx="9"/><text x="62" y="18" text-anchor="middle" class="t1">${v.t}</text><text x="62" y="34" text-anchor="middle" class="t2">샘플 수 = ${v.s}</text></g>`; });
    $('dtSvg').innerHTML=s;
    const st=[]; st.push(`타율 ${a.toFixed(3)} > 0.250 ? → <b>${a>.25?'예':'아니요'}</b>`);
    if(a<=.25){ st.push(`방어율 ${e.toFixed(2)} > 2.0 ? → <b>${e>2?'예':'아니요'}</b>`); if(e<=2) st.push(`방어율 ${e.toFixed(2)} > 1.0 ? → <b>${e>1?'예':'아니요'}</b>`); }
    const res=N[P[P.length-1]].t, pl=who>=0?PL[who]:null;
    let h=`<ol>${st.map(x=>`<li>${x}</li>`).join('')}</ol><div class="al-res">결과: <b>${res}</b>${pl?` <span class="muted">· ${pl[0]} 선수, 표의 포지션: ${pl[3]}</span>`:''}</div>`;
    if(pl&&pl[0]==='14번') h+=`<div class="callout" style="margin-bottom:0">표에서 비어 있던 14번의 포지션을 트리가 <b>${res}</b>로 정했어요. 그런데 타율 0.250은 「0.250 <b>초과</b>」가 아니라서 「아니요」로 갔어요. 본문의 예시 질문처럼 「0.250 <b>이상</b>인가?」로 물으면 「예」가 되어 <b>타자</b>로 분류돼요. 규칙이 눈에 보이니 이런 차이도 바로 찾을 수 있어요.</div>`;
    else if(Math.abs(a-.25)<1e-9) h+=`<p class="note">타율이 딱 0.250이면 「0.250 초과」가 아니므로 「아니요」 쪽으로 가요.</p>`;
    $('dtOut').innerHTML=h;
    B.querySelectorAll('[data-p]').forEach(b=>b.classList.toggle('on',+b.dataset.p===who));
  }
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{who=+b.dataset.p; $('dtA').value=PL[who][1]; $('dtE').value=PL[who][2]; draw();});
  $('dtA').oninput=$('dtE').oninput=()=>{who=-1; draw();};
  draw();
})();

/* 03 서포트 벡터 머신 그림 (그림 Ⅱ-11을 어림해 다시 그림) */
(function(){
  const o={W:360,H:250,L:34,R:12,T:16,B:30,x0:0,x1:.45,y0:0,y1:5}, {sx,sy}=alAxes(o);
  const P=[[.122,2.43,'중간',0],[.145,2.41,'중',0],[.157,3.12,'중',0],[.224,2.42,'중',0,1],[.19,1.30,'마',0],[.178,.12,'선',0],
    [.26,3.10,'14번',2],[.275,4.02,'타자',1,1],[.29,4.10,'타자',1],[.33,4.13,'타자',1],[.389,4.31,'타자',1],[.30,3.00,'타자',1],[.29,2.12,'타자',1],[.351,2.23,'타자',1]];
  const xb=y=>.268-.006*y;  // 결정 경계: (0.238, 5) ~ (0.268, 0)
  let s=alGrid(o,[0,.1,.2,.3,.4],[0,1,2,3,4,5],'타율','방어율',v=>v.toFixed(1),null);
  s+=`<polygon class="al-band" points="${sx(xb(0)-.03)},${sy(0)} ${sx(xb(5)-.03)},${sy(5)} ${sx(xb(5)+.03)},${sy(5)} ${sx(xb(0)+.03)},${sy(0)}"/>`;
  [-.03,.03].forEach(d=>s+=`<line class="al-mg" x1="${sx(xb(0)+d)}" y1="${sy(0)}" x2="${sx(xb(5)+d)}" y2="${sy(5)}"/>`);
  s+=`<line class="al-db" x1="${sx(xb(0))}" y1="${sy(0)}" x2="${sx(xb(5))}" y2="${sy(5)}"/>`;
  s+=`<text class="al-lab" x="${sx(xb(.6))-8}" y="${sy(.6)}" text-anchor="end">결정 경계</text><text class="al-lab" x="${sx(xb(5))}" y="${sy(5)-3}" text-anchor="middle">마진</text>`;
  P.forEach(p=>{ s+=(p[4]?`<circle class="al-sv" cx="${sx(p[0])}" cy="${sy(p[1])}" r="8"/>`:'')+`<circle class="al-pt ${['pit','bat','unk'][p[3]]}" cx="${sx(p[0])}" cy="${sy(p[1])}" r="4"/><text class="al-pl" x="${sx(p[0])+6}" y="${sy(p[1])+4}">${p[2]}</text>`; });
  $('svmFig').innerHTML=`<svg viewBox="0 0 360 250" role="img" aria-label="타자와 투수를 나누는 결정 경계와 마진">${s}</svg><div class="al-leg"><span><i class="pit"></i>투수(중간·중·마무리·선발)</span><span><i class="bat"></i>타자</span><span><i class="unk"></i>포지션이 정해지지 않은 14번 — 학습에 쓰지 않은 점</span></div>`;
})();

/* 03 k-평균 한 단계씩 */
(function(){
  const B=$('kmGame');
  /* [타율, 방어율, 포지션 이름표] — 1·2·3·12·13·14번은 표 Ⅱ-8, 나머지는 그림 Ⅱ-12를 어림해 읽은 값 */
  const P=[[.122,2.43,'1번 중간'],[.224,2.42,'2번 중'],[.145,2.41,'3번 중'],[.157,3.12,'중'],[.19,1.30,'마'],[.178,.12,'선'],[.25,3.10,'14번'],
    [.275,4.02,'타자'],[.29,4.10,'타자'],[.33,4.13,'타자'],[.389,4.31,'13번 타자'],[.30,3.00,'타자'],[.29,2.12,'타자'],[.351,2.23,'12번 타자']];
  const BOOK=[[0,1,2,3],[6,7,8,9,10,11,12,13],[4,5]];   // 그림 Ⅱ-12의 세 그룹
  const PRE={book:[[.12,2.4],[.30,4.0],[.20,.5]],other:[[.10,1.0],[.20,4.5],[.40,1.0]]};
  const COL=['#e0702b','#2f6fd0','#1f9d74'], SH=['■','◆','▲'];
  const o={W:420,H:280,L:36,R:12,T:16,B:30,x0:0,x1:.45,y0:0,y1:5}, {sx,sy}=alAxes(o);
  const dist=(p,c)=>((p[0]-c[0])/.45)**2+((p[1]-c[1])/5)**2;
  let C=[], old=[], asg=null, phase='empty', it=0, log=[], mode='', labels=false, extra=[], src='';
  B.innerHTML=`<div class="row"><button class="btn sm" data-s="book">교과서 그림과 비슷한 곳에서 시작</button><button class="btn sm" data-s="other">다른 곳에서 시작</button><button class="btn sm ghost" data-s="mine">(선택) 직접 놓기</button></div>
    <div class="al-km"><svg id="kmSvg" viewBox="0 0 420 280" role="img" aria-label="타율과 방어율 산점도와 k-평균 중심점"></svg>
    <div class="al-kside"><div class="al-kmsg" id="kmMsg"></div>
      <div class="row"><button class="btn sm" id="kmStep" disabled>다음 단계</button><button class="btn sm ghost" id="kmAll" disabled>끝까지 한 번에</button></div>
      <div class="row" style="margin-top:6px"><button class="btn sm ghost" id="kmLab">포지션 이름 보기</button><button class="btn sm ghost" id="kmNew" disabled>(선택) 새 선수 넣어 보기</button></div>
      <ol class="al-klog" id="kmLog"></ol></div></div>`;
  const svg=$('kmSvg');
  function msg(h){ $('kmMsg').innerHTML=h; }
  function start(k){
    src=k; old=[]; asg=null; it=0; log=[]; extra=[]; mode='';
    if(k==='mine'){ C=[]; phase='empty'; mode='place'; msg('그래프를 <b>세 번</b> 눌러 중심점 ■ ◆ ▲ 를 놓아요.'); }
    else { C=PRE[k].map(c=>c.slice()); phase='placed'; msg(`① k = 3, 중심점 3개를 놓았어요. 「다음 단계」를 눌러 <b>가장 가까운 중심점</b>에 묶어 보세요.`); }
    draw();
  }
  function assign(){ asg=P.map(p=>{let b=0;C.forEach((c,j)=>{if(dist(p,c)<dist(p,C[b]))b=j;});return b;}); phase='assigned';
    const cnt=C.map((_,j)=>asg.filter(x=>x===j).length); it++;
    log.push(`${it}회 ② 묶기: ${C.map((_,j)=>SH[j]+' '+cnt[j]+'명').join(' · ')}`);
    msg('② 모든 점에서 세 중심점까지 거리를 재어 <b>가장 가까운 중심점</b>에 묶었어요. 다음은 ③ 군집마다 <b>평균 좌표</b>로 중심점을 옮겨요.'); }
  function update(){
    old=C.map(c=>c.slice());
    C=C.map((c,j)=>{const g=P.filter((_,i)=>asg[i]===j); return g.length?[g.reduce((s,p)=>s+p[0],0)/g.length,g.reduce((s,p)=>s+p[1],0)/g.length]:c;});
    const mv=Math.max(...C.map((c,j)=>Math.sqrt(dist(c,old[j]))));
    if(mv<1e-9){ phase='done'; log.push(`${it}회 ③ 옮기기: 중심점이 그대로 → <b>종료</b>`); finish(); }
    else { phase='placed'; log.push(`${it}회 ③ 옮기기: ${C.map((c,j)=>SH[j]+'('+c[0].toFixed(3)+', '+c[1].toFixed(2)+')').join(' ')}`);
      msg('③ 군집에 속한 점들의 평균 위치로 중심점을 옮겼어요(흐린 표시가 이전 위치). 중심점이 움직였으니 ② 다시 묶기를 해요.'); }
  }
  function same(){ const g=C.map((_,j)=>P.map((_,i)=>i).filter(i=>asg[i]===j).join(',')); const b=BOOK.map(x=>x.join(',')); return b.every(x=>g.includes(x)); }
  function finish(){
    const ok=same();
    msg(`④ 중심점이 더 이상 변하지 않아 <b>알고리즘을 종료</b>했어요. ${ok?'교과서 그림 Ⅱ-12와 같은 세 그룹이 나왔어요. 「포지션 이름 보기」를 눌러 각 그룹에 어떤 선수가 모였는지 확인해 보세요.':'<b>시작 위치가 달라서</b> 교과서 그림 Ⅱ-12와 다른 그룹으로 끝났어요. 85쪽 표의 k-평균 단점 「<b>초기 중심점 위치</b>에 민감하다」가 바로 이것이에요.'}`);
  }
  function step(){ if(phase==='placed') assign(); else if(phase==='assigned') update(); draw(); }
  function draw(){
    let s=alGrid(o,[0,.1,.2,.3,.4],[0,1,2,3,4,5],'타율','방어율',v=>v.toFixed(1),null);
    if(asg) P.forEach((p,i)=>s+=`<line class="al-ln" style="stroke:${COL[asg[i]]}" x1="${sx(p[0])}" y1="${sy(p[1])}" x2="${sx(C[asg[i]][0])}" y2="${sy(C[asg[i]][1])}"/>`);
    P.forEach((p,i)=>{ s+=`<circle class="al-kp" style="fill:${asg?COL[asg[i]]:'#8a94a3'}" cx="${sx(p[0])}" cy="${sy(p[1])}" r="5"/>`; if(labels) s+=`<text class="al-pl" x="${sx(p[0])+7}" y="${sy(p[1])+4}">${p[2]}</text>`; });
    extra.forEach(e=>s+=`<text class="al-new" x="${sx(e[0])}" y="${sy(e[1])+6}" text-anchor="middle" style="fill:${COL[e[2]]}">★</text>`);
    if(phase==='placed'||phase==='done') old.forEach((c,j)=>{ s+=`<text class="al-c old" x="${sx(c[0])}" y="${sy(c[1])+7}" text-anchor="middle" style="fill:${COL[j]}">${SH[j]}</text><line class="al-mv" style="stroke:${COL[j]}" x1="${sx(c[0])}" y1="${sy(c[1])}" x2="${sx(C[j][0])}" y2="${sy(C[j][1])}"/>`; });
    C.forEach((c,j)=>s+=`<text class="al-c" x="${sx(c[0])}" y="${sy(c[1])+8}" text-anchor="middle" style="fill:${COL[j]}">${SH[j]}</text>`);
    svg.innerHTML=s; svg.classList.toggle('pick',mode!=='');
    const can=phase==='placed'||phase==='assigned';
    $('kmStep').disabled=!can; $('kmAll').disabled=!can; $('kmNew').disabled=phase!=='done';
    $('kmStep').textContent=phase==='assigned'?'③ 평균 위치로 옮기기':'② 가까운 중심점에 묶기';
    $('kmLab').textContent=labels?'포지션 이름 가리기':'포지션 이름 보기';
    $('kmLog').innerHTML=log.map(x=>`<li>${x}</li>`).join('');
    B.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===src));
  }
  svg.addEventListener('click',ev=>{
    if(!mode) return;
    const pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; const q=pt.matrixTransform(svg.getScreenCTM().inverse());
    const v=[Math.min(.45,Math.max(0,o.x0+(q.x-o.L)/(o.W-o.L-o.R)*(o.x1-o.x0))), Math.min(5,Math.max(0,o.y0+(o.H-o.B-q.y)/(o.H-o.T-o.B)*(o.y1-o.y0)))];
    if(mode==='place'){ C.push(v); if(C.length===3){ mode=''; phase='placed'; msg('① 중심점 3개를 놓았어요. 「다음 단계」를 눌러 묶어 보세요.'); } else msg(`중심점 ${C.length}개를 놓았어요. ${3-C.length}개 더 눌러요.`); }
    else if(mode==='new'){ let b=0; C.forEach((c,j)=>{if(dist(v,c)<dist(v,C[b]))b=j;}); extra.push([v[0],v[1],b]);
      msg(`새 선수(타율 ${v[0].toFixed(3)}, 방어율 ${v[1].toFixed(2)})는 가장 가까운 <b>${SH[b]}</b> 군집에 들어가요. 교과서처럼, 새로운 데이터가 추가되면 군집 3개 중 한 곳에 포함돼요. 더 눌러 봐도 좋아요.`); }
    draw();
  });
  B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>start(b.dataset.s));
  $('kmStep').onclick=step;
  $('kmAll').onclick=()=>{ let g=0; while((phase==='placed'||phase==='assigned')&&g++<60){ if(phase==='placed') assign(); else update(); } draw(); };
  $('kmLab').onclick=()=>{labels=!labels; draw();};
  $('kmNew').onclick=()=>{mode='new'; msg('그래프에서 새 선수의 자리를 눌러 보세요.'); draw();};
  msg('위에서 <b>시작 위치</b>를 골라 주세요. 회색 점 14개가 선수들이에요(포지션은 가려 두었어요). 「포지션 이름 보기」의 중간·중 = 중간 투수, 마 = 마무리 투수, 선 = 선발 투수예요.');
  draw();
})();

/* 04 알고리즘 고르기: 공용 sorter와 같은 모양, 오답 문구만 「교과서 짝은 ○○예요」로 */
function alPick(box,cfg){
  const B=$(box);
  function start(){
    const order=shuffle(cfg.items.map((_,i)=>i)); let pos=0, ok=0;
    B.innerHTML=`<div class="sit"><div class="cnt"></div><div class="ic"></div><div class="sq"></div><div class="row btns">${cfg.cats.map((c,j)=>`<button class="btn sm cat" style="--k:${c.k}" data-j="${j}">${c.n}</button>`).join('')}</div><div class="fb"></div><div class="row nx" style="margin-top:8px"></div></div><div class="board" style="--n:${cfg.cats.length}">${cfg.cats.map(c=>`<div style="--k:${c.k}"><b>${c.n}</b></div>`).join('')}</div>`;
    const sq=B.querySelector('.sq'), ic=B.querySelector('.ic'), cnt=B.querySelector('.cnt'), fb=B.querySelector('.fb'), nx=B.querySelector('.nx'), btns=[...B.querySelectorAll('.cat')], cols=[...B.querySelectorAll('.board>div')];
    function show(){
      if(pos>=order.length){ cnt.textContent=''; ic.textContent='🎉'; sq.innerHTML=`${order.length}개 중 <b>${ok}개</b>를 교과서 짝과 같게 골랐어요.`; fb.innerHTML=cfg.end||''; btns.forEach(b=>b.style.display='none'); nx.innerHTML='<button class="btn ghost sm">처음부터 다시</button>'; nx.firstChild.onclick=start; return; }
      const it=cfg.items[order[pos]]; cnt.textContent=`${pos+1} / ${order.length}`; ic.textContent=it.ic||''; sq.innerHTML=it.t; fb.textContent=''; nx.innerHTML=''; btns.forEach(b=>{b.disabled=false;b.style.display='';});
    }
    btns.forEach(b=>b.onclick=()=>{
      const it=cfg.items[order[pos]], right=+b.dataset.j===it.c; if(right) ok++;
      btns.forEach(x=>x.disabled=true);
      fb.innerHTML=(right?`<span class="ok">맞아요!</span> `:`<span class="ng">교과서 짝은 <b>${cfg.cats[it.c].n}</b>예요.</span> `)+(it.w||'');
      const sp=document.createElement('span'); sp.innerHTML=it.short||it.t; if(!right) sp.className='x'; cols[it.c].appendChild(sp);
      nx.innerHTML='<button class="btn sm">다음 →</button>'; nx.firstChild.onclick=()=>{pos++;show();}; nx.firstChild.focus();
    });
    show();
  }
  start();
}
/* 04 알고리즘 고르기 (84쪽 스스로 해결하기 + 예시) */
alPick('pickGame',{
  cats:[{n:'선형 회귀',k:'#1f9d74'},{n:'로지스틱 회귀',k:'#c98a00'},{n:'k-최근접 이웃',k:'#9b4fc4'},{n:'의사결정트리',k:'#d64535'},{n:'k-평균',k:'#2f6fd0'}],
  items:[
    {t:'어떤 종류의 펭귄인지 분류하기 위한 문제',short:'펭귄 종류 분류',c:2,ic:'🐧',w:'정답(종류)이 있는 지도학습의 분류 문제예요. 교과서는 가까운 이웃 펭귄들의 종류를 보고 다수결로 정하는 k-최근접 이웃을 골랐어요. → <span class="mono">KNeighborsClassifier( )</span>'},
    {t:'친구들이 정보 데이터 분석 과제를 수행하기 위해 모둠을 구성하는 문제',short:'모둠 구성',c:4,ic:'👥',w:'정해진 정답 없이 비슷한 친구끼리 묶는 군집화 문제라 비지도학습 알고리즘인 k-평균이 적합해요. → <span class="mono">KMeans</span>'},
    {t:'성적을 예측하는 문제',short:'성적 예측',c:0,ic:'📝',w:'성적처럼 이어지는 숫자를 예측하는 회귀 문제라 선형 회귀가 적합해요. → <span class="mono">LinearRegression( )</span>'},
    {t:'트리 구조를 사용하여 분류할 수 있는 문제',short:'트리 구조 분류',c:3,ic:'🌳',w:'질문을 따라 내려가는 트리 구조로 분류하는 알고리즘은 의사결정트리예요. → <span class="mono">DecisionTreeClassifier( )</span>'},
    {t:'심장마비가 발생할지 아닐지 구분하는 문제',short:'심장마비 여부',c:1,ic:'❤️',w:'발생한다(1)/아니다(0)로 나누는 이진 분류 문제라 로지스틱 회귀가 적합해요. → <span class="mono">LogisticRegression( )</span>'},
    {t:'(예시) 하루 운동 시간으로 소모 칼로리가 몇 kcal일지 예측하는 문제',short:'예시 · 소모 칼로리',c:0,ic:'🏃',w:'답이 「몇 kcal」라는 숫자예요. 숫자를 예측하는 문제에는 선형 회귀를 써요. → <span class="mono">LinearRegression( )</span>'},
    {t:'(예시) 정답 없이 노래 재생 기록이 비슷한 사람끼리 몇 무리로 묶는 문제',short:'예시 · 음악 취향 묶기',c:4,ic:'🎧',w:'정답이 없고 「비슷한 것끼리 묶기」가 목적이니 군집, k-평균이에요. 몇 무리로 묶을지(k)는 사람이 정해요. → <span class="mono">KMeans</span>'},
    {t:'(예시) 결제 기록으로 이 결제가 사기일 확률을 구해 사기인지 아닌지 나누는 문제',short:'예시 · 사기 결제 여부',c:1,ic:'💳',w:'두 가지 중 하나로 나누면서 확률도 알려 줘야 해요. 클래스에 속할 확률을 제공하는 로지스틱 회귀가 어울려요. → <span class="mono">LogisticRegression( )</span>'},
  ],
  end:'먼저 <b>정답이 있는지</b>(없으면 k-평균), 있다면 답이 <b>숫자</b>인지(선형 회귀) <b>범주</b>인지(분류 알고리즘) 물어요. 분류 알고리즘 중에서는 확률이 필요한지, 규칙을 설명해야 하는지, 가까운 이웃으로 정할지에 따라 골라요.'
});
chips('selfCheck','selfCheckPick',['문제에 적합한 알고리즘을 선정할 수 있다','선형 회귀와 로지스틱 회귀의 차이를 말할 수 있다','의사결정트리를 따라 결과를 찾을 수 있다','k-평균이 군집을 만드는 과정을 설명할 수 있다'],true);

const MEMOLIST=[['algoDiff','타율 예측과 3할 타자 분류: 무엇이 달라 알고리즘이 다를까'],['treeGood','의사결정트리의 좋은 점과 그 장점이 중요한 상황'],['myData','우리 학교 데이터·문제·알고리즘'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);
