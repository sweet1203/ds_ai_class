/* 교과서 붓꽃 데이터 df3(결측치·이상치 처리 후 147송이)의 꽃잎 길이·너비·종류(0 세토사, 1 버시컬러, 2 버지니카)
   splits: 훈련 비율별 train_test_split(random_state=7) 테스트 행 번호와 사이킷런 KNeighborsClassifier 결과(미리 계산)
   tr 훈련 정확도 · te 테스트 정확도 · lk 테스트 데이터까지 학습한 모델의 테스트 정확도 · cm 3×3 혼동행렬 · kacc 그림 Ⅱ-6 */
const DF3={"rows":[[1.4,0.2,0],[1.4,0.2,0],[1.3,0.2,0],[1.4,0.2,0],[1.5,0.2,0],[1.4,0.2,0],[1.5,0.1,0],[1.6,0.2,0],[1.4,0.1,0],[1.5,0.4,0],[1.3,0.4,0],[1.4,0.3,0],[1.5,0.3,0],[1.5,0.4,0],[1.6,0.2,0],[1.6,0.4,0],[1.5,0.2,0],[1.4,0.2,0],[1.6,0.2,0],[1.6,0.2,0],[1.5,0.4,0],[1.5,0.1,0],[1.4,0.2,0],[1.5,0.1,0],[1.3,0.2,0],[1.5,0.1,0],[1.3,0.2,0],[1.5,0.2,0],[1.3,0.3,0],[1.3,0.3,0],[1.3,0.2,0],[1.4,0.3,0],[1.6,0.2,0],[1.4,0.2,0],[1.5,0.2,0],[1.4,0.2,0],[4.7,1.4,1],[4.5,1.5,1],[4.9,1.5,1],[4.0,1.3,1],[4.6,1.5,1],[4.5,1.3,1],[4.7,1.6,1],[3.3,1.0,1],[4.6,1.3,1],[3.9,1.4,1],[3.5,1.0,1],[4.2,1.5,1],[4.0,1.0,1],[4.7,1.4,1],[3.6,1.3,1],[4.4,1.4,1],[4.5,1.5,1],[4.1,1.0,1],[4.5,1.5,1],[3.9,1.1,1],[4.8,1.8,1],[4.0,1.3,1],[4.9,1.5,1],[4.7,1.2,1],[4.3,1.3,1],[4.4,1.4,1],[4.8,1.4,1],[5.0,1.7,1],[4.5,1.5,1],[3.5,1.0,1],[3.8,1.1,1],[3.7,1.0,1],[3.9,1.2,1],[5.1,1.6,1],[4.5,1.5,1],[4.5,1.6,1],[4.7,1.5,1],[4.4,1.3,1],[4.1,1.3,1],[4.0,1.3,1],[4.4,1.2,1],[4.6,1.4,1],[4.0,1.2,1],[3.3,1.0,1],[4.2,1.3,1],[4.2,1.2,1],[4.2,1.3,1],[4.3,1.3,1],[4.1,1.3,1],[6.0,2.5,2],[5.1,1.9,2],[5.9,2.1,2],[5.6,1.8,2],[5.8,2.2,2],[6.6,2.1,2],[6.3,1.8,2],[5.8,1.8,2],[6.1,2.5,2],[5.1,2.0,2],[5.3,1.9,2],[5.5,2.1,2],[5.0,2.0,2],[5.1,2.4,2],[5.3,2.3,2],[5.5,1.8,2],[6.7,2.2,2],[6.9,2.3,2],[5.0,1.5,2],[5.7,2.3,2],[4.9,2.0,2],[6.7,2.0,2],[4.9,1.8,2],[5.7,2.1,2],[6.0,1.8,2],[4.8,1.8,2],[4.9,1.8,2],[5.6,2.1,2],[5.8,1.6,2],[6.1,1.9,2],[6.4,2.0,2],[5.6,2.2,2],[5.1,1.5,2],[5.6,1.4,2],[6.1,2.3,2],[5.6,2.4,2],[5.5,1.8,2],[4.8,1.8,2],[5.4,2.1,2],[5.6,2.4,2],[5.1,2.3,2],[5.1,1.9,2],[5.9,2.3,2],[5.7,2.5,2],[5.2,2.3,2],[5.0,1.9,2],[5.2,2.0,2],[5.4,2.3,2],[5.1,1.8,2],[1.4,0.2,0],[1.5,0.2,0],[1.5,0.2,0],[4.4,1.4,1],[4.5,1.5,1],[3.8,1.2,1],[3.6,1.0,1],[4.6,1.7,1],[5.0,2.0,2],[6.5,2.4,2],[6.3,2.3,2],[5.2,2.0,2],[4.6,1.5,2]],"splits":{"90":{"test":[11,32,37,41,70,76,98,104,106,107,118,124,132,135,146],"n":[132,15],"res":{"1":{"tr":0.985,"te":0.933,"lk":0.933,"cm":[[3,0,0],[0,4,0],[0,1,7]]},"3":{"tr":0.985,"te":0.933,"lk":0.933,"cm":[[3,0,0],[0,4,0],[0,1,7]]},"5":{"tr":0.962,"te":0.933,"lk":0.933,"cm":[[3,0,0],[0,4,0],[0,1,7]]},"7":{"tr":0.97,"te":0.933,"lk":0.933,"cm":[[3,0,0],[0,4,0],[0,1,7]]}}},"80":{"test":[11,22,32,36,37,40,41,45,49,51,65,66,70,76,77,82,95,98,104,106,107,109,115,118,124,132,134,135,137,146],"n":[117,30],"res":{"1":{"tr":0.991,"te":0.967,"lk":0.967,"cm":[[5,0,0],[0,14,0],[0,1,10]]},"3":{"tr":0.983,"te":0.967,"lk":0.967,"cm":[[5,0,0],[0,14,0],[0,1,10]]},"5":{"tr":0.957,"te":0.967,"lk":0.967,"cm":[[5,0,0],[0,14,0],[0,1,10]]},"7":{"tr":0.966,"te":0.967,"lk":0.967,"cm":[[5,0,0],[0,14,0],[0,1,10]]}}},"70":{"test":[5,11,17,22,28,32,36,37,40,41,45,49,51,52,62,65,66,70,74,76,77,81,82,85,91,95,98,100,104,106,107,109,114,115,117,118,123,124,130,132,133,134,135,137,146],"n":[102,45],"res":{"1":{"tr":0.99,"te":0.978,"lk":0.978,"cm":[[8,0,0],[0,18,0],[0,1,18]]},"3":{"tr":0.98,"te":0.956,"lk":0.978,"cm":[[8,0,0],[0,18,0],[0,2,17]]},"5":{"tr":0.98,"te":0.956,"lk":0.956,"cm":[[8,0,0],[0,18,0],[0,2,17]]},"7":{"tr":0.98,"te":0.956,"lk":0.956,"cm":[[8,0,0],[0,18,0],[0,2,17]]}}},"60":{"test":[3,5,8,11,13,17,22,26,28,29,32,36,37,39,40,41,43,45,46,49,51,52,54,62,65,66,70,74,76,77,80,81,82,84,85,90,91,95,97,98,100,104,106,107,109,114,115,117,118,123,124,126,130,132,133,134,135,137,146],"n":[88,59],"res":{"1":{"tr":0.989,"te":0.983,"lk":0.983,"cm":[[13,0,0],[0,24,0],[0,1,21]]},"3":{"tr":0.977,"te":0.966,"lk":0.983,"cm":[[13,0,0],[0,24,0],[0,2,20]]},"5":{"tr":0.966,"te":0.966,"lk":0.966,"cm":[[13,0,0],[0,24,0],[0,2,20]]},"7":{"tr":0.977,"te":0.966,"lk":0.966,"cm":[[13,0,0],[0,24,0],[0,2,20]]}}},"50":{"test":[3,5,8,11,12,13,14,15,17,20,22,26,28,29,32,36,37,39,40,41,43,45,46,47,49,51,52,54,58,59,60,62,65,66,70,74,76,77,79,80,81,82,84,85,88,90,91,95,97,98,100,102,104,105,106,107,109,111,114,115,117,118,121,122,123,124,126,130,132,133,134,135,137,146],"n":[73,74],"res":{"1":{"tr":0.986,"te":0.986,"lk":0.973,"cm":[[17,0,0],[0,29,0],[0,1,27]]},"3":{"tr":0.973,"te":0.932,"lk":0.986,"cm":[[17,0,0],[0,29,0],[0,5,23]]},"5":{"tr":0.973,"te":0.959,"lk":0.973,"cm":[[17,0,0],[0,29,0],[0,3,25]]},"7":{"tr":0.973,"te":0.959,"lk":0.973,"cm":[[17,0,0],[0,29,0],[0,3,25]]}}}},"kacc":[0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967,0.967]};
const TE_NAME=['세토사','버시컬러','버지니카'], TE_COL=['#2f7fd0','#d64535','#3f9d3a'];
function teRand(seed){ let a=seed>>>0; return ()=>{a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296;}; }
function teGauss(r){ let u=0,v=0; while(!u) u=r(); while(!v) v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function teKnn(train,q,k){ const d=train.map((p,i)=>({i,d:Math.hypot(p[0]-q[0],p[1]-q[1])})).sort((a,b)=>a.d-b.d||a.i-b.i).slice(0,k); const v=[0,0]; d.forEach(o=>v[train[o.i][2]]++); return v[1]>v[0]?1:0; }
const teAcc=(tr,te,k)=>te.filter(p=>teKnn(tr,p,k)===p[2]).length/te.length;
const f2=x=>x.toFixed(2), f3=x=>x.toFixed(3);
/* 정확도·정밀도·재현율·F1-점수 (분모가 0이면 null) */
function teMetrics(tp,fn,fp,tn){ const n=tp+fn+fp+tn, P=tp+fp?tp/(tp+fp):null, R=tp+fn?tp/(tp+fn):null;
  return {n,acc:n?(tp+tn)/n:null,P,R,F:(P!=null&&R!=null&&P+R>0)?2*P*R/(P+R):null}; }
function teMetricHTML(tp,fn,fp,tn){ const m=teMetrics(tp,fn,fp,tn), v=x=>x==null?'<i>계산할 수 없음(분모 0)</i>':`<b>${f2(x)}</b>`;
  return `<div class="te-mx">
    <div><span>정확도</span><em>(${tp}+${tn}) / ${m.n}</em>${v(m.acc)}</div>
    <div><span>정밀도</span><em>${tp} / (${tp}+${fp})</em>${v(m.P)}</div>
    <div><span>재현율</span><em>${tp} / (${tp}+${fn})</em>${v(m.R)}</div>
    <div><span>F1-점수</span><em>2×정밀도×재현율 / (정밀도+재현율)</em>${v(m.F)}</div></div>`; }

/* 01 비율 바꿔 나누기 (붓꽃, k=5, 사이킷런 결과) */
(function(){
  const B=$('splitGame'); let pct='80';
  const X=x=>36+(x-0.8)/6.4*400, Y=y=>200-(y-0)/2.6*186;
  const jit=DF3.rows.map((_,i)=>{ const r=teRand(i+1); return [(r()-.5)*0.09,(r()-.5)*0.05]; });  /* 겹친 점을 보이게 살짝 흩어 그림 */
  B.innerHTML=`<div class="tl" id="spBtns">${['50','60','70','80','90'].map(p=>`<button data-p="${p}">훈련 ${p}%${p==='80'?' (교과서)':''}</button>`).join('')}</div>
    <div class="te-sp"><svg viewBox="0 0 450 226" id="spSvg" role="img" aria-label="꽃잎 길이와 꽃잎 너비 산점도"></svg><div id="spStat"></div></div>`;
  function draw(){
    const S=DF3.splits[pct], te=new Set(S.test), R=S.res[5];
    B.querySelectorAll('#spBtns button').forEach(b=>b.classList.toggle('on',b.dataset.p===pct));
    let s=`<line class="ax" x1="36" y1="200" x2="440" y2="200"/><line class="ax" x1="36" y1="10" x2="36" y2="200"/>`;
    [1,2,3,4,5,6,7].forEach(x=>s+=`<text class="tk" x="${X(x)}" y="214">${x}</text>`); [0.5,1,1.5,2,2.5].forEach(y=>s+=`<text class="tk" x="30" y="${Y(y)+4}" text-anchor="end">${y}</text>`);
    s+=`<text class="al" x="440" y="225" text-anchor="end">꽃잎 길이</text><text class="al" x="40" y="10">꽃잎 너비</text>`;
    DF3.rows.forEach((p,i)=>{ const x=X(p[0]+jit[i][0]), y=Y(p[1]+jit[i][1]), c=TE_COL[p[2]];
      s+=te.has(i)?`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" fill="#fff" stroke="${c}" stroke-width="2.2"/>`:`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="${c}" opacity=".7"/>`; });
    s+=`<g class="te-lg" transform="translate(44 18)">${TE_NAME.map((n,c)=>`<circle cx="6" cy="${c*15}" r="4" fill="${TE_COL[c]}"/><text x="14" y="${c*15+4}">${n}</text>`).join('')}<circle cx="6" cy="48" r="4" fill="#fff" stroke="#5b6776" stroke-width="2"/><text x="14" y="52">테스트 데이터</text></g>`;
    $('spSvg').innerHTML=s;
    $('spStat').innerHTML=`<div class="te-bar"><i class="tr" style="width:${S.n[0]/147*100}%">훈련 ${S.n[0]}송이</i><i class="ts" style="width:${S.n[1]/147*100}%">테스트 ${S.n[1]}</i></div>
      <table class="te-st"><tr><th></th><th>정확도</th></tr><tr><td>훈련 데이터로 잰 점수</td><td>${f3(R.tr)}</td></tr><tr><td><b>테스트 데이터로 잰 점수</b></td><td><b>${f3(R.te)}</b></td></tr></table>
      <p class="muted" style="font-size:.85rem;margin:6px 0 0">${pct==='80'?'교과서와 같은 8:2 분할이에요. 테스트 30송이 중 29송이를 맞혀 0.967이에요.':Number(pct)>80?'테스트 데이터가 적으면 한 송이만 틀려도 점수가 크게 움직여요.':Number(pct)<60?'훈련 데이터가 적으면 모델이 배울 재료가 줄어요.':'교과서는 훈련 60~80%, 테스트 20~40%를 일반적인 비율로 들어요.'} 같은 꽃잎 크기의 꽃이 여러 송이라 점을 살짝 흩어 그렸어요.</p>`;
  }
  B.querySelectorAll('#spBtns button').forEach(b=>b.onclick=()=>{ pct=b.dataset.p; draw(); });
  draw();
})();

/* 01 테스트 데이터까지 학습했다면? — 예상(vote) 후 공개: 붓꽃(사이킷런 결과) + 예시 데이터(k=1) */
(function(){
  const B=$('leakGame');
  /* 예시 데이터: 두 무리가 겹친 80점, 테스트 16점 */
  const r=teRand(21), D=[];
  for(let i=0;i<40;i++){ D.push([0.42+teGauss(r)*.14,0.42+teGauss(r)*.14,0]); D.push([0.58+teGauss(r)*.14,0.58+teGauss(r)*.14,1]); }
  const idx=D.map((_,i)=>i); for(let i=idx.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [idx[i],idx[j]]=[idx[j],idx[i]]; }
  const TE=idx.slice(0,16).map(i=>D[i]), TR=idx.slice(16).map(i=>D[i]);
  const honest=teAcc(TR,TE,1), leak=teAcc(D,TE,1), ir=DF3.splits['80'].res[5];
  let mode=0;
  function ex(){ const tr=mode?D:TR, X=x=>14+Math.max(0,Math.min(1,x))*232, Y=y=>176-Math.max(0,Math.min(1,y))*164;
    let s=`<rect x="10" y="8" width="240" height="172" rx="8" class="bg"/>`;
    TR.forEach(p=>s+=`<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3.4" fill="${p[2]?'#e0702b':'#2f6fd0'}" opacity=".55"/>`);
    TE.forEach(p=>{ const ok=teKnn(tr,p,1)===p[2], x=X(p[0]), y=Y(p[1]);
      s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="#fff" stroke="${p[2]?'#e0702b':'#2f6fd0'}" stroke-width="2.4"/><text class="mk ${ok?'o':'x'}" x="${(x+7).toFixed(1)}" y="${(y-5).toFixed(1)}">${ok?'✓':'✗'}</text>`; });
    return `<svg viewBox="0 0 260 188" class="te-ex" role="img" aria-label="예시 데이터 산점도">${s}</svg>`; }
  function draw(){
    B.innerHTML=`<div class="te-leak"><div><h4>🌸 붓꽃 (교과서 데이터, k = 5, 훈련 80%)</h4>
        <table class="te-st"><tr><th>학습에 쓴 데이터</th><th>테스트 정확도</th></tr><tr><td>훈련 데이터만</td><td><b>${f3(ir.te)}</b></td></tr><tr><td>훈련 + 테스트 데이터 전부</td><td><b>${f3(ir.lk)}</b></td></tr></table>
        <p style="font-size:.9rem">붓꽃에서는 숫자가 <b>그대로</b>예요. 꽃잎 길이·너비가 같아도 품종이 다른 꽃이 있어서, 답을 다 보고도 틀리는 송이가 남기 때문이에요. 그렇다고 이 0.967이 <b>처음 보는 꽃</b>에 대한 점수일까요?</p></div>
      <div><h4>🧪 예시 데이터 (두 무리가 섞인 80점, k = 1)</h4>
        <div class="tl" id="lkMode"><button data-m="0">훈련 데이터만 학습</button><button data-m="1">테스트 데이터까지 학습</button></div>
        ${ex()}
        <p style="font-size:.9rem">테두리 점 16개가 테스트 데이터예요. 테스트 정확도 <b>${mode?f3(leak):f3(honest)}</b> ${mode?`— 모델이 테스트 데이터의 <b>답을 이미 외워서</b> 모두 맞혔어요. 하지만 새 데이터에서도 이렇게 잘할지는 알 수 없어요.`:'— 처음 보는 데이터라 몇 개는 틀려요. 이것이 모델의 진짜 실력에 가까워요.'}</p></div></div>
      <div class="callout" style="margin-bottom:0">테스트 데이터는 모델이 <b>이전에 본 적이 없는 데이터</b>에 대한 성능을 측정하는 데이터예요. 테스트 데이터까지 학습에 쓰면 정확도가 <b>같거나 더 높게</b> 나올 수 있지만, 이미 본 답으로 친 시험이라 <b>믿을 수 있는 점수가 아니에요</b>.</div>`;
    B.querySelectorAll('#lkMode button').forEach(b=>{ b.classList.toggle('on',+b.dataset.m===mode); b.onclick=()=>{ mode=+b.dataset.m; draw(); }; });
  }
  vote('leakVote','leakGuess',[['더 높게 나올 것 같다'],['비슷하게 나올 것 같다'],['더 낮게 나올 것 같다']],()=>{ if(!B.innerHTML) draw(); });
})();

/* 02 과적합·적절한 분류·과소적합 세 그림 (교과서 77쪽 그림을 본떠 다시 그림) */
(function(){
  const O=[[30,30],[48,22],[60,38],[78,28],[70,52],[90,46],[52,58],[100,30]], X=[[18,62],[30,80],[46,88],[64,76],[86,84],[100,70],[40,40],[82,64]];
  const pts=()=>O.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" class="o"/>`).join('')+X.map(p=>`<path d="M${p[0]-4} ${p[1]-4}L${p[0]+4} ${p[1]+4}M${p[0]+4} ${p[1]-4}L${p[0]-4} ${p[1]+4}" class="x"/>`).join('');
  const F=[['과적합의 예','과도하게 분류함.','M10 50 C 22 44, 30 26, 36 34 S 34 48, 44 46 S 60 50, 70 62 S 80 66, 88 58 S 92 62, 110 58'],
           ['적절한 분류의 예','최적의 선으로 분류함.','M10 52 C 40 46, 60 72, 112 56'],
           ['과소적합의 예','너무 단순하게 분류함.','M12 92 L 108 12']];
  $('fitFig').innerHTML=F.map(f=>`<figure><svg viewBox="0 0 120 100" role="img" aria-label="${f[0]}">${pts()}<path d="${f[2]}" class="ln"/></svg><figcaption><b>(${f[0]})</b> ${f[1]}</figcaption></figure>`).join('');
})();

/* 02 더 알아보기: k에 따른 분류 영역 (예시 데이터) */
(function(){
  const B=$('fitGame'); const r=teRand(7);
  const mk=n=>{ const a=[]; for(let i=0;i<n;i++){ const x=r(),y=r(); let c=y>0.5+0.22*Math.sin(2*Math.PI*x)?1:0; if(r()<0.12) c=1-c; a.push([x,y,c]); } return a; };
  const TR=mk(70), TE=mk(70), GX=40, GY=28; let k=1;
  B.innerHTML=`<div class="ctrl"><label>k</label><input type="range" id="ftK" min="1" max="69" step="2" value="1"><output id="ftKo"></output></div>
    <div class="te-sp"><svg viewBox="0 0 400 280" id="ftSvg" role="img" aria-label="k에 따른 분류 영역"></svg><div id="ftStat"></div></div>`;
  function draw(){
    let s=''; const cw=400/GX, ch=280/GY;
    for(let i=0;i<GX;i++) for(let j=0;j<GY;j++){ const c=teKnn(TR,[(i+.5)/GX,1-(j+.5)/GY],k); s+=`<rect x="${(i*cw).toFixed(1)}" y="${(j*ch).toFixed(1)}" width="${(cw+.4).toFixed(1)}" height="${(ch+.4).toFixed(1)}" fill="${c?'#fde3cf':'#dbe6f8'}"/>`; }
    TR.forEach(p=>s+=`<circle cx="${(p[0]*400).toFixed(1)}" cy="${((1-p[1])*280).toFixed(1)}" r="4" fill="${p[2]?'#e0702b':'#2f6fd0'}"/>`);
    TE.forEach(p=>s+=`<circle cx="${(p[0]*400).toFixed(1)}" cy="${((1-p[1])*280).toFixed(1)}" r="4" fill="none" stroke="${p[2]?'#e0702b':'#2f6fd0'}" stroke-width="1.8"/>`);
    $('ftSvg').innerHTML=s; $('ftKo').textContent=k;
    const a=teAcc(TR,TR,k), b=teAcc(TR,TE,k);
    const tag=k<=1?['과적합 쪽','경계가 훈련 데이터 하나하나를 따라 구불구불해요. 훈련 점수는 1.00인데 테스트 점수는 더 낮아요.','#d64535']
      :k>=41?['과소적합 쪽','경계가 너무 단순해져 훈련 데이터와 테스트 데이터 모두에서 점수가 떨어져요.','#9b4fc4']
      :k>=27?['점점 단순해지는 중','k가 커질수록 먼 이웃까지 투표에 들어와 경계가 밋밋해져요.','#e0702b']:['알맞은 쪽','경계가 큰 흐름을 따라가요. 테스트 점수가 높은 편이에요.','#1f9d74'];
    $('ftStat').innerHTML=`<table class="te-st"><tr><th></th><th>정확도</th></tr><tr><td>훈련 데이터</td><td>${f2(a)}</td></tr><tr><td><b>테스트 데이터</b></td><td><b>${f2(b)}</b></td></tr></table><p class="te-tag" style="--k:${tag[2]}"><b>${tag[0]}</b> ${tag[1]}</p><p class="muted" style="font-size:.84rem;margin:0">색 점: 훈련 데이터 70개 · 테두리 점: 테스트 데이터 70개 · 배경색: 모델이 나누는 영역</p>`;
  }
  $('ftK').addEventListener('input',()=>{ k=+$('ftK').value; draw(); });
  draw();
})();

/* 03 TP·TN·FP·FN 분류 게임 (교과서 78쪽 표) */
sorter('cmSort',{
  cats:[{n:'TP 참 긍정',k:'#1f9d74'},{n:'TN 참 부정',k:'#2f6fd0'},{n:'FP 거짓 긍정',k:'#e0702b'},{n:'FN 거짓 부정',k:'#d64535'}],
  items:[
    {t:'「병이 있을 것이다」라고 예측한 환자가 <b>실제 병이 있을 때</b>',short:'질병: 있다 → 실제 있음',c:0,ic:'🩺',w:'긍정(병이 있음)으로 예측했고 맞았으니 참 긍정(TP)이에요.'},
    {t:'「병이 없을 것이다」라고 예측한 환자가 <b>실제로 병이 없을 때</b>',short:'질병: 없다 → 실제 없음',c:1,ic:'🩺',w:'부정(병이 없음)으로 예측했고 맞았으니 참 부정(TN)이에요.'},
    {t:'「병이 있을 것이다」라고 예측한 환자가 <b>실제로는 병이 없을 때</b>',short:'질병: 있다 → 실제 없음',c:2,ic:'🩺',w:'긍정으로 예측했는데 틀렸으니 거짓 긍정(FP)이에요.'},
    {t:'「병이 없을 것이다」라고 예측한 환자가 <b>실제로 병이 있을 때</b>',short:'질병: 없다 → 실제 있음',c:3,ic:'🩺',w:'부정으로 예측했는데 틀렸으니 거짓 부정(FN)이에요. 교과서가 생명과 직접 관련된다고 한 오류예요.'},
    {t:'스팸 메일로 예측한 메일이 <b>실제 스팸 메일일 때</b>',short:'스팸: 스팸 → 실제 스팸',c:0,ic:'📧',w:'긍정(스팸)으로 예측했고 맞았으니 TP예요.'},
    {t:'스팸 메일이 아닌 것으로 예측한 메일이 <b>실제 스팸 메일이 아닐 때</b>',short:'스팸: 아님 → 실제 아님',c:1,ic:'📧',w:'부정(스팸 아님)으로 예측했고 맞았으니 TN이에요.'},
    {t:'스팸 메일로 예측한 메일이 <b>실제 스팸 메일이 아닐 때</b>',short:'스팸: 스팸 → 실제 아님',c:2,ic:'📧',w:'긍정으로 예측했는데 틀렸으니 FP예요. 중요한 메일을 못 보게 되는 오류예요.'},
    {t:'스팸 메일이 아닌 것으로 예측한 메일이 <b>실제 스팸 메일일 때</b>',short:'스팸: 아님 → 실제 스팸',c:3,ic:'📧',w:'부정으로 예측했는데 틀렸으니 FN이에요.'},
  ],
  end:'뒤 글자(Positive/Negative)는 <b>모델이 무엇이라고 예측했는지</b>, 앞 글자(True/False)는 <b>그 예측이 맞았는지</b>예요. 표 Ⅱ-5에서 오류는 <b>FN</b>(실제 참인 것을 거짓으로)과 <b>FP</b>(실제 거짓인 것을 참으로) 두 칸이에요.'
});

/* 04 혼동행렬 계산기: 질병 진단 / 스팸 분류, 칸 직접 입력 + 긍정 판단 기준(예시 점수) */
(function(){
  const B=$('cmCalc');
  /* 예시 점수 100건: 실제 긍정 10건, 실제 부정 90건. 기준 0.50이면 TP 9 · FN 1 · FP 30 · TN 60 (표 Ⅱ-6·Ⅱ-7) */
  const POS=[0.96,0.91,0.86,0.82,0.77,0.71,0.66,0.60,0.54,0.38];
  const NEG=[...Array(30)].map((_,i)=>0.51+i*0.37/29).concat([...Array(60)].map((_,i)=>0.03+i*0.46/59));
  const CTX={
    d:{n:'🩺 질병 진단',o:'질병 O',x:'질병 X',fn:n=>`병이 있는데 「없다」고 들은 환자 <b>${n}명</b> — 치료 시기를 놓쳐 생명이 위험해질 수 있어요.`,fp:n=>`병이 없는데 「있다」고 들은 사람 <b>${n}명</b> — 추가 검사를 받는 불편과 걱정이 생겨요.`,
       tip:'질병 예측 분류에서는 <b>재현율</b>이 중요해요. 재현율이 높을수록 실제로 병이 있는 사람을 놓치지 않아요.'},
    s:{n:'📧 스팸 분류',o:'스팸 O',x:'스팸 X',fn:n=>`스팸인데 받은편지함에 남은 메일 <b>${n}통</b> — 직접 지워야 해서 귀찮아요.`,fp:n=>`스팸이 아닌데 스팸함으로 간 메일 <b>${n}통</b> — 중요한 메일을 보지 못할 수 있어요.`,
       tip:'스팸 메일 분류에서는 <b>정밀도</b>가 중요해요. 정밀도가 높을수록 스팸이라고 한 메일이 정말 스팸이에요.'}
  };
  let ctx='d', th=0.5, M={tp:9,fn:1,fp:30,tn:60}, manual=false;
  const fromTh=t=>({tp:POS.filter(s=>s>=t).length,fn:POS.filter(s=>s<t).length,fp:NEG.filter(s=>s>=t).length,tn:NEG.filter(s=>s<t).length});
  B.innerHTML=`<div class="tl" id="ccCtx">${Object.keys(CTX).map(k=>`<button data-c="${k}">${CTX[k].n}</button>`).join('')}</div>
    <div class="te-cc"><div><div class="te-cmw"><table class="te-cm in" id="ccTbl"></table></div>
      <div class="ctrl te-th"><label>긍정 기준</label><input type="range" id="ccTh" min="0.3" max="0.9" step="0.05" value="0.5"><output id="ccThO"></output></div>
      <p class="muted" style="font-size:.84rem;margin:0" id="ccThMsg"></p>
      <div class="row" style="margin-top:6px"><button class="btn sm ghost" id="ccBook">교과서 표로 되돌리기</button></div></div>
    <div><div id="ccM"></div><div id="ccHarm" class="te-harm"></div></div></div>`;
  function table(){ const c=CTX[ctx];
    $('ccTbl').innerHTML=`<tr><th colspan="2" rowspan="2"></th><th colspan="2">예측값</th></tr><tr><th>${c.o}</th><th>${c.x}</th></tr>
      <tr><th rowspan="2">실젯값</th><th>${c.o}</th><td class="ok"><small>TP</small><input type="number" min="0" max="999" data-k="tp" value="${M.tp}" aria-label="TP"></td><td class="ng"><small>FN</small><input type="number" min="0" max="999" data-k="fn" value="${M.fn}" aria-label="FN"></td></tr>
      <tr><th>${c.x}</th><td class="ng"><small>FP</small><input type="number" min="0" max="999" data-k="fp" value="${M.fp}" aria-label="FP"></td><td class="ok"><small>TN</small><input type="number" min="0" max="999" data-k="tn" value="${M.tn}" aria-label="TN"></td></tr>`;
    $('ccTbl').querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{ const v=Math.max(0,Math.min(999,Math.floor(+i.value||0))); M[i.dataset.k]=v; manual=true; out(); })); }
  function out(){ const c=CTX[ctx];
    $('ccThO').textContent=f2(th);
    $('ccThMsg').innerHTML=manual?'칸의 숫자를 직접 바꿨어요. 기준을 움직이면 예시 점수로 다시 계산해요.'
      :`예시 점수가 <b>${f2(th)} 이상</b>이면 「${c.o}」로 예측해요. 기준을 올리면 긍정 예측이 줄어 FP는 줄고 FN은 늘어요.`;
    $('ccM').innerHTML=teMetricHTML(M.tp,M.fn,M.fp,M.tn);
    $('ccHarm').innerHTML=`<p>⚠️ ${c.fn(M.fn)}</p><p>⚠️ ${c.fp(M.fp)}</p><p class="tip">${c.tip}</p>`; }
  function setCtx(k){ ctx=k; B.querySelectorAll('#ccCtx button').forEach(b=>b.classList.toggle('on',b.dataset.c===k)); table(); out(); }
  B.querySelectorAll('#ccCtx button').forEach(b=>b.onclick=()=>setCtx(b.dataset.c));
  $('ccTh').addEventListener('input',()=>{ th=+$('ccTh').value; M=fromTh(th); manual=false; table(); out(); });
  $('ccBook').onclick=()=>{ th=0.5; $('ccTh').value=0.5; M={tp:9,fn:1,fp:30,tn:60}; manual=false; table(); out(); };
  setCtx('d');
})();

/* 05 관점 바꾸기: 붓꽃 3×3 혼동행렬(교과서 80쪽) → 기준 품종별 2×2 */
(function(){
  const B=$('viewGame'), CM=DF3.splits['80'].res[5].cm; let pos=null;
  const role=(i,j)=>pos==null?'':i===pos&&j===pos?'tp':i===pos?'fn':j===pos?'fp':'tn';
  function draw(){
    let t=`<tr><th colspan="2" rowspan="2"></th><th colspan="3">예측값</th></tr><tr>${TE_NAME.map(n=>`<th>${n}</th>`).join('')}</tr>`;
    CM.forEach((row,i)=>{ t+=`<tr>${i?'':'<th rowspan="3">실젯값</th>'}<th>${TE_NAME[i]}</th>${row.map((v,j)=>{ const r=role(i,j); return `<td class="r-${r}${v&&i!==j?' err':''}">${v}${r?`<small>${r.toUpperCase()}</small>`:''}</td>`; }).join('')}</tr>`; });
    let side='<p class="muted">위에서 기준 품종을 골라 보세요.</p>';
    if(pos!=null){ let tp=0,fn=0,fp=0,tn=0; CM.forEach((row,i)=>row.forEach((v,j)=>{ const r=role(i,j); if(r==='tp')tp+=v; else if(r==='fn')fn+=v; else if(r==='fp')fp+=v; else tn+=v; }));
      const n=TE_NAME[pos], er=pos===1?'FP':pos===2?'FN':'TN';
      const why=pos===0?`세토사 관점에서는 이 1건이 「세토사 아님」을 「세토사 아님」으로 본 것이라 <b>TN</b>에 들어가요. 세토사와 관련된 오류가 없어서 네 지표가 모두 1.00이에요.`
        :pos===1?`버시컬러 관점에서는 실제로는 버시컬러가 아닌데 버시컬러라고 예측한 것이라 <b>FP</b>예요. 그래서 <b>정밀도</b>가 1보다 작아져요. <small>F1-점수는 정확한 값(14/15, 1)으로 계산하면 0.9655…라 0.97로 보여요. 교과서 답은 반올림한 정밀도 0.93으로 계산해 0.96이에요. 둘 다 맞는 계산이에요.</small>`
        :`버지니카 관점에서는 실제 버지니카를 버지니카가 아니라고 예측한 것이라 <b>FN</b>이에요. 그래서 <b>재현율</b>이 1보다 작아져요.`;
      side=`<div class="te-cmw"><table class="te-cm"><tr><th colspan="2" rowspan="2"></th><th colspan="2">예측값</th></tr><tr><th>${n} ○</th><th>${n} ×</th></tr>
        <tr><th rowspan="2">실젯값</th><th>${n} ○</th><td class="ok">${tp}<small>TP</small></td><td class="ng">${fn}<small>FN</small></td></tr>
        <tr><th>${n} ×</th><td class="ng">${fp}<small>FP</small></td><td class="ok">${tn}<small>TN</small></td></tr></table></div>
        ${teMetricHTML(tp,fn,fp,tn)}<p class="te-why">버지니카를 버시컬러로 잘못 분류한 1건 → <b>${er}</b>. ${why}</p>`; }
    B.innerHTML=`<div class="tl" id="vwBtns">${TE_NAME.map((n,c)=>`<button data-p="${c}">${n} 기준</button>`).join('')}</div>
      <div class="te-vw"><div><div class="te-cmw"><table class="te-cm te-c3">${t}</table></div><p class="muted" style="font-size:.84rem;margin:4px 0 0">교과서 80쪽 혼동행렬 · 테스트 데이터 30송이 · 대각선이 맞힌 것</p></div><div>${side}</div></div>`;
    B.querySelectorAll('#vwBtns button').forEach(b=>{ b.classList.toggle('on',+b.dataset.p===pos); b.onclick=()=>{ pos=+b.dataset.p; draw(); }; });
  }
  draw();
})();

/* 05 그림 Ⅱ-6: k값과 정확도 */
(function(){
  const X=k=>34+(k-1)/18*250, Y=a=>120-(a-0.9)/0.1*104;
  let s=`<line class="ax" x1="34" y1="120" x2="290" y2="120"/><line class="ax" x1="34" y1="12" x2="34" y2="120"/>`;
  [1,5,10,15,19].forEach(k=>s+=`<text class="tk" x="${X(k)}" y="133">${k}</text>`); [0.9,0.95,1].forEach(a=>s+=`<text class="tk" x="28" y="${Y(a)+4}" text-anchor="end">${a.toFixed(2)}</text><line class="gd" x1="34" y1="${Y(a)}" x2="290" y2="${Y(a)}"/>`);
  DF3.kacc.forEach((a,i)=>s+=`<circle cx="${X(i+1)}" cy="${Y(a).toFixed(1)}" r="3.5" class="pt"><title>k=${i+1}: ${a}</title></circle>`);
  s+=`<text class="al" x="290" y="146" text-anchor="end">이웃의 수</text><text class="al" x="38" y="10">정확도</text>`;
  $('kPlot').innerHTML=`<svg viewBox="0 0 300 150" class="te-k" role="img" aria-label="그림 Ⅱ-6 k값과 정확도">${s}</svg>`;
})();

/* 05 빈칸 확인 · 성취도 평가 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['훈련 데이터와 테스트 데이터를 나누는 이유를 말할 수 있다','혼동행렬에서 TP·TN·FP·FN을 찾을 수 있다','정확도·정밀도·재현율·F1-점수를 계산할 수 있다','문제에 따라 더 중요한 지표를 고를 수 있다'],true);

const MEMOLIST=[['planMemo','미리 본 문제로 친 시험 점수를 믿을 수 있을까'],['leakGuess','테스트 데이터까지 학습했을 때 내 예상'],['leakMemo','테스트 데이터까지 학습한 정확도를 믿을 수 있을까'],['errMemo','질병 진단·스팸 분류에서 더 중요한 지표와 실제 피해'],['viewMemo','기준 품종에 따라 지표가 달라지는 이유'],['selfCheckPick','성취도 평가: 할 수 있게 된 것']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
