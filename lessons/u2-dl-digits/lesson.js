
/* 단계 「다 했어요」 표시 (학번마다 따로 저장) */
(()=>{
  const KEY=QK+'-lab';
  let st={}; try{st=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){st={};}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}};
  st.done=st.done||{};
  const steps=[...document.querySelectorAll('.tmd .step')];
  function paint(){
    steps.forEach(s=>{const k=s.id.slice(1), on=!!st.done[k]; const b=s.querySelector('.done'); if(!b) return; b.classList.toggle('on',on); b.textContent=on?'✔ 완료!':'✔ 다 했어요'; const n=+k; if(stepBtns[n]) stepBtns[n].classList.toggle('done',on);});
    MEMO.labDone=steps.filter(s=>st.done[s.id.slice(1)]).map(s=>s.id.slice(1)+'단계').join(' · ');
  }
  document.querySelectorAll('.tmd .done').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.s; st.done[k]=!st.done[k]; save(); paint(); store.set(MK,MEMO);}));
  paint();
})();
const MEMOLIST=[['labDone','ML4Kids에서 다 한 단계'],['pyAcc','딥러닝 정확도(훈련/테스트)'],['pyEpoch','에포크 1과 10 비교'],['pyConfuse','틀린 개수 · 헷갈린 숫자 짝'],['pyTree','의사결정트리와 비교']];
onShow[10]=()=>memoSummary('msum',MEMOLIST);
