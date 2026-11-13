/* 01 온라인 설문 체험: 응답하면 바로 데이터 표의 한 줄이 되고 요약이 다시 계산됨 (문항·예시 응답은 꾸민 예시, 저장·전송 없음) */
(function(){
  const B=$('svGame'), WAY=['걷기','버스','지하철','자전거','기타'], LK=['전혀 그렇지 않다','그렇지 않다','보통이다','그렇다','매우 그렇다'];
  const EX=[[15,'버스',4,5],[8,'걷기',5,3],[25,'지하철',2,5],[12,'자전거',3,4],[30,'버스',1,5],[10,'걷기',4,2]];
  let me=null, a={min:'',way:null,q3:null,q4:null}, err='';
  const lk=(k,lab)=>`<div class="sv-q"><b>${lab}</b><div class="sv-lk">${LK.map((t,i)=>`<button class="${a[k]===i+1?'on':''}" data-k="${k}" data-v="${i+1}"><b>${i+1}</b><small>${t}</small></button>`).join('')}</div></div>`;
  function draw(){
    const rows=[...EX.map(r=>({r,ex:true})),...(me?[{r:me,ex:false}]:[])];
    const all=rows.map(x=>x.r), n=all.length, avg=k=>(all.reduce((s,r)=>s+r[k],0)/n).toFixed(1);
    const cnt=WAY.map(w=>all.filter(r=>r[1]===w).length), mx=Math.max(...cnt);
    B.innerHTML=`<div class="sv-form">
      <div class="sv-q"><b>1. 집에서 학교까지 오는 데 걸리는 시간은 몇 분인가요?</b><div class="row"><input type="number" min="1" max="180" inputmode="numeric" id="svMin" value="${a.min}" aria-label="걸리는 시간(분)"> <span>분</span></div></div>
      <div class="sv-q"><b>2. 주로 이용하는 등교 방법은?</b><div class="sv-way">${WAY.map(w=>`<button class="${a.way===w?'on':''}" data-k="way" data-v="${w}">${w}</button>`).join('')}</div></div>
      ${lk('q3','3. 「나는 아침에 여유 있게 등교하는 편이다.」')}${lk('q4','4. 「등교 시간이 지금보다 늦춰지면 좋겠다.」')}
      <div class="row"><button class="btn sm" data-k="send">${me?'다시 제출':'제출'}</button><span class="sv-err">${err}</span></div></div>
      <div class="sv-data"><b>📊 응답이 쌓인 데이터 표</b> <span class="muted" style="font-size:.85rem">응답 ${n}개 · 한 줄이 한 사람, 한 칸이 한 속성</span>
      <div style="overflow-x:auto"><table class="sv-tbl"><tr><th>응답</th><th>걸리는 시간(분)</th><th>등교 방법</th><th>여유 있게 등교(1~5)</th><th>등교 시간 늦추기(1~5)</th></tr>
      ${rows.map((x,i)=>`<tr class="${x.ex?'':'me'}"><td>${x.ex?`예시 ${i+1}`:'나'}</td><td>${x.r[0]}</td><td>${x.r[1]}</td><td>${x.r[2]}</td><td>${x.r[3]}</td></tr>`).join('')}</table></div>
      <div class="sv-sum"><div><span>걸리는 시간 평균</span><b>${avg(0)}분</b></div><div><span>「여유 있게 등교」 평균</span><b>${avg(2)}</b></div><div><span>「등교 시간 늦추기」 평균</span><b>${avg(3)}</b></div></div>
      <div class="sv-bars">${WAY.map((w,i)=>`<div><span>${w}</span><i style="width:${mx?cnt[i]/mx*100:0}%"></i><b>${cnt[i]}</b></div>`).join('')}</div></div>
      ${me?`<div class="callout">설문지였다면 종이를 걷어 표에 다시 옮겨 적고 계산해야 했지만, <b>온라인 설문</b>은 제출하는 순간 표가 만들어지고 평균까지 다시 계산됐어요. 의견 수집과 데이터 가공이 <b>동시에</b> 이루어진 거예요.<br><b>생각해 보기</b> · 1번의 「걸리는 시간」은 내가 기억해서 적은 값이에요. 실제로 재 본 값과 같을까요? 3·4번 같은 <b>의견</b>은 물어봐야 알 수 있지만, 시간 같은 값은 <b>측정</b>하는 것이 더 정확할 수도 있어요.</div>`:''}`;
    B.querySelectorAll('[data-k="way"],[data-k="q3"],[data-k="q4"]').forEach(b=>b.onclick=()=>{ const k=b.dataset.k; a.min=$('svMin').value; a[k]=k==='way'?b.dataset.v:+b.dataset.v; err=''; draw(); });
    B.querySelector('[data-k="send"]').onclick=()=>{
      a.min=$('svMin').value; const m=Math.round(+a.min);
      if(!a.min||!(m>=1&&m<=180)){ err='1번에 1~180 사이의 분을 적어 주세요.'; draw(); return; }
      if(!a.way||!a.q3||!a.q4){ err='네 문항에 모두 답해 주세요.'; draw(); return; }
      err=''; me=[m,a.way,a.q3,a.q4]; draw(); };
  }
  draw();
})();

/* 02 수동일까, 자동일까? */
sorter('amGame',{
  cats:[{n:'✋ 수동 수집',k:'#e0702b'},{n:'⚙️ 자동 수집',k:'#2f6fd0'}],
  items:[
    {t:'꽃의 길이를 자로 직접 재어 기록한다.',short:'자로 재기',c:0,ic:'📏',w:'사람이 직접 측정하는 수동 수집이에요. 특별한 기술이나 능력이 없어도 데이터를 모을 수 있어요(62쪽).'},
    {t:'설문지를 나누어 주고, 걷은 응답을 다시 표에 옮겨 적어 가공한다.',short:'종이 설문지',c:0,ic:'📝',w:'질문하여 모으는 수동 수집이에요. 과거에는 이렇게 모은 데이터를 다시 가공해 썼어요(62쪽).'},
    {t:'온도계를 가지고 가서 매시간 기온을 측정해 적는다.',short:'온도계로 매시간',c:0,ic:'🌡️',w:'온도계도 센서지만 사람이 직접 가서 재고 적으니 수동이에요(63쪽). 핵심은 사람의 개입 없이 모이고 저장되는지예요.'},
    {t:'특정 장소에 설치한 센서가 매일 같은 시간에 기상 데이터를 전송하고, 이것이 저장된다.',short:'기상 센서',c:1,ic:'📡',w:'센서와 사물 인터넷이 결합된 자동화 장치로 모으는 예예요(63쪽).'},
    {t:'코드가 인터넷에 분산된 데이터 중 특정 목적에 부합하는 데이터를 찾아 모은다.',short:'웹 크롤링',c:1,ic:'🕸️',w:'웹 크롤링은 자동화 코드를 활용한 수집 방법이에요(63쪽).'},
    {t:'(예시) 스마트워치의 생체 센서가 심박수를 실시간으로 앱에 저장한다.',short:'스마트워치',c:1,ic:'⌚',w:'생체 센서와 사물 인터넷으로 실시간 데이터를 자동으로 모으는 예시예요.'},
    {t:'(예시) 주차장 입구 카메라가 들어오는 차량 번호와 시각을 기록해 저장한다.',short:'주차장 카메라',c:1,ic:'📷',w:'카메라 센서가 사람의 개입 없이 기록하고 저장하니 자동 수집이에요(예시).'},
  ],
  end:'센서를 썼는지가 아니라, <b>사람의 개입 없이</b> 데이터가 모이고 저장되는지가 자동과 수동을 가르는 기준이에요.'
});

/* 02 교과서 노트북의 실행 결과(2023년 「독감」 주별 검색 관심도) 그래프 */
(function(){
  const V=[74,41,24,19,14,10,10,13,10,10,9,12,13,13,17,23,18,20,25,26,24,23,14,10,10,8,8,8,9,12,11,8,9,9,9,9,13,19,22,35,51,58,69,76,54,50,64,76,100,85,57,74];
  const W=520,H=200,L=34,R=10,T=14,Bm=30, x=i=>L+i*(W-L-R)/(V.length-1), y=v=>T+(100-v)*(H-T-Bm)/100;
  let s='';
  for(const v of [0,25,50,75,100]) s+=`<line class="g" x1="${L}" y1="${y(v)}" x2="${W-R}" y2="${y(v)}"/><text class="tk" x="${L-6}" y="${y(v)+4}" text-anchor="end">${v}</text>`;
  let pm=-1; V.forEach((v,i)=>{ const d=new Date(2023,0,1+7*i), m=d.getMonth(); if(m!==pm){ pm=m; s+=`<text class="tk" x="${x(i)}" y="${H-12}" text-anchor="middle">${m+1}월</text>`; } });
  s+=`<polyline class="ln" points="${V.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ')}"/>`;
  const pk=V.indexOf(100); s+=`<circle class="pk" cx="${x(pk)}" cy="${y(100)}" r="5"/><text class="pt" x="${x(pk)-8}" y="${y(100)+4}" text-anchor="end">가장 많이 검색된 주 = 100</text>`;
  $('trendChart').innerHTML=`<svg viewBox="0 0 ${W} ${H}" class="dc-trend" role="img" aria-label="2023년 주별 독감 검색 관심도 꺾은선 그래프">${s}</svg>
    <p class="muted" style="font-size:.84rem;margin:2px 0 0">겨울이 시작되는 무렵과 연초에 검색이 많고, 여름에는 적어요. 사람들이 언제 독감을 걱정하는지 검색어 데이터로 알 수 있지요.</p>`;
})();

/* 03 공개하면 도움이 될까, 곤란할까? (모두 예시) */
sorter('openGame',{
  cats:[{n:'👍 공개하면 도움',k:'#1f9d74'},{n:'⚠️ 공개하면 곤란',k:'#d64535'}],
  items:[
    {t:'버스 정류장별 도착 예정 시각',short:'버스 도착 시각',c:0,ic:'🚌',w:'공개되면 여러 앱과 서비스가 만들어져 기다리는 시간을 줄일 수 있어요.'},
    {t:'지역별 미세먼지 측정값',short:'미세먼지 측정값',c:0,ic:'😷',w:'누구나 보고 바깥 활동을 정하거나, 원인을 분석해 대책을 세우는 데 쓸 수 있어요.'},
    {t:'무더위 쉼터와 공공 와이파이의 위치',short:'쉼터·와이파이 위치',c:0,ic:'📍',w:'필요한 사람이 쉽게 찾아 쓸 수 있어요.'},
    {t:'지역별 교통사고가 자주 일어나는 지점과 시간대',short:'교통사고 다발 지점',c:0,ic:'🚦',w:'사고가 잦은 곳을 고치는 등 사회 문제를 해결하는 데 쓸 수 있어요.'},
    {t:'환자의 이름이 적힌 진료 기록',short:'이름 있는 진료 기록',c:1,ic:'🏥',w:'한 사람을 알아볼 수 있는 민감한 정보라 공개되면 그 사람이 피해를 볼 수 있어요.'},
    {t:'개인의 실시간 위치 기록',short:'개인 위치 기록',c:1,ic:'🛰️',w:'누가 지금 어디에 있는지 드러나 안전을 위협할 수 있어요.'},
    {t:'학생 한 사람 한 사람의 이름과 성적',short:'이름과 성적',c:1,ic:'📄',w:'개인을 알아볼 수 있는 정보예요. 이름을 빼고 모아 정리한 통계라면 이야기가 달라질 수 있어요.'},
  ],
  end:'공공 데이터 공유는 <b>사회의 투명성을 높이고 사회 문제를 해결</b>하는 데 쓰여요(63쪽). 하지만 <b>한 사람을 알아볼 수 있는 정보</b>가 담긴 데이터는 공개되면 그 사람이 피해를 볼 수 있어요. 데이터를 다룰 때 지켜야 할 점은 뒤에서 더 배워요.'
});

/* 04 등교 시간 조사 방법 고르기 (풀이는 예시) */
const ARRIVE=[
  ['📏📝 관찰, 측정, 설문','교문에서 직접 기록하거나 설문으로 묻기','<b>얻기 쉬운 것</b> 교문에서 시각을 직접 기록하면(관찰·측정) 특별한 장치 없이 데이터를 모을 수 있어요. 설문으로 물으면 늦는 까닭, 통학 방법, 등교 시간에 대한 의견처럼 <b>태도·의견·동기</b>도 함께 알 수 있어요.<br><b>얻기 어려운 것</b> 사람이 매일 전교생의 시각을 적으려면 많은 시간과 노력이 들어 <b>여러 날 동안의 데이터</b>를 모으기 어려워요. 설문 답은 기억에 의존해 실제 시각과 다를 수 있어요.'],
  ['📡💻 자동화 장치와 코드','출입 기록 장치 등으로 자동 기록하기','<b>얻기 쉬운 것</b> 장치가 사람의 개입 없이 매일 같은 방식으로 기록하므로 <b>여러 날 동안 연속적인 데이터</b>를 빠르게 모을 수 있어요.<br><b>얻기 어려운 것</b> 장치를 설치해야 하고, <b>왜 늦었는지·어떻게 왔는지</b> 같은 까닭과 의견은 알 수 없어요. 장치를 거치지 않고 들어온 학생은 빠질 수도 있어요.'],
  ['🗂️ 공유 사이트','공개된 데이터에서 찾기','<b>얻기 쉬운 것</b> 대중교통 운행 정보나 지역별 통계처럼 <b>관련된 공공 데이터</b>는 짧은 시간에 구할 수 있어요.<br><b>얻기 어려운 것</b> <b>우리 학교</b> 학생 한 사람 한 사람의 등교 시각은 공개되어 있지 않을 가능성이 커요. 우리 학교만의 데이터는 직접 모아야 해요.']];
vote('arriveVote','arrivePick',ARRIVE.map(x=>[x[0],x[1]]),i=>{ $('arriveMsg').innerHTML=`<div class="callout"><b>${ARRIVE[i][0]}</b> <small class="muted">(예시 풀이)</small><br>${ARRIVE[i][2]}</div>`; });

const MEMOLIST=[['autoVsHuman','자동 수집의 좋은 점과 사람이 직접 모아야 할 때'],['openData','공공 데이터: 도움이 될 상황과 곤란한 데이터'],['arrivePick','등교 시간 조사: 내가 고른 방법'],['arriveWay','등교 시간 조사: 고른 까닭과 얻기 어려운 정보']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);
