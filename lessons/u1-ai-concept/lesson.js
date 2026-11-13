
/* 01 사람의 방식 vs 인공지능의 방식 (그림 Ⅰ-1) */
sorter('hvGame',{
  cats:[{n:'🧑 인간 지능',k:'#e0702b'},{n:'🤖 인공지능',k:'#2f6fd0'}],
  items:[
    {t:'시각, 청각, 촉각 등 오감을 활용한 경험으로 주변 환경을 인식한다.',short:'오감으로 경험',c:0,ic:'👀',w:'교과서 17쪽: 인간은 오감을 활용한 경험으로 주변 환경을 인식해요.'},
    {t:'책, 인터넷 등 다양한 대상으로부터 지식을 습득한다.',short:'책·인터넷에서 지식 습득',c:0,ic:'📚',w:'교과서 17쪽: 인간이 지식을 얻는 방법이에요.'},
    {t:'직감과 통찰을 활용하여 문제를 해결하고 결론을 도출한다.',short:'직감과 통찰',c:0,ic:'💡',w:'교과서 17쪽: 직감과 통찰은 인간 지능의 방식이에요.'},
    {t:'다양한 형태의 빅데이터를 지식 베이스로 하여 학습한다.',short:'빅데이터를 지식 베이스로',c:1,ic:'🗄️',w:'교과서 17쪽: 인공지능은 빅데이터를 지식 베이스로 학습해요.'},
    {t:'학습한 결과에 따라 판단한다.',short:'학습 결과로 판단',c:1,ic:'⚙️',w:'교과서 17쪽: 인공지능은 학습한 결과에 따라 판단해요.'},
    {t:'판단한 결과를 다시 데이터로 저장하여 점차 성능을 향상시킨다.',short:'결과를 다시 데이터로',c:1,ic:'🔁',w:'교과서 17쪽: 결과를 다시 데이터로 저장하며 성능이 좋아져요.'},
  ],
  end:'사람은 <b>오감·경험·직감과 통찰</b>로, 인공지능은 <b>빅데이터 → 학습 → 판단 → 다시 데이터로 저장</b>하는 고리로 문제를 해결해요.'
});

/* 02 네 가지 특성 (교과서 18쪽) — 앞면: 뜻, 뒷면: 교과서 예시 */
flipCards('featCards',[
  {ic:'🔁',f:'스스로 학습하고 개선',s:'데이터에서 패턴을 인식하거나 시행착오로 행동을 최적화하여 예측·판단하는 능력을 키운다',b:'방대한 지식을 수집하여 스스로 학습하고 개선한다.',x:'예: 인터넷 쇼핑·동영상·음악 <b>추천 시스템</b>, 학생 수준에 맞는 <b>개별화 학습</b>'},
  {ic:'🗄️',f:'빅데이터를 처리',s:'예측 모델을 생성하여 방대한 양의 데이터를 처리하고 의사 결정을 돕는다',b:'다양한 분야에서 가치를 창출한다.',x:'예: 금융 분야의 <b>주식 가격 예측</b>, 투자 전략 개발'},
  {ic:'🧩',f:'복잡한 문제 해결에 유용',s:'복잡한 수식 계산, 이미지 속 대상 인식, 자연어 문맥 이해 등 어려운 문제를 수행한다',b:'복잡하고 어려운 문제를 수행할 수 있다.',x:'예: 의료 분야에서 <b>희귀 질병</b> 찾기, 예상할 수 없는 상황이 생기는 <b>교통 운송</b>'},
  {ic:'🏭',f:'자동화에 최적화',s:'반복적인 작업을 빠르고 정확하게 수행하며, 인간의 개입을 최소화한다',b:'일상생활이나 비즈니스의 모든 영역에 활용된다.',x:'예: 법원에서 자동화를 사용한 <b>법률 문제 해석</b>, 산업 현장의 <b>로봇·자동화 시스템</b>'},
]);
sorter('featGame',{
  cats:[{n:'🔁 스스로 학습·개선',k:'#1f9d74'},{n:'🗄️ 빅데이터 처리',k:'#2f6fd0'},{n:'🧩 복잡한 문제 해결',k:'#9b4fc4'},{n:'🏭 자동화 최적화',k:'#e0702b'}],
  items:[
    {t:'동영상 앱이 사용자에게 더 맞춤화된 추천 정보를 주려고 스스로 학습하고 개선한다.',short:'맞춤 추천',c:0,ic:'📺',w:'교과서 18쪽: 추천 시스템은 「스스로 학습하고 개선하는」 예예요.'},
    {t:'학생 수준에 맞는 개별화 학습에 적용된다.',short:'개별화 학습',c:0,ic:'🧑‍🎓',w:'교과서 18쪽: 개별화 학습이 중요한 교육 분야에도 「스스로 학습·개선」이 적용돼요.'},
    {t:'금융 분야에서 예측 모델로 방대한 데이터를 처리해 주식 가격을 예측한다.',short:'주식 가격 예측',c:1,ic:'📈',w:'교과서 18쪽: 「빅데이터를 처리하는」 예로 주식 가격 예측과 투자 전략 개발을 들어요.'},
    {t:'의료 분야에서 희귀 질병을 찾아낼 때 사용된다.',short:'희귀 질병 찾기',c:2,ic:'🩺',w:'교과서 18쪽: 희귀 질병 찾기는 「복잡한 문제 해결에 유용한」 예예요.'},
    {t:'예상할 수 없는 다양한 상황이 발생하는 교통 운송에 활용된다.',short:'교통 운송',c:2,ic:'🚦',w:'교과서 18쪽: 교통 운송도 「복잡한 문제 해결에 유용한」 예예요.'},
    {t:'법원에서 자동화를 사용하여 법률 문제를 해석하고 판단하는 데 활용한 경우가 있다.',short:'법률 문제 해석',c:3,ic:'⚖️',w:'교과서 18쪽: 「자동화에 최적화된」 예로 법원의 사례를 들어요.'},
    {t:'산업 현장의 로봇이나 자동화 시스템에 사용된다.',short:'산업용 로봇',c:3,ic:'🤖',w:'교과서 18쪽: 산업 현장의 로봇·자동화 시스템은 「자동화에 최적화된」 예예요.'},
  ],
  end:'한 인공지능에도 여러 특성이 함께 들어 있어요. 서술할 때는 <b>교과서가 든 예시</b>와 특성을 짝지어 말할 수 있으면 돼요.'
});

/* 03 튜링 테스트 체험: 세 질문 동안 같은 상대, 다 본 뒤 한 번 판정 (방 배치는 학생마다 무작위) */
(function(){
  const Q=['4 곱하기 7은 무엇입니까?','어떤 음식을 좋아합니까?','당신은 컴퓨터인가요?'];
  const COMP=['음… 28? 구구단 오랜만이라 잠깐 헷갈렸어요.','떡볶이요! 시험 끝나고 친구들이랑 먹으면 제일 맛있어요.','아니요. 왜 그렇게 생각하세요?'];
  const HUM=['28이요.','딱히 없어요. 배고플 때 아무거나 먹어요.','아니요, 사람이에요. 증명할 방법이 있나요?'];
  const B=$('ttGame'); let comp, step;
  function start(){
    comp=Math.random()<.5?'A':'B'; step=0; draw();
  }
  function ans(room,i){ return room===comp?COMP[i]:HUM[i]; }
  function draw(){
    const shown=Q.slice(0,step+1).map((q,i)=>`<div class="tt-q">🧑‍⚖️ 질문 ${i+1}: ${q}</div>
      <div class="tt-rooms"><div class="tt-room"><span>A방 답장</span><p>${ans('A',i)}</p></div><div class="tt-room"><span>B방 답장</span><p>${ans('B',i)}</p></div></div>`).join('');
    const more=step<Q.length-1;
    B.innerHTML=shown+`<div class="tt-act">${more?`<button class="btn sm" id="ttMore">다음 질문 하기 → (${step+1}/${Q.length})</button>`
      :`<b>세 답장을 보고 판정해 보세요. 어느 방이 컴퓨터일까요?</b><div class="row" style="margin-top:8px"><button class="btn sm" data-p="A">A방이 컴퓨터</button><button class="btn sm" data-p="B">B방이 컴퓨터</button><button class="btn sm ghost" data-p="?">구별할 수 없다</button></div>`}</div><div class="tt-fb"></div>`;
    if(more){ $('ttMore').onclick=()=>{step++; draw();}; return; }
    B.querySelectorAll('button[data-p]').forEach(b=>b.onclick=()=>reveal(b.dataset.p));
  }
  function reveal(p){
    B.querySelectorAll('button[data-p]').forEach(x=>x.disabled=true);
    B.querySelectorAll('.tt-rooms').forEach(r=>r.querySelectorAll('.tt-room').forEach((el,j)=>el.classList.add('AB'[j]===comp?'comp':'human')));
    const pick=p==='?'?'「구별할 수 없다」를 골랐어요.':p===comp?`${p}방을 골랐고, 실제로 컴퓨터였어요.`:`${p}방을 골랐지만, 컴퓨터는 <b>${comp}방</b>이었어요.`;
    B.querySelector('.tt-fb').innerHTML=`<div class="tt-end">${pick}<p>컴퓨터 쪽 답장은 일부러 망설이거나 경험담처럼 말하도록 <b>선생님이 만든 대본</b>이에요. 실제 테스트에서 컴퓨터가 이렇게 답해 질문자가 인간과 컴퓨터를 <b>구별하지 못한다면</b>, 그 컴퓨터는 튜링 테스트를 <b>통과</b>한 것으로 봐요. 그렇다면 통과한 컴퓨터는 정말 <b>생각하는</b> 걸까요? 아래에 내 생각을 적어 보세요.</p><button class="btn ghost sm" id="ttAgain">새로 해 보기 (방 배치가 바뀌어요)</button></div>`;
    $('ttAgain').onclick=start;
  }
  start();
})();

/* 04 일그러진 글자 체험 (헷갈리는 5·S, 2·Z, 8·B, U·V 는 뺌) */
(function(){
  const CH='ACDEFGHJKLMNPRTWXY34679'; let ans='';
  const rnd=(a,b)=>a+Math.random()*(b-a);
  function draw(){
    ans=Array.from({length:5},()=>CH[Math.random()*CH.length|0]).join('');
    let s=`<svg viewBox="0 0 220 70" role="img" aria-label="일그러진 글자">`;
    s+=`<rect width="220" height="70" fill="#f4f1ea"/>`;
    for(let k=0;k<40;k++) s+=`<circle cx="${rnd(0,220).toFixed(1)}" cy="${rnd(0,70).toFixed(1)}" r="${rnd(.6,1.8).toFixed(1)}" fill="#8a94a3" opacity=".5"/>`;
    [...ans].forEach((c,k)=>{const x=30+k*40+rnd(-3,3), y=46+rnd(-5,5), r=rnd(-24,24), sk=rnd(-14,14);
      s+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)}) skewX(${sk.toFixed(1)})"><text x="0" y="0" dy=".35em" font-size="${rnd(30,36).toFixed(0)}" font-family="Georgia,serif" font-weight="700" fill="#0f2742" text-anchor="middle">${c}</text></g>`;});
    let d=`M0 ${rnd(20,50).toFixed(1)}`; for(let x=20;x<=220;x+=20) d+=` L${x} ${rnd(15,55).toFixed(1)}`;
    s+=`<path d="${d}" stroke="#d64535" stroke-width="2" fill="none" opacity=".7"/></svg>`;
    $('capImg').innerHTML=s; $('capIn').value=''; $('capMsg').textContent=''; $('capMsg').className='cap-msg';
  }
  function check(){
    const v=$('capIn').value.trim().toUpperCase(); if(!v) return;
    const m=$('capMsg');
    if(v===ans){ m.className='cap-msg ok'; m.innerHTML='통과! 사람은 이렇게 일그러진 글자도 쉽게 읽어요. 교과서는 이런 요청이 <b>컴퓨터는 변형된 이미지를 인식하지 못한다는 특성</b>을 이용한다고 설명해요. 컴퓨터가 상대가 사람인지 판별하니 <b>역 튜링 테스트</b>예요.'; }
    else { m.className='cap-msg ng'; m.innerHTML='다시 해 보세요. 영문 자판인지 확인하고, 잘 안 보이면 「새 글자」를 눌러요.'; }
  }
  $('capOk').onclick=check; $('capNew').onclick=draw;
  $('capIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();check();}});
  draw();
})();

sorter('revGame',{
  cats:[{n:'🧑‍⚖️ 튜링 테스트',k:'#9b4fc4'},{n:'🖥️ 역 튜링 테스트',k:'#e0702b'}],
  items:[
    {t:'질문자가 각각 다른 방에 있는 인간, 컴퓨터와 메시지를 주고받은 후 어느 쪽이 컴퓨터인지 구별해 본다.',short:'질문자가 메시지로 구별',c:0,ic:'💬',w:'교과서 19쪽: 사람(질문자)이 판정하니 튜링 테스트예요.'},
    {t:'앨런 튜링이 컴퓨터가 인간 지능을 흉내 낼 수 있는지 판단하는 방법으로 제안했다.',short:'앨런 튜링의 제안',c:0,ic:'📜',w:'교과서 19쪽: 튜링 테스트를 제안한 사람이 앨런 튜링이에요.'},
    {t:'인터넷 사이트에 가입할 때 일그러뜨린 문자를 찾아 입력하게 한다.',short:'일그러진 문자 입력',c:1,ic:'🔤',w:'교과서 19쪽: 컴퓨터(사이트)가 상대가 사람인지 판별하니 역 튜링 테스트예요.'},
    {t:'정보를 열람할 때 맞는 사진이나 그림을 클릭하도록 요청한다.',short:'맞는 그림 클릭',c:1,ic:'🖼️',w:'교과서 19쪽: 이것도 컴퓨터가 판정하는 역 튜링 테스트예요.'},
  ],
  end:'핵심은 <b>누가 판정하느냐</b>예요. 튜링 테스트는 사람이, 역 튜링 테스트는 컴퓨터가 판정해요.'
});

/* 05 빈칸 확인 · 스스로 점검 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['인공지능의 개념을 설명할 수 있다','네 가지 특성을 말할 수 있다','튜링 테스트와 역 튜링 테스트를 구별할 수 있다','지능적 판단이 무엇인지 말할 수 있다'],true);

const MEMOLIST=[['carAI','영화 속 자동차의 인공지능 원리'],['ttThink','튜링 테스트 체험 뒤 내 생각'],['myJudge','스스로 해결하기: 지능적 판단 · 오늘의 질문'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
