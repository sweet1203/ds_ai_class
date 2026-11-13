
/* 0 먼저 골라 보기 */
vote('myWay','myWay',[['🗺️ 지도 앱을 켠다','경로를 알려 주는 대로'],['🧭 그 방향으로 일단 가 본다','대충 방향만 알고'],['🛣️ 큰길을 따라간다','아는 큰길까지 먼저'],['🙋 주변에 물어본다','아는 사람에게']]);

/* 01 문제 · 탐색 · 해 */
sorter('pshGame',{
  cats:[{n:'❓ 문제',k:'#2f6fd0'},{n:'🔎 탐색',k:'#1f9d74'},{n:'✅ 해',k:'#e0702b'}],
  items:[
    {t:'오늘 점심 메뉴를 정해야 한다.',short:'점심 메뉴 정하기',c:0,ic:'🍱',w:'교과서 24쪽이 든 일상의 문제예요.'},
    {t:'식당까지 가는 가장 빠른 길을 알고 싶다.',short:'가장 빠른 길 찾기',c:0,ic:'🏃',w:'이것도 교과서가 든 문제의 예예요.'},
    {t:'큰길로 가는 방법과 골목으로 가는 방법을 떠올려 걸리는 시간을 견주어 본다.',short:'길 후보 견주기',c:1,ic:'🗺️',w:'여러 경로를 시도하고 비교하는 것이 탐색이에요.'},
    {t:'「견주어 보니 골목길이 가장 빠르다. 골목길로 가기로 했다.」',short:'골목길로 결정',c:2,ic:'✅',w:'교과서 24쪽: 탐색을 통해 나온 답을 문제의 해라고 해요.'},
  ],
  end:'고민거리가 <b>문제</b>, 선택지를 찾아보고 비교하는 과정이 <b>탐색</b>, 그 결과 고른 답이 <b>해</b>예요.'
});

/* 02 이름표 붙이기 (그림 Ⅰ-5) */
sorter('condGame',{
  cats:[{n:'🚩 초기 상태',k:'#2f6fd0'},{n:'🗺️ 상태 공간',k:'#9b4fc4'},{n:'🔄 상태 정보',k:'#c88a12'},{n:'🏁 목표 상태',k:'#d64535'}],
  items:[
    {t:'[내비게이션] 지금 차가 서 있는 우리 집 앞',short:'우리 집 앞(출발)',c:0,ic:'🏠',w:'문제를 해결하기 시작하는 상태예요.'},
    {t:'[내비게이션] 입력한 목적지인 박물관 주차장에 도착한 상태',short:'박물관 도착',c:3,ic:'🏛️',w:'문제가 해결된 후 상태예요.'},
    {t:'[내비게이션] 집에서 박물관까지 갈 수 있는 여러 도로와 갈림길을 모아 놓은 것',short:'갈 수 있는 도로 전체',c:1,ic:'🛣️',w:'문제 해결 과정에서 나타나는 상태를 모아 놓은 공간이에요.'},
    {t:'[내비게이션] 가는 도중 사고가 나서 도로 하나가 막혔다는 새로운 정보',short:'사고로 도로 막힘',c:2,ic:'🚧',w:'새로운 정보가 나타나 상태 정보가 바뀐 경우예요.'},
    {t:'[내비게이션] 통행료가 있는 도로로 가면 비용이 늘어난다.',short:'통행료(비용)',c:2,ic:'💰',w:'상태가 변경될 때 적용되는 비용도 상태 정보예요.'},
    {t:'[점심 메뉴] 아직 무엇을 먹을지 정하지 않은 상태',short:'아직 안 정함',c:0,ic:'🤔',w:'문제가 주어졌을 때의 상태, 곧 초기 상태예요.'},
    {t:'[점심 메뉴] 고를 수 있는 메뉴 후보를 모두 모아 놓은 것',short:'메뉴 후보 전체',c:1,ic:'📋',w:'여러 가지 해답이 모여 있는 공간이니 상태 공간이에요.'},
    {t:'[점심 메뉴] 먹을 메뉴를 하나로 정한 상태',short:'메뉴 결정',c:3,ic:'🍜',w:'문제가 해결된 후 상태예요.'},
  ],
  end:'어떤 문제든 <b>어디서 시작해(초기 상태)</b> <b>어디에 도착하려는지(목표 상태)</b>, 그 사이에 <b>어떤 상태들이 있는지(상태 공간)</b>, <b>한 상태에서 다음 상태로 옮길 때 따져야 하는 정보나 비용(상태 정보: 걸리는 시간, 통행료, 막힌 길 소식)</b>으로 나눠 볼 수 있어요.'
});

/* 03·04 미로: 만들기와 두 가지 펼치기 */
const MZ=(function(){
  const DR=[-1,0,1,0], DC=[0,1,0,-1];
  function make(R,C){
    const N=R*C, open=Array.from({length:N},()=>[0,0,0,0]), seen=new Uint8Array(N), st=[0]; seen[0]=1;
    while(st.length){
      const c=st[st.length-1], r=c/C|0, k=c%C, nb=[];
      for(let d=0;d<4;d++){const rr=r+DR[d], kk=k+DC[d]; if(rr>=0&&rr<R&&kk>=0&&kk<C&&!seen[rr*C+kk]) nb.push(d);}
      if(!nb.length){st.pop(); continue;}
      const d=nb[Math.random()*nb.length|0], n=(r+DR[d])*C+k+DC[d];
      open[c][d]=1; open[n][(d+2)%4]=1; seen[n]=1; st.push(n);
    }
    let want=Math.round(N/10), tries=0;   /* 벽 몇 개를 더 터서 길이 여러 갈래가 되게 */
    while(want>0&&tries++<3000){
      const c=Math.random()*N|0, d=Math.random()*4|0, r=c/C|0, k=c%C, rr=r+DR[d], kk=k+DC[d];
      if(rr<0||rr>=R||kk<0||kk>=C||open[c][d]) continue;
      open[c][d]=1; open[rr*C+kk][(d+2)%4]=1; want--;
    }
    return {R,C,N,open,S:0,G:N-1};
  }
  const nbs=(m,c)=>{const r=c/m.C|0,k=c%m.C,o=[];for(let d=0;d<4;d++)if(m.open[c][d])o.push((r+DR[d])*m.C+k+DC[d]);return o;};
  const trace=(prev,g)=>{const p=[];for(let c=g;c>=0;c=prev[c])p.push(c);return p.reverse();};
  /* 차례로 펼치기: S에서 가까운 칸부터 */
  function wide(m){
    const prev=new Array(m.N).fill(-2), order=[], q=[m.S]; prev[m.S]=-1;
    while(q.length){const c=q.shift(); order.push(c); if(c===m.G) break; for(const n of nbs(m,c)) if(prev[n]===-2){prev[n]=c; q.push(n);}}
    return {order,path:trace(prev,m.G)};
  }
  /* G 쪽부터 펼치기: G까지 가로·세로 칸 수가 작은 칸부터 */
  function toward(m){
    const h=c=>Math.abs((c/m.C|0)-(m.R-1))+Math.abs(c%m.C-(m.C-1));
    const prev=new Array(m.N).fill(-2), tie=new Array(m.N).fill(0), order=[], open=[m.S]; let t=0; prev[m.S]=-1;
    while(open.length){
      let bi=0; for(let i=1;i<open.length;i++){const a=open[i],b=open[bi]; if(h(a)<h(b)||(h(a)===h(b)&&tie[a]<tie[b])) bi=i;}
      const c=open.splice(bi,1)[0]; order.push(c); if(c===m.G) break;
      for(const n of nbs(m,c)) if(prev[n]===-2){prev[n]=c; tie[n]=++t; open.push(n);}
    }
    return {order,path:trace(prev,m.G)};
  }
  function draw(box,m){
    const cs=24, W=m.C*cs, H=m.R*cs, sw=Math.max(2,cs/7);
    let s=`<svg viewBox="${-sw} ${-sw} ${W+2*sw} ${H+2*sw}" class="mz-svg" role="img" aria-label="${m.R}×${m.C} 미로">`;
    for(let c=0;c<m.N;c++) s+=`<rect data-c="${c}" x="${(c%m.C)*cs}" y="${(c/m.C|0)*cs}" width="${cs}" height="${cs}" class="mz-cell"/>`;
    let d='';
    for(let c=0;c<m.N;c++){
      const x=(c%m.C)*cs, y=(c/m.C|0)*cs, last=c%m.C===m.C-1, bottom=(c/m.C|0)===m.R-1;
      if(!m.open[c][0]) d+=`M${x} ${y}h${cs}`;
      if(!m.open[c][3]&&c!==m.S) d+=`M${x} ${y}v${cs}`;
      if(last&&c!==m.G) d+=`M${x+cs} ${y}v${cs}`;
      if(bottom) d+=`M${x} ${y+cs}h${cs}`;
    }
    s+=`<path class="mz-path" d="" stroke-width="${cs/4}"/><path class="mz-wall" d="${d}" stroke-width="${sw}"/>`;
    const lb=(c,t)=>`<text class="mz-lb" x="${(c%m.C)*cs+cs/2}" y="${(c/m.C|0)*cs+cs/2}" font-size="${cs*.55}">${t}</text>`;
    s+=lb(m.S,'S')+lb(m.G,'G')+`<circle class="mz-me" r="${cs*.3}" cx="-99" cy="-99"/></svg>`;
    box.innerHTML=s;
    const cells=[...box.querySelectorAll('.mz-cell')], path=box.querySelector('.mz-path'), me=box.querySelector('.mz-me');
    return {
      cells,
      paint(c,cls){cells[c].classList.add(cls);},
      clear(){cells.forEach(r=>r.setAttribute('class','mz-cell')); path.setAttribute('d',''); me.setAttribute('cx',-99);},
      path(p){path.setAttribute('d',p.map((c,i)=>`${i?'L':'M'}${(c%m.C)*cs+cs/2} ${(c/m.C|0)*cs+cs/2}`).join(''));},
      me(c){me.setAttribute('cx',(c%m.C)*cs+cs/2); me.setAttribute('cy',(c/m.C|0)*cs+cs/2);}
    };
  }
  return {make,nbs,wide,toward,draw};
})();
const MZ_SIZES=[[5,5,'작은 미로 5×5'],[9,9,'중간 미로 9×9'],[15,15,'큰 미로 15×15']];

/* 03 미로 체험: ① 직접 → ② 차례로 펼치기 → ③ 최선의 길 */
(function(){
  const B=$('mazeA'); let si=0, m, v, pos, moves, seen, token=0, step=1;
  const log=[];
  B.innerHTML=`<div class="row mz-size" id="mzaSize">${MZ_SIZES.map((z,i)=>`<button class="btn sm ghost" data-i="${i}">${z[2]}</button>`).join('')}<button class="btn sm ghost" id="mzaNew">🔀 새 미로</button></div>
    <div class="row mz-steps" id="mzaSteps"><button class="btn sm" data-s="1">① 직접 길 찾기</button><button class="btn sm ghost" data-s="2">② 상태 펼쳐 보기</button><button class="btn sm ghost" data-s="3">③ 최선의 길 보기</button></div>
    <div class="mz-wrap"><div class="mz-board" id="mzaBoard" tabindex="0" aria-label="미로 판. 화살표 키로 움직일 수 있어요"></div>
      <div class="mz-side"><div class="mz-pad" id="mzaPad"><span></span><button data-d="0" aria-label="위">↑</button><span></span><button data-d="3" aria-label="왼쪽">←</button><button data-d="2" aria-label="아래">↓</button><button data-d="1" aria-label="오른쪽">→</button></div>
      <div class="mz-stat" id="mzaStat"></div></div></div>
    <div class="mz-log" id="mzaLog"></div>`;
  const stat=$('mzaStat');
  function setStep(s){ step=s; $('mzaSteps').querySelectorAll('button').forEach(b=>{b.classList.toggle('ghost',+b.dataset.s!==s); if(b.dataset.s==='1') b.style.display=si===0?'':'none';}); $('mzaPad').style.visibility=s===1?'visible':'hidden'; }
  function build(){
    token++; m=MZ.make(MZ_SIZES[si][0],MZ_SIZES[si][1]); v=MZ.draw($('mzaBoard'),m);
    $('mzaSize').querySelectorAll('button[data-i]').forEach(b=>b.classList.toggle('ghost',+b.dataset.i!==si));
    if(si===0) walk(); else ready();
  }
  function ready(){
    token++; setStep(0); v.clear(); pos=m.S; moves=0; seen=new Set([m.S]);
    stat.innerHTML=`<b>${MZ_SIZES[si][2]}</b><br>전체 상태(칸) <b>${m.N}</b>개<br>직접 걷기는 작은 미로에서만 해요. ② 를 눌러 컴퓨터가 상태를 펼치는 모습을 보세요.`;
  }
  function walk(){
    if(si!==0) return;
    token++; setStep(1); v.clear(); pos=m.S; moves=0; seen=new Set([m.S]); v.paint(m.S,'v'); v.me(pos);
    stat.innerHTML=`<b>① 직접 길 찾기</b><br>S에서 G까지 가 보세요. 옆 칸을 누르거나 화살표를 써요.<br>전체 상태(칸) <b>${m.N}</b>개`;
  }
  function moveTo(n){
    if(step!==1||pos===m.G) return;
    if(!MZ.nbs(m,pos).includes(n)) return;
    pos=n; moves++; seen.add(n); v.paint(n,'v'); v.me(n);
    stat.innerHTML=pos===m.G?`<b>🎉 도착!</b><br>움직인 횟수 <b>${moves}</b>번<br>들른 상태 <b>${seen.size}</b>개 / 전체 ${m.N}개<br>막힌 길에서 되돌아온 적이 있나요? 이제 ② 를 눌러 보세요.`
      :`<b>① 직접 길 찾기</b><br>움직인 횟수 ${moves}번 · 들른 상태 ${seen.size}개<br>전체 상태(칸) <b>${m.N}</b>개`;
  }
  function expand(){
    const my=++token; setStep(2); v.clear(); const r=MZ.wide(m); let i=0;
    const gap=Math.max(12,Math.min(140,4000/r.order.length));
    (function tick(){
      if(my!==token) return;
      if(i<r.order.length){ v.paint(r.order[i],'e'); i++; stat.innerHTML=`<b>② 상태 펼쳐 보기</b><br>S에서 가까운 칸부터 하나씩 확인 중…<br>확인한 상태 <b>${i}</b>개 / 전체 ${m.N}개`; setTimeout(tick,gap); return; }
      stat.innerHTML=`<b>② 상태 펼쳐 보기 끝</b><br>G를 찾기까지 확인한 상태 <b>${r.order.length}</b>개 / 전체 ${m.N}개<br>이제 ③ 을 눌러 최선의 길을 보세요.`;
      if(!m.logged){ m.logged=1; log.push(`${MZ_SIZES[si][2]}: 전체 상태 ${m.N}개 중 <b>${r.order.length}개</b> 확인 · 최선의 길 ${r.path.length-1}번 이동`); }
      $('mzaLog').innerHTML=`<b>📒 기록</b><ul>${log.slice(-6).map(x=>`<li>${x}</li>`).join('')}</ul>`;
    })();
  }
  function best(){
    token++; setStep(3); const r=MZ.wide(m); v.path(r.path);
    stat.innerHTML=`<b>③ 문제의 해</b><br>최선의 길: <b>${r.path.length-1}</b>번 이동`+(pos===m.G&&moves?`<br>① 에서 내가 움직인 횟수: ${moves}번`:'')+`<br>여러 길 중 가장 짧은 길이에요.`;
  }
  $('mzaSize').querySelectorAll('button[data-i]').forEach(b=>b.onclick=()=>{si=+b.dataset.i; build();});
  $('mzaNew').onclick=build;
  $('mzaSteps').querySelectorAll('button').forEach(b=>b.onclick=()=>({1:walk,2:expand,3:best})[b.dataset.s]());
  $('mzaPad').querySelectorAll('button').forEach(b=>b.onclick=()=>{const d=+b.dataset.d, r=pos/m.C|0, k=pos%m.C; if(m.open[pos][d]) moveTo((r+[-1,0,1,0][d])*m.C+k+[0,1,0,-1][d]);});
  $('mzaBoard').addEventListener('click',e=>{const t=e.target.closest('[data-c]'); if(t) moveTo(+t.dataset.c);});
  B.addEventListener('keydown',e=>{const d={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3}[e.key]; if(d==null) return; e.preventDefault(); $('mzaPad').querySelector(`[data-d="${d}"]`).click();});
  build();
})();

/* 04 같은 미로, 다른 방법 */
(function(){
  const B=$('mazeB'); let si=2, m, v, token=0, res={}, tally={n:0,fewer:0,longer:0};
  const NAME={wide:'🔁 차례로 펼치기',toward:'🎯 G 쪽부터 펼치기'};
  B.innerHTML=`<div class="row mz-size" id="mzbSize">${MZ_SIZES.slice(1).map((z,i)=>`<button class="btn sm ghost" data-i="${i+1}">${z[2]}</button>`).join('')}<button class="btn sm ghost" id="mzbNew">🔀 새 미로</button></div>
    <div class="row mz-steps" id="mzbRun"><button class="btn sm" data-k="wide">${NAME.wide}</button><button class="btn sm mz-or" data-k="toward">${NAME.toward}</button></div>
    <div class="mz-wrap"><div class="mz-board" id="mzbBoard"></div>
      <div class="mz-side"><table class="mz-tbl"><thead><tr><th>방법</th><th>확인한 상태</th><th>찾은 길</th></tr></thead><tbody id="mzbTbl"></tbody></table><div class="mz-stat" id="mzbStat"></div></div></div>`;
  function table(){
    $('mzbTbl').innerHTML=['wide','toward'].map(k=>`<tr><td>${NAME[k]}</td><td>${res[k]?`<b>${res[k].order.length}</b>개`:'–'}</td><td>${res[k]?`${res[k].path.length-1}번 이동`:'–'}</td></tr>`).join('');
  }
  function build(){
    token++; m=MZ.make(MZ_SIZES[si][0],MZ_SIZES[si][1]); v=MZ.draw($('mzbBoard'),m); res={}; table();
    $('mzbSize').querySelectorAll('button[data-i]').forEach(b=>b.classList.toggle('ghost',+b.dataset.i!==si));
    $('mzbStat').innerHTML=`전체 상태 <b>${m.N}</b>개. 두 방법을 차례로 눌러 보세요.`;
  }
  function run(k){
    const my=++token; v.clear(); const r=MZ[k](m); let i=0, cls=k==='wide'?'e':'o';
    const gap=Math.max(10,Math.min(120,3500/r.order.length));
    (function tick(){
      if(my!==token) return;
      if(i<r.order.length){ v.paint(r.order[i],cls); i++; $('mzbStat').innerHTML=`${NAME[k]}: 확인한 상태 <b>${i}</b>개…`; setTimeout(tick,gap); return; }
      v.path(r.path); res[k]=r; table();
      if(res.wide&&res.toward){
        const a=res.wide, b=res.toward, fewer=b.order.length<a.order.length, longer=b.path.length>a.path.length;
        if(!res.counted){ res.counted=1; tally.n++; if(fewer) tally.fewer++; if(longer) tally.longer++; }
        $('mzbStat').innerHTML=(fewer?`G 쪽부터 펼치니 확인한 상태가 <b>${a.order.length-b.order.length}개 줄었어요</b>. `:'이번 미로에서는 G 쪽부터 펼쳐도 확인한 상태가 줄지 않았어요. G 쪽에 막다른 길이 있으면 그래요. ')
          +(longer?`그런데 찾은 길이 <b>${b.path.length-a.path.length}번 더 길어요</b>. 빨리 찾았지만 가장 좋은 해는 아니에요.`:'찾은 길은 가장 짧은 길과 같아요.')
          +`<br><span class="muted">지금까지 ${tally.n}번 비교: 확인한 상태가 준 경우 ${tally.fewer}번 · 길이 더 길어진 경우 ${tally.longer}번</span>`;
      } else $('mzbStat').innerHTML=`${NAME[k]} 끝! 이제 다른 방법도 눌러 보세요.`;
    })();
  }
  $('mzbSize').querySelectorAll('button[data-i]').forEach(b=>b.onclick=()=>{si=+b.dataset.i; build();});
  $('mzbNew').onclick=build;
  $('mzbRun').querySelectorAll('button').forEach(b=>b.onclick=()=>run(b.dataset.k));
  build();
})();

/* 05 빈칸 확인 · 스스로 점검 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheck',['문제, 탐색, 해의 뜻을 말할 수 있다','초기 상태 · 상태 공간 · 상태 정보 · 목표 상태를 구별할 수 있다','상태 공간이 넓으면 왜 어려운지 설명할 수 있다','탐색의 역할과 중요성을 설명할 수 있다'],true);

const MEMOLIST=[['myWay','처음 가는 곳을 찾아갈 때 나는'],['firstRoute','처음 가는 길: 초기 상태 · 목표 상태 · 상태 공간 (질문폼 1)'],['mazeHard','상태 공간이 넓으면 왜 어려울까 (질문폼 2)'],['humanTip','사람의 요령과 컴퓨터에게 필요한 것 (질문폼 3)'],['searchRole','스스로 해결하기: 탐색의 역할과 중요성'],['selfCheck','스스로 점검: 할 수 있게 된 것']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
