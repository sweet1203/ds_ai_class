
const RES={"model": {"hidden": [100, 50], "train": 0.9926, "test": 0.9744, "params": 84060, "hist": {"val_loss": [0.1215, 0.0924, 0.0855, 0.0902, 0.0883, 0.0991, 0.1028, 0.1132, 0.1161, 0.1182], "loss": [0.2531, 0.1117, 0.0816, 0.0656, 0.0548, 0.0468, 0.0402, 0.0338, 0.0303, 0.0264]}}, "model2": {"hidden": [100, 400, 200, 100, 50], "train": 0.9843, "test": 0.9716, "params": 224760, "hist": {"val_loss": [0.1427, 0.1271, 0.1332, 0.13, 0.1375, 0.1555, 0.1808, 0.1421, 0.1947, 0.2265], "loss": [0.2607, 0.1241, 0.0987, 0.0856, 0.0826, 0.0864, 0.0808, 0.0781, 0.0827, 0.0782]}}};

/* 공통 */

/* 용어 (기술 용어 · 쉬운 말 · 예) */
const TERMS={
 ml:[
  ['기계학습의 시작',[
   ['기계학습','데이터와 결괏값(정답)을 보여 주면 컴퓨터가 규칙을 스스로 찾는 방법','서울 기온 데이터로 2050년 평균 기온 예측하기','59쪽'],
   ['문제 해결 6단계','문제 정의 → 데이터 수집 → 데이터 전처리 → 유형·알고리즘 선정 → 모델 학습 → 성능 평가·수정','요리할 때 메뉴 정하기 → 장보기 → 손질 → 조리법 고르기 → 요리 → 맛보고 고치기','60쪽'],
  ]],
  ['데이터 모으고 다듬기',[
   ['데이터 편향성','데이터가 한쪽으로 치우쳐 현실을 제대로 담지 못한 것','한 지역 학생 사진만 모아 학습하면 다른 지역 학생을 잘 못 알아봐요','64쪽'],
   ['독립 변수 · 종속 변수','원인이 되는 값(특성) · 맞히고 싶은 값(레이블)','꽃잎 길이·너비(독립) → 붓꽃 종류(종속)','66쪽'],
   ['수치형 · 범주형','크기를 비교할 수 있는 숫자 값 · 종류를 나타내는 값','키 170 cm(수치형) · 혈액형 A형(범주형)','66쪽'],
   ['결측치 · 이상치','비어 있는 값 · 다른 값들과 동떨어진 값','설문 응답의 빈칸 · 키가 1,700 cm로 잘못 입력된 값','68쪽'],
  ]],
  ['학습 방법 고르기',[
   ['지도학습','정답(레이블)이 있는 데이터로 배우기. 종류를 맞히면 분류, 숫자를 맞히면 회귀','스팸 메일 거르기(분류), 집값 예측(회귀)','74쪽'],
   ['비지도학습','정답 없이 비슷한 것끼리 묶기(군집)','쇼핑몰 고객을 비슷한 그룹으로 나누기','74쪽'],
   ['강화 학습','잘하면 보상, 못하면 벌을 받으며 시행착오로 배우기','알파고, 걷는 법을 익히는 로봇','74쪽'],
   ['k-최근접 이웃','가장 가까운 k개 이웃의 다수결로 정하기','가장 가까운 친구 5명 중 4명이 축구부면 「축구부겠구나」','75쪽'],
  ]],
  ['학습하고 평가하기',[
   ['훈련 데이터 · 테스트 데이터','공부용 문제 · 처음 보는 시험 문제','데이터를 80 : 20으로 나눠 80으로 공부, 20으로 시험','76쪽'],
   ['과적합 · 과소적합','기출문제만 외워서 새 문제를 못 푸는 것 · 너무 대충 공부해서 기출도 못 푸는 것','훈련 정확도 1.000인데 테스트 0.878인 의사결정트리(101쪽)','77쪽'],
   ['정확도 · 정밀도 · 재현율','전체 중 맞힌 비율 · 「맞다」고 한 것 중 진짜 맞는 비율 · 진짜 맞는 것 중 찾아낸 비율','스팸 분류는 정밀도, 질병 검사는 재현율이 중요해요','78쪽'],
   ['하이퍼 파라미터','학습하기 전에 사람이 정해 주는 값','k-최근접 이웃의 k를 1~19로 바꿔 가며 가장 좋은 값 찾기','80쪽'],
  ]],
 ],
 dl:[
  ['인공신경망의 기본',[
   ['퍼셉트론','뇌의 신경 세포를 흉내 낸 계산 단위. 입력 × 가중치를 모두 더하고 편향을 더해 활성화 함수로 출력','여러 의견에 중요도를 매겨 더해 보고 「할까, 말까」 정하는 투표','91쪽'],
   ['가중치 · 편향','입력마다 붙는 중요도 · 기준을 옮겨 주는 값','친구 의견보다 선생님 의견에 더 큰 중요도(가중치)를 주기','91쪽'],
   ['활성화 함수','계산 결과를 다음 층에 얼마나 넘길지 정하는 문지기','은닉층 렐루(ReLU), 이진 분류 시그모이드, 다중 분류 소프트맥스','92쪽'],
   ['은닉층 · 딥러닝','입력층과 출력층 사이의 층 · 은닉층이 여러 개인 심층 신경망','은닉층 2개인 99쪽 MNIST 모델','92쪽'],
  ]],
  ['딥러닝은 이렇게 배운다',[
   ['순전파 → 오차 계산 → 역전파','문제 풀기 → 채점하기 → 틀린 만큼 뒤에서부터 고치기','이 과정을 정해진 횟수만큼 반복해요','93쪽'],
   ['손실 함수','얼마나 틀렸는지 재는 자','예측은 평균 제곱 오차(MSE), 분류는 교차 엔트로피','94쪽'],
   ['경사 하강법','오차가 줄어드는 쪽으로 가중치를 조금씩 바꾸기','안개 낀 산에서 가장 가파른 내리막 쪽으로 한 걸음씩 내려가기','94쪽'],
   ['배치 · 에포크','한 번에 공부하는 문제 묶음 · 문제집 전체를 다 푼 횟수','epochs = 10이면 훈련 데이터 전체를 10바퀴 학습','93쪽'],
  ]],
  ['딥러닝으로 문제 풀기',[
   ['기계학습 vs 딥러닝','기계학습은 사람이 특징을 골라 주고, 딥러닝은 특징을 스스로 찾아요','손 글씨에서 「선이 몇 개?」를 사람이 정하지 않아도 딥러닝이 알아서 찾아요','96쪽'],
   ['MNIST','0~9 손 글씨 숫자 흑백 이미지 7만 장(28 × 28)','훈련 6만 장, 테스트 1만 장','97쪽'],
  ]],
 ],
 app:[
  ['보는 AI · 컴퓨터 비전',[
   ['픽셀 · RGB','이미지는 작은 점(픽셀)의 숫자 표. 컬러 픽셀은 빨강·초록·파랑 숫자 3개','(255, 255, 0) = 노랑','102쪽'],
   ['컴퓨터 비전 4대 분야','이미지 분류 → 객체 위치 식별 → 객체 탐지 → 이미지 분할','「고양이다」 → 「여기 고양이」 → 「개, 개, 고양이」 → 픽셀 단위로 칠하기','102쪽'],
   ['합성곱 신경망(CNN)','합성곱층(모양 도장 찍기) + 풀링층(모둠 대표 뽑기) + 완전 연결층(최종 판단)','층1 선 → 층2 눈·코 → 층3 얼굴 순서로 특징 찾기','104쪽'],
   ['GAN (생성적 적대 신경망)','가짜를 만드는 생성자와 가려내는 감별자가 겨루며 학습','위조지폐범과 경찰','106쪽'],
   ['프롬프트','원하는 결과가 나오도록 인공지능에 입력하는 명령 문구','「비 오는 창가의 흰 고양이, 수채화」처럼 자세히','107쪽'],
  ]],
  ['듣는 AI · 음성 인식',[
   ['음성 인식','사람의 말소리를 분석해 텍스트 데이터로 바꾸는 것','"불 꺼 줘" → 조명 끄기, 자동 자막','110쪽'],
   ['주파수 · 음소','1초 동안 진동하는 수(소리의 높낮이) · 언어의 가장 작은 소리 단위','문 = ㅁ + ㅜ + ㄴ','110쪽'],
   ['if-then 방식 vs 딥러닝 방식','저장된 규칙대로 바꾸기 vs 많은 목소리로 배워 확률이 높은 문장 고르기','「문이 다칩니다」 대신 「문이 닫힙니다」','110쪽'],
  ]],
  ['읽는 AI · 자연어 처리',[
   ['자연어 처리 (NLP)','사람의 언어를 기계가 이해하고(언어 이해) 만들어 내는(언어 생성) 기술','챗봇, 번역, 감정 분석','114쪽'],
   ['원-핫 인코딩 · 워드 임베딩','단어 자리에만 1을 표시 · 단어를 지도 위 좌표로 바꿔 뜻이 비슷하면 가깝게','강아지와 고양이는 가까운 점, 버스는 먼 점','115쪽'],
   ['단어 주머니 (빈도수 기반)','순서는 무시하고 단어가 몇 번 나오는지만 세기','선수·경기·팀·승리가 많으면 스포츠 기사','116쪽'],
   ['순환 신경망 (RNN)','앞 내용을 기억하며 다음 단어를 처리하는 딥러닝','「못 부르지 않아」를 긍정으로 판단','118쪽'],
   ['생성형 언어 모델 · LLM','다음에 올 단어를 확률로 골라 문장을 만드는 모델 · 아주 많은 글로 학습한 대형 언어 모델','「세훈이는」 → 우유를 50% → 마신다 60%','119쪽'],
  ]],
 ],
};
function renderTerms(key){
  const box=$('cards-'+key);
  box.innerHTML=TERMS[key].map(([g,list])=>`<div class="tgroup">${g}</div><div class="tcards">${list.map(([t,e,x,p])=>`<div class="tcard" tabindex="0"><div class="in"><div class="f"><b>${t}</b><small>교과서 ${p}</small><em>눌러서 뒤집기 ↻</em></div><div class="b"><div class="e">${e}</div><div class="x">예) ${x}</div></div></div></div>`).join('')}</div>`).join('');
  box.querySelectorAll('.tcard').forEach(c=>{c.onclick=()=>c.classList.toggle('flip'); c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.classList.toggle('flip');}};});
}
function guessGame(key){
  const all=TERMS[key].flatMap(([g,l])=>l), box=$('guess-'+key); let order, i, ok;
  function start(){ order=shuffle(all).slice(0,5); i=0; ok=0; show(); }
  function show(){
    if(i>=order.length){ box.innerHTML=`<div class="gq">5문제 중 <b>${ok}</b>개 맞혔어요! ${ok===5?'🎉':ok>=3?'👍 틀린 용어는 위 카드를 다시 뒤집어 봐요.':'위 카드를 한 번 더 뒤집어 보고 다시 도전해요.'}</div><button class="btn sm" id="gAgain-${key}">다시 하기</button>`; $('gAgain-'+key).onclick=start; return; }
    const it=order[i], opts=shuffle([it, ...shuffle(all.filter(x=>x!==it)).slice(0,2)]);
    box.innerHTML=`<div class="muted" style="font-size:.85rem">${i+1} / 5 · 이 설명에 맞는 용어는?</div><div class="gq">「${it[1]}」</div><div class="row">${opts.map(o=>`<button class="chip" data-t="${esc(o[0])}">${o[0]}</button>`).join('')}</div><div class="fb"></div>`;
    box.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{
      const right=b.dataset.t===it[0]; if(right) ok++;
      box.querySelectorAll('[data-t]').forEach(x=>{x.disabled=true; if(x.dataset.t===it[0]) x.classList.add('on');});
      box.querySelector('.fb').innerHTML=(right?'<span class="ok">✔ 맞아요!</span> ':`<span class="ng">✘ 정답은 「${it[0]}」</span> `)+`예) ${it[2]} <button class="btn sm" id="gNext-${key}" style="margin-left:6px">다음 →</button>`;
      i++; $('gNext-'+key).onclick=show;
    });
  }
  start();
}
['ml','dl','app'].forEach(k=>{renderTerms(k); guessGame(k);});
document.querySelectorAll('[data-flipall]').forEach(b=>b.onclick=()=>{const cs=[...$('cards-'+b.dataset.flipall).querySelectorAll('.tcard')]; const to=!cs.every(c=>c.classList.contains('flip')); cs.forEach(c=>c.classList.toggle('flip',to));});

/* 1 2단원 지도 */
(function(){
  const MAP=[
   {t:'1. 기계학습',p:'58~89쪽',k:'#1f9d74',go:2,q:'기계학습으로 해결할 수 있는 문제의 특성과 해결 방법은 무엇일까?',items:[
    ['기계학습이란?','데이터와 정답을 주면 컴퓨터가 규칙을 스스로 찾아요.','추천 영상: 내가 본 영상 데이터로 취향 규칙을 찾아 추천해요.'],
    ['문제 해결 6단계','문제 정의 → 데이터 수집 → 전처리 → 유형·알고리즘 선정 → 모델 학습 → 성능 평가·수정','붓꽃 데이터로 종류 맞히기를 이 순서로 했어요.'],
    ['데이터 수집과 편향','데이터는 직접 측정·설문하거나, 센서·웹크롤링으로 모으거나, 공유 사이트에서 받아요. 한쪽으로 치우치면 편향이 생겨요.','캐글에서 붓꽃 데이터 내려받기'],
    ['데이터 전처리','빈 값(결측치)과 튀는 값(이상치)을 처리하고, 핵심 속성을 골라 학습에 알맞게 다듬어요.','꽃잎 길이와 너비의 상관계수 0.96 → 핵심 속성'],
    ['학습 유형','정답이 있으면 지도학습(분류·회귀), 없으면 비지도학습(군집), 보상으로 배우면 강화 학습','알파고는 강화 학습'],
    ['k-최근접 이웃','가장 가까운 k개 이웃의 다수결로 정해요.','k = 5에서 버시컬러 4, 버지니카 1 → 버시컬러'],
    ['모델 학습과 과적합','훈련 데이터로 공부시키고 테스트 데이터로 시험 봐요. 훈련만 잘하고 시험을 못 보면 과적합이에요.','train_test_split(test_size = 0.2)'],
    ['성능 평가','정확도·정밀도·재현율로 평가하고, 하이퍼 파라미터를 바꿔 개선해요.','붓꽃 분류 정확도 0.967'],
   ]},
   {t:'2. 딥러닝',p:'90~101쪽',k:'#9b4fc4',go:3,q:'복잡한 문제를 효과적으로 해결하기 위한 딥러닝은 어떻게 구현할까?',items:[
    ['퍼셉트론','입력 × 가중치의 합 + 편향 → 활성화 함수 → 출력','가중치 1, 1 · 편향 −10 예시'],
    ['딥러닝 구조','퍼셉트론을 층으로 쌓고, 은닉층이 여러 개면 심층 신경망(딥러닝)이에요.','입력층 → 은닉층 → 출력층'],
    ['활성화 함수','은닉층은 렐루, 이진 분류는 시그모이드, 다중 분류는 소프트맥스','0~9 중 하나 → 소프트맥스'],
    ['딥러닝의 학습','순전파 → 오차 계산(손실 함수) → 역전파(경사 하강법)를 반복해요.','배치 크기, 에포크 수를 정해요'],
    ['MNIST 손 글씨 분류','28 × 28 손 글씨를 784칸으로 펴고 0~1로 정규화해 딥러닝으로 분류해요.','딥러닝 테스트 0.976 vs 의사결정트리 0.878'],
   ]},
   {t:'3. 보고 · 듣고 · 읽는 AI',p:'102~119쪽',k:'#e0702b',go:4,q:'딥러닝은 우리 생활의 어떤 문제를 해결하고 있을까?',items:[
    ['컴퓨터 비전','이미지를 처리해 의미 있는 정보를 뽑아내요. 분류·위치 식별·탐지·분할','번호판 인식, 얼굴 잠금'],
    ['합성곱 신경망','필터로 특징을 찾고(합성곱층), 크기를 줄이고(풀링층), 분류해요(완전 연결층).','CNN Explainer 체험'],
    ['생성형 AI · GAN','생성자와 감별자가 겨루며 진짜 같은 데이터를 만들어요.','글로 그림 만들기'],
    ['음성 인식','주파수 분석 → 음소 추출 → 텍스트 변환. 딥러닝은 확률 높은 문장을 골라요.','잰말놀이 발음 검사'],
    ['자연어 처리','언어 이해 + 언어 생성. 단어를 숫자(임베딩)로 바꿔 처리해요.','챗봇, 번역, 감정 분석'],
    ['생성형 언어 모델','다음 단어의 확률을 계산해 한 단어씩 문장을 만들어요.','대형 언어 모델(LLM)'],
   ]},
  ];
  $('umap').innerHTML=MAP.map((m,i)=>`<div style="--k:${m.k}"><h3>${m.t}</h3><span class="pg">교과서 ${m.p}</span><div class="tp">${m.items.map((it,j)=>`<button data-m="${i}" data-j="${j}">${it[0]}</button>`).join('')}</div><div class="q">❓ ${m.q}</div></div>`).join('');
  $('umap').onclick=e=>{const b=e.target.closest('button[data-m]'); if(!b) return;
    $('umap').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    const m=MAP[b.dataset.m], it=m.items[b.dataset.j];
    $('tinfo').innerHTML=`<h4>${it[0]}</h4><div class="e">${it[1]}</div><div class="x">예) ${it[2]}</div><div class="go"><a href="#p${m.go}" onclick="go(${m.go});return false">${m.go===2?'기계학습':m.go===3?'딥러닝':'보고·듣고·읽는 AI'} 용어 카드로 가기 →</a></div>`;};
})();

/* 5 어디에 쓰일까 */
(function(){
  const R=[
   {opts:['분류','회귀','군집','강화 학습'],ks:['#2f6fd0','#1f9d74','#9b4fc4','#e0702b'],hint:['어떻게 고를까?','정답(레이블)이 <b>있다</b> → 지도학습<br>· 맞힐 것이 <b>종류</b>이면 → <b>분류</b><br>· 맞힐 것이 <b>숫자</b>이면 → <b>회귀</b><br>정답이 <b>없고</b> 비슷한 것끼리 묶는다 → <b>군집</b> (비지도학습)<br>잘하면 <b>보상</b>, 못하면 벌을 받으며 익힌다 → <b>강화 학습</b>'],items:[
    ['📧','받은 메일이 스팸인지 아닌지 가려낸다',0,'정답(스팸·정상)이 있고, 맞힐 것이 종류예요.'],
    ['📝','공부 시간으로 다음 시험 점수를 예측한다',1,'맞힐 것이 점수라는 숫자예요.'],
    ['🛒','쇼핑몰 고객을 구매 습관이 비슷한 그룹으로 나눈다',2,'미리 정한 정답 없이 비슷한 것끼리 묶어요.'],
    ['🎮','게임을 수없이 해 보며 이기는 방법을 스스로 익힌다',3,'이기면 보상, 지면 벌을 받으며 시행착오로 배워요.'],
    ['🌸','꽃잎 길이와 너비로 붓꽃의 종류를 판별한다',0,'정답(종류)이 있는 데이터로 종류를 맞혀요.'],
    ['🌡️','지난 기온 데이터로 2050년 평균 기온을 예측한다',1,'맞힐 것이 기온이라는 숫자예요.'],
    ['🎵','분위기가 비슷한 노래끼리 자동으로 묶는다',2,'정답 없이 비슷한 것끼리 묶는 군집이에요.'],
    ['🤖','로봇이 넘어지고 일어나기를 반복하며 걷는 법을 익힌다',3,'잘 걸으면 보상을 받으며 배워요.'],
   ]},
   {opts:['컴퓨터 비전','음성 인식','자연어 처리'],ks:['#2f6fd0','#1f9d74','#e0702b'],hint:['어떻게 고를까?','다루는 데이터가<br>· <b>사진·영상</b>이면 → <b>컴퓨터 비전</b><br>· <b>말소리</b>이면 → <b>음성 인식</b><br>· <b>글·문장</b>이면 → <b>자연어 처리</b><br><span class="muted">말소리를 글자로 바꾼 뒤 뜻을 이해하는 챗봇처럼, 두 기술이 함께 쓰이기도 해요.</span>'],items:[
    ['🚗','주차장 카메라가 자동차 번호판 글자를 읽는다',0,'이미지 속 글자를 읽는 광학 문자 인식(OCR)이에요.'],
    ['🚦','도로 CCTV 영상에서 자동차 위치를 찾아 수를 센다',0,'영상 속 물체의 위치를 찾는 객체 탐지예요.'],
    ['📱','휴대폰이 내 얼굴을 보고 잠금을 푼다',0,'얼굴 인식이에요.'],
    ['💡','"불 꺼 줘"라고 말하면 조명이 꺼진다',1,'말소리를 글자로 바꿔 기기를 제어해요.'],
    ['🎬','수업 영상에 자막이 자동으로 달린다',1,'말소리를 텍스트로 바꾸는 음성 인식이에요.'],
    ['⭐','상품 후기가 칭찬인지 불만인지 알아낸다',2,'글의 뜻을 이해하는 감정 분석이에요.'],
    ['🌐','한국어 문장을 영어 문장으로 바꿔 준다',2,'뜻을 이해하고 새 문장을 만드는 번역이에요.'],
    ['💬','질문에 자연스러운 문장으로 대답하는 챗봇',2,'다음 단어를 확률로 고르는 생성형 언어 모델이에요.'],
    ['🎨','글로 설명하면 그림을 그려 준다',0,'생성형 인공지능(Text to Image)으로 이미지를 만들어요.'],
   ]},
  ];
  let r=0, order, i, ok, placed;
  function start(){ order=shuffle(R[r].items); i=0; ok=0; placed=R[r].opts.map(()=>[]);
    $('hintT').textContent=R[r].hint[0]; $('hintB').innerHTML=R[r].hint[1]; board(); show(); }
  function board(){ $('board').style.gridTemplateColumns=`repeat(${R[r].opts.length},1fr)`;
    $('board').innerHTML=R[r].opts.map((o,j)=>`<div style="--k:${R[r].ks[j]}"><b>${o}</b>${placed[j].map(t=>`<div>${t}</div>`).join('')}</div>`).join(''); }
  function show(){
    const S=$('sit');
    if(i>=order.length){ S.innerHTML=`<div class="ic">🏁</div><div class="sq">${order.length}개 중 ${ok}개 맞혔어요!</div><div class="row"><button class="btn sm" id="sitAgain">다시 하기</button>${r===0?'<button class="btn sm" id="sitNextR" style="background:var(--navy)">2라운드로 →</button>':''}</div>`;
      $('sitAgain').onclick=start; if(r===0) $('sitNextR').onclick=()=>setR(1); return; }
    const it=order[i];
    S.innerHTML=`<div class="muted" style="font-size:.85rem">${i+1} / ${order.length}</div><div class="ic">${it[0]}</div><div class="sq">${it[1]}</div><div class="row">${R[r].opts.map((o,j)=>`<button class="btn sm" style="background:${R[r].ks[j]}" data-j="${j}">${o}</button>`).join('')}</div><div class="fb"></div>`;
    S.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{
      const right=+b.dataset.j===it[2]; if(right) ok++;
      S.querySelectorAll('[data-j]').forEach(x=>x.disabled=true);
      S.querySelector('.fb').innerHTML=(right?'<span class="ok">✔ 맞아요.</span> ':`<span class="ng">✘ 정답은 「${R[r].opts[it[2]]}」</span> `)+it[3]+' <button class="btn sm" id="sitNext" style="margin-left:6px">다음 →</button>';
      placed[it[2]].push(it[0]+' '+it[1]); board(); i++; $('sitNext').onclick=show;
    });
  }
  function setR(n){ r=n; [...$('sitRound').children].forEach((b,j)=>b.classList.toggle('on',j===r)); start(); }
  $('sitRound').onclick=e=>{const b=e.target.closest('[data-r]'); if(b) setR(+b.dataset.r);};
  start();
})();

/* 6 층을 늘리면 더 좋아질까 */
(function(){
  const M=[{n:'model (교과서 99쪽)',k:'#1f9d74',r:RES.model},{n:'model2 (교과서 120쪽)',k:'#c98a00',r:RES.model2}];
  const fmt=n=>n.toLocaleString('ko-KR'), pct=v=>(v*100).toFixed(1)+'%';
  const layers=r=>[784,...r.hidden,10];
  const params=r=>{const L=layers(r); return L.slice(1).map((n,i)=>(L[i]+1)*n);};
  $('arch').innerHTML=M.map(m=>{const L=layers(m.r), P=params(m.r);
    return `<div class="m" style="--k:${m.k}"><b>${m.n}</b> <span class="muted" style="font-size:.88rem">은닉층 ${m.r.hidden.length}개 · 가중치와 편향 <b>${fmt(m.r.params)}</b>개</span>
      <div class="lay">${L.map((n,i)=>`<div class="${i===0||i===L.length-1?'io':''}" style="height:${14+Math.sqrt(n/784)*92}px" title="${n}">${n}</div>`).join('')}</div>
      <div class="muted" style="font-size:.8rem;margin-top:4px">입력 784 → 은닉층 ${m.r.hidden.join(' → ')} → 출력 10 · 층마다 (앞 층 수 + 1) × 이 층 수 = ${P.map(fmt).join(' + ')}</div></div>`;}).join('')
    +`<p style="font-size:.93rem;margin:0">model2의 가중치와 편향은 model의 <b>${(M[1].r.params/M[0].r.params).toFixed(1)}배</b>예요. 외우고 고칠 숫자가 그만큼 많아져요.</p>`;
  const PK=QK+'-pred'; let pred=store.get(PK,null), shown=false;
  const PT=['model2가 더 좋을 것이다','거의 비슷할 것이다','model2가 더 나쁠 것이다'];
  function table(){
    const H=v=>shown?v:'';
    $('rtab').innerHTML='<tr><th>모델</th><th>은닉층의 수</th><th>각 은닉층의 퍼셉트론 수</th><th>훈련 데이터 정확도</th><th>테스트 데이터 정확도</th><th>가중치·편향 수</th></tr>'+M.map(m=>`<tr><td><b style="color:${m.k}">${m.n.split(' ')[0]}</b></td><td>${m.r.hidden.length}</td><td>${m.r.hidden.join(', ')}</td><td class="${shown?'':'hide'}">${H(pct(m.r.train))}</td><td class="${shown?'':'hide'}">${H('<b>'+pct(m.r.test)+'</b>')}</td><td>${fmt(m.r.params)}</td></tr>`).join('');
  }
  function chart(){
    const svg=$('chart'); svg.innerHTML=''; if(!shown){ el('text',{x:320,y:130,'text-anchor':'middle','font-size':15,fill:'#5b6776'},svg,'「결과 열기」를 누르면 그래프가 나와요'); $('chartSay').textContent=''; return; }
    const X=e=>60+e*62, Y=v=>225-v/0.25*200;
    for(let v=0;v<=0.25001;v+=0.05){ el('line',{x1:60,y1:Y(v),x2:620,y2:Y(v),stroke:'#e3ddd2'},svg); el('text',{x:52,y:Y(v)+4,'text-anchor':'end','font-size':11,fill:'#5b6776'},svg,v.toFixed(2)); }
    for(let e=0;e<10;e++) el('text',{x:X(e),y:244,'text-anchor':'middle','font-size':11,fill:'#5b6776'},svg,e+1);
    el('text',{x:620,y:258,'text-anchor':'end','font-size':11,fill:'#5b6776'},svg,'회차(에포크) →');
    M.forEach((m,mi)=>{const h=m.r.hist.val_loss; el('polyline',{points:h.map((v,e)=>`${X(e)},${Y(v)}`).join(' '),fill:'none',stroke:m.k,'stroke-width':3},svg);
      h.forEach((v,e)=>el('circle',{cx:X(e),cy:Y(v),r:3.5,fill:m.k},svg));
      el('text',{x:X(9)-4,y:Y(h[9])+(mi?-10:16),'text-anchor':'end','font-size':13,'font-weight':900,fill:m.k},svg,m.n.split(' ')[0]);});
    const a=M[1].r.hist.val_loss; $('chartSay').innerHTML=`model2의 테스트 오차는 ${a[0].toFixed(2)}에서 시작해 마지막에는 <b>${a[9].toFixed(2)}</b>까지 커졌어요. 훈련 정확도는 계속 오르는데 테스트 오차는 커진다면, 훈련 데이터에만 맞춰지는 <b>과적합</b>의 신호예요.`;
  }
  function predShow(){ [...$('pred').children].forEach((b,j)=>b.classList.toggle('on',j===pred)); $('pred').querySelectorAll('button').forEach((b,j)=>{b.style.background=j===pred?'var(--acc)':''; b.style.color=j===pred?'#fff':'';});
    $('predSay').innerHTML=pred==null?'':`내 예상: <b>${PT[pred]}</b>${shown?'':' · 이제 아래에서 결과를 열어 확인해 봐요.'}`; }
  $('pred').onclick=e=>{const b=e.target.closest('[data-v]'); if(!b) return; pred=+b.dataset.v; store.set(PK,pred); predShow();};
  $('reveal').onclick=()=>{ shown=!shown; $('reveal').textContent=shown?'결과 가리기':'결과 열기'; table(); chart();
    if(shown){ const d=(M[0].r.test-M[1].r.test)*100; $('predSay').innerHTML=(pred==null?'':`내 예상: <b>${PT[pred]}</b> → `)+`실제로는 model2의 테스트 정확도가 model보다 <b>${d.toFixed(1)}%p 낮았어요</b>. 가중치를 ${(M[1].r.params/M[0].r.params).toFixed(1)}배로 늘렸는데도 더 좋아지지 않았어요.`; } else predShow(); };
  table(); chart(); predShow();

  const SK=QK+'-self', SC=[['지식·이해','딥러닝의 구조를 이해하였는가?'],['과정·기능','딥러닝의 구현 과정을 알고 있는가?'],['가치·태도','딥러닝의 결과를 분석하고 그 이유를 탐구할 때 적극적인 태도로 임하였는가?']];
  let self=store.get(SK,[null,null,null]);
  function selfShow(){
    $('selfck').innerHTML=SC.map(([a,b],i)=>`<li><b>${a}</b><span>${b}</span><span class="yn"><button data-i="${i}" data-v="1" class="${self[i]===1?'on':''}">예</button> <button data-i="${i}" data-v="0" class="${self[i]===0?'on':''}">아니요</button></span></li>`).join('');
    $('selfSay').innerHTML=self.includes(null)?'':self.every(v=>v===1)?'👍 모두 「예」예요. 07 화면 ②의 <b>심화</b>(코드 빈칸)에 도전해 봐요.':'07 화면 ①의 <b>보충</b> 활동(숫자 그려 모델에게 묻기)부터 해 봐요. 「아니요」인 부분은 02~03 용어 카드를 다시 봐요.';
  }
  $('selfck').onclick=e=>{const b=e.target.closest('[data-i]'); if(!b) return; self[+b.dataset.i]=+b.dataset.v; store.set(SK,self); selfShow();};
  selfShow();
})();

/* 7 숫자 그려 두 모델에게 묻기 */
(function(){
  const c=$('dCan'), x=c.getContext('2d'); let down=false, drawn=false, last=null, nets=null;
  function clear(){ x.fillStyle='#fff'; x.fillRect(0,0,280,280); drawn=false; }
  clear();
  const pos=e=>{const r=c.getBoundingClientRect(); return [(e.clientX-r.left)*280/r.width,(e.clientY-r.top)*280/r.height];};
  c.addEventListener('pointerdown',e=>{down=true; c.setPointerCapture(e.pointerId); last=pos(e); dot(last,last);});
  c.addEventListener('pointermove',e=>{if(!down) return; const p=pos(e); dot(last,p); last=p;});
  ['pointerup','pointercancel'].forEach(t=>c.addEventListener(t,()=>{down=false;}));
  function dot(a,b){ x.strokeStyle='#111'; x.lineWidth=20; x.lineCap='round'; x.lineJoin='round'; x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(b[0],b[1]); x.stroke(); drawn=true; }
  $('dClear').onclick=()=>{clear(); $('dSteps').innerHTML=''; ['ans1','ans2'].forEach(id=>$(id).textContent='?'); ['bars1','bars2'].forEach(id=>$(id).innerHTML=''); $('dSay').textContent='';};

  async function load(){
    if(nets) return nets;
    const dec=L=>{const bin=atob(L.w), q=new Int8Array(bin.length); for(let i=0;i<bin.length;i++) q[i]=(bin.charCodeAt(i)<<24)>>24; return {...L,q};};
    const get=async n=>{const r=await fetch('models/'+n+'.json'); if(!r.ok) throw new Error(r.status); const j=await r.json(); return j.layers.map(dec);};
    nets=[await get('model'), await get('model2')]; return nets;
  }
  function forward(layers,inp){
    let a=inp;
    for(const L of layers){ const o=new Float32Array(L.n_out); for(let j=0;j<L.n_out;j++) o[j]=L.b[j];
      for(let i=0;i<L.n_in;i++){ const v=a[i]; if(!v) continue; const row=i*L.n_out; for(let j=0;j<L.n_out;j++) o[j]+=v*L.q[row+j]*L.scale; }
      if(L.act==='relu') for(let j=0;j<o.length;j++) o[j]=Math.max(0,o[j]);
      else if(L.act==='softmax'){ const m=Math.max(...o); let s=0; for(let j=0;j<o.length;j++){o[j]=Math.exp(o[j]-m); s+=o[j];} for(let j=0;j<o.length;j++) o[j]/=s; }
      a=o; }
    return a;
  }
  function small(arr,w,label,code){ const cv=document.createElement('canvas'); cv.width=w; cv.height=w; const g=cv.getContext('2d'), im=g.createImageData(w,w);
    for(let k=0;k<w*w;k++){const v=arr[k]; im.data[k*4]=im.data[k*4+1]=im.data[k*4+2]=v; im.data[k*4+3]=255;} g.putImageData(im,0,0);
    const f=document.createElement('figure'); f.appendChild(cv); f.insertAdjacentHTML('beforeend',`${label}<code>${code}</code>`); return f; }
  function preprocess(){
    const d=x.getImageData(0,0,280,280).data, gray=new Uint8ClampedArray(280*280), inv=new Uint8ClampedArray(280*280);
    let x0=280,y0=280,x1=-1,y1=-1;
    for(let k=0;k<280*280;k++){ const g=(d[k*4]+d[k*4+1]+d[k*4+2])/3; gray[k]=g; inv[k]=255-g; if(inv[k]>40){const yy=(k/280)|0, xx=k%280; if(xx<x0)x0=xx; if(xx>x1)x1=xx; if(yy<y0)y0=yy; if(yy>y1)y1=yy;} }
    if(x1<0) return null;
    // MNIST처럼: 숫자를 20 × 20 안에 맞춰 줄이고, 무게중심이 28 × 28의 가운데에 오게 놓기
    const src=document.createElement('canvas'); src.width=280; src.height=280; const sg=src.getContext('2d'), sim=sg.createImageData(280,280);
    for(let k=0;k<280*280;k++){ sim.data[k*4]=sim.data[k*4+1]=sim.data[k*4+2]=inv[k]; sim.data[k*4+3]=255; } sg.putImageData(sim,0,0);
    const bw=x1-x0+1, bh=y1-y0+1, s=20/Math.max(bw,bh), w=Math.max(1,Math.round(bw*s)), h=Math.max(1,Math.round(bh*s));
    const t=document.createElement('canvas'); t.width=w; t.height=h; const tg=t.getContext('2d'); tg.imageSmoothingQuality='high'; tg.drawImage(src,x0,y0,bw,bh,0,0,w,h);
    const td=tg.getImageData(0,0,w,h).data; let m=0,cx=0,cy=0; for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const v=td[(yy*w+xx)*4]; m+=v; cx+=v*xx; cy+=v*yy;}
    cx=m?cx/m:w/2; cy=m?cy/m:h/2;
    const ox=Math.round(14-cx), oy=Math.round(14-cy), a28=new Uint8ClampedArray(784);
    for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){ const X=xx+ox, Y=yy+oy; if(X>=0&&X<28&&Y>=0&&Y<28) a28[Y*28+X]=td[(yy*w+xx)*4]; }
    const shrink=(arr)=>{const o=new Uint8ClampedArray(84*84); for(let yy=0;yy<84;yy++)for(let xx=0;xx<84;xx++) o[yy*84+xx]=arr[((yy*280/84)|0)*280+((xx*280/84)|0)]; return o;};
    const rgb=new Uint8ClampedArray(280*280); for(let k=0;k<280*280;k++) rgb[k]=gray[k];
    $('dSteps').innerHTML='';
    $('dSteps').append(small(shrink(rgb),84,'① 원본','내가 그린 그림'), small(shrink(gray),84,'② 흑백','cvtColor(… GRAY)'), small(shrink(inv),84,'③ 반전','bitwise_not'), small(a28,28,'④ 28 × 28','resize · 가운데 맞춤'), small(a28,28,'⑤ 0~1로','reshape(1, 784) / 255'));
    return Float32Array.from(a28,v=>v/255);
  }
  function bars(id,p,k){ const top=[...p].map((v,i)=>[i,v]).sort((a,b)=>b[1]-a[1]).slice(0,3);
    $(id).innerHTML=top.map(([i,v])=>`<div class="pb" style="--k:${k}"><b>${i}</b><div class="t" style="height:10px;background:#eef0f3;border-radius:5px;overflow:hidden"><i style="width:${(v*100).toFixed(1)}%"></i></div><span>${(v*100).toFixed(1)}%</span></div>`).join(''); return top[0]; }
  $('dAsk').onclick=async()=>{
    $('dErr').classList.remove('on');
    if(!drawn){ $('dSay').textContent='먼저 숫자를 그려 주세요.'; return; }
    const inp=preprocess(); if(!inp){ $('dSay').textContent='그림이 너무 흐려요. 조금 더 진하게 그려 주세요.'; return; }
    $('dSay').textContent='모델을 불러오는 중이에요…';
    try{ const [n1,n2]=await load();
      const a=bars('bars1',forward(n1,inp),'#1f9d74'), b=bars('bars2',forward(n2,inp),'#c98a00');
      $('ans1').textContent=a[0]; $('ans2').textContent=b[0];
      $('dSay').innerHTML=a[0]===b[0]?`두 모델 모두 <b>${a[0]}</b>${[2,4,5,9].includes(a[0])?'':'이'}라고 답했어요. 확신하는 정도(확률)는 얼마나 다른가요?`:`두 모델의 답이 달라요! model은 <b>${a[0]}</b>, model2는 <b>${b[0]}</b>. 어느 쪽이 맞았나요?`;
    }catch(e){ $('dSay').textContent=''; $('dErr').textContent='모델 파일을 불러오지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.'; $('dErr').classList.add('on'); }
  };

})();


const MEMOLIST=[['plan1','기계학습으로 해결할 수 있는 문제의 특성과 해결 방법'],['plan2','딥러닝은 어떻게 구현할까']];
onShow[8]=()=>memoSummary('msum',MEMOLIST);
