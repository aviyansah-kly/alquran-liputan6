(function(){
  ayahMarkup=function(v){
    return `<article class="ayah" id="ayat-${v.nomorAyat}"><div class="ayah-head"><div class="ayah-number">${v.nomorAyat}</div><div class="ayah-actions"><button class="ayah-action" type="button" data-play="${v.nomorAyat}" aria-label="Putar audio ayat ${v.nomorAyat}" title="Audio"><i data-lucide="play"></i><span class="action-label">Audio</span></button><button class="ayah-action" type="button" data-save="${v.nomorAyat}" aria-label="Simpan ayat ${v.nomorAyat}" title="Simpan"><i data-lucide="bookmark"></i><span class="action-label">Simpan</span></button><button class="ayah-action" type="button" data-share="${v.nomorAyat}" aria-label="Bagikan ayat ${v.nomorAyat}" title="Bagikan"><i data-lucide="share-2"></i><span class="action-label">Bagikan</span></button><a class="ayah-action detail" href="./ayat.html?surah=${sid}&ayat=${v.nomorAyat}" aria-label="Buka detail ayat ${v.nomorAyat}"><i data-lucide="book-open-text"></i><span class="action-label">Detail Ayat</span></a></div></div><div class="ayah-ar" lang="ar" dir="rtl" style="font-size:${arabSize}px">${v.teksArab}</div><div class="ayah-latin">${v.teksLatin||''}</div><p class="ayah-translation">${v.teksIndonesia||''}</p></article>`;
  };
  document.addEventListener('DOMContentLoaded',()=>{
    const summary=document.querySelector('.surah-summary');
    const controls=summary?.querySelector('.surah-controls');
    const typeTools=summary?.querySelector('.reader-type-tools');
    if(summary&&controls&&typeTools){
      const toolbar=document.createElement('div');
      toolbar.className='reader-toolbar';
      toolbar.setAttribute('aria-label','Kontrol pembaca Al-Qur\'an');
      toolbar.appendChild(controls);
      controls.appendChild(typeTools);
      summary.insertAdjacentElement('afterend',toolbar);
    }
    if(window.lucide)window.lucide.createIcons();
  });
})();