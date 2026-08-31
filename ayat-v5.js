const API='https://equran.id/api/v2';
const p=new URLSearchParams(location.search),sid=Math.min(114,Math.max(1,+(p.get('surah')||1))),aid=Math.max(1,+(p.get('ayat')||1));
let data=null,verse=null;const qari='05';const $=id=>document.getElementById(id);

function reveal(id,skeletonId){const el=$(id),sk=$(skeletonId);if(sk)sk.remove();if(el)el.hidden=false}
function failCore(message='Silakan refresh halaman.'){
  ['detailTitle','detailMeta','detailArab','detailLatin','artiText'].forEach(id=>{const el=$(id);if(el)el.hidden=false});
  ['detailTitleSkeleton','detailMetaSkeleton','detailArabSkeleton','detailLatinSkeleton','artiSkeleton'].forEach(id=>$(id)?.remove());
  $('detailTitle').textContent='Data ayat belum dapat dimuat';$('artiText').textContent=message;
}

async function init(){
  try{
    const sr=await fetch(`${API}/surat/${sid}`);
    if(!sr.ok)throw new Error('surat');
    const sj=await sr.json();
    data=sj.data;
    verse=data.ayat.find(v=>v.nomorAyat===aid)||data.ayat[0];
    renderCore();
    loadTafsir();
  }catch(e){
    failCore();
    $('tafsirSkeleton')?.remove();$('tafsirText').hidden=false;$('tafsirText').textContent='Tafsir belum dapat dimuat.';
  }
}

function renderCore(){
  const n=verse.nomorAyat,name=data.namaLatin;
  document.title=`${name} Ayat ${n}: Arti, Tafsir dan Penjelasan | Liputan6 Quran`;
  document.querySelector('meta[name="description"]').setAttribute('content',`Baca ${name} ayat ${n} lengkap dengan arti Bahasa Indonesia, tafsir, poin penting, Asbabun Nuzul dan FAQ.`);
  $('surahCrumb').textContent=name;$('surahCrumb').href=`surah-v4.html?surah=${sid}`;
  $('ayatCrumb').textContent=`Ayat ${n}`;$('backSurah').href=`surah-v4.html?surah=${sid}&ayat=${n}`;
  $('ayatKicker').textContent=`Surah ke-${sid} · Ayat ${n}`;
  $('detailTitle').textContent=`${name} Ayat ${n}`;reveal('detailTitle','detailTitleSkeleton');
  $('detailMeta').textContent=`${data.arti} · ${data.tempatTurun} · ${data.jumlahAyat} ayat`;reveal('detailMeta','detailMetaSkeleton');
  $('detailArabicName').textContent=data.nama;
  $('detailArab').textContent=verse.teksArab;reveal('detailArab','detailArabSkeleton');
  $('detailLatin').innerHTML=verse.teksLatin||'';reveal('detailLatin','detailLatinSkeleton');
  $('artiText').textContent=verse.teksIndonesia||'';reveal('artiText','artiSkeleton');
  $('detailJump').innerHTML=data.ayat.map(v=>`<option value="${v.nomorAyat}" ${v.nomorAyat===n?'selected':''}>Ayat ${v.nomorAyat}</option>`).join('');
  $('detailJump').onchange=e=>location.href=`ayat-v5.html?surah=${sid}&ayat=${e.target.value}`;
  setNav(n);setupAudio();
  localStorage.setItem('l6q-last',JSON.stringify({surah:sid,ayat:n,name}));
  if(window.lucide)lucide.createIcons();
}

async function loadTafsir(){
  try{
    const tr=await fetch(`${API}/tafsir/${sid}`);
    if(!tr.ok)throw new Error('tafsir');
    const tj=await tr.json();
    const taf=(tj?.data?.tafsir||[]).find(x=>x.ayat===verse.nomorAyat);
    $('tafsirText').textContent=taf?.teks||'Tafsir belum tersedia untuk ayat ini dari sumber API.';
  }catch(e){
    $('tafsirText').textContent='Tafsir sedang tidak dapat dimuat. Silakan coba kembali.';
  }finally{
    reveal('tafsirText','tafsirSkeleton');
  }
}

function setNav(n){
  if(n>1){$('prevAyat').href=`ayat-v5.html?surah=${sid}&ayat=${n-1}`;$('prevAyatLabel').textContent=`${data.namaLatin} ${n-1}`}
  else if(data.suratSebelumnya&&typeof data.suratSebelumnya==='object'){
    const prevLast=data.suratSebelumnya.jumlahAyat||1;$('prevAyat').href=`ayat-v5.html?surah=${data.suratSebelumnya.nomor}&ayat=${prevLast}`;$('prevAyatLabel').textContent=`${data.suratSebelumnya.namaLatin} ${prevLast}`
  }else $('prevAyat').style.visibility='hidden';
  if(n<data.jumlahAyat){$('nextAyat').href=`ayat-v5.html?surah=${sid}&ayat=${n+1}`;$('nextAyatLabel').textContent=`${data.namaLatin} ${n+1}`}
  else if(data.suratSelanjutnya&&typeof data.suratSelanjutnya==='object'){$('nextAyat').href=`ayat-v5.html?surah=${data.suratSelanjutnya.nomor}&ayat=1`;$('nextAyatLabel').textContent=`${data.suratSelanjutnya.namaLatin} 1`}
  else $('nextAyat').style.visibility='hidden';
}

function ensureDetailAudioDock(){
  let dock=$('detailAudioDock');
  if(dock)return dock;
  dock=document.createElement('div');dock.id='detailAudioDock';dock.className='detail-audio-dock';
  dock.innerHTML=`<button type="button" id="detailAudioToggle" class="detail-audio-toggle" aria-label="Jeda audio"><i data-lucide="pause" class="icon"></i></button><div class="detail-audio-info"><div id="detailAudioTitle" class="detail-audio-title"></div><div id="detailAudioSub" class="detail-audio-sub">Misyari Rasyid Al-Afasy</div><div class="detail-audio-progress"><span id="detailAudioProgress"></span></div></div><button type="button" id="detailAudioClose" class="detail-audio-close" aria-label="Tutup pemutar"><i data-lucide="x" class="icon"></i></button>`;
  document.body.appendChild(dock);if(window.lucide)lucide.createIcons();return dock;
}
function syncDetailPlayButton(isPlaying){const btn=$('playAyatBtn');if(!btn)return;btn.innerHTML=`<i data-lucide="${isPlaying?'pause':'play'}" class="icon"></i>${isPlaying?'Jeda':'Putar'}`;btn.setAttribute('aria-pressed',isPlaying?'true':'false');if(window.lucide)lucide.createIcons()}
function setupAudio(){
  const src=(verse.audio||{})[qari]||Object.values(verse.audio||{})[0];
  const btn=$('playAyatBtn');
  btn.onclick=()=>{
    if(!src)return;
    let a=$('detailAudio');
    if(!a){a=document.createElement('audio');a.id='detailAudio';a.src=src;a.preload='none';document.body.appendChild(a)}
    const dock=ensureDetailAudioDock();
    $('detailAudioTitle').textContent=`${data.namaLatin} · Ayat ${verse.nomorAyat}`;
    dock.classList.add('show');
    if(a.paused){a.play();syncDetailPlayButton(true);$('detailAudioToggle').innerHTML='<i data-lucide="pause" class="icon"></i>'}
    else{a.pause();syncDetailPlayButton(false);$('detailAudioToggle').innerHTML='<i data-lucide="play" class="icon"></i>'}
    $('detailAudioToggle').onclick=()=>{if(a.paused){a.play();syncDetailPlayButton(true);$('detailAudioToggle').innerHTML='<i data-lucide="pause" class="icon"></i>'}else{a.pause();syncDetailPlayButton(false);$('detailAudioToggle').innerHTML='<i data-lucide="play" class="icon"></i>'}if(window.lucide)lucide.createIcons()};
    $('detailAudioClose').onclick=()=>{a.pause();dock.classList.remove('show');syncDetailPlayButton(false)};
    a.ontimeupdate=()=>{$('detailAudioProgress').style.width=(a.duration?a.currentTime/a.duration*100:0)+'%'};
    a.onended=()=>{syncDetailPlayButton(false);$('detailAudioToggle').innerHTML='<i data-lucide="play" class="icon"></i>';if(window.lucide)lucide.createIcons()};
    if(window.lucide)lucide.createIcons();
  };
  $('shareAyatBtn').onclick=async()=>{
    const text=`${data.namaLatin} ${verse.nomorAyat}\n${verse.teksArab}\n${verse.teksIndonesia}`;
    try{if(navigator.share)await navigator.share({title:`${data.namaLatin} ayat ${verse.nomorAyat}`,text,url:location.href});else await navigator.clipboard.writeText(text)}catch(e){}
  };
}

function loadEnhancements(){
  if(!window.__l6QuranGlobalShell&&!window.__l6QuranGlobalShellRequested){window.__l6QuranGlobalShellRequested=true;const s=document.createElement('script');s.src='quran-global-shell.js?v=2';s.defer=true;document.body.appendChild(s)}
  const enhance=document.createElement('script');enhance.src='ayat-reader-enhance.js?v=3';enhance.defer=true;document.body.appendChild(enhance);
  const polish=document.createElement('script');polish.src='ayat-detail-polish.js?v=1';polish.defer=true;document.body.appendChild(polish);
}

function loadShareMedia(){
  if(window.__l6ShareMediaRequested)return;window.__l6ShareMediaRequested=true;
  const css=document.createElement('link');css.rel='stylesheet';css.href='share-media.css?v=1';document.head.appendChild(css);
  const canvas=document.createElement('script');canvas.src='https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';canvas.async=true;
  canvas.onload=()=>{const share=document.createElement('script');share.src='share-media.js?v=1';share.async=true;document.body.appendChild(share)};
  document.body.appendChild(canvas);
}

init();
if(window.lucide)lucide.createIcons();
loadEnhancements();
if('requestIdleCallback'in window)requestIdleCallback(loadShareMedia,{timeout:5000});else setTimeout(loadShareMedia,3500);
