/* 교과서 소스 파일의 Iris1.csv(150행) · Iris2.csv(30행) — 꽃받침 길이, 꽃받침 너비, 꽃잎 길이, 꽃잎 너비(빈칸=결측치), Iris2는 끝에 종류 번호 */
const IRIS1='5.1,3.5,1.4,0.2;4.9,3,1.4,0.2;4.7,3.2,1.3,0.2;4.6,3.1,1.5,0.2;5,3.6,1.4,0.2;5.4,3.9,1.7,0.4;4.6,3.4,1.4,0.3;5,3.4,1.5,0.2;4.4,2.9,1.4,0.2;4.9,3.1,1.5,0.1;5.4,3.7,1.5,0.2;4.8,3.4,1.6,0.2;4.8,3,1.4,0.1;4.3,3,1.1,0.1;5.8,4,1.2,0.2;5.7,4.4,1.5,0.4;5.4,3.9,1.3,0.4;5.1,3.5,1.4,0.3;5.7,3.8,1.7,0.3;5.1,3.8,1.5,0.3;5.4,3.4,1.7,0.2;5.1,3.7,1.5,0.4;4.6,3.6,1,0.2;5.1,3.3,1.7,0.5;4.8,3.4,1.9,0.2;5,3,1.6,0.2;5,3.4,1.6,0.4;5.2,3.5,1.5,0.2;5.2,3.4,1.4,0.2;4.7,3.2,1.6,0.2;4.8,3.1,1.6,0.2;5.4,3.4,1.5,0.4;5.2,4.1,1.5,0.1;5.5,4.2,1.4,0.2;4.9,3.1,1.5,0.1;5,3.2,1.2,0.2;5.5,3.5,1.3,0.2;4.9,3.1,1.5,0.1;4.4,3,1.3,0.2;5.1,3.4,1.5,0.2;5,3.5,1.3,0.3;4.5,2.3,1.3,0.3;4.4,3.2,1.3,0.2;5,3.5,1.6,0.6;5.1,3.8,1.9,0.4;4.8,3,1.4,0.3;5.1,3.8,1.6,0.2;4.6,3.2,1.4,0.2;5.3,3.7,1.5,0.2;5,3.3,1.4,0.2;7,3.2,4.7,1.4;6.4,3.2,4.5,1.5;6.9,3.1,4.9,1.5;5.5,2.3,4,1.3;6.5,2.8,4.6,1.5;5.7,2.8,4.5,1.3;6.3,3.3,4.7,1.6;4.9,2.4,3.3,1;6.6,2.9,4.6,1.3;5.2,2.7,3.9,1.4;5,2,3.5,1;5.9,3,4.2,1.5;6,2.2,4,1;6.1,2.9,4.7,1.4;5.6,2.9,3.6,1.3;6.7,3.1,4.4,1.4;5.6,3,4.5,1.5;5.8,2.7,4.1,1;6.2,2.2,4.5,1.5;5.6,2.5,3.9,1.1;5.9,3.2,4.8,1.8;6.1,2.8,4,1.3;6.3,2.5,4.9,1.5;6.1,2.8,4.7,1.2;6.4,2.9,4.3,1.3;6.6,3,4.4,1.4;6.8,2.8,4.8,1.4;6.7,3,5,1.7;6,2.9,4.5,1.5;5.7,2.6,3.5,1;5.5,2.4,3.8,1.1;5.5,2.4,3.7,1;5.8,2.7,3.9,1.2;6,2.7,5.1,1.6;5.4,3,4.5,1.5;6,3.4,4.5,1.6;6.7,3.1,4.7,1.5;6.3,2.3,4.4,1.3;5.6,3,4.1,1.3;5.5,2.5,4,1.3;5.5,2.6,4.4,1.2;6.1,3,4.6,1.4;5.8,2.6,4,1.2;5,2.3,3.3,1;5.6,2.7,4.2,1.3;5.7,3,4.2,1.2;5.7,2.9,4.2,1.3;6.2,2.9,4.3,1.3;5.1,2.5,3,1.1;5.7,2.8,4.1,1.3;6.3,3.3,6,2.5;5.8,2.7,5.1,1.9;7.1,3,5.9,2.1;6.3,2.9,5.6,1.8;6.5,3,5.8,2.2;7.6,3,6.6,2.1;4.9,2.5,4.5,1.7;7.3,2.9,6.3,1.8;6.7,2.5,5.8,1.8;7.2,3.6,6.1,2.5;6.5,3.2,5.1,2;6.4,2.7,5.3,1.9;6.8,3,5.5,2.1;5.7,2.5,5,2;5.8,2.8,5.1,2.4;6.4,3.2,5.3,2.3;6.5,3,5.5,1.8;7.7,3.8,6.7,2.2;7.7,2.6,6.9,2.3;6,2.2,5,1.5;6.9,3.2,5.7,2.3;5.6,2.8,4.9,2;7.7,2.8,6.7,2;6.3,2.7,4.9,1.8;6.7,3.3,5.7,2.1;7.2,3.2,6,1.8;6.2,2.8,4.8,1.8;6.1,3,4.9,1.8;6.4,2.8,5.6,2.1;7.2,3,5.8,1.6;7.4,2.8,6.1,1.9;7.9,3.8,6.4,2;6.4,2.8,5.6,2.2;6.3,2.8,5.1,1.5;6.1,2.6,5.6,1.4;7.7,3,6.1,2.3;6.3,3.4,5.6,2.4;6.4,3.1,5.5,1.8;6,3,4.8,1.8;6.9,3.1,5.4,2.1;6.7,3.1,5.6,2.4;6.9,3.1,5.1,2.3;5.8,2.7,5.1,1.9;6.8,3.2,5.9,2.3;6.7,3.3,5.7,2.5;6.7,3,5.2,2.3;6.3,2.5,5,1.9;6.5,3,5.2,2;6.2,3.4,5.4,2.3;5.9,3,5.1,1.8';
const IRIS2=',3.1,1.5,0.2,0;4.4,,1.2,0.2,0;5.8,,1.2,,0;5.7,4,1.2,0.2,0;,3.8,1.7,0.3,0;5.4,4.3,1.6,,0;4.3,2.5,1.2,0.1,0;4.8,3.8,1.4,0.2,0;5.3,4.2,1.5,0.2,0;5.4,4.1,1.5,0.2,0;15,2.9,4.7,1.4,1;5.6,,,1.3,1;6.7,3.1,4.4,1.4,1;5.6,3,4.5,5.2,1;5.8,2.7,4.1,111,1;6.2,2.2,4.5,1.5,1;5.4,2.5,3.8,1.2,1;5.2,3.3,3.6,1,1;6.7,3.2,4.2,1.3,1;6.8,2.5,4.6,1.7,1;6.8,3,55,2.1,2;5.7,2.5,5,2,2;5.8,2.8,51,2.4,2;6.4,3.2,5.3,2.3,2;6.5,,,,2;,3.2,6.1,2.2,2;7.8,3.6,6.5,2.4,2;7.4,3.4,6.3,2.3,2;6.5,2.7,5.2,2,2;5.5,2.6,4.6,1.5,2';
const SPK=['세토사','버시컬러','버지니카'], ATT=['꽃받침 길이','꽃받침 너비','꽃잎 길이','꽃잎 너비'], SPC=['#4c72b0','#dd8452','#55a868'];
const numv=s=>s===''?NaN:+s;
const ALL=[];   /* pd.concat([df1, df2]) — 인덱스는 원래 것을 유지(Iris1 0~149, Iris2 0~29) */
IRIS1.split(';').forEach((r,i)=>ALL.push({id:i+1,idx:i,v:r.split(',').map(numv),s:Math.floor(i/50),src:1}));
IRIS2.split(';').forEach((r,i)=>{const a=r.split(','); ALL.push({id:151+i,idx:i,v:a.slice(0,4).map(numv),s:+a[4],src:2});});
const hasNa=r=>r.v.some(x=>isNaN(x));
const DF3=ALL.filter(r=>!hasNa(r));                                   /* df.dropna(axis=0) → 172행 */
const DROP=[3,5,6,10,13,14,18,20,22,23,24,35,43,44,98,106];
const DF3D=DF3.filter(r=>!DROP.includes(r.idx));                      /* 교과서 71쪽 drop 결과 → 147행 */

/* 통계 도우미 (pandas와 같은 방식: 분위수는 선형 보간, 표준편차는 n−1) */
const sortN=a=>a.slice().sort((x,y)=>x-y);
const qtl=(s,p)=>{const h=(s.length-1)*p, l=Math.floor(h); return l+1<s.length?s[l]+(h-l)*(s[l+1]-s[l]):s[l];};
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const sdev=a=>{const m=mean(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/(a.length-1));};
const median=a=>qtl(sortN(a),.5);
function desc(a){const s=sortN(a); return {count:a.length,mean:mean(a),std:sdev(a),min:s[0],q1:qtl(s,.25),q2:qtl(s,.5),q3:qtl(s,.75),max:s[s.length-1]};}
function fence(a){const s=sortN(a), q1=qtl(s,.25), q3=qtl(s,.75), iqr=q3-q1; return {q1,q2:qtl(s,.5),q3,iqr,lo:q1-1.5*iqr,hi:q3+1.5*iqr};}
function corr(a,b){const ma=mean(a),mb=mean(b); let sab=0,sa=0,sb=0; a.forEach((x,i)=>{sab+=(x-ma)*(b[i]-mb); sa+=(x-ma)**2; sb+=(b[i]-mb)**2;}); return sab/Math.sqrt(sa*sb);}
const trim=(v,d)=>String(+v.toFixed(d===undefined?3:d));
const f1=v=>{const s=trim(v,2); return s.includes('.')?s:s+'.0';};   /* 15 → 15.0 */
const decs=v=>{for(let d=0;d<=6;d++) if(Math.abs(+v.toFixed(d)-v)<1e-9) return d; return 6;};
const colFmt=vals=>{const d=Math.max(1,...vals.map(decs)); return v=>v.toFixed(d);};
const GROUP_ORDER=[1,2,0];   /* groupby('종류') 결과 순서: 버시컬러, 버지니카, 세토사 */

/* 0 생각 열기 투표 */
vote('naVote','naVote',[['그 응답지는 통째로 빼고 분석한다'],['빈칸을 다른 사람들의 평균으로 채운다'],['빈칸이 있는 질문은 모든 응답에서 뺀다']],i=>{
  $('naVoteMsg').innerHTML=['결측치가 있는 <b>행을 제거</b>하는 방법과 같은 생각이에요.','결측치를 <b>특정 값으로 대체</b>하는 방법과 같은 생각이에요.','결측치가 있는 <b>열(속성)을 제거</b>하는 방법과 같은 생각이에요.'][i]+' 01에서 세 방법을 붓꽃 데이터로 직접 비교해 봐요.';
});

/* 01 결측치 처리 실험실 */
(function(){
  const B=$('naLab'); let scope='i2', meth=null;
  const NAROWS=ALL.filter(r=>r.src===2&&hasNa(r));
  const METH=[['A','(가) 결측치가 있는 열 제거'],['Bm','(나) 평균으로 대체'],['Bd','(나) 중앙값으로 대체'],['C','(다) 결측치가 있는 행 제거']];
  const cnt=rows=>[0,1,2].map(s=>rows.filter(r=>r.s===s).length);
  function draw(){
    const rows=scope==='i2'?ALL.filter(r=>r.src===2):ALL;
    const naCol=ATT.map((_,j)=>rows.some(r=>isNaN(r.v[j])));
    const fillv=ATT.map((_,j)=>{const a=rows.map(r=>r.v[j]).filter(x=>!isNaN(x)); return meth==='Bd'?median(a):mean(a);});
    const after=meth==='C'?rows.filter(r=>!hasNa(r)):rows;
    const nCol=meth==='A'?2+naCol.filter(x=>!x).length:6;
    const before=cnt(rows), aft=cnt(after);
    const tb=NAROWS.map(r=>{ const gone=meth==='C';
      return `<tr class="${gone?'cut':''}"><td>${r.id}</td>${r.v.map((x,j)=>{
        if(meth==='A'&&naCol[j]) return `<td class="colcut">${isNaN(x)?'NaN':x}</td>`;
        if(isNaN(x)) return (meth==='Bm'||meth==='Bd')?`<td class="fill">${trim(fillv[j])}</td>`:'<td class="nan">NaN</td>';
        return `<td>${x}</td>`; }).join('')}<td>${SPK[r.s]}</td></tr>`; }).join('');
    let msg='';
    if(meth==='A') msg=`꽃받침 길이·꽃받침 너비·꽃잎 길이·꽃잎 너비 <b>네 속성 모두</b>에 결측치가 있어서, 결측치가 있는 열을 지우면 <b>일련번호와 종류만</b> 남아요. 꽃을 구분할 정보가 사라지는 <b>심각한 데이터 손실</b>이에요.`;
    else if(meth==='Bm'||meth==='Bd'){ const st=rows.filter(r=>r.s===0).map(r=>r.v[3]).filter(x=>!isNaN(x));
      msg=`행과 열은 그대로 남아요. 그런데 세토사인 <b>153번의 꽃잎 너비</b>가 <b>${trim(fillv[3])}</b>(으)로 채워졌어요. 다른 세토사의 꽃잎 너비는 보통 <b>${trim(median(st))}</b> 정도예요. 채운 값은 실제로 측정한 값이 아니라서 <b>데이터 편향</b>이 생길 수 있어요.${meth==='Bm'&&scope==='i2'?' (평균은 꽃잎 너비 111 같은 튀는 값에 끌려가서 더 크게 나왔어요.)':''}`; }
    else if(meth==='C') msg=scope==='all'?`180행 중 결측치가 있는 <b>8행</b>만 지워져 <b>172행</b>이 남았어요. 종류별 개수도 크게 줄지 않았어요. 데이터의 양이 충분히 많아서 손실이 작아요. <b>교과서가 고른 방법</b>이에요.`
      :`30행 중 <b>8행</b>이 지워져 <b>22행</b>만 남았어요. 특히 세토사는 <b>10개 중 ${aft[0]}개</b>만 남아 종류별 개수가 크게 치우쳤어요. 데이터가 적을 때 행을 지우면 남는 데이터가 너무 적어지고 <b>편향</b>이 생길 수 있어요.`;
    else msg='처리 방법을 하나 골라 보세요. 표에서 바뀌는 칸과 아래 결과를 함께 확인해요.';
    const mx=Math.max(...before);
    B.innerHTML=`<div class="na-ctl"><div><span>데이터 범위</span><button class="${scope==='i2'?'on':''}" data-s="i2">Iris2.csv만 (30행)</button><button class="${scope==='all'?'on':''}" data-s="all">합친 데이터 df (180행)</button></div>
      <div><span>처리 방법</span>${METH.map(m=>`<button class="${meth===m[0]?'on':''}" data-m="${m[0]}">${m[1]}</button>`).join('')}</div></div>
      <div class="iv-wrap"><table class="iv natb"><tr><th>일련번호</th>${ATT.map((a,j)=>`<th class="${meth==='A'&&naCol[j]?'colcut':''}">${a}</th>`).join('')}<th>종류</th></tr>${tb}</table></div>
      <div class="na-res"><div class="na-num"><div><small>남은 행</small><b>${rows.length} → ${after.length}</b></div><div><small>남은 열(속성)</small><b>6 → ${nCol}</b></div></div>
      <div class="na-bars">${[0,1,2].map(s=>`<div class="fs-row"><span>${SPK[s]}</span><div class="fs-tr"><i class="bf" style="width:${before[s]/mx*100}%"></i><i class="af" style="width:${aft[s]/mx*100}%;background:${SPC[s]}"></i></div><b>${before[s]}→${aft[s]}</b></div>`).join('')}</div></div>
      <div class="fs-msg">${msg}</div>`;
    B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{scope=b.dataset.s; draw();});
    B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{meth=b.dataset.m; draw();});
  }
  draw();
})();

/* 히스토그램 SVG (seaborn histplot hue='종류'처럼 겹쳐 그림) */
function histSVG(rows,j){
  const W=520,H=230,L=40,R=10,T=10,Bm=34, all=rows.map(r=>r.v[j]), lo=Math.min(...all), hi=Math.max(...all), nb=25, bw=(hi-lo)/nb||1;
  const cnt=[0,1,2].map(s=>{const c=new Array(nb).fill(0); rows.filter(r=>r.s===s).forEach(r=>{c[Math.min(nb-1,Math.floor((r.v[j]-lo)/bw))]++;}); return c;});
  const ym=Math.max(...cnt.flat()), X=v=>L+(v-lo)/(hi-lo||1)*(W-L-R), Y=c=>H-Bm-c/ym*(H-T-Bm);
  let s=`<line class="ax" x1="${L}" y1="${H-Bm}" x2="${W-R}" y2="${H-Bm}"/><line class="ax" x1="${L}" y1="${T}" x2="${L}" y2="${H-Bm}"/>`;
  for(let k=0;k<=4;k++){const v=lo+(hi-lo)*k/4; s+=`<text class="tk" x="${X(v)}" y="${H-Bm+14}">${trim(v,1)}</text>`;}
  for(let k=0;k<=ym;k+=Math.max(1,Math.ceil(ym/4))) s+=`<text class="tk" x="${L-6}" y="${Y(k)+4}" text-anchor="end">${k}</text>`;
  [0,1,2].forEach(sp=>cnt[sp].forEach((c,i)=>{ if(c) s+=`<rect x="${X(lo+i*bw)+.5}" y="${Y(c)}" width="${Math.max(1,X(lo+(i+1)*bw)-X(lo+i*bw)-1)}" height="${H-Bm-Y(c)}" fill="${SPC[sp]}" fill-opacity=".55" stroke="${SPC[sp]}"/>`; }));
  s+=`<text class="lb" x="${(L+W-R)/2}" y="${H-4}">${ATT[j]}</text><text class="lb" x="12" y="${(T+H-Bm)/2}" transform="rotate(-90 12 ${(T+H-Bm)/2})">Count</text>`;
  s+=SPK.map((n,i)=>`<rect x="${W-R-86}" y="${T+4+i*16}" width="10" height="10" fill="${SPC[i]}" fill-opacity=".7"/><text class="lg" x="${W-R-72}" y="${T+13+i*16}">${n}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="pa-svg" role="img" aria-label="${ATT[j]} 히스토그램">${s}</svg>`;
}

/* 02 기초 통계량 탐색기 */
(function(){
  const B=$('statLab'); let at=1, mark=false;
  const K=[['count','count'],['mean','mean'],['std','std'],['min','min'],['q1','25%'],['q2','50%'],['q3','75%'],['max','max']];
  function draw(){
    const D=GROUP_ORDER.map(s=>{const a=DF3.filter(r=>r.s===s).map(r=>r.v[at]); return {s,d:desc(a),f:fence(a)};});
    const fm={}; K.forEach(([k])=>{ fm[k]=k==='count'?(v=>v.toFixed(1)):colFmt(D.map(x=>x.d[k])); });
    const rows=D.map(x=>`<tr><th>${SPK[x.s]}</th>${K.map(([k])=>{const v=x.d[k], odd=mark&&((k==='max'&&v>x.f.hi)||(k==='min'&&v<x.f.lo)); return `<td class="${odd?'odd':''}">${fm[k](v)}</td>`;}).join('')}</tr>`).join('');
    B.innerHTML=`<div class="row">${ATT.map((a,j)=>`<button class="btn sm${j===at?'':' ghost'}" data-a="${j}">${a}</button>`).join('')}</div>
      <div class="pa-code" style="margin-top:8px"><pre>df3.groupby('종류')['${ATT[at]}'].describe()</pre></div>
      <div class="pa-out"><table><tr><th>종류</th>${K.map(k=>`<th>${k[1]}</th>`).join('')}</tr>${rows}</table></div>
      <div class="row" style="margin:8px 0"><button class="btn sm ${mark?'':'ghost'}" data-k="mark">${mark?'튀는 값 표시 끄기':'튀는 값 표시하기'}</button><span class="muted" style="font-size:.85rem">박스 플롯의 울타리값(03에서 배워요)을 벗어난 최솟값·최댓값을 빨갛게 표시해요.</span></div>
      ${histSVG(DF3,at)}`;
    B.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{at=+b.dataset.a; draw();});
    B.querySelector('[data-k="mark"]').onclick=()=>{mark=!mark; draw();};
  }
  draw();
})();

/* 03 박스 플롯 끌어 보기 */
(function(){
  const B=$('boxLab'); let sp=1, at=0, sel=161, over={}, frozen=null, drag=false;
  const W=360,H=330,TOP=18,BOT=300;
  B.innerHTML=`<div class="bx-ctl"><div><span>종류</span>${GROUP_ORDER.map(s=>`<button data-s="${s}">${SPK[s]}</button>`).join('')}</div><div><span>속성</span>${ATT.map((a,j)=>`<button data-a="${j}">${a}</button>`).join('')}</div></div>
    <div class="bx-main"><svg viewBox="0 0 ${W} ${H}" class="pa-svg bx-svg" role="img" aria-label="박스 플롯"></svg>
    <div class="bx-side"><div class="bx-sel"></div><input type="range" id="bxR" step="0.1" aria-label="고른 점의 값"><div class="row" style="margin:6px 0"><button class="btn sm ghost" data-k="reset">원래 값으로</button></div><div class="bx-stat"></div><div class="bx-out"></div></div></div>`;
  const svg=B.querySelector('svg'), R=$('bxR');
  const grp=()=>DF3.filter(r=>r.s===sp);
  const val=r=>over[r.id]!==undefined?over[r.id]:r.v[at];
  function pickDefault(){ const g=grp(), m=median(g.map(r=>r.v[at])); sel=g.reduce((a,b)=>Math.abs(b.v[at]-m)>Math.abs(a.v[at]-m)?b:a).id; }
  function domain(g,f){ const vs=g.map(val), lo=Math.min(f.lo,...vs), hi=Math.max(f.hi,...vs), p=(hi-lo)*.06||.5; return [lo-p,hi+p]; }
  function draw(){
    if(!grp().some(x=>x.id===sel)) pickDefault();   /* 고른 점이 지금 종류에 없으면 기본값으로 */
    const g=grp(), vs=g.map(val), f=fence(vs), dom=frozen||domain(g,f);
    const Y=v=>BOT-(v-dom[0])/(dom[1]-dom[0])*(BOT-TOP);
    const inl=vs.filter(v=>v>=f.lo&&v<=f.hi), wl=Math.min(...inl), wh=Math.max(...inl);
    let s='';
    for(let k=0;k<=5;k++){const v=dom[0]+(dom[1]-dom[0])*k/5; s+=`<line class="gr" x1="44" x2="${W-8}" y1="${Y(v)}" y2="${Y(v)}"/><text class="tk" x="40" y="${Y(v)+4}" text-anchor="end">${trim(v,2)}</text>`;}
    s+=`<line class="fe" x1="44" x2="${W-8}" y1="${Y(f.hi)}" y2="${Y(f.hi)}"/><text class="fl" x="${W-10}" y="${Y(f.hi)-4}" text-anchor="end">B 밖 울타리값 ${trim(f.hi,4)}</text>`;
    s+=`<line class="fe" x1="44" x2="${W-8}" y1="${Y(f.lo)}" y2="${Y(f.lo)}"/><text class="fl" x="${W-10}" y="${Y(f.lo)+13}" text-anchor="end">A 안 울타리값 ${trim(f.lo,4)}</text>`;
    const cx=120;
    s+=`<line class="wk" x1="${cx}" x2="${cx}" y1="${Y(wh)}" y2="${Y(f.q3)}"/><line class="wk" x1="${cx}" x2="${cx}" y1="${Y(f.q1)}" y2="${Y(wl)}"/><line class="wk" x1="${cx-18}" x2="${cx+18}" y1="${Y(wh)}" y2="${Y(wh)}"/><line class="wk" x1="${cx-18}" x2="${cx+18}" y1="${Y(wl)}" y2="${Y(wl)}"/>`;
    s+=`<rect class="bxr" x="${cx-36}" y="${Y(f.q3)}" width="72" height="${Math.max(1,Y(f.q1)-Y(f.q3))}" style="fill:${SPC[sp]}"/><line class="md" x1="${cx-36}" x2="${cx+36}" y1="${Y(f.q2)}" y2="${Y(f.q2)}"/>`;
    s+=`<text class="tk" x="${cx-42}" y="${Y(f.q3)+4}" text-anchor="end">Q3</text><text class="tk" x="${cx-42}" y="${Y(f.q1)+4}" text-anchor="end">Q1</text>`;
    g.forEach(r=>{ const v=val(r), o=v<f.lo||v>f.hi, x=190+((r.id*37)%110), on=r.id===sel;
      s+=`<circle class="pt${o?' out':''}${on?' sel':''}" data-id="${r.id}" cx="${x}" cy="${Y(v)}" r="${on?7:4}"/>`+(on?`<text class="sl" x="${x}" y="${Y(v)-11}">${r.id}번</text>`:''); });
    svg.innerHTML=s;
    const r=g.find(x=>x.id===sel), v=val(r), o=v<f.lo||v>f.hi, rmax=Math.ceil(Math.max(...g.map(x=>x.v[at]),f.hi)*1.25);
    R.min=0; R.max=rmax; if(!drag) R.value=v;
    B.querySelector('.bx-sel').innerHTML=`<b>${r.id}번</b> ${SPK[sp]}의 ${ATT[at]} <b class="mono">${f1(v)}</b>${over[r.id]!==undefined?` <small class="muted">(원래 ${f1(r.v[at])})</small>`:''}<br><span class="${o?'ng':'ok'}">${o?(v>f.hi?`이상치 — 밖 울타리값 B(${trim(f.hi,4)})보다 커요`:`이상치 — 안 울타리값 A(${trim(f.lo,4)})보다 작아요`):'이상치 아님 — A와 B 사이에 있어요'}</span>`;
    B.querySelector('.bx-stat').innerHTML=[['Q1',f.q1],['중앙값',f.q2],['Q3',f.q3],['IQR',f.iqr],['A',f.lo],['B',f.hi]].map(([k,x])=>`<div><small>${k}</small><b>${trim(x,4)}</b></div>`).join('');
    const outs=g.filter(x=>{const w=val(x); return w<f.lo||w>f.hi;});
    B.querySelector('.bx-out').innerHTML=`<b>이상치 ${outs.length}개</b> ${outs.map(x=>`<button data-id="${x.id}">${x.id}번 ${f1(val(x))}</button>`).join('')||'<span class="muted">없음</span>'}`;
    B.querySelectorAll('.bx-out button').forEach(b=>b.onclick=()=>{sel=+b.dataset.id; draw();});
    B.querySelectorAll('.bx-ctl [data-s]').forEach(b=>b.classList.toggle('on',+b.dataset.s===sp));
    B.querySelectorAll('.bx-ctl [data-a]').forEach(b=>b.classList.toggle('on',+b.dataset.a===at));
  }
  function end(){ if(!drag) return; drag=false; frozen=null; draw(); }
  function yToVal(e){ const rc=svg.getBoundingClientRect(), y=(e.clientY-rc.top)*(H/rc.height), d=frozen;
    const v=d[0]+(BOT-y)/(BOT-TOP)*(d[1]-d[0]); return Math.max(0,Math.min(+R.max,Math.round(v*10)/10)); }
  svg.addEventListener('pointerdown',e=>{ const c=e.target.closest&&e.target.closest('circle.pt'); if(!c) return; e.preventDefault();
    sel=+c.dataset.id; const g=grp(); frozen=domain(g,fence(g.map(val))); drag=true; try{svg.setPointerCapture(e.pointerId);}catch(x){} draw(); });
  svg.addEventListener('pointermove',e=>{ if(!drag) return; if(!e.buttons){end(); return;} over[sel]=yToVal(e); R.value=over[sel]; draw(); });
    svg.addEventListener('pointerup',end); svg.addEventListener('pointercancel',end); svg.addEventListener('lostpointercapture',end);
  R.oninput=()=>{ over[sel]=+R.value; draw(); };
  B.querySelector('[data-k="reset"]').onclick=()=>{ over={}; draw(); };
  B.querySelectorAll('.bx-ctl [data-s]').forEach(b=>b.onclick=()=>{sp=+b.dataset.s; over={}; drag=false; frozen=null; pickDefault(); draw();});
  B.querySelectorAll('.bx-ctl [data-a]').forEach(b=>b.onclick=()=>{at=+b.dataset.a; over={}; drag=false; frozen=null; pickDefault(); draw();});
  draw();
})();

/* 04 산점도 고르기 (교과서 71쪽 drop 뒤의 df3, 147행) */
const PAIRS=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const SCAT=(function(){
  const B=$('scatLab'); let p=0;
  const sd=ATT.map((_,j)=>sdev(DF3D.map(r=>r.v[j])));
  function mixed(a,b){ /* 가장 가까운 점이 다른 종류인 점의 수 (속성마다 표준편차로 나눠 거리 계산) */
    let n=0; DF3D.forEach((r,i)=>{ let best=1e9,bs=-1; DF3D.forEach((q,k)=>{ if(k===i) return; const d=((r.v[a]-q.v[a])/sd[a])**2+((r.v[b]-q.v[b])/sd[b])**2; if(d<best){best=d; bs=q.s;} }); if(bs!==r.s) n++; }); return n; }
  const MIX=PAIRS.map(([a,b])=>mixed(a,b));
  const mark=(s,x,y)=>s===0?`<circle cx="${x}" cy="${y}" r="3.6"/>`:s===1?`<rect x="${x-3.3}" y="${y-3.3}" width="6.6" height="6.6"/>`:`<rect x="${x-3.2}" y="${y-3.2}" width="6.4" height="6.4" transform="rotate(45 ${x} ${y})"/>`;
  function draw(){
    const [a,b]=PAIRS[p], W=380,H=300,L=44,R=10,T=10,Bm=38;
    const xs=DF3D.map(r=>r.v[a]), ys=DF3D.map(r=>r.v[b]), x0=Math.min(...xs)-.2, x1=Math.max(...xs)+.2, y0=Math.min(...ys)-.2, y1=Math.max(...ys)+.2;
    const X=v=>L+(v-x0)/(x1-x0)*(W-L-R), Y=v=>H-Bm-(v-y0)/(y1-y0)*(H-T-Bm);
    let s=`<line class="ax" x1="${L}" y1="${H-Bm}" x2="${W-R}" y2="${H-Bm}"/><line class="ax" x1="${L}" y1="${T}" x2="${L}" y2="${H-Bm}"/>`;
    for(let k=0;k<=4;k++){const v=x0+(x1-x0)*k/4, w=y0+(y1-y0)*k/4; s+=`<text class="tk" x="${X(v)}" y="${H-Bm+14}">${trim(v,1)}</text><text class="tk" x="${L-6}" y="${Y(w)+4}" text-anchor="end">${trim(w,1)}</text>`;}
    s+=`<text class="lb" x="${(L+W-R)/2}" y="${H-6}">${ATT[a]}</text><text class="lb" x="12" y="${(T+H-Bm)/2}" transform="rotate(-90 12 ${(T+H-Bm)/2})">${ATT[b]}</text>`;
    [0,1,2].forEach(sp=>{ s+=`<g fill="${SPC[sp]}" fill-opacity=".75" stroke="#fff" stroke-width=".6">`+DF3D.filter(r=>r.s===sp).map(r=>mark(sp,X(r.v[a]),Y(r.v[b]))).join('')+'</g>'; });
    const lg=SPK.map((n,i)=>`<span><svg viewBox="0 0 12 12" width="12" height="12"><g fill="${SPC[i]}">${mark(i,6,6)}</g></svg>${n}</span>`).join('');
    B.innerHTML=`<div class="sc-btns">${PAIRS.map(([x,y],i)=>`<button class="${i===p?'on':''}" data-p="${i}">${ATT[x]} × ${ATT[y]}</button>`).join('')}</div>
      <div class="sc-main"><svg viewBox="0 0 ${W} ${H}" class="pa-svg" role="img" aria-label="${ATT[a]}와 ${ATT[b]} 산점도">${s}</svg>
      <div class="sc-side"><div class="sc-lg">${lg}</div><div class="sc-mix"><small>섞인 정도</small><b>${MIX[p]}개</b><span>가장 가까운 점이 다른 종류인 점의 수 (147개 중)</span></div>
      <p class="note">세토사 점들이 따로 떨어져 있나요? 버시컬러와 버지니카는 얼마나 겹치나요? 「섞인 정도」가 작을수록 종류가 잘 나뉘어요.</p></div></div>`;
    B.querySelectorAll('[data-p]').forEach(x=>x.onclick=()=>{p=+x.dataset.p; draw();});
  }
  draw();
  return {show(i){p=i; draw();}, MIX};
})();
vote('pairVote','pairPick',PAIRS.map(([a,b])=>[`${ATT[a]} × ${ATT[b]}`]),i=>{
  SCAT.show(i);
  const best=SCAT.MIX.indexOf(Math.min(...SCAT.MIX));
  $('pairMsg').innerHTML=`<div class="fs-msg">${i===5?'<b>교과서 결론과 같아요!</b> 꽃잎 길이 × 꽃잎 너비에서 세토사는 왼쪽 아래에 따로 모이고, 버시컬러와 버지니카도 거의 겹치지 않아요.'
    :'교과서는 <b>꽃잎 길이 × 꽃잎 너비</b>를 골랐어요. 내가 고른 쌍과 번갈아 보며 버시컬러와 버지니카의 점이 얼마나 겹치는지 비교해 보세요.'} 「섞인 정도」가 가장 작은 쌍은 <b>${ATT[PAIRS[best][0]]} × ${ATT[PAIRS[best][1]]}</b>(${SCAT.MIX[best]}개)예요.</div>`;
});

/* 04 히트맵 (같은 147행으로 계산 — 교과서 72쪽 값과 같음) */
(function(){
  const C=['일련번호',...ATT], col=r=>[r.id,...r.v];
  const M=C.map((_,i)=>C.map((_,j)=>corr(DF3D.map(r=>col(r)[i]),DF3D.map(r=>col(r)[j]))));
  const vmin=Math.min(...M.flat()), stops=[[0,[0,104,55]],[.25,[134,203,102]],[.5,[255,255,191]],[.75,[249,142,82]],[1,[165,0,38]]];
  const color=v=>{ const t=(v-vmin)/(1-vmin); let k=0; while(k<stops.length-2&&t>stops[k+1][0]) k++; const [t0,c0]=stops[k],[t1,c1]=stops[k+1], u=Math.max(0,Math.min(1,(t-t0)/(t1-t0)));
    return {bg:`rgb(${c0.map((c,i)=>Math.round(c+(c1[i]-c)*u)).join(',')})`, fg:(t<.18||t>.82)?'#fff':'#16202c'}; };
  $('heatMap').innerHTML=`<div class="iv-wrap"><table class="hm"><tr><th></th>${C.map(c=>`<th>${c}</th>`).join('')}</tr>${M.map((row,i)=>`<tr><th>${C[i]}</th>${row.map((v,j)=>{const c=color(v); return `<td style="background:${c.bg};color:${c.fg}" class="${(i===3&&j===4)||(i===4&&j===3)?'top':''}">${v.toFixed(2)}</td>`;}).join('')}</tr>`).join('')}</table></div>`;
})();

/* 05 tips: 먼저 예상하고 확인하기 (교과서 소스 파일 히트맵의 total_bill 줄) */
(function(){
  const TB=[['tip',.68],['size',.60],['time_Dinner',.18],['time_Lunch',-.18],['sex_Male',.14],['sex_Female',-.14],['day_Thur',-.14],['day_Sun',.12],['smoker_Yes',.09],['smoker_No',-.09],['day_Fri',-.09],['day_Sat',.05]];
  vote('tipsGuess','tipsGuess',[['tip','팁'],['size','식사 인원'],['sex','성별'],['smoker','흡연 여부'],['day','요일'],['time','식사 시간']],i=>{
    const bars=TB.map(([n,v])=>`<div class="tb-row"><span class="mono">${n}</span><div class="tb-tr"><i class="${v<0?'neg':'pos'}" style="${v<0?`right:50%;width:${-v*50}%`:`left:50%;width:${v*50}%`}"></i></div><b>${v.toFixed(2)}</b></div>`).join('');
    $('tipsBars').innerHTML=`<div class="tb-box"><div class="tb-h">total_bill과의 상관계수 <small class="muted">(−1 ← 0 → +1)</small></div>${bars}</div>
      <div class="fs-msg">${i===0?'<b>예상이 맞았어요!</b> ':''}total_bill과 가장 관련이 깊은 속성은 <b>tip(0.68)</b>, 그다음은 <b>size(0.60)</b>예요. 성별·흡연 여부·요일·식사 시간은 get_dummies로 바뀐 열(sex_Male 등)로 나타나는데, 상관계수가 0.2보다 작아 관계가 약해요.</div>`;
  });
})();

/* 05 빈칸 · 스스로 점검 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('selfCheck','selfCheckPick',['결측치를 확인하고 처리할 수 있다','데이터의 이상치를 발견할 수 있다','산점도와 히트맵으로 핵심 속성을 찾을 수 있다','수집한 데이터를 전처리하여 핵심 속성을 추출할 수 있다'],true);

const MEMOLIST=[['naVote','생각 열기: 빈칸이 있는 응답지 처리'],['naChoice','교과서가 행 삭제를 고른 이유, 30개뿐이라면'],['outlierCheck','161번을 삭제하기 전에 더 알아볼 것'],['pairPick','세 종류를 가장 잘 나누는 산점도'],['keyAttr','꽃받침 속성이 구분에 덜 도움이 되는 이유'],['tipsGuess','tips: total_bill과 가장 관련 깊을 것 같은 속성'],['tipsCause','식사 금액을 올리면 팁이 오를까'],['selfCheckPick','스스로 점검: 할 수 있게 된 것']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
