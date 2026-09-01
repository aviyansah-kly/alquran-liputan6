(function(){
  ayahMarkup=function(v){
    return `<article class="ayah" id="ayat-${v.nomorAyat}"><div class="ayah-head"><div class="ayah-number">${v.nomorAyat}</div><div class="ayah-actions"><button class="ayah-action" type="button" data-play="${v.nomorAyat}" aria-label="Putar audio ayat ${v.nomorAyat}" title="Audio"><i data-lucide="play"></i><span class="action-label">Audio</span></button><button class="ayah-action" type="button" data-save="${v.nomorAyat}" aria-label="Simpan ayat ${v.nomorAyat}" title="Simpan"><i data-lucide="bookmark"></i><span class="action-label">Simpan</span></button><button class="ayah-action" type="button" data-share="${v.nomorAyat}" aria-label="Bagikan ayat ${v.nomorAyat}" title="Bagikan"><i data-lucide="share-2"></i><span class="action-label">Bagikan</span></button><a class="ayah-action detail" href="./ayat.html?surah=${sid}&ayat=${v.nomorAyat}" aria-label="Buka detail ayat ${v.nomorAyat}"><i data-lucide="book-open-text"></i><span class="action-label">Detail Ayat</span></a></div></div><div class="ayah-ar" lang="ar" dir="rtl" style="font-size:${arabSize}px">${v.teksArab}</div><div class="ayah-latin">${v.teksLatin||''}</div><p class="ayah-translation">${v.teksIndonesia||''}</p></article>`;
  };

  document.addEventListener('DOMContentLoaded',()=>{
    const summary=document.querySelector('.surah-summary');
    const controls=summary?.querySelector('.surah-controls');
    const typeTools=summary?.querySelector('.reader-type-tools');
    const play=controls?.querySelector('#playFull');
    const qari=controls?.querySelector('#qariSelect');
    const jump=controls?.querySelector('#ayatJump');
    if(!summary||!controls||!typeTools||!play||!qari||!jump)return;

    const audioSetting=document.createElement('div');
    audioSetting.className='reader-audio-setting';
    const audioLabel=document.createElement('label');
    audioLabel.htmlFor='qariSelect';
    audioLabel.textContent='Qari';
    audioSetting.append(audioLabel,qari);
    summary.insertBefore(audioSetting,typeTools);

    const toolbar=document.createElement('div');
    toolbar.className='reader-toolbar';
    toolbar.setAttribute('aria-label','Navigasi pembaca Al-Qur\'an');

    const context=document.createElement('div');
    context.className='reader-toolbar__context';
    const prev=document.createElement('a');
    prev.className='reader-toolbar__surah-nav';
    prev.setAttribute('aria-label','Surah sebelumnya');
    if(sid>1) prev.href=`./surah.html?surah=${sid-1}`; else prev.setAttribute('aria-disabled','true');
    prev.innerHTML='<i data-lucide="chevron-left"></i>';

    const info=document.createElement('div');
    info.className='reader-toolbar__info';
    info.innerHTML='<span class="reader-toolbar__eyebrow">Surah</span><strong class="reader-toolbar__name">Memuat...</strong>';

    const next=document.createElement('a');
    next.className='reader-toolbar__surah-nav';
    next.setAttribute('aria-label','Surah berikutnya');
    if(sid<114) next.href=`./surah.html?surah=${sid+1}`; else next.setAttribute('aria-disabled','true');
    next.innerHTML='<i data-lucide="chevron-right"></i>';
    context.append(prev,info,next);

    const actions=document.createElement('div');
    actions.className='reader-toolbar__actions';
    play.classList.add('reader-toolbar__play');
    play.setAttribute('aria-label','Putar Surah');
    jump.classList.add('reader-toolbar__jump');
    actions.append(play,jump,typeTools);
    toolbar.append(context,actions);
    summary.insertAdjacentElement('afterend',toolbar);
    controls.remove();

    const updateContext=()=>{
      const name=document.getElementById('surahName')?.textContent?.trim();
      const number=document.getElementById('surahNumber')?.textContent?.trim();
      const nameEl=toolbar.querySelector('.reader-toolbar__name');
      const eyebrow=toolbar.querySelector('.reader-toolbar__eyebrow');
      if(nameEl&&name)nameEl.textContent=name;
      if(eyebrow)eyebrow.textContent=number||`SURAH ${String(sid).padStart(2,'0')}`;
    };
    updateContext();
    const nameNode=document.getElementById('surahName');
    const numberNode=document.getElementById('surahNumber');
    if(nameNode)new MutationObserver(updateContext).observe(nameNode,{childList:true,subtree:true,characterData:true});
    if(numberNode)new MutationObserver(updateContext).observe(numberNode,{childList:true,subtree:true,characterData:true});

    if(window.lucide)window.lucide.createIcons();
  });
})();