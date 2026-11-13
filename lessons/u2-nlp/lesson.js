
/* 공통 */
const pct=(n,t)=>t?Math.round(n/t*1000)/10:0;
function say(t){
  if(!('speechSynthesis' in window)) return false;
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='ko-KR';
  const v=speechSynthesis.getVoices().find(v=>/^ko/i.test(v.lang)); if(v) u.voice=v;
  speechSynthesis.speak(u); return true;
}
// 띄어쓰기로 나누고 끝의 조사 하나를 떼어 내는 아주 간단한 규칙 (형태소 분석기가 아님)
const PART=['에서는','에게서','으로는','에는','에도','이다','에서','에게','으로','까지','부터','처럼','보다','하고','이나','은','는','이','가','을','를','에','의','로','와','과','도','만'];
const KEEP=new Set(['고양이','아이','어린이','놀이','나이','사이','종이','높이','길이','하나','도로','온도','정도','지도','속도','포도','의도','사과','효과','결과','기도','태도','우리','저녁이']);
function words(t){ return t.replace(/[.,!?~·'"“”‘’()\[\]…:;]/g,' ').split(/\s+/).filter(Boolean); }
function stem(w){ if(KEEP.has(w)) return w; for(const p of PART){ if(w.length>p.length && w.endsWith(p)) return w.slice(0,-p.length); } return w; }
function barsHTML(list,opt={}){ // list: [{k,v,p}]
  const best=Math.max(...list.map(x=>x.p),0);
  return list.map((x,i)=>`<div class="bar${x.p===best&&best>0?' best':''}${opt.pick?' pick':''}" data-i="${i}"><span>${esc(x.k)}</span><div class="t"><i style="width:${x.p}%;${x.c?`background:${x.c}`:''}"></i></div><b>${x.p}%</b></div>`).join('');
}
function animBars(box){ const is=[...box.querySelectorAll('.t i')], ws=is.map(i=>i.style.width); is.forEach(i=>i.style.width='0'); requestAnimationFrame(()=>requestAnimationFrame(()=>is.forEach((i,k)=>i.style.width=ws[k]))); }

/* 0 표지: 한 단어씩 만들어지는 대답 */
(function(){
  const W=['자연어','형태소','임베딩','언어 모델','단어 주머니','챗봇','번역','요약','감정 분석','확률','문맥','토큰','의도','RNN','Attention','Transformer','LLM','자동 완성','개체명','구문 분석'];
  const box=$('coverWords');
  W.forEach((w,i)=>{const s=document.createElement('span'); s.textContent=w; s.style.left=(Math.random()*90)+'%'; s.style.top=(Math.random()*92)+'%'; s.style.fontSize=(16+Math.random()*30)+'px'; box.appendChild(s);});
  const EX=[
    {q:'근처 맛집 추천해 줘.',a:[['학교',[['학교',48],['역',31],['집',21]]],['앞',[['앞',70],['근처',22],['옆',8]]],['분식집이',[['분식집이',55],['식당이',30],['카페가',15]]],['떡볶이로',[['떡볶이로',46],['김밥으로',34],['라면으로',20]]],['좋은',[['좋은',81],['높은',12],['많은',7]]],['평가를',[['평가를',77],['반응을',15],['후기를',8]]],['받고',[['받고',90],['얻고',10]]],['있어요.',[['있어요.',84],['있습니다.',16]]]]},
    {q:'비 오는 날 뭐 먹을까?',a:[['따뜻한',[['따뜻한',52],['매콤한',33],['바삭한',15]]],['칼국수',[['칼국수',41],['국밥',35],['라면',24]]],['어때요?',[['어때요?',63],['좋아요.',37]]]]},
  ];
  let ex=0;
  async function loop(){
    for(;;){
      if(cur!==0){ await sleep(500); continue; }
      const e=EX[ex%EX.length]; ex++;
      $('genQ').textContent=e.q; $('genA').textContent=''; $('genC').innerHTML='<small>다음 단어 후보</small>';
      await sleep(900);
      for(const [w,c] of e.a){
        $('genC').innerHTML='<small>다음 단어 후보</small>'+c.map(([k,p])=>`<div class="row2"><span>${k}</span><i style="width:0"></i><span>${p}%</span></div>`).join('');
        await sleep(60); [...$('genC').querySelectorAll('i')].forEach((el,i)=>el.style.width=c[i][1]+'%');
        await sleep(650); $('genC').querySelector('.row2').classList.add('sel');
        await sleep(350); $('genA').textContent+=($('genA').textContent?' ':'')+w;
        await sleep(250);
      }
      await sleep(2600);
    }
  }
  loop();
})();

/* 1 언어 이해 · 언어 생성 */
(function(){
  const T=[
    ['감정 분석','상품 후기가 칭찬인지 불만인지 알아낸다',0],
    ['구문 분석','문장에서 단어들이 서로 어떤 관계인지 찾는다',0],
    ['텍스트 분류','뉴스 기사를 연예·경제·스포츠로 나눈다',0],
    ['상식 추론','"우산을 챙겼다"를 읽고 비가 올 것 같다는 걸 짐작한다',0],
    ['챗봇','질문을 알아듣고 알맞은 대답을 만든다',1],
    ['생성형 언어 모델','주어진 문맥에 이어 자연스러운 글을 만든다',1],
    ['번역','한국어 문장의 뜻을 이해해 영어 문장으로 다시 쓴다',1],
    ['자동 완성','검색창에 "오늘 날"까지 치면 "오늘 날씨"를 제안한다',2],
    ['스토리 생성','첫 문장을 주면 이어지는 이야기를 쓴다',2],
    ['캡션 생성','사진을 보고 설명하는 문장을 만든다',2],
  ];
  const ZN=['언어 이해','둘 다','언어 생성'], ZC=['#e0702b','#5f9e3a','#2f8fd0'];
  const SLOT=[[[118,88],[118,116],[118,144],[118,172]],[[280,100],[280,130],[280,160]],[[442,100],[442,130],[442,160]]];
  const svg=$('venn');
  function base(){
    svg.innerHTML='';
    el('ellipse',{cx:205,cy:130,rx:175,ry:108,fill:'#fde3cf',opacity:.85},svg);
    el('ellipse',{cx:355,cy:130,rx:175,ry:108,fill:'#cfe6f8',opacity:.85},svg);
    el('path',{d:'M280 32.4 A175 108 0 0 1 280 227.6 A175 108 0 0 1 280 32.4',fill:'#d6edc4',opacity:.95},svg);
    el('text',{x:96,y:30,'font-size':16,'font-weight':900,fill:'#b0521c'},svg,'언어 이해');
    el('text',{x:400,y:30,'font-size':16,'font-weight':900,fill:'#1f6fae'},svg,'언어 생성');
  }
  let order, i, ok, used;
  function start(){ base(); order=shuffle(T); i=0; ok=0; used=[0,0,0]; show(); }
  function place(t){ const z=t[2], [x,y]=SLOT[z][used[z]++]; const tx=el('text',{x,y,'text-anchor':'middle','font-size':14,'font-weight':700,fill:ZC[z],class:'vw',opacity:0},svg,t[0]); requestAnimationFrame(()=>tx.setAttribute('opacity',1)); }
  function show(){
    const box=$('task');
    if(i>=order.length){ box.innerHTML=`<div class="tn">${ok} / ${order.length}</div><div class="td">${ok===order.length?'모두 맞혔어요!':'틀린 것은 그림에서 어느 쪽에 놓였는지 다시 확인해 보세요.'}</div><button class="btn ghost sm" id="vAgain">다시 하기</button>`; $('vAgain').onclick=start; return; }
    const t=order[i];
    box.innerHTML=`<div class="muted" style="font-size:.85rem">${i+1} / ${order.length}</div><div class="tn">${t[0]}</div><div class="td">${t[1]}</div><div class="row">${ZN.map((z,j)=>`<button class="btn sm" style="background:${ZC[j]}" data-z="${j}">${z}</button>`).join('')}</div><div class="fb"></div>`;
    box.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{
      const z=+b.dataset.z, right=z===t[2]; if(right) ok++;
      box.querySelectorAll('[data-z]').forEach(x=>x.disabled=true);
      const why=t[2]===1?'이해하고 만들어야 하는 일이라 교과서는 둘 다에 놓았어요.':t[2]===0?'문장의 의미를 파악하는 쪽이 강조돼요.':'새로운 문장을 만들어 내는 쪽이 강조돼요.';
      box.querySelector('.fb').innerHTML=(right?'<span class="ok">✔ 맞아요.</span> ':`<span class="ng">✘ 교과서는 「${ZN[t[2]]}」에 놓았어요.</span> `)+why+' <button class="btn sm" id="vNext" style="margin-left:6px">다음 →</button>';
      place(t); i++; $('vNext').onclick=show;
    });
  }
  start();

  const S=[
    {lab:'사용자',c:'#9aa6b5',n:'말하기',d:'"근처 맛집 추천해 줘."라고 말한다',s:'🗣️ 근처 맛집 추천해 줘.'},
    {lab:'지난 시간',c:'#9aa6b5',n:'음성 인식',d:'음성을 텍스트 문서로 바꾼다',s:'📄 근처 맛집 추천해 줘.'},
    {lab:'자연어 처리',c:'var(--acc)',n:'언어 이해',d:'의미와 의도를 분석한다',s:'💭 음식점 추천을 원하는 거구나.'},
    {lab:'',c:'',n:'검색',d:'필요한 정보를 인터넷에서 찾는다',s:'🔎 사용자 근처의 음식점 정보를 검색해야지.'},
    {lab:'자연어 처리',c:'var(--acc)',n:'언어 생성',d:'검색 결과를 바탕으로 문장을 만든다',s:'✍️ 현재 ○○ 위치의 □□ 음식점이 ◇◇ 음식으로 좋은 평가를 받고 있습니다.'},
    {lab:'',c:'',n:'음성 합성',d:'텍스트를 음성으로 바꾸어 대답한다',s:'🔊 (소리로 들려줘요)'},
  ];
  $('bot').innerHTML=S.map(x=>`<div>${x.lab?`<span class="lab" style="background:${x.c}">${x.lab}</span>`:'<span class="lab" style="background:transparent">&nbsp;</span>'}<b>${x.n}</b>${x.d}<span class="say" style="display:none">${x.s}</span></div>`).join('');
  let st=-1;
  function step(){
    const cs=[...$('bot').children]; if(st>=S.length-1){ return; }
    st++; cs.forEach((c,j)=>{c.classList.toggle('on',j<=st); c.classList.toggle('now',j===st); c.querySelector('.say').style.display=j<=st?'block':'none';});
    const msg=['사용자가 말을 걸어요.','지난 시간에 배운 음성 인식으로 말소리를 글자로 바꿔요.','여기서부터 자연어 처리! 문장의 뜻과 원하는 것을 파악해요.','이해한 의도에 맞는 정보를 찾아요.','찾은 정보로 자연스러운 대답 문장을 만들어요.','만든 문장을 소리로 바꿔 들려줘요.'];
    $('botSay').textContent=msg[st];
    if(st===S.length-1){ const ok=say('현재 학교 앞 분식집이 떡볶이로 좋은 평가를 받고 있습니다.'); if(!ok) $('botSay').textContent+=' (이 브라우저는 소리를 낼 수 없어요)'; $('botNext').textContent='✔ 끝'; }
  }
  $('botNext').onclick=step;
  $('botReset').onclick=()=>{ st=-1; [...$('bot').children].forEach(c=>{c.classList.remove('on','now'); c.querySelector('.say').style.display='none';}); $('botSay').textContent=''; $('botNext').textContent='▶ 다음 단계'; if('speechSynthesis' in window) speechSynthesis.cancel(); };
})();

/* 2 글자를 숫자로 */
(function(){
  const BOOK='좋은 친구는 별처럼 삶을 빛나게 해';
  const EMB={'좋은':[0.2,0.4],'친구는':[0.1,0.5],'별처럼':[1.2,1.4],'삶을':[0.5,0.8],'빛나게':[2.2,1.4],'해':[3.2,0.8]};
  let selW=null;
  function enc(){
    const ws=[]; words($('encIn').value).forEach(w=>{ if(!ws.includes(w)) ws.push(w); });
    const list=ws.slice(0,12), n=list.length;
    if(!n){ $('encT').innerHTML=''; $('encNote').textContent='문장을 입력하세요.'; return; }
    let h='<tr><th>단어</th><th>고유한 값<br><small>(인덱스 표현)</small></th><th>원-핫 인코딩<br><small>(희소 표현)</small></th><th>워드 임베딩<br><small>(밀집 표현)</small></th></tr>';
    list.forEach((w,i)=>{
      const v=list.map((_,j)=>j===i?'<span class="one">1</span>':'0').join(', ');
      const e=EMB[w]?`(${EMB[w].join(', ')})`:'<span class="muted" style="font-family:inherit">학습으로 정해져요</span>';
      h+=`<tr data-w="${esc(w)}"${w===selW?' class="sel"':''}><td class="w">${esc(w)}</td><td>${i}</td><td>(${v})</td><td>${e}</td></tr>`;
    });
    $('encT').innerHTML=h;
    $('encT').querySelectorAll('tr[data-w]').forEach(r=>r.onclick=()=>{ selW=r.dataset.w; enc(); if(EMB[selW]){ setMode(0); pick(selW); } });
    const dup=words($('encIn').value).length-n;
    $('encNote').textContent=`단어가 ${n}개이므로 원-핫 벡터의 길이는 ${n}이에요.`+(dup>0?` 같은 단어가 다시 나오면 같은 값을 써요.`:'')+(ws.length>12?' (12단어까지만 보여 줘요)':'')+(list.some(w=>!EMB[w])?' 워드 임베딩 값은 많은 문장으로 학습해서 정해지기 때문에, 여기서는 교과서에 나온 값만 보여 줘요.':'');
  }
  $('encGo').onclick=enc; $('encIn').addEventListener('keydown',e=>{if(e.key==='Enter') enc();});
  $('encBook').onclick=()=>{ $('encIn').value=BOOK; enc(); };
  enc();

  const VS=[6,10,100,1000,10000,100000];
  function vocab(){
    const N=VS[+$('vocab').value]; $('vocabO').textContent=fmt(N)+'개';
    let s; if(N<=100){ s='('+Array.from({length:N},(_,j)=>j===2?'<b style="color:var(--acc)">1</b>':'0').join(', ')+')'; }
    else s=`(0, 0, <b style="color:var(--acc)">1</b>, 0, 0, 0, 0, 0, … <span class="muted">0이 ${fmt(N-9)}개 더</span> …, 0)`;
    $('vocabV').innerHTML='<span class="muted">별처럼 →</span> '+s;
    $('vocabSay').innerHTML=`칸 ${fmt(N)}개 중 1은 단 1개, 0이 ${fmt(N-1)}개 (<b>${(Math.round((N-1)/N*1000)/10)}%</b>가 0). 워드 임베딩은 그대로 <b>(1.2, 1.4)</b> 두 칸이에요.`;
  }
  $('vocab').oninput=vocab; vocab();

  const SETS=[
    {pts:Object.entries(EMB),xr:[0,3.5],yr:[0,1.6],note:'교과서 표 Ⅱ-11의 워드 임베딩 값을 그대로 찍었어요.'},
    {pts:[['고양이',[0.8,4.0]],['강아지',[1.7,4.5]],['토끼',[0.6,5.0]],['생선',[2.3,3.4]],['우유',[3.0,2.8]],['빵',[3.5,3.3]],['냉장고',[2.6,1.9]],['세탁기',[3.2,1.4]],['버스',[4.2,0.5]],['기차',[5.0,1.0]],['자전거',[4.6,2.0]]],xr:[0,5.5],yr:[0,5.5],note:'설명을 위해 예시로 정한 좌표예요. 실제 임베딩은 수백 개의 숫자로 이루어져 있어요.'}
  ];
  let mode=0;
  const svg=$('plot'), PX=v=>40+(v-S().xr[0])/(S().xr[1]-S().xr[0])*340, PY=v=>270-(v-S().yr[0])/(S().yr[1]-S().yr[0])*250;
  function S(){return SETS[mode];}
  function draw(){
    svg.innerHTML='';
    el('line',{x1:40,y1:270,x2:385,y2:270,stroke:'#9aa6b5'},svg); el('line',{x1:40,y1:270,x2:40,y2:15,stroke:'#9aa6b5'},svg);
    S().pts.forEach(([w,[x,y]])=>{
      const g=el('g',{class:'pt','data-w':w},svg);
      el('circle',{cx:PX(x),cy:PY(y),r:7,fill:'var(--acc)'},g);
      el('text',{x:PX(x)+10,y:PY(y)-8,'font-size':14,'font-weight':700,fill:'#16202c'},g,w);
      g.onclick=()=>pick(w);
    });
    $('plotNote').textContent=S().note; $('dist').innerHTML='<span class="muted">점을 눌러 보세요.</span>';
    [...$('plotPre').children].forEach((b,i)=>b.classList.toggle('on',i===mode));
  }
  function setMode(m){ if(m!==mode){ mode=m; draw(); } }
  function pick(w){
    const P=S().pts, me=P.find(p=>p[0]===w); if(!me) return;
    svg.querySelectorAll('.pt').forEach(g=>g.classList.toggle('sel',g.dataset.w===w));
    const d=P.filter(p=>p[0]!==w).map(([k,v])=>[k,Math.hypot(v[0]-me[1][0],v[1]-me[1][1])]).sort((a,b)=>a[1]-b[1]);
    $('dist').innerHTML=`<b>${esc(w)}</b> (${me[1].map(v=>v.toFixed(1)).join(', ')}) · 가장 가까운 단어: ${d.slice(0,2).map(([k,x])=>`<b>${k}</b> ${x.toFixed(2)}`).join(', ')} · 가장 먼 단어: <b>${d[d.length-1][0]}</b> ${d[d.length-1][1].toFixed(2)}<br><span class="muted" style="font-size:.88rem">원-핫 인코딩으로는 어떤 두 단어 사이의 거리도 똑같이 1.41이라, 가깝고 먼 관계를 알 수 없어요.</span>`;
  }
  $('plotPre').onclick=e=>{const b=e.target.closest('button'); if(b) setMode(+b.dataset.p);};
  draw();
})();

/* 2 ④ 단어 지도 (쉬운 워드 임베딩) */
(function(){
  // [단어, 동물인 정도, 크기, 먹을 수 있는 정도] — 설명용으로 정한 점수
  const W=[['강아지',.9,.3,0],['고양이',.88,.22,0],['코끼리',.95,.95,0],['개미',.8,.04,0],['기린',.92,.86,0],['버스',.05,.82,0],['자전거',.04,.3,0],['비행기',.03,.98,0],['사과',.1,.1,1],['수박',.1,.28,1]];
  const svg=$('emMap'); const X=v=>40+v*360, Y=v=>300-v*270;
  const jong=w=>{const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0;};
  const J=(w,a,b)=>w+(jong(w)?a:b);  // J('수박','과','와') → 수박과
  const LAB={'자전거':['end',-11,-6],'개미':['end',-11,-6],'코끼리':['end',-11,4],'기린':['end',-11,18]};
  const lab=(w,x,y)=>{const o=LAB[w]||(x>330?['end',-11,-8]:['start',11,-7]); return {x:x+o[1],y:y+o[2],'text-anchor':o[0]};};
  let sel=null, three=false;
  const dist=(a,b)=>Math.hypot(a[1]-b[1],a[2]-b[2],three?a[3]-b[3]:0);
  const near=(w,list)=>list.filter(x=>x[0]!==w[0]).map(x=>[x,dist(w,x)]).sort((a,b)=>a[1]-b[1]);
  function newWord(){ return [$('emNew').value.trim()||'새 단어', $('emA').value/100, $('emB').value/100, $('emC').value/100]; }
  function draw(){
    svg.innerHTML='';
    el('line',{x1:40,y1:300,x2:405,y2:300,stroke:'#9aa6b5'},svg); el('line',{x1:40,y1:300,x2:40,y2:20,stroke:'#9aa6b5'},svg);
    el('text',{x:405,y:322,'text-anchor':'end','font-size':13,fill:'#5b6776'},svg,'동물인 정도 →');
    el('text',{x:2,y:14,'font-size':13,fill:'#5b6776'},svg,'↑ 크기');
    const nw=newWord(), nn=near(nw,W).slice(0,2).map(x=>x[0][0]), sn=sel?near(sel,W).slice(0,1).map(x=>x[0][0]):[];
    nn.forEach(n=>{const t=W.find(w=>w[0]===n); el('line',{x1:X(nw[1]),y1:Y(nw[2]),x2:X(t[1]),y2:Y(t[2]),stroke:'#2f6fd0','stroke-dasharray':'4 4','stroke-width':1.5},svg);});
    W.forEach(w=>{
      const g=el('g',{class:'pt'+(sel&&sel[0]===w[0]?' sel':'')+(sn.includes(w[0])?' near':'')},svg);
      el('circle',{cx:X(w[1]),cy:Y(w[2]),r:three&&w[3]?10:7,fill:three&&w[3]?'#e0702b':'#1f9d74'},g);
      el('text',{...lab(w[0],X(w[1]),Y(w[2])),'font-size':14,'font-weight':700,fill:'#16202c'},g,w[0]);
      g.onclick=()=>pick(w[0]);
    });
    const g=el('g',{},svg); el('rect',{x:X(nw[1])-7,y:Y(nw[2])-7,width:14,height:14,rx:3,fill:'#2f6fd0'},g);
    el('text',{x:X(nw[1])+(X(nw[1])>330?-11:11),y:Y(nw[2])-12,'text-anchor':X(nw[1])>330?'end':'start','font-size':14,'font-weight':900,fill:'#2f6fd0'},g,nw[0]);
    $('emT').innerHTML='<tr><th>단어</th><th>동물인 정도</th><th>크기</th>'+(three?'<th>먹을 수 있는 정도</th>':'')+'</tr>'+W.map(w=>`<tr data-w="${w[0]}"${sel&&sel[0]===w[0]?' class="sel"':''}><td><b>${w[0]}</b></td><td>${w[1].toFixed(2)}</td><td>${w[2].toFixed(2)}</td>${three?`<td>${w[3]}</td>`:''}</tr>`).join('');
    $('emT').querySelectorAll('tr[data-w]').forEach(r=>r.onclick=()=>pick(r.dataset.w));
    ['A','B','C'].forEach(k=>$('em'+k+'o').textContent=($('em'+k).value/100).toFixed(2));
    const d=near(nw,W);
    $('emNewSay').innerHTML=`「<b>${esc(nw[0])}</b>」 (${nw.slice(1,three?4:3).map(v=>v.toFixed(2)).join(', ')})${jong(nw[0])?'과':'와'} 가장 가까운 단어는 <b>${d[0][0][0]}</b>, 그다음은 <b>${J(d[1][0][0],'이에요','예요')}</b>. 인공지능은 「${esc(nw[0])}」${jong(nw[0])?'을':'를'} ${J(d[0][0][0],'과','와')} 비슷한 단어로 여길 거예요.`;
  }
  function pick(name){
    sel=W.find(w=>w[0]===name); draw();
    const d=near(sel,W), a=d[0], b=d[1];
    let msg=`<b>${sel[0]}</b>${jong(sel[0])?'과':'와'} 가장 가까운 단어: <b>${a[0][0]}</b> (거리 ${a[1].toFixed(2)}), 그다음 <b>${b[0][0]}</b> (${b[1].toFixed(2)})`;
    if(sel[0]==='수박'&&!three) msg+=`<br>🤔 수박이 <b>자전거</b>와 가장 가깝다고요? 점수가 「동물인 정도」와 「크기」 두 개뿐이라, 동물이 아니고 크기가 비슷한 자전거가 가까워졌어요. 아래 <b>「먹을 수 있는 정도」</b>를 켜 보세요.`;
    if(sel[0]==='수박'&&three) msg+=`<br>✅ 점수를 하나 더 붙이니 수박이 <b>사과</b>와 가장 가까워졌어요. 그래서 진짜 워드 임베딩은 점수를 수백 개 써서 단어의 여러 성질을 함께 담아요.`;
    $('emSay').innerHTML=msg;
  }
  $('em3').onchange=()=>{three=$('em3').checked; $('emCwrap').style.display=three?'grid':'none'; if(sel) pick(sel[0]); else draw();};
  ['emNew','emA','emB','emC'].forEach(id=>$(id).addEventListener('input',draw));
  draw(); $('emSay').innerHTML='<span class="muted">점이나 표의 줄을 눌러 보세요.</span>';
})();

/* 3 빈도수 기반 */
(function(){
  const CAT=[['연예','#e2899c',['배우','영화','공연','가수']],['경제','#5fb36b',['투자','성장','경제','기업']],['스포츠','#9b7fd4',['경기','선수','팀','승리']]];
  const PRE=[
    ['교과서 새로운 문장','선수는 이번 경기에서 팀을 승리로 이끌었습니다.'],
    ['연예 문서','배우는 A 영화의 주인공이다. 이 가수는 이번 공연에서 많은 활약을 했다.'],
    ['경제 문서','기업들이 새로운 기술에 투자를 늘리면서 경제 성장에 대한 기대가 커지고 있다.'],
    ['헷갈리는 문장','축구 선수 출신 배우가 영화 홍보를 위해 경기장을 찾았다.'],
  ];
  $('newsPre').innerHTML=PRE.map((p,i)=>`<button class="chip${i?'':' on'}" data-i="${i}">${p[0]}</button>`).join('');
  $('newsIn').value=PRE[0][1];
  $('newsPre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; [...$('newsPre').children].forEach(x=>x.classList.toggle('on',x===b)); $('newsIn').value=PRE[+b.dataset.i][1]; run();};
  function catOf(w){ for(const [n,c,ks] of CAT) for(const k of ks) if(w.startsWith(k)) return [n,c,k]; return null; }
  function run(){
    const ws=words($('newsIn').value); const cnt={연예:0,경제:0,스포츠:0};
    $('bag').innerHTML=shuffle(ws).map((w,i)=>{const c=catOf(w); if(c) cnt[c[0]]++; return `<span class="tok${c?' hit':' dim'}" style="animation-delay:${i*40}ms;${c?`border-color:${c[1]};background:${c[1]}22`:''}">${esc(w)}</span>`;}).join('');
    const tot=Object.values(cnt).reduce((a,b)=>a+b,0);
    $('newsBars').innerHTML=barsHTML(CAT.map(([n,c])=>({k:`${n} ${cnt[n]}번`,p:pct(cnt[n],tot),c})));
    animBars($('newsBars'));
    const mx=Math.max(...Object.values(cnt)), top=CAT.filter(([n])=>cnt[n]===mx&&mx>0).map(([n])=>n);
    $('newsCls').innerHTML=!tot?'<span class="muted" style="font-size:1rem">모아 둔 단어가 하나도 없어서 분류할 수 없어요.</span>':top.length>1?`<span class="ng">${top.join('·')} 동점!</span> <span style="font-size:.95rem;font-weight:500">빈도수만으로는 정하기 어려워요.</span>`:`→ <span style="color:${CAT.find(c=>c[0]===top[0])[1]}">${top[0]}</span> 기사로 분류`;
  }
  $('newsGo').onclick=run; run();

  const H=['배우','공연','가수','투자','성장','경제','기업','선수','경기','팀','승리'], G=[0,0,0,1,1,1,1,2,2,2,2];
  const D=[[10,7,5,2,2,0,0,0,0,0,0,'연예',0],[0,2,2,5,6,7,7,2,1,0,0,'경제',1],[0,3,2,1,2,0,0,10,20,8,2,'스포츠',2]];
  $('tb12').innerHTML='<tr><th></th>'+H.map(h=>`<th>${h}</th>`).join('')+'<th>기사 분류</th></tr>'+D.map((r,i)=>`<tr><th>문서 ${i+1}</th>${H.map((_,j)=>`<td${G[j]===r[12]?' class="hi"':''}>${r[j]}</td>`).join('')}<td><b>${r[11]}</b></td></tr>`).join('');

  // 워드 클라우드
  const WC=[
    ['학교 신문 기사','우리 학교 축구 팀이 지역 대회 결승 경기에서 승리를 거두었다. 주장 선수는 경기 내내 팀을 이끌었고 후반에 결승 골을 넣었다. 감독은 선수가 모두 끝까지 뛰어 준 덕분에 승리를 얻었다고 말했다. 팀은 다음 달 전국 대회 경기에 나선다. 학생들은 축구 팀의 승리를 함께 축하했다.'],
    ['오늘 배운 내용','자연어 처리는 사람의 언어를 기계가 이해하고 생성하는 기술이다. 언어 이해는 문장의 의미를 파악하고 언어 생성은 자연스러운 문장을 만든다. 챗봇은 언어 이해와 언어 생성을 모두 사용한다. 기계는 단어를 숫자로 바꾸어 언어를 처리한다. 단어를 숫자로 바꾸는 방법에는 원-핫 인코딩과 워드 임베딩이 있다.'],
    ['직접 입력','']
  ];
  const STOP=new Set(['것','수','있다','있는','있었다','하는','했다','한다','하고','이','그','저','등','및','더','또','한','위해','대한','통해','이번','다음','같은','때','안','못','잘','우리','모두','함께']);
  $('wcPre').innerHTML=WC.map((p,i)=>`<button class="chip${i?'':' on'}" data-i="${i}">${p[0]}</button>`).join('');
  $('wcIn').value=WC[0][1];
  $('wcPre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; [...$('wcPre').children].forEach(x=>x.classList.toggle('on',x===b)); const t=WC[+b.dataset.i][1]; $('wcIn').value=t; if(t) cloud(); else{ $('wcIn').placeholder='좋아하는 노래 소개, 기사, 내가 쓴 글을 붙여 넣어 보세요.'; $('wcIn').focus(); }};
  const COL=['#2f6fd0','#d64535','#1f9d74','#c98a00','#9b4fc4','#e0702b','#0f2742'];
  function cloud(){
    const cnt={}; words($('wcIn').value).map(stem).forEach(w=>{ if(!w || (/^\d+$/.test(w))) return; if($('wcStop').checked && STOP.has(w)) return; cnt[w]=(cnt[w]||0)+1; });
    const L=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,40), svg=$('cloud'); svg.innerHTML='';
    if(!L.length){ $('wcTop').textContent='단어가 없어요.'; return; }
    const mx=L[0][1], mn=L[L.length-1][1], boxes=[];
    const W=640,Hh=300;
    L.forEach(([w,c],i)=>{
      const fs=mx===mn?28:Math.round(15+Math.sqrt((c-mn)/(mx-mn))*41);
      const wd=[...w].reduce((s,ch)=>s+(/[가-힣]/.test(ch)?1:.62),0)*fs+6, ht=fs*1.05;
      for(let t=0;t<2400;t++){
        const a=t*.21, r=2.2*a, x=W/2+r*Math.cos(a)*1.6-wd/2, y=Hh/2+r*Math.sin(a)-ht/2;
        if(x<4||y<4||x+wd>W-4||y+ht>Hh-4) continue;
        if(boxes.some(b=>x<b[0]+b[2]&&x+wd>b[0]&&y<b[1]+b[3]&&y+ht>b[1])) continue;
        boxes.push([x,y,wd,ht]);
        el('text',{x:x+wd/2,y:y+ht*.8,'text-anchor':'middle','font-size':fs,fill:COL[i%COL.length],style:`animation-delay:${i*30}ms`},svg,w).appendChild(el('title',{},null,`${w} ${c}번`));
        break;
      }
    });
    $('wcTop').innerHTML='가장 많이 나온 단어: '+L.slice(0,5).map(([w,c])=>`<b>${esc(w)}</b> ${c}번`).join(', ')+'. 글의 주제가 한눈에 보이나요? 그런데 이 그림만 보고 <b>누가 이겼는지, 어떤 일이 먼저 일어났는지</b>도 알 수 있을까요?';
  }
  $('wcGo').onclick=cloud; $('wcStop').onchange=cloud; cloud();

  // 단어 주머니 비교
  window.pairBag=function(box,a,b){
    const ba=words(a).map(stem).sort(), bb=words(b).map(stem).sort(), same=ba.join('|')===bb.join('|');
    box.innerHTML=[[a,ba],[b,bb]].map(([s,bg])=>`<div><b>${esc(s)}</b><div style="margin-top:6px">${bg.map(w=>`<span class="tok">${esc(w)}</span>`).join('')}</div></div>`).join('')+`<div style="grid-column:1/-1;font-weight:900" class="${same?'ng':'ok'}">${same?'👜 두 주머니가 똑같아요! 빈도수만 보면 두 문장을 구별할 수 없어요.':'두 주머니가 달라요.'}</div>`;
  };
  const PR=[['개가 사람을 물었다','사람이 개를 물었다'],['나는 너를 사랑해','너는 나를 사랑해'],['동생이 형보다 크다','형이 동생보다 크다']];
  $('pairPre').innerHTML=PR.map((p,i)=>`<button class="chip${i?'':' on'}" data-i="${i}">${p[0]} / ${p[1]}</button>`).join('');
  $('pairPre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; [...$('pairPre').children].forEach(x=>x.classList.toggle('on',x===b)); pairBag($('pair'),...PR[+b.dataset.i]);};
  pairBag($('pair'),...PR[0]);
})();

/* 4 의미론적 접근 */
(function(){
  $('stg').onclick=e=>{const b=e.target.closest('button'); if(!b) return; const s=+b.dataset.s; [...$('stg').children].forEach(x=>x.classList.toggle('on',x===b)); document.querySelectorAll('.sp').forEach(p=>p.classList.toggle('on',+p.dataset.s===s));};

  // 형태소 분석
  const MO=[
    {t:'The small dog quickly ran home to his owner.',m:[['The'],['small'],['dog'],['quickly'],['ran'],['home'],['to'],['his'],['owner'],['.']],f:[],say:'영어는 띄어쓰기로 대부분 나뉘어요. 교과서처럼 The/small/dog/quickly/ran/home/to/his/owner/. 로 나눠요.'},
    {t:'영수는 서울에 3번 간 적이 있다.',m:[['영수','는'],['서울','에'],['3','번'],['가','ㄴ'],['적','이'],['있','다'],['.']],f:['는','에','ㄴ','이','다'],say:'회색은 조사와 어미예요. 떼어 내면 「영수, 서울, 3번, 가다, 적, 있다」라는 기본 형태가 보여요.'},
    {t:'나는 사과를 먹었다.',m:[['나','는'],['사과','를'],['먹','었','다'],['.']],f:['는','를','었','다'],say:'「먹었다」는 먹(먹다) + 었(지난 일) + 다(문장 끝)로 나뉘어요. 한국어는 이렇게 단어 뒤에 붙는 말이 많아서 형태소 분석이 특히 중요해요.'},
  ];
  let mi=0;
  function moShow(split){
    const x=MO[mi];
    if(!split){ $('moOut').textContent=x.t; $('moSay').textContent=''; return; }
    $('moOut').innerHTML=x.m.map(g=>g.map((m,j)=>`<span class="m${(j>0&&x.f.includes(m))?' f':''}" style="animation:pop .35s ${j*80}ms both">${esc(m)}</span>`).join('<span class="sl">/</span>')).join('<span class="sl">/</span> ');
    $('moSay').textContent=x.say;
  }
  $('moPre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; mi=+b.dataset.i; [...$('moPre').children].forEach(x=>x.classList.toggle('on',x===b)); moShow(false);};
  $('moGo').onclick=()=>moShow(true); moShow(false);

  // 구문 분석
  const DW=['The','small','dog','quickly','ran','home','to','his','owner','.'];
  const ARC=[[0,2,'꾸밈'],[1,2,'꾸밈'],[2,4,'주어'],[3,4,'어떻게'],[5,4,'어디로'],[6,8,'방향'],[7,8,'누구의'],[8,4,'누구에게']]; // [단어, 머리, 관계]
  const DS={
    0:'The는 dog를 꾸며요.',1:'small(작은)은 dog를 꾸며요. 어떤 개? 작은 개!',
    2:'dog는 ran의 주어예요. 누가 달렸나? 개가! The와 small이 dog를 꾸며요.',
    3:'quickly(빠르게)는 ran을 꾸며요. 어떻게 달렸나? 빠르게!',
    4:'ran(달렸다)이 문장의 중심이에요. 누가(dog), 어떻게(quickly), 어디로(home), 누구에게(owner)가 모두 ran에 연결돼요.',
    5:'home(집으로)은 ran에 연결돼요. 어디로 달렸나? 집으로!',
    6:'to는 owner 앞에 붙어 방향을 나타내요.',7:'his(그의)는 owner를 꾸며요. 누구의 주인? 그의!',
    8:'owner(주인)는 ran에 연결돼요. 누구에게 달렸나? 주인에게!',9:'마침표는 문장이 끝났다는 표시예요.'
  };
  const svg=$('dep'), X=i=>38+i*72;
  el('defs',{},svg).innerHTML='<marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#9aa6b5"/></marker>';
  const arcs=ARC.map(([d,h,l])=>{
    const x1=X(d),x2=X(h),hgt=18+Math.abs(d-h)*16, mx=(x1+x2)/2;
    const p=el('path',{d:`M${x1} 122 C${x1} ${122-hgt*1.3} ${x2} ${122-hgt*1.3} ${x2} 122`,class:'arc','marker-end':'url(#ah)'},svg);
    const t=el('text',{x:mx,y:122-hgt-2,'text-anchor':'middle',class:'lb'},svg,l);
    return {d,h,p,t};
  });
  DW.forEach((w,i)=>{const t=el('text',{x:X(i),y:148,'text-anchor':'middle','font-size':17,'font-weight':700,fill:'#16202c',class:'w'},svg,w); t.onclick=()=>dsel(i);});
  function dsel(i){ arcs.forEach(a=>{const on=a.d===i||a.h===i; a.p.classList.toggle('on',on); a.t.classList.toggle('on',on);}); $('depSay').textContent=DS[i]; }
  dsel(2);

  // 의미 분석
  const A=['사과','우유','기차','버스','책','노래'], B=['먹는다','마신다','탄다','읽는다','부른다'];
  const OK={'사과|먹는다':'자연스러워요.','우유|마신다':'자연스러워요.','우유|먹는다':'자연스러워요. 우유는 마시기도 하고 먹는다고도 해요.','우유|탄다':'말이 돼요! "커피에 우유를 탄다"처럼 이때 \'타다\'는 \'섞다\'라는 뜻이에요. 같은 단어도 함께 쓰인 단어에 따라 뜻이 달라져요.','기차|탄다':'자연스러워요.','버스|탄다':'자연스러워요.','책|읽는다':'자연스러워요.','노래|부른다':'자연스러워요.'};
  $('seA').innerHTML=A.map(a=>`<option>${a}</option>`).join(''); $('seB').innerHTML=B.map(b=>`<option>${b}</option>`).join('');
  const josa=w=>{const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28?'을':'를';};
  function se(){ const a=$('seA').value,b=$('seB').value,k=a+'|'+b, ok=OK[k];
    $('seA').nextElementSibling.textContent=josa(a);
    $('seR').innerHTML=ok?'<span class="ok">O</span>':'<span class="ng">X</span>';
    $('seSay').innerHTML=`<b>${a}${josa(a)} ${b}.</b> `+(ok||`어색해요. ${a}${josa(a)} ${b}는 뜻이 맞지 않아요. 의미 분석은 이런 조합을 가려내요.`); }
  $('seA').onchange=se; $('seB').onchange=se; $('seB').value='먹는다'; se();
  $('entGo').onclick=()=>{ const on=!$('ent1').classList.contains('show'); $('ent1').classList.toggle('show',on); $('ent2').classList.toggle('show',on); $('entGo').textContent=on?'🏷 표시 지우기':'🏷 개체명 찾기'; };

  // 담화·의도 분석
  const DI=[
    {c:[['l','답답한데 창문 좀 열어도 돼?'],['r','응, 열어.'],['l','(10분 뒤) 좀 추운데.']],a:0},
    {c:[['l','이제 공원에 가자!'],['r','그래, 지금 나가자.'],['l','좀 추운데.']],a:1},
  ];
  const OPT=['창문을 닫아 달라는 뜻','겉옷을 챙기자는 뜻','지금 기온을 알려 달라는 뜻'];
  let di=0;
  function diShow(){
    const d=DI[di]; $('diChat').innerHTML=d.c.map(([s,t])=>`<div class="${s}">${t}</div>`).join('');
    $('diOpt').innerHTML=OPT.map((o,i)=>`<button class="chip" data-i="${i}">${o}</button>`).join(''); $('diSay').textContent='';
    $('diOpt').onclick=e=>{const b=e.target.closest('button'); if(!b) return; const ok=+b.dataset.i===d.a;
      [...$('diOpt').children].forEach((x,i)=>x.classList.toggle('on',i===d.a));
      $('diSay').innerHTML=(ok?'<span class="ok">✔ 맞아요.</span> ':'<span class="ng">✘ 앞의 대화를 다시 보세요.</span> ')+(di===0?'창문을 연 뒤에 한 말이라 창문을 닫아 달라는 뜻이에요.':'밖에 나가려는 참에 한 말이라 겉옷을 챙기자는 뜻이에요.')+` 같은 "좀 추운데."라도 대화 전체의 맥락에 따라 의도가 달라져요. ${di===0?'<b>대화 B</b>도 해 보세요.':''}`;};
  }
  $('diPre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; di=+b.dataset.i; [...$('diPre').children].forEach(x=>x.classList.toggle('on',x===b)); diShow();};
  diShow();
})();

/* 5 순환 신경망 */
(function(){
  pairBag($('ordBag'),'나는 너를 사랑해','너는 나를 사랑해');
  const WS=['너는','노래를','못','부르지','않아'];
  const OA=['중립','중립','부정','중립','부정'], OB=['중립','중립','부정','부정','긍정'];
  const cls=o=>o==='부정'?'neg':o==='긍정'?'pos':'neu';
  function lane(id,O,res,rnn){
    $(id).innerHTML=WS.map((w,i)=>`<div class="o ${cls(O[i])}">${O[i]}</div>`).join('')+'<div></div>'+
      WS.map((w,i)=>`<div class="h">${rnn&&i?'<span class="mem">→</span>':''}은닉층</div>`).join('')+`<div class="res ${cls(res)}">결과 ${res}</div>`+
      WS.map(w=>`<div class="in">${w}</div>`).join('')+'<div></div>';
  }
  lane('laneA',OA,'부정',false); lane('laneB',OB,'긍정',true);
  let k=0;
  function set(n){
    k=n;
    ['laneA','laneB'].forEach(id=>{const L=$(id); [...L.querySelectorAll('.o')].forEach((e,i)=>e.classList.toggle('on',i<k)); [...L.querySelectorAll('.h')].forEach((e,i)=>e.classList.toggle('on',i<k)); L.querySelector('.res').classList.toggle('on',k>=WS.length);});
    $('sayA').innerHTML=k===0?'':k<WS.length?`지금 보는 단어: <b>${WS[k-1]}</b> · 앞 단어는 기억하지 않아요.`:'마지막 「않아」만 보고 <b class="neg">부정</b>으로 판단했어요.';
    $('sayB').innerHTML=k===0?'':k<WS.length?`기억하고 있는 내용: <b>${WS.slice(0,k).join(' ')}</b>`:'「못 부르지 않아」 = 잘 부른다는 뜻. 앞에서 들은 내용을 기억해서 <b class="pos">긍정</b>으로 판단했어요.';
    $('rnnGo').textContent=k>=WS.length?'↺ 처음부터':'▶ 한 단어씩 넣기';
  }
  $('rnnGo').onclick=()=>set(k>=WS.length?0:k+1);
  $('rnnAll').onclick=()=>set(WS.length);
  set(0);

  const TL=[
    ['RNN','1986','순환 신경망. 이전의 정보를 기억하면서 현재의 입력을 처리해요. 단어의 순서를 다룰 수 있게 되었어요.'],
    ['LSTM','1997','문장이 길어지면 앞부분의 정보를 잃어버리는 현상을 개선했어요.'],
    ['Seq2Seq','NIPS 2014','문장 하나를 입력받아 다른 문장을 출력하는 구조예요. 번역처럼 문장을 문장으로 바꾸는 일에 쓰였어요.'],
    ['Attention','ICLR 2015','입력되는 단어 중 중요한 단어에 집중하고 덜 중요한 단어는 무시하여 성능을 높였어요.'],
    ['Transformer','NIPS 2017','문장 속 단어처럼 순서가 있는 데이터 안의 관계를 추적해 의미와 맥락을 학습해요. 의미가 미묘하게 달라지는 부분까지 감지해요.'],
    ['GPT-1','2018','Transformer를 바탕으로, 앞 단어들을 보고 다음 단어를 예측하도록 학습한 생성형 모델이에요.'],
    ['BERT','NAACL 2019','Transformer를 바탕으로, 문장의 앞뒤 문맥을 함께 보며 언어를 이해하도록 학습한 모델이에요.'],
    ['GPT-3','2020','아주 많은 텍스트로 학습한 대형 언어 모델(LLM)이에요. 오늘날 챗봇으로 이어지는 큰 발전이었어요.'],
  ];
  $('tl').innerHTML=TL.map((t,i)=>`<button data-i="${i}"><i></i><b>${t[0]}</b>${t[1]}</button>`).join('');
  function tl(i){ [...$('tl').children].forEach((b,j)=>b.classList.toggle('on',j===i)); $('tlBox').innerHTML=`<b>${TL[i][0]}</b> <span class="muted">(${TL[i][1]})</span> · ${TL[i][2]}`; }
  $('tl').onclick=e=>{const b=e.target.closest('button'); if(b) tl(+b.dataset.i);};
  tl(0);
})();

/* 6 생성형 언어 모델 */
(function(){
  const V=['먹다','타다','마시다'], R=[['밥',[350,0,10]],['버스',[0,200,0]],['커피',[50,5,400]]];
  $('t13').innerHTML='<tr><th></th>'+V.map(v=>`<th>${v}</th>`).join('')+'</tr>'+R.map(([n,c],i)=>{const m=Math.max(...c); return `<tr class="pickrow" data-i="${i}"><th>${n}</th>${c.map(x=>`<td${x===m?' class="mx"':''}>${x}</td>`).join('')}</tr>`;}).join('');
  function t13(i){ const [n,c]=R[i], t=c.reduce((a,b)=>a+b,0);
    [...$('t13').querySelectorAll('.pickrow')].forEach((r,j)=>r.classList.toggle('on',j===i));
    $('t13Bars').innerHTML=`<p style="margin:4px 0 0;font-size:.93rem">'<b>${n}</b>' 다음에 올 단어의 확률 (모두 ${t}번 중)</p>`+barsHTML(V.map((v,j)=>({k:v,p:pct(c[j],t)})));
    animBars($('t13Bars')); }
  $('t13').onclick=e=>{const r=e.target.closest('.pickrow'); if(r) t13(+r.dataset.i);};
  t13(0);

  // 작은 언어 모델 (바로 앞 단어 → 다음 단어 빈도)
  const CORPUS=['세훈이는 우유를 마신다.','세훈이는 우유를 마신다.','세훈이는 우유를 마신다.','세훈이는 우유를 마신다.','세훈이는 우유를 먹는다.','세훈이는 TV를 본다.','세훈이는 TV를 본다.','세훈이는 TV를 본다.','세훈이는 버스를 탄다.','세훈이는 버스를 탄다.','동생은 우유를 마신다.','동생은 우유를 먹는다.','동생은 TV를 본다.','누나는 우유를 마신다.','누나는 책을 읽는다.','엄마는 커피에 우유를 탄다.','아빠는 커피에 우유를 탄다.','아빠는 버스를 탄다.'];
  const END='.';
  $('lmCorpus').value=CORPUS.join('\n');
  let NX={}, starts=[], seq=[], runs=[];
  function train(){
    NX={}; const st={}; let lines=0, pairs=0;
    $('lmCorpus').value.split('\n').forEach(l=>{ const ws=words(l); if(!ws.length) return; lines++; st[ws[0]]=(st[ws[0]]||0)+1; ws.push(END);
      for(let i=0;i<ws.length-1;i++){ const a=ws[i],b=ws[i+1]; NX[a]=NX[a]||{}; if(!NX[a][b]) pairs++; NX[a][b]=(NX[a][b]||0)+1; } });
    starts=Object.keys(st).sort((a,b)=>st[b]-st[a]);
    $('lmInfo').textContent=`문장 ${lines}개에서 「앞 단어 → 다음 단어」 ${pairs}가지를 학습했어요.`;
    $('lmStart').innerHTML='<span class="muted" style="font-size:.88rem;align-self:center">첫 단어:</span>'+starts.map(w=>`<button class="chip" data-w="${esc(w)}">${esc(w)}</button>`).join('');
    runs=[]; $('lmRuns').innerHTML='';
    begin(starts[0]);
  }
  function cands(){ const last=seq[seq.length-1]; const m=NX[last]||{}; const t=Object.values(m).reduce((a,b)=>a+b,0);
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({k:k===END?'(문장 끝)':k,w:k,v,p:pct(v,t)})); }
  function done(){ return seq[seq.length-1]===END || !cands().length; }
  function render(fresh){
    const ws=seq.filter(w=>w!==END);
    $('lmSent').innerHTML=ws.map((w,i)=>`<span${fresh&&i===ws.length-1?' class="nw"':''}>${esc(w)}</span>`).join(' ')+(done()?'<span class="end">. (끝)</span>':' <span class="end">…</span>');
    [...$('lmStart').querySelectorAll('[data-w]')].forEach(b=>b.classList.toggle('on',b.dataset.w===seq[0]));
    const c=cands();
    if(done()){ $('lmBars').innerHTML='<p class="muted" style="margin:4px 0">문장이 끝났어요. 첫 단어를 다시 눌러 새 문장을 만들어 보세요.</p>'; }
    else{ $('lmBars').innerHTML=`<p style="margin:4px 0 0;font-size:.93rem">'<b>${esc(seq[seq.length-1])}</b>' 다음에 올 단어</p>`+barsHTML(c,{pick:true}); animBars($('lmBars'));
      $('lmBars').querySelectorAll('.bar').forEach(b=>b.onclick=()=>add(c[+b.dataset.i].w)); }
    ['lmTop','lmRand','lmAuto'].forEach(id=>$(id).disabled=done());
  }
  function add(w){ if(done()) return; seq.push(w); if(done()){ const s=seq.filter(x=>x!==END).join(' ')+'.'; runs.unshift(s); runs=runs.slice(0,8); $('lmRuns').innerHTML=runs.map(r=>`<li>${esc(r)}</li>`).join(''); } render(true); }
  function sample(){ const c=cands(), t=c.reduce((a,b)=>a+b.v,0); let r=Math.random()*t; for(const x of c){ r-=x.v; if(r<0) return x.w; } return c[c.length-1].w; }
  function begin(w){ seq=[w]; render(true); }
  $('lmStart').onclick=e=>{const b=e.target.closest('[data-w]'); if(b) begin(b.dataset.w);};
  $('lmTop').onclick=()=>{ const c=cands(); if(c.length) add(c[0].w); };
  $('lmRand').onclick=()=>{ if(!done()) add(sample()); };
  $('lmAuto').onclick=async()=>{ for(let n=0;n<15&&!done();n++){ add(sample()); await sleep(450); } };
  $('lmTrain').onclick=train;
  train();
})();

/* 화면을 떠나면 소리 멈추기 */
const _go=go;
go=function(i){ if('speechSynthesis' in window) speechSynthesis.cancel(); _go(i); };


