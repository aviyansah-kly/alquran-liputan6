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
    .qari-select{width:210px;max-width:210px}
    .ayat-jump{width:128px;min-width:128px}
    .surah-hero{border-radius:12px 12px 0 0!important;border-bottom:0!important;padding:24px 32px 24px 24px!important}
    .reader-tools{margin-top:0!important;min-height:58px;top:56px!important;border-radius:0 0 12px 12px!important;padding:10px 12px!important;gap:22px!important;z-index:49}
    body:has(.channel-nav.is-sticky) .reader-tools{top:56px!important}
    #playFull,.font-label,.reader-tools .tool-btn{white-space:nowrap;flex-shrink:0}
    #playFull{min-width:84px;justify-content:center;cursor:pointer;transition:background-color .16s ease,border-color .16s ease,transform .1s ease,box-shadow .16s ease;user-select:none}
    #playFull:hover{background:#1f2937!important;border-color:#1f2937!important;box-shadow:0 4px 10px rgba(3,7,18,.14)}
    #playFull:focus-visible{outline:2px solid rgba(0,66,165,.32);outline-offset:2px}
    #playFull:active,#playFull.is-pressed{transform:scale(.96);background:#374151!important;border-color:#374151!important;box-shadow:0 0 0 3px rgba(0,66,165,.08)}
    #playFull.is-playing{background:#0042a5!important;border-color:#0042a5!important;box-shadow:0 4px 12px rgba(0,66,165,.18)}
    .font-label{min-width:max-content}
    .font-size-btn{cursor:pointer;transition:background-color .16s ease,border-color .16s ease,color .16s ease,transform .1s ease,box-shadow .16s ease;user-select:none}
    .font-size-btn:hover{background:#f6f8ff!important;border-color:rgba(0,66,165,.35)!important;color:#0042a5}
    .font-size-btn:focus-visible{outline:2px solid rgba(0,66,165,.28);outline-offset:2px;border-color:#0042a5!important}
    .font-size-btn:active,.font-size-btn.is-pressed{transform:scale(.94);background:#fff0e6!important;border-color:#ff8d70!important;color:#a72a0d;box-shadow:0 0 0 3px rgba(255,51,0,.08)}
    .surah-global-trending{width:980px;height:54px;margin:24px auto 0;border:1px solid #ff633d;background:#fffbf7;border-radius:8px;display:flex;align-items:center;padding:0 24px;gap:30px;overflow:hidden;font-family:Inter,Arial,sans-serif}
    .surah-global-trending .trend-title{font-size:16px;font-weight:700;color:#0042a5;display:flex;align-items:center;gap:8px;white-space:nowrap}
    .surah-global-trending .trend-title .icon{width:20px;height:20px}
    .surah-global-trending .trend-chips{display:flex;align-items:center;gap:12px;white-space:nowrap;overflow:hidden}
    .surah-global-trending .trend-chip{font-size:14px;line-height:20px;background:#fff0e6;padding:5px 12px;border-radius:99px}
    @media(max-width:900px){.qari-select{width:200px;max-width:200px}.ayat-jump{width:124px;min-width:124px}.surah-hero{padding:18px 20px!important}.reader-tools{top:56px!important}.surah-global-trending{display:none}}
  `;
  document.head.appendChild(style);

  function mountGlobalStrips(){
    if(document.querySelector('.surah-global-trending'))return;
    const reader=document.querySelector('.reader-page');
    if(!reader)return;
    const trending=document.createElement('div');
    trending.className='trending surah-global-trending';
    trending.innerHTML=`<div class="trend-title"><i data-lucide="trending-up" class="icon"></i>Trending</div><div class="trend-chips"><span class="trend-chip">Raja Ampat</span><span class="trend-chip">Haji</span><span class="trend-chip">Haji 2025</span><span class="trend-chip">Indonesia vs China</span><span class="trend-chip">Idul Adha 2025</span><span class="trend-chip">Indonesia Open</span></div>`;
    reader.parentNode.insertBefore(trending,reader);
    lucide.createIcons();
    if(!window.__l6HeadlineRequested){window.__l6HeadlineRequested=true;const h=document.createElement('script');h.src='figma-headline.js?v=3';document.body.appendChild(h)}
  }

  const playFull=document.getElementById('playFull');
  if(playFull){
    const textNode=[...playFull.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
    if(textNode)textNode.textContent='Putar';
    playFull.setAttribute('aria-label','Putar surah');
    playFull.setAttribute('title','Putar surah');
    playFull.addEventListener('pointerdown',()=>playFull.classList.add('is-pressed'));
    const clearPressed=()=>playFull.classList.remove('is-pressed');
    playFull.addEventListener('pointerup',clearPressed);
    playFull.addEventListener('pointerleave',clearPressed);
    playFull.addEventListener('pointercancel',clearPressed);
    playFull.addEventListener('click',()=>{
      playFull.classList.toggle('is-playing');
      const labelNode=[...playFull.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
      if(labelNode)labelNode.textContent=playFull.classList.contains('is-playing')?'Jeda':'Putar';
      playFull.setAttribute('aria-pressed',playFull.classList.contains('is-playing')?'true':'false');
      playFull.setAttribute('title',playFull.classList.contains('is-playing')?'Jeda surah':'Putar surah');
    });
  }

  const fontLabel=document.querySelector('.font-label');
  if(fontLabel)fontLabel.textContent='Teks Arab';
  [...document.querySelectorAll('.tool-right .tool-btn')].forEach((btn,index)=>{
    btn.classList.add('font-size-btn');
    btn.setAttribute('aria-label',index===0?'Perkecil teks Arab':'Perbesar teks Arab');
    btn.setAttribute('title',index===0?'Perkecil teks Arab':'Perbesar teks Arab');
    btn.addEventListener('click',()=>{btn.classList.add('is-pressed');setTimeout(()=>btn.classList.remove('is-pressed'),140)});
  });

  window.resizeArabic=(delta)=>{
    const verses=[...document.querySelectorAll('.ayah-ar')];
    if(!verses.length)return;
    const current=parseFloat(getComputedStyle(verses[0]).fontSize)||56;
    const next=Math.max(34,Math.min(68,current+delta));
    verses.forEach(el=>el.style.setProperty('font-size',`${next}px`,'important'));
  };

  mountGlobalStrips();
  if(!window.__l6QuranGlobalShell&&!window.__l6QuranGlobalShellRequested){window.__l6QuranGlobalShellRequested=true;const s=document.createElement('script');s.src='quran-global-shell.js?v=2';document.body.appendChild(s)}
})();