(()=>{
  if(window.__l6ReaderStickyThresholdFix)return;
  window.__l6ReaderStickyThresholdFix=true;

  const tools=document.querySelector('.reader-tools');
  const hero=document.querySelector('.surah-hero');
  if(!tools||!hero)return;

  const style=document.createElement('style');
  style.textContent=`
    /* The Islami nav may become sticky first. Keep reader toolbar in its normal state
       until the toolbar's own original position reaches the sticky boundary. */
    body:has(.channel-nav.is-sticky) .reader-tools:not(.is-reader-sticky){
      width:auto!important;
      box-shadow:0 6px 16px rgba(3,7,18,.05)!important;
    }
    body:has(.channel-nav.is-sticky) .reader-tools:not(.is-reader-sticky) .reader-sticky-context,
    body:has(.channel-nav.is-sticky) .reader-tools:not(.is-reader-sticky) .reader-surah-nav{
      display:none!important;
    }
    .reader-tools.is-reader-sticky{
      width:980px!important;
      top:56px!important;
      box-shadow:0 8px 24px rgba(3,7,18,.08)!important;
    }
    .reader-tools.is-reader-sticky .reader-sticky-context{
      display:flex!important;
      width:132px;
      min-width:132px;
      flex-direction:column;
      justify-content:center;
      padding-right:12px;
      border-right:1px solid rgba(79,79,79,.12);
      overflow:hidden;
    }
    .reader-tools.is-reader-sticky .reader-surah-nav{
      display:flex!important;
      align-items:center;
      gap:6px;
      margin-left:auto;
      padding-left:10px;
      border-left:1px solid rgba(79,79,79,.12);
    }
    .reader-tools.is-reader-sticky .tool-left{gap:7px}
    .reader-tools.is-reader-sticky .tool-right{gap:7px}
    .reader-tools.is-reader-sticky .qari-select{width:193px;max-width:193px}
    .reader-tools.is-reader-sticky .ayat-jump{width:110px;min-width:110px}
    @media(max-width:900px){
      .reader-tools.is-reader-sticky{width:calc(100vw - 28px)!important;max-width:none}
      .reader-tools.is-reader-sticky .reader-sticky-context,
      .reader-tools.is-reader-sticky .reader-surah-nav{display:none!important}
    }
  `;
  document.head.appendChild(style);

  let toolbarOrigin=0;
  const stickyTop=56;
  const hysteresis=2;

  const measureOrigin=()=>{
    const hadClass=tools.classList.contains('is-reader-sticky');
    if(hadClass)tools.classList.remove('is-reader-sticky');
    toolbarOrigin=hero.getBoundingClientRect().bottom+window.scrollY;
    if(hadClass)sync();
  };

  const sync=()=>{
    const channelSticky=document.querySelector('.channel-nav')?.classList.contains('is-sticky');
    const crossed=window.scrollY+stickyTop+hysteresis>=toolbarOrigin;
    tools.classList.toggle('is-reader-sticky',Boolean(channelSticky&&crossed));
  };

  requestAnimationFrame(()=>{
    measureOrigin();
    sync();
  });
  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',()=>{measureOrigin();sync()},{passive:true});
  window.addEventListener('load',()=>{measureOrigin();sync()},{once:true});
})();
