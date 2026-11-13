/* Iris1.csv 150개 — 꽃잎 길이·꽃받침 길이(×10), 1~50 세토사, 51~100 버시컬러, 101~150 버지니카 */
const RG_PL=[14,14,13,15,14,17,14,15,14,15,15,16,14,11,12,15,13,14,17,15,17,15,10,17,19,16,16,15,14,16,16,15,15,14,15,12,13,15,13,15,13,13,13,16,19,14,16,14,15,14,47,45,49,40,46,45,47,33,46,39,35,42,40,47,36,44,45,41,45,39,48,40,49,47,43,44,48,50,45,35,38,37,39,51,45,45,47,44,41,40,44,46,40,33,42,42,42,43,30,41,60,51,59,56,58,66,45,63,58,61,51,53,55,50,51,53,55,67,69,50,57,49,67,49,57,60,48,49,56,58,61,64,56,51,56,61,56,55,48,54,56,51,51,59,57,52,50,52,54,51];
const RG_SL=[51,49,47,46,50,54,46,50,44,49,54,48,48,43,58,57,54,51,57,51,54,51,46,51,48,50,50,52,52,47,48,54,52,55,49,50,55,49,44,51,50,45,44,50,51,48,51,46,53,50,70,64,69,55,65,57,63,49,66,52,50,59,60,61,56,67,56,58,62,56,59,61,63,61,64,66,68,67,60,57,55,55,58,60,54,60,67,63,56,55,55,61,58,50,56,57,57,62,51,57,63,58,71,63,65,76,49,73,67,72,65,64,68,57,58,64,65,77,77,60,69,56,77,63,67,72,62,61,64,72,74,79,64,63,61,77,63,64,60,69,67,69,58,68,67,67,63,65,62,59];
const RG_SP=['세토사','버시컬러','버지니카'], RG_COL=['#e0702b','#2f6fd0','#9b4fc4'];
/* 노트북 실행 결과 (random_state = 7) */
const RG_W=[0.5851811,0.78889363,-0.31301472,-0.07307218,-0.36541193,0.43848411], RG_B=1.4936806502641469;

/* 01 직선을 직접 맞춰 보기 */
(function(){
  const B=$('lnGame');
  const P=RG_PL.map((x,i)=>[x/10,RG_SL[i]/10,Math.floor(i/50)]), n=P.length;
  const mx=P.reduce((s,p)=>s+p[0],0)/n, my=P.reduce((s,p)=>s+p[1],0)/n;
  let sxy=0,sxx=0,sst=0; P.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my); sxx+=(p[0]-mx)**2; sst+=(p[1]-my)**2;});
  const M=sxy/sxx, C=my-M*mx, VAR=sst/n;     // 최소제곱 직선, 분산(= 평균선의 MSE)
  const o={W:460,H:300,L:40,R:14,T:14,B:32,x0:0,x1:7.5,y0:4,y1:8.5};
  const sx=v=>o.L+(v-o.x0)/(o.x1-o.x0)*(o.W-o.L-o.R), sy=v=>o.H-o.B-(v-o.y0)/(o.y1-o.y0)*(o.H-o.T-o.B);
  const XA=1, XB=7; let yA=5.2, yB=6.0, drag=null, busy=false, best=Infinity, showErr=false;
  let g='';
  for(let v=0;v<=7;v++) g+=`<line class="gl" x1="${sx(v)}" y1="${sy(o.y0)}" x2="${sx(v)}" y2="${sy(o.y1)}"/><text class="tk" x="${sx(v)}" y="${sy(o.y0)+14}" text-anchor="middle">${v}</text>`;
  for(let v=4;v<=8;v++) g+=`<line class="gl" x1="${sx(o.x0)}" y1="${sy(v)}" x2="${sx(o.x1)}" y2="${sy(v)}"/><text class="tk" x="${sx(o.x0)-5}" y="${sy(v)+4}" text-anchor="end">${v}</text>`;
  g+=`<text class="axl" x="${sx(o.x1)}" y="${o.H-4}" text-anchor="end">꽃잎 길이 x</text><text class="axl" x="${sx(0)+4}" y="${o.T+4}">꽃받침 길이 y</text>`;
  g+=`<defs><clipPath id="lnClip"><rect x="${o.L}" y="${o.T}" width="${o.W-o.L-o.R}" height="${o.H-o.T-o.B}"/></clipPath></defs><g id="lnErrG" class="rg-errs" clip-path="url(#lnClip)"></g>`;
  P.forEach(p=>g+=`<circle class="rg-pt" cx="${sx(p[0])}" cy="${sy(p[1])}" r="3.4" style="fill:${RG_COL[p[2]]}"/>`);
  g+=`<g clip-path="url(#lnClip)"><line id="lnLine" class="rg-line"/></g><circle id="lnTA" class="rg-hit" r="22"/><circle id="lnTB" class="rg-hit" r="22"/><circle id="lnHA" class="rg-h" r="10" tabindex="0" role="slider" aria-label="직선 왼쪽 손잡이"/><circle id="lnHB" class="rg-h" r="10" tabindex="0" role="slider" aria-label="직선 오른쪽 손잡이"/>`;
  B.innerHTML=`<div class="rg-ln"><svg id="lnSvg" viewBox="0 0 460 300" role="img" aria-label="꽃잎 길이와 꽃받침 길이 산점도와 직선">${g}</svg>
    <div class="rg-side">
      <div class="rg-meter"><b>평균제곱오차 MSE</b> <span id="lnMse"></span><div class="bar"><i id="lnBar"></i></div><small>0에 가까울수록 좋아요</small></div>
      <div class="rg-meter r2"><b>R²</b> <span id="lnR2"></span><div class="bar"><i id="lnBar2"></i></div><small>1에 가까울수록 좋아요</small></div>
      <div class="rg-eq" id="lnEq"></div>
      <div class="rg-best" id="lnBest">손잡이를 움직여 MSE를 줄여 보세요.</div>
      <div class="row"><button class="btn sm ghost" id="lnErr">오차 선 보기</button><button class="btn sm ghost" id="lnMean">평균선</button><button class="btn sm" id="lnFit">최적 직선</button></div>
    </div></div>
    <div class="rg-leg">${RG_SP.map((s,i)=>`<span><i style="background:${RG_COL[i]}"></i>${s}</span>`).join('')}<span class="muted">· 점 150개 (Iris1.csv)</span></div>
    <div class="rg-msg" id="lnMsg"></div>`;
  const svg=$('lnSvg'), errG=$('lnErrG');
  const errs=P.map(p=>el('line',{x1:sx(p[0]),x2:sx(p[0]),y1:sy(p[1]),y2:sy(p[1])},errG));
  function mse(m,b){ return P.reduce((s,p)=>s+(p[1]-(m*p[0]+b))**2,0)/n; }
  function upd(user){
    const m=(yB-yA)/(XB-XA), b=yA-m*XA, e=mse(m,b), r2=1-e/VAR;
    const L=$('lnLine'); L.setAttribute('x1',sx(0)); L.setAttribute('y1',sy(b)); L.setAttribute('x2',sx(7.5)); L.setAttribute('y2',sy(m*7.5+b));
    [['lnTA',XA,yA],['lnTB',XB,yB]].forEach(([id,x,y])=>{const t=$(id); t.setAttribute('cx',sx(x)); t.setAttribute('cy',sy(y));});
    [['lnHA',XA,yA],['lnHB',XB,yB]].forEach(([id,x,y])=>{const h=$(id); h.setAttribute('cx',sx(x)); h.setAttribute('cy',sy(y)); h.setAttribute('aria-valuenow',y.toFixed(2));});
    errs.forEach((l,i)=>l.setAttribute('y2',sy(m*P[i][0]+b)));
    errG.style.display=showErr?'':'none';
    $('lnMse').textContent=e.toFixed(3); $('lnR2').textContent=r2.toFixed(3);
    $('lnBar').style.width=Math.min(100,e/1.2*100)+'%'; $('lnBar2').style.width=Math.max(0,r2)*100+'%';
    $('lnEq').innerHTML=`내 직선: y = <b>${m.toFixed(3)}</b>x ${b<0?'−':'+'} <b>${Math.abs(b).toFixed(3)}</b>`;
    if(user&&e<best){ best=e; }
    if(best<Infinity) $('lnBest').innerHTML=`내가 찾은 가장 작은 MSE: <b>${best.toFixed(3)}</b>`+(r2<0?'<br>R²가 0보다 작으면 평균선(모두 평균으로 예측)보다도 못한 직선이에요.':'');
  }
  function anim(tA,tB,done){
    busy=true; const sA=yA,sB=yB,t0=performance.now();
    const f=t=>{ const k=Math.min(1,(t-t0)/500), e=k<.5?2*k*k:1-((-2*k+2)**2)/2; yA=sA+(tA-sA)*e; yB=sB+(tB-sB)*e; upd(false); if(k<1) requestAnimationFrame(f); else { busy=false; done&&done(); } };
    requestAnimationFrame(f);
  }
  const yOf=ev=>{ const pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; const q=pt.matrixTransform(svg.getScreenCTM().inverse());
    return Math.min(o.y1,Math.max(o.y0,o.y0+(o.H-o.B-q.y)/(o.H-o.T-o.B)*(o.y1-o.y0))); };
  [['lnHA','A','lnTA'],['lnHB','B','lnTB']].forEach(([id,k,hit])=>{
    const h=$(id);
    const down=ev=>{ if(busy) return; drag=k; ev.preventDefault(); h.focus(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} };
    h.addEventListener('pointerdown',down); $(hit).addEventListener('pointerdown',down);
    h.addEventListener('keydown',ev=>{
      if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(ev.key)) return;
      ev.preventDefault(); if(busy) return;
      const d=(ev.key==='ArrowUp'||ev.key==='ArrowRight'?1:-1)*(ev.shiftKey?.2:.05);
      if(k==='A') yA=Math.min(o.y1,Math.max(o.y0,yA+d)); else yB=Math.min(o.y1,Math.max(o.y0,yB+d)); upd(true);
    });
  });
  svg.addEventListener('pointermove',ev=>{ if(!drag) return; const y=yOf(ev); if(drag==='A') yA=y; else yB=y; upd(true); });
  ['pointerup','pointercancel','pointerleave'].forEach(t=>svg.addEventListener(t,()=>{drag=null;}));
  $('lnErr').onclick=()=>{ showErr=!showErr; $('lnErr').textContent=showErr?'오차 선 가리기':'오차 선 보기'; upd(false);
    $('lnMsg').innerHTML=showErr?'세로 선 하나하나가 <b>오차</b>(실젯값 − 예측값)예요. MSE는 이 길이를 <b>제곱해서 평균</b> 낸 값이에요.':''; };
  $('lnMean').onclick=()=>{ if(busy) return; anim(my,my,()=>{ $('lnMsg').innerHTML=`모든 붓꽃을 평균 꽃받침 길이 <b>${my.toFixed(2)}</b>로 예측하는 수평선이에요. 꽃잎 길이를 전혀 쓰지 않으니 <b>R² = 0</b>, MSE는 <b>${VAR.toFixed(3)}</b>예요. 이보다 나은 직선을 찾아보세요.`; }); };
  $('lnFit').onclick=()=>{ if(busy) return; anim(M*XA+C,M*XB+C,()=>{ const e=mse(M,C);
    $('lnMsg').innerHTML=`<b>최적 직선</b> y = ${M.toFixed(3)}x + ${C.toFixed(3)} · MSE <b>${e.toFixed(3)}</b> · R² <b>${(1-e/VAR).toFixed(3)}</b><br>오차를 제곱해 더한 값이 가장 작아지도록 계산한 직선(최소제곱)이라 이보다 MSE가 작은 직선은 없어요. 선형 회귀 모델이 <span class="mono">model.fit()</span>으로 찾는 것이 바로 이런 직선이에요.${best<Infinity?` 내 기록(${best.toFixed(3)})과 ${(best-e).toFixed(3)} 차이가 나요.`:''}`; }); };
  upd(false);
})();

/* 02 셀 실행 흉내 */
(function(){
  const B=$('cellSim');
  const CELLS=[
    {t:'① 독립 변수와 종속 변수 설정, 8 : 2로 나누기',c:`X = df1[['꽃받침 너비', '꽃잎 길이', '꽃잎 너비', '종류']]  <span class="c"># 독립 변수</span>
y = df1['꽃받침 길이']  <span class="c"># 종속 변수</span>
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2,
                         shuffle = True, random_state = 7)`},
    {t:'② 선형 회귀 모델 생성과 학습',c:`from sklearn.linear_model import LinearRegression
model = LinearRegression()  <span class="c"># 선형 회귀 모델 생성</span>
model.fit(X_train, y_train)  <span class="c"># 선형 회귀 모델 학습</span>`},
    {t:'③ 원-핫 인코딩 (훈련·테스트 데이터를 나누기 전에)',c:`import pandas as pd
df1 = pd.get_dummies(df1, columns = ['종류'], dtype = int)  <span class="c"># dtype = int: 0과 1로 표시</span>
X = df1[['꽃받침 너비', '꽃잎 길이', '꽃잎 너비', '종류_버시컬러', '종류_버지니카', '종류_세토사']]
y = df1['꽃받침 길이']
print(X)`},
    {t:'①·② 다시 실행 (나누기와 학습만)',c:`X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2,
                         shuffle = True, random_state = 7)
model = LinearRegression()
model.fit(X_train, y_train)`},
  ];
  let st;
  const OK='<span class="ok">✓ 실행 완료</span> <span class="muted">(출력 없음)</span>';
  const ERR=(e,why)=>`<div class="rg-err">${e}</div><div class="rg-why">${why}</div>`;
  function reset(){ st={split:false,splitHot:false,hot:false,fit:false,imp1:false,imp2:false,out:CELLS.map(()=>'')}; draw(); }
  function run(i){
    if(i===0){ if(st.hot) st.out[0]=ERR(`KeyError: "['종류'] not in index"`,'③에서 원-핫 인코딩을 해서 「종류」 열이 이제 없어요. 그래서 ① 셀을 그대로 다시 실행하면 이런 오류가 나요. 아래 「①·② 다시 실행」 셀을 쓰세요.');
      else { st.split=true; st.splitHot=false; st.imp1=true; st.out[0]=OK; } }
    if(i===1){ st.imp2=true; if(!st.split&&!st.splitHot) st.out[1]=ERR(`NameError: name 'X_train' is not defined`,'아직 데이터를 나누지 않았어요. ①부터 실행하세요.');
      else if(!st.splitHot) st.out[1]=ERR(`ValueError: could not convert string to float: '버지니카'`,`문자열 '버지니카'를 실수(float)로 바꿀 수 없다는 뜻이에요. X에 들어 있는 <b>종류</b>가 글자(범주형 데이터)라서 선형 회귀가 계산할 수 없어요.${st.hot?' <b>③을 실행했어도</b> X_train은 원-핫 인코딩 전에 나눈 데이터라 그대로예요. 나누기부터 다시 해야 해요.':''}`);
      else { st.fit=true; st.out[1]='<pre class="rg-out sm">LinearRegression()</pre><span class="ok">✓ 학습 성공!</span>'; } }
    if(i===2){ if(st.hot) st.out[2]=ERR(`KeyError: "None of [Index(['종류'], …)] are in the [columns]"`,'이미 원-핫 인코딩을 해서 「종류」 열이 없어요. ③은 한 번만 실행해요. (처음부터 다시 하려면 「처음부터」를 누르세요.)');
      else { st.hot=true; st.out[2]=`<pre class="rg-out sm">     꽃받침 너비  꽃잎 길이  꽃잎 너비  종류_버시컬러  종류_버지니카  종류_세토사
0       3.5    1.4    0.2        0        0       1
1       3.0    1.4    0.2        0        0       1
..      ...    ...    ...      ...      ...     ...
148     3.4    5.4    2.3        0        1       0
149     3.0    5.1    1.8        0        1       0

[150 rows x 6 columns]</pre>`; } }
    if(i===3){ if(!st.imp1) st.out[3]=ERR(`NameError: name 'train_test_split' is not defined`,'train_test_split는 ① 셀에서 불러왔어요. ①을 실행하지 않았으면 이 셀도 실행할 수 없어요. ①부터 차례로 실행하세요.');
      else if(!st.imp2) st.out[3]=ERR(`NameError: name 'LinearRegression' is not defined`,'LinearRegression은 ② 셀에서 불러왔어요. ②를 한 번 실행한 뒤(오류가 나도 불러오기는 끝나요) 이 셀을 실행하세요.');
      else if(!st.hot) st.out[3]=ERR(`ValueError: could not convert string to float: '버지니카'`,'아직 원-핫 인코딩(③)을 하지 않아 X에 글자가 그대로 있어요. ③을 먼저 실행하세요.');
      else { st.splitHot=true; st.fit=true; st.out[3]='<pre class="rg-out sm">LinearRegression()</pre><span class="ok">✓ 이번에는 오류 없이 학습했어요!</span> 원-핫 인코딩한 X로 다시 나누고 학습했기 때문이에요.'; } }
    draw();
  }
  function draw(){
    B.innerHTML=CELLS.map((c,i)=>`<div class="rg-cell"><div class="rg-ct">${c.t}</div><div class="rg-cin"><button class="rg-run" data-i="${i}" aria-label="${c.t} 실행">▶</button><pre class="rg-code">${c.c}</pre></div>${st.out[i]?`<div class="rg-cout">${st.out[i]}</div>`:''}</div>`).join('')
      +`<div class="row" style="margin-top:6px"><button class="btn sm ghost" id="csReset">처음부터</button>${st.fit?'<span class="ok">모델이 학습되었어요. 03 화면에서 가중치와 성능을 확인해요.</span>':''}</div>`;
    B.querySelectorAll('.rg-run').forEach(b=>b.onclick=()=>run(+b.dataset.i));
    $('csReset').onclick=reset;
  }
  reset();
})();

/* 02 원-핫 인코딩 변환기 */
(function(){
  const B=$('ohGame');
  const R=[[1,'5.1','3.5','1.4','0.2',0],[51,'7.0','3.2','4.7','1.4',1],[101,'6.3','3.3','6.0','2.5',2],[151,'?','3.1','1.5','0.2',0]];
  const HOT=['버시컬러','버지니카','세토사'];   // get_dummies 열 순서(가나다순)
  let on=false;
  function draw(){
    const sel=r=>`<select data-r="${r[0]}" aria-label="${r[0]}번 종류">${RG_SP.map((s,i)=>`<option value="${i}" ${i===r[5]?'selected':''}>${s}</option>`).join('')}</select>`;
    const head=`<tr><th class="rg-pick">종류 바꾸기</th><th>일련번호</th><th>꽃받침 길이</th><th>꽃받침 너비</th><th>꽃잎 길이</th><th>꽃잎 너비</th>${on?HOT.map(h=>`<th class="hot">종류_${h}</th>`).join(''):'<th class="cat">종류</th>'}</tr>`;
    const rows=R.map(r=>`<tr><td class="rg-pick">${sel(r)}</td><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td>${on?HOT.map(h=>{const v=RG_SP[r[5]]===h?1:0;return `<td class="hot ${v?'one':''}">${v}</td>`;}).join(''):`<td class="cat">${RG_SP[r[5]]}</td>`}</tr>`).join('');
    B.innerHTML=`<div class="row"><button class="btn sm" id="ohRun">${on?'↩ 원래 표로':'▶ get_dummies 실행'}</button><span class="rg-cnt">X의 속성 <b>${on?6:4}개</b>: ${on?'꽃받침 너비, 꽃잎 길이, 꽃잎 너비, 종류_버시컬러, 종류_버지니카, 종류_세토사':'꽃받침 너비, 꽃잎 길이, 꽃잎 너비, 종류'}</span></div>
      <div class="rg-scroll"><table class="rg-tbl rg-oh">${head}${rows}</table></div>
      <p class="note">${on?'각 행에서 <b>자기 종류의 칸만 1</b>, 나머지는 0이에요. 이제 모든 값이 숫자라서 가중치를 곱해 더할 수 있어요.':'「종류」 열만 글자예요. 선형 회귀는 이 열을 계산할 수 없어요.'}</p>`;
    $('ohRun').onclick=()=>{on=!on; draw();};
    B.querySelectorAll('select[data-r]').forEach(s=>s.onchange=()=>{ R.find(r=>r[0]===+s.dataset.r)[5]=+s.value; draw(); });
  }
  draw();
})();

/* 03 정확도로 채점하면? */
(function(){
  const B=$('mtGame');
  const T=[[150,'버지니카',5.9,6.344],[85,'버시컬러',5.4,6.257],[41,'세토사',5.0,4.912],[42,'세토사',4.5,4.210],[53,'버시컬러',6.9,6.631]];
  const n=T.length, mean=T.reduce((s,t)=>s+t[2],0)/n;
  const sse=T.reduce((s,t)=>s+(t[2]-t[3])**2,0), sst=T.reduce((s,t)=>s+(t[2]-mean)**2,0);
  let mode='';
  function draw(){
    const col={acc:['같은가?'],mse:['오차','오차²'],r2:['오차²','(실젯값 − 평균)²']}[mode]||[];
    const cell=t=>{ const e=t[2]-t[3]; if(mode==='acc') return `<td class="ng">✗ 다름</td>`; if(mode==='mse') return `<td>${e>=0?'+':'−'}${Math.abs(e).toFixed(3)}</td><td>${(e*e).toFixed(3)}</td>`; if(mode==='r2') return `<td>${(e*e).toFixed(3)}</td><td>${((t[2]-mean)**2).toFixed(3)}</td>`; return ''; };
    let sum='';
    if(mode==='acc') sum=`정확히 같게 예측한 붓꽃 <b>0개</b> / 5개 → 정확도 <b>0</b><br><span class="muted">4.912를 5.0과 「다르다」고 하면 아주 가까운 예측도 틀린 것이 돼요. 이 채점으로는 좋은 모델과 엉터리 모델을 구별할 수 없어요.</span>`;
    if(mode==='mse') sum=`MSE = 오차² 합 ${sse.toFixed(3)} ÷ ${n} = <b>${(sse/n).toFixed(3)}</b><br><span class="muted">예측이 평균적으로 얼마나 빗나갔는지를 재요. 0에 가까울수록 좋아요. 크게 빗나간 85번(오차² ${((5.4-6.257)**2).toFixed(3)})이 MSE를 키웠어요.</span>`;
    if(mode==='r2') sum=`R² = 1 − (오차² 합 ${sse.toFixed(3)} ÷ (실젯값 − 평균)² 합 ${sst.toFixed(3)}) = <b>${(1-sse/sst).toFixed(3)}</b><br><span class="muted">평균 ${mean.toFixed(2)}로만 예측했을 때보다 오차를 얼마나 줄였는지(얼마나 설명하는지)를 비율로 나타내요. 1에 가까울수록 좋아요.</span>`;
    B.innerHTML=`<div class="row"><button class="btn sm ghost ${mode==='acc'?'on':''}" data-m="acc">정확도로 채점</button><button class="btn sm ghost ${mode==='mse'?'on':''}" data-m="mse">MSE로 채점</button><button class="btn sm ghost ${mode==='r2'?'on':''}" data-m="r2">R²로 채점</button></div>
      <div class="rg-scroll"><table class="rg-tbl"><tr><th>일련번호</th><th>종류</th><th>실젯값</th><th>예측값</th>${col.map(c=>`<th>${c}</th>`).join('')}</tr>
      ${T.map(t=>`<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2].toFixed(1)}</td><td>${t[3].toFixed(3)}</td>${cell(t)}</tr>`).join('')}</table></div>
      <div class="rg-sum">${sum||'위 버튼을 하나씩 눌러 보세요.'}</div>
      ${mode?`<div class="callout" style="margin-bottom:0">테스트 데이터 <b>30개 전체</b>로 하면: 정확히 같게 예측한 것 <b>0개</b>(정확도 0) · MSE <b>0.116</b> · R² <b>0.785</b>. (소수 첫째 자리로 반올림해서 비교해도 30개 중 3개가 같을 뿐이에요.) 분류 모델(붓꽃 k-최근접 이웃)은 「세토사냐 아니냐」처럼 답이 딱 맞거나 틀려서 정확도 0.967로 평가할 수 있었지만, 연속된 숫자를 예측하는 회귀 모델은 <b>얼마나 가까운지</b>를 재는 지표가 필요해요.</div>`:''}`;
    B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m; draw();});
  }
  draw();
})();

/* 04 예측 계산기 */
(function(){
  const B=$('pdGame');
  const F=[['꽃받침 너비',2,4.4,3.1],['꽃잎 길이',1,6.9,1.5],['꽃잎 너비',.1,2.5,.2]];
  let sp=0;   // 0 세토사, 1 버시컬러, 2 버지니카
  B.innerHTML=F.map((f,i)=>`<div class="ctrl rg-ctrl"><label>${f[0]}</label><input type="range" id="pd${i}" min="${f[1]}" max="${f[2]}" step="0.1" value="${f[3]}"><output id="pd${i}o"></output></div>`).join('')
    +`<div class="row rg-sp">종류 ${RG_SP.map((s,i)=>`<button class="btn sm ghost" data-s="${i}">${s}</button>`).join('')}<button class="btn sm ghost" id="pdBack">151번 붓꽃으로</button></div><div id="pdOut"></div>`;
  function draw(){
    const v=F.map((_,i)=>+$('pd'+i).value), hot=[sp===1?1:0,sp===2?1:0,sp===0?1:0], x=[...v,...hot];
    F.forEach((_,i)=>$('pd'+i+'o').textContent=v[i].toFixed(1));
    const names=['꽃받침 너비','꽃잎 길이','꽃잎 너비','종류_버시컬러','종류_버지니카','종류_세토사'];
    const terms=x.map((xi,i)=>RG_W[i]*xi), y=terms.reduce((a,b)=>a+b,0)+RG_B;
    $('pdOut').innerHTML=`<div class="rg-scroll"><table class="rg-tbl rg-calc"><tr><th>속성</th><th>x (입력)</th><th>가중치 w</th><th>w × x</th></tr>
      ${x.map((xi,i)=>`<tr class="${i>2?'hotrow':''}"><td>${names[i]}</td><td>${i>2?xi:xi.toFixed(1)}</td><td>${RG_W[i].toFixed(4)}</td><td>${terms[i]>=0?'':'−'}${Math.abs(terms[i]).toFixed(4)}</td></tr>`).join('')}
      <tr><td colspan="3">편향 b</td><td>${RG_B.toFixed(4)}</td></tr></table></div>
      <div class="rg-pred">예측한 꽃받침 길이 <b>${y.toFixed(3)}</b> <span class="muted">(${RG_SP[sp]}, new_X = [[${v.map(t=>t.toFixed(1)).join(', ')}, ${hot.join(', ')}]])</span></div>`;
    B.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',+b.dataset.s===sp));
  }
  F.forEach((_,i)=>$('pd'+i).oninput=draw);
  B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{sp=+b.dataset.s; draw();});
  $('pdBack').onclick=()=>{ F.forEach((f,i)=>$('pd'+i).value=f[3]); sp=0; draw(); };
  draw();
})();

chips('selfCheck','selfCheckPick',['회귀 모델을 생성하여 꽃받침의 길이를 예측할 수 있다','범주형 데이터를 원-핫 인코딩으로 바꿀 수 있다','MSE와 R²로 회귀 모델의 성능을 설명할 수 있다','회귀 모델이 특성과 결과 사이의 선형 관계를 나타내는 방법을 설명할 수 있다'],true);

const MEMOLIST=[['errWhy','could not convert string to float 오류의 까닭과 해결'],['hotWhy','원-핫 인코딩이 필요한 까닭'],['metricWhy','MSE·R²의 뜻과 정확도 대신 쓰는 까닭'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);
