/* 받침에 따라 조사 고르기: jo('신하','을','를') */
const jo=(w,a,b)=>{const c=w.charCodeAt(w.length-1)-0xAC00; return w+(c>=0&&c<11172&&c%28?a:b);};

/* 01 지식 표현 방법 (교과서 42쪽 날개 용어 · 43~45쪽) */
flipCards('krepCards',[
  {ic:'📋',f:'규칙 기반 전문가 시스템',s:'rule-based expert system',b:'특정 영역의 문제를 해결하기 위해 수준 높은 지식을 적용한 인공지능 시스템이다.',x:'지식을 「만약 ~이면 ~이다」 꼴의 규칙으로 담아요.'},
  {ic:'🕸️',f:'의미망',s:'semantic network',b:'노드와 노드 간의 관계를 나타내는 구조로, 관계는 링크로 표현한다.',x:'지식을 연결된 형태로 구현할 수 있기 때문에 지식을 표현하는 데 적합하다.'},
  {ic:'🗃️',f:'프레임',s:'frame',b:'설명이 다소 부족하다는 노드의 단점을 보완한 것으로, 각 노드의 정보가 자세하게 기술되어 있다.'},
  {ic:'🔣',f:'명제 논리',s:'02에서 배워요',b:'참인지 거짓인지를 판별할 수 있는 문장(명제)을 p, q 같은 기호와 ~ ∧ ∨ → ↔ 로 표현한다.'},
  {ic:'∀',f:'술어 논리',s:'04에서 배워요',b:'한정자(∀, ∃)와 술어를 사용하여 문장의 문법적 구조와 의미를 포함한 논리식으로 표현한다.'},
]);

/* 01 의미망 잇기: 두 노드를 차례로 눌러 관계 고르기 (교과서 42쪽 그림) */
(function(){
  const N={sj:['세종대왕',190,165],jh:['집현전',90,55],gj:['군주',320,55],sh:['신하',400,165],hh:['황희',530,95],kj:['김종서',530,240],hm:['훈민정음',190,280]};
  const FACTS=[['cowork','sj','jh'],['is_a','sj','gj'],['has','sj','sh'],['is_a','hh','sh'],['is_a','kj','sh'],['make','sj','hm']];
  const REL={cowork:'협업하다',is_a:'~이다',has:'가지다',make:'만들다'};
  const box=$('netSvg'), pick=$('netPick'), fb=$('netFb');
  const svg=el('svg',{viewBox:'0 0 620 320',role:'img','aria-label':'의미망 만들기 판'},box);
  const defs=el('defs',{},svg), mk=el('marker',{id:'krArrow',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'},defs);
  el('path',{d:'M0 0 L10 5 L0 10 z',fill:'#2f6fd0'},mk);
  const gE=el('g',{},svg), gN=el('g',{},svg);
  const size={}, nodeG={};
  let sel=null, done=[];
  for(const k in N){
    const [t,x,y]=N[k], w=t.length*17+26, h=38; size[k]=[w/2,h/2];
    const g=el('g',{class:'kr-node',tabindex:'0',role:'button','aria-label':t},gN);
    el('rect',{x:x-w/2,y:y-h/2,width:w,height:h,rx:19},g);
    el('text',{x,y,dy:'.35em','text-anchor':'middle'},g,t);
    g.addEventListener('click',()=>tap(k));
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tap(k);}});
    nodeG[k]=g;
  }
  function edgePt(a,b){ /* a 상자의 테두리에서 b 쪽으로 나가는 점 */
    const [x1,y1]=[N[a][1],N[a][2]], [x2,y2]=[N[b][1],N[b][2]], dx=x2-x1, dy=y2-y1, [hw,hh]=size[a];
    const t=Math.min(dx?hw/Math.abs(dx):1e9, dy?hh/Math.abs(dy):1e9)+.04;
    return [x1+dx*t, y1+dy*t];
  }
  function drawEdge(r,a,b){
    const [x1,y1]=edgePt(a,b), [x2,y2]=edgePt(b,a);
    el('line',{x1,y1,x2,y2,class:'kr-edge','marker-end':'url(#krArrow)'},gE);
    el('text',{x:(x1+x2)/2,y:(y1+y2)/2-6,'text-anchor':'middle',class:'kr-elab'},gE,r);
  }
  const nm=k=>N[k][0];
  function mark(){ for(const k in nodeG) nodeG[k].classList.toggle('on',k===sel); }
  function code(){
    $('netCode').textContent=done.length?done.map(([r,a,b])=>`${r}(${nm(a)}, ${nm(b)})`).join('\n'):'(아직 연결한 관계가 없어요)';
  }
  function tap(k){
    if(done.length===FACTS.length) return;
    if(sel===null){ sel=k; mark(); pick.innerHTML=''; fb.innerHTML=`<b>${nm(k)}</b>에서 시작해요. 이어질 노드를 눌러 주세요. (같은 노드를 다시 누르면 취소)`; return; }
    if(sel===k){ sel=null; mark(); fb.textContent=''; pick.innerHTML=''; return; }
    const a=sel, b=k;
    pick.innerHTML=`<span class="kr-lab">${nm(a)} → ${nm(b)} : 어떤 관계일까요?</span><div class="row">${Object.keys(REL).map(r=>`<button class="btn sm ghost" data-r="${r}"><b>${r}</b> ${REL[r]}</button>`).join('')}<button class="btn sm ghost" data-r="">취소</button></div>`;
    fb.textContent='';
    pick.querySelectorAll('button').forEach(bt=>bt.onclick=()=>choose(a,b,bt.dataset.r));
  }
  function choose(a,b,r){
    sel=null; mark(); pick.innerHTML='';
    if(!r){ fb.textContent=''; return; }
    if(done.some(f=>f[1]===a&&f[2]===b)){ fb.innerHTML='이미 이어 둔 관계예요. 다른 노드를 이어 보세요.'; return; }
    const f=FACTS.find(f=>f[1]===a&&f[2]===b), rev=FACTS.find(f=>f[1]===b&&f[2]===a);
    if(f&&f[0]===r){
      done.push(f); drawEdge(r,a,b); code();
      fb.innerHTML=`<span class="ok">맞아요!</span> <span class="mono">${r}(${nm(a)}, ${nm(b)})</span> · ${done.length} / ${FACTS.length}`;
      if(done.length===FACTS.length){ fb.innerHTML=`<div class="kr-end">🎉 자연어 문장 세 개가 <b>노드 7개와 링크 6개</b>, <b>코딩 6줄</b>이 되었어요. 문장에서는 「그중 황희와 김종서가 있다」처럼 누가 무엇인지 해석해야 했지만, 의미망에서는 <b>관계가 이름(술어)과 방향으로 정해져</b> 있어요. 그래서 컴퓨터는 「신하」 노드로 들어오는 is_a 링크를 따라가 황희, 김종서를 찾을 수 있어요.<br><button class="btn sm ghost" id="netAgain" style="margin-top:8px">처음부터 다시</button></div>`; $('netAgain').onclick=reset; }
      return;
    }
    if(f){ fb.innerHTML=`<span class="ng">관계 이름을 다시 골라 보세요.</span> 자연어 문장에서 <b>${jo(nm(a),'과','와')}</b> <b>${nm(b)}</b> 사이에 어떤 말이 쓰였는지 찾아봐요.`; return; }
    if(rev){ fb.innerHTML=`<span class="ng">방향을 바꿔 보세요.</span> 두 노드는 이어지지만, 의미망 코딩은 <span class="mono">관계(주인공, 대상)</span> 순서예요. <b>${jo(nm(b),'을','를')}</b> 먼저 누르고 <b>${jo(nm(a),'을','를')}</b> 나중에 눌러요.`; return; }
    fb.innerHTML=`<span class="ng">교과서 의미망에는 없는 링크예요.</span> 교과서 그림처럼 문장에 관계 말(협업하다·~이다·데리고 있다·만들다)로 직접 나온 것만 이어 봐요.`;
  }
  function reset(){ done=[]; sel=null; while(gE.firstChild) gE.removeChild(gE.firstChild); mark(); code(); fb.textContent=''; pick.innerHTML=''; }
  code();
})();

/* 02 명제일까? */
sorter('propGame',{
  cats:[{n:'✅ 명제',k:'#1f9d74'},{n:'❌ 명제가 아님',k:'#d64535'}],
  items:[
    {t:'코로나19는 바이러스이다.',short:'코로나19는 바이러스이다.',c:0,ic:'🦠',w:'교과서 43쪽 사례: 참과 거짓을 판별할 수 있으므로 명제예요.'},
    {t:'토마토는 과일이다.',short:'토마토는 과일이다.',c:0,ic:'🍅',w:'교과서 43쪽 사례: 참과 거짓을 판별할 수 있으므로 명제예요.'},
    {t:'인공지능이 인간보다 똑똑해질 수 있을까?',short:'똑똑해질 수 있을까?',c:1,ic:'❓',w:'교과서 43쪽 사례: 묻는 문장이라 참과 거짓을 판정할 수 없어요.'},
    {t:'신호등이 초록색이다.',short:'신호등이 초록색이다.',c:0,ic:'🚦',w:'교과서 43쪽의 p예요. 지금 신호등을 보면 참인지 거짓인지 가릴 수 있어요.'},
    {t:'2는 홀수이다.',short:'2는 홀수이다.',c:0,ic:'2️⃣',w:'거짓인 문장이에요. 하지만 「거짓」이라고 판별할 수 있으니 명제예요.'},
    {t:'창문을 닫아라.',short:'창문을 닫아라.',c:1,ic:'🪟',w:'시키는 문장이라 참·거짓을 따질 수 없어요.'},
    {t:'이 노래는 정말 좋다.',short:'이 노래는 정말 좋다.',c:1,ic:'🎵',w:'좋은지는 사람마다 달라 참·거짓을 판별할 수 없어요. 뜻이 논리적으로 분명하지 않아요.'},
  ],
  end:'명제를 가르는 기준은 「참인가?」가 아니라 <b>「참인지 거짓인지 판별할 수 있는가?」</b>예요. 거짓인 문장도 명제예요.'
});

/* 02 진리표 (표 Ⅰ-2) */
(function(){
  let p=true, q=true;
  const T=b=>b?'T':'F';
  const COLS=[['~p',(p,q)=>!p,'신호등이 초록색이 아니다.'],['~q',(p,q)=>!q,'자동차가 전진하지 않는다.'],['p∧q',(p,q)=>p&&q,'신호등이 초록색이다. 그리고 자동차가 전진한다.'],['p∨q',(p,q)=>p||q,'신호등이 초록색이다. 또는 자동차가 전진한다.'],['p→q',(p,q)=>!p||q,'만약 신호등이 초록색이면 자동차가 전진한다.'],['p↔q',(p,q)=>p===q,'신호등이 초록색이면 자동차가 전진하고, 자동차가 전진하면 신호등이 초록색이다.']];
  const ROWS=[[true,true],[true,false],[false,true],[false,false]];
  function draw(){
    $('truthCtl').innerHTML=`<button class="btn sm ${p?'':'ghost'}" id="tP">p 「신호등이 초록색이다.」 ${p?'참(T)':'거짓(F)'}</button><button class="btn sm ${q?'':'ghost'}" id="tQ">q 「자동차가 전진한다.」 ${q?'참(T)':'거짓(F)'}</button>`;
    $('tP').onclick=()=>{p=!p;draw();}; $('tQ').onclick=()=>{q=!q;draw();};
    $('truthTbl').innerHTML='<tr><th>p</th><th>q</th>'+COLS.map(c=>`<th>${c[0]}</th>`).join('')+'</tr>'+
      ROWS.map(([a,b])=>`<tr class="${a===p&&b===q?'on':''}"><td>${T(a)}</td><td>${T(b)}</td>${COLS.map(c=>`<td class="${c[1](a,b)?'t':'f'}">${T(c[1](a,b))}</td>`).join('')}</tr>`).join('');
    $('truthNow').innerHTML=COLS.filter(c=>c[0]!=='~q').map(c=>{const v=c[1](p,q);return `<div><b class="mono">${c[0]}</b> ${c[2]} <span class="${v?'ok':'ng'}">→ ${v?'참':'거짓'}</span></div>`;}).join('');
  }
  draw();
})();

/* 03 스스로 해결하기: 거짓말쟁이 찾기 (교과서 44쪽) */
(function(){
  const P=[['진영','유미는 거짓말쟁이입니다.',L=>L==='유미'],['유미','거짓말쟁이는 서연이입니다.',L=>L==='서연'],['승우','나는 거짓말쟁이가 아닙니다.',L=>L!=='승우'],['서연','유미는 거짓말을 합니다.',L=>L==='유미']];
  const B=$('liar'), tried=new Set();
  function draw(L){
    let h=`<div class="row" style="margin-bottom:10px">${P.map(([n])=>`<button class="btn sm ${n===L?'':'ghost'}" data-n="${n}">${jo(n,'이','가')} 거짓말쟁이라면?</button>`).join('')}</div>`;
    if(L){
      tried.add(L);
      let bad=0;
      const rows=P.map(([n,s,f])=>{const v=f(L), must=n!==L, ok=v===must; if(!ok) bad++;
        return `<tr class="${ok?'':'bad'}"><td><b>${n}</b>${n===L?' <small>(거짓말쟁이로 가정)</small>':''}</td><td class="l">「${s}」</td><td>${v?'참':'거짓'}</td><td>${must?'참이어야 함':'거짓이어야 함'}</td><td>${ok?'<span class="ok">들어맞음</span>':'<span class="ng">모순</span>'}</td></tr>`;}).join('');
      h+=`<div style="overflow-x:auto"><table class="kr-liar"><tr><th>친구</th><th class="l">한 말</th><th>가정하면 이 말은</th><th>이 친구의 말은</th><th>판정</th></tr>${rows}</table></div>`;
      h+=`<div class="kr-fb">${bad?`<span class="ng">모순 ${bad}곳</span> · ${jo(L,'이','가')} 거짓말쟁이라고 하면 앞뒤가 맞지 않아요. 다른 친구로 가정해 보세요.`:`<span class="ok">모순 없음!</span> ${jo(L,'이','가')} 거짓말쟁이라고 하면 네 문장이 모두 들어맞아요.${tried.size<4?' 다른 친구로 가정해도 들어맞는지 마저 확인해 보세요.':''}`}</div>`;
      if(tried.size===4) h+=`<div class="kr-end">네 가지 가정을 모두 따져 보니 모순이 없는 경우는 <b>유미</b>뿐이에요. 문장 하나하나를 참·거짓으로 따지고, 「거짓말쟁이는 한 명」이라는 규칙과 맞대어 <b>새로운 사실(거짓말쟁이는 유미)</b>을 이끌어 냈어요. 이것이 추론이에요.</div>`;
    }
    B.innerHTML=h;
    B.querySelectorAll('button[data-n]').forEach(b=>b.onclick=()=>draw(b.dataset.n));
  }
  draw(null);
})();

/* 04 술어 논리로 바꾸기 */
(function(){
  const IT=[
    {s:'현준은 학생이다.',p:'p',o:['student(현준)','∀x student(x)','∃x student(x)'],a:0,w:'특정한 한 사람(현준)에 대한 문장이라 한정자가 필요 없어요. 술어 student에 현준을 넣어요.'},
    {s:'모든 자율주행 자동차는 자동차이다.',p:'q',o:['∀x {car(x) → selfdrivingcar(x)}','∀x {selfdrivingcar(x) → car(x)}','∃x {selfdrivingcar(x) ∧ car(x)}'],a:1,w:'교과서 45쪽 예시예요. 「모든」이므로 ∀x, 「x가 자율주행 자동차이면 x는 자동차이다」이므로 selfdrivingcar(x) → car(x)예요.'},
    {s:'어떤 자동차는 자율주행 자동차이다.',p:'r',o:['∀x {car(x) → selfdrivingcar(x)}','selfdrivingcar(자동차)','∃x {car(x) ∧ selfdrivingcar(x)}'],a:2,w:'「어떤」이므로 존재 기호 ∃x를 써요. 「자동차이면서 자율주행 자동차인 x가 적어도 한 개 있다」는 뜻이라 ∧로 이어요. ∀x를 쓰면 모든 자동차가 자율주행 자동차라는 뜻이 돼요.'},
    {s:'모든 학생은 인공지능 기초를 배운다.',p:'s',o:['∃x {student(x) ∧ learnai(x)}','∀x {student(x) → learnai(x)}','learnai(학생)'],a:1,w:'「모든」이므로 ∀x, 「x가 학생이면 x는 인공지능 기초를 배운다」로 읽어요.'},
    {s:'어떤 학생은 프로그래밍을 잘한다.',p:'t',o:['∃x {student(x) ∧ goodcoding(x)}','∀x {student(x) → goodcoding(x)}','goodcoding(학생)'],a:0,w:'「어떤」이므로 ∃x예요. 프로그래밍을 잘하는 학생이 적어도 한 명 있다는 뜻이에요.'},
  ];
  const B=$('predGame'); let i=0, ok=0;
  function show(){
    if(i>=IT.length){
      B.innerHTML=`<div class="kr-end">🎉 ${IT.length}문장 중 <b>${ok}개</b>를 바로 맞혔어요.<div style="overflow-x:auto"><table class="kr-q" style="margin-top:8px"><tr><th class="l">문장</th><th>명제 논리</th><th class="l">술어 논리</th></tr>${IT.map(t=>`<tr><td class="l">${t.s}</td><td class="mono2">${t.p}</td><td class="l mono2">${t.o[t.a]}</td></tr>`).join('')}</table></div><p style="margin-bottom:0">명제 논리에서는 다섯 문장이 모두 <b>기호 하나</b>일 뿐이라 「모든」과 「어떤」의 차이가 보이지 않아요. 술어 논리에서는 <b>∀x, ∃x</b>와 술어 덕분에 그 차이가 식에 드러나요.</p><button class="btn ghost sm" id="predAgain">처음부터 다시</button></div>`;
      $('predAgain').onclick=()=>{i=0;ok=0;show();}; return;
    }
    const t=IT[i], ord=shuffle(t.o.map((_,j)=>j));
    B.innerHTML=`<div class="kr-pq"><div class="cnt">${i+1} / ${IT.length}</div><div class="s">「${t.s}」</div>
      <div class="kr-cmp"><div><span class="kr-lab">명제 논리로 적으면</span><b class="mono2 big2">${t.p}</b><small>문장 전체가 기호 하나예요.</small></div>
      <div><span class="kr-lab">술어 논리로 적으면?</span><div class="opts">${ord.map(j=>`<button class="kr-opt" data-j="${j}">${t.o[j]}</button>`).join('')}</div></div></div>
      <div class="kr-fb"></div><div class="row nx"></div></div>`;
    let first=true;
    B.querySelectorAll('.kr-opt').forEach(b=>b.onclick=()=>{
      const j=+b.dataset.j, f=B.querySelector('.kr-fb');
      if(j===t.a){ if(first) ok++; B.querySelectorAll('.kr-opt').forEach(x=>x.disabled=true); b.classList.add('right'); f.innerHTML='<span class="ok">맞아요!</span> '+t.w;
        const nx=B.querySelector('.nx'); nx.innerHTML='<button class="btn sm">다음 →</button>'; nx.firstChild.onclick=()=>{i++;show();}; nx.firstChild.focus(); }
      else { first=false; b.classList.add('wrong'); b.disabled=true; f.innerHTML='<span class="ng">다시 생각해 봐요.</span> 「모든」인지 「어떤」인지, 무엇이 무엇을 포함하는지 살펴봐요.'; }
    });
  }
  show();
})();

/* 05 테니스 경기 유무 데이터셋 (표 Ⅰ-6) → 규칙 만들기 */
(function(){
  const A=['날씨','기온','습도','바람의 세기'];
  const V=[['맑음','흐림','비'],['더움','온화함','추움'],['높음','보통'],['강함','약함']];
  const D=[[1,'맑음','더움','높음','약함',0],[2,'맑음','더움','높음','강함',0],[3,'흐림','더움','높음','약함',1],[4,'비','온화함','높음','약함',1],[5,'비','추움','보통','약함',1],[6,'비','추움','보통','강함',0],[7,'흐림','추움','보통','강함',1],[8,'맑음','온화함','높음','약함',0],[9,'맑음','추움','보통','약함',1],[10,'비','온화함','보통','약함',1],[11,'맑음','온화함','보통','강함',1],[12,'흐림','온화함','높음','강함',1],[13,'흐림','더움','보통','약함',1],[14,'비','온화함','높음','강함',0]];
  const STEPS=[
    {title:'1단계 · 14일 전체에서 살펴보기',only:null,skip:[],ans:[0,'흐림'],clause:'(날씨 = 흐림)',why:'날씨가 흐린 날은 4일 모두 테니스 경기를 했어요(4/4). 논리로 표현하면 「테니스 경기를 한다. ← (날씨 = 흐림)」이에요.'},
    {title:'2단계 · 날씨가 ‘맑음’인 5일만 살펴보기',tip:'정확도가 같으면 <b>경기를 한 날을 더 많이 설명하는 조건</b>을 골라요.<br><small>교과서 47쪽은 기온 = 추움을 1/2로 적어 습도 = 보통만 2/2예요. 표를 직접 세면 추움은 1/1이에요.</small>',only:[0,'맑음'],skip:[0],ans:[2,'보통'],clause:'{(날씨 = 맑음) ∧ (습도 = 보통)}',why:'날씨가 맑은 날 중 습도가 ‘보통’인 날(9일, 11일)은 모두 경기를 했어요(2/2). 이제 규칙은 「흐리거나, 맑고 습도가 보통인 경우」예요.'},
    {title:'3단계 · 날씨가 ‘비’인 5일만 살펴보기',only:[0,'비'],skip:[0],ans:[3,'약함'],clause:'{(날씨 = 비) ∧ (바람 = 약함)}',why:'비가 온 날 중 바람이 ‘약함’인 날(4일, 5일, 10일)은 모두 경기를 했어요(3/3).'},
  ];
  let step=0, clauses=[], tries=0;
  const rowsOf=s=>D.filter(r=>!s.only||r[1+s.only[0]]===s.only[1]);
  const fire=r=>[r[1]==='흐림', r[1]==='맑음'&&r[3]==='보통', r[1]==='비'&&r[4]==='약함'];
  const predict=r=>fire(r).slice(0,clauses.length).some(Boolean);
  function table(){
    const s=STEPS[step], inSet=s?new Set(rowsOf(s).map(r=>r[0])):null, fin=clauses.length===3;
    $('tnTable').innerHTML=`<tr><th>Day</th>${A.map(a=>`<th>${a}</th>`).join('')}<th>경기 유무</th>${fin?'<th>규칙의 판단</th>':''}</tr>`+D.map(r=>{
      const cov=clauses.length&&predict(r), cls=[inSet&&!inSet.has(r[0])?'dim':'', cov?'hit':''].join(' ');
      return `<tr class="${cls}"><td>${r[0]}</td>${r.slice(1,5).map(v=>`<td>${v}</td>`).join('')}<td class="${r[5]?'o':'x'}">${r[5]?'○':'×'}</td>${fin?`<td>${predict(r)?'○':'×'} ${predict(r)===!!r[5]?'<span class="ok">✓</span>':'<span class="ng">✗</span>'}</td>`:''}</tr>`;}).join('');
  }
  function rule(){
    $('tnRule').innerHTML='테니스 경기를 한다. ← '+(clauses.length?clauses.map((c,i)=>`<span class="cl c${i}">${c}</span>`).join(' ∨ '):'<span class="muted">(텅 빈 규칙)</span>');
  }
  function ratioBtns(s){
    const rows=rowsOf(s);
    return A.map((a,ai)=>s.skip.includes(ai)?'':`<div class="kr-attr"><b>${a}</b>${V[ai].map(v=>{const sub=rows.filter(r=>r[1+ai]===v); if(!sub.length) return ''; const y=sub.filter(r=>r[5]).length;
      return `<button class="kr-ratio" data-a="${ai}" data-v="${v}">${v} <span>${y}/${sub.length}</span><i style="width:${Math.round(y/sub.length*100)}%"></i></button>`;}).join('')}</div>`).join('');
  }
  function draw(msg){
    table(); rule();
    const B=$('tnStep');
    if(step>=STEPS.length){
      B.innerHTML=`<div class="kr-end">🎉 규칙 완성! 이 규칙은 데이터에서 테니스를 친 <b>9일 모두</b>에 적용할 수 있고, 경기를 하지 않은 5일에는 하나도 맞지 않아요. 표의 「규칙의 판단」 칸에서 14일이 모두 ✓인지 확인해 보세요. 이렇게 주어진 데이터에서 논리 표현을 적용하여 <b>지능적 행위에 대한 지식</b>을 얻을 수 있어요.<br><button class="btn ghost sm" id="tnAgain" style="margin-top:8px">규칙 처음부터 다시 만들기</button></div>`;
      $('tnAgain').onclick=()=>{step=0;clauses=[];tries=0;draw();tryDraw();}; return;
    }
    const s=STEPS[step];
    B.innerHTML=`<div class="kr-steph">${s.title} — 정확도가 가장 높은 조건은?</div>${s.tip?`<div class="kr-tip">${s.tip}</div>`:''}<div class="kr-attrs">${ratioBtns(s)}</div><div class="kr-fb">${msg||''}</div>`;
    B.querySelectorAll('.kr-ratio').forEach(b=>b.onclick=()=>choose(+b.dataset.a,b.dataset.v));
  }
  function choose(ai,v){
    const s=STEPS[step];
    if(ai===s.ans[0]&&v===s.ans[1]){ clauses.push(s.clause); step++; tries=0; draw(); if(step<STEPS.length) $('tnStep').querySelector('.kr-fb').innerHTML=`<span class="ok">좋아요!</span> 앞 단계: ${s.why}`; tryDraw(); return; }
    tries++;
    let m;
    if(step===1&&ai===1&&v==='추움') m='<span class="ng">정확도는 1/1로 같은 100%지만</span>, 경기를 한 맑은 날 중 <b>하루(9일)</b>만 설명해요. 정확도가 같을 때는 경기를 한 날(9일, 11일)을 더 많이 설명하는 조건을 골라요.';
    else m=`<span class="ng">다시 비교해 보세요.</span> 분수가 1에 가까울수록(막대가 길수록) 정확도가 높아요.${tries>=2?` 힌트: <b>${A[s.ans[0]]}</b> 쪽을 보세요.`:''}`;
    $('tnStep').querySelector('.kr-fb').innerHTML=m;
  }
  /* 「오늘 테니스 칠까?」 판단기 */
  const pickV=['맑음','더움','높음','약함'];
  function tryDraw(){
    const B=$('tnTry');
    const g=A.map((a,ai)=>`<div class="kr-attr"><b>${a}</b>${V[ai].map(v=>`<button class="kr-chip ${pickV[ai]===v?'on':''}" data-a="${ai}" data-v="${v}">${v}</button>`).join('')}</div>`).join('');
    const r=[0,...pickV,0], f=fire(r), names=['(날씨 = 흐림)','{(날씨 = 맑음) ∧ (습도 = 보통)}','{(날씨 = 비) ∧ (바람 = 약함)}'];
    const n=clauses.length;
    const lines=names.map((c,i)=>i<n?`<li class="${f[i]?'yes':'no'}">${c} → <b>${f[i]?'참':'거짓'}</b></li>`:`<li class="muted">${c} — 아직 규칙에 없어요</li>`).join('');
    const yes=f.slice(0,n).some(Boolean), same=D.find(d=>d[1]===pickV[0]&&d[2]===pickV[1]&&d[3]===pickV[2]&&d[4]===pickV[3]);
    B.innerHTML=`<div class="kr-attrs">${g}</div><div class="kr-trace"><span class="kr-lab">규칙을 따라가 보면</span><ol>${lines}</ol>
      <div class="kr-verdict ${yes?'y':'n'}">${n?(yes?'🎾 <b>테니스 경기를 한다.</b> — 위에서 참이 된 조건이 근거예요.':'🙅 규칙의 조건이 모두 거짓이라 「테니스 경기를 한다」는 결론이 나오지 않아요. → <b>경기를 하지 않는다</b>고 판단해요.'):'규칙을 먼저 만들어 보세요.'}</div>
      <p class="note" style="margin-bottom:0">기온은 규칙에 쓰이지 않았어요.${same?` 표의 ${same[0]}일과 같은 날씨예요(실제 ${same[5]?'○':'×'}).`:' 표에 없는 날씨 조합이에요. 규칙으로 처음 보는 날도 판단할 수 있어요.'}</p></div>`;
    B.querySelectorAll('.kr-chip').forEach(b=>b.onclick=()=>{pickV[+b.dataset.a]=b.dataset.v; tryDraw();});
  }
  draw(); tryDraw();
})();

/* 06 우회전 규칙 판단기 (교과서 47쪽 · 부록 221쪽 교차로 통행 방법) */
(function(){
  const S={sig:'적색',fcw:'녹색',rcw:'녹색',ped:'없음'};
  const OPT=[['sig','전방 차량 신호',['적색','녹색']],['fcw','전방 횡단보도 신호',['녹색','적색']],['rcw','우회전 후 횡단보도 신호',['녹색','적색']],['ped','우회전 후 횡단보도의 보행자',['있음','없음']]];
  const R=[
    {n:'①',c:[['sig','적색'],['fcw','녹색']],t:'일시 정지 후, 보행자가 없으면 우회전 가능'},
    {n:'②',c:[['sig','적색'],['fcw','적색']],t:'일시 정지 후, 우회전 가능'},
    {n:'③',c:[['sig','녹색'],['ped','있음']],t:'횡단보도 앞에서 일시 정지 후, 보행자 횡단 종료 후 우회전 가능'},
    {n:'④',c:[['sig','녹색'],['ped','없음']],t:'서행하며 우회전 가능'},
    {n:'⑤',c:[['sig','녹색'],['rcw','적색']],t:'서행하며 우회전 가능'},
  ];
  const LB={sig:'전방 차량 신호',fcw:'전방 횡단보도',rcw:'우회전 후 횡단보도',ped:'우회전 후 횡단보도의 보행자'};
  function draw(){
    const B=$('turnJudge');
    const ctl=OPT.map(([k,l,vs])=>`<div class="kr-attr"><b>${l}</b>${vs.map(v=>`<button class="kr-chip ${S[k]===v?'on':''}" data-k="${k}" data-v="${v}">${v}</button>`).join('')}</div>`).join('');
    const hit=[];
    const rows=R.map(r=>{const ok=r.c.every(([k,v])=>S[k]===v); if(ok) hit.push(r);
      return `<li class="${ok?'yes':'no'}"><b>규칙 ${r.n}</b> 만약 ${r.c.map(([k,v])=>`<span class="cd ${S[k]===v?'t':'f'}">${LB[k]} = ${v}</span>`).join(' ∧ ')} 이면 → ${r.t}</li>`;}).join('');
    let v=hit.length?hit.map(r=>`<div>규칙 ${r.n}에 맞아요 → <b>${r.t}</b></div>`).join(''):'<div>맞는 규칙이 없어요.</div>';
    if(hit.length>1&&new Set(hit.map(r=>r.t.slice(0,4))).size>1) v+='<p class="note" style="margin-bottom:0">규칙 두 개가 함께 맞았는데 결론이 달라요. 이 판단기는 교과서 그림을 단순하게 옮긴 것이라 이런 경우가 생겨요. 실제 시스템이라면 어느 규칙을 먼저 따를지(보행자 보호가 먼저)도 사람이 규칙으로 정해 주어야 해요.</p>';
    B.innerHTML=`<div class="kr-attrs">${ctl}</div><div class="kr-trace"><span class="kr-lab">사실을 규칙과 맞대어 보면</span><ol class="kr-rules">${rows}</ol><div class="kr-verdict y">${v}</div></div>`;
    B.querySelectorAll('.kr-chip').forEach(b=>b.onclick=()=>{S[b.dataset.k]=b.dataset.v; draw();});
  }
  draw();
})();

/* 06 빈칸 · 스스로 점검 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['자연어 지식을 의미망으로 바꿀 수 있다','문장이 명제인지 구분할 수 있다','긍정 논법·삼단 논법으로 결론을 이끌 수 있다','「모든」「어떤」을 술어 논리로 나타낼 수 있다','데이터에서 규칙을 뽑아 판단할 수 있다'],true);

const MEMOLIST=[['natWhy','일상 언어가 어려운 까닭 · 의미망으로 바꾸면'],['allSome','명제 논리와 술어 논리의 차이(모든·어떤)'],['tennisWhy','판단 과정이 보이는 것이 중요한 상황'],['turnRule','우회전 규칙을 긍정 논법으로'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[7]=()=>memoSummary('msum',MEMOLIST);
