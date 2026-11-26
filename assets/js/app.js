const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const storeKey = "arabiaQuestProgressV1";
const defaultState = {name:"Penjelajah", kelas:"VII", xp:0, streak:1, completed:[], badges:[], history:[], dailyDone:false, favorites:[]};
let state = loadState();
function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(storeKey)||"{}")}}catch{return {...defaultState}}}
function save(){localStorage.setItem(storeKey,JSON.stringify(state));renderStats()}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2200)}
const lessons = [
 {id:"intro",kelas:"VII",title:"التعارف",sub:"Perkenalan",desc:"Menyapa, memperkenalkan diri, dan menanyakan nama.",icon:"👋",color:"#f1edff",arabic:"السَّلَامُ عَلَيْكُمْ",meaning:"Semoga keselamatan tercurah kepadamu.",words:[["اِسْمٌ","Nama"],["أَنَا","Saya"],["مَا اسْمُكَ؟","Siapa namamu?"]],example:"اِسْمِي أَحْمَدُ",translation:"Nama saya Ahmad."},
 {id:"family",kelas:"VII",title:"الأسرة",sub:"Keluarga",desc:"Mengenal anggota keluarga dan hubungan kekerabatan.",icon:"👨‍👩‍👧",color:"#fff0e6",arabic:"هَذِهِ أُسْرَتِي",meaning:"Ini keluargaku.",words:[["أَبٌ","Ayah"],["أُمٌّ","Ibu"],["أَخٌ","Saudara laki-laki"],["أُخْتٌ","Saudara perempuan"]],example:"هَذَا أَبِي",translation:"Ini ayahku."},
 {id:"school",kelas:"VII",title:"المدرسة",sub:"Sekolah",desc:"Mengenal benda, tempat, dan aktivitas di sekolah.",icon:"🏫",color:"#eaf4ff",arabic:"هَذِهِ مَدْرَسَتِي",meaning:"Ini sekolahku.",words:[["مَدْرَسَةٌ","Sekolah"],["كِتَابٌ","Buku"],["قَلَمٌ","Pena"],["فَصْلٌ","Kelas"]],example:"هَذَا كِتَابٌ",translation:"Ini sebuah buku."},
 {id:"house",kelas:"VII",title:"البيت",sub:"Rumah",desc:"Menyebutkan ruangan dan benda di rumah.",icon:"🏠",color:"#e9f8f1",arabic:"هَذَا بَيْتِي",meaning:"Ini rumahku.",words:[["بَيْتٌ","Rumah"],["غُرْفَةٌ","Kamar"],["بَابٌ","Pintu"],["نَافِذَةٌ","Jendela"]],example:"الْبَيْتُ كَبِيرٌ",translation:"Rumah itu besar."},
 {id:"colors",kelas:"VII",title:"الألوان",sub:"Warna",desc:"Mengenal nama-nama warna dalam Bahasa Arab.",icon:"🎨",color:"#fff6dc",arabic:"اللَّوْنُ أَحْمَرُ",meaning:"Warnanya merah.",words:[["أَحْمَرُ","Merah"],["أَزْرَقُ","Biru"],["أَخْضَرُ","Hijau"],["أَصْفَرُ","Kuning"]],example:"الْكِتَابُ أَحْمَرُ",translation:"Buku itu berwarna merah."},
 {id:"numbers",kelas:"VII",title:"الأعداد",sub:"Angka",desc:"Mengenal angka satu sampai sepuluh.",icon:"🔢",color:"#f0edff",arabic:"وَاحِدٌ، اِثْنَانِ",meaning:"Satu, dua.",words:[["وَاحِدٌ","Satu"],["اِثْنَانِ","Dua"],["ثَلَاثَةٌ","Tiga"],["أَرْبَعَةٌ","Empat"]],example:"عِنْدِي ثَلَاثَةُ كُتُبٍ",translation:"Saya memiliki tiga buku."},
 {id:"profession",kelas:"VIII",title:"المهنة",sub:"Profesi",desc:"Menyebutkan pekerjaan dan cita-cita.",icon:"👩‍⚕️",color:"#eaf4ff",arabic:"أَنَا طَبِيبٌ",meaning:"Saya seorang dokter.",words:[["طَبِيبٌ","Dokter"],["مُعَلِّمٌ","Guru"],["مُهَنْدِسٌ","Insinyur"]],example:"أَبِي مُعَلِّمٌ",translation:"Ayahku seorang guru."},
 {id:"hobby",kelas:"VIII",title:"الهواية",sub:"Hobi",desc:"Menceritakan kegemaran dan aktivitas waktu luang.",icon:"⚽",color:"#e9f8f1",arabic:"هِوَايَتِي الْقِرَاءَةُ",meaning:"Hobiku membaca.",words:[["قِرَاءَةٌ","Membaca"],["كِتَابَةٌ","Menulis"],["رِيَاضَةٌ","Olahraga"]],example:"أُحِبُّ كُرَةَ الْقَدَمِ",translation:"Saya suka sepak bola."},
 {id:"food",kelas:"VIII",title:"الطعام والشراب",sub:"Makanan & Minuman",desc:"Mengenal makanan, minuman, dan ungkapan sederhana.",icon:"🍽️",color:"#fff0e6",arabic:"أُرِيدُ مَاءً",meaning:"Saya ingin air.",words:[["مَاءٌ","Air"],["خُبْزٌ","Roti"],["أَرُزٌّ","Nasi"]],example:"الطَّعَامُ لَذِيذٌ",translation:"Makanan itu lezat."},
 {id:"daily",kelas:"VIII",title:"الأنشطة اليومية",sub:"Kegiatan Harian",desc:"Menceritakan rutinitas sehari-hari.",icon:"⏰",color:"#fff6dc",arabic:"أَسْتَيْقِظُ صَبَاحًا",meaning:"Saya bangun pagi.",words:[["أَسْتَيْقِظُ","Saya bangun"],["أَدْرُسُ","Saya belajar"],["أَنَامُ","Saya tidur"]],example:"أَذْهَبُ إِلَى الْمَدْرَسَةِ",translation:"Saya pergi ke sekolah."},
 {id:"health",kelas:"IX",title:"الصحة",sub:"Kesehatan",desc:"Mengenal kosakata tubuh dan menjaga kesehatan.",icon:"🩺",color:"#e9f8f1",arabic:"الصِّحَّةُ مُهِمَّةٌ",meaning:"Kesehatan itu penting.",words:[["رَأْسٌ","Kepala"],["يَدٌ","Tangan"],["عَيْنٌ","Mata"]],example:"أَشْرَبُ الْمَاءَ",translation:"Saya minum air."},
 {id:"travel",kelas:"IX",title:"السفر",sub:"Perjalanan",desc:"Mengenal tempat dan ungkapan saat bepergian.",icon:"✈️",color:"#eaf4ff",arabic:"أُحِبُّ السَّفَرَ",meaning:"Saya suka bepergian.",words:[["مَطَارٌ","Bandara"],["حَقِيبَةٌ","Tas"],["سَفَرٌ","Perjalanan"]],example:"أُسَافِرُ إِلَى جَاكَرْتَا",translation:"Saya bepergian ke Jakarta."},
 {id:"environment",kelas:"IX",title:"البيئة",sub:"Lingkungan",desc:"Mengenal lingkungan dan ungkapan menjaga alam.",icon:"🌱",color:"#e9f8f1",arabic:"نُحَافِظُ عَلَى الْبِيئَةِ",meaning:"Kita menjaga lingkungan.",words:[["شَجَرَةٌ","Pohon"],["مَاءٌ","Air"],["هَوَاءٌ","Udara"]],example:"الْبِيئَةُ نَظِيفَةٌ",translation:"Lingkungan itu bersih."}
];
const vocab = [
 ["مَدْرَسَةٌ","Madrasatun","Sekolah","Sekolah"],["كِتَابٌ","Kitaabun","Buku","Sekolah"],["قَلَمٌ","Qalamun","Pena","Sekolah"],["فَصْلٌ","Faslun","Kelas","Sekolah"],
 ["أَبٌ","Abun","Ayah","Keluarga"],["أُمٌّ","Ummun","Ibu","Keluarga"],["أَخٌ","Akhun","Saudara laki-laki","Keluarga"],["أُخْتٌ","Ukhtun","Saudara perempuan","Keluarga"],
 ["بَيْتٌ","Baitun","Rumah","Rumah"],["بَابٌ","Baabun","Pintu","Rumah"],["غُرْفَةٌ","Ghurfatun","Kamar","Rumah"],["نَافِذَةٌ","Naafidzatun","Jendela","Rumah"],
 ["اِسْمٌ","Ismun","Nama","Perkenalan"],["أَنَا","Anaa","Saya","Perkenalan"],["صَدِيقٌ","Shadiiqun","Teman","Perkenalan"],["مَرْحَبًا","Marhaban","Halo","Perkenalan"],
 ["أَحْمَرُ","Ahmaru","Merah","Warna"],["أَزْرَقُ","Azraqu","Biru","Warna"],["أَخْضَرُ","Akhdharu","Hijau","Warna"],["أَصْفَرُ","Ashfaru","Kuning","Warna"]
];
const worlds = [
 ["عالم الحروف","Dunia Huruf","Kenali huruf hijaiyah dan bunyi dasar.","🔠","#f0edff", "VII"],
 ["عالم التعارف","Dunia Perkenalan","Belajar menyapa dan memperkenalkan diri.","👋","#fff0e6","VII"],
 ["عالم المدرسة","Dunia Sekolah","Jelajahi kosakata benda dan tempat di sekolah.","🏫","#eaf4ff","VII"],
 ["عالم الأسرة","Dunia Keluarga","Ceritakan anggota keluarga dalam Bahasa Arab.","👨‍👩‍👧","#e9f8f1","VII"],
 ["عالم المنزل","Dunia Rumah","Kenali ruangan dan benda di rumah.","🏠","#fff6dc","VIII"],
 ["عالم الحياة اليومية","Dunia Sehari-hari","Ceritakan aktivitas dan rutinitasmu.","⏰","#f0edff","IX"]
];
const badgeDefs = [
 ["🌱","Langkah Pertama","Selesaikan satu materi." ,s=>s.completed.length>=1],
 ["📚","Pencinta Ilmu","Selesaikan 3 materi.",s=>s.completed.length>=3],
 ["⚡","Pengumpul XP","Kumpulkan 100 XP.",s=>s.xp>=100],
 ["🏆","Quiz Champion","Raih nilai kuis minimal 80.",s=>s.history.some(h=>h.score>=80)],
 ["🧩","Game Explorer","Selesaikan 2 permainan.",s=>(s.games||0)>=2],
 ["🌟","Arabic Explorer","Selesaikan 6 materi.",s=>s.completed.length>=6]
];
const quizQuestions = [
 {q:"Apa arti kata مَدْرَسَةٌ?",a:["Rumah","Sekolah","Buku","Pintu"],c:1,why:"مَدْرَسَةٌ berarti sekolah.",topic:"Kosakata sekolah"},
 {q:"Bahasa Arab dari 'Ibu' adalah ...",a:["أَبٌ","أَخٌ","أُمٌّ","أُخْتٌ"],c:2,why:"أُمٌّ berarti ibu.",topic:"Keluarga"},
 {q:"Apa arti مَاءٌ?",a:["Air","Roti","Nasi","Susu"],c:0,why:"مَاءٌ berarti air.",topic:"Makanan dan minuman"},
 {q:"Kalimat أَنَا طَالِبٌ berarti ...",a:["Saya guru","Saya siswa","Ini buku","Dia dokter"],c:1,why:"أَنَا طَالِبٌ berarti saya seorang siswa.",topic:"Perkenalan"},
 {q:"Bahasa Arab dari 'merah' adalah ...",a:["أَزْرَقُ","أَخْضَرُ","أَصْفَرُ","أَحْمَرُ"],c:3,why:"أَحْمَرُ berarti merah.",topic:"Warna"},
 {q:"Apa arti كِتَابٌ?",a:["Buku","Pena","Kelas","Sekolah"],c:0,why:"كِتَابٌ berarti buku.",topic:"Kosakata sekolah"},
 {q:"هَذَا أَبِي berarti ...",a:["Ini ibuku","Ini ayahku","Ini saudaraku","Ini temanku"],c:1,why:"هَذَا أَبِي berarti ini ayahku.",topic:"Keluarga"},
 {q:"Bahasa Arab dari 'rumah' adalah ...",a:["مَدْرَسَةٌ","بَيْتٌ","مَسْجِدٌ","فَصْلٌ"],c:1,why:"بَيْتٌ berarti rumah.",topic:"Rumah"},
 {q:"Kata أَنَا mempunyai arti ...",a:["Kamu","Dia","Saya","Mereka"],c:2,why:"أَنَا adalah dhamir orang pertama tunggal: saya.",topic:"Dhamir"},
 {q:"Manakah yang termasuk kata benda (isim)?",a:["يَكْتُبُ","مِنْ","كِتَابٌ","إِلَى"],c:2,why:"كِتَابٌ adalah isim atau kata benda.",topic:"Tata bahasa"},
 {q:"Arti kalimat أُحِبُّ الْقِرَاءَةَ adalah ...",a:["Saya suka membaca","Saya pergi ke sekolah","Ini buku baru","Saya minum air"],c:0,why:"أُحِبُّ berarti saya suka, الْقِرَاءَةَ berarti membaca.",topic:"Hobi"},
 {q:"Bahasa Arab dari 'guru laki-laki' adalah ...",a:["طَبِيبٌ","مُعَلِّمٌ","طَالِبٌ","مُهَنْدِسٌ"],c:1,why:"مُعَلِّمٌ berarti guru laki-laki.",topic:"Profesi"},
 {q:"Apa arti الْيَوْمُ?",a:["Malam","Minggu","Hari","Bulan"],c:2,why:"الْيَوْمُ berarti hari.",topic:"Waktu"},
 {q:"Kata أَخٌ berarti ...",a:["Saudara laki-laki","Saudara perempuan","Ibu","Ayah"],c:0,why:"أَخٌ berarti saudara laki-laki.",topic:"Keluarga"},
 {q:"Bahasa Arab dari 'air' adalah ...",a:["خُبْزٌ","مَاءٌ","لَبَنٌ","تُفَّاحٌ"],c:1,why:"مَاءٌ berarti air.",topic:"Makanan dan minuman"},
 {q:"Manakah kalimat yang berarti 'Ini sebuah buku'?",a:["هَذَا كِتَابٌ","هَذِهِ مَدْرَسَةٌ","أَنَا طَالِبٌ","هَذَا بَيْتِي"],c:0,why:"هَذَا كِتَابٌ berarti ini sebuah buku.",topic:"Kalimat sederhana"},
 {q:"هَذِهِ digunakan untuk menunjuk ...",a:["Benda feminin dekat","Benda maskulin jauh","Orang pertama","Kata kerja lampau"],c:0,why:"هَذِهِ adalah isim isyarah untuk tunggal muannats dekat.",topic:"Tata bahasa"},
 {q:"Lawan kata كَبِيرٌ (besar) adalah ...",a:["طَوِيلٌ","جَدِيدٌ","صَغِيرٌ","جَمِيلٌ"],c:2,why:"صَغِيرٌ berarti kecil.",topic:"Kata sifat"},
 {q:"Bahasa Arab dari 'pohon' adalah ...",a:["شَجَرَةٌ","مَاءٌ","هَوَاءٌ","بَابٌ"],c:0,why:"شَجَرَةٌ berarti pohon.",topic:"Lingkungan"},
 {q:"Kalimat أَذْهَبُ إِلَى الْمَدْرَسَةِ berarti ...",a:["Saya membaca buku","Saya pergi ke sekolah","Saya di rumah","Saya suka olahraga"],c:1,why:"أَذْهَبُ إِلَى الْمَدْرَسَةِ berarti saya pergi ke sekolah.",topic:"Kegiatan harian"}
];
let currentClass="VII", quizIndex=0, quizScore=0, quizOrder=[], selectedMatch=null, matchFound=0;
function go(page){$$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));$$(".nav-link[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("#page-name").textContent=({home:"Beranda",map:"Peta Belajar",lessons:"Materi Belajar",vocab:"Kosakata",games:"Mini Games",quiz:"Kuis & Evaluasi",achievements:"Pencapaian",about:"Tentang"})[page]||"Beranda";$("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});if(page==="lessons")renderLessons();if(page==="vocab")renderVocab();if(page==="map")renderWorlds();if(page==="achievements")renderBadges();if(page==="quiz")renderHistory()}
function renderStats(){let pct=Math.min(100,Math.round(state.completed.length/6*100));$("#xp-count").textContent=state.xp;$("#streak-count").textContent=state.streak;$("#stat-xp").textContent=state.xp+" XP";$("#stat-streak").textContent=state.streak+" hari";$("#stat-lessons").textContent=state.completed.length+" materi";$("#stat-badges").textContent=state.badges.length+" badge";$("#side-progress").textContent=pct+"% perjalanan selesai";$(".quest-progress i").style.width=pct+"%";$("#home-progress").style.width=pct+"%";$("#home-progress-label").textContent=pct+"% selesai";$("#level-number").textContent=Math.floor(state.xp/100)+1;$("#level-title").textContent=state.xp>=500?"Arabic Master":state.xp>=200?"Arabic Adventurer":"Arabic Beginner";$("#level-progress").style.width=(state.xp%100)+"%";$("#level-xp").textContent=(state.xp%100)+" / 100 XP menuju level berikutnya";$("#student-name").textContent=state.name;$("#student-class").textContent="Siswa • Kelas "+state.kelas;$("#daily-check").textContent=state.dailyDone?"✓":"○";$("#stat-badges").textContent=state.badges.length+" badge"}
function checkBadges(){badgeDefs.forEach(([_,name,__,test])=>{if(test(state)&&!state.badges.includes(name)){state.badges.push(name);toast("Badge terbuka: "+name+"! 🏅")}})}
function addXP(n){state.xp+=n;checkBadges();save();toast("Keren! Kamu mendapatkan +"+n+" XP ⚡")}
function renderWorlds(){const root=$("#world-grid");root.innerHTML=worlds.map((w,i)=>{let unlocked=i===0||state.completed.length>=i;let done=i<state.completed.length;return `<article class="world-card ${unlocked?"":"locked"}"><div class="world-top"><div class="world-icon" style="background:${w[4]}">${w[3]}</div><span class="world-number">WORLD 0${i+1}</span></div><h3>${w[1]}</h3><div class="arabic">${w[0]}</div><p>${w[2]}</p><div class="world-foot"><small>${done?"✓ Terselesaikan":unlocked?"Level tersedia":"🔒 Terkunci"} • Kelas ${w[5]}</small><button data-world="${i}" ${unlocked?"":"disabled"}>${done?"Ulangi":"Jelajahi"} →</button></div></article>`}).join("")}
function renderLessons(){let list=lessons.filter(l=>l.kelas===currentClass);$("#lesson-count").textContent=list.length+" materi tersedia";$("#lesson-grid").innerHTML=list.map(l=>`<article class="lesson-card"><div class="lesson-visual" style="background:${l.color}">${l.icon}</div><span class="tag tag-purple">${l.kelas==="VII"?"PEMULA":l.kelas==="VIII"?"MENENGAH":"LANJUTAN"}</span><h3>${l.sub}</h3><div class="arabic">${l.title}</div><p>${l.desc}</p><div class="lesson-meta"><small>${state.completed.includes(l.id)?"✓ Selesai":"Materi • 5 menit"}</small><button data-lesson="${l.id}">${state.completed.includes(l.id)?"Pelajari lagi":"Mulai belajar"} →</button></div></article>`).join("")}
function openLesson(id){let l=lessons.find(x=>x.id===id);if(!l)return;let done=state.completed.includes(id);showModal(`<button class="modal-close" data-close>×</button><span class="tag tag-purple">${l.sub.toUpperCase()}</span><h2>${l.title}</h2><p>${l.desc}</p><div class="arabic">${l.arabic}</div><p><b>Artinya:</b> ${l.meaning}</p><h3 style="font-size:13px">Kosakata penting</h3><div class="option-list">${l.words.map(w=>`<div class="option-btn" style="display:flex;justify-content:space-between"><span class="arabic" style="font-size:19px">${w[0]}</span><b>${w[1]}</b></div>`).join("")}</div><div class="feedback good"><b>Contoh kalimat:</b><br><span class="arabic">${l.example}</span><br>${l.translation}</div><div class="lesson-tip"><b>Tips belajar:</b> Baca kosakata dengan suara lantang, dengarkan pelafalannya, lalu buat satu kalimat versimu sendiri.</div><div class="modal-actions"><button class="btn btn-yellow" id="complete-lesson">${done?"Sudah dipelajari ✓":"Tandai selesai +20 XP"}</button><button class="btn btn-outline" id="speak-lesson">🔊 Dengarkan</button></div>`);
$("#complete-lesson").onclick=()=>{if(!state.completed.includes(id)){state.completed.push(id);state.dailyDone=true;addXP(20)}else toast("Materi ini sudah pernah diselesaikan.");closeModal();renderLessons();renderWorlds()};$("#speak-lesson").onclick=()=>speak(l.arabic)}
function renderVocab(){let q=($("#vocab-search").value||"").toLowerCase(),cat=$("#vocab-category").value;let list=vocab.filter(v=>(cat==="all"||v[3]===cat)&&v.join(" ").toLowerCase().includes(q));$("#vocab-grid").innerHTML=list.map(v=>`<article class="vocab-card"><small>${v[3]}</small><div class="arabic">${v[0]}</div><b>${v[2]}</b><small>${v[1]}</small><div class="vocab-actions"><button data-speak="${v[0]}">🔊 Audio</button><button data-fav="${v[0]}">${state.favorites.includes(v[0])?"♥":"♡"}</button></div></article>`).join("")||'<div class="empty-state">Kosakata tidak ditemukan.</div>'}
function speak(text){
  if(!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)){
    toast("Browser ini belum mendukung fitur suara. Coba gunakan Google Chrome.");
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();

  const play = () => {
    const voices = synth.getVoices();
    const arabicVoice = voices.find(v => /^ar([_-]|$)/i.test(v.lang)) ||
                        voices.find(v => /arabic|العربية/i.test(v.name));
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.78;
    utterance.pitch = 1;
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    } else {
      const defaultVoice = voices.find(v => v.default) || voices[0];
      if (defaultVoice) utterance.voice = defaultVoice;
      toast("Suara Arab belum tersedia di perangkat. Memakai suara bawaan browser; hasil pelafalan bisa kurang tepat.");
    }
    utterance.onerror = () => toast("Audio gagal diputar. Periksa volume dan ketersediaan suara di perangkat.");
    synth.speak(utterance);
  };

  if (synth.getVoices().length) {
    play();
  } else {
    // Chrome kadang memuat daftar suara beberapa saat setelah halaman dibuka.
    let finished = false;
    const onVoices = () => {
      if (finished) return;
      finished = true;
      synth.removeEventListener("voiceschanged", onVoices);
      play();
    };
    synth.addEventListener("voiceschanged", onVoices);
    setTimeout(() => {
      if (!finished) {
        finished = true;
        synth.removeEventListener("voiceschanged", onVoices);
        play();
      }
    }, 1200);
  }
}
function showModal(html){$("#modal").innerHTML=html;$("#modal-backdrop").classList.add("show");$("#modal-backdrop").setAttribute("aria-hidden","false")}
function closeModal(){$("#modal-backdrop").classList.remove("show");$("#modal-backdrop").setAttribute("aria-hidden","true")}
function shuffle(items){return [...items].sort(()=>Math.random()-.5)}
function startQuiz(){quizIndex=0;quizScore=0;quizOrder=shuffle([...quizQuestions]).slice(0,5);showQuizQuestion()}
function showQuizQuestion(){let q=quizOrder[quizIndex];showModal(`<button class="modal-close" data-close>×</button><div class="quiz-topline"><b>KUIS BAHASA ARAB</b><span>${quizIndex+1} / ${quizOrder.length}</span></div><div class="quiz-progress"><i style="width:${quizIndex/quizOrder.length*100}%"></i></div><span class="eyebrow">PILIH JAWABAN YANG TEPAT • ${q.topic||"LATIHAN"}</span><h2>${q.q}</h2><div class="option-list">${q.a.map((a,i)=>`<button class="option-btn" data-answer="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join("")}</div><div id="quiz-feedback"></div>`);$$("[data-answer]").forEach(b=>b.onclick=()=>{if($("#quiz-feedback").dataset.answered)return;let chosen=+b.dataset.answer,correct=chosen===q.c;$("#quiz-feedback").dataset.answered="1";if(correct)quizScore++;b.classList.add(correct?"correct":"wrong");$$("[data-answer]")[q.c].classList.add("correct");$("#quiz-feedback").innerHTML=`<div class="feedback ${correct?"good":"bad"}">${correct?"Tepat sekali!":"Belum tepat."} ${q.why}</div><button class="btn btn-yellow" style="margin-top:12px" id="next-question">${quizIndex===quizOrder.length-1?"Lihat hasil":"Soal berikutnya →"}</button>`;$("#next-question").onclick=()=>{quizIndex++;if(quizIndex<quizOrder.length)showQuizQuestion();else finishQuiz()}})}
function finishQuiz(){let score=Math.round(quizScore/quizOrder.length*100);state.history.unshift({score,date:new Date().toLocaleDateString("id-ID")});state.history=state.history.slice(0,8);if(score>=80)addXP(30);else addXP(10);checkBadges();save();showModal(`<div style="text-align:center;padding:12px"><div style="font-size:58px">${score>=80?"🏆":"🌟"}</div><span class="eyebrow">HASIL KUIS</span><h2>${score>=80?"Luar biasa!":"Tetap semangat!"}</h2><div style="font-size:44px;font-weight:900;color:#7564d8">${score}</div><p>Kamu menjawab ${quizScore} dari ${quizOrder.length} soal dengan benar.</p><button class="btn btn-yellow" id="finish-quiz">Selesai</button></div>`);$("#finish-quiz").onclick=()=>{closeModal();renderHistory()}}
function renderHistory(){$("#quiz-history").innerHTML=state.history.length?state.history.map(h=>`<div class="history-item"><span>Kuis Bahasa Arab • ${h.date}</span><b>${h.score}/100</b></div>`).join(""):'<div class="empty-state">Belum ada riwayat kuis. Yuk, coba kuis pertamamu!</div>'}
function renderBadges(){$("#badge-total").textContent=state.badges.length+" dari "+badgeDefs.length+" badge";$("#badge-grid").innerHTML=badgeDefs.map(b=>{let unlocked=state.badges.includes(b[1]);return `<article class="badge-card ${unlocked?"unlocked":""}"><div class="badge-art">${b[0]}</div><h3>${b[1]}</h3><p>${b[2]}</p><span class="badge-status">${unlocked?"✓ TERBUKA":"🔒 BELUM TERBUKA"}</span></article>`}).join("")}
function startMatch(){let pairs=[["كِتَابٌ","Buku"],["بَيْتٌ","Rumah"],["مَاءٌ","Air"],["قَلَمٌ","Pena"]];let left=[...pairs].sort(()=>Math.random()-.5),right=[...pairs].sort(()=>Math.random()-.5);selectedMatch=null;matchFound=0;showModal(`<button class="modal-close" data-close>×</button><span class="eyebrow">MINI GAME • MEMORY MATCH</span><h2>Pasangkan Kata</h2><p>Pilih satu kata Arab, lalu pilih arti yang sesuai.</p><div class="match-grid">${left.map((p,i)=>`<button class="match-item" data-side="l" data-key="${p[0]}">${p[0]}</button>`).join("")}${right.map((p,i)=>`<button class="match-item" data-side="r" data-key="${p[0]}">${p[1]}</button>`).join("")}</div><div id="match-status" class="feedback" style="display:none"></div>`);$$(".match-item").forEach(b=>b.onclick=()=>{if(b.classList.contains("matched"))return;if(!selectedMatch){selectedMatch=b;b.classList.add("selected");return}if(selectedMatch===b)return;let a=selectedMatch; if(a.dataset.side===b.dataset.side){a.classList.remove("selected");selectedMatch=b;b.classList.add("selected");return}if(a.dataset.key===b.dataset.key){a.classList.remove("selected");a.classList.add("matched");b.classList.add("matched");matchFound++;selectedMatch=null;if(matchFound===4){state.games=(state.games||0)+1;addXP(25);checkBadges();$("#match-status").style.display="block";$("#match-status").className="feedback good";$("#match-status").textContent="Hebat! Semua pasangan berhasil ditemukan. +25 XP";} }else{a.classList.remove("selected");b.classList.add("selected");setTimeout(()=>b.classList.remove("selected"),450);selectedMatch=null}})}
function startPicture(){let q=vocab.filter(v=>["Sekolah","Keluarga","Rumah"].includes(v[3])).sort(()=>Math.random()-.5).slice(0,5);let i=0,score=0;function show(){let v=q[i],opts=[v[2],...vocab.filter(x=>x[2]!==v[2]).sort(()=>Math.random()-.5).slice(0,3).map(x=>x[2])].sort(()=>Math.random()-.5);showModal(`<button class="modal-close" data-close>×</button><div class="quiz-topline"><b>TEBAK MAKNA</b><span>${i+1}/5</span></div><h2>Apa arti kosakata berikut?</h2><div class="arabic" style="text-align:center;font-size:42px;margin:25px 0">${v[0]}</div><div class="option-list">${opts.map(o=>`<button class="option-btn" data-pick="${o}">${o}</button>`).join("")}</div><div id="pic-feedback"></div>`);$$("[data-pick]").forEach(b=>b.onclick=()=>{if($("#pic-feedback").dataset.done)return;$("#pic-feedback").dataset.done="1";let ok=b.dataset.pick===v[2];if(ok)score++;b.classList.add(ok?"correct":"wrong");$$("[data-pick]").find(x=>x.dataset.pick===v[2]).classList.add("correct");$("#pic-feedback").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"Benar!":"Jawaban benar: "+v[2]}</div><button class="btn btn-yellow" id="pic-next" style="margin-top:10px">${i===4?"Selesai":"Lanjut →"}</button>`;$("#pic-next").onclick=()=>{i++;if(i<5)show();else{state.games=(state.games||0)+1;addXP(score*5+5);checkBadges();showModal(`<div style="text-align:center"><div style="font-size:48px">🎉</div><h2>Permainan selesai!</h2><p>Jawaban benar: ${score}/5</p><button class="btn btn-yellow" data-close>Selesai</button></div>`)}}})}show()}
function startSentence(){let words=["أَنَا","طَالِبٌ"];showModal(`<button class="modal-close" data-close>×</button><span class="eyebrow">SENTENCE BUILDER</span><h2>Susun Kalimat</h2><p>Susun kata berikut menjadi kalimat yang benar: “Saya seorang siswa.”</p><div id="sentence-answer" class="arabic" style="min-height:50px;border:1px dashed #d9d5f2;border-radius:10px;padding:12px;text-align:center"></div><div class="option-list" style="grid-template-columns:1fr 1fr"><button class="option-btn" data-word="طَالِبٌ">طَالِبٌ</button><button class="option-btn" data-word="أَنَا">أَنَا</button></div><div id="sentence-feedback"></div>`);let selected=[];$$("[data-word]").forEach(b=>b.onclick=()=>{if(selected.includes(b.dataset.word))return;selected.push(b.dataset.word);$("#sentence-answer").textContent=selected.join(" ");if(selected.length===2){let ok=selected.join(" ")==="أَنَا طَالِبٌ";$("#sentence-feedback").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"Tepat! Kalimatmu benar.":"Belum tepat. Urutannya: أَنَا طَالِبٌ"}</div><button class="btn btn-yellow" id="sentence-done" style="margin-top:10px">Selesai</button>`;$("#sentence-done").onclick=()=>{if(ok){state.games=(state.games||0)+1;addXP(15);checkBadges()}closeModal()}}})}
function startListen(){let v=vocab[Math.floor(Math.random()*vocab.length)];let opts=[v[2],...vocab.filter(x=>x[2]!==v[2]).sort(()=>Math.random()-.5).slice(0,3).map(x=>x[2])].sort(()=>Math.random()-.5);showModal(`<button class="modal-close" data-close>×</button><span class="eyebrow">LISTEN & CHOOSE</span><h2>Dengar dan pilih artinya</h2><p>Tekan tombol audio, lalu pilih arti kata yang kamu dengar.</p><button class="btn btn-outline" id="listen-audio">🔊 Putar audio</button><div class="option-list">${opts.map(o=>`<button class="option-btn" data-listen="${o}">${o}</button>`).join("")}</div><div id="listen-feedback"></div>`);$("#listen-audio").onclick=()=>speak(v[0]);$$("[data-listen]").forEach(b=>b.onclick=()=>{if($("#listen-feedback").dataset.done)return;$("#listen-feedback").dataset.done="1";let ok=b.dataset.listen===v[2];b.classList.add(ok?"correct":"wrong");$$("[data-listen]").find(x=>x.dataset.listen===v[2]).classList.add("correct");$("#listen-feedback").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"Benar!":"Jawaban yang tepat: "+v[2]}</div><button class="btn btn-yellow" id="listen-finish" style="margin-top:10px">Selesai</button>`;$("#listen-finish").onclick=()=>{state.games=(state.games||0)+1;addXP(ok?15:5);checkBadges();closeModal()}})}
function openProfile(){showModal(`<button class="modal-close" data-close>×</button><span class="eyebrow">YOUR LEARNING PROFILE</span><h2>Profil petualang</h2><p>Isi nama panggilan dan kelas untuk menyesuaikan pengalaman belajarmu.</p><form class="profile-form" id="profile-form"><label>Nama panggilan<input name="name" maxlength="24" value="${state.name}" required></label><label>Kelas<select name="kelas"><option ${state.kelas==="VII"?"selected":""}>VII</option><option ${state.kelas==="VIII"?"selected":""}>VIII</option><option ${state.kelas==="IX"?"selected":""}>IX</option></select></label><button class="btn btn-yellow">Simpan profil</button></form>`);$("#profile-form").onsubmit=e=>{e.preventDefault();let fd=new FormData(e.target);state.name=fd.get("name").trim()||"Penjelajah";state.kelas=fd.get("kelas");save();closeModal();toast("Profil berhasil diperbarui!")}}
document.addEventListener("click",e=>{let nav=e.target.closest("[data-page]");if(nav){e.preventDefault();go(nav.dataset.page);return}let goBtn=e.target.closest("[data-go]");if(goBtn){go(goBtn.dataset.go);return}let lesson=e.target.closest("[data-lesson]");if(lesson){openLesson(lesson.dataset.lesson);return}let game=e.target.closest("[data-game]");if(game){({match:startMatch,picture:startPicture,sentence:startSentence,listen:startListen})[game.dataset.game]?.();return}let world=e.target.closest("[data-world]");if(world){let i=+world.dataset.world;let target=lessons[Math.min(i,lessons.length-1)];go("lessons");currentClass=target.kelas;$$(".filter").forEach(b=>b.classList.toggle("active",b.dataset.class===currentClass));renderLessons();openLesson(target.id);return}let sp=e.target.closest("[data-speak]");if(sp){speak(sp.dataset.speak);return}let fav=e.target.closest("[data-fav]");if(fav){let id=fav.dataset.fav;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();renderVocab();return}if(e.target.closest("[data-close]"))closeModal()});
$("#class-filters").addEventListener("click",e=>{let b=e.target.closest("[data-class]");if(!b)return;currentClass=b.dataset.class;$$(".filter").forEach(x=>x.classList.toggle("active",x===b));renderLessons()});
$("#vocab-search").addEventListener("input",renderVocab);$("#vocab-category").addEventListener("change",renderVocab);$("#start-quiz").onclick=startQuiz;$("#profile-button").onclick=openProfile;$("#mobile-menu").onclick=()=>$("#sidebar").classList.toggle("open");$("#modal-backdrop").addEventListener("click",e=>{if(e.target.id==="modal-backdrop")closeModal()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#today-label").textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long"});
renderStats();renderLessons();renderWorlds();renderVocab();renderBadges();renderHistory();
if(!localStorage.getItem(storeKey)){setTimeout(openProfile,500)}
