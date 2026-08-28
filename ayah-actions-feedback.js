(()=>{
  if(window.__l6AyahActionFeedback)return;
  window.__l6AyahActionFeedback=true;

  const style=document.createElement('style');
  style.textContent=`
    .ayah-action{
      position:relative;
      overflow:hidden;
      min-width:0;
      user-select:none;
      transition:background-color .16s ease,border-color .16s ease,color .16s ease,transform .1s ease,box-shadow .16s ease;
    }
    .ayah-action:hover{
      background:#f6f8ff!important;
      border-color:rgba(0,66,165,.30)!important;
      color:#0042a5;
      box-shadow:0 2px 6px rgba(3,7,18,.05);
    }
    .ayah-action:focus-visible{
      outline:2px solid rgba(0,66,165,.30);
      outline-offset:2px;
      border-color:#0042a5!important;
    }
    .ayah-action:active,.ayah-action.is-pressed{
      transform:scale(.95);
      background:#fff0e6!important;
      border-color:#ff8d70!important;
      color:#a72a0d;
      box-shadow:0 0 0 3px rgba(255,51,0,.07);
    }
    .ayah-action.is-audio-active{
      background:#eef4ff!important;
      border-color:rgba(0,66,165,.38)!important;
      color:#0042a5!important;
    }
    .ayah-action.is-saved,.ayah-action.active{
      background:#eefaf2!important;
      border-color:rgba(20,132,64,.38)!important;
      color:#148440!important;
    }
    .ayah-action.is-share-feedback{
      background:#fff0e6!important;
      border-color:#ff8d70!important;
      color:#a72a0d!important;
    }
    .ayah-action.detail-btn:hover{
      background:#fff0e6!important;
      border-color:#ff8d70!important;
      color:#a72a0d!important;
    }
    .ayah-action .icon{transition:transform .16s ease}
    .ayah-action:hover .icon{transform:translateY(-1px)}
    .ayah-action.is-pressed .icon{transform:scale(.9)}
  `;
  document.head.appendChild(style);

  const getActionType=(el)=>{
    if(el.classList.contains('detail-btn'))return 'detail';
    const text=el.textContent.trim().toLowerCase();
    if(text.includes('audio'))return 'audio';
    if(text.includes('simpan'))return 'save';
    if(text.includes('bagikan'))return 'share';
    return '';
  };

  const enhanceAction=(el)=>{
    if(el.dataset.feedbackReady==='1')return;
    el.dataset.feedbackReady='1';
    const type=getActionType(el);
    if(type)el.dataset.actionType=type;
    el.addEventListener('pointerdown',()=>el.classList.add('is-pressed'));
    const clear=()=>el.classList.remove('is-pressed');
    el.addEventListener('pointerup',clear);
    el.addEventListener('pointerleave',clear);
    el.addEventListener('pointercancel',clear);
  };

  const enhanceAll=()=>document.querySelectorAll('.ayah-action').forEach(enhanceAction);
  enhanceAll();

  const list=document.getElementById('ayahList');
  if(list)new MutationObserver(enhanceAll).observe(list,{childList:true,subtree:true});

  document.addEventListener('click',e=>{
    const action=e.target.closest('.ayah-action');
    if(!action)return;
    const type=action.dataset.actionType||getActionType(action);
    if(type==='save'){
      action.classList.add('is-saved');
      action.setAttribute('aria-pressed','true');
      action.setAttribute('title','Ayat tersimpan');
    }
    if(type==='share'){
      action.classList.add('is-share-feedback');
      setTimeout(()=>action.classList.remove('is-share-feedback'),420);
    }
    if(type==='audio'){
      requestAnimationFrame(()=>{
        document.querySelectorAll('.ayah-action.is-audio-active').forEach(x=>x.classList.remove('is-audio-active'));
        const verse=action.closest('.ayah');
        if(verse?.classList.contains('is-playing'))action.classList.add('is-audio-active');
      });
    }
  },true);

  const syncAudioState=()=>{
    document.querySelectorAll('.ayah-action.is-audio-active').forEach(x=>x.classList.remove('is-audio-active'));
    const active=document.querySelector('.ayah.is-playing');
    const audioBtn=active?.querySelector('.ayah-action[data-action-type="audio"]');
    if(audioBtn)audioBtn.classList.add('is-audio-active');
  };
  if(list)new MutationObserver(syncAudioState).observe(list,{attributes:true,subtree:true,attributeFilter:['class']});
})();