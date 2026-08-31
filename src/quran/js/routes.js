window.QuranRoutes=Object.freeze({
  home:()=>'/prototype-v6.html',
  surah:(surah,ayat)=>ayat?`/surah-v4.html?surah=${surah}&ayat=${ayat}`:`/surah-v4.html?surah=${surah}`,
  ayat:(surah,ayat)=>`/ayat-v5.html?surah=${surah}&ayat=${ayat}`
});
