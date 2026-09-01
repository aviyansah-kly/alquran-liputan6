const API='https://equran.id/api/v2';
const params=new URLSearchParams(location.search);
const sid=Math.min(114,Math.max(1,parseInt(params.get('surah')||'1',10)||1));
const requestedAyat=Math.max(1,parseInt(params.get('ayat')||'1',10)||1);
const qari='05';
let data=null,verse=null,prevHref='',nextHref='';
const $=id=>document.getElementById(id);
const icons=()=>{if(window.lucide)lucide.createIcons()};
const glyph=id=>`surah${String(id).padStart(3,'0')}`;

function splitReadableParagraphs(text){
  const clean=String(text||'').replace(/\r/g,'').replace(/[ \t]+/g,' ').trim();
  if(!clean)return [];
  const explicit=clean.split(/\n\s*\n|\n(?=\S)/).map(x=>x.trim()).filter(Boolean);
  if(explicit.length>1)return explicit;
  const sentences=(clean.match(/[^.!?]+[.!?]+[”’"')\]]*|[^.!?]+$/g)||[clean]).map(x=>x.trim()).filter(Boolean);
  const out=[];let current='';
  for(const sentence of sentences){const candidate=current?`${current} ${sentence}`:sentence;if(current&&candidate.length>430){out.push(current);current=sentence}else current=candidate}
  if(current)out.push(current);return out;
}
function typeLabel(x){return String(x||'').toLowerCase()==='mekah'?'Makkiyah':'Madaniyah'}
function renderTafsir(parts){const box=$('tafsirText');box.textContent='';parts.forEach(text=>{const p=document.createElement('p');p.textContent=text;box.appendChild(p)})}

function renderCore(){
  const n=verse.nomorAyat,name=data.namaLatin;
  document.title=`${name} Ayat ${n}: Arti, Tafsir dan Penjelasan | Liputan6 Quran`;
  document.querySelector('meta[name="description"]').content=`Baca ${name} ayat ${n} lengkap dengan arti Bahasa Indonesia, tafsir, poin penting, Asbabun Nuzul dan FAQ.`;
  $('surahCrumb').textContent=name;$('surahCrumb').href=`./surah.html?surah=${sid}`;
  $('ayatCrumb').textContent=`Ayat ${n}`;$('backSurah').href=`./surah.html?surah=${sid}&ayat=${n}`;
  $('ayatKicker').textContent=`SURAH KE-${sid} · AYAT ${n}`;$('detailTitle').textContent=`${name} Ayat ${n}`;
  $('detailMeta').textContent=`${data.arti} · ${typeLabel(data.tempatTurun)} · ${data.jumlahAyat} ayat`;$('detailArabicName').textContent=glyph(sid);
  $('verseNumber').textContent=n;$('detailArab').textContent=verse.teksArab;$('detailLatin').innerHTML=verse.teksLatin||'';$('artiText').textContent=verse.teksIndonesia||'';
  $('stickyEyebrow').textContent=`Surah ${sid} · Ayat ${n}`;$('stickyName').textContent=name;
  $('detailJump').innerHTML=data.ayat.map(v=>`<option value="${v.nomorAyat}"${v.nomorAyat===n?' selected':''}>Ayat ${v.nomorAyat}</option>`).join('');
  localStorage.setItem('l6q-last',JSON.stringify({surah:sid,ayat:n,name}));setNav(n);setupAudio();restoreBookmark();icons();
}
function setNav(n){
  if(n>1){prevHref=`./ayat.html?surah=${sid}&ayat=${n-1}`;$('prevAyatLabel').textContent=`${data.namaLatin} ${n-1}`}
  else if(data.suratSebelumnya&&typeof data.suratSebelumnya==='object'){const last=data.suratSebelumnya.jumlahAyat||1;prevHref=`./ayat.html?surah=${data.suratSebelumnya.nomor}&ayat=${last}`;$('prevAyatLabel').textContent=`${data.suratSebelumnya.namaLatin} ${last}`}
  if(n<data.jumlahAyat){nextHref=`./ayat.html?surah=${sid}&ayat=${n+1}`;$('nextAyatLabel').textContent=`${data.namaLatin} ${n+1}`}
  else if(data.suratSelanjutnya&&typeof data.suratSelanjutnya==='object'){nextHref=`./ayat.html?surah=${data.suratSelanjutnya.nomor}&ayat=1`;$('nextAyatLabel').textContent=`${data.suratSelanjutnya.namaLatin} 1`}
  const prev=$('prevAyat'),next=$('nextAyat');
  if(prevHref){prev.href=prevHref;$('prevSticky').disabled=false}else{prev.hidden=true;$('prevSticky').disabled=true}
  if(nextHref){next.href=nextHref;$('nextSticky').disabled=false}else{next.hidden=true;$('nextSticky').disabled=true}
  $('prevSticky').title=$('prevAyatLabel').textContent?`Sebelumnya: ${$('prevAyatLabel').textContent}`:'Ayat sebelumnya';$('nextSticky').title=$('nextAyatLabel').textContent?`Berikutnya: ${$('nextAyatLabel').textContent}`:'Ayat berikutnya';
}
function setupAudio(){
  const src=(verse.audio||{})[qari]||Object.values(verse.audio||{})[0]||'';const audio=$('detailAudio'),dock=$('detailAudioDock'),play=$('stickyPlay'),toggle=$('detailAudioToggle');if(src)audio.src=src;
  const sync=playing=>{play.innerHTML=`<i data-lucide="${playing?'pause':'play'}"></i>`;play.setAttribute('aria-label',playing?'Jeda ayat':'Putar ayat');play.setAttribute('aria-pressed',playing?'true':'false');toggle.innerHTML=`<i data-lucide="${playing?'pause':'play'}"></i>`;icons()};
  const playToggle=()=>{if(!src)return;$('detailAudioTitle').textContent=`${data.namaLatin} · Ayat ${verse.nomorAyat}`;dock.hidden=false;if(audio.paused){audio.play();sync(true)}else{audio.pause();sync(false)}};
  play.onclick=playToggle;toggle.onclick=playToggle;$('detailAudioClose').onclick=()=>{audio.pause();dock.hidden=true;sync(false)};audio.ontimeupdate=()=>{$('detailAudioProgress').style.width=(audio.duration?audio.currentTime/audio.duration*100:0)+'%'};audio.onended=()=>sync(false);
}
function restoreBookmark(){if(localStorage.getItem(`l6q-bookmark-${sid}-${verse.nomorAyat}`)==='1')$('saveAyatBtn').classList.add('active')}
function saveAyat(){const key=`l6q-bookmark-${sid}-${verse.nomorAyat}`,btn=$('saveAyatBtn');if(localStorage.getItem(key)==='1'){localStorage.removeItem(key);btn.classList.remove('active')}else{localStorage.setItem(key,'1');btn.classList.add('active')}}
async function shareAyat(){const text=`${data.namaLatin} ${verse.nomorAyat}\n${verse.teksArab}\n${verse.teksIndonesia}`;try{if(navigator.share)await navigator.share({title:`${data.namaLatin} ayat ${verse.nomorAyat}`,text,url:location.href});else await navigator.clipboard.writeText(text)}catch(e){}}
async function loadTafsir(){try{const r=await fetch(`${API}/tafsir/${sid}`);if(!r.ok)throw new Error('tafsir');const j=await r.json();const taf=(j?.data?.tafsir||[]).find(x=>x.ayat===verse.nomorAyat);renderTafsir(splitReadableParagraphs(taf?.teks||'Tafsir belum tersedia untuk ayat ini dari sumber API.'))}catch(e){renderTafsir(['Tafsir sedang tidak dapat dimuat. Silakan coba kembali.'])}}
function bindControls(){
  $('detailJump').onchange=e=>{const n=+e.target.value;if(n)location.href=`./ayat.html?surah=${sid}&ayat=${n}`};$('sectionJump').onchange=e=>document.getElementById(e.target.value)?.scrollIntoView({behavior:'smooth',block:'start'});
  $('prevSticky').onclick=()=>{if(prevHref)location.href=prevHref};$('nextSticky').onclick=()=>{if(nextHref)location.href=nextHref};$('saveAyatBtn').onclick=saveAyat;$('shareAyatBtn').onclick=shareAyat;
  const sections=['arti','tafsir','poin-penting','asbabun-nuzul','faq'];const syncSection=()=>{let active='arti';for(const id of sections){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=205)active=id;else if(el)break}$('sectionJump').value=active};window.addEventListener('scroll',syncSection,{passive:true});syncSection();
}
async function init(){bindControls();icons();try{const r=await fetch(`${API}/surat/${sid}`);if(!r.ok)throw new Error('surat');const j=await r.json();data=j.data;verse=data.ayat.find(v=>v.nomorAyat===requestedAyat)||data.ayat[0];renderCore();loadTafsir()}catch(e){$('detailTitle').textContent='Data ayat belum dapat dimuat';$('detailMeta').textContent='Silakan periksa koneksi dan coba lagi.';$('detailArab').textContent='';$('detailLatin').textContent='';$('artiText').textContent='Data ayat belum tersedia.';renderTafsir(['Tafsir belum dapat dimuat.'])}}
document.addEventListener('DOMContentLoaded',init);