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

/* 7 경사 하강법 */
const gs=$('gdsvg'), WL=-1.5, WR=2.5, LM=50; const gdefs=glowDef(gs);
const gx=w=>40+400*(w-WL)/(WR-WL), gy=l=>262-240*Math.min(l,LM)/LM, loss=w=>(5*w-2)**2;
(function(){
  const grd=el('linearGradient',{id:'hill',x1:0,y1:0,x2:0,y2:1},gdefs); el('stop',{offset:0,'stop-color':'#f2a516','stop-opacity':.28},grd); el('stop',{offset:1,'stop-color':'#f2a516','stop-opacity':.03},grd);
  let d=''; for(let w=WL;w<=WR+1e-9;w+=0.02) d+=(d?'L':'M')+gx(w).toFixed(1)+','+gy(loss(w)).toFixed(1);
  el('path',{d:d+`L${gx(WR)},262L${gx(WL)},262Z`,fill:'url(#hill)'},gs);
  el('path',{d,fill:'none',stroke:'#b07800','stroke-width':3},gs);
  el('line',{x1:40,y1:262,x2:440,y2:262,stroke:'#ccd'},gs);
  [-1,0,0.4,1,2].forEach(w=>el('text',{x:gx(w),y:280,'text-anchor':'middle','font-size':12,fill:w===0.4?'#1f9d74':'#5b6776','font-weight':w===0.4?700:400},gs,f(w,1)));
  el('text',{x:240,y:296,'text-anchor':'middle','font-size':13},gs,'가중치 w');
  el('text',{x:gx(0.4),y:252,'text-anchor':'middle','font-size':12,fill:'#1f9d74','font-weight':700},gs,'골짜기');
  el('text',{x:44,y:24,'font-size':12,fill:'#5b6776'},gs,'손실');
})();
const gTrail=el('g',{},gs), ball=el('circle',{r:11,fill:'#d64535',stroke:'#fff','stroke-width':3,filter:'url(#gdsvg-glow)'},gs);
let gw,gk,gBusy=false;
const clampW=w=>Math.max(WL,Math.min(WR,w));
function placeBall(w){ball.setAttribute('cx',gx(clampW(w)));ball.setAttribute('cy',gy(loss(w))-10);}
function gRow(){const p=gw*5,e=p-2,l=e*e,s=2*e*5;$('gdt').insertAdjacentHTML('beforeend',`<tr><td>${gk===0?'시작':gk+'번 후'}</td><td><b>${f(gw,4)}</b></td><td>${f(p,3)}</td><td>${f(l,2)}</td><td>${f(s,2)}</td></tr>`);}
function gReset(){gw=1;gk=0;gTrail.innerHTML='';$('gdt').innerHTML='<tr><th>단계</th><th>w</th><th>예측</th><th>손실</th><th>기울기</th></tr>';gRow();placeBall(gw);}
$('step').onclick=async()=>{
  if(gBusy||gk>=6) return; gBusy=true;
  const lr=+$('lr').value, prev=gw, next=gw-lr*2*(gw*5-2)*5;
  el('circle',{cx:gx(clampW(prev)),cy:gy(loss(prev))-10,r:4,fill:'#d64535',opacity:.45},gTrail);
  await tween(700,p=>{const w=prev+(next-prev)*p; ball.setAttribute('cx',gx(clampW(w))); ball.setAttribute('cy',gy(loss(w))-10-Math.sin(Math.PI*p)*30);});
  gw=next; gk++; gRow(); placeBall(gw); gBusy=false;
};
$('reset').onclick=()=>{if(!gBusy)gReset();}; $('lr').onchange=()=>{if(!gBusy)gReset();}; gReset();

/* 8 배치 */
let BS=10, bBusy=false;
const BCOL=['#2f6fd0','#f2a516','#1f9d74','#9b4fc4','#d64535','#0f2742'];
(function(){
  const d=$('dots'); for(let i=0;i<120;i++) d.appendChild(document.createElement('i'));
  [1,10,30,120].forEach(b=>{const c=document.createElement('button');c.className='chip'+(b===BS?' on':'');c.textContent=b;c.onclick=()=>{if(bBusy)return;BS=b;[...$('bsPick').children].forEach(x=>x.classList.toggle('on',x===c));bPaint(-1);};$('bsPick').appendChild(c);});
})();
function bPaint(upto){[...$('dots').children].forEach((e,i)=>{const g=Math.floor(i/BS); e.style.background=g<=upto?BCOL[g%BCOL.length]:'#d6dbe2'; e.classList.toggle('lit',g===upto);}); $('per').textContent=Math.ceil(120/BS)+'번'; if(upto<0) $('upd').textContent=0;}
$('bsPlay').onclick=async()=>{
  if(bBusy) return; bBusy=true; const n=Math.ceil(120/BS), ms=Math.max(18,Math.min(420,2600/n));
  for(let g=0;g<n;g++){bPaint(g); $('upd').textContent=g+1; await sleep(ms);}
  [...$('dots').children].forEach(e=>e.classList.remove('lit')); bBusy=false;
};
bPaint(-1);

