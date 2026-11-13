/* ───────── 셀 실행 흉내 (여러 화면이 상태를 함께 씀) ───────── */
/* 컬러 모델 8 epoch: 교과서 소스 노트북의 실제 출력 · 회색조 15 epoch: 예시 값 */
const LOG_C=[[0.9273,0.6019,'118s 3s'],[0.3500,0.8611,'29s 814ms'],[0.3642,0.8889,'29s 815ms'],[0.2564,0.9105,'29s 800ms'],[0.2039,0.9228,'29s 793ms'],[0.1395,0.9475,'29s 796ms'],[0.1014,0.9568,'29s 803ms'],[0.0764,0.9753,'28s 788ms']];
const LOG_G=[[0.7905,0.6049],[0.4932,0.7685],[0.3817,0.8395],[0.2954,0.8858],[0.2110,0.9198],[0.1526,0.9475],[0.0981,0.9691],[0.0702,0.9784],[0.0415,0.9877],[0.0268,0.9938],[0.0151,0.9969],[0.0094,1.0000],[0.0061,1.0000],[0.0043,1.0000],[0.0031,1.0000]].map(r=>[r[0],r[1],'9s 250ms']);
const NB={busy:false,out:{}};
const ufErr=(e,why)=>`<div class="uf-err">${e}</div><div class="uf-why">${why}</div>`;
const ufOK=t=>`<span class="ok">✓ 실행 완료</span> <span class="muted">${t||'(출력 없음)'}</span>`;
const ufPre=t=>`<pre class="uf-out sm">${t}</pre>`;
const NEED_PREP=ufErr(`NameError: name 'path' is not defined`,'01 화면의 ① 준비 셀을 먼저 실행하세요. 사진 내려받기와 라이브러리 불러오기가 모두 그 셀에 있어요.');
const CELLS={
  prep:{t:'① 준비 — 데이터 내려받기 + 컬러 CNN 모델 학습',c:`ZIP_URL = '(선생님 구글 드라이브 공유 주소)'
# (주소에서 ID를 꺼내 gdown으로 fire.zip을 내려받아요)
!unzip -q -o fire.zip
import os, glob, cv2
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from PIL import Image
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator
path = '/content/fire'
train_fire = glob.glob(path + '/fire' + '/*')
train_non_fire = glob.glob(path + '/non' + '/*')
print(len(train_fire), len(train_non_fire))
train_datagen = ImageDataGenerator(rescale = 1/255)
train_generator = train_datagen.flow_from_directory(path, target_size = (400,400),
                  batch_size = 9, class_mode = 'binary', seed = 3)
model = tf.keras.models.Sequential([ …209쪽과 같은 CNN… ])
model.compile(loss = 'binary_crossentropy', optimizer = 'adam', metrics = ['accuracy'])
history = model.fit(train_generator, steps_per_epoch = 36, epochs = 8, verbose = 1)`,
    anim:{log:LOG_C,head:'162 162\nFound 324 images belonging to 2 classes.',done(){NB.prep=true;},msg:'컬러 모델 학습 완료. 학습 데이터 정확도 0.98까지 올라갔어요.'},run(){ NB.prep=false; return null; }},
  t3:{t:'② 빨간색 건물(test3.jpg)로 테스트하기 (214쪽)',c:`img3 = Image.open(path + '/test3.jpg')
img_resize3 = img3.resize((400, 400))
test_img3 = image.img_to_array(img_resize3) / 255
test_img3 = np.expand_dims(test_img3, axis = 0)
images3 = np.vstack([test_img3])
classes3 = model.predict(images3, batch_size = 10)
print(classes3[0])
if classes3[0][0] &lt; 0.5:
    print('Fire Image')
else:
    print('Non Fire Image')`,run(){
    if(!NB.prep) return NEED_PREP;
    NB.t3=true; return `<div class="uf-row"><img src="img/test3.jpg" alt="빨간색 건물" width="90" height="90">${ufPre(`1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 150ms/step\n[3.1e-12]\nFire Image`)}</div><div class="uf-why">e-12는 소수점 아래 0이 11개, 곧 <b>거의 0</b>이에요. 그래서 <b>산불 이미지</b>로 판별했어요. 불은 어디에도 없는데요! <span class="muted">(값은 예시예요.)</span></div>`; }},
  gread:{t:'③ read_img를 회색조로 바꾸고 사진 보기 (215쪽)',c:`def read_img(file_path):
  img_arr = cv2.imread(file_path)
  return cv2.cvtColor(img_arr, cv2.COLOR_BGR2GRAY)

fire_img = read_img(train_fire[7])
plt.subplot(1, 2, 1); plt.title('Fire'); plt.xlabel(fire_img.shape)
plt.imshow(fire_img, cmap = 'gray', aspect = 'auto')
non_fire_img = read_img(train_non_fire[7])
plt.subplot(1, 2, 2); plt.title('Non Fire'); plt.xlabel(non_fire_img.shape)
plt.imshow(non_fire_img, cmap = 'gray', aspect = 'auto')
plt.show()`,run(){
    if(!NB.prep) return NEED_PREP;
    return `<div class="uf-row"><figure class="uf-plt"><b>Fire</b><img class="gray" src="img/fire8.jpg" alt="회색조 산불 사진" width="120" height="120"><small>(400, 400)</small></figure><figure class="uf-plt"><b>Non Fire</b><img class="gray" src="img/non31.jpg" alt="회색조 숲 사진" width="120" height="120"><small>(400, 400)</small></figure></div><div class="uf-why">shape가 (400, 400)으로, 색 채널(3)이 사라졌어요.</div>`; }},
  ggen:{t:'④ (고친 부분) 회색조로 읽는 훈련 데이터 설정',c:`gray_datagen = ImageDataGenerator(rescale = 1/255)
gray_generator = gray_datagen.flow_from_directory(
                 path, target_size = (400,400),
                 batch_size = 9, class_mode = 'binary',
                 color_mode = 'grayscale',
                 seed = 3
)`,run(){
    if(!NB.prep) return NEED_PREP;
    NB.ggen=true; return ufPre('Found 324 images belonging to 2 classes.'); }},
  gmodel:{t:'⑤ gray_model 만들고 컴파일하기',c:`gray_model = tf.keras.models.Sequential([
      tf.keras.layers.Conv2D(16, (3, 3), activation = 'relu', input_shape = (400, 400, 1)),
      tf.keras.layers.MaxPool2D(2, 2),
      …(나머지 층은 같음)…
      tf.keras.layers.Dense(1, activation = 'sigmoid')
])
gray_model.summary()
gray_model.compile(loss = 'binary_crossentropy', optimizer = 'adam', metrics = ['accuracy'])`,run(){
    if(!NB.prep) return NEED_PREP;
    NB.gmodel=true; NB.gfit=false;
    return ufPre(`Layer (type)                  Output Shape              Param #
conv2d_3 (Conv2D)             (None, 398, 398, 16)          160
max_pooling2d_3 (MaxPooling2D)(None, 199, 199, 16)            0
  …
dense_3 (Dense)               (None, 1)                     129
 Total params: 9,451,489 (36.05 MB)`)+'<div class="uf-why">첫 합성곱층 매개 변수가 448 → <b>160</b>(3 × 3 × 1 × 16 + 16)으로 줄었어요.</div>'; }},
  gfit:{t:'⑥ 학습 횟수 15로 다시 학습하기 (216쪽)',c:`history = gray_model.fit(gray_generator, steps_per_epoch = 36, epochs = 15, verbose = 1)`,
    anim:{log:LOG_G,head:'',done(){NB.gfit=true;},msg:'회색조 모델 학습 완료. 학습 데이터 정확도가 1.000까지 올라갔어요. 학습 사진을 외워 버렸을 수도 있어요. (흉내의 숫자는 예시예요.)'},run(){
    if(!NB.gmodel) return ufErr(`NameError: name 'gray_model' is not defined`,'03 화면의 ⑤ 셀에서 gray_model을 먼저 만드세요.');
    if(!NB.ggen) return ufErr(`NameError: name 'gray_generator' is not defined`,'03 화면의 ④ 셀에서 회색조 훈련 데이터를 먼저 설정하세요.');
    NB.gfit=false; return null; }},
  t3g:{t:'⑦ 회색조 모델로 빨간색 건물과 진짜 산불(test1) 테스트하기 (216쪽)',c:`img_gray3 = img3.convert('L').resize((400, 400))
test_gray3 = image.img_to_array(img_gray3) / 255
test_gray3 = np.expand_dims(test_gray3, axis = 0)
images4 = np.vstack([test_gray3])
classes4 = gray_model.predict(images4, batch_size = 10)
print(classes4[0])
if classes4[0][0] &lt; 0.5:
    print('Fire Image')
else:
    print('Non_Fire Image')
img_gray1 = Image.open(path + '/test1.jpg').convert('L').resize((400, 400))
test_gray1 = np.expand_dims(image.img_to_array(img_gray1) / 255, axis = 0)
classes5 = gray_model.predict(test_gray1, batch_size = 10)
print(classes5[0])`,run(){
    if(!NB.t3) return ufErr(`NameError: name 'img3' is not defined`,'img3는 02 화면의 ② 셀에서 열었어요. ②를 먼저 실행하세요.');
    if(!NB.gmodel) return ufErr(`NameError: name 'gray_model' is not defined`,'03 화면의 ⑤ 셀을 먼저 실행하세요.');
    if(!NB.gfit) return ufPre('[0.4987]\nFire Image')+'<div class="uf-why">학습(⑥)을 하지 않은 모델이라 0.5 근처의 값이 나왔어요. 의미 있는 판단이 아니에요.</div>';
    return `<div class="uf-row"><img class="gray" src="img/test3.jpg" alt="회색조로 바꾼 빨간색 건물" width="90" height="90">${ufPre(`[0.9731]\nNon_Fire Image`)}</div><div class="uf-row"><img class="gray" src="img/test1.jpg" alt="회색조로 바꾼 진짜 산불" width="90" height="90">${ufPre(`[0.8846]`)}</div><div class="uf-why">빨간색 건물은 <b>산불 아님</b>으로 맞혔어요. 그런데 <b>진짜 산불(test1)도 0.5보다 커서 「산불 아님」</b>으로 놓쳤어요. 색 정보를 버린 대가예요. <span class="muted">(값은 예시예요. 학습할 때마다 달라서 test1을 맞힐 때도 있어요.)</span></div>`; }}
};
const SIMS={};
function nbSim(box,ids){ SIMS[box]=ids; drawSim(box); }
function drawSim(box){
  const B=$(box); if(!B) return;
  B.innerHTML=SIMS[box].map(id=>{const c=CELLS[id]; return `<div class="uf-cell"><div class="uf-ct">${c.t}</div><div class="uf-cin"><button class="uf-run" data-id="${id}" aria-label="${c.t} 실행" ${NB.busy?'disabled':''}>▶</button><pre class="uf-code sm">${c.c}</pre></div><div class="uf-cout" id="out-${id}">${NB.out[id]||''}</div></div>`;}).join('')
    +`<div class="row" style="margin-top:4px"><button class="btn sm ghost uf-reset">처음부터 (모든 셀 지우기)</button></div>`;
  B.querySelectorAll('.uf-run').forEach(b=>b.onclick=()=>runCell(b.dataset.id));
  B.querySelector('.uf-reset').onclick=()=>{ if(NB.busy) return; for(const k in NB) if(k!=='out') delete NB[k]; NB.busy=false; NB.out={}; Object.keys(SIMS).forEach(drawSim); };
}
function setOut(id,h){ NB.out[id]=h; const o=$('out-'+id); if(o) o.innerHTML=h; }
const lockRuns=on=>Object.keys(SIMS).forEach(b=>$(b)&&$(b).querySelectorAll('.uf-run').forEach(x=>x.disabled=on));
function runCell(id){
  if(NB.busy) return;
  const c=CELLS[id], r=c.run();
  if(r!==null){ setOut(id,r); return; }
  const A=c.anim, n=A.log.length; NB.busy=true; lockRuns(true);
  let lines=A.head?[A.head]:[], i=0;
  const step=()=>{
    const [loss,acc,tm]=A.log[i];
    lines.push(`Epoch ${i+1}/${n}\n36/36 ━━━━━━━━━━━━━━━━━━━━ ${tm}/step - accuracy: ${acc.toFixed(4)} - loss: ${loss.toFixed(4)}`);
    setOut(id,ufPre(lines.join('\n'))+(i<n-1?'<div class="uf-why">학습 중…</div>':''));
    i++;
    if(i<n) setTimeout(step,n>10?260:400);
    else { NB.busy=false; A.done(); setOut(id,ufPre(lines.join('\n'))+`<span class="ok">✓ ${A.msg}</span>`); lockRuns(false); }
  };
  step();
}
nbSim('sim1',['prep']);
nbSim('sim2',['t3']);
nbSim('sim3',['gread','ggen','gmodel']);
nbSim('sim4',['gfit','t3g']);

/* ───────── 02 색만 보고 판별하면? ─────────
   붉은 픽셀 비율(%): 모델이 보는 400×400 크기로 HSV로 바꾼 뒤(test1~3은 400×400으로 줄여서)
   색상 0~40°·340~360°, 채도 > 0.45, 명도 > 0.35인 픽셀의 비율 (파이썬으로 계산) */
const RF=[2,5,30,19,33,25,3,5,10,13,9,8,75,8,27,5,57,39,8,38,1,9,35,16,12,7,45,15,76,73,54,24,65,5,8,42,0,52,0,57,9,60,3,33,44,37,66,12,42,30,15,33,5,76,6,41,80,35,48,40,11,0,4,36,47,49,23,57,1,26,34,31,10,14,47,39,6,43,10,66,1,55,68,33,42,47,16,73,6,53,51,25,24,61,21,2,6,35,18,69,41,22,13,43,27,3,53,33,24,0,6,21,22,16,10,39,34,13,17,25,29,7,45,14,2,8,54,5,15,35,50,9,24,31,43,35,28,15,24,28,15,44,7,35,4,50,7,37,20,33,13,24,43,15,18,37,39,45,39,60,63,48];
const RN=[0,0,0,0,0,0,0,0,35,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,5,1,0,0,0,15,8,3,8,1,0,0,19,0,5,1,0,0,0,0,12,1,0,0,2,0,0,0,4,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,5,11,2,0,2,0,6,0,4,1,11,0,14,1,6,11,0,0,0,7,0,0,28,20,0,1,2,0,0,0,1,0,0,0,37,0,0,0,1,9,3,2,0,1,0,0,9,29,0,0,31,0,2,0,0,0,1,0,4,0,6,3,0,4,0,0,0,9,0,1,0,0,5,11,0,0,0,1,0,0,0,0];
(function(){
  const B=$('redGame');
  const PICS=[{s:'img/test3.jpg',n:'test3 · 빨간색 건물',r:46.7,y:0,t:1},{s:'img/test1.jpg',n:'test1 · 산불',r:35.6,y:1,t:1},{s:'img/test2.jpg',n:'test2 · 숲',r:4.9,y:0,t:1},
    {s:'img/fire8.jpg',n:'fire.8 · 학습 데이터',r:RF[7],y:1},{s:'img/fire39.jpg',n:'fire.39 · 연기만',r:RF[38],y:1},{s:'img/non115.jpg',n:'non_fire.115 · 단풍 숲',r:RN[114],y:0},{s:'img/non31.jpg',n:'non_fire.31 · 초록 숲',r:RN[30],y:0}];
  const W=600,H=250,L=30,R=12,MID=122,XM=85,CAP=13,U=7.2;
  const x=v=>L+v/XM*(W-L-R), bw=(W-L-R)/XM;
  let t=5, gray=false, drag=false;
  const cnt=a=>{const c=new Array(XM+1).fill(0); a.forEach(v=>c[gray?0:v]++); return c;};
  function svg(){
    const cf=cnt(RF), cn=cnt(RN); let g='';
    for(let v=0;v<=80;v+=10) g+=`<line class="gl" x1="${x(v)}" x2="${x(v)}" y1="10" y2="${H-24}"/><text class="tk" x="${x(v)}" y="${H-10}" text-anchor="middle">${v}%</text>`;
    const bar=(v,c,up)=>{ if(!c) return ''; const h=Math.min(c,CAP)*U, hit=up?v>=t:v<t, col=up?'#d64535':'#1f9d74';
      const y=up?MID-h:MID; let s=`<rect x="${x(v)+.5}" y="${y}" width="${Math.max(1.5,bw-1)}" height="${h}" fill="${col}" opacity="${hit?.95:.28}"/>`;
      if(c>CAP) s+=`<text class="tk b" x="${x(v)+bw/2+2}" y="${up?y-3:y+h+11}" text-anchor="start">${c}장</text>`; return s; };
    for(let v=0;v<=XM;v++){ g+=bar(v,cf[v],true); g+=bar(v,cn[v],false); }
    g+=`<line x1="${L}" x2="${W-R}" y1="${MID}" y2="${MID}" stroke="#16202c" stroke-width="1"/>`;
    g+=`<text class="lb" x="${W-R}" y="20" text-anchor="end" fill="#d64535">▲ 산불(fire) 162장</text><text class="lb" x="${W-R}" y="${H-30}" text-anchor="end" fill="#1f9d74">▼ 산불 아님(non) 162장</text>`;
    PICS.filter(p=>p.t).forEach((p,i)=>{ const v=gray?0:p.r; g+=`<g transform="translate(${x(v)+bw/2},${MID})"><path d="M0,-6 L5,-14 L-5,-14 Z" fill="#0f2742"/><text class="tk b" x="0" y="${-18-i*11}" text-anchor="middle">${p.n.split(' ·')[0]}</text></g>`; });
    const tx=x(t);
    g+=`<g class="rg-th"><line x1="${tx}" x2="${tx}" y1="8" y2="${H-24}" stroke="#c98a00" stroke-width="3"/><rect x="${tx-16}" y="${H-24}" width="32" height="18" rx="9" fill="#c98a00"/><text x="${tx}" y="${H-11}" text-anchor="middle" fill="#fff" font-size="11" font-weight="900">${t}%</text></g>`;
    g+=`<text class="tk" x="${tx+6}" y="${MID-4-CAP*U}" text-anchor="start">→ 산불로 판단</text>`;
    return g;
  }
  B.innerHTML=`<div class="row" style="margin-bottom:6px"><button class="btn sm ghost" id="rgC">컬러로 보기</button><button class="btn sm ghost" id="rgG">흑백(회색조)으로 보기</button></div>
    <div class="rg-wrap"><svg id="rgSvg" viewBox="0 0 ${W} ${H}" tabindex="0" role="slider" aria-label="산불로 판단하는 붉은 비율 기준. 왼쪽·오른쪽 방향키로 조절" aria-valuemin="0" aria-valuemax="60"></svg></div>
    <div class="ctrl rg-ctrl"><label for="rgRange">기준</label><input type="range" id="rgRange" min="0" max="60" step="1"><output id="rgOut"></output></div>
    <div class="row"><button class="btn sm ghost" data-t="5">학습 데이터를 가장 잘 맞히는 기준</button><button class="btn sm ghost" data-t="48">빨간색 건물을 「산불 아님」으로 만드는 기준</button></div>
    <div class="rg-stat" id="rgStat"></div><div class="rg-pics" id="rgPics"></div><div class="rg-msg" id="rgMsg"></div>`;
  const sv=$('rgSvg'), rg=$('rgRange');
  function draw(){
    const fv=gray?RF.map(()=>0):RF, nv=gray?RN.map(()=>0):RN;
    const tp=fv.filter(v=>v>=t).length, tn=nv.filter(v=>v<t).length, acc=(tp+tn)/324;
    sv.innerHTML=svg(); sv.setAttribute('aria-valuenow',t);
    rg.value=t; $('rgOut').textContent=t+'%';
    $('rgC').classList.toggle('on',!gray); $('rgG').classList.toggle('on',gray);
    $('rgStat').innerHTML=`<div><b>${(acc*100).toFixed(1)}%</b><small>학습 데이터 324장 정확도</small></div><div><b>${162-tp}</b><small>놓친 산불 사진</small></div><div><b>${162-tn}</b><small>산불로 잘못 판단한<br>산불 아님 사진</small></div>`;
    $('rgPics').innerHTML=PICS.map(p=>{ const v=gray?0:p.r, fire=v>=t, right=fire===!!p.y; return `<figure class="${p.t?'tst':''}"><img class="${gray?'gray':''}" src="${p.s}" alt="${p.n}" width="80" height="80"><figcaption><b>${p.n}</b><span>붉은 비율 ${v}%</span><span class="${right?'ok':'ng'}">→ ${fire?'산불':'산불 아님'} ${right?'✓':'✗'}</span></figcaption></figure>`; }).join('');
    $('rgMsg').innerHTML=msg(acc);
  }
  $('rgC').onclick=()=>{gray=false; draw();}; $('rgG').onclick=()=>{gray=true; draw();};
  rg.oninput=()=>{ t=+rg.value; draw(); };
  B.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{t=+b.dataset.t; draw();});
  const toT=ev=>{ const p=sv.createSVGPoint(); p.x=ev.clientX; p.y=ev.clientY; const q=p.matrixTransform(sv.getScreenCTM().inverse()); return Math.max(0,Math.min(60,Math.round((q.x-L)/(W-L-R)*XM))); };
  sv.addEventListener('pointerdown',ev=>{ drag=true; sv.focus(); try{sv.setPointerCapture(ev.pointerId);}catch(e){} const n=toT(ev); if(n!==t){t=n; draw();} ev.preventDefault(); });
  sv.addEventListener('pointermove',ev=>{ if(!drag) return; const n=toT(ev); if(n!==t){ t=n; draw(); } });
  ['pointerup','pointercancel','lostpointercapture'].forEach(k=>sv.addEventListener(k,()=>{drag=false;}));
  sv.addEventListener('keydown',ev=>{ if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key)) return; ev.preventDefault(); t=Math.max(0,Math.min(60,t+((ev.key==='ArrowRight'||ev.key==='ArrowUp')?1:-1)*(ev.shiftKey?5:1))); draw(); });
  function msg(acc){
    if(gray) return `<b>흑백(회색조)으로 바꾸면</b> 붉은 픽셀이 하나도 없어 324장 모두 0%에 모여요. 「붉으면 산불」 규칙으로는 아무것도 구별할 수 없어(정확도 50%) 모델은 <b>불꽃의 모양, 연기의 결, 밝고 어두운 무늬</b> 같은 다른 단서를 찾아야 해요. BGR2GRAY가 색 편향을 줄이는 까닭이에요.`;
    if(t>47) return `빨간색 건물(46.7%)은 이제 「산불 아님」이에요. 하지만 산불 사진 대부분을 놓쳐 정확도가 <b>${(acc*100).toFixed(0)}%</b>로 떨어졌어요. <b>색 하나로는</b> 산불과 빨간색 건물을 함께 맞힐 수 없어요.`;
    if(t<=1) return '기준이 너무 낮으면 붉은 점이 조금만 있어도 산불로 판단해 숲 사진도 산불이 돼요.';
    return `붉은 비율 <b>${t}%</b> 이상을 산불로 보는 규칙만으로도 학습 데이터의 <b>${(acc*100).toFixed(1)}%</b>를 맞혀요. 산불이 아닌 사진 162장 중 <b>105장은 붉은 픽셀이 0%</b>(대부분 초록 숲)라서예요. 그런데 이 규칙으로는 붉은 비율 46.7%인 <b>빨간색 건물</b>이 산불 사진 대부분보다 더 「산불 같아」 보여요.`;
  }
  draw();
})();

/* ───────── 04 내 결과 · 데이터 더하기 ───────── */
vote('grayVote','grayResult',[['산불이 아님','Non_Fire Image'],['여전히 산불','Fire Image'],['아직 실행하지 못함','셀 흉내로 따라옴']],i=>{
  $('grayVoteMsg').innerHTML=`<p class="note" style="margin-bottom:0">${[
    '빨간색 건물은 맞혔어요(교과서와 같은 결과). 아래 ②에서 진짜 산불도 맞혔는지 꼭 확인해요.',
    '회색조로 바꾸어도 편향이 남을 수 있어요. 빨간색 건물은 회색조에서도 밝고 넓은 면이 있어 밝은 불꽃 사진과 닮아 보일 수 있어요. 학습할 때마다 결과가 달라지니 다시 학습해 볼 수 있어요.',
    '셀 흉내의 결과(예시)를 보고 교과서 결과와 비교해 보세요. 실제 노트북에서는 다른 값이 나올 수 있어요.'][i]}</p>`;
});
vote('grayVote1','grayResult1',[['산불로 맞힘','Fire Image'],['산불을 놓침','Non_Fire Image'],['아직 실행하지 못함','셀 흉내로 따라옴']],i=>{
  $('grayVoteMsg1').innerHTML=`<p class="note" style="margin-bottom:0">${[
    '이번 학습에서는 진짜 산불도 맞혔어요. 하지만 다시 학습하면 놓칠 수도 있어요(검토에서 6번 중 3번 놓침). 사진 몇 장으로 판단하지 말고 더 많은 새 사진으로 확인해야 해요.',
    '빨간 건물은 맞혀도 진짜 산불을 놓쳤다면, 불꽃의 주황색이라는 단서까지 버린 <b>색 정보의 대가</b>예요. 근본적인 해결은 붉지만 산불이 아닌 사진을 학습 데이터에 더하는 것이에요(아래 분류 게임).',
    '셀 흉내에서는 진짜 산불을 놓친 예를 보여 줘요. 왜 그럴 수 있는지 위 ⚠️ 상자를 읽어 보세요.'][i]}</p>`;
});
sorter('dataSort',{cats:[{n:'편향을 줄인다',k:'#1f9d74'},{n:'그대로이거나 커진다',k:'#d64535'}],items:[
  {ic:'🍁',t:'단풍 든 숲, 노을 진 하늘 사진을 non 폴더에 더한다',short:'단풍·노을 → non',c:0,w:'붉지만 산불이 아닌 사진이 생겨 「붉으면 산불」이라는 지름길이 통하지 않게 돼요.'},
  {ic:'🧱',t:'빨간색 건물·빨간 자동차 사진을 non 폴더에 더한다',short:'빨간 건물·차 → non',c:0,w:'바로 오늘 틀린 경우예요. 모델이 색이 아닌 다른 단서를 찾아야 해요.'},
  {ic:'🌫️',t:'연기만 보이는 산불, 밤에 찍은 산불 사진을 fire 폴더에 더한다',short:'연기·밤 산불 → fire',c:0,w:'붉은색이 적은 산불도 배워, 산불을 색 말고 연기나 모양으로도 알아보게 돼요.'},
  {ic:'🔥',t:'주황색 불꽃이 크게 보이는 산불 사진을 fire 폴더에 더 많이 넣는다',short:'큰 불꽃 → fire',c:1,w:'이미 많은 종류의 사진이라 「산불 = 붉다」는 치우침이 더 굳어져요.'},
  {ic:'🌲',t:'초록색 숲 사진만 non 폴더에 더 넣는다',short:'초록 숲만 → non',c:1,w:'「산불 아님 = 초록」이라는 치우침이 그대로예요.'},
  {ic:'📸',t:'fire 폴더 사진을 1,000장으로 늘리고 non 폴더는 162장 그대로 둔다',short:'fire만 1,000장',c:1,w:'한쪽 데이터만 과도하게 많아져 모델이 산불 쪽으로 기울어요. 이것도 데이터 편향이에요.'},
  {ic:'📋',t:'같은 산불 사진을 여러 장 복사해 fire 폴더에 넣는다',short:'같은 사진 복사',c:1,w:'새로운 정보 없이 같은 특징만 강조돼요.'}],
  end:'편향을 줄이려면 <b>모델이 헷갈릴 만한 사진</b>(붉지만 산불이 아닌 것, 붉지 않은 산불)을 골고루 모아 데이터의 균형을 맞춰야 해요.'});

/* ───────── 05 별점 (나 / 모둠) · 빈칸 · 성취도 ───────── */
(function(){
  const B=$('stars');
  const ST=[['문제 정의','지속가능발전목표와 관련 있는 주제를 선정하고, 문제를 명확하게 정의하였는가?'],['데이터 수집 및 전처리','모델을 학습시키기 위해 필요한 데이터를 수집하고 모델에 입력할 수 있도록 전처리하였는가?'],['알고리즘 선정','여러 개의 알고리즘을 비교하여 최적의 알고리즘을 선정하였는가?'],['모델 학습','훈련 데이터와 테스트 데이터를 사용하여 적합한 모델을 생성하였는가?'],['성능 평가 및 수정','평가 지표로 성능을 평가한 후, 성능을 높이기 위한 성능 개선 방법을 사용하였는가?']];
  const WHO=['나','모둠'];
  const val=ST.map(([n])=>WHO.map(w=>{ const m=(MEMO.projStars||'').match(new RegExp(n+'[^·]*?'+w+'(★*)')); return m?m[1].length:0; }));
  function save(){ MEMO.projStars=ST.map(([n],i)=>{ const p=WHO.map((w,k)=>val[i][k]?`${w}${'★'.repeat(val[i][k])}${'☆'.repeat(3-val[i][k])}`:'').filter(Boolean); return p.length?`${n} ${p.join(' ')}`:''; }).filter(Boolean).join(' · '); store.set(MK,MEMO); }
  function draw(){
    B.innerHTML=`<div class="uf-stars">${ST.map(([n,q],i)=>`<div class="row1"><div><b>${n}</b><small>${q}</small></div><div>${WHO.map((w,k)=>`<div class="st" role="group" aria-label="${n} ${w}"><span class="who">${w}</span>${[1,2,3].map(s=>`<button data-i="${i}" data-w="${k}" data-k="${s}" class="${s<=val[i][k]?'on':''}" aria-label="${n} ${w} 별 ${s}개" aria-pressed="${s<=val[i][k]}">★</button>`).join('')}</div>`).join('')}</div></div>`).join('')}</div>`;
    B.querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i, w=+b.dataset.w, k=+b.dataset.k; val[i][w]=val[i][w]===k?0:k; save(); draw(); B.querySelector(`button[data-i="${i}"][data-w="${w}"][data-k="${k}"]`).focus(); });
  }
  draw();
})();
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['데이터 편향성이 무엇인지 설명할 수 있다','빨간색 건물 테스트로 모델의 편향을 확인할 수 있다','BGR2GRAY로 회색조로 바꾸는 까닭과 잃는 정보를 설명할 수 있다','편향을 줄이기 위해 데이터를 어떻게 바꿀지 제안할 수 있다','인공지능 프로젝트 수행 과정을 단계별로 정리할 수 있다'],true);

const MEMOLIST=[['planMemo','내가 생각한 「산불 사진」의 단서'],['biasWhy','빨간색 건물을 산불로 판단한 까닭'],['grayMemo','BGR2GRAY가 편향을 줄인 까닭과 잃는 정보'],['grayResult','회색조 모델: 빨간색 건물(test3) 결과'],['grayResult1','회색조 모델: 진짜 산불(test1) 결과'],['biasCase','일상생활 속 데이터 편향성 사례와 줄이는 방법'],['projStars','프로젝트 수행 과정 별점'],['myWork','단계별로 내가 한 일'],['effectMemo','프로젝트의 기대 효과'],['selfCheckPick','성취도 평가: 할 수 있게 된 것']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
