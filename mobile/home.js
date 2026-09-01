const API='https://equran.id/api/v2';
const PAGE_SIZE=12;
let allSurah=[],visibleCount=PAGE_SIZE,activeFilter='Semua';
const $=id=>document.getElementById(id);

function normalizeType(value=''){const v=String(value).toLowerCase();if(v.includes('mad'))return'Madaniyah';return'Makkiyah'}
function surahHref(id){return`./surah.html?surah=${id}`}
function ayatHref(s,a){return`./ayat.html?surah=${s}&ayat=${a}`}
function renderIcons(){if(window.lucide)window.lucide.createIcons()}

function restoreLastRead(){
  try{
    const last=JSON.parse(localStorage.getItem('l6q-last')||'null');
    if(!last)return;
    const surah=Math.min(114,Math.max(1,+last.surah||1));
    const ayat=Math.max(1,+last.ayat||1);
    $('continueTitle').textContent=last.name||`Surah ${surah}`;
    $('continueMeta').textContent=`Ayat ${ayat} · Kembali ke bacaan terakhir`;
    $('continueCard').href=ayatHref(surah,ayat);
  }catch(e){}
}

function getFiltered(){return allSurah.filter(s=>activeFilter==='Semua'||normalizeType(s.tempatTurun)===activeFilter)}
function renderSurah(){
  const data=getFiltered(),list=data.slice(0,visibleCount);
  $('surahList').innerHTML=list.map(s=>`<a class="surah-item" href="${surahHref(s.nomor)}"><span class="surah-number">${s.nomor}</span><span class="surah-copy"><strong>${s.namaLatin}</strong><span>${normalizeType(s.tempatTurun)} · ${s.jumlahAyat} ayat</span></span><span class="surah-arabic"><b lang="ar" dir="rtl">${s.nama}</b><span>${s.arti}</span></span></a>`).join('');
  $('loadMore').hidden=list.length>=data.length;
}

async function loadSurah(){
  try{
    const res=await fetch(`${API}/surat`);
    if(!res.ok)throw new Error('surah');
    const json=await res.json();allSurah=json.data||[];renderSurah();
  }catch(e){$('surahList').innerHTML='<div class="search-result">Daftar surah belum dapat dimuat. Silakan refresh halaman.</div>'}
}

function setupFilters(){
  $('filterButton').onclick=()=>{const open=$('filterPanel').hidden;$('filterPanel').hidden=!open;$('filterButton').setAttribute('aria-expanded',String(open))};
  $('filterPanel').addEventListener('click',e=>{const btn=e.target.closest('button[data-filter]');if(!btn)return;activeFilter=btn.dataset.filter;visibleCount=PAGE_SIZE;$('filterPanel').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===btn));renderSurah()});
  $('loadMore').onclick=()=>{visibleCount+=PAGE_SIZE;renderSurah()};
}

function findMatches(query){
  const q=query.trim();if(!q)return[];
  const verse=q.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
  if(verse){const s=Math.min(114,Math.max(1,+verse[1])),a=Math.max(1,+verse[2]);const meta=allSurah.find(x=>x.nomor===s);return[{title:`${meta?.namaLatin||`Surah ${s}`} Ayat ${a}`,meta:'Buka detail ayat',href:ayatHref(s,a)}]}
  const low=q.toLowerCase();
  return allSurah.filter(s=>s.namaLatin.toLowerCase().includes(low)||String(s.arti||'').toLowerCase().includes(low)).slice(0,5).map(s=>({title:s.namaLatin,meta:`${normalizeType(s.tempatTurun)} · ${s.jumlahAyat} ayat`,href:surahHref(s.nomor)}));
}
function showSearch(query){
  const box=$('searchResults'),matches=findMatches(query);box.hidden=false;
  box.innerHTML=matches.length?matches.map(x=>`<a class="search-result" href="${x.href}"><span><strong>${x.title}</strong><br><small>${x.meta}</small></span><i data-lucide="chevron-right"></i></a>`).join(''):'<div class="search-result">Surah atau ayat belum ditemukan.</div>';
  renderIcons();
}
function setupSearch(){
  $('searchForm').addEventListener('submit',e=>{e.preventDefault();showSearch($('searchInput').value)});
  document.querySelectorAll('[data-query]').forEach(btn=>btn.onclick=()=>{$('searchInput').value=btn.dataset.query;showSearch(btn.dataset.query)});
}

document.addEventListener('DOMContentLoaded',()=>{restoreLastRead();setupFilters();setupSearch();loadSurah();renderIcons()});