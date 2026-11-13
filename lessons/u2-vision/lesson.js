
/* 0 표지: 픽셀 위를 지나가는 필터 */
(function(){
  const c=$('coverPx'), x=c.getContext('2d'), W=c.width, H=c.height;
  const base=[]; for(let j=0;j<H;j++) for(let i=0;i<W;i++){
    const dx=(i-26)/9, dy=(j-17)/10, face=dx*dx+dy*dy<1;
    const eye=((i-23)**2+(j-14)**2<2.2)||((i-29)**2+(j-14)**2<2.2);
    const mouth=j===21&&i>22&&i<30;
    const earL=j<9&&j>3&&Math.abs(i-19.5)<(j-3)*.55, earR=j<9&&j>3&&Math.abs(i-32.5)<(j-3)*.55;
    let v=(face||earL||earR)?.62:.10+.06*Math.random(); if(eye||mouth) v=.05; base.push(v);}
  let fx=0, fy=0;
  function draw(){
    if(cur!==0||document.hidden) return;
    for(let j=0;j<H;j++) for(let i=0;i<W;i++){
      let v=base[j*W+i]; const inF=i>=fx&&i<fx+3&&j>=fy&&j<fy+3;
      const g=Math.round(30+v*170); x.fillStyle=inF?`rgb(${242},${165},${22})`:`rgb(${g*.55|0},${g*.75|0},${g})`; x.fillRect(i,j,1,1);}
    fx++; if(fx>W-3){fx=0; fy+=1; if(fy>H-3) fy=0;}
  }
  setInterval(draw,70);
})();

/* 1 픽셀 */
(function(){
  const N=16, g=$('pxGrid'); let mode='pic', V=[], down=false;
  function ball(){V=[];for(let j=0;j<N;j++)for(let i=0;i<N;i++){const dx=i-7.5,dy=j-7.5,r=Math.sqrt(dx*dx+dy*dy);
    if(r>6.6){V.push(0);continue;} const hl=Math.sqrt((i-5.2)**2+(j-5)**2); V.push(Math.max(40,Math.min(255,Math.round(255-hl*26))));}}
  ball();
  const cells=[]; for(let k=0;k<N*N;k++){const d=document.createElement('div'); d.dataset.k=k; g.appendChild(d); cells.push(d);}
  function paint(k){const v=V[k], d=cells[k]; d.style.background=`rgb(${v},${v},${v})`; d.style.color=v>140?'#111':'#eee'; d.textContent=mode==='num'?v:'';}
  function all(){for(let k=0;k<N*N;k++) paint(k); g.classList.toggle('nums',mode==='num');}
  function info(k){const v=V[k]; $('pxInfo').innerHTML=`<span class="sw" style="background:rgb(${v},${v},${v})"></span><span>${Math.floor(k/N)+1}행 ${k%N+1}열 픽셀값 <b class="big" style="font-size:1.15rem">${v}</b> · ${v===0?'완전히 검은색':v===255?'완전히 흰색':v<128?'어두운 쪽':'밝은 쪽'}</span>`;}
  function hit(e){const t=document.elementFromPoint(e.clientX,e.clientY); return t&&t.parentNode===g?+t.dataset.k:null;}
  g.addEventListener('pointerdown',e=>{down=true; if(mode==='draw') g.setPointerCapture(e.pointerId); act(e);});
  g.addEventListener('pointermove',act); window.addEventListener('pointerup',()=>down=false);
  function act(e){const k=hit(e); if(k==null) return; if(mode==='draw'&&down){V[k]=+$('brushV').value; paint(k);} info(k);}
  $('pxMode').onclick=e=>{const b=e.target.closest('button'); if(!b) return; mode=b.dataset.m; [...$('pxMode').children].forEach(c=>c.classList.toggle('on',c===b)); $('pxBrush').style.display=mode==='draw'?'block':'none'; all();};
  $('brushV').oninput=()=>$('brushO').textContent=$('brushV').value;
  $('pxClear').onclick=()=>{V=V.map(()=>0);all();}; $('pxReset').onclick=()=>{ball();all();};
  all();
})();

/* 1 RGB */
(function(){
  const r=$('cR'),g=$('cG'),b=$('cB');
  const NAME={'255,0,0':'빨강','0,255,0':'초록','0,0,255':'파랑','255,255,0':'노랑 (빨강 + 초록)','0,0,0':'검은색 (빛이 하나도 없음)','255,255,255':'흰색 (세 빛을 모두 가장 밝게)','0,255,255':'청록색 (초록 + 파랑)','255,0,255':'자홍색 (빨강 + 파랑)'};
  function up(){const v=[r.value,g.value,b.value]; $('oR').textContent=v[0];$('oG').textContent=v[1];$('oB').textContent=v[2];
    $('sw').style.background=`rgb(${v})`; $('swT').textContent=`(${v.join(', ')})`;
    const n=NAME[v.join(',')]; $('rgbSay').innerHTML=n?`이 픽셀은 숫자 <b>${v.join(', ')}</b> 세 개로 저장된 <b>${n}</b>이에요.`:`이 픽셀은 숫자 <b>${v.join(', ')}</b> 세 개로 저장돼요. 컴퓨터에게 색은 언제나 숫자 3개예요.`;}
  [r,g,b].forEach(s=>s.oninput=up);
  $('rgbPre').onclick=e=>{const t=e.target.closest('button'); if(!t) return; const c=t.dataset.c.split(','); r.value=c[0];g.value=c[1];b.value=c[2]; up();};
  up();
})();

/* 2 4대 분야 */
(function(){
  const s1=$('sc1'), s2=$('sc2'), mk=$('cvMarks');
  function cat(p,x,y,s,c){const g=el('g',{class:'ani',transform:`translate(${x},${y}) scale(${s})`,style:`--sc:${c}`},p);
    el('path',{d:'M40 52 Q92 44 80 -4',stroke:'#e08a35','stroke-width':11,fill:'none','stroke-linecap':'round'},g);
    el('ellipse',{cx:0,cy:40,rx:46,ry:38,fill:'#f0a04b'},g);
    el('polygon',{points:'-32,-46 -24,-82 -4,-60',fill:'#f0a04b'},g); el('polygon',{points:'32,-46 24,-82 4,-60',fill:'#f0a04b'},g);
    el('circle',{cx:0,cy:-30,r:34,fill:'#f4ad5d'},g);
    el('circle',{cx:-12,cy:-34,r:4.5,fill:'#2b2b2b'},g); el('circle',{cx:12,cy:-34,r:4.5,fill:'#2b2b2b'},g);
    el('path',{d:'M-6 -20 L0 -15 L6 -20',stroke:'#2b2b2b','stroke-width':2.5,fill:'none'},g); return g;}
  function dog(p,x,y,s,c,col){const g=el('g',{class:'ani',transform:`translate(${x},${y}) scale(${s})`,style:`--sc:${c}`},p);
    el('ellipse',{cx:0,cy:42,rx:54,ry:40,fill:col},g);
    el('circle',{cx:0,cy:-28,r:36,fill:col},g);
    el('ellipse',{cx:-34,cy:-22,rx:12,ry:27,fill:'#6e4a2f',transform:'rotate(18 -34 -22)'},g); el('ellipse',{cx:34,cy:-22,rx:12,ry:27,fill:'#6e4a2f',transform:'rotate(-18 34 -22)'},g);
    el('ellipse',{cx:0,cy:-12,rx:17,ry:12,fill:'#f2e3cf'},g); el('ellipse',{cx:0,cy:-17,rx:6,ry:4.5,fill:'#2b2b2b'},g);
    el('circle',{cx:-13,cy:-36,r:4.5,fill:'#2b2b2b'},g); el('circle',{cx:13,cy:-36,r:4.5,fill:'#2b2b2b'},g); return g;}
  cat(s1,300,170,1.15,'#f2a516');
  dog(s2,120,175,.95,'#2f6fd0','#b07a4f'); dog(s2,285,182,.85,'#1f9d74','#d9b98f'); cat(s2,465,180,.9,'#d64535');
  const BOX={1:[[238,66,152,192,'#f2a516','Cat']],2:[[63,107,114,152,'#2f6fd0','Dog'],[234,120,102,136,'#1f9d74','Dog'],[420,103,129,148,'#d64535','Cat']]};
  const RES=[
    ['Cat','이미지 전체를 하나의 객체로 보고 <b>어떤 범주에 속하는지</b>만 답해요. "이건 고양이 사진이야."'],
    ['Cat + Area','이미지 안에 객체가 <b>하나</b>일 때, 무엇인지와 함께 <b>어디에 있는지</b>를 사각형으로 알려 줘요.'],
    ['Dog, Dog, Cat','실제 사진에는 객체가 여러 개인 경우가 많죠. <b>여러 객체 각각의 위치</b>를 찾고 <b>무엇인지까지</b> 분류해요.'],
    ['Dog, Dog, Cat (픽셀 단위)','사각형으로 대충 정하지 않고 객체에 속하는 범위를 <b>픽셀 하나하나 단위</b>로 칠해요. 자율 주행 자동차가 도로와 사람의 경계를 정확히 알아야 할 때 써요.']];
  function show(m){
    s1.style.display=m<2?'':'none'; s2.style.display=m>=2?'':'none';
    $('cvScene').classList.toggle('seg',m===3); mk.innerHTML='';
    if(m===0){el('rect',{x:6,y:6,width:588,height:308,rx:12,fill:'none',stroke:'#f2a516','stroke-width':6},mk);}
    (BOX[m]||[]).forEach(([x,y,w,h,c,t])=>{el('rect',{x,y,width:w,height:h,rx:4,fill:'none',stroke:c,'stroke-width':4,'stroke-dasharray':'10 6'},mk);});
    const lab=m===3?BOX[2]:BOX[m]||[[18,18,0,0,'#f2a516','Cat']];
    lab.forEach(([x,y,w,h,c,t])=>{const tx=m===0?22:x, ty=m===0?24:y-30; const g=el('g',{},mk); el('rect',{x:tx,y:ty,width:t.length*12+22,height:28,rx:6,fill:c},g); el('text',{x:tx+11,y:ty+20,fill:'#fff','font-size':17,'font-weight':900,'font-family':'Noto Sans KR'},g,t);});
    $('cvRes').innerHTML=`<b style="font-size:1.1rem;color:var(--acc)">결과: ${RES[m][0]}</b><br>${RES[m][1]}`;
    [...$('cvFields').children].forEach(d=>d.classList.toggle('on',+d.dataset.m===m));
  }
  $('cvFields').onclick=e=>{const d=e.target.closest('[data-m]'); if(d) show(+d.dataset.m);};
  show(0);

  const OBJ='비행기 사과 배낭 바나나 야구방망이 야구글러브 곰 침대 벤치 자전거 새 보트 책 병 사발 브로콜리 버스 케이크 자동차 당근 고양이 휴대폰 의자 시계 침상 소 컵 식탁 개 도넛 코끼리 소화전 포크 프리스비 기린 헤어드라이어 핸드백 말 핫도그 키보드 연 칼 노트북 전자레인지 오토바이 마우스 오렌지 오븐 주차미터기 사람 피자 화분 냉장고 리모컨 샌드위치 가위 양 싱크대 스케이트보드 스키 스노우보드 숟가락 스포츠공 정지신호 여행가방 서핑보드 곰인형 테니스라켓 넥타이 토스터 화장실 칫솔 신호등 기차 트럭 TV 우산 꽃병 와인잔 얼룩말'.split(' ');
  const ALIAS={'강아지':'개','핸드폰':'휴대폰','스마트폰':'휴대폰','폰':'휴대폰','소파':'침상','변기':'화장실','텔레비전':'TV','티비':'TV','가방':'배낭 / 핸드백 / 여행가방','공':'스포츠공','학생':'사람','차':'자동차','노트북컴퓨터':'노트북','그릇':'사발','테이블':'식탁'};
  $('objList').innerHTML=OBJ.map(o=>`<span>${o}</span>`).join('');
  function find(){const q=$('objQ').value.trim().replace(/\s/g,''); if(!q){$('objRes').textContent='';return;}
    const hit=OBJ.find(o=>o===q)||ALIAS[q];
    $('objRes').innerHTML=hit?`<span class="ok">✅ 「${q}」 → ${hit===q?'목록에 있어요.':'「'+hit+'」(으)로 들어 있어요.'} 사진에 있으면 탐지할 수 있어요.</span>`:`<span class="ng">❌ 「${q}」은(는) 80가지 목록에 없어요. 사진에 또렷이 보여도 이 인공지능은 찾지 못해요.</span>`;}
  $('objBtn').onclick=find; $('objQ').addEventListener('keydown',e=>{if(e.key==='Enter') find();});
  $('objAll').onclick=()=>{const o=$('objList').classList.toggle('open'); $('objAll').textContent=o?'목록 접기':'80가지 모두 보기';};
})();

/* 3 왜 CNN: 가중치 수 */
(function(){
  const R=[['손글씨 28×28 흑백',28*28],['100×100 컬러',100*100*3],['224×224 컬러',224*224*3],['1,000×1,000 컬러',1000*1000*3]];
  const mx=Math.log10(R[3][1]*100);
  $('params').innerHTML=R.map(([n,v])=>`<div class="pr"><span>${n}</span><div class="bar"><i data-w="${(Math.log10(v*100)/mx*100).toFixed(1)}"></i></div><span class="v">${fmt(v*100)}개</span></div>`).join('')+
    '<div class="muted" style="font-size:.8rem">막대는 자릿수 기준(로그)으로 그렸어요. 실제 차이는 훨씬 커요. 손글씨 784 × 100 = 78,400은 지난 시간 모델의 첫 층 가중치 수예요.</div>';
  onShow[3]=()=>{document.querySelectorAll('#params i').forEach(i=>{i.style.width=0; requestAnimationFrame(()=>requestAnimationFrame(()=>i.style.width=i.dataset.w+'%'));}); layoutFlat();};
})();

/* 3 왜 CNN: 한 줄로 펴기 */
let flatOn=false;
const FL=$('flat'), FN=6, fcells=[];
for(let k=0;k<FN*FN;k++){const i=document.createElement('i'); const on=k%FN===2; i.className=on?'on':'off'; FL.appendChild(i); fcells.push(i);
  i.onmouseenter=()=>hlFlat(k); i.onclick=()=>hlFlat(k);}
function layoutFlat(){
  const W=FL.clientWidth||600; const fs=Math.min(30,Math.floor((W-2)/FN/1.6)); const ls=Math.max(6,Math.floor((W-2)/(FN*FN)));
  const gridW=fs*FN; FL.style.height=(flatOn?ls+8:gridW+4)+'px';
  fcells.forEach((c,k)=>{const r=Math.floor(k/FN), q=k%FN;
    if(flatOn){c.style.left=(k*ls)+'px'; c.style.top='4px'; c.style.width=c.style.height=(ls-1)+'px'; c.style.transitionDelay=(k*18)+'ms';}
    else{c.style.left=((W-gridW)/2+q*fs)+'px'; c.style.top=(r*fs)+'px'; c.style.width=c.style.height=(fs-2)+'px'; c.style.transitionDelay=((35-k)*12)+'ms';}});
}
function hlFlat(k){fcells.forEach(c=>c.classList.remove('hl')); const up=k-FN, dn=k+FN; [k,up,dn].forEach(j=>{if(j>=0&&j<FN*FN) fcells[j].classList.add('hl');});
  $('flatSay').textContent=`${k+1}번째 칸의 위아래 이웃은 ${up>=0?(up+1)+'번째':'없음'}, ${dn<FN*FN?(dn+1)+'번째':'없음'} 칸 → 한 줄에서는 ${FN}칸씩 떨어져요.`;}
$('flatBtn').onclick=()=>{flatOn=!flatOn; $('flatBtn').textContent=flatOn?'원래대로':'한 줄로 펴기'; layoutFlat(); hlFlat(14);};
window.addEventListener('resize',()=>{if(cur===3) layoutFlat();});

/* 3 CNN 구조도 · 층별 특징 */
(function(){
  const s=$('cnnSvg');
  const fg=el('g',{},s); el('rect',{x:16,y:56,width:110,height:110,rx:8,fill:'#e9edf2',stroke:'#9aa5b4'},fg);
  el('circle',{cx:71,cy:106,r:34,fill:'#f4d2b4'},fg); el('circle',{cx:59,cy:100,r:4,fill:'#333'},fg); el('circle',{cx:83,cy:100,r:4,fill:'#333'},fg);
  el('path',{d:'M60 120 Q71 128 82 120',stroke:'#333','stroke-width':3,fill:'none'},fg); el('path',{d:'M38 96 Q40 62 71 64 Q102 62 104 96 Q96 74 71 76 Q46 74 38 96Z',fill:'#5b3a29'},fg);
  el('text',{x:71,y:186,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#334'},fg,'입력 이미지');
  const blocks=[[160,150,'#fde8d6','#e0702b'],[250,120,'#fde8d6','#e0702b'],[330,92,'#fde8d6','#e0702b']];
  let x0=150; const lay=[];
  blocks.forEach(([x,h],i)=>{const g=el('g',{class:'blk'},s); const y=111-h/2;
    for(let d=3;d>=0;d--) el('rect',{x:x+d*7,y:y-d*5,width:26,height:h,rx:3,fill:d?'#fbe1cc':'#fde8d6',stroke:'#e0702b','stroke-width':1.5},g);
    el('rect',{x:x+50,y:y+h*.2,width:16,height:h*.6,rx:3,fill:'#f6c9c3',stroke:'#d64535','stroke-width':1.5},g);
    el('text',{x:x+30,y:200,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#334'},g,'층'+(i+1)); lay.push(g);});
  for(let i=0;i<6;i++) el('rect',{x:470+i*16,y:60+i*4,width:9,height:110-i*8,rx:3,fill:'#bfe5d4',stroke:'#1f9d74','stroke-width':1.5},s);
  el('text',{x:610,y:118,'font-size':22,'font-weight':900,fill:'#1f9d74'},s,'→');
  el('rect',{x:640,y:82,width:130,height:56,rx:12,fill:'#1f9d74'},s); el('text',{x:705,y:117,'text-anchor':'middle','font-size':18,'font-weight':900,fill:'#fff'},s,'얼굴 ✔');
  el('path',{d:'M150 214 L150 222 L440 222 L440 214',stroke:'#9b4fc4','stroke-width':2,fill:'none'},s);
  el('path',{d:'M466 214 L466 222 L560 222 L560 214',stroke:'#1f9d74','stroke-width':2,fill:'none'},s);
  el('text',{x:295,y:16,'text-anchor':'middle','font-size':15,'font-weight':900,fill:'#9b4fc4'},s,'특징 추출 (합성곱층 + 풀링층) × 여러 번');
  el('text',{x:513,y:40,'text-anchor':'middle','font-size':15,'font-weight':900,fill:'#1f9d74'},s,'분류 (완전 연결층)');
  [[170,'합성곱층','#e0702b'],[230,'풀링층','#d64535']].forEach(([x,t,c],i)=>{el('rect',{x:800,y:150+i*26,width:14,height:14,rx:3,fill:c,opacity:.6},s);el('text',{x:820,y:162+i*26,'font-size':13,fill:'#334'},s,t);});
  el('rect',{x:800,y:202,width:14,height:14,rx:3,fill:'#1f9d74',opacity:.6},s); el('text',{x:820,y:214,'font-size':13,fill:'#334'},s,'완전 연결층');

  const L1=$('ly1'); [['M10 20 L40 70'],['M60 20 L60 70'],['M80 45 L120 45'],['M140 70 Q160 10 180 70'],['M195 20 Q215 45 195 70']].forEach(([d])=>{el('path',{d,stroke:'#1b2a3a','stroke-width':5,fill:'none','stroke-linecap':'round'},L1);});
  const L2=$('ly2'); el('ellipse',{cx:35,cy:45,rx:26,ry:15,fill:'#fff',stroke:'#1b2a3a','stroke-width':4},L2); el('circle',{cx:35,cy:45,r:7,fill:'#1b2a3a'},L2);
  el('path',{d:'M100 15 L90 60 Q100 70 112 62',stroke:'#1b2a3a','stroke-width':4,fill:'none','stroke-linecap':'round'},L2);
  el('path',{d:'M165 20 Q195 20 195 48 Q195 74 170 72 M172 36 Q185 40 178 54',stroke:'#1b2a3a','stroke-width':4,fill:'none','stroke-linecap':'round'},L2);
  const L3=$('ly3'); el('ellipse',{cx:70,cy:45,rx:32,ry:38,fill:'#f4d2b4',stroke:'#1b2a3a','stroke-width':3},L3); el('circle',{cx:58,cy:38,r:4,fill:'#1b2a3a'},L3); el('circle',{cx:82,cy:38,r:4,fill:'#1b2a3a'},L3); el('path',{d:'M60 60 Q70 67 80 60',stroke:'#1b2a3a','stroke-width':3,fill:'none'},L3);
  el('circle',{cx:160,cy:22,r:16,fill:'#f4d2b4',stroke:'#1b2a3a','stroke-width':3},L3); el('path',{d:'M160 38 L160 70 M140 50 L180 50 M160 70 L146 88 M160 70 L174 88',stroke:'#1b2a3a','stroke-width':4,fill:'none','stroke-linecap':'round'},L3);
  function pickL(l){[...$('layerPick').children].forEach(d=>d.classList.toggle('on',+d.dataset.l===l)); lay.forEach((g,i)=>g.style.opacity=i+1===l?1:.35);}
  $('layerPick').onclick=e=>{const d=e.target.closest('[data-l]'); if(d) pickL(+d.dataset.l);};
  pickL(1);
})();

/* 4 ① 도장 찍기 · 5 ① 대표 뽑기 (0과 1로 된 쉬운 합성곱·풀링) */
const ST=(function(){
  const PIC={
    'ㄱ':['........','.######.','......#.','......#.','......#.','......#.','......#.','........'],
    '+ (십자)':['........','....#...','....#...','.#######','....#...','....#...','....#...','........'],
    'ㅁ':['........','.######.','.#....#.','.#....#.','.#....#.','.#....#.','.######.','........'],
    'X':['#......#','.#....#.','..#..#..','...##...','...##...','..#..#..','.#....#.','#......#'],
  };
  const FIL={v:{n:'세로선',m:[[0,1,0],[0,1,0],[0,1,0]]},h:{n:'가로선',m:[[0,0,0],[1,1,1],[0,0,0]]},d:{n:'대각선 ╲',m:[[1,0,0],[0,1,0],[0,0,1]]},a:{n:'대각선 ╱',m:[[0,0,1],[0,1,0],[1,0,0]]}};
  const st={pic:'ㄱ',f:'v',img:[],map:Array(36).fill(null),pos:-1,timer:null};
  const cells=(id,n)=>{$(id).innerHTML='<div></div>'.repeat(n); return [...$(id).children];};
  const I=cells('stImg',64), P=cells('stP',9), F=cells('stF',9), O=cells('stO',9), M=cells('stMap',36);
  $('stPic').innerHTML=Object.keys(PIC).map(k=>`<button class="chip" data-k="${k}">${k}</button>`).join('')+'<button class="chip" data-k="">지우고 직접 그리기</button>';
  $('stFil').innerHTML=Object.entries(FIL).map(([k,f])=>`<button class="fchip" data-k="${k}"><span class="mini">${f.m.flat().map(v=>`<i class="${v?'on':''}"></i>`).join('')}</span>${f.n}</button>`).join('');
  const score=k=>{const y=Math.floor(k/6),x=k%6; let s=0; for(let i=0;i<3;i++)for(let j=0;j<3;j++) s+=st.img[(y+i)*8+x+j]*FIL[st.f].m[i][j]; return s;};
  st.full=()=>Array.from({length:36},(_,k)=>score(k));
  st.names=()=>({pic:st.pic||'직접 그린 그림',f:FIL[st.f].n});
  function render(){
    const y0=st.pos>=0?Math.floor(st.pos/6):-9, x0=st.pos>=0?st.pos%6:-9, done=st.map.every(v=>v!==null);
    const found=new Set();
    if(done) st.map.forEach((v,k)=>{ if(v===3){const y=Math.floor(k/6),x=k%6; for(let i=0;i<3;i++)for(let j=0;j<3;j++) if(FIL[st.f].m[i][j]&&st.img[(y+i)*8+x+j]) found.add((y+i)*8+x+j);} });
    I.forEach((c,k)=>{const y=Math.floor(k/8),x=k%8; c.className=(st.img[k]?'on':'')+(y>=y0&&y<y0+3&&x>=x0&&x<x0+3?' w':'')+(found.has(k)?' found':'');});
    const fm=FIL[st.f].m.flat();
    F.forEach((c,i)=>c.className=fm[i]?'on':'');
    if(st.pos<0){ P.forEach(c=>{c.className='';c.textContent='';}); O.forEach(c=>{c.className='';c.textContent='';}); $('stSc').innerHTML='▶를 눌러 도장을 찍어 보세요'; }
    else{
      const pp=[]; for(let i=0;i<3;i++)for(let j=0;j<3;j++) pp.push(st.img[(y0+i)*8+x0+j]);
      P.forEach((c,i)=>{c.className=pp[i]?'on':''; c.textContent='';});
      O.forEach((c,i)=>{const on=pp[i]&&fm[i]; c.className=on?'on':''; c.textContent=on?'✓':'';});
      const sc=st.map[st.pos];
      $('stSc').innerHTML=`겹친 칸 <b>${sc}</b>개 → <b>${sc}</b>점 <small>${['도장 모양이 없어요','조금 겹쳐요','꽤 비슷해요','도장과 꼭 맞아요!'][sc]}</small>`;
    }
    M.forEach((c,k)=>{const v=st.map[k]; c.className=(v===null?'':'s'+v)+(k===st.pos?' cur':''); c.textContent=v===null?'':v;});
    const n3=st.map.filter(v=>v===3).length, nm=FIL[st.f].n;
    $('stSay').innerHTML=!done?(st.pos<0?'':`${st.pos+1} / 36번째 자리를 찍었어요.`):
      n3?`✅ 다 찍었어요! <b>${nm}</b> 도장과 꼭 맞는 3점 자리가 <b>${n3}곳</b>이에요. 그림에서 <span style="color:#e0702b;font-weight:900">주황색</span>으로 바뀐 칸이 바로 ${nm}이 있는 곳이에요. 다른 도장으로 바꿔 보세요. 같은 그림인데 특징 지도가 달라져요.`
        :`✅ 다 찍었어요! 이 그림에는 <b>${nm}</b> 모양이 없어서 3점이 하나도 없어요. 다른 도장을 골라 보세요.`;
    [...$('stPic').children].forEach(b=>b.classList.toggle('on',b.dataset.k===st.pic));
    [...$('stFil').children].forEach(b=>b.classList.toggle('on',b.dataset.k===st.f));
    $('stStep').disabled=done; $('stAuto').disabled=done;
  }
  function stop(){ if(st.timer){clearInterval(st.timer); st.timer=null;} }
  function reset(){ stop(); st.map=Array(36).fill(null); st.pos=-1; render(); if(window.PP) PP.reset(); }
  function step(){ const k=st.map.findIndex(v=>v===null); if(k<0){stop();return;} st.pos=k; st.map[k]=score(k); render(); if(st.map.every(v=>v!==null)) stop(); }
  function setPic(k){ st.pic=k; st.img=(PIC[k]||Array(8).fill('........')).join('').split('').map(c=>c==='#'?1:0); reset(); }
  $('stPic').onclick=e=>{const b=e.target.closest('button'); if(b) setPic(b.dataset.k);};
  $('stFil').onclick=e=>{const b=e.target.closest('button'); if(!b) return; st.f=b.dataset.k; reset();};
  $('stImg').onclick=e=>{const k=I.indexOf(e.target); if(k<0) return; st.img[k]=1-st.img[k]; st.pic=''; reset();};
  $('stMap').onclick=e=>{const k=M.indexOf(e.target); if(k<0) return; stop(); st.pos=k; st.map[k]=score(k); render();};
  $('stStep').onclick=()=>{stop(); step();};
  $('stAuto').onclick=()=>{ if(st.timer) return; step(); st.timer=setInterval(step,320); };
  $('stReset').onclick=reset;
  st.stop=stop;
  setPic('ㄱ');
  return st;
})();

const PP=(function(){
  const cells=(id,n)=>{$(id).innerHTML='<div></div>'.repeat(n); return [...$(id).children];};
  const A=cells('ppIn',36), B=cells('ppOut',9);
  let src=[], out=Array(9).fill(null), g=-1, timer=null;
  const grp=k=>{const y=Math.floor(k/6),x=k%6; return (y>>1)*3+(x>>1);};
  const members=q=>{const gy=Math.floor(q/3)*2,gx=(q%3)*2; return [gy*6+gx,gy*6+gx+1,(gy+1)*6+gx,(gy+1)*6+gx+1];};
  function render(){
    const done=out.every(v=>v!==null), mem=g>=0?members(g):[], best=g>=0?mem.reduce((b,k)=>src[k]>src[b]?k:b,mem[0]):-1;
    A.forEach((c,k)=>{const q=grp(k); c.className='s'+src[k]+((q+Math.floor(q/3))%2?' g0':'')+(mem.includes(k)?' grp':'')+(k===best?' best':'')+(g>=0&&!mem.includes(k)&&out[q]===null?' dim':''); c.textContent=src[k];});
    B.forEach((c,q)=>{const v=out[q]; c.className=(v===null?'':'s'+v)+(q===g?' cur':''); c.textContent=v===null?'':v;});
    $('ppSay').innerHTML=g<0?'▶를 눌러 첫 번째 모둠(왼쪽 위)부터 대표를 뽑아 보세요.':
      !done?`이 모둠의 수 <b>${mem.map(k=>src[k]).join(', ')}</b> → 가장 큰 <b style="color:#e0702b">${src[best]}</b>${src[best]===2?'가':'이'} 대표예요.`:
      `✅ 숫자 36개가 9개로 줄었어요(4분의 1). ${out.some(v=>v===3)?'그래도 3점(진한 칸)이 남아 있어서 도장 모양이 <b>대략 어디쯤</b> 있는지는 그대로 알 수 있어요.':'모둠 대표만 남겨도 그림의 특징이 어디쯤 강했는지는 남아 있어요.'} 계산할 양이 줄어 학습이 쉬워지고, 모양이 한 칸쯤 옆으로 움직여도 같은 모둠 안이라면 대표는 그대로예요.`;
    $('ppStep').disabled=done; $('ppAll').disabled=done;
  }
  function stop(){ if(timer){clearInterval(timer); timer=null;} }
  function reset(){ stop(); src=ST.full(); out=Array(9).fill(null); g=-1; const n=ST.names(); $('plFrom').innerHTML=`지금은 04 ①에서 고른 그림 「<b>${n.pic}</b>」에 「<b>${n.f}</b>」 도장을 찍은 특징 지도예요. 04에서 바꾸면 여기도 바뀌어요.`; render(); }
  function step(){ const q=out.findIndex(v=>v===null); if(q<0){stop();return;} g=q; out[q]=Math.max(...members(q).map(k=>src[k])); render(); }
  $('ppStep').onclick=()=>{stop(); step();};
  $('ppAll').onclick=()=>{stop(); while(out.some(v=>v===null)) step();};
  $('ppReset').onclick=reset;
  onShow[5]=reset;
  reset();
  return {reset,stop};
})();

/* 4 합성곱 연산 (교과서 그림 Ⅱ-22) */
(function(){
  const IN=[[1,2,3,4],[2,1,0,1],[3,0,1,1],[1,4,1,1]], F=[[1,0,1],[1,0,1],[0,1,0]];
  const POS=[[0,0],[0,1],[1,0],[1,1]];
  const val=([r,c])=>{let s=0;for(let i=0;i<3;i++)for(let j=0;j<3;j++)s+=IN[r+i][c+j]*F[i][j];return s;};
  const OUT=POS.map(val);
  const solved=[true,true,false,false]; let step=0;
  $('mxIn').innerHTML=IN.flat().map(v=>`<div>${v}</div>`).join('')+'<div class="cap">입력</div>';
  $('mxF').innerHTML=F.flat().map(v=>`<div>${v}</div>`).join('')+'<div class="cap">필터</div>';
  function drawOut(){
    $('mxO').innerHTML=OUT.map((v,k)=>`<div class="${k===step?'cur':''}">${solved[k]?v:(k===step?'<input id="ansIn" inputmode="numeric" aria-label="'+(k+1)+'단계 출력값">':'?')}</div>`).join('')+'<div class="cap">출력</div>';
    const a=$('ansIn'); if(a){a.addEventListener('keydown',e=>{if(e.key==='Enter') check();}); }
  }
  function expr(k){const [r,c]=POS[k]; const t=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)t.push(`(${IN[r+i][c+j]}×${F[i][j]})`); return t.join(' + ')+` = <b>${OUT[k]}</b>`;}
  function show(k){step=k; const [r,c]=POS[k];
    [...$('mxIn').children].forEach((d,idx)=>{if(idx>=16) return; const i=Math.floor(idx/4), j=idx%4; d.classList.toggle('win',i>=r&&i<r+3&&j>=c&&j<c+3);});
    drawOut(); [...$('cvStep').children].forEach((b,j)=>b.classList.toggle('on',j===k));
    $('solveRow').style.display=solved[k]?'none':'flex'; $('chkSay').textContent='';
    $('expr').innerHTML=solved[k]?`<b>${k+1}단계</b> · 주황색 9칸과 필터를 같은 자리끼리 곱해서 모두 더해요.<br>${expr(k)}`:`<b>${k+1}단계</b> · 필터가 ${k===2?'한 줄 아래로 내려와 왼쪽':'오른쪽으로 한 칸'}에 자리 잡았어요. 주황색 9칸과 필터를 같은 자리끼리 곱해서 모두 더한 값을 출력 칸에 적고 「확인」을 누르세요.`;
    if(!solved[k]) setTimeout(()=>{const a=$('ansIn'); if(a&&window.matchMedia('(pointer:fine)').matches) a.focus();},50);
  }
  function check(){const a=$('ansIn'); if(!a) return; const v=parseInt(a.value,10);
    if(v===OUT[step]){solved[step]=true; const k=step; show(k); $('expr').innerHTML=`<span class="ok">정답!</span> ${k+1}단계 · ${expr(k)}${k===2&&!solved[3]?'<br>이제 4단계로 가 보세요.':''}`;}
    else{$('chkSay').innerHTML=`<span class="ng">${isNaN(v)?'숫자를 적어 주세요.':'다시 계산해 보세요. 0을 곱한 칸은 0이 돼요.'}</span>`; const box=$('mxO'); box.classList.add('shake'); setTimeout(()=>box.classList.remove('shake'),400);}}
  $('chk').onclick=check;
  $('showSol').onclick=()=>{const [r,c]=POS[step]; const t=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)t.push(`(${IN[r+i][c+j]}×${F[i][j]})`); $('expr').innerHTML=`<b>${step+1}단계</b> · ${t.join(' + ')} = ?<br><span class="muted">곱한 값을 차례로 더해 출력 칸에 적어 보세요.</span>`;};
  $('cvStep').onclick=e=>{const b=e.target.closest('button'); if(b) show(+b.dataset.s);};
  show(0);
})();

/* 4 필터 A·B 체험, 5 풀링 */
const EN=28; let IMG=new Float32Array(EN*EN), COMB=new Float32Array(26*26);
const FA=[[-1,0,1],[-2,0,2],[-1,0,1]], FB=[[1,2,1],[0,0,0],[-1,-2,-1]];
$('fmA').innerHTML=FA.flat().map(v=>`<span>${v>0?'+'+v:v}</span>`).join(''); $('fmB').innerHTML=FB.flat().map(v=>`<span>${v>0?'+'+v:v}</span>`).join('');
function preset(p){IMG.fill(0); const set=(x,y,v=1)=>{if(x>=0&&x<EN&&y>=0&&y<EN) IMG[y*EN+x]=Math.max(IMG[y*EN+x],v);};
  const line=(x0,y0,x1,y1,w=1.6)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*3; for(let t=0;t<=n;t++){const x=x0+(x1-x0)*t/n, y=y0+(y1-y0)*t/n; for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const d=Math.hypot(i,j); if(d<w) set(Math.round(x)+i,Math.round(y)+j);}}};
  if(p==='sq') for(let y=7;y<21;y++) for(let x=7;x<21;x++) set(x,y);
  if(p==='ci') for(let y=0;y<EN;y++) for(let x=0;x<EN;x++) if(Math.hypot(x-13.5,y-13.5)<8.5) set(x,y);
  if(p==='seven'){line(7,6,21,6); line(21,6,12,23);}
  if(p==='house'){for(let y=14;y<24;y++) for(let x=8;x<20;x++) set(x,y); for(let y=5;y<14;y++){const h=y-5; for(let x=14-h;x<=13+h;x++) set(x,y);} for(let y=18;y<24;y++) for(let x=12;x<16;x++) IMG[y*EN+x]=0;}
  edgeAll();}
function conv(F){const o=new Float32Array(26*26); for(let y=0;y<26;y++)for(let x=0;x<26;x++){let s=0;for(let i=0;i<3;i++)for(let j=0;j<3;j++)s+=IMG[(y+i)*EN+x+j]*F[i][j]; o[y*26+x]=s;} return o;}
function put(cv,arr,w){const x=cv.getContext('2d'), im=x.createImageData(w,w); for(let k=0;k<w*w;k++){const v=Math.max(0,Math.min(255,Math.round(arr[k]*255))); im.data[k*4]=im.data[k*4+1]=im.data[k*4+2]=v; im.data[k*4+3]=255;} x.putImageData(im,0,0);}
function edgeAll(){
  put($('drawC'),IMG,EN);
  const A=conv(FA), B=conv(FB);
  put($('edA'),A.map(v=>Math.abs(v)/4),26); put($('edB'),B.map(v=>Math.abs(v)/4),26);
  COMB=A.map((v,k)=>Math.min(1,Math.hypot(v,B[k])/4)); put($('edAB'),COMB,26);
  poolDraw();
}
function poolDraw(){put($('poolA'),COMB,26); const P=new Float32Array(13*13); for(let y=0;y<13;y++)for(let x=0;x<13;x++)P[y*13+x]=Math.max(COMB[(2*y)*26+2*x],COMB[(2*y)*26+2*x+1],COMB[(2*y+1)*26+2*x],COMB[(2*y+1)*26+2*x+1]); put($('poolB'),P,13);}
(function(){
  const c=$('drawC'); let down=false;
  function at(e){const r=c.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*EN,(e.clientY-r.top)/r.height*EN];}
  function dab(e){const [px,py]=at(e); for(let y=Math.floor(py)-2;y<=Math.floor(py)+2;y++)for(let x=Math.floor(px)-2;x<=Math.floor(px)+2;x++){if(x<0||y<0||x>=EN||y>=EN) continue; const d=Math.hypot(x+.5-px,y+.5-py); const v=d<1.1?1:d<1.9?.55:0; IMG[y*EN+x]=Math.max(IMG[y*EN+x],v);} edgeAll();}
  c.addEventListener('pointerdown',e=>{down=true; c.setPointerCapture(e.pointerId); dab(e); [...$('edgePre').children].forEach(b=>b.classList.remove('on'));});
  c.addEventListener('pointermove',e=>{if(down) dab(e);}); c.addEventListener('pointerup',()=>down=false); c.addEventListener('pointercancel',()=>down=false);
  $('edgePre').onclick=e=>{const b=e.target.closest('button'); if(!b) return; [...$('edgePre').children].forEach(x=>x.classList.toggle('on',x===b)); preset(b.dataset.p==='clear'?'':b.dataset.p);};
  $('edgePre').children[3].classList.add('on'); preset('house');
})();

/* 5 풀링 예시 (교과서 그림 Ⅱ-23) */
(function(){
  const IN=[[5,2,3,4],[2,1,0,1],[3,7,9,5],[1,4,1,8]]; let k=0;
  const q=(i,j)=>(i<2?0:2)+(j<2?0:1);
  function draw(){
    $('plIn').innerHTML=IN.flat().map((v,idx)=>{const i=Math.floor(idx/4), j=idx%4, r=q(i,j); const cur=k>0&&r===k-1; const reg=[0,1,2,3].filter(t=>t<k);
      const mx=Math.max(...IN.flat().filter((_,m)=>q(Math.floor(m/4),m%4)===r));
      return `<div class="q${r}${k>0&&r!==k-1&&k<=4?' dim':''}${(cur||(k>4))&&v===mx?' max':''}">${v}</div>`;}).join('')+'<div class="cap">합성곱층을 지난 데이터 4 × 4</div>';
    const out=[0,1,2,3].map(r=>Math.max(...IN.flat().filter((_,m)=>q(Math.floor(m/4),m%4)===r)));
    $('plOut').innerHTML=out.map((v,r)=>`<div class="${r<k?'q'+r:''} ${r===k-1?'cur':''}" style="${r<k?'':'color:transparent'}">${v}</div>`).join('')+'<div class="cap">풀링 결과 2 × 2</div>';
    const nm=['왼쪽 위','오른쪽 위','왼쪽 아래','오른쪽 아래'];
    if(k===0) $('plSay').textContent='숫자 16개가 몇 개로 줄어들지 먼저 예상해 보세요.';
    else if(k<=4){const r=k-1, vals=IN.flat().filter((_,m)=>q(Math.floor(m/4),m%4)===r); $('plSay').innerHTML=`<b>${nm[r]} 구역</b> ${vals.join(', ')} 중 가장 큰 값 → <b style="color:var(--red)">${Math.max(...vals)}</b>`+(k===4?'<br>숫자 16개가 <b>4개</b>로 줄었어요. 크기는 4분의 1, 그래도 각 구역에서 가장 강한 값은 남았어요.':'');}
    $('plNext').textContent=k>=4?'다 했어요':'한 구역씩 풀링하기'; $('plNext').disabled=k>=4;
  }
  $('plNext').onclick=()=>{if(k<4){k++;draw();}}; $('plReset').onclick=()=>{k=0;draw();};
  draw();
})();

/* 6 GAN */
(function(){
  const FACE=['....XXXX....','..XX....XX..','.X........X.','.X..X..X..X.','X...X..X...X','X..........X','X..X....X..X','X...XXXX...X','.X........X.','.X........X.','..XX....XX..','....XXXX....'];
  const T=FACE.join('').split('').map(c=>c==='X'?1:0);
  function draw(cv,arr){const x=cv.getContext('2d'), im=x.createImageData(12,12); arr.forEach((v,k)=>{const g=Math.round(255-v*225); im.data[k*4]=g; im.data[k*4+1]=g; im.data[k*4+2]=Math.min(255,g+12); im.data[k*4+3]=255;}); x.putImageData(im,0,0);}
  draw($('ganR'),T);
  let round=0, hist=[], busy=false, gen=T.map(()=>Math.random());
  const qOf=r=>1-Math.pow(.72,r);
  function chart(){const s=$('ganChart'); s.innerHTML='';
    el('line',{x1:40,y1:10,x2:40,y2:100,stroke:'#c5ccd5'},s); el('line',{x1:40,y1:100,x2:590,y2:100,stroke:'#c5ccd5'},s);
    el('text',{x:34,y:16,'text-anchor':'end','font-size':11,fill:'#5b6776'},s,'100%'); el('text',{x:34,y:59,'text-anchor':'end','font-size':11,fill:'#5b6776'},s,'50%');
    el('line',{x1:40,y1:55,x2:590,y2:55,stroke:'#d64535','stroke-dasharray':'5 5'},s); el('text',{x:586,y:50,'text-anchor':'end','font-size':11,fill:'#d64535'},s,'50% = 찍는 것과 같음');
    el('text',{x:315,y:117,'text-anchor':'middle','font-size':11,fill:'#5b6776'},s,'겨루기 횟수 →  (선: 감별자가 가짜를 맞힌 비율)');
    if(!hist.length) return; const X=i=>40+i*(550/12), Y=p=>100-(p*90);
    el('polyline',{points:hist.map((p,i)=>`${X(i+1)},${Y(p)}`).join(' '),fill:'none',stroke:'#c98a00','stroke-width':3},s);
    hist.forEach((p,i)=>el('circle',{cx:X(i+1),cy:Y(p),r:4,fill:'#c98a00'},s));}
  async function one(){
    if(busy) return; busy=true; const fl=[...$('ganFlow').children];
    round++; const q=qOf(round); fl.forEach(l=>l.classList.remove('on'));
    fl[0].classList.add('on'); gen=T.map(t=>Math.max(0,Math.min(1,t*q+Math.random()*(1-q)))); draw($('ganG'),gen); $('ganRound').textContent=round; await sleep(450);
    fl[0].classList.remove('on'); fl[1].classList.add('on'); const acc=.5+.5*(1-q)+(Math.random()-.5)*.02; const p=Math.max(.5,Math.min(1,acc));
    $('ganVerdict').innerHTML=p>.8?`감별자: "이건 <span class="ng">가짜</span>야!" (확신 ${Math.round(p*100)}%)`:p>.6?`감별자: "음… 아마 <span class="ng">가짜</span>?" (확신 ${Math.round(p*100)}%)`:`감별자: "진짜인지 가짜인지 모르겠어…" (${Math.round(p*100)}%)`;
    hist.push(p); $('ganAcc').textContent=Math.round(p*100)+'%'; $('ganMeter').style.width=(p*100)+'%'; chart(); await sleep(450);
    fl[1].classList.remove('on'); fl[2].classList.add('on'); await sleep(350); fl[2].classList.remove('on'); fl[3].classList.add('on'); await sleep(350); fl[3].classList.remove('on');
    if(p<=.53||round>=12){$('ganEnd').classList.add('on'); $('ganBtn').disabled=true; $('ganAuto').disabled=true;}
    busy=false;
  }
  $('ganBtn').onclick=one;
  $('ganAuto').onclick=async()=>{$('ganAuto').disabled=true; while(!$('ganEnd').classList.contains('on')){await one(); await sleep(150);} };
  $('ganReset').onclick=()=>{if(busy) return; round=0; hist=[]; $('ganRound').textContent=0; gen=T.map(()=>Math.random()); draw($('ganG'),gen); $('ganVerdict').textContent='감별자: 아직 겨루기 전이에요.'; $('ganAcc').textContent='-'; $('ganMeter').style.width=0; $('ganEnd').classList.remove('on'); $('ganBtn').disabled=false; $('ganAuto').disabled=false; chart();};
  draw($('ganG'),gen); chart();
})();

/* 6 프롬프트 만들기 */
(function(){
  const ins=[...$('pb').querySelectorAll('input')], get=k=>ins.find(i=>i.dataset.k===k).value.trim();
  const PK=QK+'-prompt';
  const J=(w,a,b)=>{const c=w.charCodeAt(w.length-1); return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28?a:b;};
  try{const s=JSON.parse(localStorage.getItem(PK)||'{}'); ins.forEach(i=>{if(s[i.dataset.k]) i.value=s[i.dataset.k];});}catch(e){}
  function up(){
    const p=get('place'),w=get('who'),l=get('look'),po=get('pose'),t=get('thing'),s=get('sky'); const n=[p,w,l,po,t,s].filter(Boolean).length;
    const parts=[]; if(w||l||po) parts.push(`${w?w+J(w,'이','가')+' ':''}${l?l+' 차림으로 ':''}${po?po+' ':''}모습을 그려 줘.`);
    if(p) parts.push(`장소는 ${p}${J(p,'이야','야')}.`); if(t) parts.push(`주변에는 ${t}${J(t,'이','가')} 있어.`); if(s) parts.push(`하늘은 ${s}${J(s,'이야','야')}.`);
    const tx=parts.join(' '); $('ptext').textContent=tx||'빈칸을 채우면 여기에 프롬프트가 만들어져요.'; $('ptext').classList.toggle('empty',!tx);
    $('pMeter').style.width=(n/6*100)+'%'; $('pCount').textContent=`${n} / 6`;
    try{const o={}; ins.forEach(i=>o[i.dataset.k]=i.value); localStorage.setItem(PK,JSON.stringify(o));}catch(e){}
  }
  ins.forEach(i=>i.oninput=up);
  $('pEx').onclick=()=>{ins.forEach(i=>i.value=i.placeholder.replace(/^예:\s*/,'')); up();};
  $('pCopy').onclick=async()=>{const t=$('ptext').classList.contains('empty')?'':$('ptext').textContent; if(!t) return; try{await navigator.clipboard.writeText(t); $('pCopy').textContent='복사했어요!';}catch(e){$('pCopy').textContent='직접 드래그해 복사하세요';} setTimeout(()=>$('pCopy').textContent='복사하기',1500);};
  up();
})();

/* 7 활용 */
$('apps').onclick=e=>{const b=e.target.closest('button'); if(!b) return; const a=b.dataset.a; [...$('apps').children].forEach(x=>x.classList.toggle('on',x===b)); document.querySelectorAll('.appd').forEach(d=>d.classList.toggle('on',d.dataset.a===a));};

