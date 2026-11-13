/* 0 표지 */
(function(){
  const s=$('coverNet'); glowDef(s);
  const L=[4,6,6,3], xs=[560,690,820,950], P=L.map((n,l)=>Array.from({length:n},(_,i)=>[xs[l],260+(i-(n-1)/2)*62]));
  const mg=el('linearGradient',{id:'coverFade',x1:0,y1:0,x2:1,y2:0},s.querySelector('defs')); el('stop',{offset:.35,'stop-color':'#0f2742','stop-opacity':.95},mg); el('stop',{offset:.62,'stop-color':'#0f2742','stop-opacity':0},mg);
  for(let i=0;i<40;i++) el('circle',{cx:Math.random()*1000,cy:Math.random()*520,r:Math.random()*1.6+.4,fill:'#fff',opacity:Math.random()*.5+.1},s);
  const E=[]; for(let l=0;l<3;l++) for(const a of P[l]) for(const b of P[l+1]){E.push([a,b]); el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'#5a86b8','stroke-opacity':.28},s);}
  P.flat().forEach(p=>el('circle',{cx:p[0],cy:p[1],r:9,fill:'#0f2742',stroke:'#8fb3dc','stroke-width':2},s));
  el('rect',{x:0,y:0,width:1000,height:520,fill:'url(#coverFade)'},s);
  setInterval(()=>{ if(cur!==0||document.hidden) return; const e=E[Math.floor(Math.random()*E.length)]; travel(s,e,['#f2a516','#5fd3a5','#8fb3dc'][Math.floor(Math.random()*3)],900,4); },150);
})();

/* 1 퍼셉트론 */
const FL=[['가',1.4,0.2,0],['나',4.7,1.4,1],['다',6.0,2.5,1]];
const PC={}; let pick=0, firing=false;
(function(){
  const s=$('percSvg'); glowDef(s);
  const g=el('g',{'font-family':'Noto Sans KR, sans-serif','font-size':15},s);
  const box=(x,y,w,h)=>el('rect',{x,y,width:w,height:h,rx:12,fill:'#e6eefb',stroke:'#2f6fd0','stroke-width':2},g);
  box(20,30,160,56); box(20,150,160,56);
  el('text',{x:100,y:22,'text-anchor':'middle',fill:'#5b6776','font-size':13},g,'입력');
  PC.inA=el('text',{x:100,y:64,'text-anchor':'middle','font-weight':700},g,'');
  PC.inB=el('text',{x:100,y:184,'text-anchor':'middle','font-weight':700},g,'');
  el('line',{x1:180,y1:58,x2:376,y2:108,stroke:'#16202c','stroke-width':2},g);
  el('line',{x1:180,y1:178,x2:376,y2:124,stroke:'#16202c','stroke-width':2},g);
  [[230,60],[230,152]].forEach(([x,y])=>{el('rect',{x,y,width:100,height:26,rx:13,fill:'#d64535'},g); el('text',{x:x+50,y:y+18,'text-anchor':'middle',fill:'#fff','font-size':13,'font-weight':700},g,'× 가중치 1');});
  PC.sum=el('circle',{cx:430,cy:116,r:56,fill:'#fff',stroke:'#16202c','stroke-width':2.5,class:'pulse-node'},g);
  el('text',{x:430,y:102,'text-anchor':'middle','font-size':12.5,fill:'#5b6776'},g,'모두 더하고');
  el('text',{x:430,y:119,'text-anchor':'middle','font-size':12.5,fill:'#5b6776'},g,'+ 편향 0');
  PC.sumT=el('text',{x:430,y:148,'text-anchor':'middle','font-size':22,'font-weight':900},g,'');
  el('line',{x1:486,y1:116,x2:560,y2:116,stroke:'#16202c','stroke-width':2},g);
  PC.act=el('rect',{x:560,y:76,width:170,height:80,rx:12,fill:'#fff',stroke:'#16202c','stroke-width':2.5,class:'pulse-node'},g);
  el('text',{x:645,y:109,'text-anchor':'middle','font-weight':700},g,'활성화 함수');
  el('text',{x:645,y:133,'text-anchor':'middle','font-size':12.5,fill:'#5b6776'},g,'0보다 크면 1, 아니면 0');
  el('line',{x1:730,y1:116,x2:790,y2:116,stroke:'#16202c','stroke-width':2},g);
  PC.out=el('circle',{cx:835,cy:116,r:40,fill:'#fff',stroke:'#16202c','stroke-width':2.5,class:'pulse-node'},g);
  PC.outT=el('text',{x:835,y:127,'text-anchor':'middle','font-size':30,'font-weight':900},g,'?');
  el('text',{x:835,y:178,'text-anchor':'middle',fill:'#5b6776','font-size':13},g,'출력');
  FL.forEach((fl,i)=>{const b=document.createElement('button');b.className='chip';b.textContent=`꽃 ${fl[0]} · ${NAMES[i]}`;b.onclick=()=>{if(!firing)setFlower(i);};$('flowerPick').appendChild(b);});
})();
function setFlower(i){pick=i; const [n,a,b]=FL[i]; PC.inA.textContent=`꽃잎 길이 ${a}`; PC.inB.textContent=`꽃잎 너비 ${b}`;
  PC.sumT.textContent=''; PC.outT.textContent='?'; [PC.out,PC.sum,PC.act].forEach(e=>e.setAttribute('fill','#fff'));
  [...$('flowerPick').children].forEach((c,j)=>c.classList.toggle('on',j===i)); $('percMsg').textContent='신호 보내기를 눌러 보세요. (가중치 1, 1 · 편향 0)';}
setFlower(0);
$('fire').onclick=async()=>{
  if(firing) return; firing=true; const [n,a,b,ans]=FL[pick], s=$('percSvg');
  PC.sumT.textContent=''; PC.outT.textContent='?'; [PC.out,PC.sum,PC.act].forEach(e=>e.setAttribute('fill','#fff'));
  await Promise.all([travel(s,[[180,58],[376,108]],'#2f6fd0',700),travel(s,[[180,178],[376,124]],'#2f6fd0',700)]);
  const z=a+b; PC.sum.setAttribute('fill','#fff6db'); PC.sumT.textContent=f(z,1); await sleep(350);
  await travel(s,[[486,116],[560,116]],'#f2a516',380); PC.act.setAttribute('fill','#fff6db'); await sleep(250);
  await travel(s,[[730,116],[790,116]],'#f2a516',320);
  const o=z>0?1:0, right=o===ans; PC.outT.textContent=o; PC.out.setAttribute('fill',right?'#d9f3e8':'#fde3df');
  $('percMsg').innerHTML=`${a}×1 + ${b}×1 + 0 = ${f(z,1)} → 출력 <b>${o}</b> · 정답 ${ans} → <b class="${right?'ok':'ng'}">${right?'맞음':'틀림'}</b>`;
  firing=false;
};

/* 2 조정 */
const sc=$('scatter'), X0=40,X1=425,Y0=285,Y1=15,XM=7,YM=2.6;
const px=x=>X0+(X1-X0)*x/XM, py=y=>Y0-(Y0-Y1)*y/YM;
const JIT=IRIS.map(()=>[(Math.random()-.5)*4,(Math.random()-.5)*4]);
el('rect',{x:X0,y:Y1,width:X1-X0,height:Y0-Y1,fill:'#fff',stroke:'#ddd'},sc);
const cpath=el('clipPath',{id:'clip'},sc); el('rect',{x:X0,y:Y1,width:X1-X0,height:Y0-Y1},cpath);
const gReg=el('g',{'clip-path':'url(#clip)'},sc);
for(let x=0;x<=7;x++) el('text',{x:px(x),y:Y0+18,'text-anchor':'middle','font-size':12,fill:'#5b6776'},sc,x);
for(let y=0;y<=2.5;y+=0.5) el('text',{x:X0-6,y:py(y)+4,'text-anchor':'end','font-size':12,fill:'#5b6776'},sc,y);
el('text',{x:(X0+X1)/2,y:326,'text-anchor':'middle','font-size':13},sc,'꽃잎 길이(cm)');
el('text',{x:12,y:150,'font-size':13,transform:'rotate(-90 12 150)','text-anchor':'middle'},sc,'꽃잎 너비(cm)');
const pts=IRIS.map(([x,y,c],k)=>el('circle',{cx:px(x)+JIT[k][0],cy:py(y)+JIT[k][1],r:4,fill:COL[c],opacity:.85,style:'transition:r .25s'},sc));
function perceptron(){
  const w1=+$('w1').value,w2=+$('w2').value,b=+$('bb').value;
  $('w1o').textContent=f(w1,1);$('w2o').textContent=f(w2,1);$('bbo').textContent=f(b,1);
  let wrong=0;
  IRIS.forEach(([x,y,c],k)=>{const ok=((w1*x+w2*y+b>0)?1:0)===(c===0?0:1); if(!ok) wrong++;
    pts[k].setAttribute('r',ok?4:6.5); pts[k].setAttribute('fill',ok?COL[c]:'#fff'); pts[k].setAttribute('stroke',ok?'none':'#d64535'); pts[k].setAttribute('stroke-width',2.5);});
  $('wrong').textContent=wrong; $('wrong').style.color=wrong?'var(--red)':'var(--mint)'; $('wrongBar').style.width=(wrong/150*100)+'%';
  gReg.innerHTML='';
  if(w1||w2){
    let poly;
    if(w2){ poly=[]; for(let i=0;i<=40;i++){const x=XM*i/40; poly.push([x,Math.max(-1,Math.min(YM+1,-(w1*x+b)/w2))]);} poly.push([XM,YM+1],[0,YM+1]); }
    else { const x0=-b/w1; poly=[[x0,-1],[XM+1,-1],[XM+1,YM+1],[x0,YM+1]]; }
    el('polygon',{points:poly.map(p=>px(p[0])+','+py(p[1])).join(' '),fill:'#1f9d74','fill-opacity':.1},gReg);
    let a,c; if(w2){a=[0,-b/w2];c=[XM,-(w1*XM+b)/w2];}else{a=[-b/w1,0];c=[-b/w1,YM];}
    el('line',{x1:px(a[0]),y1:py(a[1]),x2:px(c[0]),y2:py(c[1]),stroke:'#16202c','stroke-width':2,'stroke-dasharray':'7 5'},gReg);
  }
  let h='<tr><th>꽃</th><th>길이×w₁ + 너비×w₂ + b</th><th>출력</th><th></th></tr>';
  for(const [n,x,y,a] of FL){const s=w1*x+w2*y+b,o=s>0?1:0; h+=`<tr><td>${n}</td><td>${f(s,2)}</td><td>${o}</td><td class="${o===a?'ok':'ng'}">${o===a?'맞음':'틀림'}</td></tr>`;}
  $('ptab').innerHTML=h;
}
['w1','w2','bb'].forEach(id=>$(id).addEventListener('input',perceptron)); perceptron();

/* 3 신경망 */
const NET={}; let netBusy=false;
(function(){
  const s=$('net'); glowDef(s); const L=[4,8,3], xs=[220,450,680];
  const P=L.map((n,l)=>Array.from({length:n},(_,i)=>[xs[l],175+(i-(n-1)/2)*38]));
  const E=[[],[]]; for(let l=0;l<2;l++) for(const a of P[l]) for(const b of P[l+1]) E[l].push([a,b,el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:'#b8c2cf','stroke-width':1},s)]);
  const inN=['꽃받침 길이','꽃받침 너비','꽃잎 길이','꽃잎 너비'];
  const N=P.map((layer,l)=>layer.map((p,i)=>{
    const c=el('circle',{cx:p[0],cy:p[1],r:13,fill:'#fff',stroke:'#9b4fc4','stroke-width':2.5,class:'pulse-node'},s);
    if(l===0) el('text',{x:p[0]-22,y:p[1]+5,'text-anchor':'end','font-size':15},s,inN[i]);
    if(l===2) el('text',{x:p[0]+22,y:p[1]+5,'font-size':15,fill:COL[i],'font-weight':700},s,NAMES[i]);
    return c;}));
  [['입력층 · 4칸',0],['은닉층 · 8칸',1],['출력층 · 3칸',2]].forEach(([t,i])=>el('text',{x:xs[i],y:350,'text-anchor':'middle','font-size':16,'font-weight':900},s,t));
  const probs=P[2].map(p=>el('text',{x:p[0]+110,y:p[1]+5,'font-size':16,'font-weight':900},s,''));
  Object.assign(NET,{s,E,N,probs});
})();
function netClear(){NET.N.flat().forEach(c=>c.setAttribute('fill','#fff'));NET.E.flat().forEach(e=>{e[2].setAttribute('stroke','#b8c2cf');e[2].setAttribute('stroke-width',1);});NET.probs.forEach(t=>t.textContent='');}
$('netFwd').onclick=async()=>{
  if(netBusy) return; netBusy=true; netClear(); $('netMsg').textContent='꽃 "가"의 네 값이 입력층으로 들어갑니다';
  NET.N[0].forEach(c=>c.setAttribute('fill','#f3e6fa')); await sleep(300);
  for(let l=0;l<2;l++){
    NET.E[l].forEach(e=>{e[2].setAttribute('stroke','#9b4fc4');e[2].setAttribute('stroke-width',1.6);});
    await Promise.all(NET.E[l].filter((_,i)=>i%2===0).map(e=>travel(NET.s,[e[0],e[1]],'#f2a516',650,4)));
    NET.N[l+1].forEach(c=>c.setAttribute('fill','#f3e6fa'));
    $('netMsg').textContent=l===0?'은닉층(렐루)에서 계산한 값이 출력층으로':'출력층에서 소프트맥스 → 확률';
    await sleep(250);
  }
  [0.66,0.24,0.10].forEach((p,i)=>NET.probs[i].textContent=p.toFixed(2)); NET.N[2][0].setAttribute('fill','#d9f3e8');
  $('netMsg').textContent='세토사 0.66 → 세토사로 판단'; netBusy=false;
};
$('netBack').onclick=async()=>{
  if(netBusy) return; netBusy=true; netClear(); $('netMsg').textContent='오차를 거꾸로 전하며 가중치를 고칩니다 (다음 시간에 자세히)';
  NET.N[2].forEach(c=>c.setAttribute('fill','#fde3df')); await sleep(300);
  for(let l=1;l>=0;l--){
    NET.E[l].forEach(e=>{e[2].setAttribute('stroke','#d64535');e[2].setAttribute('stroke-width',1.6);});
    await Promise.all(NET.E[l].filter((_,i)=>i%2===0).map(e=>travel(NET.s,[e[1],e[0]],'#d64535',650,4)));
    NET.N[l].forEach(c=>c.setAttribute('fill','#fde3df')); await sleep(150);
  }
  netBusy=false;
};
function countUp(id,to,ms){const e=$(id);return tween(ms,p=>e.textContent=Math.round(to*p).toLocaleString());}
onShow[3]=()=>{countUp('cnt1',67,900);countUp('cnt2',84060,1400);};


// 뉴런 ↔ 퍼셉트론 짝 강조
(()=>{const vs=$('vs'); const rows=[...document.querySelectorAll('#vsMap tr')];
  rows.forEach(r=>r.addEventListener('click',()=>{const on=!r.classList.contains('on');
    rows.forEach(x=>x.classList.remove('on')); vs.querySelectorAll('[data-part]').forEach(g=>g.classList.remove('hl'));
    vs.classList.toggle('focus',on);
    if(on){r.classList.add('on'); vs.querySelectorAll(`[data-part="${r.dataset.p}"]`).forEach(g=>g.classList.add('hl'));}
  }));
})();
// 떡볶이 퍼셉트론
(()=>{const items=[{nm:'🍽️ 배가 고프다',w:3,x:1},{nm:'👭 친구가 같이 간다',w:2,x:1},{nm:'💰 용돈이 있다',w:4,x:0}], B=-5;
  const box=$('lifeIn');
  function draw(){
    box.innerHTML=items.map((it,i)=>`<div class="tg"><span class="nm">${it.nm}</span><span class="sw"><button data-i="${i}" data-x="1" class="${it.x?'on':''}">예 (1)</button><button data-i="${i}" data-x="0" class="${it.x?'':'on'}">아니오 (0)</button></span><span class="wt" title="가중치"><button data-i="${i}" data-d="-1" aria-label="가중치 줄이기">−</button>w = ${it.w}<button data-i="${i}" data-d="1" aria-label="가중치 늘리기">+</button></span></div>`).join('')
      +`<p class="muted" style="font-size:.88rem;margin:4px 0 0">편향 b = ${B} (총점이 5보다 커야 간다는 뜻)</p>`;
    const sum=items.reduce((a,it)=>a+it.x*it.w,0), z=sum+B, y=z>0?1:0;
    $('lifeCalc').innerHTML=
      `<div><span style="color:var(--psum);font-weight:700">가중합</span> = ${items.map(it=>`<span style="color:var(--pin)">${it.x}</span>×<span style="color:var(--pw)">${it.w}</span>`).join(' + ')} = <b>${sum}</b></div>`
     +`<div>총점 + 편향 = ${sum} + (${B}) = <b>${z}</b></div>`
     +`<div><span style="color:var(--pact);font-weight:700">활성화 함수</span>: ${z} ${z>0?'&gt; 0 이니까':'≤ 0 이니까'} → <span style="color:var(--pout);font-weight:700">출력</span> <span class="r" style="color:var(--pout)">${y}</span></div>`
     +`<div class="r" style="margin-top:6px">${y?'🍢 떡볶이 먹으러 간다!':'🏠 오늘은 집에 간다'}</div>`;
  }
  box.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; const it=items[+b.dataset.i];
    if(b.dataset.x!=null) it.x=+b.dataset.x; else it.w=Math.max(0,Math.min(5,it.w+ +b.dataset.d)); draw();});
  draw();
})();

