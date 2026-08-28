(()=>{
  function ensureGlobalShell(){
    if(window.__l6QuranGlobalShell||window.__l6QuranGlobalShellRequested)return;
    window.__l6QuranGlobalShellRequested=true;
    const s=document.createElement('script');
    s.src='quran-global-shell.js?v=2';
    document.body.appendChild(s);
  }

  function mountHeadline(){
    const trending=document.querySelector('.trending');
    const contentStart=document.querySelector('.layout')||document.querySelector('.reader-page');
    if(!trending||!contentStart||document.querySelector('.headline-hari-ini')){ensureGlobalShell();return;}

    const style=document.createElement('style');
    style.id='figma-headline-style';
    style.textContent=`
      .headline-hari-ini{
        width:980px;
        min-height:48px;
        margin:24px auto 0;
        padding:6px 12px;
        border-radius:8px;
        background:#f6f8ff;
        display:flex;
        align-items:center;
        gap:10px;
        font-family:Inter,Arial,sans-serif;
      }
      .headline-hari-ini__label{flex:0 0 auto;display:flex;align-items:center;gap:8px}
      .headline-hari-ini__bar{width:4px;height:20px;border-radius:1px;background:linear-gradient(90deg,#ff6600,#ff3300)}
      .headline-hari-ini__title{margin:0;color:#0042a5;font-size:16px;line-height:36px;font-weight:700;text-transform:uppercase;white-space:nowrap}
      .headline-hari-ini__story{flex:1 1 auto;min-width:0;height:36px;display:flex;align-items:center;color:#030712;font-size:16px;line-height:1.4;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .headline-hari-ini__cta{flex:0 0 auto;min-height:32px;padding:8px 20px;border:0;border-radius:50px;background:#fff;box-shadow:0 3px 1.9px rgba(0,0,0,.04);color:#0042a5;display:flex;align-items:center;justify-content:center;gap:4.676px;font-size:14px;line-height:1;font-weight:500;letter-spacing:-.0935px;cursor:pointer}
      .headline-hari-ini__cta img{display:block;width:6px;height:10px;object-fit:contain}
      .headline-hari-ini + .layout{margin-top:24px!important}
      .headline-hari-ini ~ .reader-page{margin-top:24px!important}
      @media(max-width:900px){
        .headline-hari-ini{width:auto;margin:18px 14px 0;min-height:0;align-items:flex-start;flex-wrap:wrap;gap:6px 10px;padding:10px 12px}
        .headline-hari-ini__title{font-size:14px;line-height:20px}
        .headline-hari-ini__story{order:3;flex-basis:100%;height:auto;font-size:14px;white-space:normal}
        .headline-hari-ini__cta{margin-left:auto;padding:7px 14px}
        .headline-hari-ini + .layout{margin-top:18px!important}
        .headline-hari-ini ~ .reader-page{margin-top:18px!important}
      }
    `;
    document.head.appendChild(style);

    const section=document.createElement('section');
    section.className='headline-hari-ini';
    section.setAttribute('aria-label','Headline Hari Ini');
    section.innerHTML=`<div class="headline-hari-ini__label"><span class="headline-hari-ini__bar"></span><p class="headline-hari-ini__title">Headline Hari ini :</p></div><div class="headline-hari-ini__story">Gelombang Baru COVID-19 di Indonesia, Bagaimana Langkah Penanganannya?</div><button class="headline-hari-ini__cta" type="button"><span>Selengkapnya</span><img src="https://www.figma.com/api/mcp/asset/18c2c996-3642-4edd-ad75-7f9effb31d7d.svg" alt=""></button>`;
    trending.insertAdjacentElement('afterend',section);
    ensureGlobalShell();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountHeadline,{once:true});
  else mountHeadline();
})();