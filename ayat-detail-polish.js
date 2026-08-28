(()=>{
  if(window.__l6AyatDetailPolish)return;
  window.__l6AyatDetailPolish=true;

  const sid=Math.min(114,Math.max(1,parseInt(new URLSearchParams(location.search).get('surah')||'1',10)||1));
  const glyph='surah'+String(sid).padStart(3,'0');

  const style=document.createElement('style');
  style.textContent=`
    @font-face{
      font-family:'surah-name-v4-icon';
      src:url('https://static-cdn.tarteel.ai/qul/fonts/surah-names/v4/surah-name-v4.ttf') format('truetype');
      font-display:swap;
    }
    #detailArabicName{
      font-family:'surah-name-v4-icon',serif!important;
      font-feature-settings:'liga' 1,'clig' 1!important;
      font-variant-ligatures:common-ligatures contextual!important;
      font-size:52px!important;
      line-height:1!important;
      font-weight:400!important;
    }

    /* Hero + command bar become one connected reading surface */
    .ayat-detail-hero{
      border-radius:14px 14px 0 0!important;
      border-bottom:0!important;
    }
    .ayat-command-bar{
      margin-top:0!important;
      border-radius:0 0 12px 12px!important;
    }

    /* Compact sticky section navigator */
    .ayat-section-menu{
      position:relative;
      display:none;
      flex:0 0 auto;
    }
    .ayat-command-bar.is-sticky-reader .ayat-section-menu{display:block}
    .ayat-section-trigger{
      height:36px;
      min-width:126px;
      max-width:154px;
      padding:0 10px 0 12px;
      border:1px solid var(--line);
      border-radius:7px;
      background:#fff;
      color:#030712;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:8px;
      cursor:pointer;
      font-family:Inter,Arial,sans-serif;
      font-size:12px;
      font-weight:600;
      white-space:nowrap;
      transition:background-color .16s ease,border-color .16s ease,box-shadow .16s ease;
    }
    .ayat-section-trigger:hover{background:#f6f8ff;border-color:rgba(0,66,165,.28)}
    .ayat-section-trigger:focus-visible{outline:2px solid rgba(0,66,165,.28);outline-offset:2px}
    .ayat-section-trigger .section-current{overflow:hidden;text-overflow:ellipsis}
    .ayat-section-trigger .icon{width:15px;height:15px;flex:0 0 auto;transition:transform .16s ease}
    .ayat-section-menu.is-open .ayat-section-trigger .icon{transform:rotate(180deg)}
    .ayat-section-popover{
      position:absolute;
      top:42px;
      left:0;
      width:196px;
      padding:6px;
      border:1px solid rgba(79,79,79,.14);
      border-radius:10px;
      background:#fff;
      box-shadow:0 12px 30px rgba(3,7,18,.12);
      display:none;
      z-index:80;
    }
    .ayat-section-menu.is-open .ayat-section-popover{display:block}
    .ayat-section-option{
      width:100%;
      min-height:36px;
      padding:8px 10px;
      border:0;
      border-radius:7px;
      background:transparent;
      color:#374151;
      display:flex;
      align-items:center;
      gap:8px;
      text-align:left;
      cursor:pointer;
      font-family:Inter,Arial,sans-serif;
      font-size:12px;
      font-weight:500;
    }
    .ayat-section-option:hover{background:#f6f8ff;color:#0042a5}
    .ayat-section-option.is-active{background:#fff0e6;color:#a72a0d;font-weight:600}
    .ayat-section-dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.55;flex:0 0 auto}

    .detail-section{scroll-margin-top:136px!important}

    @media(max-width:900px){
      #detailArabicName{font-size:44px!important}
      .ayat-command-bar.is-sticky-reader .ayat-section-menu{display:block}
      .ayat-section-trigger{min-width:112px;max-width:126px}
      .ayat-section-popover{position:fixed;left:14px;right:14px;top:auto;width:auto}
    }
  `;
  document.head.appendChild(style);

  function applySurahGlyph(){
    const el=document.getElementById('detailArabicName');
    if(!el)return;
    if(el.textContent!==glyph)el.textContent=glyph;
    el.style.fontFamily="'surah-name-v4-icon',serif";
    el.style.fontFeatureSettings="'liga' 1, 'clig' 1";
  }
  if(document.fonts?.load){
    document.fonts.load("52px 'surah-name-v4-icon'").then(()=>{applySurahGlyph();setTimeout(applySurahGlyph,300);setTimeout(applySurahGlyph,900)}).catch(()=>setTimeout(applySurahGlyph,500));
  }else setTimeout(applySurahGlyph,400);
  const arabicName=document.getElementById('detailArabicName');
  if(arabicName)new MutationObserver(()=>{if(arabicName.textContent!==glyph)requestAnimationFrame(applySurahGlyph)}).observe(arabicName,{childList:true,characterData:true,subtree:true});

  const sections=[
    ['arti','Arti'],
    ['tafsir','Tafsir'],
    ['poin-penting','Poin Penting'],
    ['asbabun-nuzul','Asbabun Nuzul'],
    ['faq','FAQ']
  ];

  function mountSectionMenu(){
    const bar=document.querySelector('.ayat-command-bar');
    const main=bar?.querySelector('.ayat-command-main');
    if(!bar||!main||bar.querySelector('.ayat-section-menu'))return false;

    const menu=document.createElement('div');
    menu.className='ayat-section-menu';
    menu.innerHTML=`
      <button type="button" class="ayat-section-trigger" aria-haspopup="true" aria-expanded="false" title="Pilih bagian">
        <span class="section-current">Arti</span>
        <i data-lucide="chevron-down" class="icon"></i>
      </button>
      <div class="ayat-section-popover" role="menu">
        ${sections.map(([id,label],i)=>`<button type="button" class="ayat-section-option${i===0?' is-active':''}" data-target="${id}" role="menuitem"><span class="ayat-section-dot"></span>${label}</button>`).join('')}
      </div>`;

    const share=document.getElementById('shareAyatBtn');
    if(share&&share.parentNode===main)main.insertBefore(menu,share);
    else main.appendChild(menu);

    const trigger=menu.querySelector('.ayat-section-trigger');
    const current=menu.querySelector('.section-current');
    const options=[...menu.querySelectorAll('.ayat-section-option')];

    const close=()=>{menu.classList.remove('is-open');trigger.setAttribute('aria-expanded','false')};
    trigger.addEventListener('click',e=>{
      e.stopPropagation();
      const open=!menu.classList.contains('is-open');
      menu.classList.toggle('is-open',open);
      trigger.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('click',e=>{if(!menu.contains(e.target))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});

    options.forEach(btn=>btn.addEventListener('click',()=>{
      const target=document.getElementById(btn.dataset.target);
      if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
      close();
    }));

    const syncActive=()=>{
      let activeId='arti',activeLabel='Arti';
      const threshold=145;
      for(const [id,label] of sections){
        const el=document.getElementById(id);
        if(el&&el.getBoundingClientRect().top<=threshold){activeId=id;activeLabel=label}
        else if(el)break;
      }
      current.textContent=activeLabel;
      trigger.title=`Bagian: ${activeLabel}`;
      options.forEach(btn=>btn.classList.toggle('is-active',btn.dataset.target===activeId));
    };
    window.addEventListener('scroll',syncActive,{passive:true});
    syncActive();
    if(window.lucide)lucide.createIcons();
    return true;
  }

  if(!mountSectionMenu()){
    const wait=new MutationObserver(()=>{if(mountSectionMenu())wait.disconnect()});
    wait.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>wait.disconnect(),3000);
  }
})();