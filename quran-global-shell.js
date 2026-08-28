(()=>{
  if(window.__l6QuranGlobalShell)return;
  window.__l6QuranGlobalShell=true;

  const header=document.querySelector('.header');
  const channelNav=document.querySelector('.channel-nav');
  const headerSpacer=document.getElementById('headerSpacer');
  const readingProgress=document.getElementById('readingProgress');
  if(!header||!channelNav)return;

  document.body.classList.add('quran-global-shell');

  const sharedStyle=document.createElement('style');
  sharedStyle.id='quran-global-shell-style';
  sharedStyle.textContent=`
    .quran-global-shell .header{background:#fff}
    .quran-global-shell .header-top{height:77px;display:flex;align-items:center}
    .quran-global-shell .header-top .wrap{display:grid;grid-template-columns:172px 540px 1fr;gap:32px;align-items:center}
    .quran-global-shell .brand img{width:172px;height:32px;object-fit:contain;display:block}
    .quran-global-shell .primary-nav{height:51px;box-shadow:0 8px 4px rgba(222,222,222,.09)}
    .quran-global-shell .primary-nav .wrap{height:100%;display:flex;align-items:center;justify-content:center;gap:23px;white-space:nowrap}
    .quran-global-shell .primary-nav a,.quran-global-shell .channel-nav a,.quran-global-shell .channel-brand{font-size:12px}
    .quran-global-shell .primary-nav .active{font-weight:700;color:#0042a5}
    .quran-global-shell .channel-nav{height:56px;background:#f6f8ff;border-bottom:1px solid rgba(79,79,79,.12)}
    .quran-global-shell .channel-nav .wrap{height:100%;display:flex;align-items:center;gap:20px}
    .quran-global-shell .channel-brand{padding-right:22px;border-right:2px solid rgba(79,79,79,.2);display:flex;gap:8px;align-items:center}
    .quran-global-shell .channel-nav a{height:56px;display:flex;align-items:center}
    .quran-global-shell .channel-nav a.active{font-weight:600;border-bottom:2px solid #f30}
    .quran-global-shell .channel-nav.is-sticky{position:fixed;top:0;left:0;right:0;z-index:50;box-shadow:0 4px 14px rgba(3,7,18,.08)}
    .quran-global-shell .header.is-returning{position:static!important;box-shadow:none!important}
    .quran-global-shell .header-spacer.active{height:0!important}
    @media(max-width:900px){
      .quran-global-shell .header-top{height:64px}
      .quran-global-shell .header-top .wrap{display:flex;justify-content:space-between}
      .quran-global-shell .header-search{display:none}
      .quran-global-shell .header-actions>svg{display:none}
      .quran-global-shell .primary-nav{height:46px;overflow:auto}
      .quran-global-shell .primary-nav .wrap{justify-content:flex-start;overflow:auto}
      .quran-global-shell .channel-nav{overflow:auto}
      .quran-global-shell .channel-nav .wrap{width:max-content;margin-left:14px}
    }
  `;
  document.head.appendChild(sharedStyle);

  const primaryLinks=[...document.querySelectorAll('.primary-nav a')];
  const lastPrimary=primaryLinks[primaryLinks.length-1];
  if(lastPrimary)lastPrimary.textContent='LAINNYA';
  const quranChannel=[...document.querySelectorAll('.channel-nav a')].find(a=>a.textContent.trim()==="Al-Qur'an");
  if(quranChannel){quranChannel.href='prototype-v4.html';quranChannel.classList.add('active')}

  let channelOrigin=0;
  const measure=()=>{
    const wasSticky=channelNav.classList.contains('is-sticky');
    if(wasSticky)channelNav.classList.remove('is-sticky');
    channelOrigin=channelNav.getBoundingClientRect().top+window.scrollY;
    if(wasSticky&&window.scrollY>=channelOrigin)channelNav.classList.add('is-sticky');
  };

  const applyShellState=()=>{
    const y=Math.max(0,window.scrollY);
    header.classList.remove('is-returning');
    if(headerSpacer)headerSpacer.classList.remove('active');
    if(y<=8 || y<channelOrigin)channelNav.classList.remove('is-sticky');
    else channelNav.classList.add('is-sticky');

    if(readingProgress){
      const doc=document.documentElement;
      const den=doc.scrollHeight-doc.clientHeight;
      const progress=den>0?(doc.scrollTop/den)*100:0;
      readingProgress.style.width=Math.min(100,Math.max(0,progress))+'%';
    }
  };

  requestAnimationFrame(()=>{measure();applyShellState()});
  window.addEventListener('scroll',applyShellState,{passive:true});
  window.addEventListener('resize',()=>{measure();applyShellState()},{passive:true});
  window.addEventListener('load',()=>{measure();applyShellState()},{once:true});

  if(!window.__l6FigmaFooterRequested){
    window.__l6FigmaFooterRequested=true;
    const footerScript=document.createElement('script');
    footerScript.src='figma-footer.js?v=3';
    document.body.appendChild(footerScript);
  }

  if(window.lucide)lucide.createIcons();
})();