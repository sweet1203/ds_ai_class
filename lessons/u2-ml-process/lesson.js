/* 01 규칙은 어디에 있을까? (59쪽 그림) */
(function(){
  const B=$('ruleGame'), T=['데이터','규칙','결괏값'];
  const ROWS=[
    {n:'전통적 프로그래밍',k:'#e0702b',ins:['데이터','규칙'],out:'결괏값',ex:'(가) 서울의 평균 기온 기록(<b>데이터</b>) + 「평균 기온이 가장 큰 값을 찾아 그 연도를 출력한다」(<b>규칙</b>) → 평균 기온이 가장 높은 해(<b>결괏값</b>). 규칙은 <b>사람이 미리 정해서 넣어요</b>.'},
    {n:'기계학습',k:'#1f9d74',ins:['데이터','결괏값'],out:'규칙',ex:'(나) 연도별 기록(<b>데이터</b>) + 그해의 실제 평균 기온(<b>결괏값</b>) → 연도에 따라 기온이 변하는 <b>규칙</b>. 기계가 찾은 이 규칙을 2050년이라는 새로운 데이터에 적용해 평균 기온을 예측해요.'}];
  let v, res;
  function reset(){ v=[[null,null,null],[null,null,null]]; res=null; draw(); }
  const lab=x=>x==null?'?':T[x];
  function draw(){
    const rows=ROWS.map((r,ri)=>{
      const s=i=>`<button class="rg-s${v[ri][i]==null?' e':''}" data-r="${ri}" data-i="${i}" aria-label="${r.n} ${i<2?'넣는 것':'얻는 것'} 빈칸">${lab(v[ri][i])}</button>`;
      const st=res?res[ri]:null;
      return `<div class="rg-row${st===true?' ok':st===false?' ng':''}" style="--k:${r.k}"><b class="rg-n">${r.n}</b>
        <div class="rg-flow"><div class="rg-in">${s(0)}${s(1)}</div><span class="rg-ar">→</span><span class="rg-pc">🖥️ 컴퓨터</span><span class="rg-ar">→</span>${s(2)}</div>
        ${st===true?`<div class="rg-fb"><span class="ok">맞아요!</span> ${r.ex}</div>`:st===false?`<div class="rg-fb"><span class="ng">다시 생각해 보세요.</span> ${ri?'기계학습에서는 기계가 무엇을 <b>찾아내는지</b> 떠올려 보세요.':'전통적 프로그래밍에서 규칙은 누가 정해 주나요?'}</div>`:''}</div>`;
    }).join('');
    const all=res&&res[0]&&res[1];
    B.innerHTML=rows+`<div class="row" style="margin-top:10px"><button class="btn sm" data-k="chk">확인하기</button><button class="btn sm ghost" data-k="reset">처음부터</button></div>`
      +(all?`<div class="callout">두 줄을 비교하면 <b>규칙이 놓인 자리</b>가 바뀌어요. 전통적 프로그래밍에서 규칙은 사람이 넣어 주는 것이고, 기계학습에서 규칙은 기계가 데이터에서 찾아내는 것이에요. 기계학습에 넣는 결괏값은 <b>정답</b>이라고도 해요. 다만 뒤에서 볼 (가) 군집처럼 정답 없이 데이터만으로 학습하는 경우도 있어요.</div>`:'');
    B.querySelectorAll('.rg-s').forEach(b=>b.onclick=()=>{ const r=+b.dataset.r,i=+b.dataset.i; v[r][i]=v[r][i]==null?0:(v[r][i]+1)%3; res=null; draw(); });
    B.querySelector('[data-k="chk"]').onclick=()=>{
      if(v.some(r=>r.some(x=>x==null))){ res=null; draw(); B.querySelector('.row').insertAdjacentHTML('afterend','<p class="rg-warn">빈칸(?)을 모두 채운 뒤 확인해요.</p>'); return; }
      res=ROWS.map((r,ri)=>{ const ins=[lab(v[ri][0]),lab(v[ri][1])].sort().join(), want=[...r.ins].sort().join(); return ins===want&&lab(v[ri][2])===r.out; });
      draw(); };
    B.querySelector('[data-k="reset"]').onclick=reset;
  }
  reset();
})();

/* 02 문제 해결 과정 순서 맞추기 (60쪽) */
const STEPS=[
  ['문제 정의','🎯',['해결하려고 하는 문제가 기계학습으로 해결할 수 있는 문제인지 전통적 프로그래밍으로 해결할 수 있는 문제인지 파악하여 목표를 설정한다.','데이터를 입력하여 기계학습을 적용하면 어떤 결과가 나올지 가설을 세우고 기계학습을 진행한다.'],'61쪽'],
  ['데이터 수집','🧺',['문제 해결에 필요한 데이터는 집을 지을 때 필요한 재료와 같아서 데이터에 따라 전처리 과정과 문제 해결 결과가 달라질 수 있음을 고려한다.','다양한 데이터 수집 방법을 활용하여 적절한 데이터를 수집한다. 이때 데이터의 양과 질을 고려한다.'],'62쪽'],
  ['데이터 전처리','🧹',['데이터를 분석하고 기계학습에 적합한 형태로 만드는 과정을 말한다.','수집된 데이터를 통계적 방법으로 분석하여 결측치나 이상치를 확인하여 처리하고 스케일링, 인코딩과 같은 작업을 수행한다.'],'66쪽'],
  ['기계학습 유형과 알고리즘 선정','🧭',['정의한 문제가 연속적인 값을 예측하는 회귀 문제인지 아니면 범주형의 값을 예측하는 분류의 문제인지에 따라 기계학습 유형과 알고리즘이 다르다.','문제에 적절한 기계학습 유형과 알고리즘을 선정한다.'],'74쪽'],
  ['모델 학습','⚙️',['선정한 알고리즘으로 모델을 초기화한다.','훈련 데이터를 학습시켜 모델을 생성한다.'],'76쪽'],
  ['성능 평가 및 수정','📏',['기계학습 결과로 만들어진 모델의 성능을 테스트 데이터로 평가하고 데이터와 속성들을 조정하여 최종 모델을 구축한다.','여러 방법으로 모델의 성능을 향상시키기 위해 이전 단계로 돌아갈 수 있다.'],'78쪽']];
(function(){
  const B=$('stepGame'); let pool,next,miss,msg;
  function reset(){ pool=shuffle(STEPS.map((_,i)=>i)); next=0; miss=0; msg='가장 먼저 할 일은 무엇일까요?'; draw(); }
  function pick(i,btn){
    if(i===next){ next++; msg=next<STEPS.length?`좋아요! <b>${STEPS[i][0]}</b> 다음에는 무엇을 할까요?`:''; draw(); }
    else { miss++; btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
      B.querySelector('.sp-msg').innerHTML=`<b>${STEPS[i][0]}</b>은(는) 아직이에요. ${next?`<b>${STEPS[next-1][0]}</b> 다음에 할 일을 생각해 보세요.`:'무엇을 풀지부터 정해야겠지요?'}`; }
  }
  function draw(){
    const done=next>=STEPS.length;
    const flow=STEPS.slice(0,next).map((s,i)=>`<li class="sp-it" style="--k:${['#9b4fc4','#d64535','#e0702b','#2f6fd0','#1f9d74','#0f2742'][i]}"><div class="sp-h"><span class="sp-n">${i+1}</span><i>${s[1]}</i><b>${s[0]}</b><small>자세히 → ${s[3]}</small></div><ul>${s[2].map(t=>`<li>${t}</li>`).join('')}</ul></li>`).join('');
    B.innerHTML=(done?'':`<div class="sp-pool">${pool.filter(i=>i>=next).map(i=>`<button class="btn sm ghost" data-i="${i}">${STEPS[i][1]} ${STEPS[i][0]}</button>`).join('')}</div><div class="sp-msg">${msg}</div>`)
      +`<ol class="sp-flow">${flow}</ol>`
      +(done?`<div class="sp-loop">↩ <b>성능 평가 및 수정</b>에서 결과가 아쉬우면 <b>이전 단계로 돌아가</b> 데이터를 더 모으거나, 전처리를 다시 하거나, 다른 알고리즘을 골라 볼 수 있어요. 그래서 이 과정은 한 번에 끝나는 줄이 아니라 되풀이되는 고리예요.</div>
        <div class="row" style="margin-top:8px"><span class="muted" style="font-size:.88rem">잘못 누른 횟수 ${miss}번</span><button class="btn sm ghost" data-k="reset">다시 맞추기</button></div>`:'');
    B.querySelectorAll('.sp-pool button').forEach(b=>b.onclick=()=>pick(+b.dataset.i,b));
    const r=B.querySelector('[data-k="reset"]'); if(r) r.onclick=reset;
  }
  reset();
})();
vote('slowVote','slowStep',STEPS.map(s=>[s[1]+' '+s[0],'']),i=>{
  $('slowMsg').innerHTML=`<div class="callout"><b>교과서 60쪽</b> — 일반적으로 기계학습 문제 해결 과정에서는 <b>데이터 전처리</b>하는 데 가장 많은 시간이 걸린다고 해요. ${i===2?'예상이 맞았어요! ':''}모은 데이터에 빈 값이나 너무 크거나 작은 값이 섞여 있으면 확인하고 처리해야 하고, 단위나 형식도 기계학습에 맞게 바꿔야 하기 때문이에요.</div>`;
});

/* 03 같은 붓꽃 데이터, 세 가지 문제 (61쪽, 데이터는 65쪽 붓꽃 데이터) */
const IRIS='5.1,3.5,1.4,0.2,0;4.9,3,1.4,0.2,0;4.7,3.2,1.3,0.2,0;4.6,3.1,1.5,0.2,0;5,3.6,1.4,0.2,0;5.4,3.9,1.7,0.4,0;4.6,3.4,1.4,0.3,0;5,3.4,1.5,0.2,0;4.4,2.9,1.4,0.2,0;4.9,3.1,1.5,0.1,0;5.4,3.7,1.5,0.2,0;4.8,3.4,1.6,0.2,0;4.8,3,1.4,0.1,0;4.3,3,1.1,0.1,0;5.8,4,1.2,0.2,0;5.7,4.4,1.5,0.4,0;5.4,3.9,1.3,0.4,0;5.1,3.5,1.4,0.3,0;5.7,3.8,1.7,0.3,0;5.1,3.8,1.5,0.3,0;5.4,3.4,1.7,0.2,0;5.1,3.7,1.5,0.4,0;4.6,3.6,1,0.2,0;5.1,3.3,1.7,0.5,0;4.8,3.4,1.9,0.2,0;5,3,1.6,0.2,0;5,3.4,1.6,0.4,0;5.2,3.5,1.5,0.2,0;5.2,3.4,1.4,0.2,0;4.7,3.2,1.6,0.2,0;4.8,3.1,1.6,0.2,0;5.4,3.4,1.5,0.4,0;5.2,4.1,1.5,0.1,0;5.5,4.2,1.4,0.2,0;4.9,3.1,1.5,0.1,0;5,3.2,1.2,0.2,0;5.5,3.5,1.3,0.2,0;4.9,3.1,1.5,0.1,0;4.4,3,1.3,0.2,0;5.1,3.4,1.5,0.2,0;5,3.5,1.3,0.3,0;4.5,2.3,1.3,0.3,0;4.4,3.2,1.3,0.2,0;5,3.5,1.6,0.6,0;5.1,3.8,1.9,0.4,0;4.8,3,1.4,0.3,0;5.1,3.8,1.6,0.2,0;4.6,3.2,1.4,0.2,0;5.3,3.7,1.5,0.2,0;5,3.3,1.4,0.2,0;7,3.2,4.7,1.4,1;6.4,3.2,4.5,1.5,1;6.9,3.1,4.9,1.5,1;5.5,2.3,4,1.3,1;6.5,2.8,4.6,1.5,1;5.7,2.8,4.5,1.3,1;6.3,3.3,4.7,1.6,1;4.9,2.4,3.3,1,1;6.6,2.9,4.6,1.3,1;5.2,2.7,3.9,1.4,1;5,2,3.5,1,1;5.9,3,4.2,1.5,1;6,2.2,4,1,1;6.1,2.9,4.7,1.4,1;5.6,2.9,3.6,1.3,1;6.7,3.1,4.4,1.4,1;5.6,3,4.5,1.5,1;5.8,2.7,4.1,1,1;6.2,2.2,4.5,1.5,1;5.6,2.5,3.9,1.1,1;5.9,3.2,4.8,1.8,1;6.1,2.8,4,1.3,1;6.3,2.5,4.9,1.5,1;6.1,2.8,4.7,1.2,1;6.4,2.9,4.3,1.3,1;6.6,3,4.4,1.4,1;6.8,2.8,4.8,1.4,1;6.7,3,5,1.7,1;6,2.9,4.5,1.5,1;5.7,2.6,3.5,1,1;5.5,2.4,3.8,1.1,1;5.5,2.4,3.7,1,1;5.8,2.7,3.9,1.2,1;6,2.7,5.1,1.6,1;5.4,3,4.5,1.5,1;6,3.4,4.5,1.6,1;6.7,3.1,4.7,1.5,1;6.3,2.3,4.4,1.3,1;5.6,3,4.1,1.3,1;5.5,2.5,4,1.3,1;5.5,2.6,4.4,1.2,1;6.1,3,4.6,1.4,1;5.8,2.6,4,1.2,1;5,2.3,3.3,1,1;5.6,2.7,4.2,1.3,1;5.7,3,4.2,1.2,1;5.7,2.9,4.2,1.3,1;6.2,2.9,4.3,1.3,1;5.1,2.5,3,1.1,1;5.7,2.8,4.1,1.3,1;6.3,3.3,6,2.5,2;5.8,2.7,5.1,1.9,2;7.1,3,5.9,2.1,2;6.3,2.9,5.6,1.8,2;6.5,3,5.8,2.2,2;7.6,3,6.6,2.1,2;4.9,2.5,4.5,1.7,2;7.3,2.9,6.3,1.8,2;6.7,2.5,5.8,1.8,2;7.2,3.6,6.1,2.5,2;6.5,3.2,5.1,2,2;6.4,2.7,5.3,1.9,2;6.8,3,5.5,2.1,2;5.7,2.5,5,2,2;5.8,2.8,5.1,2.4,2;6.4,3.2,5.3,2.3,2;6.5,3,5.5,1.8,2;7.7,3.8,6.7,2.2,2;7.7,2.6,6.9,2.3,2;6,2.2,5,1.5,2;6.9,3.2,5.7,2.3,2;5.6,2.8,4.9,2,2;7.7,2.8,6.7,2,2;6.3,2.7,4.9,1.8,2;6.7,3.3,5.7,2.1,2;7.2,3.2,6,1.8,2;6.2,2.8,4.8,1.8,2;6.1,3,4.9,1.8,2;6.4,2.8,5.6,2.1,2;7.2,3,5.8,1.6,2;7.4,2.8,6.1,1.9,2;7.9,3.8,6.4,2,2;6.4,2.8,5.6,2.2,2;6.3,2.8,5.1,1.5,2;6.1,2.6,5.6,1.4,2;7.7,3,6.1,2.3,2;6.3,3.4,5.6,2.4,2;6.4,3.1,5.5,1.8,2;6,3,4.8,1.8,2;6.9,3.1,5.4,2.1,2;6.7,3.1,5.6,2.4,2;6.9,3.1,5.1,2.3,2;5.8,2.7,5.1,1.9,2;6.8,3.2,5.9,2.3,2;6.7,3.3,5.7,2.5,2;6.7,3,5.2,2.3,2;6.3,2.5,5,1.9,2;6.5,3,5.2,2,2;6.2,3.4,5.4,2.3,2;5.9,3,5.1,1.8,2'.split(';').map(r=>r.split(',').map(Number));
(function(){
  const B=$('irisGame'), SP=['세토사','버시컬러','버지니카'], SC=['#d64535','#2f6fd0','#1f9d74'], GC=['#8a4fc4','#c08a00','#5b6b7f'];
  const ATT=['꽃받침 길이','꽃받침 너비','꽃잎 길이','꽃잎 너비'], SAMPLE=[0,1,50,51,100,101];
  const P={
    가:{q:'꽃잎 길이, 꽃잎 너비, 꽃받침 길이, 꽃받침 너비를 알면 서로 다른 꽃을 구분할 수 있을까?',a:0,why:'정확한 종류는 몰라도 서로 다른 종류인지 아닌지 구분하는 <b>군집</b>의 문제예요. 표에서 종류 칸을 쓰지 않았지요?'},
    나:{q:'꽃의 종류별로 모든 속성값을 알고 있을 때, 새로운 꽃의 속성으로 꽃의 종류를 알 수 있을까?',a:1,why:'정답(종류)을 알고 있는 상태에서 학습하고 종류를 구분하므로 <b>분류</b>의 문제예요.',nw:[6.0,2.9,4.5,1.5,null]},
    다:{q:'꽃의 종류별로 모든 속성값을 알고 있을 때, 새로운 꽃의 모르는 수치형 속성값을 구할 수 있을까?',a:2,why:'모르는 속성(꽃잎 너비)의 정확한 수치를 예측하는 <b>회귀</b>의 문제예요.',nw:[6.5,3.0,5.5,null,2]}};
  const TY=['군집','분류','회귀'];
  let cur='가', ans={}, ran={};
  const d2=(a,b)=>a.slice(0,4).reduce((s,x,i)=>s+(x-b[i])**2,0);
  function kmeans(){ // 네 속성으로 세 무리 묶기, 시작점은 꽃잎 길이가 가장 짧은·가운데·가장 긴 꽃
    const idx=IRIS.map((r,i)=>i).sort((x,y)=>IRIS[x][2]-IRIS[y][2]);
    let C=[idx[0],idx[75],idx[149]].map(i=>IRIS[i].slice(0,4)), g=[];
    for(let t=0;t<30;t++){ g=IRIS.map(r=>{let b=0; C.forEach((c,j)=>{if(d2(r,c)<d2(r,C[b])) b=j;}); return b;});
      C=C.map((c,j)=>{const m=IRIS.filter((r,i)=>g[i]===j); return m.length?[0,1,2,3].map(k=>m.reduce((s,r)=>s+r[k],0)/m.length):c;}); }
    return g; }
  function knn(x,k){ return IRIS.map((r,i)=>[d2(r,x),i]).sort((a,b)=>a[0]-b[0]).slice(0,k).map(a=>a[1]); }
  function fit(){ const n=IRIS.length, mx=IRIS.reduce((s,r)=>s+r[2],0)/n, my=IRIS.reduce((s,r)=>s+r[3],0)/n;
    const b=IRIS.reduce((s,r)=>s+(r[2]-mx)*(r[3]-my),0)/IRIS.reduce((s,r)=>s+(r[2]-mx)**2,0); return [b,my-b*mx]; }
  const X=v=>40+(v-1)/6*300, Y=v=>200-v/2.6*180;
  function scatter(){
    const p=P[cur], r=ran[cur]; let s='', note='';
    for(let v=1;v<=7;v++) s+=`<line class="gx" x1="${X(v)}" y1="20" x2="${X(v)}" y2="200"/><text class="tk" x="${X(v)}" y="214">${v}</text>`;
    for(let v=0;v<=2.5;v+=.5) s+=`<line class="gx" x1="40" y1="${Y(v)}" x2="340" y2="${Y(v)}"/><text class="tk" x="34" y="${Y(v)+4}" text-anchor="end">${v}</text>`;
    s+=`<text class="ax" x="190" y="232">꽃잎 길이</text><text class="ax" transform="translate(12 110) rotate(-90)">꽃잎 너비</text>`;
    let col=i=>cur==='가'?'#b9c0ca':SC[IRIS[i][4]], ring=new Set();
    if(cur==='가'&&r){ const g=kmeans(); col=i=>GC[g[i]];
      let same=0; [0,1,2].forEach(j=>{const c=[0,0,0]; g.forEach((x,i)=>{if(x===j) c[IRIS[i][4]]++;}); same+=Math.max(...c);});
      note=`기계가 네 속성이 비슷한 꽃끼리 <b>세 무리</b>로 묶었어요(보라·노랑·회색). 기계는 무리의 이름은 몰라요. 실제 종류와 맞춰 보면 150송이 중 <b>${same}송이</b>가 같은 종류끼리 모였어요.`; }
    if(cur==='나'&&r){ const nb=knn(p.nw,5); nb.forEach(i=>ring.add(i)); const c=[0,0,0]; nb.forEach(i=>c[IRIS[i][4]]++); const best=c.indexOf(Math.max(...c));
      note=`새로운 꽃과 네 속성값이 가장 가까운 꽃 5송이를 찾았어요: ${c.map((n,j)=>n?`${SP[j]} ${n}송이`:'').filter(Boolean).join(', ')}. 그래서 새로운 꽃을 <b>${SP[best]}</b>로 분류해요.`; }
    IRIS.forEach((q,i)=>{ s+=`<circle class="dt" cx="${X(q[2]).toFixed(1)}" cy="${Y(q[3]).toFixed(1)}" r="3.4" fill="${col(i)}"/>`; if(ring.has(i)) s+=`<circle class="rg" cx="${X(q[2]).toFixed(1)}" cy="${Y(q[3]).toFixed(1)}" r="8"/>`; });
    if(cur==='나') s+=`<text class="star" x="${X(4.5)}" y="${Y(1.5)+6}">★</text>`;
    if(cur==='다'){ const [b,a]=fit(), py=b*5.5+a;
      s+=`<line class="qline" x1="${X(5.5)}" y1="20" x2="${X(5.5)}" y2="200"/><text class="qt" x="${X(5.5)+6}" y="32">꽃잎 길이 5.5인 새로운 꽃 · 꽃잎 너비 ?</text>`;
      if(r){ s+=`<line class="fit" x1="${X(1)}" y1="${Y(b+a)}" x2="${X(7)}" y2="${Y(b*7+a)}"/><text class="star" x="${X(5.5)}" y="${Y(py)+6}">★</text>`;
        note=`150송이의 꽃잎 길이와 꽃잎 너비 사이의 관계를 <b>직선</b>으로 학습했어요. 이 직선에 꽃잎 길이 5.5를 넣으면 꽃잎 너비는 <b>약 ${py.toFixed(1)}</b>로 예측돼요.`; } }
    const leg=cur==='가'&&!r?'<span><i style="background:#b9c0ca"></i>종류 정보 없이 쓰는 꽃</span>':cur==='가'?GC.map((c,j)=>`<span><i style="background:${c}"></i>무리 ${j+1}</span>`).join(''):SP.map((n,j)=>`<span><i style="background:${SC[j]}"></i>${n}</span>`).join('')+(cur!=='다'||r?'<span>★ 새로운 꽃</span>':'');
    return `<div class="ir-plot"><svg viewBox="0 0 350 240" role="img" aria-label="붓꽃 150송이의 꽃잎 길이와 꽃잎 너비 산점도">${s}</svg><div class="ir-leg">${leg}</div></div>`
      +`<div class="ir-note">${note||'<span class="muted">「기계에게 맡겨 보기」를 누르면 결과가 나타나요.</span>'}</div>`;
  }
  function table(){
    const p=P[cur];
    const head=`<tr><th>번호</th>${ATT.map(a=>`<th>${a}</th>`).join('')}<th>${cur==='가'?'종류 <small>(쓰지 않음)</small>':'종류'}</th></tr>`;
    const row=(no,r)=>`<tr><td>${no}</td>${[0,1,2,3].map(k=>r[k]==null?'<td class="u"><span class="mp-q">?</span></td>':`<td class="k">${r[k]}</td>`).join('')}${cur==='가'?'<td class="x">–</td>':r[4]==null?'<td class="u"><span class="mp-q">?</span></td>':`<td class="k">${SP[r[4]]}</td>`}</tr>`;
    let h=SAMPLE.map(i=>row(i+1,IRIS[i])).join('')+`<tr class="mp-dot"><td colspan="6">⋮ (모두 150송이)</td></tr>`;
    if(p.nw) h+=row('새로운 꽃<small>예시</small>',p.nw).replace('<tr>','<tr class="nw">');
    return `<div style="overflow-x:auto"><table class="mp-tbl ir-tbl">${head}${h}</table></div>`;
  }
  function draw(){
    const p=P[cur], a=ans[cur];
    B.innerHTML=`<div class="ir-tabs">${Object.keys(P).map(k=>`<button data-p="${k}" class="${k===cur?'on':''}">(${k})${ans[k]!=null?(ans[k]===P[k].a?' ✓':' ✗'):''}</button>`).join('')}</div>
      <div class="ir-q"><b>(${cur})</b> ${p.q}</div>${table()}
      <div class="ir-ask"><span>이 문제는 어떤 기계학습 유형일까요?</span><div class="row">${TY.map((t,j)=>`<button class="btn sm${a==null?' ghost':a===j||p.a===j?'':' ghost'}" data-t="${j}" ${a!=null?'disabled':''}>${t}</button>`).join('')}</div>
      ${a!=null?`<div class="ir-fb">${a===p.a?'<span class="ok">맞아요!</span>':`<span class="ng">아쉬워요.</span> 정답은 <b>${TY[p.a]}</b>.`} ${p.why}</div>`:''}</div>
      <div class="row" style="margin:10px 0 6px"><button class="btn sm" data-k="run">🤖 기계에게 맡겨 보기</button>${ran[cur]?'<button class="btn sm ghost" data-k="undo">되돌리기</button>':''}</div>${scatter()}
      <p class="muted" style="font-size:.82rem;margin:6px 0 0">묶기 · 가까운 꽃 찾기 · 직선 긋기는 기계가 규칙을 찾는 방법의 예예요. 어떻게 계산하는지는 기계학습 유형과 알고리즘에서 배워요.</p>`;
    B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{cur=b.dataset.p; draw();});
    B.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ans[cur]=+b.dataset.t; draw();});
    B.querySelector('[data-k="run"]').onclick=()=>{ran[cur]=true; draw();};
    const u=B.querySelector('[data-k="undo"]'); if(u) u.onclick=()=>{ran[cur]=false; draw();};
  }
  draw();
})();

/* 04 스스로 해결하기 판별표 (61쪽, 이유는 교사용 예시 답안 — 더 알아보기) */
(function(){
  const B=$('judgeGame'), M=['기계학습','전통적 프로그래밍'];
  const R=[
    {q:'우리 반 정보 과목 평균은 몇 점일까?',a:1,ex:1,r:'모든 학생의 점수를 더하여 학생 수로 나누는 규칙을 적용하면 돼요.'},
    {q:'진단한 환자에게 필요한 약은 무엇일까?',a:0,r:'이전에 진단한 환자에게 사용한 약의 효능을 바탕으로 새로운 환자에게 필요한 약을 추천하는 것이므로, 패턴을 학습하여 학습된 규칙으로부터 결과를 도출해요. 기계학습에서 <b>분류</b> 문제예요. <span class="muted">(처방 기준이 이미 정해져 있다고 보면 전통적 프로그래밍이라고 생각할 수도 있어요. 내가 고른 이유를 말해 보세요.)</span>'},
    {q:'가장 많은 물건이 유통되는 물류 센터는 어디일까?',a:1,r:'유통되는 물건의 수 중에서 가장 큰 수를 찾는 문제이므로 <b>최댓값</b>을 찾는 전통적 프로그래밍으로 해결할 수 있어요. (가) 평균 기온이 가장 높은 해와 같은 모양이지요.'},
    {q:'최단 거리의 물류 센터는 어디에 추가할 수 있을까?',a:0,r:'현재 있는 물류 센터를 거리를 바탕으로 <b>군집화</b>하여 최단 거리의 물류 센터를 추가할 수 있으므로 기계학습으로 해결할 수 있어요.'}];
  const pick={};
  function draw(){
    const n=R.filter((x,i)=>!x.ex&&pick[i]!=null).length, ok=R.filter((x,i)=>!x.ex&&pick[i]===x.a).length;
    B.innerHTML=R.map((x,i)=>{ const p=x.ex?x.a:pick[i];
      return `<div class="jg-q${x.ex?' ex':''}"><div class="jg-t">${x.ex?'<span class="tagt">예</span> ':''}${x.q}</div>
        <div class="row">${M.map((m,j)=>`<button class="btn sm${p===j?'':' ghost'}${p!=null&&!x.ex&&j===x.a?' right':''}" data-i="${i}" data-j="${j}" ${x.ex||p!=null?'disabled':''}>${p===j?'✔ ':''}${m}</button>`).join('')}</div>
        ${p!=null?`<div class="jg-r">${x.ex?'<b>이유</b> ':p===x.a?'<span class="ok">예시 답안과 같아요.</span> ':`<span class="ng">예시 답안은 ${M[x.a]}예요.</span> `}${x.r}</div>`:''}</div>`; }).join('')
      +(n===3?`<div class="row" style="margin-top:8px"><span class="muted" style="font-size:.9rem">예시 답안과 같은 것 ${ok} / 3</span><button class="btn sm ghost" data-k="reset">다시 고르기</button></div>`:'');
    B.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{pick[+b.dataset.i]=+b.dataset.j; draw();});
    const r=B.querySelector('[data-k="reset"]'); if(r) r.onclick=()=>{for(const k in pick) delete pick[k]; draw();};
  }
  draw();
})();

/* 04 빈칸 확인 · 스스로 점검 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['기계학습으로 해결할 수 있는 문제를 구분할 수 있다','기계학습 문제 해결 과정을 설명할 수 있다','기계학습을 적용할 문제를 정의할 수 있다','같은 데이터로 군집·분류·회귀 문제를 구별할 수 있다'],true);

const MEMOLIST=[['recoWhy','취향에 꼭 맞는 추천이 가능하게 된 까닭'],['slowStep','가장 시간이 많이 걸릴 것 같은 단계(내 예상)'],['myProblem','기계학습으로 풀고 싶은 문제 정의하기'],['tradML','전통적 프로그래밍과 기계학습의 차이(사례)'],['myWords','새롭게 이해한 개념을 내 말로'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);
