(()=>{
  if(window.__l6AyatReaderEnhance)return;
  window.__l6AyatReaderEnhance=true;

  const style=document.createElement('style');
  style.textContent=`
    .detail-anchor-nav{
      position:relative!important;
      top:auto!important;
      margin-top:16px!important;
      z-index:1!important;
    }
    .detail-verse-actions{display:none!important}
    .ayat-jump-wrap{display:none!important}

    .ayat-command-bar{
      position:sticky;
      top:56px;
      z-index:49;
      width:640px;
      min-height:58px;
      margin-top:0;
      padding:10px 12px;
      border:1px solid var(--line);
      border-radius:0 0 12px 12px;
      background:rgba(255,255,255,.98);
      backdrop-filter:blur(12px);
      display:flex;
      align-items:center;
      gap:10px;
      box-shadow:0 6px 16px rgba(3,7,18,.04);
      transition:width .22s ease,box-shadow .18s ease,border-radius .18s ease;
    }
    .ayat-command-bar.is-sticky-reader{
      width:980px;
      box-shadow:0 8px 24px rgba(3,7,18,.08);
    }
    .ayat-command-context{
      display:none;
      width:150px;
      min-width:150px;
      padding-right:12px;
      border-right:1px solid var(--line);
      overflow:hidden;
    }
    .ayat-command-bar.is-sticky-reader .ayat-command-context{display:block}
    .ayat-command-title{
      font-size:12px;
      line-height:15px;
      font-weight:700;
      color:var(--ink);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .ayat-command-section{
      margin-top:2px;
      font-size:11px;
      line-height:14px;
      color:#6b7280;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .ayat-command-main{display:flex;align-items:center;gap:8px;min-width:0}
    .ayat-command-main .tool-btn{white-space:nowrap;cursor:pointer;transition:background-color .16s ease,border-color .16s ease,transform .1s ease,box-shadow .16s ease}
    .ayat-command-main .tool-btn:hover{background:#f6f8ff;border-color:rgba(0,66,165,.28)}
    .ayat-command-main .tool-btn.primary:hover{background:#1f2937!important;border-color:#1f2937!important;box-shadow:0 4px 10px rgba(3,7,18,.14)}
    .ayat-command-main .tool-btn:active{transform:scale(.96)}
    .ayat-command-main .tool-btn:focus-visible{outline:2px solid rgba(0,66,165,.28);outline-offset:2px}
    .ayat-command-select-wrap{position:relative;display:flex;align-items:center}
    .ayat-command-select-wrap select{
      appearance:none;
      -webkit-appearance:none;
      height:36px;
      min-width:122px;
      padding:0 34px 0 12px;
      border:1px solid var(--line);
      border-radius:7px;
      background:#fff;
      font-size:12px;
      cursor:pointer;
    }
    .ayat-command-select-wrap .icon{position:absolute;right:9px;width:15px;height:15px;pointer-events:none;color:#6b7280}
    .ayat-command-nav{
      display:flex;
      align-items:center;
      gap:6px;
      margin-left:auto;
      padding-left:10px;
      border-left:1px solid var(--line);
    }
    .ayat-command-nav button{
      width:36px;
      height:36px;
      border:1px solid var(--line);
      border-radius:8px;
      background:#fff;
      color:var(--ink);
      display:flex;
      align-items:center;
      justify-content:center;
      cursor:pointer;
      transition:background-color .16s ease,border-color .16s ease,color .16s ease,transform .1s ease;
    }
    .ayat-command-nav button:hover{background:#f6f8ff;border-color:rgba(0,66,165,.28);color:#0042a5}
    .ayat-command-nav button:active{transform:scale(.94);background:#fff0e6;border-color:#ff8d70}
    .ayat-command-nav button:focus-visible{outline:2px solid rgba(0,66,165,.28);outline-offset:2px}
    .ayat-command-nav button:disabled{opacity:.35;cursor:not-allowed}
    .ayat-command-nav .icon{width:17px;height:17px}

    #tafsirText.tafsir-readable{font-size:16px;line-height:1.9;color:#1f2937}
    #tafsirText.tafsir-readable p{margin:0 0 18px}
    #tafsirText.tafsir-readable p:last-child{margin-bottom:0}
    .detail-section>div:last-child{max-width:100%}
    .detail-section p{max-width:62ch}

    @media(max-width:900px){
      .ayat-command-bar,.ayat-command-bar.is-sticky-reader{width:calc(100vw - 28px);max-width:none;overflow-x:auto;white-space:nowrap}
      .ayat-command-context{display:none!important}
      .ayat-command-nav{display:none}
      .ayat-command-main{flex:0 0 auto}
      .ayat-command-select-wrap select{min-width:112px}
      #tafsirText.tafsir-readable{font-size:15px;line-height:1.85}
      #tafsirText.tafsir-readable p{margin-bottom:16px}
    }
  `;
  document.head.appendChild(style);

  const splitReadableParagraphs=(text)=>{
    const clean=String(text||'').replace(/\r/g,'').replace(/[ \t]+/g,' ').trim();
    if(!clean)return [];
    const explicit=clean.split(/\n\s*\n|\n(?=\S)/).map(x=>x.trim()).filter(Boolean);
    if(explicit.length>1)return explicit;
    const sentences=(clean.match(/[^.!?]+[.!?]+[”’"')\]]*|[^.!?]+$/g)||[clean]).map(s=>s.trim()).filter(Boolean);
    const paragraphs=[];
    let current='';
    for(const sentence of sentences){
      const candidate=current?`${current} ${sentence}`:sentence;
      const sentenceCount=(candidate.match(/[.!?]+[”’"')\]]*(?:\s|$)/g)||[]).length;
      if(current && (candidate.length>430 || sentenceCount>3)){
        paragraphs.push(current);
        current=sentence;
      }else current=candidate;
    }
    if(current)paragraphs.push(current);
    return paragraphs;
  };

  const formatTafsir=()=>{
    const el=document.getElementById('tafsirText');
    if(!el||el.dataset.formatted==='1')return;
    const text=el.textContent.trim();
    if(!text||text.startsWith('Memuat tafsir'))return;
    const parts=splitReadableParagraphs(text);
    if(!parts.length)return;
    el.textContent='';
    parts.forEach(part=>{const p=document.createElement('p');p.textContent=part;el.appendChild(p)});
    el.classList.add('tafsir-readable');
    el.dataset.formatted='1';
  };

  const tafsir=document.getElementById('tafsirText');
  if(tafsir){
    const mo=new MutationObserver(()=>formatTafsir());
    mo.observe(tafsir,{childList:true,subtree:true,characterData:true});
    setTimeout(formatTafsir,250);
    setTimeout(formatTafsir,800);
  }

  const hero=document.querySelector('.ayat-detail-hero');
  const anchorNav=document.querySelector('.detail-anchor-nav');
  const play=document.getElementById('playAyatBtn');
  const share=document.getElementById('shareAyatBtn');
  const jump=document.getElementById('detailJump');
  if(!hero||!anchorNav||!play||!share||!jump)return;

  const bar=document.createElement('div');
  bar.className='ayat-command-bar';
  bar.innerHTML=`<div class="ayat-command-context"><div class="ayat-command-title">Detail Ayat</div><div class="ayat-command-section">Arti</div></div><div class="ayat-command-main"></div><div class="ayat-command-nav"><button type="button" data-dir="prev" aria-label="Ayat sebelumnya" title="Ayat sebelumnya"><i data-lucide="arrow-left" class="icon"></i></button><button type="button" data-dir="next" aria-label="Ayat berikutnya" title="Ayat berikutnya"><i data-lucide="arrow-right" class="icon"></i></button></div>`;
  hero.insertAdjacentElement('afterend',bar);

  const main=bar.querySelector('.ayat-command-main');
  const jumpWrap=document.createElement('div');
  jumpWrap.className='ayat-command-select-wrap';
  jumpWrap.appendChild(jump);
  const chev=document.createElement('i');
  chev.className='icon';chev.setAttribute('data-lucide','chevron-down');
  jumpWrap.appendChild(chev);
  main.append(play,jumpWrap,share);

  const playText=()=>{
    const textNode=[...play.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
    if(textNode&&textNode.textContent.trim()==='Putar Ayat')textNode.textContent='Putar';
  };
  playText();
  const playObserver=new MutationObserver(playText);playObserver.observe(play,{childList:true,subtree:true});

  const contextTitle=bar.querySelector('.ayat-command-title');
  const contextSection=bar.querySelector('.ayat-command-section');
  const syncContext=()=>{
    const title=(document.getElementById('detailTitle')?.textContent||'Detail Ayat').trim();
    contextTitle.textContent=title;
    contextTitle.title=title;
  };
  setTimeout(syncContext,250);setTimeout(syncContext,800);

  const sections=[
    ['arti','Arti'],['tafsir','Tafsir'],['poin-penting','Poin Penting'],['asbabun-nuzul','Asbabun Nuzul'],['faq','FAQ']
  ];
  const syncSection=()=>{
    let active='Arti';
    const threshold=145;
    for(const [id,label] of sections){
      const el=document.getElementById(id);
      if(el&&el.getBoundingClientRect().top<=threshold)active=label;
      else if(el)break;
    }
    contextSection.textContent=active;
  };

  let barOrigin=0;
  const measureBar=()=>{
    const had=bar.classList.contains('is-sticky-reader');
    if(had)bar.classList.remove('is-sticky-reader');
    barOrigin=bar.getBoundingClientRect().top+window.scrollY;
    if(had)syncSticky();
  };
  const syncSticky=()=>{
    const should=window.scrollY+56>=barOrigin;
    bar.classList.toggle('is-sticky-reader',should);
    syncSection();
  };
  requestAnimationFrame(()=>{measureBar();syncSticky()});
  window.addEventListener('scroll',syncSticky,{passive:true});
  window.addEventListener('resize',()=>{measureBar();syncSticky()},{passive:true});

  const prevBtn=bar.querySelector('[data-dir="prev"]');
  const nextBtn=bar.querySelector('[data-dir="next"]');
  const syncNav=()=>{
    const prev=document.getElementById('prevAyat'),next=document.getElementById('nextAyat');
    const prevHref=prev?.getAttribute('href'),nextHref=next?.getAttribute('href');
    prevBtn.disabled=!prevHref||prevHref==='#'||prev.style.visibility==='hidden';
    nextBtn.disabled=!nextHref||nextHref==='#'||next.style.visibility==='hidden';
    const pLabel=document.getElementById('prevAyatLabel')?.textContent.trim();
    const nLabel=document.getElementById('nextAyatLabel')?.textContent.trim();
    prevBtn.title=pLabel?`Sebelumnya: ${pLabel}`:'Ayat sebelumnya';
    nextBtn.title=nLabel?`Berikutnya: ${nLabel}`:'Ayat berikutnya';
  };
  setTimeout(syncNav,300);setTimeout(syncNav,900);
  bar.querySelector('.ayat-command-nav').addEventListener('click',e=>{
    const btn=e.target.closest('button[data-dir]');if(!btn||btn.disabled)return;
    const target=btn.dataset.dir==='prev'?document.getElementById('prevAyat'):document.getElementById('nextAyat');
    const href=target?.getAttribute('href');if(href&&href!=='#')location.href=href;
  });

  if(window.lucide)lucide.createIcons();
})();