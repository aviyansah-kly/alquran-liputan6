(()=>{
  if(window.__l6ReaderStickyThresholdFix)return;
  window.__l6ReaderStickyThresholdFix=true;

  const tools=document.querySelector('.reader-tools');
  const hero=document.querySelector('.surah-hero');
  if(!tools||!hero)return;

  const style=document.createElement('style');
  style.textContent=`
    .reader-tools{
      width:640px;
      transition:width .3s cubic-bezier(.22,1,.36,1),border-radius .22s ease,box-shadow .22s ease,background-color .18s ease!important;
    }
    body:has(.channel-nav.is-sticky) .reader-tools:not(.is-reader-sticky){
      width:640px!important;
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
      width:112px;
      min-width:112px;
      flex-direction:column;
      justify-content:center;
      padding-right:10px;
      border-right:1px solid rgba(79,79,79,.12);
      overflow:hidden;
    }
    .reader-tools.is-reader-sticky .reader-surah-nav{
      display:flex!important;
      align-items:center;
      gap:6px;
      margin-left:auto;
      padding-left:8px;
      border-left:1px solid rgba(79,79,79,.12);
    }
    .reader-tools.is-reader-sticky .tool-left{gap:6px}
    .reader-tools.is-reader-sticky .tool-right{gap:6px}
    .reader-tools.is-reader-sticky .font-label{display:none}
    .reader-tools.is-reader-sticky .qari-select{width:176px;max-width:176px}
    .reader-tools.is-reader-sticky .ayat-jump{width:100px;min-width:100px}

    .reader-tools.is-reader-sticky .reader-surah-nav-btn{
      width:118px;
      min-width:118px;
      height:40px;
      padding:0 10px;
      gap:7px;
      justify-content:flex-start;
    }
    .reader-tools.is-reader-sticky .reader-surah-nav-btn[data-dir="next"]{justify-content:flex-end;text-align:right}
    .reader-surah-nav-copy{min-width:0;display:flex;flex-direction:column;line-height:1.05}
    .reader-surah-nav-label{font-size:9px;color:#6b7280;font-weight:500;white-space:nowrap}
    .reader-surah-nav-name{max-width:80px;margin-top:2px;font-size:11px;color:#030712;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .reader-surah-nav-btn:hover .reader-surah-nav-name{color:#0042a5}
    .reader-surah-nav-btn:disabled .reader-surah-nav-copy{opacity:.7}

    @media(max-width:1040px) and (min-width:901px){
      .reader-tools.is-reader-sticky .reader-sticky-context{width:100px;min-width:100px}
      .reader-tools.is-reader-sticky .qari-select{width:164px;max-width:164px}
      .reader-tools.is-reader-sticky .ayat-jump{width:92px;min-width:92px}
      .reader-tools.is-reader-sticky .reader-surah-nav-btn{width:108px;min-width:108px;padding:0 8px}
      .reader-surah-nav-name{max-width:70px}
    }
    @media(max-width:900px){
      .reader-tools{width:calc(100vw - 28px)}
      .reader-tools.is-reader-sticky{width:calc(100vw - 28px)!important;max-width:none}
      .reader-tools.is-reader-sticky .reader-sticky-context,
      .reader-tools.is-reader-sticky .reader-surah-nav{display:none!important}
      .reader-tools.is-reader-sticky .font-label{display:inline}
    }
  `;
  document.head.appendChild(style);

  const enhanceNavLabels=()=>{
    const nav=tools.querySelector('.reader-surah-nav');
    if(!nav)return;
    const pairs=[
      ['prev','Sebelumnya','prevSurah'],
      ['next','Berikutnya','nextSurah']
    ];
    pairs.forEach(([dir,label,targetId])=>{
      const btn=nav.querySelector(`[data-dir="${dir}"]`);
      if(!btn)return;
      const target=document.getElementById(targetId);
      const name=(target?.querySelector('b')?.textContent||'').trim()||'Surah';
      if(!btn.querySelector('.reader-surah-nav-copy')){
        const copy=document.createElement('span');
        copy.className='reader-surah-nav-copy';
        copy.innerHTML=`<span class="reader-surah-nav-label">${label}</span><span class="reader-surah-nav-name"></span>`;
        if(dir==='prev')btn.appendChild(copy);else btn.insertBefore(copy,btn.firstChild);
      }
      const nameEl=btn.querySelector('.reader-surah-nav-name');
      if(nameEl){nameEl.textContent=name;nameEl.title=name}
      btn.setAttribute('aria-label',`${label}: ${name}`);
      btn.title=`${label}: ${name}`;
    });
  };
  setTimeout(enhanceNavLabels,500);
  setTimeout(enhanceNavLabels,1200);

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

  requestAnimationFrame(()=>{measureOrigin();sync()});
  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',()=>{measureOrigin();sync()},{passive:true});
  window.addEventListener('load',()=>{measureOrigin();sync()},{once:true});
})();
