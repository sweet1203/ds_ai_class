/* 01 이 로봇 속 인공지능은 어디에? (12~13쪽 그림) — 예시는 교과서 그림 상황을 바탕으로 만든 설명 */
const ROBOTS=[
  {ic:'🍽️',n:'서빙 로봇',where:'식당에서 주방의 음식을 손님 테이블까지 나른다.',
   q:[['👀 무엇을 알아봐야 할까?','가야 할 테이블의 위치, 앞을 지나가는 사람이나 의자 같은 장애물'],
      ['🧠 무엇을 정해야 할까?','어느 길로 갈지, 장애물을 만나면 멈출지 돌아갈지'],
      ['🦾 어떻게 움직일까?','바퀴로 이동해 테이블 앞에 멈추고, 손님에게 음식을 가져가라고 알린다']]},
  {ic:'🛫',n:'안내 로봇',where:'공항에서 여행객의 질문에 답하고 출발·도착 장소까지 길을 안내한다.',
   q:[['👀 무엇을 알아봐야 할까?','여행객이 말로 묻는 질문, 로봇 앞에 선 사람, 현재 위치'],
      ['🧠 무엇을 정해야 할까?','질문에 맞는 답, 목적지까지 가는 길'],
      ['🦾 어떻게 움직일까?','화면과 음성으로 답을 알려 주고, 필요하면 앞장서서 함께 이동한다']]},
  {ic:'🚗',n:'자율주행 자동차',where:'운전자의 개입 없이 도로를 달려 목적지까지 간다.',
   q:[['👀 무엇을 알아봐야 할까?','신호등, 차선, 앞차와 보행자, 내 차의 위치'],
      ['🧠 무엇을 정해야 할까?','출발할지 멈출지, 차선을 바꿀지, 어느 경로로 갈지'],
      ['🦾 어떻게 움직일까?','운전대와 엔진, 브레이크를 조절해 실제로 달리고 멈춘다']]},
];
tabs('robotBtns','robotView',ROBOTS,r=>`<div class="ir-where"><b>${r.ic} ${r.n}</b> · ${r.where}</div>
  <div class="ir-qs">${r.q.map(([h,a])=>`<button class="ir-q"><b>${h}</b><span>눌러서 예시 보기</span><em>${a}</em></button>`).join('')}</div>
  <p class="note">세 질문은 이 단원 「인공지능의 원리」에서 정식 이름을 붙여 다시 배워요.</p>`);
$('robotView').addEventListener('click',e=>{const b=e.target.closest('.ir-q'); if(b) b.classList.add('on');});

/* 02 기호주의 vs 연결주의 (14쪽, 46쪽 참고) */
sorter('symGame',{
  cats:[{n:'🔣 기호주의',k:'#9b4fc4'},{n:'🕸️ 연결주의',k:'#e0702b'}],
  items:[
    {t:'논리를 기반으로 인공지능 시스템을 구축한다.',short:'논리 기반 시스템',c:0,ic:'📐',w:'교과서 14쪽: 민스키의 기호주의는 논리를 기반으로 해요.'},
    {t:'퍼셉트론이라 불리는 인공신경망으로 학습시켜 추론한다.',short:'퍼셉트론으로 학습',c:1,ic:'🧠',w:'교과서 14쪽: 로젠블랫이 선택한 연결주의 연구 방식이에요.'},
    {t:'전문가의 지식을 컴퓨터에 담아, 지식 표현과 추론으로 결과를 도출한다.',short:'전문가 지식 담기',c:0,ic:'📚',w:'사람이 지식을 기호로 표현해 넣어 주는 방식이라 기호주의 쪽이에요. 교과서 46쪽은 지식을 기호화하여 표현하는 것을 기호주의의 방법으로 설명해요.'},
    {t:'지식을 「만약 ~이면 ~이다」처럼 기호화하여 규칙으로 표현한다.',short:'규칙으로 기호화',c:0,ic:'🔤',w:'지식을 기호로 바꾸어 표현하니 기호주의예요. 이 단원 「탐색과 추론」에서 자세히 배워요.'},
    {t:'인공신경망을 여러 층으로 쌓아 데이터로 복잡한 패턴을 학습한다.',short:'여러 층 신경망',c:1,ic:'🧱',w:'다층 퍼셉트론에서 딥러닝으로 이어지는 흐름이에요. 교과서 46쪽은 최근 딥러닝을 선두로 한 연결주의 인공지능이 많이 쓰인다고 해요.'},
    {t:'딥러닝으로 단백질 구조를 예측하는 모델을 만든다.',short:'단백질 구조 예측',c:1,ic:'🧬',w:'교과서 15쪽의 딥러닝 기반 단백질 구조 예측 모델이에요. 딥러닝은 인공신경망을 쓰니 연결주의 쪽이에요.'},
  ],
  end:'다트머스 회의 이후에는 <b>기호주의가 앞서</b> 나갔고(14쪽), 최근에는 딥러닝을 선두로 한 <b>연결주의</b> 인공지능이 많이 쓰여요(46쪽). 교과서는 딥러닝에 기호주의적 방법을 결합한 기술이 필요하다는 학자들의 말도 소개해요.'
});

/* 03 연표 순서 맞추기 (14~15쪽 아래 연표) */
(function(){
  const EV=[
    {y:'1950',ic:'🧑‍⚖️',t:'앨런 튜링의 튜링 테스트',n:'기계가 인간의 지능(생각)을 모방할 수 있는가를 논의'},
    {y:'1950년대',ic:'🏛️',t:'다트머스 회의',n:'「인공지능」 용어를 최초로 공식 사용'},
    {y:'1950년대',ic:'🧠',t:'로젠블랫의 퍼셉트론 신경망',n:'인공신경망으로 학습시키는 연결주의'},
    {y:'1960년대',ic:'❄️',t:'퍼셉트론의 문제 발견',n:'XOR 같은 비선형 문제를 못 푼다는 한계 → 인공지능의 겨울'},
    {y:'1980년대',ic:'🧱',t:'다층 퍼셉트론',n:'층을 쌓아 XOR 문제 해결의 길을 엶'},
    {y:'1990년대',ic:'📈',t:'기계학습 부상',n:'컴퓨팅 기술과 인터넷의 발달로 데이터 증가'},
    {y:'2000년대',ic:'🕸️',t:'딥러닝의 등장',n:'여러 층의 인공신경망으로 복잡한 패턴 학습'},
    {y:'2010년대',ic:'⚫',t:'구글 알파고, 바둑 기사 이세돌에게 승리',n:'인공지능 대중화를 앞당김'},
    {y:'2020년대',ic:'💬',t:'초거대 언어 인공지능 발표',n:'인간의 언어를 이해하고 해석하는 생성형 인공지능'},
  ];
  const B=$('tlGame'); let next, miss;
  function start(){
    next=0; miss=0;
    const pool=shuffle(EV.map((_,i)=>i));
    B.innerHTML=`<div class="tl-pool">${pool.map(i=>`<button class="tl-card" data-i="${i}"><i>${EV[i].ic}</i>${EV[i].t}</button>`).join('')}</div>
      <div class="tl-msg" aria-live="polite">가장 먼저 일어난 사건은 무엇일까요?</div><ol class="tl-track"></ol><div class="tl-end"></div>`;
    B.querySelectorAll('.tl-card').forEach(b=>b.onclick=()=>pick(b));
  }
  function pick(b){
    const i=+b.dataset.i, msg=B.querySelector('.tl-msg');
    if(i!==next){
      miss++; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
      msg.innerHTML=`<span class="ng">아직이에요.</span> 「${EV[i].t}」보다 <b>먼저</b> 일어난 사건이 남아 있어요.`;
      return;
    }
    b.remove();
    const e=EV[i];
    B.querySelector('.tl-track').insertAdjacentHTML('beforeend',`<li><span class="y">${e.y}</span><div><b>${e.ic} ${e.t}</b><small>${e.n}</small></div></li>`);
    next++;
    if(next<EV.length){ msg.innerHTML=`<span class="ok">맞아요!</span> 그다음은 무엇일까요? (${next} / ${EV.length})`; return; }
    msg.innerHTML='';
    B.querySelector('.tl-end').innerHTML=`<p>🎉 연표 완성! 순서를 틀린 횟수: <b>${miss}번</b></p><p style="margin:6px 0 0">흐름을 한 줄로 보면 <b>생각하는 기계라는 질문 → 이름 붙이기 → 신경망의 등장과 한계 → 데이터의 증가 → 딥러닝 → 생성형 인공지능</b>이에요.</p><button class="btn ghost sm" style="margin-top:8px">다시 해 보기</button>`;
    B.querySelector('.tl-end button').onclick=start;
  }
  start();
})();

/* 04 중학교 정보 ↔ 고등학교 정보 자기 점검 */
chips('bridgeCheck','bridgeCheck',['인공지능이 무엇인지','인공지능의 특성','지능 에이전트가 하는 일','생활 속 인공지능의 예','기호주의와 연결주의의 차이'],true);

const MEMOLIST=[['lifeAI','내 생활 속 인공지능'],['histPick','연표에서 가장 큰 전환점'],['bridgeCheck','지금 설명할 수 있는 것'],['unitQ','더 궁금한 핵심 질문과 내 짐작']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);
