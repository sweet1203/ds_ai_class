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

/* 4 활성화 함수 */
function plotFn(svgId,fn,ymin,ymax,color){
  const s=$(svgId), W=300,H=150, X=z=>20+(W-30)*(z+4)/8, Y=v=>H-18-(H-30)*(v-ymin)/(ymax-ymin);
  el('line',{x1:20,y1:Y(0),x2:W-10,y2:Y(0),stroke:'#ccd'},s); el('line',{x1:X(0),y1:8,x2:X(0),y2:H-14,stroke:'#ccd'},s);
  let d=''; for(let z=-4;z<=4.001;z+=0.05) d+=(d?'L':'M')+X(z).toFixed(1)+','+Y(fn(z)).toFixed(1);
  el('path',{d,fill:'none',stroke:color,'stroke-width':3.5,'stroke-linecap':'round'},s);
  [-4,0,4].forEach(z=>el('text',{x:X(z),y:H-2,'text-anchor':'middle','font-size':11,fill:'#5b6776'},s,z));
  const g=el('line',{stroke:color,'stroke-dasharray':'3 3'},s), dot=el('circle',{r:7,fill:color,stroke:'#fff','stroke-width':2.5},s);
  return z=>{const v=fn(z); dot.setAttribute('cx',X(z)); dot.setAttribute('cy',Y(v)); g.setAttribute('x1',X(z));g.setAttribute('x2',X(z));g.setAttribute('y1',Y(0));g.setAttribute('y2',Y(v)); return v;};
}
const relu=plotFn('reluSvg',z=>Math.max(0,z),-0.4,4.2,'#e0702b'), sig=plotFn('sigSvg',z=>1/(1+Math.exp(-z)),-0.05,1.05,'#2f6fd0');
function act(){const z=+$('z').value;$('zo').textContent=f(z,1);$('reluV').textContent=f(relu(z),2);$('sigV').textContent=f(sig(z),2);}
$('z').addEventListener('input',act); act();
(function(){
  const box=$('smx'), init=[2.0,1.0,0.1];
  box.innerHTML=NAMES.map((n,i)=>`<div style="display:grid;grid-template-columns:72px 76px 1fr 46px;gap:8px;align-items:center;margin:8px 0"><b style="color:${COL[i]}">${n}</b><input type="number" step="0.5" value="${init[i]}" aria-label="${n} 점수"><div style="background:#eef0f3;border-radius:6px;height:24px;overflow:hidden"><div id="sb${i}" style="height:100%;background:${COL[i]};width:0;transition:width .35s cubic-bezier(.2,.7,.2,1)"></div></div><span id="sp${i}" style="font-weight:900;text-align:right"></span></div>`).join('');
  const upd=()=>{const z=[...box.querySelectorAll('input')].map(e=>+e.value||0),m=Math.max(...z),e=z.map(v=>Math.exp(v-m)),s=e.reduce((a,b)=>a+b,0);e.forEach((v,i)=>{$('sb'+i).style.width=(v/s*100)+'%';$('sp'+i).textContent=(v/s).toFixed(2);});};
  box.addEventListener('input',upd); upd();
})();

/* 5 학습 순환 */
const CY={}; let cyBusy=false;
(function(){
  const s=$('cycle'); const cx=220,cy=195,R=130;
  const pos=[-90,30,150].map(a=>a*Math.PI/180).map(a=>[cx+R*Math.cos(a),cy+R*Math.sin(a)]);
  const cols=['#2f6fd0','#e0702b','#d64535'], labs=['순전파','오차 계산','역전파'];
  el('circle',{cx,cy,r:R,fill:'none',stroke:'#e3ddd2','stroke-width':14},s);
  const arc=el('circle',{cx,cy,r:R,fill:'none',stroke:'#1f9d74','stroke-width':14,'stroke-linecap':'round','stroke-dasharray':`0 ${2*Math.PI*R}`,transform:`rotate(-90 ${cx} ${cy})`},s);
  el('text',{x:cx,y:cy-6,'text-anchor':'middle','font-size':16,fill:'#5b6776'},s,'반복할수록');
  el('text',{x:cx,y:cy+20,'text-anchor':'middle','font-size':18,'font-weight':900},s,'손실이 줄어든다');
  const nodes=pos.map((p,i)=>{const g=el('g',{style:'cursor:pointer'},s); const c=el('circle',{cx:p[0],cy:p[1],r:48,fill:'#fff',stroke:cols[i],'stroke-width':4,class:'pulse-node'},g);
    el('text',{x:p[0],y:p[1]-4,'text-anchor':'middle','font-size':16,'font-weight':900,fill:cols[i]},g,'①②③'[i]);
    el('text',{x:p[0],y:p[1]+17,'text-anchor':'middle','font-size':14,'font-weight':700},g,labs[i]);
    g.addEventListener('click',()=>{if(!cyBusy)cyShow(i);}); return c;});
  Object.assign(CY,{arc,nodes,cols,R});
})();
function cyShow(i){CY.nodes.forEach((c,j)=>c.setAttribute('fill',j===i?['#e3ecfa','#fbe7da','#f9e0dd'][j]:'#fff'));document.querySelectorAll('.stepcard').forEach(c=>c.classList.toggle('on',+c.dataset.s===i));}
$('cyclePlay').onclick=async()=>{
  if(cyBusy) return; cyBusy=true; const L=2*Math.PI*CY.R;
  for(let i=0;i<3;i++){cyShow(i); await tween(1100,p=>CY.arc.setAttribute('stroke-dasharray',`${L*(i+p)/3} ${L}`)); await sleep(900);}
  await sleep(300); CY.arc.setAttribute('stroke-dasharray',`0 ${L}`); cyShow(0); cyBusy=false;
};
cyShow(0);

/* 6 손실 */
const CE={};
(function(){
  const s=$('ceSvg'), X=p=>40+360*p, Y=l=>190-170*Math.min(l,3)/3;
  el('line',{x1:40,y1:190,x2:400,y2:190,stroke:'#ccd'},s); el('line',{x1:40,y1:20,x2:40,y2:190,stroke:'#ccd'},s);
  let d=''; for(let p=0.05;p<=1.0001;p+=0.01) d+=(d?'L':'M')+X(p).toFixed(1)+','+Y(-Math.log(p)).toFixed(1);
  el('path',{d,fill:'none',stroke:'#d64535','stroke-width':3.5},s);
  [0,0.5,1].forEach(p=>el('text',{x:X(p),y:206,'text-anchor':'middle','font-size':12,fill:'#5b6776'},s,p));
  [0,1,2,3].forEach(l=>el('text',{x:32,y:Y(l)+4,'text-anchor':'end','font-size':12,fill:'#5b6776'},s,l));
  el('text',{x:220,y:222,'text-anchor':'middle','font-size':12,fill:'#5b6776'},s,'정답에 준 확률');
  el('text',{x:48,y:16,'font-size':12,fill:'#5b6776'},s,'손실');
  CE.v=el('line',{stroke:'#d64535','stroke-dasharray':'4 3'},s); CE.d=el('circle',{r:8,fill:'#d64535',stroke:'#fff','stroke-width':3},s); CE.X=X; CE.Y=Y;
})();
function ce(){const p=+$('pp').value,l=-Math.log(p);$('ppo').textContent=p.toFixed(2);$('ce').textContent=f(l,2);
  CE.d.setAttribute('cx',CE.X(p));CE.d.setAttribute('cy',CE.Y(l));CE.v.setAttribute('x1',CE.X(p));CE.v.setAttribute('x2',CE.X(p));CE.v.setAttribute('y1',190);CE.v.setAttribute('y2',CE.Y(l));
  $('cemsg').textContent=p>=0.7?'정답에 확신 → 손실 작음':p<=0.3?'정답을 거의 믿지 않음 → 손실 큼':'';}
$('pp').addEventListener('input',ce); ce();
document.querySelectorAll('.sqbar').forEach(sp=>{sp.style.cssText='display:inline-block;height:18px;background:#e0702b;border-radius:4px;vertical-align:middle;width:0;transition:width .8s cubic-bezier(.2,.7,.2,1)';sp.insertAdjacentHTML('afterend',` <b>${sp.dataset.v}</b>`);});
onShow[3]=()=>{document.querySelectorAll('.sqbar').forEach(sp=>{sp.style.width='0';setTimeout(()=>sp.style.width=(sp.dataset.v*9)+'px',60);});};


