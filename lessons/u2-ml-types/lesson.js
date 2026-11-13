/* 공통: 같은 결과가 나오는 난수(예시 데이터 만들기용) */
function mtRand(seed){ let a=seed>>>0; return ()=>{a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296;}; }
function mtGauss(r){ let u=0,v=0; while(!u) u=r(); while(!v) v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
const mtWon=n=>Math.round(n).toLocaleString('ko-KR');

/* 01 유형 분류 게임 (교과서 61·74쪽, 부록 222~224쪽, 78쪽) */
sorter('typeGame',{
  cats:[{n:'🏷️ 지도학습 · 분류',k:'#2f6fd0'},{n:'📈 지도학습 · 예측(회귀)',k:'#1f9d74'},{n:'🧩 비지도학습 · 군집',k:'#e0702b'},{n:'🎯 강화 학습',k:'#9b4fc4'}],
  items:[
    {t:'꽃의 종류별로 모든 속성값을 알고 있을 때, 새로운 꽃의 속성으로 <b>꽃의 종류</b>를 알아낸다.',short:'붓꽃 (나) 종류 알기',c:0,ic:'🌸',w:'교과서 61쪽 (나): 정답을 알고 학습하고 종류를 구분하므로 분류의 문제예요.'},
    {t:'꽃의 종류별로 모든 속성값을 알고 있을 때, 새로운 꽃의 <b>모르는 수치형 속성값</b>을 구한다.',short:'붓꽃 (다) 수치 구하기',c:1,ic:'📏',w:'교과서 61쪽 (다): 모르는 속성의 정확한 수치를 예측하는 회귀의 문제예요.'},
    {t:'꽃잎·꽃받침의 길이와 너비로, 정확한 종류는 몰라도 <b>서로 다른 종류인지 아닌지</b> 구분한다.',short:'붓꽃 (가) 다른 종류인지',c:2,ic:'🌼',w:'교과서 61쪽 (가): 정답 없이 서로 다른 무리인지 구분하는 군집의 문제예요.'},
    {t:'환자의 건강 정보 데이터로 심장 마비 <b>발병 여부</b>를 구분한다.',short:'심장 마비 발병 분류',c:0,ic:'❤️',w:'부록 222쪽: 정답 열(output)이 있고 결과가 두 클래스 중 하나라 분류예요.'},
    {t:'평균 소득, 방의 수 등 주택 데이터로 <b>주택 가격</b>을 알아낸다.',short:'주택 가격 예측',c:1,ic:'🏠',w:'부록 223쪽: 정답 열(Price)이 있고 결과가 연속된 숫자라 예측(회귀)이에요.'},
    {t:'정답 없이 콜레라 환자 위치를 거리로 따져 <b>어느 펌프 근처에 몰리는지</b> 찾는다.',short:'콜레라 원인 발견',c:2,ic:'🗺️',w:'부록 224쪽: 레이블 없는 데이터에서 비슷한 것끼리 묶어 패턴을 찾는 비지도학습이에요.'},
    {t:'알파고가 수많은 대국을 두며 <b>이기는 쪽으로 보상</b>을 받아 바둑을 학습한다.',short:'알파고의 바둑',c:3,ic:'⚫',w:'교과서 74쪽: 알파고도 강화 학습을 통해서 바둑을 학습했어요.'},
    {t:'메일이 <b>스팸 메일인지 아닌지</b> 가려낸다.',short:'스팸 메일 가려내기',c:0,ic:'📧',w:'교과서 78쪽에도 나오는 스팸 메일 분류예요. 스팸/스팸 아님 두 클래스 중 하나로 나눠요.'},
    {t:'(예시) 게임 캐릭터가 여러 번 움직여 보며 <b>점수를 얻으면 그 행동을 늘리고</b>, 점수를 잃으면 줄인다.',short:'게임 캐릭터 (예시)',c:3,ic:'🎮',w:'행동에 따른 보상과 벌로 시행착오를 거치며 배우니 강화 학습이에요.'},
  ],
  end:'먼저 <b>레이블이 있는지</b> 보고, 있다면 알아내는 것이 <b>갈래(분류)</b>인지 <b>숫자(예측·회귀)</b>인지 봐요. 정답 대신 <b>보상</b>으로 배우면 강화 학습이에요.'
});

/* 02 두 모델 나란히: 분류(심장 마비, 예시) vs 예측(주택 가격, 예시) */
(function(){
  const B=$('svGame');
  /* 예시 환자: [나이, 최대 심박수, output] — 실제 heart.csv 값이 아님 */
  const HEART=[[41,172,1],[45,165,1],[52,174,1],[39,182,1],[56,160,1],[48,168,1],[44,178,1],[58,171,1],[51,155,1],
               [63,132,0],[60,140,0],[67,125,0],[58,138,0],[55,118,0],[64,150,0],[70,145,0],[50,128,0],[47,142,0]];
  const HX=a=>40+(a-30)/45*260, HY=t=>190-(t-100)/100*170;   /* 그래프 위 위치 */
  /* 예시 식: 가격 = -1,101,200 + 21.5 × 평균 소득 + 122,000 × 방의 수 (나머지 속성은 평균으로 고정) */
  const price=(inc,room)=>-1101200+21.5*inc+122000*room;
  const r=mtRand(223), HOUSE=[]; for(let i=0;i<22;i++){ const inc=42000+r()*56000, room=5.5+r()*3; HOUSE.push([inc,price(inc,room)+mtGauss(r)*90000,room]); }
  const PX=i=>40+(i-40000)/60000*260, PY=p=>190-p/2400000*170;
  const seenH=new Set(), seenP=new Set();
  B.innerHTML=`<div class="sv">
    <div class="sv-p" style="--k:#d62828"><h4>❤️ 심장 마비 발병 분류 <small>(가까운 환자 5명의 다수결 · k-최근접 이웃은 04에서 배워요)</small></h4>
      <svg viewBox="0 0 320 222" class="sv-svg" id="svH" role="img" aria-label="나이와 최대 심박수 산점도"></svg>
      <div class="ctrl"><label>나이</label><input type="range" id="svAge" min="32" max="73" value="57"><output id="svAgeO"></output></div>
      <div class="ctrl"><label>최대 심박수</label><input type="range" id="svHr" min="105" max="195" value="150"><output id="svHrO"></output></div>
      <div class="sv-out"><span>모델의 답</span><div class="sv-cls"><b data-c="0">발병 가능성 낮음 (0)</b><b data-c="1">발병 가능성 높음 (1)</b></div></div>
      <div class="sv-cnt" id="svHc"></div></div>
    <div class="sv-p" style="--k:#2f6fd0"><h4>🏠 주택 가격 예측 <small>(선형 회귀)</small></h4>
      <svg viewBox="0 0 320 222" class="sv-svg" id="svP" role="img" aria-label="평균 소득과 주택 가격 산점도"></svg>
      <div class="ctrl"><label>평균 소득</label><input type="range" id="svInc" min="40000" max="100000" step="500" value="68500"><output id="svIncO"></output></div>
      <div class="ctrl"><label>방의 수</label><input type="range" id="svRoom" min="4" max="10" step="0.1" value="7"><output id="svRoomO"></output></div>
      <div class="sv-out"><span>모델의 답</span><div class="sv-num" id="svNum"></div></div>
      <div class="sv-cnt" id="svPc"></div></div>
  </div>
  <div class="row" style="margin-top:10px"><button class="btn sm" id="svCmp">결과 칸 비교하기</button></div>
  <div class="sv-end" id="svEnd"></div>`;
  function axes(xl,yl,xt,yt){ let s=`<line class="ax" x1="40" y1="190" x2="305" y2="190"/><line class="ax" x1="40" y1="12" x2="40" y2="190"/>`;
    xt.forEach(([v,t])=>s+=`<text class="tk" x="${v}" y="204">${t}</text>`); yt.forEach(([v,t])=>s+=`<text class="tk" x="34" y="${v+4}" text-anchor="end">${t}</text>`);
    return s+`<text class="al" x="300" y="218" text-anchor="end">${xl}</text><text class="al" x="44" y="10">${yl}</text>`; }
  function heart(){
    const age=+$('svAge').value, hr=+$('svHr').value; $('svAgeO').textContent=age+'세'; $('svHrO').textContent=hr;
    const d=HEART.map((p,i)=>({i,d:Math.hypot(HX(p[0])-HX(age),HY(p[1])-HY(hr))})).sort((a,b)=>a.d-b.d||a.i-b.i).slice(0,5);
    const ones=d.filter(o=>HEART[o.i][2]===1).length, out=ones>=3?1:0; seenH.add(out);
    let s=axes('나이','최대 심박수',[[HX(40),'40'],[HX(50),'50'],[HX(60),'60'],[HX(70),'70']],[[HY(120),'120'],[HY(150),'150'],[HY(180),'180']]);
    s+=`<circle class="sv-rng" cx="${HX(age)}" cy="${HY(hr)}" r="${d[4].d+5}"/>`;
    HEART.forEach((p,i)=>{ const near=d.some(o=>o.i===i), x=HX(p[0]), y=HY(p[1]);
      s+=p[2]?`<circle cx="${x}" cy="${y}" r="5" class="h1${near?' nb':''}"/>`:`<rect x="${x-4.5}" y="${y-4.5}" width="9" height="9" class="h0${near?' nb':''}"/>`; });
    s+=`<circle cx="${HX(age)}" cy="${HY(hr)}" r="7" class="nw"/><text class="lg" x="300" y="24" text-anchor="end">● 1(높음)  ■ 0(낮음)  ◉ 새 환자</text>`;
    $('svH').innerHTML=s;
    B.querySelectorAll('.sv-cls b').forEach(b=>b.classList.toggle('on',+b.dataset.c===out));
    $('svHc').innerHTML=`가까운 환자 5명 중 1이 <b>${ones}</b>명 · 지금까지 나온 답 <b>${seenH.size}</b>가지`;
  }
  function house(){
    const inc=+$('svInc').value, room=+$('svRoom').value, p=price(inc,room); $('svIncO').textContent=(inc/10000).toFixed(2)+'만 달러'; $('svRoomO').textContent=room.toFixed(1);
    seenP.add(Math.round(p/100));
    let s=axes('평균 소득(달러)','가격(달러)',[[PX(50000),'5만'],[PX(70000),'7만'],[PX(90000),'9만']],[[PY(500000),'50만'],[PY(1000000),'100만'],[PY(1500000),'150만'],[PY(2000000),'200만']]);
    HOUSE.forEach(h=>s+=`<circle cx="${PX(h[0]).toFixed(1)}" cy="${PY(h[1]).toFixed(1)}" r="4" class="hp"/>`);
    s+=`<line class="sv-line" x1="${PX(40000)}" y1="${PY(price(40000,room))}" x2="${PX(100000)}" y2="${PY(price(100000,room))}"/>`;
    s+=`<line class="sv-guide" x1="${PX(inc)}" y1="190" x2="${PX(inc)}" y2="${PY(p)}"/><line class="sv-guide" x1="40" y1="${PY(p)}" x2="${PX(inc)}" y2="${PY(p)}"/><circle cx="${PX(inc)}" cy="${PY(p)}" r="7" class="nw"/>`;
    s+=`<text class="lg" x="300" y="24" text-anchor="end">● 예시 주택  ─ 모델의 직선</text>`;
    $('svP').innerHTML=s;
    $('svNum').innerHTML=`<b>${mtWon(Math.round(p/100)*100)}</b> 달러<small>약 ${Math.round(p/10000).toLocaleString('ko-KR')}만 달러</small>`;
    $('svPc').innerHTML=`입력을 조금만 바꿔도 답이 달라져요 · 지금까지 나온 답 <b>${seenP.size}</b>가지`;
  }
  ['svAge','svHr'].forEach(id=>$(id).addEventListener('input',heart));
  ['svInc','svRoom'].forEach(id=>$(id).addEventListener('input',house));
  $('svCmp').onclick=()=>{ $('svEnd').innerHTML=`<table class="sv-tbl"><tr><th></th><th>❤️ 심장 마비 발병</th><th>🏠 주택 가격</th></tr>
    <tr><td><b>정답(레이블) 열</b></td><td>output (0 또는 1)</td><td>Price (달러)</td></tr>
    <tr><td><b>지금까지 나온 답</b></td><td>${seenH.size}가지 — 아무리 바꿔도 두 칸 중 하나</td><td>${seenP.size}가지 — 바꿀 때마다 새 숫자</td></tr>
    <tr><td><b>답의 모양</b></td><td>정해진 <b>클래스(갈래)</b> 중 하나</td><td><b>연속된 값(숫자)</b></td></tr>
    <tr><td><b>유형</b></td><td><b>분류</b></td><td><b>예측(회귀)</b></td></tr></table>
    <p class="muted" style="font-size:.88rem;margin:6px 0 0">두 실습 모두 레이블이 있으니 지도학습이에요. 슬라이더를 더 움직여 「나온 답」의 개수가 어떻게 달라지는지 다시 눌러 확인해 보세요.</p>`; };
  heart(); house();
})();

/* 03 콜레라 모형 지도 (예시 좌표) — 부록 224쪽 코드 순서: 데이터 → 가장 가까운 펌프 → 해석 */
(function(){
  const B=$('chGame');
  const COL=['#d62828','#c9a300','#7b2cbf','#e0218a','#2b9348','#0096c7','#1d4ed8','#f77f00'];  /* 교과서 코드의 8색(red, yellow, purple, deeppink, lime, aqua, blue, orange)을 진하게 */
  const PUMP=[[205,140],[90,60],[330,70],[70,215],[300,225],[180,40],[380,160],[150,245]];
  const r=mtRand(1854), PT=[];
  for(let i=0;i<46;i++) PT.push([PUMP[0][0]+mtGauss(r)*26,PUMP[0][1]+mtGauss(r)*22]);
  [[1,3],[2,2],[3,3],[4,2],[5,1],[6,2],[7,2]].forEach(([p,n])=>{ for(let i=0;i<n;i++) PT.push([PUMP[p][0]+mtGauss(r)*24,PUMP[p][1]+mtGauss(r)*24]); });
  for(let i=0;i<5;i++) PT.push([30+r()*370,25+r()*240]);
  PT.forEach(p=>{p[0]=Math.max(12,Math.min(408,p[0])); p[1]=Math.max(12,Math.min(278,p[1]));});
  const near=PT.map(p=>{ let b=0,bd=1e9; PUMP.forEach((q,j)=>{const d=Math.hypot(p[0]-q[0],p[1]-q[1]); if(d<bd){bd=d;b=j;}}); return b; });
  const cnt=PUMP.map((_,j)=>near.filter(x=>x===j).length), top=cnt.indexOf(Math.max(...cnt));
  let stage=0, pick=null, km=null;
  const STREET=`<path class="st" d="M0 100 H420 M0 185 H420 M0 260 H420 M60 0 V290 M140 0 V290 M250 0 V290 M350 0 V290 M0 30 L420 120"/>`;
  B.innerHTML=`<div class="ch"><div class="ch-map"><svg viewBox="0 0 420 290" id="chSvg" role="img" aria-label="콜레라 환자와 펌프 위치 모형 지도"></svg></div>
    <div class="ch-side"><div class="ch-msg" id="chMsg"></div><div id="chBars"></div>
    <div class="row" style="margin-top:8px"><button class="btn sm" id="chNear">② 가장 가까운 펌프 찾기</button><button class="btn sm ghost" id="chKm">④ 더 해 보기: 펌프를 모른다면?</button><button class="btn sm ghost" id="chReset">처음부터</button></div></div></div>`;
  function draw(){
    let s=STREET;
    if(stage>=1&&!km) PT.forEach((p,i)=>{ const q=PUMP[near[i]]; s+=`<line class="ln" x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0]}" y2="${q[1]}" stroke="${COL[near[i]]}"/>`; });
    PT.forEach((p,i)=>{ const c=km?COL[[6,3,4][km.lab[i]]]:stage>=1?COL[near[i]]:'#8a94a3'; s+=`<circle class="pt" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.2" fill="${c}"/>`; });
    if(!km) PUMP.forEach((q,j)=>{ s+=`<g class="pm${pick===j?' on':''}${stage>=1?' can':''}" data-j="${j}" tabindex="${stage>=1?0:-1}" role="button" aria-label="펌프 ${j+1}"><rect x="${q[0]-10}" y="${q[1]-10}" width="20" height="20" rx="4" fill="#fff" stroke="${stage>=1?COL[j]:'#0f2742'}"/><text x="${q[0]}" y="${q[1]+4.5}">${j+1}</text></g>`; });
    if(km){ PUMP.forEach(q=>{ s+=`<rect x="${q[0]-6}" y="${q[1]-6}" width="12" height="12" rx="3" class="pm-ghost"/>`; });
      km.c.forEach((c,j)=>{ s+=`<g class="kc-c"><circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="11" fill="${COL[[6,3,4][j]]}"/><text x="${c[0].toFixed(1)}" y="${(c[1]+4.5).toFixed(1)}">★</text></g>`; }); }
    $('chSvg').innerHTML=s;
    $('chSvg').querySelectorAll('g.pm.can').forEach(g=>{ const f=()=>{ pick=+g.dataset.j; draw(); }; g.onclick=f; g.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); f(); } }; });
    msg();
  }
  function bars(){ const mx=Math.max(...cnt);
    $('chBars').innerHTML=stage>=1&&!km?`<div class="ch-bars">${cnt.map((n,j)=>`<div><span>펌프 ${j+1}</span><i style="width:${n/mx*100}%;background:${COL[j]}"></i><b>${n}</b></div>`).join('')}</div>`:''; }
  function msg(){
    const m=$('chMsg');
    if(km){ const big=km.size.indexOf(Math.max(...km.size)), c=km.c[big]; let bj=0,bd=1e9; PUMP.forEach((q,j)=>{const d=Math.hypot(c[0]-q[0],c[1]-q[1]); if(d<bd){bd=d;bj=j;}});
      m.innerHTML=km.done?`<b>묶기 끝!</b> 펌프 위치를 쓰지 않고 환자 위치만으로 3개의 묶음을 만들었어요. 가장 큰 묶음(${km.size[big]}명)의 중심 ★은 <b>펌프 ${bj+1}</b> 가까이에 있어요. 이것이 74쪽 옆단의 군집 알고리즘 <b>k-평균</b>이에요. 묶음의 뜻(「이 펌프 물이 원인일까?」)은 사람이 해석해요.`
        :`<b>k-평균 (k = 3)</b> · ${km.it}번째 단계. ★ 중심 3개를 정하고, 환자마다 가장 가까운 ★의 색으로 묶은 뒤, 묶음의 평균 위치로 ★을 옮겨요. 「④」를 계속 눌러 ★이 멈출 때까지 반복해요.`;
      return; }
    if(stage===0){ m.innerHTML=`<b>① 데이터 보기</b> · 회색 점은 콜레라 환자(${PT.length}명), 네모는 펌프 8개예요. 점에는 「어느 펌프 때문」이라는 <b>정답(레이블)이 없어요</b>. 어떻게 원인을 찾을 수 있을까요?`; bars(); return; }
    if(pick==null){ m.innerHTML=`<b>② 거리 계산 끝</b> · 환자마다 펌프 8개와의 거리를 재서 <b>가장 가까운 펌프의 색</b>으로 칠했어요. <b>③ 해석</b>: 원인으로 의심되는 펌프를 지도에서 눌러 보세요.`; bars(); return; }
    m.innerHTML=pick===top?`<span class="ok">맞아요!</span> 환자 ${PT.length}명 중 <b>${cnt[top]}명</b>이 펌프 ${top+1}에 가장 가까워요. 정답 없이 <b>거리로 비슷한 것끼리 묶었더니</b> 한 펌프 근처에 몰린 패턴이 드러났어요. 실제 역사에서도 이런 분석으로 한 펌프의 물이 원인으로 지목되었어요.`
      :`<span class="ng">다시 보세요.</span> 펌프 ${pick+1}에 가장 가까운 환자는 ${cnt[pick]}명이에요. 오른쪽 막대에서 환자가 가장 많이 몰린 펌프를 찾아보세요.`;
    bars();
  }
  function kmStep(){
    if(!km){ const c0=[PT[0].slice()]; while(c0.length<3){ let bi=0,bd=-1; PT.forEach((p,i)=>{const d=Math.min(...c0.map(c=>Math.hypot(p[0]-c[0],p[1]-c[1]))); if(d>bd){bd=d;bi=i;}}); c0.push(PT[bi].slice()); }
      km={c:c0,lab:PT.map(()=>0),size:[0,0,0],it:0,done:false}; }
    else if(km.done) return;
    km.lab=PT.map(p=>{ let b=0,bd=1e9; km.c.forEach((c,j)=>{const d=Math.hypot(p[0]-c[0],p[1]-c[1]); if(d<bd){bd=d;b=j;}}); return b; });
    const nc=km.c.map((c,j)=>{ const m=PT.filter((_,i)=>km.lab[i]===j); return m.length?[m.reduce((a,p)=>a+p[0],0)/m.length,m.reduce((a,p)=>a+p[1],0)/m.length]:c; });
    km.size=[0,1,2].map(j=>km.lab.filter(x=>x===j).length);
    const moved=nc.some((c,j)=>Math.hypot(c[0]-km.c[j][0],c[1]-km.c[j][1])>0.01); km.c=nc; km.it++; if(!moved) km.done=true;
    $('chKm').textContent=km.done?'④ 묶기 끝':'④ 한 단계 더 (k-평균)'; draw();
  }
  $('chNear').onclick=()=>{ km=null; $('chKm').textContent='④ 더 해 보기: 펌프를 모른다면?'; stage=1; draw(); };
  $('chKm').onclick=kmStep;
  $('chReset').onclick=()=>{ stage=0; pick=null; km=null; $('chKm').textContent='④ 더 해 보기: 펌프를 모른다면?'; draw(); };
  draw();
})();

/* 04 k-최근접 이웃 (그림 Ⅱ-4, Iris1.csv 꽃받침 길이·너비 150송이) */
const IRIS=[[5.1,3.5,0],[4.9,3.0,0],[4.7,3.2,0],[4.6,3.1,0],[5.0,3.6,0],[5.4,3.9,0],[4.6,3.4,0],[5.0,3.4,0],[4.4,2.9,0],[4.9,3.1,0],[5.4,3.7,0],[4.8,3.4,0],[4.8,3.0,0],[4.3,3.0,0],[5.8,4.0,0],[5.7,4.4,0],[5.4,3.9,0],[5.1,3.5,0],[5.7,3.8,0],[5.1,3.8,0],[5.4,3.4,0],[5.1,3.7,0],[4.6,3.6,0],[5.1,3.3,0],[4.8,3.4,0],[5.0,3.0,0],[5.0,3.4,0],[5.2,3.5,0],[5.2,3.4,0],[4.7,3.2,0],[4.8,3.1,0],[5.4,3.4,0],[5.2,4.1,0],[5.5,4.2,0],[4.9,3.1,0],[5.0,3.2,0],[5.5,3.5,0],[4.9,3.1,0],[4.4,3.0,0],[5.1,3.4,0],[5.0,3.5,0],[4.5,2.3,0],[4.4,3.2,0],[5.0,3.5,0],[5.1,3.8,0],[4.8,3.0,0],[5.1,3.8,0],[4.6,3.2,0],[5.3,3.7,0],[5.0,3.3,0],[7.0,3.2,1],[6.4,3.2,1],[6.9,3.1,1],[5.5,2.3,1],[6.5,2.8,1],[5.7,2.8,1],[6.3,3.3,1],[4.9,2.4,1],[6.6,2.9,1],[5.2,2.7,1],[5.0,2.0,1],[5.9,3.0,1],[6.0,2.2,1],[6.1,2.9,1],[5.6,2.9,1],[6.7,3.1,1],[5.6,3.0,1],[5.8,2.7,1],[6.2,2.2,1],[5.6,2.5,1],[5.9,3.2,1],[6.1,2.8,1],[6.3,2.5,1],[6.1,2.8,1],[6.4,2.9,1],[6.6,3.0,1],[6.8,2.8,1],[6.7,3.0,1],[6.0,2.9,1],[5.7,2.6,1],[5.5,2.4,1],[5.5,2.4,1],[5.8,2.7,1],[6.0,2.7,1],[5.4,3.0,1],[6.0,3.4,1],[6.7,3.1,1],[6.3,2.3,1],[5.6,3.0,1],[5.5,2.5,1],[5.5,2.6,1],[6.1,3.0,1],[5.8,2.6,1],[5.0,2.3,1],[5.6,2.7,1],[5.7,3.0,1],[5.7,2.9,1],[6.2,2.9,1],[5.1,2.5,1],[5.7,2.8,1],[6.3,3.3,2],[5.8,2.7,2],[7.1,3.0,2],[6.3,2.9,2],[6.5,3.0,2],[7.6,3.0,2],[4.9,2.5,2],[7.3,2.9,2],[6.7,2.5,2],[7.2,3.6,2],[6.5,3.2,2],[6.4,2.7,2],[6.8,3.0,2],[5.7,2.5,2],[5.8,2.8,2],[6.4,3.2,2],[6.5,3.0,2],[7.7,3.8,2],[7.7,2.6,2],[6.0,2.2,2],[6.9,3.2,2],[5.6,2.8,2],[7.7,2.8,2],[6.3,2.7,2],[6.7,3.3,2],[7.2,3.2,2],[6.2,2.8,2],[6.1,3.0,2],[6.4,2.8,2],[7.2,3.0,2],[7.4,2.8,2],[7.9,3.8,2],[6.4,2.8,2],[6.3,2.8,2],[6.1,2.6,2],[7.7,3.0,2],[6.3,3.4,2],[6.4,3.1,2],[6.0,3.0,2],[6.9,3.1,2],[6.7,3.1,2],[6.9,3.1,2],[5.8,2.7,2],[6.8,3.2,2],[6.7,3.3,2],[6.7,3.0,2],[6.3,2.5,2],[6.5,3.0,2],[6.2,3.4,2],[5.9,3.0,2]];
const IRIS_NAME=['세토사','버시컬러','버지니카'], IRIS_COL=['#2f7fd0','#d64535','#3f9d3a'];
function knnVote(data,q,k){
  const d=data.map((p,i)=>({i,d:Math.hypot(p[0]-q[0],p[1]-q[1])})).sort((a,b)=>a.d-b.d||a.i-b.i);
  const nb=d.slice(0,k), v=[0,0,0]; nb.forEach(o=>v[data[o.i][2]]++);
  const mx=Math.max(...v), win=v.map((n,c)=>n===mx?c:-1).filter(c=>c>=0);
  return {nb,v,win,tieEdge:k<d.length&&Math.abs(d[k].d-d[k-1].d)<1e-9};
}
(function(){
  const B=$('knnGame'), S=120, X0=50, Y0=20, XMIN=4.2, YMAX=4.5;
  const sx=x=>X0+(x-XMIN)*S, sy=y=>Y0+(YMAX-y)*S;
  let q=[5.6,2.9], k=5;
  B.innerHTML=`<div class="kn"><div class="kn-plot"><svg viewBox="0 0 520 372" id="knSvg" tabindex="0" role="application" aria-label="붓꽃 산점도. 눌러서 새 데이터를 놓고 방향키로 움직여요."></svg></div>
    <div class="kn-side"><div class="ctrl"><label>k</label><input type="range" id="knK" min="1" max="15" value="5"><output id="knKo"></output></div>
    <div class="row"><button class="btn sm ghost" id="knBook">그림 Ⅱ-4 위치</button></div>
    <div id="knVote"></div><div id="knRes" class="kn-res"></div><div id="knList"></div></div></div>`;
  const svg=$('knSvg');
  function draw(){
    const r=knnVote(IRIS,q,k), rad=r.nb[k-1].d*S;
    let s='';
    for(let x=4.4;x<=7.85;x+=0.4) s+=`<line class="gd" x1="${sx(x)}" y1="${Y0}" x2="${sx(x)}" y2="${sy(2)}"/><text class="tk" x="${sx(x)}" y="${sy(2)+16}">${x.toFixed(1)}</text>`;
    for(let y=2;y<=4.45;y+=0.4) s+=`<line class="gd" x1="${X0}" y1="${sy(y)}" x2="${sx(7.9)}" y2="${sy(y)}"/><text class="tk" x="${X0-6}" y="${sy(y)+4}" text-anchor="end">${y.toFixed(1)}</text>`;
    s+=`<text class="al" x="${sx(7.9)}" y="368" text-anchor="end">꽃받침 길이</text><text class="al" x="${X0+4}" y="${Y0+12}">꽃받침 너비</text>`;
    s+=`<circle class="kn-rng" cx="${sx(q[0])}" cy="${sy(q[1])}" r="${Math.max(rad,6)}"/>`;
    const nbSet=new Set(r.nb.map(o=>o.i));
    IRIS.forEach((p,i)=>{ const x=sx(p[0]), y=sy(p[1]), c=IRIS_COL[p[2]], on=nbSet.has(i)?' nb':'';
      s+=p[2]===0?`<circle class="ip${on}" cx="${x}" cy="${y}" r="5" fill="${c}"/>`
        :p[2]===1?`<path class="ip x${on}" d="M${x-4.5} ${y-4.5}L${x+4.5} ${y+4.5}M${x+4.5} ${y-4.5}L${x-4.5} ${y+4.5}" stroke="${c}"/>`
        :`<path class="ip${on}" d="M${x} ${y-5.5}L${x+5} ${y+3.5}L${x-5} ${y+3.5}Z" fill="${c}"/>`; });
    s+=`<g class="kn-new"><circle cx="${sx(q[0])}" cy="${sy(q[1])}" r="8"/><path d="M${sx(q[0])-5} ${sy(q[1])-5}L${sx(q[0])+5} ${sy(q[1])+5}M${sx(q[0])+5} ${sy(q[1])-5}L${sx(q[0])-5} ${sy(q[1])+5}"/></g>`;
    s+=`<g class="kn-lg" transform="translate(${sx(7.1)} ${Y0+6})"><rect width="${sx(7.9)-sx(7.1)}" height="70" rx="6"/>${IRIS_NAME.map((n,c)=>`<text x="10" y="${20+c*18}" fill="${IRIS_COL[c]}">${['●','✕','▲'][c]}</text><text x="26" y="${20+c*18}">${n}</text>`).join('')}</g>`;
    svg.innerHTML=s;
    $('knKo').textContent=k;
    const mx=Math.max(...r.v,1);
    $('knVote').innerHTML=`<div class="kn-v">${IRIS_NAME.map((n,c)=>`<div><span style="color:${IRIS_COL[c]}">${['●','✕','▲'][c]} ${n}</span><i style="width:${r.v[c]/mx*100}%;background:${IRIS_COL[c]}"></i><b>${r.v[c]}</b></div>`).join('')}</div>`;
    $('knRes').innerHTML=`새로운 데이터 (${q[0].toFixed(2)}, ${q[1].toFixed(2)}) · 가까운 <b>${k}</b>개 중 `+(r.win.length===1?`<b style="color:${IRIS_COL[r.win[0]]}">${IRIS_NAME[r.win[0]]}</b>가 가장 많아 <b style="color:${IRIS_COL[r.win[0]]}">${IRIS_NAME[r.win[0]]}</b>(으)로 분류해요.`
      :`${r.win.map(c=>IRIS_NAME[c]).join('·')}가 <b>동점</b>이에요. 다수결로 하나를 정하기 어려우니 k를 바꿔 보세요.`)
      +(r.tieEdge?`<small>${k}번째 이웃과 같은 거리에 점이 더 있어요. 같은 거리면 데이터 순서가 앞선 점을 먼저 셌어요.</small>`:'');
    $('knList').innerHTML=`<details><summary>가까운 이웃 ${k}송이 보기</summary><table class="kn-tbl"><tr><th>순위</th><th>품종</th><th>꽃받침 길이</th><th>너비</th><th>거리</th></tr>${r.nb.map((o,j)=>`<tr><td>${j+1}</td><td style="color:${IRIS_COL[IRIS[o.i][2]]}">${IRIS_NAME[IRIS[o.i][2]]}</td><td>${IRIS[o.i][0]}</td><td>${IRIS[o.i][1]}</td><td>${o.d.toFixed(3)}</td></tr>`).join('')}</table></details>`;
  }
  function place(e){ const pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const m=svg.getScreenCTM(); if(!m) return; const p=pt.matrixTransform(m.inverse());
    q=[Math.max(4.3,Math.min(7.9,XMIN+(p.x-X0)/S)), Math.max(2,Math.min(4.4,YMAX-(p.y-Y0)/S))]; q=[Math.round(q[0]*100)/100,Math.round(q[1]*100)/100]; draw(); svg.focus(); }
  svg.addEventListener('click',place);
  svg.addEventListener('keydown',e=>{ const d={ArrowLeft:[-0.05,0],ArrowRight:[0.05,0],ArrowUp:[0,0.05],ArrowDown:[0,-0.05]}[e.key]; if(!d) return; e.preventDefault();
    q=[Math.round(Math.max(4.3,Math.min(7.9,q[0]+d[0]))*100)/100, Math.round(Math.max(2,Math.min(4.4,q[1]+d[1]))*100)/100]; draw(); });
  $('knK').addEventListener('input',()=>{ k=+$('knK').value; draw(); });
  $('knBook').onclick=()=>{ q=[5.6,2.9]; k=5; $('knK').value=5; draw(); svg.focus(); };
  draw();
})();

/* 05 유형 고르기 도우미 (교과서 74쪽 옆단 알고리즘 목록) */
(function(){
  const B=$('pickGame'); let a=null,b=null;
  const R={
    cls:{t:'지도학습 · 분류',k:'#2f6fd0',al:'k-최근접 이웃(k-NN) · 서포트 벡터 머신(SVM) · 의사결정트리 · 로지스틱 회귀',ex:'심장 마비 발병 분류, 스팸 메일 분류, 붓꽃 종류 알기'},
    reg:{t:'지도학습 · 예측(회귀)',k:'#1f9d74',al:'선형 회귀',ex:'주택 가격 예측, 붓꽃의 모르는 수치 구하기'},
    clu:{t:'비지도학습 · 군집',k:'#e0702b',al:'k-평균(k-means)',ex:'콜레라 환자 위치로 원인 찾기, 서로 다른 종류의 꽃인지 구분하기'},
    rl:{t:'강화 학습',k:'#9b4fc4',al:'행동에 따른 보상이 있는지 판단할 수 있어야 해요',ex:'알파고의 바둑 학습'}
  };
  function draw(){
    const key=a==='no'?'clu':a==='rw'?'rl':a==='yes'&&b?b:null;
    B.innerHTML=`<div class="pk"><div class="pk-q"><b>① 데이터에 정답(레이블)이 있나요?</b><div class="row">
        <button class="btn sm${a==='yes'?'':' ghost'}" data-a="yes">있어요</button><button class="btn sm${a==='no'?'':' ghost'}" data-a="no">없어요</button><button class="btn sm${a==='rw'?'':' ghost'}" data-a="rw">정답 대신 보상·벌</button></div>
      ${a==='yes'?`<b style="display:block;margin-top:10px">② 알아내려는 것은?</b><div class="row"><button class="btn sm${b==='cls'?'':' ghost'}" data-b="cls">정해진 갈래 중 하나</button><button class="btn sm${b==='reg'?'':' ghost'}" data-b="reg">연속된 숫자</button></div>`:''}</div>
      <div class="pk-r">${key?`<div class="pk-card" style="--k:${R[key].k}"><span class="kicker">이 문제의 유형</span><h4>${R[key].t}</h4><p><b>교과서 74쪽 알고리즘</b> ${R[key].al}</p><small>닮은 예: ${R[key].ex}</small></div>`:'<p class="muted">왼쪽 물음에 답하면 유형이 나와요.</p>'}</div></div>`;
    B.querySelectorAll('[data-a]').forEach(x=>x.onclick=()=>{ a=x.dataset.a; b=null; draw(); });
    B.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>{ b=x.dataset.b; draw(); });
  }
  draw();
})();

/* 05 빈칸 확인 · 스스로 점검 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['지도학습·비지도학습·강화 학습을 구분할 수 있다','분류와 예측(회귀)의 차이를 말할 수 있다','k-최근접 이웃의 원리를 설명할 수 있다','문제에 맞는 유형과 알고리즘을 고를 수 있다'],true);

const MEMOLIST=[['planMemo','같은 데이터로 만들 수 있는 서로 다른 문제'],['caseCompare','심장 마비·주택 가격: 분류와 예측(회귀)을 나눈 근거'],['choleraMemo','세 실습으로 본 지도학습과 비지도학습의 차이'],['myProblem','내 주변 문제: 입력·알아낼 것·유형'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
