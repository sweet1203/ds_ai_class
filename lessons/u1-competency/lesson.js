/* 01 생성형 인공지능과 튜링 테스트 */
vote('genVote','genVote',[['🙆 통과했다','대화만으로 구별하기 어렵다면?'],['🙅 통과하지 못했다','대화만으로는 부족하다면?']],()=>$('genReveal').classList.add('on'));
chips('genFeat','genFeat',['스스로 학습하고 개선','빅데이터 처리','복잡한 문제 해결에 유용','자동화에 최적화'],false);

/* 02 지금의 인공지능이 하는 일은 어느 단계? (20~21쪽 활용 사례 바탕, u1-ai-principle의 자율주행 문장과 겹치지 않게) */
sorter('stageGame',{
  cats:[{n:'👀 인식',k:'#2f6fd0'},{n:'🧠 판단 및 추론',k:'#9b4fc4'},{n:'🦾 행동',k:'#e0702b'}],
  items:[
    {t:'스마트폰이 사진 속 사물, 동물, 장소, 사람의 얼굴을 알아본다.',short:'사진 속 얼굴 알아보기',c:0,ic:'🖼️',w:'이미지 속 대상을 알아보는 일이니 인식이에요. 사진 정리·검색 기능이 이 능력을 써요.'},
    {t:'의료 데이터를 분석해 영상 속 병변을 탐지한다.',short:'병변 탐지',c:0,ic:'🩻',w:'교과서 21쪽 의료 인공지능이에요. 영상에서 병변을 찾아내는 것은 인식이에요.'},
    {t:'온라인 쇼핑몰에서 고객의 취향에 맞는 물품을 골라 추천한다.',short:'취향에 맞는 물품 추천',c:1,ic:'🛒',w:'교과서 20쪽 상업 인공지능이에요. 모은 정보를 바탕으로 무엇을 권할지 정하니 판단 및 추론이에요.'},
    {t:'판단을 내릴 수 있는 근거 조항과 판례를 분석한다.',short:'근거 조항·판례 분석',c:1,ic:'⚖️',w:'교과서 21쪽 법률 지원 인공지능이에요. 근거를 따져 결론을 이끄는 일은 판단 및 추론이에요.'},
    {t:'군사 보행 로봇이 주변의 물리적 상황에 맞게 걷거나 주행한다.',short:'상황에 맞게 걷기·주행',c:2,ic:'🦿',w:'교과서 21쪽 국방 인공지능이에요. 실제로 몸을 움직이는 것은 행동이에요.'},
    {t:'자율 드론이 미리 설정한 위치, 경로, 속도에 따라 날아간다.',short:'설정대로 비행',c:2,ic:'🚁',w:'교과서 20쪽 교통 운송 인공지능이에요. 정해진 대로 실제로 비행하는 것은 행동이에요.'},
  ],
  end:'한 인공지능 안에서도 세 단계가 이어져 있어요. 여기서는 그 일의 <b>중심</b>이 어느 단계인지 골랐어요. 이제 1950년 무렵의 기계와 비교해 보세요. 어느 단계의 능력이 가장 크게 달라졌을까요?'
});

/* 03 지하철 길 찾기 (26쪽 ② 노선도를 간단히 줄임) */
(function(){
  const P={'이대':[28,160],'아현':[78,160],'애오개':[100,208],'충정로':[128,160],'서대문':[142,100],'광화문':[202,72],'시청':[188,160],'종각':[242,118],'종로3가':[298,95],'을지로입구':[236,178],'을지로3가':[298,178],'안국':[298,30],'종로5가':[362,95],'을지로4가':[362,178]};
  const LINE={1:['1호선','#1f3f94'],2:['2호선','#2fa14a'],3:['3호선','#ef7c1c'],5:['5호선','#8b50a4']};
  const E=[['이대','아현',2],['아현','충정로',2],['충정로','시청',2],['시청','을지로입구',2],['을지로입구','을지로3가',2],['을지로3가','을지로4가',2],
    ['애오개','충정로',5],['충정로','서대문',5],['서대문','광화문',5],['광화문','종로3가',5],['종로3가','을지로4가',5],
    ['시청','종각',1],['종각','종로3가',1],['종로3가','종로5가',1],['안국','종로3가',3],['종로3가','을지로3가',3]];
  const START='아현', GOAL='종로3가';
  const nbs=s=>E.filter(([x,y])=>x===s||y===s).map(([x,y])=>x===s?y:x);
  let path=[START]; const found=new Set();
  function draw(){
    const cur=path[path.length-1], done=cur===GOAL, can=done?[]:nbs(cur).filter(s=>!path.includes(s));
    let s=`<svg viewBox="0 0 392 224" role="img" aria-label="간단히 줄인 지하철 노선도">`;
    E.forEach(([a,b,l])=>{const on=path.some((x,i)=>i&&((path[i-1]===a&&x===b)||(path[i-1]===b&&x===a)));
      s+=`<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${LINE[l][1]}" stroke-width="${on?9:5}" stroke-linecap="round" opacity="${on?1:.45}"/>`;});
    Object.entries(P).forEach(([n,[x,y]])=>{
      const cls=[n===cur?'cur':'',path.includes(n)?'vis':'',can.includes(n)?'nb':'',n===GOAL?'goal':''].join(' ');
      const [tx,ty,ta]=(n==='안국'||n==='광화문')?[x,y-14,'middle']:n==='애오개'?[x-13,y+4,'end']:n==='종로3가'?[x+12,y-12,'start']:[x,y+22,'middle'];
      s+=`<g class="m-st ${cls}" data-s="${n}"${can.includes(n)?' tabindex="0" role="button"':''}><circle cx="${x}" cy="${y}" r="${n===cur?11:8}"/><text x="${tx}" y="${ty}" text-anchor="${ta}">${n===START?'🚩':n===GOAL?'🏁':''}${n}</text></g>`;
    });
    s+=`</svg><div class="m-legend">${Object.values(LINE).map(([n,c])=>`<span style="--c:${c}">${n}</span>`).join('')}</div>`;
    $('metro').innerHTML=s;
    $('metro').querySelectorAll('.m-st.nb').forEach(g=>{const f=()=>{path.push(g.dataset.s); draw();}; g.onclick=f; g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}};});
    $('mPath').textContent=path.join(' → ');
    $('mInfo').textContent=`${path.length-1}개 역 이동`;
    const m=$('mMsg');
    if(done){
      found.add(path.join('→'));
      m.className='cp-msg ok';
      m.innerHTML=`🏁 목표 상태 도착! <b>${path.length-1}개 역</b>을 이동했어요. 지금까지 찾은 길: <b>${found.size}개</b><br>「처음부터」를 눌러 다른 길도 찾아보세요. 아현역에서 종로3가역까지 <b>4번 만에 가는 길이 둘</b>이에요. 둘 중 무엇이 <b>최선</b>인지 정하려면 어떤 정보가 더 필요할까요? 이렇게 여러 방법을 생각하고 그중 최선의 해결 방법을 고르는 것이 <b>탐색</b>이에요.`;
    } else if(!can.length){
      m.className='cp-msg ng'; m.innerHTML='더 갈 수 있는 역이 없어요. 「한 칸 되돌리기」로 다른 길을 찾아보세요. 교과서의 미로 탐색처럼 막힌 길에서 되돌아가는 것도 탐색의 한 과정이에요.';
    } else { m.className='cp-msg'; m.textContent=path.length===1?'아현역(초기 상태)에서 출발해요. 이어진 역을 눌러 보세요.':`지금 ${cur}역에 있어요.`; }
  }
  $('mBack').onclick=()=>{if(path.length>1){path.pop(); draw();}};
  $('mReset').onclick=()=>{path=[START]; draw();};
  draw();
})();

/* 04 긍정적·부정적 영향 (26쪽 ③) */
sorter('pnGame',{
  cats:[{n:'👍 긍정적인 영향',k:'#1f9d74'},{n:'👎 부정적인 영향',k:'#d64535'}],
  items:[
    {t:'복잡한 업무에도 쉽게 접근할 수 있게 해 준다.',short:'복잡한 업무에 쉽게 접근',c:0,ic:'🗂️',w:'어려운 업무의 문턱을 낮춰 주는 긍정적인 영향이에요.'},
    {t:'보고서 작성, 정보 검색에 드는 인간의 수고로움을 덜어 준다.',short:'수고로움을 덜어 줌',c:0,ic:'⏱️',w:'시간과 노력을 아껴 다른 일에 집중할 수 있어요.'},
    {t:'스스로 생각할 기회가 줄어 개인의 창의성과 사고력이 제한될 수 있다.',short:'창의성·사고력 제한',c:1,ic:'💭',w:'편리함 뒤에 따라올 수 있는 부정적인 영향이에요.'},
    {t:'인공지능이 찾아 준 정보를 확인하지 않고 그대로 믿을 수 있다.',short:'확인 없이 믿기',c:1,ic:'❓',w:'인공지능의 결과도 틀릴 수 있으니 확인하는 태도가 필요해요.'},
  ],
  end:'같은 인공지능에도 <b>긍정적인 영향과 부정적인 영향이 함께</b> 있어요. 부정적인 영향을 알고 대비하는 것이 인공지능을 잘 활용하는 태도예요.'
});
flipCards('lensCards',[
  {ic:'🙋',f:'누가 불편해질까?',s:'눌러서 생각 질문 보기',b:'일그러진 글자나 작은 그림을 알아보기 어려운 사람은 어떤 일을 겪을까?'},
  {ic:'❌',f:'기계가 틀린다면?',s:'눌러서 생각 질문 보기',b:'사람을 기계로 잘못 판별하거나, 기계를 사람으로 잘못 통과시키면 어떤 일이 생길까?'},
  {ic:'📏',f:'기준은 누가 정할까?',s:'눌러서 생각 질문 보기',b:'「사람다움」을 판별하는 기준을 기계가 정한다면, 그 기준에 맞지 않는 사람은 어떻게 될까?'},
]);

/* 05 내 실력 점검 → 보충/심화 */
const SC=['지식·이해: 인공지능의 개념을 설명할 수 있다','과정·기능: 탐색 과정을 설명할 수 있다','가치·태도: 긍정적·부정적 영향을 인식하고 있다'];
chips('selfCheck','selfCheck',SC,true);
function drawRec(){
  if(MEMO.selfCheck==null){ $('recBox').innerHTML='기준을 고르면 알맞은 활동을 알려 줄게요. 「예」인 기준이 하나도 없다면 아래에서 바로 <b>보충</b>을 고르세요.'; return; }
  const n=MEMO.selfCheck.split(' · ').filter(Boolean).length;
  $('recBox').innerHTML=n===SC.length?'세 기준 모두 「예」예요. 교과서는 <b>심화</b> 활동을 권해요.'
    :`「아니요」인 기준이 ${SC.length-n}개 있어요. 교과서는 <b>보충</b> 활동을 권해요. 보충을 마친 뒤 심화에 도전해도 좋아요.`;
}
$('selfCheck').addEventListener('memo',drawRec); drawRec();
const WORDS=['컴퓨터','인간','다양한 지능적 능력','이해'];
function drawWords(){
  const t=(document.querySelector('[data-memo="branchAns"]').value||'');
  $('wordChk').innerHTML='<b>보기</b>'+WORDS.map(w=>`<span class="${t.includes(w)?'on':''}">${w}</span>`).join('');
}
document.querySelector('[data-memo="branchAns"]').addEventListener('input',drawWords);
vote('branchBox','branchPick',[['🧩 보충','튜링 테스트와 지능적 판단 다시 정리'],['🚀 심화','생활 속 인공지능 원리 찾기']],i=>{
  $('suppPanel').classList.toggle('on',i===0); $('deepPanel').classList.toggle('on',i===1);
  $('branchMemo').style.display='';
  $('branchLbl').textContent=i===0?'보충: 튜링 테스트가 완전한 지능적 판단이라고 할 수 없는 이유 (보기의 용어 사용)':'심화: 내가 찾은 일상생활 사례와 그 속의 인공지능 원리';
  drawWords();
});
onShow[5]=()=>{drawWords(); drawRec();};

const MEMOLIST=[['genVote','생성형 인공지능은 튜링 테스트를…'],['genFeat','근거로 쓸 특성'],['genTT','통과 여부와 근거'],['abilityStage','1950년대 기계에 없던 능력과 단계'],['captchaRisk','기계가 사람을 판별할 때 생길 문제'],['selfCheck','내 실력 점검: 「예」인 기준'],['branchPick','고른 선택 활동'],['branchAns','선택 활동의 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
