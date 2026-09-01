const style=document.createElement('style');style.textContent='.surah-copy strong{font-size:16px}.surah-arabic b{font-size:40px}@media(max-width:350px){.surah-arabic b{font-size:36px}}';document.head.appendChild(style);
const API='https://equran.id/api/v2';
const PAGE_SIZE=12;
let allSurah=[],visibleCount=PAGE_SIZE,activeFilter='Semua';
const $=id=>document.getElementById(id);

function normalizeType(value=''){const v=String(value).toLowerCase();if(v.includes('mad'))return'Madaniyah';return'Makkiyah'}
function surahHref(id){return`./surah.html?surah=${id}`}
function ayatHref(s,a){return`./ayat.html?surah=${s}&ayat=${a}`}
function surahGlyph(id){return`surah${String(id).padStart(3,'0')}`}
function renderIcons(){if(window.lucide)window.lucide.createIcons()}
function escapeHtml(x=''){return String(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[m]))}

function restoreLastRead(){
  try{
    const last=JSON.parse(localStorage.getItem('l6q-last')||'null');
    if(!last)return;
    const surah=Math.min(114,Math.max(1,+last.surah||1));
    const ayat=Math.max(1,+last.ayat||1);
    $('continueMeta').textContent=`${last.name||`Surah ${surah}`} · Ayat ${ayat}`;
    $('continueCard').href=ayatHref(surah,ayat);
  }catch(e){}
}

function getFiltered(){return allSurah.filter(s=>activeFilter==='Semua'||normalizeType(s.tempatTurun)===activeFilter)}
function renderSurah(){
  const data=getFiltered(),list=data.slice(0,visibleCount);
  $('surahList').innerHTML=list.map(s=>`<a class="surah-item" href="${surahHref(s.nomor)}"><span class="surah-number">${String(s.nomor).padStart(2,'0')}</span><span class="surah-copy"><strong>${escapeHtml(s.namaLatin)}</strong><span>${escapeHtml(s.arti)}<br>${s.jumlahAyat} Ayat · ${normalizeType(s.tempatTurun)}</span></span><span class="surah-arabic"><b aria-label="${escapeHtml(s.namaLatin)}">${surahGlyph(s.nomor)}</b></span></a>`).join('');
  $('surahCount').textContent=`${data.length} surah`;
  $('loadMore').hidden=list.length>=data.length;
}

async function loadSurah(){
  try{
    const res=await fetch(`${API}/surat`);
    if(!res.ok)throw new Error('surah');
    const json=await res.json();allSurah=json.data||[];renderSurah();
  }catch(e){$('surahList').innerHTML='<div class="search-result">Daftar surah belum dapat dimuat. Silakan refresh halaman.</div>';$('surahCount').textContent='API tidak tersedia'}
}

function setupFilters(){
  $('filterPanel').addEventListener('click',e=>{const btn=e.target.closest('button[data-filter]');if(!btn)return;activeFilter=btn.dataset.filter;visibleCount=PAGE_SIZE;$('filterPanel').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===btn));renderSurah()});
  $('loadMore').onclick=()=>{visibleCount+=PAGE_SIZE;renderSurah()};
}

function localMatches(query){const low=query.toLowerCase();return allSurah.filter(s=>`${s.nomor} ${s.namaLatin} ${s.arti} ${s.nama}`.toLowerCase().includes(low)).slice(0,6)}
function resultLink(title,meta,href){return`<a class="search-result" href="${href}"><span><strong>${escapeHtml(title)}</strong><br><small>${escapeHtml(meta)}</small></span><i data-lucide="chevron-right"></i></a>`}
function vectorRow(x){const d=x.data||{},sid=d.id_surat||d.nomor_surat,ay=d.nomor_ayat||d.ayat;const title=x.tipe==='tafsir'?`Tafsir ${d.nama_surat||'Surah'} · Ayat ${ay}`:`${d.nama_surat||'Surah'} · Ayat ${ay}`;const sub=x.tipe==='tafsir'?(d.isi||''):(d.terjemahan_id||d.teks_latin||'');return resultLink(title,String(sub).slice(0,150),ayatHref(sid,ay))}
async function showSearch(query){
  const q=query.trim(),box=$('searchResults');if(!q)return;
  const verse=q.match(/^\s*(\d{1,3})\s*[:.]\s*(\d{1,3})\s*$/);
  if(verse){location.href=ayatHref(Math.min(114,Math.max(1,+verse[1])),Math.max(1,+verse[2]));return}
  const local=localMatches(q);box.hidden=false;
  if(local.length){box.innerHTML=local.map(s=>resultLink(s.namaLatin,`${s.arti} · ${s.jumlahAyat} Ayat · ${normalizeType(s.tempatTurun)}`,surahHref(s.nomor))).join('');renderIcons();return}
  box.innerHTML='<div class="search-result">Mencari ayat dan tafsir yang paling relevan...</div>';
  try{
    const r=await fetch('https://equran.id/api/vector',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q,limit:6,types:['ayat','tafsir'],minScore:.25})});
    if(!r.ok)throw new Error('search');const j=await r.json(),rows=j.hasil||[];
    box.innerHTML=rows.length?rows.map(vectorRow).join(''):'<div class="search-result">Belum menemukan hasil. Coba kata yang lebih sederhana.</div>';
  }catch(e){box.innerHTML='<div class="search-result">Pencarian topik sedang tidak tersedia. Anda tetap dapat mencari nama atau nomor surah.</div>'}
  renderIcons();
}
function setupSearch(){
  $('searchForm').addEventListener('submit',e=>{e.preventDefault();showSearch($('searchInput').value)});
  document.querySelectorAll('[data-query]').forEach(btn=>btn.onclick=()=>{$('searchInput').value=btn.dataset.query;showSearch(btn.dataset.query)});
}

document.addEventListener('DOMContentLoaded',()=>{restoreLastRead();setupFilters();setupSearch();loadSurah();renderIcons()});