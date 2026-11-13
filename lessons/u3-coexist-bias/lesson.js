
/* 01 공존 방식 */
sorter('coGame',{
  cats:[{n:'① 생활 편리',k:'#2f6fd0'},{n:'② 노동력 보조·대체',k:'#e0702b'},{n:'③ 능력 보완·발전',k:'#9b4fc4'},{n:'④ 함께 만들기',k:'#d64535'}],
  items:[
    {t:'냉장고 속 재료, 식습관, 알레르기, 좋아하는 맛을 고려해 오늘의 요리를 추천해 준다.',short:'맞춤형 요리 추천',c:0,ic:'🍳'},
    {t:'운전하는 수고를 크게 줄이고, 사람보다 빠르게 반응해 교통사고를 줄인다.',short:'자율주행 자동차',c:0,ic:'🚗'},
    {t:'토양의 습도, 온도, 영양분을 실시간으로 살피며 농장 일을 자동으로 한다.',short:'스마트팜',c:1,ic:'🌾'},
    {t:'공장에서 제조와 물류를 맡고, 식당에서 서빙을 대신한다.',short:'제조·서빙 로봇',c:1,ic:'🤖'},
    {t:'수백만 개의 화합물을 빠르게 검사해 새로운 약의 후보 물질을 찾는다.',short:'신약 개발',c:2,ic:'💊'},
    {t:'학생마다 학습 스타일, 능력, 관심사에 맞춰 알맞은 속도와 방식으로 배우게 한다.',short:'개인 맞춤형 교육',c:2,ic:'📚'},
    {t:'인기 있는 댄스 동작의 조합을 학습해 음악에 맞는 안무를 만든다.',short:'안무 생성',c:3,ic:'💃'},
    {t:'사람의 전문 지식과 인공지능의 대량 데이터 분석 능력을 합쳐 인문, 과학, 예술 등에서 새로운 결과를 낸다.',short:'전문 지식 + 데이터 분석',c:3,ic:'🔬'},
  ],
  end:'같은 기술도 바라보는 방향에 따라 다른 방식이 될 수 있어요. 예를 들어 자율주행 자동차는 운전 노동을 대신하기도 하니, 내가 고른 까닭을 말할 수 있으면 충분해요.'
});

/* 02 사람 vs 인공지능 편향 */
sorter('biasGame',{
  cats:[{n:'🧑 사람의 편향',k:'#e0702b'},{n:'🤖 인공지능의 편향',k:'#9b4fc4'}],
  items:[
    {t:'경험, 문화, 교육, 사회적 환경을 통해 배우면서 생긴다.',short:'근본 이유: 경험·문화·교육·환경',c:0,w:'편향의 근본적 이유'},
    {t:'학습 데이터와 알고리즘에 기반해 학습하면서 생긴다.',short:'근본 이유: 데이터·알고리즘',c:1,w:'편향의 근본적 이유'},
    {t:'시간과 경험에 따라 의견과 인식이 바뀔 수 있다.',short:'변경: 시간·경험에 따라 바뀜',c:0,w:'편향의 변경 가능성'},
    {t:'데이터나 알고리즘이 바뀌지 않는 한 같은 패턴을 보인다.',short:'변경: 바꾸기 전엔 같은 패턴',c:1,w:'편향의 변경 가능성'},
    {t:'스스로 알아차리기 어렵고, 자각과 교육을 통해 고칠 수 있다.',short:'수정: 자각·교육',c:0,w:'인식 및 수정 가능성'},
    {t:'결과가 치우쳐 나오는 것을 보고 알아차리고, 데이터와 알고리즘을 바꿔 고친다.',short:'수정: 데이터·알고리즘 변경',c:1,w:'인식 및 수정 가능성'},
    {t:'개인이나 집단의 행동, 선택, 판단에 영향을 준다.',short:'영향: 개인·집단',c:0,w:'편향의 영향력'},
    {t:'다양한 프로그램, 서비스, 시스템에 영향을 준다.',short:'영향: 프로그램·서비스·시스템',c:1,w:'편향의 영향력'},
  ],
  end:'인공지능의 편향은 한 번 생기면 그 인공지능을 쓰는 <b>수많은 서비스에 똑같이 퍼질 수 있어요.</b> 그래서 더 꼼꼼히 살펴야 해요.'
});

/* 03 실험 ① 학습 데이터 편향 */
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function gauss(r){let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function face(r,dark,s){const m=dark?0.14+0.22*s+gauss(r)*0.06:0.30+0.40*s+gauss(r)*0.08;const b=dark?0.08+0.27*r():0.65+0.3*r();return{m,b,s,dark};}
function faces(seed,nb,nd){const r=rng(seed),a=[];for(let i=0;i<nb;i++)a.push(face(r,0,i%2));for(let i=0;i<nd;i++)a.push(face(r,1,i%2));return a;}
const DK_TEST=faces(999,200,200);
function knn(tr,p){const d=tr.map(t=>[Math.hypot(t.m-p.m,(t.b-p.b)*0.35),t.s]).sort((a,b)=>a[0]-b[0]).slice(0,5);return d.filter(x=>x[1]).length>=3?1:0;}
(function(){
  const opts=[0,5,10,30,50];
  $('dkBtns').innerHTML=opts.map(p=>`<button data-p="${p}">어두운 사진 ${p}%</button>`).join('');
  const bs=[...$('dkBtns').querySelectorAll('button')];
  const svg=$('dkPlot');
  const X=m=>40+Math.max(0,Math.min(1,m))*360, Y=b=>275-b*255;
  function run(p){
    bs.forEach(b=>b.classList.toggle('on',+b.dataset.p===p));
    const nd=p, tr=faces(1,100-nd,nd);
    svg.innerHTML='';
    el('rect',{x:40,y:Y(1),width:360,height:Y(0.5)-Y(1),fill:'#fff8e6'},svg);
    el('rect',{x:40,y:Y(0.5),width:360,height:Y(0)-Y(0.5),fill:'#e9ecf1'},svg);
    el('text',{x:396,y:Y(0.97),'text-anchor':'end','font-size':12,fill:'#8a5a00'},svg,'밝은 사진');
    el('text',{x:396,y:Y(0.03),'text-anchor':'end','font-size':12,fill:'#5b6776'},svg,'어두운 사진');
    el('line',{x1:40,y1:275,x2:400,y2:275,stroke:'#9aa6b5'},svg); el('line',{x1:40,y1:20,x2:40,y2:275,stroke:'#9aa6b5'},svg);
    el('text',{x:220,y:294,'text-anchor':'middle','font-size':12,fill:'#5b6776'},svg,'입꼬리가 올라간 정도 →');
    el('text',{x:14,y:150,'text-anchor':'middle','font-size':12,fill:'#5b6776',transform:'rotate(-90 14 150)'},svg,'밝기 →');
    tr.forEach(t=>{const x=X(t.m),y=Y(t.b);
      if(t.s) el('circle',{cx:x,cy:y,r:5,fill:'#f2a516',stroke:'#8a5a00','stroke-width':1},svg);
      else{el('line',{x1:x-4,y1:y-4,x2:x+4,y2:y+4,stroke:'#0f2742','stroke-width':2},svg);el('line',{x1:x-4,y1:y+4,x2:x+4,y2:y-4,stroke:'#0f2742','stroke-width':2},svg);}
    });
    const acc=g=>{const t=DK_TEST.filter(x=>x.dark===g);return t.filter(x=>knn(tr,x)===x.s).length;};
    const a0=acc(0),a1=acc(1);
    $('dkRes').innerHTML=[['☀️ 밝은 사진',a0,'#f2a516'],['🌙 어두운 사진',a1,'#5b6776']].map(([n,v,c])=>`<div class="pct"><span>${n}</span><i style="width:${v/2}%;background:${c}"></i><b>${Math.round(v/2)}%</b></div><p class="note" style="margin:-4px 0 6px 128px">200장 중 ${v}장 맞힘</p>`).join('');
    $('dkMsg').innerHTML=a1<140?`어두운 사진은 <b>절반쯤 찍기 수준</b>으로 맞혀요. 학습 사진에 어두운 사진이 ${nd}장뿐이라, 어두운 사진에서 웃는 얼굴(입꼬리 수치가 작게 나옴)을 <b>무표정으로 착각</b>해요. 이것이 <b>학습 데이터 편향</b>이에요.`:nd<30?`어두운 사진이 ${nd}장만 들어가도 많이 좋아졌어요. 그래도 비율을 더 늘리면 어떻게 되는지 확인해 보세요.`:`어두운 사진을 충분히 넣으니 두 경우 모두 잘 맞혀요. 인공지능은 그대로인데 <b>데이터만 고르게 바꿨을 뿐</b>이에요.`;
  }
  bs.forEach(b=>b.onclick=()=>run(+b.dataset.p)); run(0);
})();

/* 03 실험 ② 알고리즘 편향 */
(function(){
  const F=[['답변 내용','💬'],['직무 경험','🗂️'],['표정(밝게 웃기)','😀'],['목소리 크기','🔊']];
  const P=[['지원자 가',[10,9,3,4],'실력은 좋지만 긴장해서 표정이 굳고 목소리가 작음'],['지원자 나',[5,4,9,9],'밝고 목소리가 크지만 답변 내용이 아쉬움'],['지원자 다',[7,8,5,6],'경험이 많음'],['지원자 라',[4,5,8,7],'인상이 좋음'],['지원자 마',[8,6,6,4],'답변이 탄탄함']];
  let W=[1,1,1,1];
  $('ivW').innerHTML=F.map((f,i)=>`<div class="ctrl" style="grid-template-columns:150px 1fr 30px"><label>${f[1]} ${f[0]}</label><input type="range" min="0" max="3" step="1" data-i="${i}"><output></output></div>`).join('')+'<p class="note">가중치 0 = 보지 않음, 3 = 아주 크게 봄</p>';
  const rs=[...$('ivW').querySelectorAll('input')];
  function draw(){
    rs.forEach((r,i)=>{r.value=W[i]; r.nextElementSibling.textContent=W[i];});
    const sw=W.reduce((a,b)=>a+b,0)||1;
    const sc=P.map(p=>({n:p[0],d:p[2],s:p[1].reduce((a,v,i)=>a+v*W[i],0)/sw})).sort((a,b)=>b.s-a.s);
    $('ivT').innerHTML='<tr><th>순위</th><th class="l">지원자</th><th>점수</th></tr>'+sc.map((x,i)=>`<tr${x.n==='지원자 가'?' style="background:#fff8e6"':''}><td><b>${i+1}</b></td><td class="l">${x.n}<br><small class="muted">${x.d}</small></td><td><b>${x.s.toFixed(1)}</b></td></tr>`).join('');
    const ga=sc.findIndex(x=>x.n==='지원자 가')+1;
    $('ivMsg').innerHTML=ga===1?'답변과 경험을 중심으로 보면 <b>지원자 가</b>가 1등이에요.':ga>=4?`답변이 가장 좋은 <b>지원자 가</b>가 ${ga}위로 밀렸어요. 지원자 데이터는 그대로인데 <b>어떤 속성에 가중치를 두느냐(알고리즘)</b>만 바꿨을 뿐이에요. 이것이 <b>알고리즘 편향</b>이에요. 실제 인공지능 면접관은 이 가중치를 지원자가 알기 어렵다는 점도 문제예요.`:`지금 <b>지원자 가</b>는 ${ga}위예요. 표정·목소리의 가중치를 올려 보세요.`;
  }
  rs.forEach(r=>r.oninput=()=>{W[+r.dataset.i]=+r.value; draw();});
  $('ivFair').onclick=()=>{W=[3,3,0,0];draw();}; $('ivLook').onclick=()=>{W=[0,0,3,3];draw();}; $('ivEven').onclick=()=>{W=[1,1,1,1];draw();};
  draw();
})();

/* 04 윤리적 쟁점 */
tabs('issBtns','issView',[
 {ic:'🧑‍💼',n:'인공지능 면접관',c:'코로나 사태로 비대면에 알맞고 경제적이라는 이유로 기업들이 인공지능 면접관을 도입했어요. 지원자의 얼굴 표정, 음성 등을 분석해 평가한다고 알려졌지만 <b>뚜렷한 평가 방법은 알기 힘들어요.</b> 정답과 다른 대답을 해도 표정이나 목소리만으로 높은 점수를 줄 수 있어, 겉모습으로 내면이나 업무 역량을 평가하기 어렵다는 문제가 제기되었어요.',p:'특정 성별, 인종, 연령대, 지역, 교육, 외모, 목소리 같은 겉으로 드러나는 속성 때문에 <b>불리하게 평가</b>될 수 있어요. 차별과 불평등이 심해지고, <b>잠재적인 인재를 놓칠</b> 위험이 있어요.'},
 {ic:'🛡️',n:'킬러 로봇',c:'킬러 로봇은 전쟁에서 <b>사람의 개입 없이</b> 스스로 공격하고 방어하는 인공지능 무기 시스템이에요. 아군의 인명 피해를 줄이고 정밀하게 공격할 수 있다는 이유로 쓰이지만, 오용될 수 있고 사람을 위협하는 존재가 될 수 있다는 경고의 목소리가 커요.',p:'로봇이 공격 대상을 <b>잘못 학습</b>하면 특정 집단을 무차별적으로 공격하거나 지나치게 공격적일 수 있어요. 잘못된 목표를 공격하거나 오히려 위험에 빠질 수 있어요.'},
 {ic:'🎭',n:'생성형 인공지능',c:'생성형 인공지능은 글, 이미지, 소리, 영상을 만들어요. 영상 편집과 얼굴 합성을 결합한 <b>딥페이크</b>는 영화나 광고에서 세상을 떠난 유명인을 되살리고, 광복절에 <b>독립운동가의 생전 모습을 생동감 있게 복원</b>하는 데 쓰였어요. 하지만 악의적인 가짜 뉴스, 영상, 음성으로 사회를 혼란에 빠뜨릴 수 있어 법률과 기술적 대응책이 필요해요.',p:'만들어진 정보에 <b>특정 집단의 가치관이나 이익</b>이 반영될 수 있어요. 가짜 뉴스, 여론 조작, 얼굴 합성 등에 악용되고, 개인 정보 유출로 사생활과 안전을 위협하기도 해요.'},
 {ic:'💬',n:'챗봇',c:'한 기업의 챗봇이 특정 계층에 대한 <b>혐오 발언</b>으로 논란이 되었어요. 사람과 비슷한 인공지능의 말은 무의식적으로 받아들이기 쉬워, 특히 어린이와 청소년이 영향을 받을 수 있어요.',p:'편향된 데이터를 학습하면 결과도 편향돼요. 그래서 학습 데이터를 <b>신중하게 검토하고 정제</b>해야 해요. 아래 「스스로 해결하기」에서 내 생각을 정리해 봐요.'},
],c=>`<div class="card" style="margin:0"><h3>${c.ic} ${c.n}</h3><div class="pr"><div class="s" style="background:#f4f6fa;border-left-color:#5b6776"><h4 style="color:#33404f">사례</h4>${c.c}</div><div class="p"><h4>편향에 따른 윤리적 문제점</h4>${c.p}</div></div></div>`);

/* 05 트롤리 */
(function(){
  const done={};
  const check=()=>{if(done[1]&&done[2]){$('trRev').classList.add('on'); setTimeout(()=>{$('trB1').style.width='89%';$('trB2').style.width='11%';},60);}};
  vote('tr1','tr1',[['당긴다','5명을 구하고 1명이 희생됨'],['당기지 않는다','5명이 희생됨']],()=>{done[1]=1;check();});
  vote('tr2','tr2',[['민다','5명을 구하고 1명이 희생됨'],['밀지 않는다','5명이 희생됨']],()=>{done[2]=1;check();});
})();

/* 06 자율주행 */
vote('av1','av1',[['노인을 피한다','어린아이와 충돌'],['어린아이를 피한다','노인과 충돌'],['정할 수 없다','무작위로 맡긴다']],()=>$('avRev').classList.add('on'));
chips('avQ','avQPick',['행동의 결과가 공정할까?','누구의 이익을 먼저 고려해야 할까?','누구를 먼저 구해야 할까?','어떤 방법으로 결정해야 할까?','사회적 합의를 이루었을까?']);
vote('av2','av2',[['운전자의 안전이 중요하다','차는 타고 있는 사람을 지켜야 한다'],['보행자의 안전이 중요하다','더 약한 사람을 먼저 지켜야 한다']]);

/* 07 마무리 */
const MEMOLIST=[['coRole','공존 속에서 내가 맡고 싶은 역할'],['chat1','편향이 사회 문제가 되는 이유'],['chat2','챗봇 편향의 이유와 줄이는 방법'],['tr1','사례 1 내 선택'],['tr2','사례 2 내 선택'],['trWhy','두 사례에서 내 선택의 까닭'],['av1','사례 3 내 선택'],['avQPick','가장 중요하다고 본 질문'],['av2','보행자 딜레마 내 입장'],['avWhy','내 근거 두 가지'],['avRebut','반대 의견과 내 대답'],['avWho','기준은 누가 정해야 할까']];
onShow[7]=()=>memoSummary('msum',MEMOLIST);
