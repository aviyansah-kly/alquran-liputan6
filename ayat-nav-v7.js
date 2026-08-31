(()=>{
  if(window.__l6AyatNavV7)return;window.__l6AyatNavV7=true;
  const mount=()=>{
    const bar=document.querySelector('.ayat-command-bar');
    if(!bar)return false;
    const nav=bar.querySelector('.ayat-command-nav');if(!nav)return false;
    if(!document.getElementById('ayat-nav-v7-style')){
      const st=document.createElement('style');st.id='ayat-nav-v7-style';st.textContent=`
        .ayat-command-bar{transition:width .3s cubic-bezier(.22,1,.36,1),box-shadow .22s ease,border-radius .22s ease!important}
        .ayat-command-bar.is-sticky-reader .ayat-command-context{width:132px!important;min-width:132px!important}
        .ayat-command-bar.is-sticky-reader .ayat-command-nav{gap:6px!important;padding-left:8px!important}
        .ayat-command-bar.is-sticky-reader .ayat-command-nav button{width:126px!important;min-width:126px!important;height:40px!important;padding:0 10px!important;gap:7px!important;justify-content:flex-start!important}
        .ayat-command-bar.is-sticky-reader .ayat-command-nav button[data-dir="next"]{justify-content:flex-end!important;text-align:right}
        .ayat-command-nav-copy{min-width:0;display:flex;flex-direction:column;line-height:1.05}
        .ayat-command-nav-label{font-size:9px;color:#6b7280;font-weight:500;white-space:nowrap}
        .ayat-command-nav-name{max-width:86px;margin-top:2px;font-size:11px;color:#030712;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ayat-command-nav button:hover .ayat-command-nav-name{color:#0042a5}
        @media(max-width:1040px) and (min-width:901px){
          .ayat-command-bar.is-sticky-reader .ayat-command-context{width:112px!important;min-width:112px!important}
          .ayat-command-bar.is-sticky-reader .ayat-command-nav button{width:114px!important;min-width:114px!important;padding:0 8px!important}
          .ayat-command-nav-name{max-width:74px}
        }
        @media(max-width:900px){.ayat-command-nav-copy{display:none!important}}
      `;document.head.appendChild(st);
    }
    const defs=[['prev','Sebelumnya','prevAyat','prevAyatLabel'],['next','Berikutnya','nextAyat','nextAyatLabel']];
    defs.forEach(([dir,label,targetId,labelId])=>{
      const btn=nav.querySelector(`button[data-dir="${dir}"]`);if(!btn)return;
      const name=(document.getElementById(labelId)?.textContent||'').trim()||(dir==='prev'?'Ayat sebelumnya':'Ayat berikutnya');
      if(!btn.querySelector('.ayat-command-nav-copy')){
        const copy=document.createElement('span');copy.className='ayat-command-nav-copy';copy.innerHTML=`<span class="ayat-command-nav-label">${label}</span><span class="ayat-command-nav-name"></span>`;
        if(dir==='prev')btn.appendChild(copy);else btn.insertBefore(copy,btn.firstChild);
      }
      const nameEl=btn.querySelector('.ayat-command-nav-name');nameEl.textContent=name;nameEl.title=name;
      btn.setAttribute('aria-label',`${label}: ${name}`);btn.title=`${label}: ${name}`;
    });
    return true;
  };
  let attempts=0;const timer=setInterval(()=>{attempts++;if(mount()||attempts>20)clearInterval(timer)},100);
})();
