
/* 공통: 소리 · 음성 인식 · 읽어 주기 */
let AC=null;
function ac(){ if(!AC) AC=new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); return AC; }
const PAL=(()=>{const p=[];for(let v=0;v<256;v++){const t=v/255;let r,g,b;
  if(t<.35){const k=t/.35;r=10+k*37;g=26+k*85;b=46+k*164;}
  else if(t<.72){const k=(t-.35)/.37;r=47+k*195;g=111+k*54;b=210-k*188;}
  else{const k=(t-.72)/.28;r=242+k*13;g=165+k*90;b=22+k*233;}
  p.push(`rgb(${r|0},${g|0},${b|0})`);}return p;})();

let KOV=null;
function pickVoice(){ try{const v=speechSynthesis.getVoices(); KOV=v.find(x=>/^ko/i.test(x.lang))||null;}catch(e){} }
if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }
function say(text,o={}){
  if(!('speechSynthesis' in window)) return false;
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='ko-KR'; if(KOV) u.voice=KOV;
  u.pitch=o.pitch??1; u.rate=o.rate??1; u.volume=o.volume??1; speechSynthesis.speak(u); return !!KOV;
}

const SRC=window.SpeechRecognition||window.webkitSpeechRecognition;
let REC=null;
const SR_ERR={'not-allowed':'마이크 사용을 허락해 주세요. 주소창 왼쪽의 아이콘을 눌러 마이크를 「허용」으로 바꿀 수 있어요.','service-not-allowed':'이 브라우저에서는 음성 인식을 쓸 수 없어요. 크롬이나 엣지로 열어 보세요.','no-speech':'말소리가 들리지 않았어요. 버튼을 다시 누르고 조금 더 크게 말해 보세요.','audio-capture':'마이크를 찾을 수 없어요. 마이크가 연결되어 있는지 확인해 주세요.','network':'인터넷 연결을 확인해 주세요. 음성 인식은 인터넷이 필요해요.','aborted':''};
const NO_SR='이 브라우저는 음성 인식을 지원하지 않아요. 크롬·엣지·사파리로 열어 보세요. 마이크 없이 해 보려면 글자 입력 칸을 쓰면 돼요.';
function setMic(b,on){ if(!b.dataset.label) b.dataset.label=b.textContent; b.classList.toggle('on',on); b.textContent=on?'■ 듣는 중… (누르면 멈춤)':b.dataset.label; }
function listen(btn,o){
  if(btn.classList.contains('on')){ if(REC){ try{REC.stop();}catch(e){} } else setMic(btn,false); return; }
  if(REC){ try{REC.abort();}catch(e){} REC=null; }
  if(!SRC){ o.onErr&&o.onErr(NO_SR); return; }
  const r=new SRC(); r.lang=o.lang||'ko-KR'; r.interimResults=true; r.continuous=false; r.maxAlternatives=1;
  let fin='';
  r.onresult=e=>{ let f='',it=''; for(let i=0;i<e.results.length;i++){const s=e.results[i][0].transcript; if(e.results[i].isFinal) f+=s; else it+=s;} fin=f; o.onText&&o.onText(f,it); };
  r.onerror=e=>{ const m=SR_ERR[e.error]??('음성 인식 오류: '+e.error); if(m&&o.onErr) o.onErr(m); };
  r.onend=()=>{ if(REC===r) REC=null; setMic(btn,false); o.onDone&&o.onDone(fin.trim()); };
  REC=r; setMic(btn,true); o.onStart&&o.onStart();
  try{ r.start(); }catch(e){ setMic(btn,false); REC=null; o.onErr&&o.onErr('음성 인식을 시작하지 못했어요. 다시 눌러 보세요.'); }
}
function warn(id,msg){ const w=$(id); w.textContent=msg||''; w.classList.toggle('on',!!msg); }

/* 두 문장 비교 (띄어쓰기·문장 부호 무시, 최장 공통 부분) */
const IGN=/[\s.,!?~·'"“”‘’]/;
function compare(t,r){
  const ta=[...t], ra=[...r], A=[],Ai=[],B=[],Bi=[];
  ta.forEach((c,i)=>{if(!IGN.test(c)){A.push(c);Ai.push(i);}}); ra.forEach((c,i)=>{if(!IGN.test(c)){B.push(c);Bi.push(i);}});
  const n=A.length,m=B.length, dp=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=n-1;i>=0;i--) for(let j=m-1;j>=0;j--) dp[i][j]=A[i]===B[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
  const ma=new Set(),mb=new Set(); let i=0,j=0;
  while(i<n&&j<m){ if(A[i]===B[j]){ma.add(Ai[i]);mb.add(Bi[j]);i++;j++;} else if(dp[i+1][j]>=dp[i][j+1]) i++; else j++; }
  const paint=(arr,mt,cls)=>arr.map((c,k)=>IGN.test(c)||mt.has(k)?esc(c):`<mark class="${cls}">${esc(c)}</mark>`).join('');
  return {ht:paint(ta,ma,'miss'), hr:paint(ra,mb,'extra'), sim:n+m?Math.round(200*dp[0][0]/(n+m)):0, same:A.join('')===B.join('')};
}

/* 0 표지: 흘러가는 스펙트로그램과 자막 */
(function(){
  const c=$('coverSp'), x=c.getContext('2d'), W=c.width, H=c.height;
  x.fillStyle=PAL[0]; x.fillRect(0,0,W,H);
  const V=[[800,1250],[300,2300],[330,800],[480,1900],[450,900]];
  let left=0, gap=6, f0=180, F=V[0], burst=0, col=0;
  function column(){
    if(left<=0){ if(gap>0){gap--; return null;} left=6+Math.random()*6|0; F=V[Math.random()*V.length|0]; f0=150+Math.random()*90; burst=Math.random()<.6?2:0; gap=Math.random()<.3?6+Math.random()*4|0:1+Math.random()*2|0; }
    left--; f0+=(Math.random()-.5)*6; const out=new Uint8Array(H), env=Math.sin(Math.PI*(left+1)/9)*.4+.6;
    for(let y=0;y<H;y++){ const f=(H-1-y)/H*4000;
      let v; if(burst>0){ v=f>2200?(.25+Math.random()*.35)*f/4000:Math.random()*.06; }
      else{ const comb=Math.pow(Math.max(0,Math.cos(2*Math.PI*f/f0)),8), fm=Math.exp(-(((f-F[0])/260)**2))+.8*Math.exp(-(((f-F[1])/320)**2))+.12*Math.exp(-f/900); v=comb*fm*env+Math.random()*.05; }
      out[y]=Math.min(255,v*255|0); }
    if(burst>0) burst--; return out;
  }
  setInterval(()=>{ if(cur!==0||document.hidden) return;
    x.drawImage(c,-1,0); const d=column(); col++;
    for(let y=0;y<H;y++){ x.fillStyle=PAL[d?d[y]:Math.random()*10|0]; x.fillRect(W-1,y,1,1); } },45);
  const PH=['문이 닫힙니다.','같이 가자!','내가 그린 기린 그림','불 좀 꺼 줄래?'];
  let p=0,k=0,hold=0;
  setInterval(()=>{ if(cur!==0||document.hidden) return; const s=PH[p];
    if(k<=s.length){ $('capT').textContent=s.slice(0,k); k++; }
    else if(++hold>12){ hold=0;k=0;p=(p+1)%PH.length; $('capT').textContent=''; } },150);
})();

/* 1 주파수: 소리 만들기 */
(function(){
  const c=$('toneC'), x=c.getContext('2d'), W=c.width, H=c.height, s=$('toneF');
  let osc=null, gain=null, ph=0, raf=0;
  function draw(){
    const f=+s.value, cyc=f/100; x.clearRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,.15)'; x.lineWidth=1; x.beginPath(); x.moveTo(0,H/2); x.lineTo(W,H/2); x.stroke();
    x.strokeStyle='#f2a516'; x.lineWidth=4; x.beginPath();
    for(let i=0;i<=W;i+=2){ const y=H/2-H*.36*Math.sin(2*Math.PI*cyc*i/W-ph); i?x.lineTo(i,y):x.moveTo(i,y); } x.stroke();
    if(osc){ ph+=.25; raf=requestAnimationFrame(draw); }
  }
  function upd(){
    const f=+s.value, n=f/100, k=f<300?'천천히 반복되는 <b>저주파수</b>예요. 낮은 소리가 나요.':f>600?'빠르게 반복되는 <b>고주파수</b>예요. 높은 소리가 나요.':'중간 높이의 소리예요.';
    $('toneO').textContent=f+' Hz';
    $('toneSay').innerHTML=`화면은 0.01초 동안의 떨림이에요. 0.01초에 <b>${n}번</b> 떨리니 1초에는 <b>${f}번</b>, 곧 <b>${f} Hz</b>예요. ${k}`;
    if(osc) osc.frequency.setTargetAtTime(f,ac().currentTime,.02);
    if(!osc) draw();
  }
  function stop(){ if(!osc) return; const a=ac(); gain.gain.setTargetAtTime(0,a.currentTime,.03); const o=osc; setTimeout(()=>o.stop(),200); osc=null; cancelAnimationFrame(raf); $('tonePlay').textContent='▶ 소리 듣기'; $('tonePlay').classList.remove('on'); draw(); }
  $('tonePlay').onclick=()=>{
    if(osc){ stop(); return; }
    const a=ac(); osc=a.createOscillator(); gain=a.createGain(); osc.type='sine'; osc.frequency.value=+s.value;
    gain.gain.value=0; gain.gain.setTargetAtTime(.07,a.currentTime,.03); osc.connect(gain).connect(a.destination); osc.start();
    $('tonePlay').textContent='■ 멈추기'; $('tonePlay').classList.add('on'); draw();
  };
  s.oninput=upd;
  document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{s.value=b.dataset.f; upd();});
  window.toneStop=stop; upd();
})();

/* 1 주파수: 내 목소리 · 예시 목소리 */
(function(){
  const cw=$('micW'), xw=cw.getContext('2d'), cs=$('micS'), xs=cs.getContext('2d');
  let an=null, stream=null, src=null, demo=null, raf=0;
  xs.fillStyle=PAL[0]; xs.fillRect(0,0,cs.width,cs.height);
  xw.fillStyle='#0f2742'; xw.fillRect(0,0,cw.width,cw.height); xw.strokeStyle='#5fd3a5'; xw.lineWidth=2.5; xw.beginPath(); xw.moveTo(0,cw.height/2); xw.lineTo(cw.width,cw.height/2); xw.stroke();
  function analyser(){ if(!an){ an=ac().createAnalyser(); an.fftSize=2048; an.smoothingTimeConstant=.55; } return an; }
  const td=new Uint8Array(2048), fd=new Uint8Array(1024);
  function loop(){
    if(!stream&&!demo){ raf=0; return; }
    raf=requestAnimationFrame(loop);
    an.getByteTimeDomainData(td); an.getByteFrequencyData(fd);
    const W=cw.width,H=cw.height; xw.fillStyle='#0f2742'; xw.fillRect(0,0,W,H);
    xw.strokeStyle='#5fd3a5'; xw.lineWidth=2.5; xw.beginPath();
    for(let i=0;i<W;i++){ const v=td[Math.floor(i/W*td.length)]; const y=(v/255)*H; i?xw.lineTo(i,y):xw.moveTo(i,y);} xw.stroke();
    const SW=cs.width, SH=cs.height, hz=ac().sampleRate/2048, K=Math.min(fd.length-1,Math.floor(4000/hz));
    xs.drawImage(cs,-2,0);
    for(let y=0;y<SH;y++){ const b=Math.floor((1-y/SH)*K); xs.fillStyle=PAL[fd[b]]; xs.fillRect(SW-2,y,2,1); }
    let best=0,bi=0; for(let b=Math.ceil(80/hz);b<=Math.floor(1000/hz);b++) if(fd[b]>best){best=fd[b];bi=b;}
    $('micPeak').innerHTML=best>150?`가장 센 떨림 약 <b>${Math.round(bi*hz/10)*10} Hz</b>`:'소리를 기다리는 중…';
  }
  function start(){ if(!raf) loop(); }
  async function micOn(){
    warn('micErr','');
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){ warn('micErr','이 브라우저에서는 마이크를 쓸 수 없어요. 「예시 목소리로 보기」를 눌러 보세요.'); return; }
    try{ stream=await navigator.mediaDevices.getUserMedia({audio:true}); }
    catch(e){ stream=null; warn('micErr',e.name==='NotAllowedError'?'마이크 사용을 허락해야 볼 수 있어요. 주소창 왼쪽의 아이콘에서 마이크를 「허용」으로 바꿔 주세요. 마이크 없이 보려면 「예시 목소리로 보기」를 누르세요.':'마이크를 찾을 수 없어요. 「예시 목소리로 보기」를 눌러 보세요.'); return; }
    src=ac().createMediaStreamSource(stream); src.connect(analyser());
    $('micBtn').textContent='■ 마이크 끄기'; $('micBtn').classList.add('on'); start();
  }
  function micOff(){ if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; } if(src){ src.disconnect(); src=null; } $('micBtn').textContent='🎤 마이크 켜기'; $('micBtn').classList.remove('on'); }
  $('micBtn').onclick=()=>stream?micOff():micOn();
  window.micOff=micOff;
  $('vowBtn').onclick=()=>{
    if(demo) return; const a=ac(), t=a.currentTime+.05, o=a.createOscillator(), f1=a.createBiquadFilter(), f2=a.createBiquadFilter(), g=a.createGain(), out=a.createGain();
    o.type='sawtooth'; [f1,f2].forEach(f=>{f.type='bandpass';f.Q.value=7;}); g.gain.value=0; out.gain.value=.9;
    o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(out); out.connect(a.destination); out.connect(analyser());
    const seq=[['아',800,1250],['이',300,2300],['우',330,800],['아',800,1250],['이',300,2300],['우',330,800]];
    seq.forEach(([v,a1,a2],k)=>{ const s=t+k*.8; f1.frequency.setValueAtTime(a1,s); f2.frequency.setValueAtTime(a2,s); o.frequency.setValueAtTime(140+k*6,s); o.frequency.linearRampToValueAtTime(165+k*6,s+.6);
      g.gain.setTargetAtTime(.5,s,.03); g.gain.setTargetAtTime(0,s+.6,.03); setTimeout(()=>{$('vowBtn').textContent=`지금: "${v}—"`;},(s-a.currentTime)*1000); });
    o.start(t); o.stop(t+seq.length*.8+.2); demo=o; start();
    o.onended=()=>{ demo=null; out.disconnect(); $('vowBtn').textContent='예시 목소리로 보기 (아·이·우)'; };
  };
})();

/* 2 음소 나누기 */
(function(){
  const CHO='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ', JUNG='ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ', JONG=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  function run(){
    const w=$('phIn').value.trim(), out=$('phOut'); out.innerHTML=''; let syl=0, ph=0, d=0;
    for(const ch of w){
      const c=ch.charCodeAt(0);
      if(ch===' '){ const g=document.createElement('div'); g.className='syl gap'; out.appendChild(g); continue; }
      const box=document.createElement('div'); box.className='syl'; box.style.animationDelay=(d*.06)+'s';
      if(c>=0xAC00&&c<=0xD7A3){
        const i=c-0xAC00, ci=Math.floor(i/588), vi=Math.floor(i%588/28), fi=i%28; syl++;
        const parts=[[CHO[ci],ci===11?'z':'c'],[JUNG[vi],'v']]; if(fi) parts.push([JONG[fi],'f']);
        ph+=parts.filter(p=>p[1]!=='z').length;
        box.innerHTML=`<b>${ch}</b><div class="jm">${parts.map((p,k)=>`<span class="${p[1]}" style="animation-delay:${d*.06+.15+k*.08}s">${p[0]}</span>`).join('')}</div>`;
      } else box.innerHTML=`<b>${esc(ch)}</b><div class="jm"><span class="z">?</span></div>`;
      out.appendChild(box); d++;
    }
    $('phSay').innerHTML=syl?`글자 <b>${syl}개</b>를 소리 단위로 나누면 <b>${ph}개</b>예요. 음성 인식은 말소리에서 이런 작은 소리 단위를 하나하나 찾아내요.`:'한글 낱말을 넣어 보세요.';
  }
  $('phGo').onclick=run; $('phIn').addEventListener('keydown',e=>{if(e.key==='Enter') run();});
  $('phPre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; $('phIn').value=b.dataset.w; run();};
  onShow[2]=run;

  const P=[['같이','가치'],['굳이','구지'],['해돋이','해도지'],['국물','궁물'],['신라','실라'],['닫혀요','다처요']];
  $('prons').innerHTML=P.map(([w,s])=>`<div class="pron"><b>${w}</b><span>[${s}]</span><button class="btn ghost sm" data-w="${w}">🔊 듣기</button></div>`).join('');
  $('prons').onclick=e=>{const b=e.target.closest('button'); if(!b) return; const ok=say(b.dataset.w,{rate:.85}); if(!ok) $('ttsNote').innerHTML='⚠️ 이 브라우저에서 한국어 읽어 주기 목소리를 찾지 못했어요. 선생님이나 친구가 직접 소리 내어 읽어 보세요.';};
})();

/* 3 엘리베이터: 두 방식 비교 (그림 Ⅱ-30) */
(function(){
  let busy=false;
  const reset=()=>{ $('dL').setAttribute('width',40); $('dR').setAttribute('x',184); $('dR').setAttribute('width',40); $('bub').setAttribute('opacity',0); $('waveG').setAttribute('opacity',0);
    $('heard').innerHTML='&nbsp;'; ['wRule','wDl'].forEach(i=>$(i).classList.remove('on')); $('oRule').textContent='…'; $('sRule').textContent=''; $('oDl').innerHTML=''; $('sDl').textContent=''; };
  function wave(t){ let d='M180 92'; for(let i=0;i<=120;i+=3){ const a=Math.sin(i/9+t)*Math.sin(i/120*Math.PI)*14*(1+.5*Math.sin(i/4+t*2)); d+=` L${180+i} ${92+a}`; } $('waveP').setAttribute('d',d); }
  $('elevGo').onclick=async()=>{
    if(busy) return; busy=true; reset(); $('elevGo').disabled=true;
    await sleep(300); $('bub').setAttribute('opacity',1); $('waveG').setAttribute('opacity',1);
    say('문이 닫힙니다.',{rate:.95});
    for(let k=0;k<30;k++){ wave(k*.5); await sleep(50); }
    $('heard').innerHTML='들린 소리 <span style="color:var(--red)">[무니 다침니다]</span>';
    await sleep(700); $('wRule').classList.add('on'); $('oRule').textContent='문이 다칩니다.';
    await sleep(500); $('sRule').innerHTML='✗ 저장된 정보대로 글자를 맞췄더니 엉뚱한 문장! (\'다치다\'는 \'상처를 입다\'라는 뜻)';
    await sleep(900); $('wDl').classList.add('on');
    $('oDl').innerHTML=[['문이 다칩니다.',12],['문이 닫힙니다.',88]].map(([t,p])=>`<div class="cand" data-p="${p}"><span>${t}</span><div class="bar"><i></i></div><b>${p}%</b></div>`).join('');
    await sleep(60); $('oDl').querySelectorAll('.cand').forEach(c=>c.querySelector('i').style.width=c.dataset.p+'%');
    await sleep(800); $('oDl').children[1].classList.add('best'); $('sDl').innerHTML='✔ 자주 쓰이는 표현인 \'문이 닫힙니다.\'로 변환';
    $('dL').setAttribute('width',84); $('dR').setAttribute('x',140); $('dR').setAttribute('width',84);
    $('waveG').setAttribute('opacity',0);
    $('elevGo').disabled=false; $('elevGo').textContent='↻ 다시 보기'; busy=false;
  };
})();

/* 3 말하는 사람마다 다른 목소리 */
(function(){
  const GOOD='문이 닫힙니다.';
  const S=[{n:'저장된 목소리와 비슷한 사람',p:1,r:1,v:1,sim:92,rule:'문이 다칩니다.',t:'규칙에 맞춰 저장해 둔 목소리와 높낮이·빠르기가 거의 같아요.'},
           {n:'목소리가 높은 어린이',p:1.9,r:1.05,v:1,sim:55,rule:'무니 다치미다.',t:'목소리가 높아서 주파수가 저장된 정보와 달라요.'},
           {n:'작고 낮은 목소리',p:.5,r:.85,v:.35,sim:44,rule:'누니 타침니다.',t:'소리가 작고 낮아서 일부 음소를 다른 소리로 착각했어요.'},
           {n:'아주 빠르게 말하는 친구',p:1,r:1.9,v:1,sim:36,rule:'문 다침다.',t:'너무 빨라서 음소 몇 개를 놓쳤어요.'}];
  let k=0;
  $('spk').innerHTML=S.map((s,i)=>`<button class="chip${i?'':' on'}" data-i="${i}">${s.n}</button>`).join('');
  function show(){ const s=S[k]; [...$('spk').children].forEach((b,i)=>b.classList.toggle('on',i===k));
    $('spkTxt').textContent=s.t; $('simO').textContent=s.sim+'%'; $('simM').style.width=s.sim+'%';
    $('spkRule').innerHTML=compare(GOOD,s.rule).hr; $('spkDl').innerHTML=`${GOOD} <span class="ok">✔</span>`; }
  $('spk').onclick=e=>{const b=e.target.closest('button'); if(!b) return; k=+b.dataset.i; show();};
  $('spkSay').onclick=()=>{const s=S[k]; say(GOOD,{pitch:s.p,rate:s.r,volume:s.v});};
  show();
})();

/* 3 확률이 높은 문장 고르기 */
(function(){
  const G=[{s:'가치 가자',o:['가치 가자','같이 가자'],p:[6,94],a:1,w:'\'가자\' 앞에는 \'함께\'라는 뜻의 \'같이\'가 훨씬 자주 와요.'},
           {s:'가치가 놉따',o:['가치가 높다','같이가 높다'],p:[97,3],a:0,w:'같은 [가치]인데 이번에는 \'가치\'예요! 뒤에 \'높다\'가 오면 \'값어치\'라는 뜻이 자연스러워요. 앞뒤 말이 답을 바꿔요.'},
           {s:'해도지 보러 가자',o:['해돋이 보러 가자','해도지 보러 가자'],p:[91,9],a:0,w:'\'해도지\'라는 말은 거의 쓰이지 않아요. 학습한 문장들 속에서 \'해돋이 보러\'가 훨씬 자주 나와요.'},
           {s:'궁무리 뜨거워',o:['궁물이 뜨거워','국물이 뜨거워'],p:[4,96],a:1,w:'[궁물]로 소리 나도 글자는 \'국물\'이에요. 많은 문장을 학습한 모델은 \'국물이 뜨거워\'가 자연스럽다는 것을 알아요.'},
           {s:'무니 다침니다',o:['문이 다칩니다','문이 닫힙니다'],p:[12,88],a:1,w:'엘리베이터나 자동문에서 자주 쓰이는 표현은 \'문이 닫힙니다\'예요.'}];
  let k=0;
  $('gzTabs').innerHTML=G.map((g,i)=>`<button class="chip${i?'':' on'}" data-i="${i}">문제 ${i+1}</button>`).join('');
  function show(){ const g=G[k]; [...$('gzTabs').children].forEach((b,i)=>b.classList.toggle('on',i===k));
    $('gzSound').innerHTML=`들린 소리 <span style="color:var(--red)">[${g.s}]</span>`;
    $('gzOpts').innerHTML=g.o.map((o,i)=>`<button data-i="${i}">${o}</button>`).join(''); $('gzBars').innerHTML=''; $('gzWhy').textContent='인공지능은 어느 문장을 고를까요?'; }
  $('gzTabs').onclick=e=>{const b=e.target.closest('button'); if(!b) return; k=+b.dataset.i; show();};
  $('gzOpts').onclick=async e=>{const b=e.target.closest('button'); if(!b||b.disabled) return; const g=G[k], j=+b.dataset.i;
    [...$('gzOpts').children].forEach((x,i)=>{x.disabled=true; if(i===g.a) x.classList.add('right'); else if(i===j) x.classList.add('wrong');});
    $('gzBars').innerHTML=g.o.map((o,i)=>`<div class="cand${i===g.a?' best':''}"><span>${o}</span><div class="bar"><i></i></div><b>${g.p[i]}%</b></div>`).join('');
    await sleep(40); [...$('gzBars').children].forEach((c,i)=>c.querySelector('i').style.width=g.p[i]+'%');
    $('gzWhy').innerHTML=(j===g.a?'<span class="ok">맞았어요!</span> ':'<span class="ng">인공지능은 다른 쪽을 골라요.</span> ')+g.w;};
  show();
})();

/* 4 직접 말해 보기 */
(function(){
  let target='', last='', t0=0;
  $('srPre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; target=b.dataset.t; [...$('srPre').children].forEach(c=>c.classList.toggle('on',c===b)); $('srTarget').textContent='읽을 문장 · '+target; $('srCmp').textContent='';};
  if(!SRC) warn('srErr',NO_SR);
  $('srBtn').onclick=()=>listen($('srBtn'),{
    onStart(){ warn('srErr',''); last=''; t0=performance.now(); $('srLog').innerHTML=''; $('srCmp').textContent=''; $('srLive').innerHTML='<span class="ph">듣고 있어요… 말해 보세요.</span>'; },
    onText(f,it){ $('srLive').innerHTML=`<span class="fin">${esc(f)}</span><span class="int">${esc(it)}</span>`;
      const all=(f+it).trim(); if(!all||all===last) return;
      const fix=last&&!all.startsWith(last); const li=document.createElement('li'); if(fix) li.className='fix';
      li.innerHTML=`<small>${((performance.now()-t0)/1000).toFixed(1)}초</small>${esc(all)}${fix?' <b style="color:#b07400">← 고쳤어요</b>':''}`; $('srLog').appendChild(li); $('srLog').scrollTop=1e5; last=all; },
    onErr(m){ warn('srErr',m); },
    onDone(f){ if(!f){ if(!$('srLog').children.length) $('srLive').innerHTML='<span class="ph">인식된 말이 없어요. 다시 눌러 말해 보세요.</span>'; return; }
      $('srLive').innerHTML=`<span class="fin">${esc(f)}</span>`;
      if(!$('srLog').querySelector('.fix')&&$('srLog').children.length) { const li=document.createElement('li'); li.className='empty'; li.textContent='이번에는 고친 순간이 없었어요. 문장을 길게 말하거나, 같이·해돋이처럼 헷갈리는 말을 넣어 다시 해 보세요.'; $('srLog').appendChild(li); }
      if(target){ const c=compare(target,f); $('srCmp').innerHTML=c.same?'<span class="ok">✔ 읽을 문장과 같게 인식했어요.</span>':`<span class="ng">읽을 문장과 달라요</span> · ${c.hr}`; } }
  });
})();

/* 5 활용: 탭 · 말로 움직이는 방 */
$('apps').onclick=e=>{const b=e.target.closest('button'); if(!b) return; const a=b.dataset.a; [...$('apps').children].forEach(x=>x.classList.toggle('on',x===b)); document.querySelectorAll('.appd').forEach(d=>d.classList.toggle('on',d.dataset.a===a));};
(function(){
  const st={light:false,cur:false,music:false};
  function draw(){ $('rmWall').setAttribute('fill',st.light?'#f6efe2':'#3a3f4b'); $('rmGlow').setAttribute('opacity',st.light?.55:0); $('rmBulb').setAttribute('fill',st.light?'#ffd65a':'#8a8f99');
    $('rmCL').setAttribute('width',st.cur?81:14); $('rmCR').setAttribute('x',st.cur?115:182); $('rmCR').setAttribute('width',st.cur?81:14); $('rmNotes').classList.toggle('on',st.music); }
  function run(t){
    const s=t.replace(/\s/g,''), off=/(꺼|끄|끈|멈|정지|그만)/.test(s), on=/(켜|켠|틀|재생|들려)/.test(s);
    let r=null;
    if(/(불|조명|전등|라이트)/.test(s)&&(on||off)){ st.light=on&&!off; r=st.light?'💡 불을 켰어요.':'🌙 불을 껐어요.'; }
    else if(/커튼/.test(s)&&/(닫|치)/.test(s)){ st.cur=true; r='커튼을 닫았어요.'; }
    else if(/커튼/.test(s)&&/(열|걷)/.test(s)){ st.cur=false; r='커튼을 열었어요.'; }
    else if(/(음악|노래)/.test(s)&&(on||off)){ st.music=on&&!off; r=st.music?'🎵 음악을 틀었어요.':'음악을 껐어요.'; }
    draw();
    $('cmdRes').innerHTML=`인식한 말 「${esc(t)}」 → `+(r?`<span class="ok">${r}</span>`:'<span class="ng">알아듣지 못한 명령이에요.</span> 불·커튼·음악에 대해 말해 보세요.');
  }
  $('cmdGo').onclick=()=>{const t=$('cmdIn').value.trim(); if(t) run(t);};
  $('cmdIn').addEventListener('keydown',e=>{if(e.key==='Enter') $('cmdGo').click();});
  $('cmdMic').onclick=()=>listen($('cmdMic'),{onStart(){$('cmdRes').textContent='듣고 있어요…';},onText(f,it){$('cmdIn').value=f+it;},onErr(m){$('cmdRes').innerHTML=`<span class="ng">${esc(m)}</span>`;},onDone(f){if(f) run(f);}});
  draw();
})();

/* 6 발음 연습 */
(function(){
  const TW=['내가 그린 기린 그림은 잘 그린 기린 그림이고 네가 그린 기린 그림은 잘 못 그린 기린 그림이다','간장 공장 공장장은 강 공장장이고 된장 공장 공장장은 공 공장장이다','경찰청 철창살은 외철창살이냐 쌍철창살이냐','들의 콩깍지는 깐 콩깍지인가 안 깐 콩깍지인가'];
  const NM=['기린 그림 (교과서)','간장 공장','경찰청 철창살','콩깍지','직접 입력'];
  let k=0, hist=[];
  $('twPre').innerHTML=NM.map((n,i)=>`<button class="chip${i?'':' on'}" data-i="${i}">${n}</button>`).join('');
  const text=()=>k<TW.length?TW[k]:$('twIn').value.trim();
  function showT(){ [...$('twPre').children].forEach((b,i)=>b.classList.toggle('on',i===k)); $('twIn').style.display=k<TW.length?'none':'block';
    $('twT').innerHTML=text()?`text = <span>${esc(text())}</span>`:'<span class="muted" style="font-weight:400">연습할 문장을 입력하세요.</span>'; }
  $('twPre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; k=+b.dataset.i; showT(); $('twOut').style.display='none'; if(k===TW.length) $('twIn').focus();};
  $('twIn').oninput=showT;
  function check(){
    const t=text(), r=$('twRec').value.trim(); if(!t||!r) return; const c=compare(t,r), ok=t===r;
    $('twOut').style.display='block';
    $('twV').innerHTML=ok?'<span class="ok">완벽한 발음입니다!</span>':'<span class="ng">연습이 필요합니다!</span>';
    $('twSpace').innerHTML=!ok&&c.same?'💡 글자는 모두 같고 <b>띄어쓰기나 문장 부호만</b> 달라요. 교과서 코드는 이것도 다르다고 판단해요. ⑤의 「더 해 보기」를 보세요.':ok?'두 문장이 띄어쓰기까지 똑같아요.':'';
    $('twSim').textContent=`글자 일치율 ${c.sim}%`; $('twSimM').style.width=c.sim+'%';
    $('twA').innerHTML=c.ht; $('twB').innerHTML=c.hr;
  }
  $('twCmp').onclick=check; $('twRec').addEventListener('keydown',e=>{if(e.key==='Enter') check();});
  $('twMic').onclick=()=>{ if(!text()){ $('twIn').focus(); return; } listen($('twMic'),{onStart(){warn('twErr',''); $('twRec').value='';},onText(f,it){$('twRec').value=f+it;},onErr(m){warn('twErr',m);},onDone(f){ if(f){ $('twRec').value=f; check(); } }}); };
  if(!SRC) warn('twErr',NO_SR);
  showT();

  document.querySelectorAll('.cp').forEach(b=>b.onclick=async()=>{const t=b.nextElementSibling.textContent; try{await navigator.clipboard.writeText(t); b.textContent='복사했어요!';}catch(e){b.textContent='복사가 안 되면 선생님께 말해 주세요';} setTimeout(()=>b.textContent='복사',1500);});

  const WK=QK+'-work'; let W={}; try{W=JSON.parse(localStorage.getItem(WK)||'{}')||{};}catch(e){}
  const fields=[...document.querySelectorAll('.t9 input')];
  fields.forEach(f=>{const key=f.id||f.dataset.k; if(W[key]) f.value=W[key]; f.addEventListener('input',()=>{W[key]=f.value; try{localStorage.setItem(WK,JSON.stringify(W));}catch(e){}});});
})();

/* 화면을 떠나면 소리 멈추기 */
const _go=go;
go=function(i){ if(window.toneStop) toneStop(); if(window.micOff) micOff(); if(REC) try{REC.abort();}catch(e){} if('speechSynthesis' in window) speechSynthesis.cancel(); _go(i); };



const MEMOLIST=[['w1','도울 방법'],['w2','음성 인식 기술을 활용하면 좋은 점']];
onShow[7]=()=>memoSummary('msum',MEMOLIST);
