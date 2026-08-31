window.QuranRoutes=Object.freeze({
  home:()=>'/prototype-v6',
  surah:(surah,ayat)=>ayat?`/surah-v6?surah=${surah}&ayat=${ayat}`:`/surah-v6?surah=${surah}`,
  ayat:(surah,ayat)=>`/ayat-v6?surah=${surah}&ayat=${ayat}`
});
