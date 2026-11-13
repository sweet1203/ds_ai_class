/* u4-review · 「인공지능 프로젝트」 단원 정리 */

/* 01 · 프로젝트와 지속가능발전목표 카드 (179·191·203쪽) */
flipCards('sdgCards',[
  {ic:'🐧',f:'남극 펭귄의 종류 분류',s:'몇 번 목표일까?',b:'「어떻게 하면 남극 펭귄의 종류를 구별할 수 있는 모델을 만들 수 있을까?」',x:'14번 해양 생태계 보전 · 펭귄의 종류와 개체 수, 분포를 파악해 남극 생태계 보전에 필요한 정보를 모은다.'},
  {ic:'📈',f:'기대 수명 예측',s:'몇 번 목표일까?',b:'수명과 관련된 데이터를 전처리하여, 3번 목표의 측정 지표인 기대 수명을 예측하는 모델을 만든다.',x:'3번 건강하고 행복한 삶 · 모든 연령층을 위한 건강한 삶 보장과 복지 증진'},
  {ic:'🔥',f:'산불 이미지 분류',s:'몇 번 목표일까?',b:'화재 예방을 위해 산불 관련 이미지 데이터를 학습하는 인공지능 모델을 만든다.',x:'13번 기후 변화 대응 · 산불로 숲이 사라지면 이산화탄소가 방출되어 지구 온난화의 원인이 될 수 있다.'},
  {ic:'🌍',f:'내 프로젝트',s:'몇 번 목표와 이어질까?',b:'내가 정한 문제는 어떤 목표와 이어지나요? 구체적이고 측정할 수 있는 질문인가요?',x:'아래 메모 칸에 「어떻게 하면 …할 수 있을까?」로 써 보세요.'}
]);

/* 02 · 흐름도 완성하기 (219쪽) */
const FLOW=(()=>{
  const HINT=['학습하려면 먼저 무엇이 있어야 할까요?','모은 데이터에 빈 값이나 이상한 값이 없는지부터 살펴봐요.','속성 사이의 관계를 그래프로 그려 살펴봐요.','문제 유형에 맞는 알고리즘을 골라요.','고른 알고리즘으로 모델을 만들고 훈련 데이터로 학습해요.','테스트 데이터로 모델이 얼마나 잘하는지 재요.','결과를 보고 모델을 고쳐 더 좋게 만들어요.','마지막으로 결과를 정리해 함께 나눠요.'];
  const P=[
    {id:'peng',n:'펭귄 종류 분류',ic:'🐧',k:'#e0702b',
     steps:['펭귄 종류 데이터 수집','데이터 확인 및 데이터 전처리','데이터 시각화 한 후 분석','분류 알고리즘 선정','분류 모델 생성 후 학습','성능 평가','수정 및 성능 향상','모둠별 발표'],
     decoy:['예측 알고리즘 선정','펭귄은 턱끈·젠투·아델리 세 종 중 하나로 나누므로 <b>분류</b> 문제예요. 몇 세처럼 숫자를 내는 기대 수명이 예측이에요.'],
     did:['팔머 군도 펭귄 데이터(캐글): 종·섬·부리 길이·부리 깊이·지느러미 길이·체질량·성별, 344개 행','결측치가 있는 행 삭제(dropna), 성별의 「.」 이상치 제거, 범주형 값을 숫자로 바꾸기(map)','전처리하며 pairplot·히트맵으로 종을 잘 가르는 속성 찾기 → 섬과 성별은 상관관계가 거의 없어 빼기','세 종 중 하나로 나누는 분류 → k-최근접 이웃(이웃 3개)과 로지스틱 회귀를 비교하기로','훈련 데이터 80%로 fit( ) 학습, 테스트 데이터 20%를 predict( )로 분류','정확도 k-최근접 이웃 0.806 · 로지스틱 회귀 0.985, 혼동행렬로 종마다 맞힌 수 확인','표준화(StandardScaler)로 속성의 크기를 맞춘 뒤 다시 학습 → 두 모델 모두 정확도 1.0(예시 답안)','기대 효과 나누기: 펭귄의 분포·서식 지역 정보 수집, 비슷한 동물의 분류에 활용']},
    {id:'life',n:'기대 수명 예측',ic:'📈',k:'#1f9d74',
     steps:['기대 수명 데이터 수집','데이터 확인 및 데이터 전처리','데이터 시각화 한 후 분석','예측 알고리즘 선정','예측 모델 생성 후 학습','성능 평가','수정 및 성능 향상','모둠별 발표'],
     decoy:['분류 모델 생성 후 학습','기대 수명은 「몇 세」라는 숫자를 내므로 <b>예측</b> 모델을 만들어요. 정해진 갈래 중 하나를 고르는 것이 분류예요.'],
     did:['WHO 기대 수명 데이터(캐글 「Life Expectancy」): 2,938개 행 · 22개 속성','isna( ).sum( )으로 결측치 확인 후 삭제(dropna), Status의 개발도상국·선진국을 0과 1로 바꾸기','히스토그램·히트맵·pairplot·바이올린 그래프 → 교육과 소득은 기대 수명과 상관관계가 높다','몇 세인지 숫자를 내므로 지도학습의 예측 → 선형 회귀, 훈련:테스트 = 8:2','LinearRegression( )으로 학습하고 가중치(coef_)와 편향(intercept_) 확인','결정 계수(R²) 약 0.79, 테스트 데이터 330개 중 약 85%가 실제와 5년 안(교과서는 2~5년 내외라고 소개)','교육 수준(Schooling) 하나로 회귀선을 그려 모델이 배운 경향 살펴보기','기대 효과 나누기: 개인·사회·의료 분야에서 기대 수명 예측 활용']},
    {id:'fire',n:'산불 이미지 분류',ic:'🔥',k:'#d64535',
     steps:['산불 이미지 데이터 수집','데이터 확인 및 데이터 전처리','데이터 시각화 한 후 분석','이미지 분류 알고리즘 선정','이미지 분류 모델 생성 후 학습','성능 평가','이미지 편향 해결','모둠별 발표'],
     decoy:['예측 모델 생성 후 학습','산불 사진인지 아닌지 두 갈래로 나누는 <b>이미지 분류</b>예요. 숫자를 내는 예측 모델이 아니에요.'],
     did:['산불 이미지 162장, 산불이 아닌 이미지 162장(인터넷 검색·주변 촬영·생성형 인공지능)','fire·non 폴더로 나눠 저장, 이미지 색상을 BGR에서 RGB로 바꾸는 read_img( ) 함수','imshow( )로 산불·산불이 아닌 이미지를 한 장씩 띄워 크기와 모양 확인','이미지 같은 비정형 데이터 분류 → 합성곱 신경망(CNN): 합성곱층·풀링층으로 특징 추출','RGB 값을 255로 나눠 0~1로 정규화, 손실함수 binary_crossentropy · 최적화 Adam, 8번(epoch) 학습','학습 횟수별 오차(loss)와 정확도(accuracy) 확인, 새 이미지로 테스트','빨간색 건물을 산불로 판별 → 회색조(BGR2GRAY)로 바꾸고 15번 학습. 교과서는 산불이 아닌 이미지로 판별했다고 소개(내 결과는 다를 수 있음) · 붉지만 산불이 아닌 사진을 더하는 것이 근본적인 방법','기대 효과 나누기: 산불 위험 지역 예측·경고, 생태계 보호']}
  ];
  const FK=MK+'-flow'; const S=store.get(FK,{}); let cur=0;
  const save=()=>store.set(FK,S);  /* 진행 상황은 학번마다 이 기기에 저장 */
  P.forEach(p=>{ const s=S[p.id]; if(s&&!(Array.isArray(s.cards)&&s.cards.length===p.steps.length+1&&Array.isArray(s.used)&&s.pos>=0&&s.pos<=p.steps.length)) delete S[p.id]; });
  const tabs=$('flowTabs'), board=$('flowBoard'), pool=$('flowPool'), fb=$('flowFb'), hub=$('flowHub');
  function fresh(p){ return {pos:0, miss:0, cards:shuffle([...p.steps, p.decoy[0]]), used:[]}; }
  tabs.innerHTML=P.map((p,i)=>`<button type="button" data-i="${i}" style="--k:${p.k}"><span>${p.ic}</span>${p.n}<i></i></button>`).join('');
  const tbs=[...tabs.querySelectorAll('button')];
  function draw(focusIdx){
    const p=P[cur], s=S[p.id]||(S[p.id]=fresh(p)), done=s.pos>=p.steps.length;
    tbs.forEach((b,i)=>{ b.classList.toggle('on',i===cur); b.setAttribute('aria-pressed',i===cur); const st=S[P[i].id]; b.querySelector('i').textContent=st&&st.pos>=P[i].steps.length?' ✓':''; });
    hub.style.setProperty('--k',p.k);
    hub.innerHTML=`<span>${p.ic}</span><b>${p.n}</b><small>${done?`완성! 잘못 고른 횟수 ${s.miss}번`:`${s.pos} / ${p.steps.length}칸`}</small>`;
    board.innerHTML=p.steps.map((t,i)=>{
      const filled=i<s.pos, next=i===s.pos;
      return `<li class="${filled?'f':''}${next?' nx':''}" style="--k:${p.k}"><b class="n">${i+1}</b><div>${filled?`<b>${esc(t)}</b>`:`<span class="q">${next?'여기에 들어갈 단계는?':'?'}</span>`}${done?`<small>${esc(p.did[i])}</small>`:''}</div></li>`;
    }).join('');
    pool.innerHTML=done?`<div class="u4r-done">흐름도 완성! 위 칸마다 <b>${p.n}</b> 프로젝트에서 실제로 한 일이 나타났어요. ${P.some(q=>!(S[q.id]&&S[q.id].pos>=q.steps.length))?'다른 프로젝트도 골라 비교해 보세요.':'세 프로젝트를 모두 완성했어요. 칸마다 무엇이 같고 다른지 견주어 보세요.'}</div>`
      :s.cards.map((t,j)=>`<button type="button" data-j="${j}" ${s.used.includes(j)?'disabled':''}>${esc(t)}</button>`).join('');
    pool.querySelectorAll('button').forEach(b=>b.onclick=()=>pick(+b.dataset.j));
    if(focusIdx!=null){ const bs=[...pool.querySelectorAll('button:not(:disabled)')]; if(bs.length) bs[Math.min(focusIdx,bs.length-1)].focus(); else tbs[cur].focus(); }
  }
  function pick(j){
    const p=P[cur], s=S[p.id], t=s.cards[j];
    const enabled=[...pool.querySelectorAll('button:not(:disabled)')], fi=enabled.findIndex(b=>+b.dataset.j===j);
    if(t===p.steps[s.pos]){
      s.used.push(j); s.pos++; save();
      fb.innerHTML=s.pos>=p.steps.length?'<span class="ok">모두 맞혔어요!</span>':`<span class="ok">맞아요!</span> ${s.pos}번째 칸은 「${esc(t)}」.`;
      draw(fi);
      return;
    }
    s.miss++; save();
    const b=pool.querySelector(`button[data-j="${j}"]`); if(b){ b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
    if(t===p.decoy[0]) fb.innerHTML=`<span class="ng">이 프로젝트와 맞지 않는 카드예요.</span> ${p.decoy[1]}`;
    else fb.innerHTML=`<span class="ng">아직 이 단계가 아니에요.</span> 지금 채울 칸은 <b>${s.pos+1}번째</b>예요. 힌트: ${HINT[s.pos]}`;
    hub.querySelector('small').textContent=`${s.pos} / ${p.steps.length}칸`;
  }
  tbs.forEach((b,i)=>b.onclick=()=>{ cur=i; fb.innerHTML=''; draw(); });
  $('flowReset').onclick=()=>{ S[P[cur].id]=fresh(P[cur]); save(); fb.innerHTML=''; draw(); };
  /* 탭·카드 묶음 안에서 방향키로 이동 (화면 넘김 막기) */
  function roving(box,sel){
    box.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)) return;
      const bs=[...box.querySelectorAll(sel)]; const i=bs.indexOf(document.activeElement); if(i<0||!bs.length) return;
      e.preventDefault();
      let n=i;
      if(e.key==='Home') n=0; else if(e.key==='End') n=bs.length-1;
      else n=(i+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)+bs.length)%bs.length;
      bs[n].focus();
    });
  }
  roving(tabs,'button'); roving(pool,'button:not(:disabled)');
  draw();
  return {P,S};
})();

/* 03 · 어느 프로젝트의 이야기일까? (공용 분류 게임) */
sorter('projGame',{
  cats:[{n:'🐧 펭귄 종류 분류',k:'#e0702b'},{n:'📈 기대 수명 예측',k:'#1f9d74'},{n:'🔥 산불 이미지 분류',k:'#d64535'}],
  items:[
    {t:'부리 길이·부리 깊이·지느러미 길이·체질량이 담긴 <b>표 데이터</b>',short:'데이터: 부리·지느러미·체질량 (정형)',c:0,w:'팔머 군도에서 수집한 데이터로, 캐글에서 내려받았어요(181쪽).'},
    {t:'<b>k-최근접 이웃</b>과 <b>로지스틱 회귀</b> 두 알고리즘의 정확도를 비교했다',short:'알고리즘: k-NN · 로지스틱 회귀 (분류)',c:0,w:'세 종으로 나누는 분류 문제라 분류 알고리즘 두 가지로 학습해 정확도를 비교했어요(186~187쪽).'},
    {t:'<b>혼동행렬</b>로 종마다 몇 마리를 맞게 분류했는지 확인했다',short:'평가: 정확도 · 혼동행렬',c:0,w:'혼동행렬은 실젯값과 예측값을 표로 나타내 분류 모델이 어디서 틀렸는지 보여 줘요(187쪽).'},
    {t:'WHO가 제공한 데이터, <b>2,938개 행과 22개 속성</b>의 표',short:'데이터: WHO 국가별 속성 (정형)',c:1,w:'캐글에서 「Life Expectancy」를 검색해 내려받았어요(192~193쪽).'},
    {t:'결과가 몇 세인지 숫자로 나오므로 <b>선형 회귀</b>를 골랐다',short:'알고리즘: 선형 회귀 (예측)',c:1,w:'지도학습의 예측 알고리즘으로는 선형 회귀가 대표적이에요(197쪽).'},
    {t:'<b>결정 계수(R²)</b>가 약 0.79로 나왔다',short:'평가: 결정 계수(R²)',c:1,w:'R²는 1에 가까울수록 성능이 높아요. 테스트 데이터 330개 중 약 85%가 실제와 5년 안이었어요(교과서는 2~5년 내외라고 소개, 199쪽).'},
    {t:'인터넷 검색·주변 촬영·생성형 인공지능으로 모은 <b>이미지 324장</b>',short:'데이터: 이미지 324장 (비정형)',c:2,w:'산불 이미지 162장과 산불이 아닌 이미지 162장이에요(204~206쪽).'},
    {t:'합성곱층과 풀링층으로 특징을 뽑는 <b>CNN</b>을 설계했다',short:'알고리즘: 합성곱 신경망(CNN)',c:2,w:'CNN은 이미지 또는 영상 데이터를 처리할 때 쓰는 딥러닝 모델이에요(208~209쪽).'},
    {t:'학습 횟수(epoch)에 따른 <b>오차와 정확도 그래프</b>를 그렸다',short:'평가: 오차(loss) · 정확도 그래프',c:2,w:'학습이 진행될수록 오차는 줄고 정확도는 커졌어요(211쪽).'}
  ],
  end:'세 칸이 그대로 <b>비교표</b>가 되었어요. 데이터 → 알고리즘 → 평가 지표 순으로 세 프로젝트를 견주어 보세요. 펭귄·기대 수명은 표로 된 정형 데이터, 산불은 이미지인 비정형 데이터예요. 펭귄과 산불은 <b>분류</b>, 기대 수명은 <b>예측</b>이에요.'
});

/* 04 · 내가 맡고 싶은 역할 */
chips('roleChips','myRole',['프로젝트 기획자','데이터 수집가','데이터 분석가','모델 개발자','프로젝트 발표자'],false);

/* 05 · 빈칸 · 역량 Check */
document.querySelectorAll('.u4r-blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('compChips','competency',['추상화 능력','자동화 능력','창의·융합 능력','디지털 의사소통·협업 능력','디지털 윤리 의식','디지털 기술 활용 능력','인공지능 문제 해결력','데이터 문해력','인공지능 윤리 의식'],true);

const MEMOLIST=[['planMemo','학습 계획: 기억에 남는 프로젝트 · 다시 확인할 것'],['myProblem','내 프로젝트의 목표와 질문 형태 문제 정의'],['biasMemo','생길 수 있는 데이터 편향과 줄이는 방법'],['myRole','내가 맡고 싶은 역할'],['careerMemo','인공지능으로 해 보고 싶은 일'],['competency','역량 Check: 길러진 역량'],['projReflect','내 프로젝트 되돌아보기']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
