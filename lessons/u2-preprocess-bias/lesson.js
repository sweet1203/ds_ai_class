/* 01 어느 단계의 편향일까? (상황은 모두 예시) */
sorter('stageGame',{
  cats:[{n:'🧺 데이터 수집',k:'#2f6fd0'},{n:'🧹 데이터 전처리',k:'#e0702b'},{n:'🏷️ 속성 선택',k:'#9b4fc4'}],
  items:[
    {t:'급식 만족도를 예측하려고 3학년 학생들에게만 설문을 받았다.',short:'3학년에게만 설문',c:0,ic:'🍱',w:'1·2학년이 아예 빠졌어요. 특정 집단이 누락되면 데이터 수집 단계의 편향이에요.'},
    {t:'얼굴 인식 인공지능을 만들 사진을 모았는데, 대부분이 한 피부색의 사람 사진이었다.',short:'한 피부색 사진이 대부분',c:0,ic:'📷',w:'특정 집단이 너무 많이(또는 적게) 수집된 경우예요. 데이터 수집 단계의 편향이에요.'},
    {t:'「고등학생 평균 키」 데이터를 만들려고 농구부 학생들의 키만 측정했다.',short:'농구부 키만 측정',c:0,ic:'🏀',w:'모은 집단이 전체를 대표하지 못해요. 데이터 수집 단계의 편향이에요.'},
    {t:'키 175를 입력하다가 1750으로 잘못 입력했다.',short:'175 → 1750 잘못 입력',c:1,ic:'⌨️',w:'데이터를 입력할 때 잘못 입력하면 데이터 전처리 단계에서 편향이 생겨요.'},
    {t:'수면 시간을 적지 않은 학생들의 칸을 모두 「8시간」으로 채워 넣었다.',short:'빈칸을 8시간으로 채움',c:1,ic:'🛌',w:'비어 있는 값을 채워 넣는 과정에서 실제와 다른 값이 들어가요. 데이터 전처리 단계의 편향이에요.'},
    {t:'몸무게가 비어 있는 학생의 칸을 남학생 평균 몸무게로 채웠다.',short:'빈칸을 남학생 평균으로',c:1,ic:'⚖️',w:'여학생의 빈칸까지 남학생 평균으로 채우면 한쪽으로 치우쳐요. 데이터 전처리 단계의 편향이에요.'},
    {t:'직원을 뽑는 인공지능에 「출신 지역」을 판단 속성으로 넣었다.',short:'채용에 출신 지역',c:2,ic:'🗺️',w:'일과 상관없는 속성에 사회의 편견이 담길 수 있어요. 속성 선택 단계의 편향이에요.'},
    {t:'대출 심사 인공지능에 「성별」을 판단 속성으로 넣었다.',short:'대출 심사에 성별',c:2,ic:'🏦',w:'무의식적으로 가지고 있는 사회의 편향이 속성으로 들어갔어요. 속성 선택 단계의 편향이에요.'},
  ],
  end:'편향은 <b>모을 때</b>(누가 빠졌나, 누가 너무 많나), <b>다듬을 때</b>(잘못 입력, 빈칸 채우기), <b>속성을 고를 때</b>(사회의 편견이 들어간 속성) 모두 생길 수 있어요.'
});

/* 02 AI 스피커 시뮬레이션 — 숫자는 예시 */
(function(){
  const B=$('fairSim');
  const acc=s=>55+40*(1-Math.exp(-s/0.15));   // 학습 데이터 속 비율 s → 그 집단의 인식 정확도(예시)
  B.innerHTML=`<div class="ctrl"><label>학습 데이터 속 어르신 목소리</label><input type="range" id="fsS" min="0" max="50" step="5" value="5"><output id="fsO"></output></div>
    <div class="fs-mix"><span class="t"></span><span class="e"></span></div>
    <div class="fs-bars"></div><div class="fs-msg"></div>`;
  const bar=(lab,v,cls)=>`<div class="fs-row ${cls}"><span>${lab}</span><div class="fs-tr"><i style="width:${v}%"></i></div><b>${v.toFixed(0)}%</b></div>`;
  function upd(){
    const s=+$('fsS').value/100, t=acc(1-s), e=acc(s), all=.7*t+.3*e, gap=t-e;
    $('fsO').textContent=Math.round(s*100)+'%';
    B.querySelector('.fs-mix .t').style.flex=1-s||0.001; B.querySelector('.fs-mix .e').style.flex=s||0.001;
    B.querySelector('.fs-mix .t').textContent=`청소년 ${Math.round((1-s)*100)}%`; B.querySelector('.fs-mix .e').textContent=s>=.1?`어르신 ${Math.round(s*100)}%`:'';
    B.querySelector('.fs-bars').innerHTML=bar('🎯 전체 사용자',all,'all')+bar('🧑 청소년',t,'tn')+bar('👵 어르신',e,'el');
    const miss=Math.round((100-e)/10);
    let m;
    if(gap>=15) m=`전체 정확도는 <b>${all.toFixed(0)}%</b>로 나쁘지 않아 보여요. 그런데 어르신은 10번 말하면 약 <b>${miss}번</b>을 못 알아들어요. 틀리는 일이 한 집단에 몰려 있어요 → <b>공정성</b> 문제가 커요.`;
    else if(gap>=5) m=`이 비율에서는 두 집단의 차이가 <b>${gap.toFixed(0)}%p</b>예요. 전체 정확도는 <b>${all.toFixed(0)}%</b>예요. 어르신은 10번 말하면 약 <b>${miss}번</b>을 못 알아들어요.`;
    else m=`이 비율에서는 두 집단의 정확도가 거의 비슷해요(차이 <b>${gap.toFixed(1)}%p</b>). 전체 정확도는 <b>${all.toFixed(0)}%</b>예요. 어르신 목소리가 아주 적을 때와 비교해 <b>정확성</b>과 <b>공정성</b>이 어떻게 다른지 살펴보세요.`;
    B.querySelector('.fs-msg').innerHTML=m+' <small class="muted">(예시 숫자)</small>';
  }
  $('fsS').oninput=upd; upd();
})();

/* 03 문제마다 수집 방법 고르기 — 예시 답안은 교사용 교과서 예시 답안 */
(function(){
  const M=['관찰, 측정, 설문','자동화 장치와 코드','공유 사이트'];
  const P=[
    ['다양한 관심사를 가진 친구들이 정보 데이터 분석 과제 수행을 위한 모둠을 구성하는 문제',0,'무의식적으로 가지고 있는 사회의 편향을 고려하여 문항지 만들기'],
    ['펭귄 속성으로 어떤 종류의 펭귄인지 분류하기 위한 문제',2,'특정 집단이 너무 많거나 적게 수집되었는지 확인하여 학습 데이터 개수 공정성 확보하기'],
    ['학습 시간과 성적의 관계를 학습하여 성적을 예측하는 문제',0,'특정 집단의 데이터만 수집하지 않기'],
    ['「과목 선택」 검색 추이를 분석하여 예상 빈도수를 예측하는 문제',1,'데이터를 수집하여 입력할 때 잘못 입력하거나 비어 있는 값을 채워 넣을 때 편향적이지 않도록 처리하기'],
  ];
  const B=$('planTbl'); let pick=P.map(()=>-1);
  (MEMO.planPick||'').split(' · ').forEach(x=>{const m=x.match(/^문제(\d): (.+)$/); if(m){const i=+m[1]-1, j=M.indexOf(m[2]); if(i>=0&&i<P.length&&j>=0) pick[i]=j;}});
  function draw(){
    B.innerHTML=P.map((p,i)=>`<div class="pl-row"><div class="pl-q"><b>${i+1}</b>${p[0]}</div>
      <div class="pl-m">${M.map((m,j)=>`<button data-i="${i}" data-j="${j}" class="${pick[i]===j?'on':''}">${m}</button>`).join('')}</div>
      ${pick[i]<0?'':`<div class="pl-a"><span class="${pick[i]===p[1]?'ok':'df'}">${pick[i]===p[1]?'예시 답안과 같아요':'예시 답안과 달라요 — 그렇게 고른 이유를 말할 수 있다면 괜찮아요'}</span><br><b>예시 답안</b> 수집 방법: ${M[p[1]]} · 편향성 방지를 위해 노력할 점: ${p[2]}</div>`}</div>`).join('');
    B.querySelectorAll('button').forEach(b=>b.onclick=()=>{ pick[+b.dataset.i]=+b.dataset.j;
      MEMO.planPick=pick.map((j,i)=>j<0?'':`문제${i+1}: ${M[j]}`).filter(Boolean).join(' · '); store.set(MK,MEMO); draw(); });
  }
  draw();
})();

/* 04 Iris.csv 열어 보기 + 종류별 개수 */
(function(){
  const B=$('irisView'); let kor=false, counted=false;
  const EN=['Id','SepalLengthCm','SepalWidthCm','PetalLengthCm','PetalWidthCm','Species'], KO=['일련번호','꽃받침 길이','꽃받침 너비','꽃잎 길이','꽃잎 너비','종류'];
  const R=[[1,'5.1','3.5','1.4','0.2',0],[2,'4.9','3.0','1.4','0.2',0],[3,'4.7','3.2','1.3','0.2',0],[51,'7.0','3.2','4.7','1.4',1],[101,'6.3','3.3','6.0','2.5',2]];
  const SE=['Iris-setosa','Iris-versicolor','Iris-virginica'], SK=['세토사','버시컬러','버지니카'];
  function draw(){
    const H=kor?KO:EN, S=kor?SK:SE;
    const rows=R.map((r,k)=>`${k===3||k===4?'<tr class="gap"><td colspan="6">⋮</td></tr>':''}<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${S[r[5]]}</td></tr>`).join('');
    B.innerHTML=`<div class="row"><button class="btn sm ${kor?'ghost':''}" data-k="en">Iris.csv (영문)</button><button class="btn sm ${kor?'':'ghost'}" data-k="ko">Iris1.csv (한글로 바꾼 파일)</button></div>
      <div class="iv-wrap"><table class="iv"><tr>${H.map(h=>`<th>${h}</th>`).join('')}</tr>${rows}<tr class="gap"><td colspan="6">⋮ 모두 150행</td></tr></table></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-k="cnt">${kor?'종류':'Species'}별 개수 세어 보기</button></div>
      <div class="iv-cnt">${counted?S.map((s,i)=>`<div class="fs-row"><span>${s}</span><div class="fs-tr"><i style="width:${50/60*100}%;background:${['#2f6fd0','#e0702b','#1f9d74'][i]}"></i></div><b>50개</b></div>`).join('')+
        `<p class="iv-msg">세 종류가 <b>50개씩</b>으로 같아요. 종류별 개수에서는 치우침이 보이지 않아요. 만약 한 종류만 아주 적었다면, 학습에 사용할 데이터의 수를 종류별로 맞춰야 해요. <span class="muted">개수 말고도 「언제, 어디서 모은 데이터인가」도 편향과 관련이 있어요. 이 데이터를 언제 만들었는지는 06에서 알아봐요.</span></p>`:''}</div>`;
    B.querySelector('[data-k="en"]').onclick=()=>{kor=false; draw();};
    B.querySelector('[data-k="ko"]').onclick=()=>{kor=true; draw();};
    B.querySelector('[data-k="cnt"]').onclick=()=>{counted=true; draw();};
  }
  draw();
})();

/* 04 빈칸 · 스스로 점검 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['문제 해결에 적절한 데이터 수집 방법을 선택할 수 있다','데이터 편향이 발생하지 않도록 노력할 점을 말할 수 있다','데이터 속성을 파악할 수 있다'],true);

/* 05 속성 분류 게임 (교과서 66쪽의 예) */
sorter('typeGame',{
  cats:[{n:'수치형 · 연속형',k:'#2f6fd0'},{n:'수치형 · 이산형',k:'#1f9d74'},{n:'범주형 · 순위형',k:'#e0702b'},{n:'범주형 · 명목형',k:'#9b4fc4'}],
  items:[
    {t:'키 (예: 178.3)',short:'키',c:0,ic:'📏',w:'키는 숫자로 표현되고 비교·연산이 가능하며, 값 사이에 얼마든지 다른 값이 있을 수 있는 연속형이에요.'},
    {t:'체온 (예: 36.5)',short:'체온',c:0,ic:'🌡️',w:'체온도 재어서 얻는 연속형 수치 데이터예요.'},
    {t:'붓꽃의 꽃잎 길이 (예: 1.4)',short:'꽃잎 길이',c:0,ic:'🌸',w:'측정해서 얻는 길이는 연속형 수치 데이터예요.'},
    {t:'가족 인원수 (예: 4)',short:'가족 인원수',c:1,ic:'👨‍👩‍👧',w:'사람 수는 세어서 얻고 4.5명 같은 값이 없어요. 이산형 수치 데이터예요.'},
    {t:'신발 크기 (예: 260)',short:'신발 크기',c:1,ic:'👟',w:'교과서는 신발 크기를 이산형의 예로 들어요.'},
    {t:'등급 (1등급, 2등급, 3등급)',short:'등급',c:2,ic:'🥇',w:'숫자가 들어 있어도 범주를 나타내요. 범주 사이에 순서가 있으니 순위형이에요.'},
    {t:'혈액형 (A, B, O, AB)',short:'혈액형',c:3,ic:'🩸',w:'혈액형은 몇 개의 범주로 나뉘고 순서가 없어요. 명목형이에요.'},
    {t:'붓꽃의 종류 (세토사, 버시컬러, 버지니카)',short:'붓꽃 종류',c:3,ic:'💐',w:'종류는 순서가 없는 범주예요. 명목형 범주 데이터예요.'},
  ],
  end:'<b>계산할 수 있는 양</b>이면 수치형(재면 연속형, 세면 이산형), <b>갈래</b>를 나타내면 범주형(순서가 있으면 순위형, 없으면 명목형)이에요.'
});

/* 05 (나)/(다) 문제에 따라 바뀌는 독립·종속 변수 (표 Ⅱ-3) */
(function(){
  const C=['꽃받침 길이','꽃받침 너비','꽃잎 길이','꽃잎 너비','종류'];
  const R={na:{dep:'종류',txt:'(나) 문제: 우리가 알고 싶어 하는 <b>붓꽃의 종류</b>에 영향을 미치는 속성(붓꽃의 속성 네 가지)이 독립 변수, 기계학습으로 분류하고자 하는 <b>붓꽃의 종류</b>가 종속 변수예요.'},
           da:{dep:'꽃받침 너비',txt:'(다) 문제(빠진 속성이 꽃받침 너비일 때): 꽃잎 길이, 꽃잎 너비, 꽃받침 길이, 종류 속성이 독립 변수, 알고 싶은 <b>꽃받침 너비</b> 속성이 종속 변수예요.'}};
  const bs=[...document.querySelectorAll('.pa-role-btn button')];
  function pick(r){
    bs.forEach(b=>b.classList.toggle('ghost',b.dataset.r!==r));
    $('roleView').innerHTML=`<div class="iv-wrap"><table class="iv rv"><tr>${C.map(c=>`<th class="${c===R[r].dep?'dep':'ind'}">${c}<small>${c===R[r].dep?'종속 변수':'독립 변수'}</small></th>`).join('')}</tr></table></div><p class="note" style="font-size:.9rem;color:var(--ink)">${R[r].txt}</p>`;
  }
  bs.forEach(b=>b.onclick=()=>pick(b.dataset.r)); pick('na');
})();

/* 06 전처리 네 가지 (67쪽 측주) */
flipCards('prepCards',[
  {ic:'🧹',f:'데이터 정제',s:'눌러서 뜻 보기',b:'비어 있는 데이터나 잡음, 모순된 데이터 등을 적합하게 교정하는 작업',x:'예: 결측치·이상치 처리'},
  {ic:'🧩',f:'데이터 통합',s:'눌러서 뜻 보기',b:'여러 개의 데이터 집합 또는 파일을 통합하는 작업',x:'이 화면: Iris1.csv + Iris2.csv'},
  {ic:'🗜️',f:'데이터 축소',s:'눌러서 뜻 보기',b:'샘플링, 차원 축소, 특징 선택 및 추출을 통해 데이터 크기를 줄이는 작업',x:'예: 핵심 속성만 골라 쓰기'},
  {ic:'🔄',f:'데이터 변환',s:'눌러서 뜻 보기',b:'데이터를 적절한 형태로 변환하는 작업',x:'예: 측정 단위를 맞추는 스케일링, 범주형을 수치형으로 바꾸는 인코딩(60쪽)'},
]);

/* 06 두 표 합치기: pd.concat */
(function(){
  const SK=['세토사','버시컬러','버지니카'];
  const D1=[[0,1,'5.1','3.5','1.4','0.2',0],[1,2,'4.9','3.0','1.4','0.2',0],null,[148,149,'6.2','3.4','5.4','2.3',2],[149,150,'5.9','3.0','5.1','1.8',2]];
  const D2=[[0,151,'','3.1','1.5','0.2',0],[1,152,'4.4','','1.2','0.2',0],[2,153,'5.8','','1.2','',0],null,[28,179,'6.5','2.7','5.2','2.0',2],[29,180,'5.5','2.6','4.6','1.5',2]];
  const H='<tr><th></th><th>일련번호</th><th>꽃받침 길이</th><th>꽃받침 너비</th><th>꽃잎 길이</th><th>꽃잎 너비</th><th>종류</th></tr>';
  const row=(r,cls)=>r?`<tr class="${cls}"><th>${r[0]}</th><td>${r[1]}</td>${r.slice(2,6).map(v=>v===''?'<td class="nan">NaN</td>':`<td>${v}</td>`).join('')}<td>${SK[r[6]]}</td></tr>`:`<tr class="gap ${cls}"><td colspan="7">⋮</td></tr>`;
  const tbl=(rows,cls,cap)=>`<div class="ml-t"><div class="ml-cap">${cap}</div><div class="iv-wrap"><table class="iv">${H}${rows.map(r=>row(r,cls)).join('')}</table></div></div>`;
  const B=$('mergeLab'); let mode=null;
  function draw(){
    let out='';
    if(mode){ const first=mode==='12'?[D1,'a']:[D2,'b'], second=mode==='12'?[D2,'b']:[D1,'a'];
      out=`<div class="ml-res"><div class="ml-cap"><span class="mono">df = pd.concat([${mode==='12'?'df1, df2':'df2, df1'}])</span> 실행 결과</div><div class="iv-wrap"><table class="iv">${H}${first[0].map(r=>row(r,first[1])).join('')}${second[0].map(r=>row(r,second[1])).join('')}</table></div>
        <p class="ml-dim">180 rows × 6 columns</p>
        <p class="iv-msg">${mode==='12'?'df1(150행) 뒤에 df2(30행)가 붙어 <b>180행</b>이 되었어요.':'순서를 바꾸면 df2가 위, df1이 아래에 와요. 행 수는 똑같이 <b>180행</b>이에요. 교과서는 df1 뒤에 df2를 붙였어요.'}
        왼쪽 회색 번호(인덱스)를 보세요. 원래 표의 번호를 그대로 가져와서 <b>뒤쪽 표는 0부터 다시 시작</b>해요. 그리고 <b class="nanb">NaN</b> 칸이 보이죠? Iris2.csv에는 <b>비어 있는 값</b>이 있어요. 이런 칸을 어떻게 처리할지는 결측치 처리에서 배워요.</p></div>`; }
    B.innerHTML=`<div class="ml-src">${tbl(D1,'a','df1 · Iris1.csv (150행)')}${tbl(D2,'b','df2 · Iris2.csv (30행)')}</div>
      <div class="row" style="margin:10px 0"><button class="btn sm${mode==='12'?'':' ghost'}" data-m="12">▶ pd.concat([df1, df2])</button><button class="btn sm${mode==='21'?'':' ghost'}" data-m="21">▶ pd.concat([df2, df1])</button></div>${out}`;
    B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m; draw();});
  }
  draw();
})();

const MEMOLIST=[['chefData','인공지능에게 좋은 데이터란'],['biasStage','편향이 생기는 단계와 구체적인 예'],['fairVsAcc','정확하지 않은 것과 공정하지 않은 것'],['biasPlan','수집 방법·편향 방지 노력, 완전히 없앨 수 있을까'],['planPick','스스로 해결하기: 내가 고른 수집 방법'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[7]=()=>memoSummary('msum',MEMOLIST);
