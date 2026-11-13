/* ───────── 셀 실행 흉내 (여러 화면이 상태를 함께 씀) ───────── */
/* 학습 기록: 교과서 소스 노트북(204쪽~215쪽_산불이미지분류하기.ipynb)의 실제 출력 */
const UF_LOG=[[0.9273,0.6019,'118s 3s'],[0.3500,0.8611,'29s 814ms'],[0.3642,0.8889,'29s 815ms'],[0.2564,0.9105,'29s 800ms'],[0.2039,0.9228,'29s 793ms'],[0.1395,0.9475,'29s 796ms'],[0.1014,0.9568,'29s 803ms'],[0.0764,0.9753,'28s 788ms']];
const NB={busy:false,out:{}};
const ufErr=(e,why)=>`<div class="uf-err">${e}</div><div class="uf-why">${why}</div>`;
const ufOK=t=>`<span class="ok">✓ 실행 완료</span> <span class="muted">${t||'(출력 없음)'}</span>`;
const ufPre=t=>`<pre class="uf-out sm">${t}</pre>`;
function ufChart(){
  const W=320,H=190,L=34,R=10,T=12,B=28, n=UF_LOG.length;
  const x=i=>L+i*(W-L-R)/(n-1), y=v=>T+(1-v)*(H-T-B);
  let g='';
  [0,.2,.4,.6,.8,1].forEach(v=>g+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text class="tk" x="${L-5}" y="${y(v)+3}" text-anchor="end">${v.toFixed(1)}</text>`);
  for(let i=0;i<n;i++) g+=`<text class="tk" x="${x(i)}" y="${H-B+13}" text-anchor="middle">${i}</text>`;
  g+=`<text class="tk" x="${W-R}" y="${H-3}" text-anchor="end">epoch</text>`;
  const path=k=>UF_LOG.map((r,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(Math.min(1,r[k])).toFixed(1)}`).join('');
  g+=`<path d="${path(0)}" fill="none" stroke="#d64535" stroke-width="2.2" stroke-dasharray="6 4"/><path d="${path(1)}" fill="none" stroke="#2f6fd0" stroke-width="2.4"/>`;
  g+=`<g transform="translate(${W-108},${T+60})"><rect width="96" height="38" rx="6" fill="#fff" stroke="#e3ddd2"/><line x1="8" x2="28" y1="13" y2="13" stroke="#d64535" stroke-width="2.2" stroke-dasharray="5 3"/><text x="34" y="17" class="tk">loss</text><line x1="8" x2="28" y1="28" y2="28" stroke="#2f6fd0" stroke-width="2.4"/><text x="34" y="32" class="tk">accuracy</text></g>`;
  return `<svg class="uf-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="epoch에 따른 오차와 정확도 그래프">${g}</svg>`;
}
const SUMMARY=`Model: "sequential"
Layer (type)                  Output Shape              Param #
conv2d (Conv2D)               (None, 398, 398, 16)          448
max_pooling2d (MaxPooling2D)  (None, 199, 199, 16)            0
conv2d_1 (Conv2D)             (None, 197, 197, 32)        4,640
max_pooling2d_1 (MaxPooling2D)(None, 98, 98, 32)              0
conv2d_2 (Conv2D)             (None, 96, 96, 32)          9,248
max_pooling2d_2 (MaxPooling2D)(None, 48, 48, 32)              0
flatten (Flatten)             (None, 73728)                   0
dense (Dense)                 (None, 128)             9,437,312
dense_1 (Dense)               (None, 1)                     129
 Total params: 9,451,777 (36.06 MB)`;
const CELLS={
  dl:{t:'① 데이터 내려받기 (수업용)',c:`ZIP_URL = '(선생님 구글 드라이브 공유 주소)'
# (주소에서 ID를 꺼내 gdown으로 fire.zip을 내려받아요)
!unzip -q -o fire.zip
!ls /content/fire`,run(){ NB.dl=true; return ufPre('fire  non  test1.jpg  test2.jpg  test3.jpg'); }},
  ls:{t:'② 이미지 데이터셋 확인하기 (205쪽)',c:`import os
path = '/content/fire'
train_fire_dir = path + '/fire'
train_fire_names = os.listdir(train_fire_dir)
print(train_fire_names[:2])
print(len(train_fire_names))`,run(){ NB.path=true;
    if(!NB.dl) return ufErr(`FileNotFoundError: [Errno 2] No such file or directory: '/content/fire/fire'`,'아직 사진을 내려받지 않아 폴더가 없어요. ① 데이터 내려받기 셀(01 화면)부터 실행하세요.');
    NB.ls=true; return ufPre(`['fire.12.jpg', 'fire.155.jpg']\n162`); }},
  glob:{t:'③ 이미지 데이터 리스트 생성하기 (205쪽)',c:`import glob
train_fire = glob.glob(path + '/fire' + '/*')
train_non_fire = glob.glob(path + '/non' + '/*')
train_fire[:5]`,run(){
    if(!NB.path) return ufErr(`NameError: name 'path' is not defined`,'path는 ② 셀에서 정했어요. ②부터 실행하세요.');
    if(!NB.dl){ NB.globEmpty=true; return ufPre('[]')+'<div class="uf-why">빈 리스트예요. 사진을 내려받지 않아 폴더에 아무것도 없어요. ① 셀을 먼저 실행하세요.</div>'; }
    NB.glob=true; return ufPre(`['/content/fire/fire/fire.12.jpg',\n '/content/fire/fire/fire.155.jpg',\n '/content/fire/fire/fire.67.jpg',\n '/content/fire/fire/fire.3.jpg',\n '/content/fire/fire/fire.98.jpg']`); }},
  rimg:{t:'④ 이미지 데이터 색상 변환 함수 (205쪽)',c:`import cv2
from matplotlib.pyplot import imshow
def read_img(file_path):
  img_arr = cv2.imread(file_path)
  return cv2.cvtColor(img_arr, cv2.COLOR_BGR2RGB)`,run(){ NB.rimg=true; return ufOK('함수를 만들기만 했어요.'); }},
  showF:{t:'⑤ 산불 이미지 시각화하기 (206쪽)',c:`import matplotlib.pyplot as plt
fire_img = read_img(train_fire[7])
plt.title('Fire Image')
plt.xlabel(fire_img.shape)
plt.imshow(fire_img, aspect = 'auto')`,run(){
    if(!NB.rimg) return ufErr(`NameError: name 'read_img' is not defined`,'read_img 함수를 아직 만들지 않았어요. ④ 셀을 먼저 실행하세요.');
    if(!NB.glob&&NB.globEmpty) return ufErr('IndexError: list index out of range','train_fire 리스트가 비어 있어 7번째 사진이 없어요. 사진을 내려받지 않고 ③ 셀을 실행했기 때문이에요. ① → ③ 순서로 다시 실행하세요.');
    if(!NB.glob) return ufErr(`NameError: name 'train_fire' is not defined`,'train_fire 리스트는 ③ 셀에서 만들어요.');
    return `<figure class="uf-plt"><b>Fire Image</b><img src="img/px-fire.jpg" alt="산불 이미지" width="180" height="180"><small>(400, 400, 3)</small></figure>`; }},
  showN:{t:'⑥ 산불이 아닌 이미지 시각화하기 (207쪽)',c:`non_fire_img = read_img(train_non_fire[7])
plt.title('Non Fire Image')
plt.xlabel(non_fire_img.shape)
plt.imshow(non_fire_img, aspect = 'auto')`,run(){
    if(!NB.rimg) return ufErr(`NameError: name 'read_img' is not defined`,'read_img 함수를 아직 만들지 않았어요. ④ 셀을 먼저 실행하세요.');
    if(!NB.glob&&NB.globEmpty) return ufErr('IndexError: list index out of range','train_non_fire 리스트가 비어 있어요. ① → ③ 순서로 다시 실행하세요.');
    if(!NB.glob) return ufErr(`NameError: name 'train_non_fire' is not defined`,'train_non_fire 리스트는 ③ 셀에서 만들어요.');
    return `<figure class="uf-plt"><b>Non Fire Image</b><img src="img/px-non.jpg" alt="산불이 아닌 이미지" width="180" height="180"><small>(400, 400, 3)</small></figure>`; }},
  model:{t:'⑦ CNN 모델 생성하기 (209쪽)',c:`import tensorflow as tf
model = tf.keras.models.Sequential([
      tf.keras.layers.Conv2D(16, (3, 3), activation = 'relu', input_shape = (400, 400, 3)),
      tf.keras.layers.MaxPool2D(2, 2),
      tf.keras.layers.Conv2D(32, (3, 3), activation = 'relu'),
      tf.keras.layers.MaxPool2D(2, 2),
      tf.keras.layers.Conv2D(32, (3, 3), activation = 'relu'),
      tf.keras.layers.MaxPool2D(2, 2),
      tf.keras.layers.Flatten(),
      tf.keras.layers.Dense(128, activation = 'relu'),
      tf.keras.layers.Dense(1, activation = 'sigmoid')
])
model.summary()`,run(){ const re=NB.model; NB.model=true; NB.comp=false; NB.trained=false; return ufPre(SUMMARY)+(re?'<div class="uf-why">모델을 새로 만들었어요. 학습한 내용은 사라졌으니 ⑧ compile과 ⑩ 학습을 다시 해야 해요. (history 변수는 남아 있어요.)</div>':''); }},
  comp:{t:'⑧ CNN 모델 컴파일하기 (210쪽)',c:`model.compile(loss = 'binary_crossentropy', optimizer = 'adam', metrics = ['accuracy'])`,run(){
    if(!NB.model) return ufErr(`NameError: name 'model' is not defined`,'모델을 아직 만들지 않았어요. 03 화면의 ⑦ 셀을 먼저 실행하세요.');
    NB.comp=true; return ufOK(); }},
  gen:{t:'⑨ 훈련 데이터 설정 · 정규화 (210쪽)',c:`from tensorflow.keras.preprocessing.image import ImageDataGenerator
train_datagen = ImageDataGenerator(rescale = 1/255)
train_generator = train_datagen.flow_from_directory(
                  path, target_size = (400,400),
                  batch_size = 9, class_mode = 'binary',
                  seed = 3
)
print(train_generator.class_indices)`,run(){
    if(!NB.path) return ufErr(`NameError: name 'path' is not defined`,'path는 02 화면의 ② 셀에서 정했어요.');
    if(!NB.dl) return ufErr(`FileNotFoundError: [Errno 2] No such file or directory: '/content/fire'`,'사진을 내려받지 않아 폴더가 없어요. ① 셀부터 실행하세요.');
    NB.gen=true; return ufPre(`Found 324 images belonging to 2 classes.\n{'fire': 0, 'non': 1}`); }},
  fit:{t:'⑩ 모델 학습 (210쪽)',c:`history = model.fit(train_generator, steps_per_epoch = 36, epochs = 8, verbose = 1)`,anim:true,run(){
    if(!NB.model) return ufErr(`NameError: name 'model' is not defined`,'모델을 아직 만들지 않았어요. ⑦ 셀부터 실행하세요.');
    if(!NB.gen) return ufErr(`NameError: name 'train_generator' is not defined`,'훈련 데이터를 설정하는 ⑨ 셀을 먼저 실행하세요.');
    if(!NB.comp) return ufErr('ValueError: You must call `compile()` before using the model.','손실 함수·최적화 방법·평가 지표를 정하는 compile( )을 먼저 해야 학습할 수 있어요. ⑧ 셀을 실행하세요.');
    return null; }},
  plot:{t:'⑪ 오차와 정확도 시각화하기 (211쪽)',c:`import matplotlib.pyplot as plt
plt.plot(history.history['loss'], 'r--', label = 'loss')
plt.plot(history.history['accuracy'], 'b-', label = 'accuracy')
plt.xlabel('epoch')
plt.legend()
plt.show()`,run(){
    if(!NB.hist) return ufErr(`NameError: name 'history' is not defined`,'history는 ⑩ 학습 셀이 끝나야 생겨요.');
    return ufChart(); }},
  t1:{t:'⑫ 새 이미지(test1.jpg) 열고 전처리하기 (212쪽)',c:`from PIL import Image
img1 = Image.open(path + '/test1.jpg')
from tensorflow.keras.preprocessing import image
import numpy as np
img_resize1 = img1.resize((400,400))
test_img1 = image.img_to_array(img_resize1) / 255
test_img1 = np.expand_dims(test_img1, axis = 0)
images1 = np.vstack([test_img1])
images1.shape`,run(){
    if(!NB.path) return ufErr(`NameError: name 'path' is not defined`,'path는 02 화면의 ② 셀에서 정했어요.');
    if(!NB.dl) return ufErr(`FileNotFoundError: [Errno 2] No such file or directory: '/content/fire/test1.jpg'`,'사진을 내려받지 않았어요. ① 셀부터 실행하세요.');
    NB.t1=true; return `<div class="uf-row"><img src="img/test1.jpg" alt="test1 산불 사진" width="90" height="90">${ufPre('(1, 400, 400, 3)')}</div>`; }},
  p1:{t:'⑬ 새로운 이미지 데이터로 테스트하기 (213쪽)',c:`classes1 = model.predict(images1, batch_size = 10)
print(classes1[0])
if classes1[0][0] &lt; 0.5:
    print('Fire Image')
else:
    print('Non Fire Image')`,run(){
    if(!NB.t1) return ufErr(`NameError: name 'images1' is not defined`,'⑫ 셀에서 test1.jpg를 전처리해야 해요.');
    if(!NB.model) return ufErr(`NameError: name 'model' is not defined`,'모델을 아직 만들지 않았어요. ⑦ 셀부터 실행하세요.');
    if(!NB.trained) return ufPre(`1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 150ms/step\n[0.5013]\nNon Fire Image`)+'<div class="uf-why">학습(⑩)을 하지 않은 모델이라 0.5 근처의 값이 나왔어요. 아무것도 배우지 않았으니 판단이 의미가 없어요.</div>';
    return ufPre(`1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 150ms/step\n[0.0016]\nFire Image`)+'<div class="uf-why">0에 가까우니 산불 이미지예요. <span class="muted">(값은 예시예요. [1.6e-14]처럼 e-14가 붙어 나오면 소수점 아래 0이 13개, 거의 0이라는 뜻이에요.)</span></div>'; }},
  t2:{t:'(이어서) test2.jpg로도 테스트하기 (213쪽)',c:`img2 = Image.open(path + '/test2.jpg')
img_resize2 = img2.resize((400,400))
test_img2 = image.img_to_array(img_resize2) / 255
test_img2 = np.expand_dims(test_img2, axis = 0)
images2 = np.vstack([test_img2])
classes2 = model.predict(images2, batch_size = 10)
print(classes2[0])
if classes2[0][0] &lt; 0.5:
    print('Fire Image')
else:
    print('Non Fire Image')`,run(){
    if(!NB.t1) return ufErr(`NameError: name 'Image' is not defined`,'Image와 image, np는 ⑫ 셀에서 불러왔어요. ⑫를 먼저 실행하세요.');
    if(!NB.model) return ufErr(`NameError: name 'model' is not defined`,'모델을 아직 만들지 않았어요. ⑦ 셀부터 실행하세요.');
    if(!NB.trained) return ufPre(`[0.4991]\nFire Image`)+'<div class="uf-why">학습(⑩)을 하지 않은 모델이라 0.5 근처의 값이 나왔어요. 0.5보다 조금 작아 「Fire」가 나왔을 뿐, 의미 있는 판단이 아니에요.</div>';
    return `<div class="uf-row"><img src="img/test2.jpg" alt="test2 숲 사진" width="90" height="90">${ufPre(`[1.]\nNon Fire Image`)}</div><div class="uf-why">1에 가까우니 산불이 아닌 이미지예요. <span class="muted">(값은 예시예요.)</span></div>`; }}
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
function runCell(id){
  if(NB.busy) return;
  const c=CELLS[id], r=c.run();
  if(r!==null){ setOut(id,r); return; }
  /* 학습 셀: 한 줄씩 */
  NB.busy=true; NB.trained=false; Object.keys(SIMS).forEach(b=>$(b)&&$(b).querySelectorAll('.uf-run').forEach(x=>x.disabled=true));
  let lines=[], i=0;
  const step=()=>{
    const [loss,acc,tm]=UF_LOG[i];
    lines.push(`Epoch ${i+1}/8\n36/36 ━━━━━━━━━━━━━━━━━━━━ ${tm}/step - accuracy: ${acc.toFixed(4)} - loss: ${loss.toFixed(4)}`);
    setOut(id,ufPre(lines.join('\n'))+(i<UF_LOG.length-1?'<div class="uf-why">학습 중… (실제로는 한 줄에 몇 초~수십 초)</div>':''));
    i++;
    if(i<UF_LOG.length) setTimeout(step,420);
    else { NB.busy=false; NB.trained=true; NB.hist=true; setOut(id,ufPre(lines.join('\n'))+'<span class="ok">✓ 학습 완료</span> 정확도가 0.60 → 0.98로 올라가고 오차는 0.93 → 0.08로 줄었어요.'); Object.keys(SIMS).forEach(b=>$(b)&&$(b).querySelectorAll('.uf-run').forEach(x=>x.disabled=false)); }
  };
  step();
}
nbSim('sim1',['dl']);
nbSim('sim2',['ls','glob','rimg','showF','showN']);
nbSim('sim3',['model']);
nbSim('sim4',['comp','gen','fit','plot']);
nbSim('sim5',['t1','p1','t2']);

/* ───────── 02 사진은 숫자 (400, 400, 3) ───────── */
(function(){
  const B=$('pxGame');
  const PICS=[['img/px-fire.jpg','산불 사진'],['img/px-non.jpg','숲 사진']];
  let pic=0, bgr=false, cx=104, cy=132, base=null, ok=true;
  B.innerHTML=`<div class="uf-px">
    <div class="uf-pxl"><canvas id="pxCv" width="200" height="200" tabindex="0" role="img" aria-label="사진. 누르거나 방향키로 점을 고르세요"></canvas>
      <div class="row" style="margin-top:6px">${PICS.map((p,i)=>`<button class="btn sm ghost" data-p="${i}">${p[1]}</button>`).join('')}</div></div>
    <div class="uf-pxr">
      <div class="uf-pxpos" id="pxPos"></div>
      <div id="pxVals"></div>
      <button class="btn sm" id="pxBgr"></button>
      <div class="uf-pxmsg" id="pxMsg"></div>
    </div></div>`;
  const cv=$('pxCv'), ctx=cv.getContext('2d');
  function load(){
    const im=new Image();
    im.onload=()=>{ ctx.drawImage(im,0,0,200,200); try{ base=ctx.getImageData(0,0,200,200); ok=true; }catch(e){ ok=false; } draw(); };
    im.src=PICS[pic][0];
  }
  function draw(){
    B.querySelectorAll('[data-p]').forEach(b=>b.classList.toggle('on',+b.dataset.p===pic));
    $('pxBgr').textContent=bgr?'↩ RGB로 바꿔 보기 (read_img)':'cv2로 읽은 그대로(BGR) 보기';
    if(!ok){ $('pxVals').innerHTML='<p class="note">이 환경에서는 사진의 숫자를 읽을 수 없어요. 파일을 직접 열지 말고 인터넷 주소로 열면 돼요.</p>'; return; }
    const d=new ImageData(new Uint8ClampedArray(base.data),200,200);
    if(bgr) for(let i=0;i<d.data.length;i+=4){ const t=d.data[i]; d.data[i]=d.data[i+2]; d.data[i+2]=t; }
    ctx.putImageData(d,0,0);
    ctx.strokeStyle='#fff'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cx+.5,0); ctx.lineTo(cx+.5,200); ctx.moveTo(0,cy+.5); ctx.lineTo(200,cy+.5); ctx.stroke();
    ctx.strokeStyle='#000'; ctx.strokeRect(cx-3.5,cy-3.5,8,8);
    const k=(cy*200+cx)*4, r=base.data[k], g=base.data[k+1], b=base.data[k+2];
    $('pxPos').innerHTML=`사진 속 위치 <b>세로 ${cy*2}, 가로 ${cx*2}</b> <span class="muted">(400 × 400 중)</span>`;
    const bar=(n,v,col)=>`<div class="uf-bar"><span>${n}</span><i><b style="width:${v/255*100}%;background:${col}"></b></i><em>${v}</em><small>÷255 = ${(v/255).toFixed(2)}</small></div>`;
    const sw=bgr?`rgb(${b},${g},${r})`:`rgb(${r},${g},${b})`;
    $('pxVals').innerHTML=`<div class="uf-sw"><i style="background:${sw}"></i>${bgr?`cv2.imread가 읽은 순서 <b>[B, G, R] = [${b}, ${g}, ${r}]</b>`:`이 점의 숫자 <b>[R, G, B] = [${r}, ${g}, ${b}]</b>`}</div>`
      +(bgr?bar('B',b,'#2f6fd0')+bar('G',g,'#1f9d74')+bar('R',r,'#d64535'):bar('R',r,'#d64535')+bar('G',g,'#1f9d74')+bar('B',b,'#2f6fd0'));
    $('pxMsg').innerHTML=bgr?'<b>BGR 순서 그대로</b> 화면에 보여 주면 빨강 자리에 파랑 값이 들어가 <b>불꽃이 파랗게</b> 보여요. 그래서 read_img( )에서 <span class="mono">COLOR_BGR2RGB</span>로 순서를 바꿔요.'
      :'사진 한 장 = 세로 400 × 가로 400 점 × 색 3개 = <b>480,000개의 숫자</b> → <span class="mono">shape (400, 400, 3)</span>. 학습할 때는 <span class="mono">rescale = 1/255</span>로 모든 숫자를 0~1로 바꿔요(정규화).';
  }
  function at(ev){ const r=cv.getBoundingClientRect(); cx=Math.max(0,Math.min(199,Math.floor((ev.clientX-r.left)/r.width*200))); cy=Math.max(0,Math.min(199,Math.floor((ev.clientY-r.top)/r.height*200))); draw(); }
  let down=false;
  cv.addEventListener('pointerdown',e=>{down=true; cv.focus(); try{cv.setPointerCapture(e.pointerId);}catch(x){} at(e); e.preventDefault();});
  cv.addEventListener('pointermove',e=>{ if(down) at(e); });
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>cv.addEventListener(t,()=>{down=false;}));
  cv.addEventListener('keydown',e=>{
    const m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key]; if(!m) return;
    e.preventDefault(); const s=e.shiftKey?10:2; cx=Math.max(0,Math.min(199,cx+m[0]*s)); cy=Math.max(0,Math.min(199,cy+m[1]*s)); draw();
  });
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{ pic=+b.dataset.p; load(); });
  $('pxBgr').onclick=()=>{ bgr=!bgr; draw(); };
  load();
})();

/* ───────── 03 컨볼루션 계산 (교과서 208쪽 그림) ───────── */
(function(){
  const B=$('convGame');
  const I=[[0,0,1,0,0],[0,0,1,1,0],[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0]], K=[[0,1,0],[1,0,1],[0,1,0]];
  const O=[0,1,2].map(r=>[0,1,2].map(c=>{let s=0; for(let i=0;i<3;i++) for(let j=0;j<3;j++) s+=I[r+i][c+j]*K[i][j]; return s;}));
  let sr=0, sc=0;
  function draw(){
    const inp=I.map((row,r)=>`<tr>${row.map((v,c)=>`<td class="${r>=sr&&r<sr+3&&c>=sc&&c<sc+3?'on':''}">${v}</td>`).join('')}</tr>`).join('');
    const ker=K.map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('');
    const out=O.map((row,r)=>`<tr>${row.map((v,c)=>`<td><button class="${r===sr&&c===sc?'on':''}" data-r="${r}" data-c="${c}" aria-label="출력 ${r+1}행 ${c+1}열">${v}</button></td>`).join('')}</tr>`).join('');
    const terms=[], prods=[]; for(let i=0;i<3;i++) for(let j=0;j<3;j++){ terms.push(`${I[sr+i][sc+j]}×${K[i][j]}`); prods.push(I[sr+i][sc+j]*K[i][j]); }
    B.innerHTML=`<div class="uf-conv"><div><table class="uf-mt cv">${inp}</table><small>입력 5×5</small></div><span class="uf-ar">⊛</span><div><table class="uf-mt cv k">${ker}</table><small>커널 3×3</small></div><span class="uf-ar">=</span><div><table class="uf-mt cv o">${out}</table><small>출력 3×3 (누르기)</small></div></div>
      <div class="uf-calc">${terms.join(' + ')}<br>= ${prods.join(' + ')} = <b>${O[sr][sc]}</b></div>
      <p class="note" style="margin-bottom:0">교과서 그림의 출력에는 첫째 줄 가운데가 4, 둘째 줄 왼쪽이 3으로 실려 있지만, 직접 계산하면 <b>3</b>과 <b>2</b>예요. 두 칸을 눌러 확인해 보세요.</p>`;
    B.querySelectorAll('button[data-r]').forEach(b=>b.onclick=()=>{ sr=+b.dataset.r; sc=+b.dataset.c; draw(); B.querySelector(`button[data-r="${sr}"][data-c="${sc}"]`).focus(); });
  }
  draw();
})();

/* ───────── 03 층을 지나며 모양 바뀌기 ───────── */
(function(){
  const B=$('layerGame');
  let f3=32, ch=3, sel=0, optOpen=false;
  const nf=n=>n.toLocaleString('ko-KR');
  function layers(){
    const L=[]; let h=400, c=ch;
    L.push({n:'입력 이미지',s:`(400, 400, ${ch})`,p:null,why:`가로·세로 400 픽셀, 색 채널 ${ch}개${ch===3?'(R, G, B)':'(회색조)'}. <span class="mono">input_shape = (400, 400, ${ch})</span>`});
    [[16,'첫 번째'],[32,'두 번째'],[f3,'세 번째']].forEach(([f,o],k)=>{
      const h2=h-2, p=3*3*c*f+f;
      L.push({n:`Conv2D(${f}) 합성곱층`,s:`(None, ${h2}, ${h2}, ${f})`,p,why:`${o} 합성곱층: 3×3 필터가 가장자리 밖으로 나가지 않으니 ${h} − 3 + 1 = <b>${h2}</b>. 필터 ${f}개가 특징 지도 ${f}장을 만들어 채널이 <b>${f}</b>.<br>매개 변수 = 3 × 3 × (들어오는 채널 ${c}) × (필터 ${f}) + 편향 ${f} = <b>${nf(p)}</b>`});
      h=h2; c=f; const h3=Math.floor(h/2);
      L.push({n:'MaxPool2D(2, 2) 풀링층',s:`(None, ${h3}, ${h3}, ${f})`,p:0,why:`2×2 최대 풀링: ${h} ÷ 2 = ${h/2}${h%2?` → 나머지를 버려 <b>${h3}</b>`:` → <b>${h3}</b>`}. 채널 수는 그대로 ${f}. 풀링은 최댓값만 고르므로 학습할 매개 변수가 <b>0</b>.`});
      h=h3;
    });
    const flat=h*h*c;
    L.push({n:'Flatten',s:`(None, ${flat})`,p:0,why:`3차원 (${h}, ${h}, ${c})를 한 줄로 펼쳐요: ${h} × ${h} × ${c} = <b>${nf(flat)}</b>개. 매개 변수 0.`});
    const p1=flat*128+128;
    L.push({n:'Dense(128) relu',s:'(None, 128)',p:p1,why:`${nf(flat)}개의 값이 128개 뉴런 모두와 연결: ${nf(flat)} × 128 + 편향 128 = <b>${nf(p1)}</b>. 모델 매개 변수의 대부분이 여기에 있어요.`});
    L.push({n:'Dense(1) sigmoid',s:'(None, 1)',p:129,why:`128 × 1 + 편향 1 = <b>129</b>. 시그모이드로 0~1 사이 값 하나를 내요(0에 가까우면 산불, 1에 가까우면 산불 아님).`});
    return L;
  }
  function draw(){
    const L=layers(), tot=L.reduce((s,l)=>s+(l.p||0),0);
    const book=f3===64&&ch===3;
    B.innerHTML=`<div class="uf-scroll"><table class="uf-lt"><tr><th>층</th><th>Output Shape</th><th>Param #</th></tr>
      ${L.map((l,i)=>`<tr class="${i===sel?'on':''} ${i<=sel?'seen':''}" data-i="${i}" tabindex="0"><td>${l.n}</td><td class="m">${l.s}</td><td class="m">${l.p==null?'–':nf(l.p)}</td></tr>`).join('')}
      <tr class="tot"><td colspan="2">Total params</td><td class="m">${nf(tot)}</td></tr></table></div>
      <div class="uf-why2">${L[sel].why}</div>
      <div class="row"><button class="btn sm ghost" id="lyPrev" ${sel?'':'disabled'}>◀ 이전 층</button><button class="btn sm" id="lyNext" ${sel<L.length-1?'':'disabled'}>다음 층 ▶</button></div>
      <details class="uf-more" id="lyOpt" ${optOpen?'open':''}><summary>더 알아보기 · 필터 수와 색 채널을 바꾸면?</summary>
      <div class="row uf-opt"><span>세 번째 합성곱층 필터</span>${[32,64].map(v=>`<button class="btn sm ghost ${f3===v?'on':''}" data-f="${v}">${v}개${v===32?' (교과서 코드)':''}</button>`).join('')}</div>
      <div class="row uf-opt"><span>입력 채널</span>${[3,1].map(v=>`<button class="btn sm ghost ${ch===v?'on':''}" data-ch="${v}">${v===3?'3 (컬러)':'1 (회색조)'}</button>`).join('')}</div>
      ${book?'<p class="note">이 숫자(Flatten 147,456 · Total 18,898,209)가 교과서 209쪽 실행 결과 그림과 같아요. 교과서 그림은 세 번째 합성곱층의 필터를 64개로 실행한 결과예요.</p>':''}
      ${ch===1?'<p class="note">회색조 사진이면 첫 합성곱층의 매개 변수가 448 → 160으로 줄어요. 하지만 Dense(128)의 매개 변수가 그대로라 전체는 거의 같아요.</p>':''}</details>`;
    $('lyOpt').ontoggle=()=>{ optOpen=$('lyOpt').open; };
    B.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{f3=+b.dataset.f; optOpen=true; draw(); B.querySelector(`[data-f="${f3}"]`).focus();});
    B.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{ch=+b.dataset.ch; optOpen=true; draw(); B.querySelector(`[data-ch="${ch}"]`).focus();});
    B.querySelectorAll('tr[data-i]').forEach(r=>{ r.onclick=()=>{sel=+r.dataset.i; draw(); B.querySelector(`tr[data-i="${sel}"]`).focus();};
      r.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault(); r.onclick();} else if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); sel=Math.max(0,Math.min(L.length-1,sel+(e.key==='ArrowDown'?1:-1))); draw(); B.querySelector(`tr[data-i="${sel}"]`).focus(); } }; });
    $('lyPrev').onclick=()=>{ if(sel>0){sel--; draw(); $(sel?'lyPrev':'lyNext').focus();} };
    $('lyNext').onclick=()=>{ if(sel<L.length-1){sel++; draw(); $(sel<L.length-1?'lyNext':'lyPrev').focus();} };
  }
  draw();
})();

/* ───────── 05 개념 빈칸 · 성취도 ───────── */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['데이터셋을 코랩과 연결하고 경로를 올바르게 설정할 수 있다','이미지 데이터셋을 확인하고 색상을 변환하는 코드의 흐름을 설명할 수 있다','CNN 모델의 구성을 이해하고 summary( ) 결괏값을 해석할 수 있다','손실 함수·최적화 함수·평가 지표를 설정하고 학습 횟수를 정할 수 있다','새로운 이미지의 예측 결과와 실제 결과를 비교해 모델의 성능을 평가할 수 있다'],true);

const MEMOLIST=[['planMemo','산불 발생과 기후 변화의 관계'],['roleMemo','우리 모둠의 문제 정의와 내 역할'],['wrongMemo','잘못 판별할 것 같은 사진과 그 까닭'],['selfCheckPick','성취도 평가: 할 수 있게 된 것']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
