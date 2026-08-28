(()=>{
  if(window.__l6QuranGlobalShell)return;
  window.__l6QuranGlobalShell=true;

  const header=document.querySelector('.header');
  const channelNav=document.querySelector('.channel-nav');
  const headerSpacer=document.getElementById('headerSpacer');
  const readingProgress=document.getElementById('readingProgress');
  if(!header||!channelNav)return;

  document.body.classList.add('quran-global-shell');

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

    if(y<=8){
      channelNav.classList.remove('is-sticky');
    }else if(y>=channelOrigin){
      channelNav.classList.add('is-sticky');
    }else{
      channelNav.classList.remove('is-sticky');
    }

    if(readingProgress){
      const doc=document.documentElement;
      const den=doc.scrollHeight-doc.clientHeight;
      const progress=den>0?(doc.scrollTop/den)*100:0;
      readingProgress.style.width=Math.min(100,Math.max(0,progress))+'%';
    }
  };

  requestAnimationFrame(()=>{
    measure();
    applyShellState();
  });
  window.addEventListener('scroll',applyShellState,{passive:true});
  window.addEventListener('resize',()=>{measure();applyShellState()},{passive:true});
  window.addEventListener('load',()=>{measure();applyShellState()},{once:true});

  if(!window.__l6FigmaFooterRequested){
    window.__l6FigmaFooterRequested=true;
    const footerScript=document.createElement('script');
    footerScript.src='figma-footer.js?v=2';
    document.body.appendChild(footerScript);
  }

  if(window.lucide)lucide.createIcons();
})();