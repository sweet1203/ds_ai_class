
/* 01 펭귄 표준화 */
(function(){
  const SD=[5.46,14.06,801.95]; // 교과서 183쪽 describe() 표준편차
  const P=[['아델리',[39,190,3700],'#e0702b'],['턱끈',[49,196,3730],'#9b4fc4'],['젠투',[48,217,5080],'#1f9d74']];
  const X=[50,196,3690];
  function run(std){
    const rows=P.map(([n,v,c])=>{const d=v.map((x,i)=>(X[i]-x)/(std?SD[i]:1)); return {n,c,d,dist:Math.hypot(...d)};});
    const near=rows.reduce((a,b)=>b.dist<a.dist?b:a);
    $('pgT').innerHTML=`<tr><th>종</th><th>부리 차이</th><th>지느러미 차이</th><th>체질량 차이</th><th>거리</th></tr>`+rows.map(r=>`<tr class="${r===near?'near':''}"><td style="color:${r.c};font-weight:900">${r.n}</td>${r.d.map(x=>`<td>${std?x.toFixed(2):Math.round(x)}</td>`).join('')}<td><b>${std?r.dist.toFixed(2):r.dist.toFixed(1)}</b></td></tr>`).join('');
    $('pgMsg').innerHTML=std?`표준화하면 세 속성이 같은 규모가 되어 가장 가까운 종이 <b>${near.n}</b>이에요. 정답! 부리 길이 차이가 제대로 반영됐어요.`:`그대로 재면 체질량 차이(수십~수천 g)가 거리를 거의 다 차지해서 가장 가까운 종이 <b>${near.n}</b>로 나와요. 부리 길이가 11mm나 다른데도요.`;
    $('pgRaw').className='btn sm'+(std?' ghost':''); $('pgStd').className='btn sm'+(std?'':' ghost');
  }
  $('pgRaw').onclick=()=>run(false); $('pgStd').onclick=()=>run(true); run(false);
})();

/* 02~03 리뷰 분류 모의 모델 */
const POS0=['배송이 빨라서 좋아요','품질이 정말 좋아요','디자인이 예쁘고 마음에 들어요','가격 대비 만족스러워요','친구에게도 추천하고 싶어요','색깔이 사진이랑 똑같아요','포장이 꼼꼼해서 만족해요','사이즈가 딱 맞아요'];
const NEG0=['배송이 너무 느려요','품질이 별로예요','사진이랑 색이 달라요','가격에 비해 실망이에요','금방 고장났어요','냄새가 심해요','포장이 엉망이었어요','사이즈가 작아요'];
const TESTS=[['정말 만족해요 또 살게요',0],['선물했는데 반응이 최고예요',0],['배송은 빨랐지만 품질이 별로예요',1],['생각보다 작고 얇아요',1]];
const CANDS=[['가성비 최고예요',0],['선물용으로 최고예요',0],['생각보다 훨씬 좋아요',0],['너무 얇아서 아쉬워요',1],['생각보다 별로였어요',1],['다시는 안 살 거예요',1]];
const LBL=['긍정','부정'];
const tok=s=>{const t=[];s.trim().split(/\s+/).forEach(w=>{if(w.length===1)t.push(w);for(let i=0;i<w.length-1;i++)t.push(w.slice(i,i+2));});return t;};
function trainNB(P,N){const m=[{},{}],tot=[0,0],V=new Set();[P,N].forEach((L,c)=>L.forEach(s=>tok(s).forEach(t=>{m[c][t]=(m[c][t]||0)+1;tot[c]++;V.add(t);})));return{m,tot,V:V.size,n:[P.length,N.length]};}
function predNB(M,s){const lp=[0,1].map(c=>Math.log(M.n[c]/(M.n[0]+M.n[1]))+tok(s).reduce((a,t)=>a+Math.log(((M.m[c][t]||0)+1)/(M.tot[c]+M.V)),0));const mx=Math.max(...lp);const e=lp.map(x=>Math.exp(x-mx));const z=e[0]+e[1];const p=[e[0]/z,e[1]/z];const c=p[0]>=p[1]?0:1;return{c,conf:Math.round(p[c]*100)};}
$('d0').innerHTML=POS0.map(s=>`<li>${s}</li>`).join(''); $('d1').innerHTML=NEG0.map(s=>`<li>${s}</li>`).join('');
let R1=null,R2=null,SEL=new Set();
function testAll(P,N){const M=trainNB(P,N);return TESTS.map(([s,y])=>({s,y,...predNB(M,s)}));}
function table(id,res,prev){$(id).innerHTML=`<tr><th class="l">테스트 문장</th><th>정답</th>${prev?'<th>1차 예측</th>':''}<th>${prev?'개선 후 예측':'예측 (신뢰도)'}</th><th>결과</th></tr>`+res.map((r,i)=>`<tr><td class="l">${r.s}</td><td>${LBL[r.y]}</td>${prev?`<td>${LBL[prev[i].c]} (${prev[i].conf}%)</td>`:''}<td>${LBL[r.c]} (${r.conf}%)</td><td class="${r.c===r.y?'r':'w'}">${r.c===r.y?'맞음':'틀림'}</td></tr>`).join('');}
const nOk=r=>r.filter(x=>x.c===x.y).length;
function first(){R1=testAll(POS0,NEG0); table('t1',R1); $('s1').textContent=`${nOk(R1)} / ${TESTS.length}`; nums();}
function drawCands(){[0,1].forEach(c=>{$('c'+c).innerHTML=CANDS.map((x,i)=>x[1]===c?`<button data-i="${i}" class="${SEL.has(i)?'on':''}" style="--k:${c?'#d64535':'#1f9d74'}">+ ${x[0]}</button>`:'').join(''); $('c'+c).querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i; if(SEL.has(i)) SEL.delete(i); else if(SEL.size<3) SEL.add(i); drawCands();});});}
$('retrain').onclick=()=>{
  const P=POS0.concat([...SEL].filter(i=>CANDS[i][1]===0).map(i=>CANDS[i][0])), N=NEG0.concat([...SEL].filter(i=>CANDS[i][1]===1).map(i=>CANDS[i][0]));
  R2=testAll(P,N); table('t2',R2,R1); $('s2').textContent=`${nOk(R2)} / ${TESTS.length}`;
  const a=nOk(R1),b=nOk(R2), added=[...SEL].map(i=>`「${CANDS[i][0]}」(${LBL[CANDS[i][1]]})`).join(', ')||'아무것도';
  $('cmpMsg').style.display='block';
  $('cmpMsg').innerHTML=(SEL.has(2)&&b<=a?'「생각보다」라는 말이 긍정에도 들어가면서 「생각보다 작고 얇아요」를 더 헷갈리게 됐어요. <b>같은 표현이 두 클래스에 섞이면</b> 오히려 나빠질 수 있어요. ':'')+`${added}를 더했더니 같은 테스트 4개 중 <b>${a}개 → ${b}개</b>를 맞혔어요. `+(b===4?'틀린 원인에 맞는 데이터를 골랐어요!':b>a?'나아졌지만 아직 틀린 문장이 있어요. 그 문장의 원인을 다시 살펴봐요.':'나아지지 않았어요. 수행평가였다면 이것도 근거와 함께 그대로 쓰면 돼요.');
  nums();
};
$('resetSim').onclick=()=>{SEL.clear();R2=null;$('t2').innerHTML='';$('s2').textContent='—';$('cmpMsg').style.display='none';drawCands();nums();};
const HINTS=['「선물했는데 반응이 최고예요」는 칭찬인데 부정으로 나왔어요. 학습 데이터에서 <b>「~예요」로 끝나는 문장</b>은 어느 쪽에 있나요? (별로예요, 실망이에요…) 모델은 뜻이 아니라 <b>자주 함께 나온 글자 조각</b>을 보고 판단해요.','「생각보다 작고 얇아요」는 신뢰도가 낮아요. <b>「얇다」</b>는 학습 데이터에 한 번도 없었고, 부정 데이터의 「작아요」와 「작고」는 모양이 달라서 모델에게는 다른 조각이에요. 학습 데이터에 <b>없는 표현</b>은 잘 못 맞혀요.'];
$('hint1').onclick=()=>{$('hintBox').style.display='block';$('hintBox').innerHTML=HINTS[0];};
$('hint2').onclick=()=>{$('hintBox').style.display='block';$('hintBox').innerHTML=HINTS[1];};
function nums(){ if(!$('myNums')) return; const a=R1?nOk(R1):0, b=R2?nOk(R2):null;
  $('myNums').innerHTML=`<div><small>학습 데이터</small><b>${8+[...SEL].filter(i=>CANDS[i][1]===0).length} / ${8+[...SEL].filter(i=>CANDS[i][1]===1).length}</b><small>긍정 / 부정 개수</small></div><div><small>1차 테스트</small><b>${a} / 4</b><small>정확도 ${a*25}%</small></div><div><small>개선 후 같은 테스트</small><b>${b==null?'—':b+' / 4'}</b><small>${b==null?'03 화면에서 개선해 보세요':'정확도 '+b*25+'%'}</small></div>`; }
drawCands(); first();

/* 06 준비물 */
chips('ready','readyPick',['ML4Kids 학급 계정으로 로그인됨','내 주제 · 입력 · 출력 · 클래스 정함','클래스별 데이터 모을 계획(개수 비슷하게)','테스트 사례 4개 이상 따로 준비','Scratch 연결 방법 알기','근거는 내 이름과 숫자로'],true);

const MEMOLIST=[['why','틀린 사례와 원인'],['improve','개선한 것과 같은 테스트 결과'],['myScratch','내 주제의 Scratch 동작'],['r1','성찰 ① 성능'],['r2','성찰 ② 틀린 원인'],['r3','성찰 ③ 개선과 결과'],['r4','성찰 ④ 한계'],['r5','성찰 ⑤ 사회적 영향'],['readyPick','수행평가 준비 확인']];
onShow[5]=nums;
onShow[6]=()=>memoSummary('msum',MEMOLIST);
