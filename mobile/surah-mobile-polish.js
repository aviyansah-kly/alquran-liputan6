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

    /* Match desktop reader behavior while keeping mobile controls compact. */
    const audio=document.getElementById('audioEl');
    const dock=document.getElementById('audioDock');
    const toggle=document.getElementById('audioToggle');
    const close=document.getElementById('audioClose');
    let audioMode='none';
    let lastFollowedAyat=0;

    const activeVerseFromTitle=()=>{
      const match=(document.getElementById('audioTitle')?.textContent||'').match(/Ayat\s+(\d+)/i);
      return match?parseInt(match[1],10):0;
    };
    const syncAyahButtons=()=>{
      const active=audioMode==='verse'&&!audio.paused&&!audio.ended?activeVerseFromTitle():0;
      document.querySelectorAll('[data-play]').forEach(btn=>{
        const n=parseInt(btn.dataset.play||'0',10);
        const playing=n===active;
        btn.classList.toggle('is-audio-playing',playing);
        btn.setAttribute('aria-pressed',playing?'true':'false');
        btn.setAttribute('aria-label',playing?`Jeda audio ayat ${n}`:`Putar audio ayat ${n}`);
        btn.setAttribute('title',playing?'Jeda':'Audio');
        btn.innerHTML=`<i data-lucide="${playing?'pause':'play'}"></i><span class="action-label">${playing?'Jeda':'Audio'}</span>`;
      });
      if(window.lucide)lucide.createIcons();
      if(active&&active!==lastFollowedAyat){
        lastFollowedAyat=active;
        ensureRendered(active);
        requestAnimationFrame(()=>{
          const ayah=document.getElementById(`ayat-${active}`);
          if(!ayah)return;
          const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          ayah.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
        });
      }
    };

    const syncAudioUi=()=>{
      if(!audio||!toggle)return;
      const playing=!audio.paused&&!audio.ended;
      const fullPlaying=audioMode==='full'&&playing;
      play.classList.toggle('is-playing',fullPlaying);
      play.setAttribute('aria-pressed',fullPlaying?'true':'false');
      play.setAttribute('aria-label',fullPlaying?'Jeda surah':'Putar surah');
      play.setAttribute('title',fullPlaying?'Jeda surah':'Putar surah');
      play.innerHTML=`<i data-lucide="${fullPlaying?'pause':'play'}"></i><span>${fullPlaying?'Jeda':'Putar Surah'}</span>`;
      toggle.innerHTML=`<i data-lucide="${playing?'pause':'play'}"></i>`;
      toggle.setAttribute('aria-label',playing?'Jeda audio':'Putar audio');
      syncAyahButtons();
      if(window.lucide)lucide.createIcons();
    };

    playAyat=function(n){
      const v=data?.ayat?.find(x=>x.nomorAyat===n);if(!v)return;
      const src=verseAudio(v);if(!src)return;
      audioMode='verse';audio.src=src;
      document.getElementById('audioTitle').textContent=`${data.namaLatin} · Ayat ${n}`;
      document.getElementById('audioSub').textContent=qariNames[qari.value];
      dock.hidden=false;markPlaying(n);
      const request=audio.play();if(request?.catch)request.catch(syncAudioUi);
    };

    playSurah=function(){
      const full=data?.audioFull||{};
      const src=full[qari.value]||full['05']||Object.values(full)[0];
      if(!src){playAyat(1);return}
      const same=audio.src===src||audio.currentSrc===src;
      if(same&&audioMode==='full'&&!audio.paused){audio.pause();return}
      audioMode='full';lastFollowedAyat=0;
      if(!same)audio.src=src;
      document.getElementById('audioTitle').textContent=data.namaLatin+' · Surah lengkap';
      document.getElementById('audioSub').textContent=qariNames[qari.value];
      dock.hidden=false;
      const request=audio.play();if(request?.catch)request.catch(syncAudioUi);
    };
    play.onclick=playSurah;

    const ayahList=document.getElementById('ayahList');
    ayahList?.addEventListener('click',e=>{
      const btn=e.target.closest('[data-play]');
      if(!btn||audioMode!=='verse'||audio.paused)return;
      const n=parseInt(btn.dataset.play||'0',10);
      if(n&&n===activeVerseFromTitle()){
        e.preventDefault();e.stopImmediatePropagation();audio.pause();
      }
    },true);

    toggle.onclick=()=>{
      if(!audio.src)return;
      if(audio.paused){const request=audio.play();if(request?.catch)request.catch(syncAudioUi)}else audio.pause();
    };
    close.onclick=()=>{audio.pause();dock.hidden=true;audioMode='none';lastFollowedAyat=0;syncAudioUi()};
    audio.ontimeupdate=()=>{document.getElementById('audioProgress').style.width=(audio.duration?audio.currentTime/audio.duration*100:0)+'%'};
    audio.onended=()=>{
      const endedMode=audioMode;syncAudioUi();
      if(endedMode==='verse'&&activeAyat&&data&&activeAyat<data.jumlahAyat)playAyat(activeAyat+1);
      else if(endedMode==='full'){audioMode='none';lastFollowedAyat=0;syncAudioUi()}
    };
    ['play','pause','emptied'].forEach(evt=>audio.addEventListener(evt,()=>requestAnimationFrame(syncAudioUi)));
    syncAudioUi();

    if(window.lucide)window.lucide.createIcons();
  });
})();