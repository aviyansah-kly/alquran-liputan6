(()=>{
  if(window.__l6ReaderAudioStateV7)return;window.__l6ReaderAudioStateV7=true;
  const play=document.getElementById('playFull'),audio=document.getElementById('audioEl');
  if(!play||!audio)return;
  const sync=()=>{
    const isFull=(document.getElementById('audioTitle')?.textContent||'').includes('Surah lengkap');
    const playing=isFull&&!audio.paused&&!audio.ended;
    play.classList.toggle('is-playing',playing);
    play.setAttribute('aria-pressed',playing?'true':'false');
    play.setAttribute('aria-label',playing?'Jeda surah':'Putar surah');
    play.setAttribute('title',playing?'Jeda surah':'Putar surah');
    play.innerHTML=`<i data-lucide="${playing?'pause':'play'}" class="icon"></i>${playing?'Jeda':'Putar'}`;
    if(window.lucide)lucide.createIcons();
  };
  ['play','pause','ended','emptied'].forEach(evt=>audio.addEventListener(evt,()=>requestAnimationFrame(sync)));
  play.addEventListener('click',()=>setTimeout(sync,0));
  sync();
})();
