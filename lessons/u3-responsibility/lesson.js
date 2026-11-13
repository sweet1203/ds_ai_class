
/* 01 윤리 원칙 연표 */
const PRIN=[
 {y:'1956',n:'인공지능 연구의 시작',k:'#5b6776',d:'다트머스 회의로 인공지능 연구가 시작되었어요. 초기에는 <b>기술 개발</b>에 초점이 맞춰져 있었어요.'},
 {y:'2017',n:'미국 · 아실로마 23원칙',k:'#2f6fd0',d:'인간에게 유용하고 <b>이로운 혜택을 주는</b> 인공지능을 개발하자는 원칙이에요. 인공지능 윤리 문제가 떠오르며 사회적 책임의 필요성이 강조되기 시작했어요.'},
 {y:'2018',n:'유럽연합 · 신뢰할 수 있는 AI 윤리 가이드라인',k:'#9b4fc4',d:'인간의 <b>기본권(존엄, 자유, 평등, 정의 등)</b>에 바탕을 둔 윤리 원칙이에요.'},
 {y:'2019',n:'경제협력개발기구(OECD) · 인공지능 권고안',k:'#e0702b',d:'<b>최초로 국제 수준의 합의</b>가 이루어진 인공지능 권고안이에요.'},
 {y:'2020',n:'우리나라 · 인공지능 윤리 기준',k:'#d64535',d:'<b>사람이 중심이 되는</b> 인공지능 윤리 기준이에요. 이후 자율주행 자동차 윤리 가이드라인, 교육 분야 인공지능 윤리 원칙 등도 만들어졌어요.'},
];
(function(){
  $('tlBtns').innerHTML=PRIN.map((d,i)=>`<button data-i="${i}">${d.y}</button>`).join('');
  const bs=[...$('tlBtns').querySelectorAll('button')];
  const pick=i=>{bs.forEach((b,j)=>b.classList.toggle('on',i===j)); const d=PRIN[i]; $('tlView').innerHTML=`<div class="kc" style="--k:${d.k}"><h4>${d.y} · ${d.n}</h4><p>${d.d}</p></div>`;};
  bs.forEach(b=>b.onclick=()=>pick(+b.dataset.i)); pick(1);
})();

/* 02 가치 분류 */
sorter('valGame',{
  cats:[{n:'🙋 책임성',k:'#d64535'},{n:'⚖️ 공정성',k:'#2f6fd0'},{n:'🔍 투명성',k:'#1f9d74'}],
  items:[
    {t:'자율주행 자동차 사고가 나면 제조사, 운전자 중 누가 책임질지 미리 정해 두자.',short:'사고 책임자 미리 정하기',c:0,ic:'🚗'},
    {t:'오류로 피해를 본 사람이 어디에 알리고 어떻게 보상받는지 절차를 만들자.',short:'피해 보상 절차',c:0,ic:'📝'},
    {t:'대출 심사 인공지능이 사는 지역 때문에 누군가를 불리하게 평가하지 않는지 확인하자.',short:'지역에 따른 차별 확인',c:1,ic:'🏦'},
    {t:'얼굴 인식 인공지능이 피부색이나 나이와 상관없이 똑같이 잘 맞히도록 데이터를 고르게 모으자.',short:'고르게 데이터 모으기',c:1,ic:'🧑‍🤝‍🧑'},
    {t:'추천 인공지능이 어떤 기준으로 이 영상을 추천했는지 사용자에게 알려 주자.',short:'추천 이유 알려 주기',c:2,ic:'📺'},
    {t:'어떤 데이터와 알고리즘을 썼고 어떤 검증을 거쳤는지 공개하자.',short:'데이터·알고리즘·검증 공개',c:2,ic:'📂'},
  ],
  end:'하나의 사례에도 세 가지 가치가 함께 필요할 때가 많아요. 다음 화면에서 사람마다 나누어 살펴봐요.'
});

/* 03 3 × 3 표 */
(function(){
  const R=['👩‍💻 개발자','🙋 사용자','🛠️ 운영·관리자'], C=['책임성','공정성','투명성'];
  const S=[
    [0,0,'내가 만든 시스템의 오류로 생기는 문제에 어떤 책임감을 가져야 하는지 알아 둬야 해!'],
    [0,1,'어떤 속성이 성별 편향을 일으키는 원인이지?'],
    [0,2,'모델에 쓴 데이터와 알고리즘을 정리하고 문서로 남겨야 해!'],
    [1,0,'시스템 때문에 손해가 생기면 해결하는 절차는 무엇이지?'],
    [1,1,'나는 다른 동료들과 비교해 불공정한 대우를 받고 있나?'],
    [1,2,'임금을 예측한 기준은 무엇이고 설득력이 있나?'],
    [2,0,'임금이 잘못 예측되어 피해가 있었다면 책임을 져야 해!'],
    [2,1,'시스템이 올바른 결과를 내는지 계속 모니터링해야 해!'],
    [2,2,'서비스를 제공할 때 유의 사항을 미리 알려야 해!'],
  ];
  let sel=null, filled={}, tries=0;
  function draw(){
    const left=shuffle(S.map((_,i)=>i).filter(i=>!filled[i]));
    $('mxPool').innerHTML=left.map(i=>`<button data-i="${i}" class="${sel===i?'on':''}">💬 ${S[i][2]}</button>`).join('')||'<span class="ok">🎉 아홉 칸을 모두 채웠어요!</span>';
    $('mxPool').querySelectorAll('button').forEach(b=>b.onclick=()=>{sel=+b.dataset.i; $('mxPool').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); $('mxMsg').textContent='이제 표에서 알맞은 칸을 눌러요.';});
    let h='<tr><th></th>'+C.map(c=>`<th>${c}</th>`).join('')+'</tr>';
    R.forEach((r,ri)=>{h+=`<tr><th class="r">${r}</th>`+C.map((c,ci)=>{const i=S.findIndex(s=>s[0]===ri&&s[1]===ci); return filled[i]?`<td class="fill">${S[i][2]}</td>`:`<td data-r="${ri}" data-c="${ci}"></td>`;}).join('')+'</tr>';});
    $('mxT').innerHTML=h;
    $('mxT').querySelectorAll('td[data-r]').forEach(td=>td.onclick=()=>{
      if(sel==null){$('mxMsg').textContent='먼저 위에서 말풍선을 하나 골라요.';return;}
      const r=+td.dataset.r,c=+td.dataset.c,s=S[sel]; tries++;
      if(s[0]===r&&s[1]===c){filled[sel]=1; sel=null; const n=Object.keys(filled).length; $('mxMsg').innerHTML=n===9?`<span class="ok">완성! ${tries}번 만에 아홉 칸을 채웠어요.</span>`:`<span class="ok">맞아요!</span> ${n} / 9`; draw();}
      else{td.classList.add('bad'); setTimeout(()=>td.classList.remove('bad'),600);
        $('mxMsg').innerHTML=s[0]===r?'<span class="ng">사람은 맞았어요.</span> 어떤 가치를 지키려는 말인지 다시 생각해 봐요.':s[1]===c?'<span class="ng">가치는 맞았어요.</span> 누가 하는 말인지 다시 생각해 봐요.':'<span class="ng">아쉬워요.</span> 누가, 어떤 가치를 위해 하는 말인지 다시 생각해 봐요.';}
    });
  }
  $('mxReset').onclick=()=>{filled={};sel=null;tries=0;$('mxMsg').textContent='';draw();};
  $('mxShow').onclick=()=>{S.forEach((_,i)=>filled[i]=1);sel=null;$('mxMsg').textContent='교과서 158쪽의 내용이에요.';draw();};
  draw();
})();

/* 04 XAI 그림 */
(function(){
  const svg=$('xaiSvg');
  const IMP=new Set(['1,1','1,2','4,1','4,2','2,2','3,2','2,3','3,3']);
  function draw(explain){
    svg.innerHTML='';
    el('rect',{x:0,y:0,width:300,height:300,fill:'#cfe8f7'},svg);
    el('rect',{x:0,y:220,width:300,height:80,fill:'#9ccf7f'},svg);
    el('ellipse',{cx:150,cy:262,rx:80,ry:40,fill:'#c98a4b'},svg);
    el('ellipse',{cx:82,cy:110,rx:26,ry:52,fill:'#7a4a22',transform:'rotate(18 82 110)'},svg);
    el('ellipse',{cx:218,cy:110,rx:26,ry:52,fill:'#7a4a22',transform:'rotate(-18 218 110)'},svg);
    el('circle',{cx:150,cy:155,r:78,fill:'#d9a066'},svg);
    el('ellipse',{cx:150,cy:192,rx:40,ry:30,fill:'#f2d3ac'},svg);
    el('circle',{cx:122,cy:140,r:9,fill:'#1d1d1d'},svg); el('circle',{cx:178,cy:140,r:9,fill:'#1d1d1d'},svg);
    el('circle',{cx:125,cy:137,r:3,fill:'#fff'},svg); el('circle',{cx:181,cy:137,r:3,fill:'#fff'},svg);
    el('ellipse',{cx:150,cy:178,rx:15,ry:11,fill:'#1d1d1d'},svg);
    el('path',{d:'M150 189 Q150 205 136 207 M150 189 Q150 205 164 207',stroke:'#1d1d1d','stroke-width':3,fill:'none'},svg);
    if(explain){
      for(let c=0;c<6;c++)for(let r=0;r<6;r++){ if(!IMP.has(c+','+r)) el('rect',{x:c*50,y:r*50,width:50,height:50,fill:'#0f2742',opacity:.82},svg); }
      for(let i=1;i<6;i++){el('line',{x1:i*50,y1:0,x2:i*50,y2:300,stroke:'#fff','stroke-opacity':.35},svg);el('line',{x1:0,y1:i*50,x2:300,y2:i*50,stroke:'#fff','stroke-opacity':.35},svg);}
      $('xaiMsg').innerHTML='밝게 남은 조각(<b>귀, 눈, 코</b>)이 「강아지」라는 결과에 영향을 크게 준 부분이에요. 이렇게 근거를 보면 믿어도 될지, 틀렸다면 왜 틀렸는지 알 수 있어요.';
    } else {
      el('rect',{x:0,y:0,width:300,height:300,fill:'none'},svg);
      $('xaiMsg').innerHTML='결과: <b>강아지</b> · 그런데 왜 강아지라고 했는지는 알 수 없어요. 코 때문일까, 귀 때문일까, 아니면 배경의 풀밭 때문일까?';
    }
  }
  $('xaiA').onclick=()=>draw(false); $('xaiB').onclick=()=>draw(true); draw(false);
})();

/* 05 토론 */
vote('cc2v','cc2pick',[['대중의 안전','범죄를 미리 막아 많은 사람을 지킨다'],['개인의 자유','잘못 의심받지 않고 감시받지 않을 권리']]);
chips('futPick','futPick',['편향','윤리적 딜레마','사회적 책임'],true);

/* 06 역량 Check */
chips('capPick','capPick',['추상화 능력','자동화 능력','창의·융합 능력','디지털 의사소통·협업 능력','디지털 윤리 의식','디지털 기술 활용 능력','인공지능 문제 해결력','데이터 문해력','인공지능 윤리 의식'],true);

/* 07 마무리 */
const MEMOLIST=[['hosR','병원 사례 · 책임성'],['hosF','병원 사례 · 공정성'],['hosT','병원 사례 · 투명성'],['cc1','CCTV 기준이 편향되면'],['cc2pick','대중의 안전 vs 개인의 자유'],['cc2','그렇게 생각한 까닭'],['cc3r','CCTV · 책임성 방안'],['cc3f','CCTV · 공정성 방안'],['cc3t','CCTV · 투명성 방안'],['kq1','핵심 질문 1'],['kq2','핵심 질문 2'],['myRule','4단원에서 지킬 나의 원칙']];
onShow[7]=()=>memoSummary('msum',MEMOLIST);
