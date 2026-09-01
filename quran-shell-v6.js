(()=>{
  const HOME='prototype-v6.html';
  const sid=()=>Math.min(114,Math.max(1,parseInt(new URLSearchParams(location.search).get('surah')||'1',10)||1));
  const token=n=>'surah'+String(n).padStart(3,'0');

  function ensureQulFont(){
    if(document.getElementById('qul-surah-font-style'))return;
    const s=document.createElement('style');s.id='qul-surah-font-style';
    s.textContent=`@font-face{font-family:'surah-name-v4-icon';src:url('https://static-cdn.tarteel.ai/qul/fonts/surah-names/v4/surah-name-v4.ttf') format('truetype');font-display:swap}.surah-name-glyph,.surah-ar-name,.detail-arabic-name{font-family:'surah-name-v4-icon'!important;font-weight:400!important;font-style:normal!important;font-variant-ligatures:common-ligatures!important;font-feature-settings:'liga' 1,'clig' 1!important;letter-spacing:0!important}`;
    document.head.appendChild(s);
  }

  function setGlyph(el,n,extraClass){if(!el||!n)return;el.textContent=token(n);el.classList.add('surah-name-glyph');if(extraClass)el.classList.add(extraClass)}
  function applyGlyphs(){
    document.querySelectorAll('.surah').forEach(card=>{const href=card.getAttribute('href')||'',m=href.match(/surah=(\d+)/),num=m?+m[1]:parseInt(card.querySelector('.num')?.textContent||'0',10);setGlyph(card.querySelector('.arabic'),num)});
    setGlyph(document.getElementById('surahArabic'),sid(),'surah-ar-name');
    setGlyph(document.getElementById('detailArabicName'),sid(),'detail-arabic-name');
  }
  function watchAsyncGlyph(id,extraClass){
    const el=document.getElementById(id);if(!el)return;let done=false;
    const obs=new MutationObserver(()=>{if(done)return;done=true;obs.disconnect();requestAnimationFrame(()=>setGlyph(el,sid(),extraClass))});
    obs.observe(el,{childList:true,characterData:true,subtree:true});
    setTimeout(()=>{if(done)return;done=true;obs.disconnect();setGlyph(el,sid(),extraClass)},1200);
  }

  function rewriteLinks(){
    document.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href');if(!h)return;const n=h.replace('surah-v6.html','surah-v4.html').replace('surah-v3.html','surah-v4.html').replace('prototype-v4.html',HOME).replace('prototype-v3.html',HOME).replace('ayat-v6.html','ayat-v5.html');if(n!==h)a.setAttribute('href',n)});
  }
  function patchFlows(){
    window.goSurah=(id,ayat)=>location.href=ayat?`ayat-v5.html?surah=${id}&ayat=${ayat}`:`surah-v4.html?surah=${id}`;
    window.toggleDetail=i=>location.href=`ayat-v5.html?surah=${sid()}&ayat=${i}`;
  }
  function addCredit(){
    const f=document.querySelector('.footer-inner');if(!f||f.querySelector('.font-credit'))return;
    const c=document.createElement('div');c.className='font-credit';c.textContent='Kaligrafi nama surah: QUL / Tarteel — Surah Name Font v4.';
    const cp=f.querySelector('.copyright');cp?f.insertBefore(c,cp):f.appendChild(c);
  }
  function applyAll(){patchFlows();rewriteLinks();applyGlyphs();addCredit();if(window.lucide)lucide.createIcons()}

  async function syncShellFromCanonicalHome(){
    if(document.getElementById('surahGrid'))return;
    try{
      const html=await fetch(HOME,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('home-shell');return r.text()});
      const doc=new DOMParser().parseFromString(html,'text/html');
      for(const sel of ['header','.sidebar','footer']){const src=doc.querySelector(sel),dst=document.querySelector(sel);if(src&&dst)dst.replaceWith(src.cloneNode(true))}
    }catch(e){}
  }

  async function run(){
    ensureQulFont();
    await syncShellFromCanonicalHome();
    applyAll();
    watchAsyncGlyph('surahArabic','surah-ar-name');watchAsyncGlyph('detailArabicName','detail-arabic-name');
    const grid=document.getElementById('surahGrid');
    if(grid){let queued=false;new MutationObserver(m=>{if(queued||!m.some(x=>x.type==='childList'&&x.addedNodes.length))return;queued=true;requestAnimationFrame(()=>{queued=false;applyGlyphs();rewriteLinks()})}).observe(grid,{childList:true,subtree:true})}
    if(!window.__l6FigmaFooterRequested){window.__l6FigmaFooterRequested=true;const f=document.createElement('script');f.src='figma-footer.js?v=3';document.body.appendChild(f)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
