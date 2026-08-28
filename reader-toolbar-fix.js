(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .qari-select,.ayat-jump{
      appearance:none;
      -webkit-appearance:none;
      background-color:#fff;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat:no-repeat;
      background-position:right 14px center;
      background-size:16px 16px;
      padding-left:14px!important;
      padding-right:42px!important;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    .qari-select{
      width:210px;
      max-width:210px;
    }
    .ayat-jump{
      width:128px;
      min-width:128px;
    }

    /* Figma 9410:6330 — title and player are one connected surface */
    .surah-hero{
      border-radius:12px 12px 0 0!important;
      border-bottom:0!important;
      padding:24px 32px 24px 24px!important;
    }
    .reader-tools{
      margin-top:0!important;
      min-height:58px;
      top:56px!important;
      border-radius:0 0 12px 12px!important;
      padding:10px 12px!important;
      gap:22px!important;
      z-index:49;
    }
    body:has(.header.is-returning) .reader-tools{
      top:184px!important;
    }
    body:has(.channel-nav.is-sticky) .reader-tools{
      top:56px!important;
    }

    @media(max-width:900px){
      .qari-select{width:200px;max-width:200px}
      .ayat-jump{width:124px;min-width:124px}
      .surah-hero{padding:18px 20px!important}
      .reader-tools{top:56px!important}
      body:has(.header.is-returning) .reader-tools{top:166px!important}
    }
  `;
  document.head.appendChild(style);

  window.resizeArabic=(delta)=>{
    const verses=[...document.querySelectorAll('.ayah-ar')];
    if(!verses.length)return;
    const current=parseFloat(getComputedStyle(verses[0]).fontSize)||56;
    const next=Math.max(34,Math.min(68,current+delta));
    verses.forEach(el=>el.style.setProperty('font-size',`${next}px`,'important'));
  };

  if(!window.__l6FigmaFooterRequested){
    window.__l6FigmaFooterRequested=true;
    const f=document.createElement('script');
    f.src='figma-footer.js?v=1';
    document.body.appendChild(f);
  }
})();
