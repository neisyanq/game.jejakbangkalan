/* src/utils/gameController.js */

/**
 * Controller Interaktif Teroptimasi (initGamePage)
 * Dilengkapi Runtime Sandbox agar bebas memory leak, bebas lag, dan mendukung penuh React SPA
 */
import { syncAuthDOM, bindAuthForms } from './authDomSync';
import { createPageSandbox } from './runtimeSandbox';

export function initGamePage(navigate) {
    const { sandboxWindow, sandboxDocument, cleanup } = createPageSandbox();

    syncAuthDOM();
    bindAuthForms(navigate);

    try {
        const runPageScript = new Function(
            'window',
            'document',
            'setInterval',
            'clearInterval',
            'setTimeout',
            'clearTimeout',
            'requestAnimationFrame',
            'cancelAnimationFrame',
            'Audio',
            'navigate',
            `
        // Fungsi navigasi SPA untuk tombol Ruang Belajar
        window.__jejakNavigate = (path) => {
            if (navigate) {
                navigate(path);
            } else {
                window.location.href = path;
            }
        };

        if (typeof AOS !== 'undefined') {
            AOS.init({ once: true, offset: 50 });
        }

        // Navbar Scroll Effect
        window.addEventListener('scroll', function () {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            }
        });

        // ========================================================
        // AUDIO & SOUND SYSTEM (BGM & SFX SAMA DENGAN LABIRIN)
        // ========================================================
        const bgm = new Audio('/sound/music.mp3');
        bgm.loop = true;
        bgm.volume = 0.5;

        const sfxClick = new Audio('/sound/click.mp3');
        const sfx321 = new Audio('/sound/321.mp3');
        const sfxBenar = new Audio('/sound/soal_benar.mp3');
        const sfxSalah = new Audio('/sound/soal_salah.mp3');
        const sfxBerhasil = new Audio('/sound/berhasil.mp3');
        const sfxLevelBuka = new Audio('/sound/level_selanjutnya_dibuka.mp3');
        const sfxKalah = new Audio('/sound/kalah.mp3');
        const sfxTimer = new Audio('/sound/timer.mp3');
        const sfxWin = new Audio('/sound/win.mp3');

        // Untuk suara jalan kaki
        const sfxStep = new Audio('/sound/click.mp3');
        sfxStep.volume = 0.2;

        let isMuted = false;
        let isPausedGame = false;
        let lastStepTime = 0;

        function playSfx(audioObj) {
            if (!isMuted && audioObj) {
                audioObj.currentTime = 0;
                audioObj.play().catch(e => console.log("Audio play di-block browser: ", e));
            }
        }

        function selectAvatar(avatarValue, element) {
            playSfx(sfxClick); // Efek suara saat memilih avatar
            const cards = document.querySelectorAll('.char-card');
            cards.forEach(card => card.classList.remove('selected'));
            element.classList.add('selected');
        }

        // ========================================================
        // 1. LOGIKA PETA GAME & NAVIGASI (DIPERBAIKI UNTUK SPA)
        // ========================================================
        let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel_sakera')) || 1;
        let currentLevel = 1;

        function syncMapLocks() {
            unlockedLevel = parseInt(localStorage.getItem('unlockedLevel_sakera')) || unlockedLevel || 1;
            for (let i = 1; i <= 10; i++) {
                const dot = document.getElementById('mapDot' + i);
                const lock = document.getElementById('lockIcon' + i);
                if (i <= unlockedLevel) {
                    if (dot) dot.classList.remove('locked');
                    if (lock) lock.style.display = 'none';
                }
            }
        }

        function openGameMap() {
            playSfx(sfxClick);
            syncMapLocks();
            const mapWrapper = document.getElementById('gameMapWrapper');
            if (mapWrapper) mapWrapper.classList.add('active');
        }
        function closeGameMap() {
            playSfx(sfxClick);
            const mapWrapper = document.getElementById('gameMapWrapper');
            if (mapWrapper) mapWrapper.classList.remove('active');
        }

        // Eksekusi Pengecekan Progress
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const completedLvl = parseInt(urlParams.get('completed'));
            if (completedLvl && completedLvl >= unlockedLevel && completedLvl < 10) {
                unlockedLevel = completedLvl + 1;
                localStorage.setItem('unlockedLevel_sakera', unlockedLevel);
            }
            syncMapLocks();
            if (urlParams.get('map') === '1' || completedLvl) {
                const mapWrapper = document.getElementById('gameMapWrapper');
                if (mapWrapper) mapWrapper.classList.add('active');
            }
        } catch(e) { console.warn('Error reading URL params:', e); }

        // ========================================================
        // 2. DATABASE KUIS (30 SOAL LENGKAP)
        // ========================================================
        const quizDatabase = {
            1: [
                { q: "Benda yang digunakan untuk melukis atau membentuk pola batik adalah …", opts: { A: "Kendi", B: "Canting", C: "Tenong", D: "Lesung" }, ans: "B" },
                { q: "Kendi pada koleksi Museum Cakraningrat berfungsi sebagai …", opts: { A: "Tempat menyimpan air minum", B: "Alat menumbuk padi", C: "Alat musik pengiring tari", D: "Wadah menyimpan pakaian" }, ans: "A" },
                { q: "Tenong biasanya dibuat dari …", opts: { A: "Besi", B: "Perunggu", C: "Anyaman bambu", D: "Kaca" }, ans: "C" }
            ],
            2: [
                { q: "Alat tradisional untuk menumbuk padi adalah …", opts: { A: "Lesung", B: "Cantelan klambu", C: "Kuali", D: "Rebab" }, ans: "A" },
                { q: "Anglo digunakan untuk …", opts: { A: "Menyimpan air", B: "Membakar arang untuk memanaskan kuali", C: "Menghias rambut", D: "Mengiringi kerapan sapi" }, ans: "B" },
                { q: "Batik Madura merupakan karya seni yang terutama berupa …", opts: { A: "Kain bermotif khas daerah", B: "Alat transportasi", C: "Senjata peperangan", D: "Naskah kuno" }, ans: "A" }
            ],
            3: [
                { q: "Kendang dalam perangkat gamelan berfungsi utama untuk …", opts: { A: "Menyimpan ramuan", B: "Mengatur tempo irama", C: "Menunjukkan arah pelayaran", D: "Menyalakan penerangan" }, ans: "B" },
                { q: "Bedhung digunakan sebagai alat …", opts: { A: "Komunikasi ritual keagamaan", B: "Membuat pola batik", C: "Mengangkut bangsawan", D: "Menumbuk jamu" }, ans: "A" },
                { q: "Thuk-thuk digunakan sebagai alat musik pengiring …", opts: { A: "Ziarah makam", B: "Kerapan sapi", C: "Membatik", D: "Kirab budaya di sekolah" }, ans: "B" }
            ],
            4: [
                { q: "Alat berbentuk genta besar yang digunakan untuk memanggil prajurit kerajaan adalah …", opts: { A: "Lonceng", B: "Rebab", C: "Saronen", D: "Ginggung" }, ans: "A" },
                { q: "Tabhuwan Lajing digunakan antara lain untuk …", opts: { A: "Menyambut tamu dan pagelaran seni budaya", B: "Menyimpan makanan", C: "Mengangkut barang pasar", D: "Membuat ukiran" }, ans: "A" },
                { q: "Tari Nelayan menggambarkan …", opts: { A: "Kehidupan masyarakat pesisir", B: "Kehidupan putri bangsawan di keraton", C: "Proses membuat naskah kuno", D: "Perdagangan keramik Eropa" }, ans: "A" }
            ],
            5: [
                { q: "Karapan Sapi merupakan …", opts: { A: "Upacara ziarah", B: "Perlombaan pacuan sapi", C: "Alat musik kerajaan", D: "Jenis makanan khas" }, ans: "B" },
                { q: "Tari Moang Sangkal berkaitan dengan simbol …", opts: { A: "Penolakan terhadap hal buruk", B: "Perdagangan rempah", C: "Penerangan rumah", D: "Pengangkutan barang" }, ans: "A" },
                { q: "Kesenian yang memadukan gerak, topeng, dan musik tradisional adalah …", opts: { A: "Tari Angklung Topeng", B: "Tari Nelayan", C: "Kejung Bangkalan", D: "Sapi Sonok" }, ans: "A" }
            ],
            6: [
                { q: "Kejung Bangkalan termasuk seni sastra lisan karena disajikan dalam bentuk …", opts: { A: "Ukiran tiga dimensi", B: "Lantunan tembang atau papareghan", C: "Pacuan sapi", D: "Pameran keramik" }, ans: "B" },
                { q: "Museum Cakraningrat berfungsi penting sebagai tempat …", opts: { A: "Pelestarian peninggalan sejarah dan budaya Bangkalan", B: "Pelatihan pacuan sapi", C: "Pembuatan senjata modern", D: "Penjualan makanan cepat saji" }, ans: "A" },
                { q: "Mercusuar Sembilangan berkaitan dengan perkembangan …", opts: { A: "Navigasi laut", B: "Seni ukir", C: "Kuliner tradisional", D: "Tari keraton" }, ans: "A" }
            ],
            7: [
                { q: "Maket Tanean Lanjhang menunjukkan …", opts: { A: "Tata ruang keluarga inti masyarakat tradisional Madura", B: "Bentuk kapal perang", C: "Susunan alat musik", D: "Teknik membuat batik" }, ans: "A" },
                { q: "Naskah kuno Bangkalan bernilai penting karena dapat memuat …", opts: { A: "Syiar agama, sejarah, dan legenda", B: "Resep makanan modern saja", C: "Petunjuk mengemudikan mobil", D: "Daftar harga keramik" }, ans: "A" },
                { q: "Rokat Tase’ dilakukan masyarakat pesisir sebagai ungkapan …", opts: { A: "Syukur dan doa keselamatan saat melaut", B: "Persaingan antarkerajaan", C: "Perayaan panen padi di pegunungan", D: "Hiburan tanpa makna sosial" }, ans: "A" }
            ],
            8: [
                { q: "Kirab Budaya menampilkan kekayaan daerah melalui …", opts: { A: "Pakaian tradisional, kesenian, dan atribut khas", B: "Alat laboratorium", C: "Permainan digital asing", D: "Kendaraan bermotor" }, ans: "A" },
                { q: "Ziarah ke Pesarean Aer Mata Ebu dilakukan untuk …", opts: { A: "Mendoakan leluhur dan mengenang sejarah", B: "Mencari lokasi berdagang", C: "Mengikuti perlombaan musik", D: "Membeli alat membatik" }, ans: "A" },
                { q: "Tellasan atau Lebaran menekankan nilai …", opts: { A: "Silaturahmi, saling memaafkan, dan berkumpul", B: "Persaingan dan kemenangan", C: "Kecepatan dan ketangkasan", D: "Kesendirian dan kerahasiaan" }, ans: "A" }
            ],
            9: [
                { q: "Makanan yang terdiri atas nasi putih dengan beragam lauk hasil laut dan olahan daging adalah …", opts: { A: "Tajin Sobih", B: "Nasi Serpang", C: "Sewel", D: "Ledre Sepuluh" }, ans: "B" },
                { q: "Tajin Sobih dikenal berasal dari …", opts: { A: "Desa Sobih, Kecamatan Burneh", B: "Desa Sembilangan", C: "Martajasah", D: "Arosbaya saja" }, ans: "A" },
                { q: "Ciri pembeda Sewel dibandingkan jajanan sejenis adalah adanya campuran …", opts: { A: "Udang", B: "Mangga muda", C: "Santan", D: "Ikan tongkol" }, ans: "A" }
            ],
            10: [
                { q: "Seorang siswa menyatakan bahwa canting, ukiran kayu, dan batik hanya berfungsi sebagai benda hias. Pernyataan yang paling tepat untuk memperbaikinya adalah …", opts: { A: "Ketiganya hanya digunakan di museum", B: "Ketiganya memiliki fungsi seni, budaya, dan keterampilan dengan konteks penggunaan yang berbeda", C: "Ketiganya merupakan alat musik", D: "Ketiganya tidak memiliki hubungan dengan masyarakat Madura" }, ans: "B" },
                { q: "Sekolah ingin membuat kegiatan pelestarian budaya yang sesuai dengan nilai materi. Kegiatan paling tepat adalah …", opts: { A: "Menyalin nama budaya tanpa mempelajarinya", B: "Membuat pameran digital berisi benda, fungsi, sumber informasi, dan ajakan menjaga budaya", C: "Mengubah semua tradisi agar mirip budaya luar", D: "Menghapus keterangan sejarah agar permainan lebih cepat" }, ans: "B" },
                { q: "Mengapa game Petualangan Sakera sebaiknya memberi penjelasan setelah siswa menjawab soal, bukan hanya menampilkan skor?", opts: { A: "Agar permainan menjadi lebih lama tanpa tujuan", B: "Agar siswa memahami hubungan jawaban dengan nilai dan konteks budaya", C: "Agar semua siswa mendapat nilai sama", D: "Agar unsur budaya tidak terlihat" }, ans: "B" }
            ]
        };

        // ========================================================
        // 3. LOGIKA INTEGRASI ADVENTURE -> KUIS
        // ========================================================
        function openGameLevel(level) {
            playSfx(sfxClick);
            syncMapLocks();
            if (level > unlockedLevel) { alert('Level ' + level + ' Terkunci! Selesaikan Level ' + (level - 1) + ' terlebih dahulu.'); return; }
            currentLevel = level;

            // Selang-seling mode permainan per level:
            if ([2, 5, 8].includes(level)) {
                window.__jejakNavigate('labirin.php?level=' + level);
                return;
            }
            if ([3, 6, 9].includes(level)) {
                window.__jejakNavigate('laut.php?level=' + level);
                return;
            }

            // Tutup Peta, Buka Wrapper Adventure
            document.getElementById('gameMapWrapper').classList.remove('active');
            const advWrapper = document.getElementById('adventureWrapper');
            advWrapper.style.display = 'block';
            document.getElementById('advStartScreen').style.display = 'flex';
            document.getElementById('advGameUI').style.display = 'none';
            document.getElementById('controlsContainer').style.display = 'none';
            document.getElementById('advGameOverScreen').style.display = 'none';
            document.getElementById('advControlIcons').style.display = 'none';

            // Inisiasi Variabel Adventure Level
            isMercusuarOpen = false;
            soalTerjawab = 0;
            bataSoal.active = true;
            bataSoal2.active = true;
            kunciObj.active = true;
            tandaTanyaNgambang.active = true;
            tandaTanyaSemak.active = true;
            
            // RESET SCORE DAN LIVES UTUH KETIKA LEVEL DIBUKA KEMBALI
            score = 0;
            lives = 3;
            document.getElementById('advScoreDisplay').innerText = score;
            
            let heartsHtml = '';
            for (let i = 0; i < lives; i++) heartsHtml += '<span class="heart-icon">❤️</span> ';
            document.getElementById('advLivesContainer').innerHTML = heartsHtml;

            baseCharKuis = getBaseCharacter();
            initAdventureCanvas();
        }

        // MENYESUAIKAN AVATAR KUIS
        function getBaseCharacter() {
            if (typeof userAvatarGlobal !== 'undefined' && (userAvatarGlobal.toLowerCase().includes('avatar2') || userAvatarGlobal.toLowerCase().includes('marlena'))) return 'marlena';
            return 'sakera';
        }

        function triggerQuizModal(soalIndex) {
            playSfx(sfxClick);
            advGameStarted = false; // Pause Adventure
            player.dx = 0; keys.left = false; keys.right = false; // Stop pergerakan

            // Jeda backsound saat kuis
            if (!isMuted) bgm.pause();

            // Pause animasi GIF
            pausePlayerGif();

            // Tampilkan Kuis Overlay
            const lvlPage = document.getElementById('gameLevelPage');
            lvlPage.style.display = 'block';
            setTimeout(() => { lvlPage.classList.add('active'); }, 50);

            // Set data array hanya untuk soal yang ditrigger
            activeLevelData = [quizDatabase[currentLevel][soalIndex]];
            resetKuisLevel();
        }

        function closeQuizSuccess() {
            playSfx(sfxClick);
            const lvlPage = document.getElementById('gameLevelPage');
            lvlPage.classList.remove('active');
            setTimeout(() => {
                lvlPage.style.display = 'none';
                advGameStarted = true;
                resumePlayerGif();
                if (!isMuted && !isPausedGame) bgm.play().catch(e => e);
                requestAnimationFrame(gameLoop);
            }, 400);
        }

        function quitAdventure() {
            playSfx(sfxClick);
            advGameStarted = false;
            bgm.pause();
            bgm.currentTime = 0;
            isPausedGame = false;
            document.getElementById('btnPausePlay').style.backgroundImage = "url('/img/labirin/pause.png')";
            document.getElementById('adventureWrapper').style.display = 'none';
            document.getElementById('advControlIcons').style.display = 'none';
            document.getElementById('gameMapWrapper').classList.add('active');
        }

        // ========================================================
        // LOGIKA KONTROL SOUND & PAUSE/PLAY DARI IKON KIRI ATAS
        // ========================================================
        let playerGifSrc = "";
        function pausePlayerGif() {
            const pSprite = document.getElementById('playerSprite');
            if (pSprite && !pSprite.src.startsWith('data:')) {
                playerGifSrc = pSprite.src;
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = pSprite.naturalWidth || 60;
                tempCanvas.height = pSprite.naturalHeight || 90;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(pSprite, 0, 0, tempCanvas.width, tempCanvas.height);
                pSprite.src = tempCanvas.toDataURL();
            }
        }

        function resumePlayerGif() {
            const pSprite = document.getElementById('playerSprite');
            if (playerGifSrc && pSprite) {
                pSprite.src = playerGifSrc;
                playerGifSrc = ""; 
            }
        }

        function toggleSound() {
            playSfx(sfxClick);
            const btnSound = document.getElementById('btnSoundToggle');
            isMuted = !isMuted;
            if (isMuted) {
                bgm.pause();
                btnSound.style.backgroundImage = "url('/img/labirin/mute.png')";
            } else {
                if (advGameStarted && !isPausedGame) {
                    bgm.play().catch(e => console.log("Audio play di-block"));
                }
                btnSound.style.backgroundImage = "url('/img/labirin/suara.png')";
            }
        }

        function togglePause() {
            playSfx(sfxClick);
            const btnPause = document.getElementById('btnPausePlay');
            isPausedGame = !isPausedGame;

            if (isPausedGame) {
                btnPause.style.backgroundImage = "url('/img/labirin/play.png')";
                bgm.pause();
                pausePlayerGif(); 
            } else {
                btnPause.style.backgroundImage = "url('/img/labirin/pause.png')";
                if (!isMuted) bgm.play().catch(e => e);
                resumePlayerGif(); 
                requestAnimationFrame(gameLoop);
            }
        }

        // ========================================================
        // 4. LOGIKA KUIS (DI DALAM MODAL)
        // ========================================================
        let kuisTimer, waktuKuis = 60, nyawaKuis = 7, skorKuis = 0;
        let isKuisSelesai = false;
        let currentQuestionIndex = 0;
        let activeLevelData = [];
        let baseCharKuis = 'sakera';

        function resetKuisLevel() {
            waktuKuis = 60; isKuisSelesai = false; currentQuestionIndex = 0;
            document.getElementById('gl-level-text').innerText = 'Level ' + currentLevel;
            updateUINyawa(); updateUISkor(); updateUITimer();
            loadQuestion();
        }

        function loadQuestion() {
            waktuKuis = 60; updateUITimer(); isKuisSelesai = false;
            const qData = activeLevelData[currentQuestionIndex];
            
            let urutanSoal = soalTerjawab + 1;
            if(urutanSoal > 3) urutanSoal = 3; 
            document.getElementById('gl-question-counter').innerText = \`Pertanyaan \${urutanSoal}/3\`;

            document.getElementById('quizQuestionText').innerText = qData.q;
            document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_berfikir.png';
            document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#5A110E; font-size:1.2rem;">Hmm...</strong><br>Ayo bantu aku menjawab pertanyaan ini! Waktumu cuma 1 menit!';

            const optsCont = document.getElementById('quizOptionsContainer');
            let optsHTML = '';
            for (const [key, value] of Object.entries(qData.opts)) {
                optsHTML += \`<label class="gl-option" onclick="selectQuizOption(this)"><input type="radio" name="kuisOpt" value="\${key}"><div class="gl-option-letter">\${key}</div><div class="gl-option-text">\${value}</div><div class="gl-check"><i class="fa-solid fa-check"></i></div></label>\`;
            }
            optsCont.innerHTML = optsHTML;

            const dotsCont = document.getElementById('quizPaginationContainer');
            let dotsHTML = \`<div class="gl-dot active-diamond"></div>\`;
            dotsCont.innerHTML = dotsHTML;

            const btn = document.getElementById('btnJawabKuis');
            btn.innerHTML = 'Jawab <i class="fa-solid fa-check ms-1"></i>';
            btn.onclick = cekJawabanKuis;

            clearInterval(kuisTimer);
            kuisTimer = setInterval(jalanTimerKuis, 1000);
        }

        function updateUINyawa() { document.getElementById('gl-health').innerText = nyawaKuis; }
        function updateUISkor() { document.getElementById('gl-score').innerText = skorKuis; }
        function updateUITimer() {
            let m = Math.floor(waktuKuis / 60).toString().padStart(2, '0');
            let s = (waktuKuis % 60).toString().padStart(2, '0');
            document.getElementById('gl-timer').innerText = \`\${m}:\${s}\`;
        }

        function jalanTimerKuis() {
            if (isKuisSelesai) return;
            if (waktuKuis <= 5 && waktuKuis > 0) playSfx(sfxTimer);
            waktuKuis--; updateUITimer();
            if (waktuKuis <= 0) waktuHabis();
        }

        function waktuHabis() {
            playSfx(sfxKalah);
            isKuisSelesai = true; clearInterval(kuisTimer); nyawaKuis--; updateUINyawa();
            document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_salah.png';
            document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#5A110E; font-size:1.2rem;">Waktu Habis!</strong><br>Sayang sekali, kita kehabisan waktu dan nyawamu berkurang 1.';
            if (nyawaKuis <= 0) gameOverKuis(); else setupBtnLanjutSoal(false);
        }

        function selectQuizOption(el) {
            if (isKuisSelesai) return;
            playSfx(sfxClick);
            document.querySelectorAll('.gl-option').forEach(o => o.classList.remove('selected'));
            el.classList.add('selected');
        }

        function cekJawabanKuis() {
            if (isKuisSelesai) return;
            const sel = document.querySelector('.gl-option.selected input');
            if (!sel) {
                playSfx(sfxClick);
                alert('Pilih jawaban terlebih dahulu!');
                return;
            }

            isKuisSelesai = true; clearInterval(kuisTimer);

            const selectedLabel = sel.closest('.gl-option');
            const selectedIcon = selectedLabel ? selectedLabel.querySelector('.gl-check i') : null;
            const correctAns = activeLevelData[currentQuestionIndex].ans;

            if (sel.value === correctAns) {
                if (selectedLabel) selectedLabel.classList.add('correct');
                if (selectedIcon) selectedIcon.className = 'fa-solid fa-check';

                playSfx(sfxBenar);
                skorKuis += 20; updateUISkor();
                document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_betul.png';
                document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#28a745; font-size:1.2rem;"><i class="fa-solid fa-circle-check me-1"></i>Hebat, Jawaban Benar!</strong><br>Jawabanmu tepat! Kamu mendapatkan poin.';
                setupBtnLanjutSoal(true);
            } else {
                if (selectedLabel) selectedLabel.classList.add('wrong');
                if (selectedIcon) selectedIcon.className = 'fa-solid fa-xmark';

                playSfx(sfxSalah);
                nyawaKuis--; updateUINyawa();
                document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_salah.png';
                if (nyawaKuis <= 0) {
                    const correctInput = document.querySelector(\`.gl-option input[value="\${correctAns}"]\`);
                    if (correctInput) {
                        const correctLabel = correctInput.closest('.gl-option');
                        const correctIcon = correctLabel ? correctLabel.querySelector('.gl-check i') : null;
                        if (correctLabel) correctLabel.classList.add('correct');
                        if (correctIcon) correctIcon.className = 'fa-solid fa-check';
                    }
                    document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#dc3545; font-size:1.2rem;"><i class="fa-solid fa-circle-xmark me-1"></i>Game Over!</strong><br>Jawaban salah dan nyawamu habis. Kamu harus mengulang dari awal!';
                    gameOverKuis();
                } else {
                    document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#dc3545; font-size:1.2rem;"><i class="fa-solid fa-circle-xmark me-1"></i>Yahh, Jawaban Salah!</strong><br>Jawaban kamu kurang tepat. Jangan menyerah, ayo coba lagi!';
                    setupBtnLanjutSoal(false);
                }
            }
        }

        function setupBtnLanjutSoal(isBenar) {
            const btn = document.getElementById('btnJawabKuis');
            if (currentQuestionIndex < activeLevelData.length - 1) {
                btn.innerHTML = 'Soal Berikutnya <i class="fa-solid fa-arrow-right ms-1"></i>';
                btn.onclick = () => { 
                    playSfx(sfxClick);
                    currentQuestionIndex++; loadQuestion(); 
                };
            } else {
                if (isBenar) {
                    soalTerjawab++;
                    if (soalTerjawab >= 3) {
                        document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#28a745; font-size:1.2rem;"><i class="fa-solid fa-circle-check me-1"></i>Jawaban Benar & Kuis Selesai!</strong><br>Hebat! Pintu mercusuar sekarang telah terbuka. Lanjutkan perjalananmu!';
                        isMercusuarOpen = true; 
                        playSfx(sfxLevelBuka);
                    } else {
                        document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#28a745; font-size:1.2rem;"><i class="fa-solid fa-circle-check me-1"></i>Hebat, Jawaban Benar!</strong><br>Cari tanda tanya lainnya untuk membuka pintu mercusuar!';
                    }
                    document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_betul.png';

                    btn.innerHTML = 'Lanjut Petualangan <i class="fa-solid fa-person-running ms-1"></i>';
                    btn.onclick = closeQuizSuccess;
                } else {
                    btn.innerHTML = 'Coba Lagi <i class="fa-solid fa-rotate-right ms-1"></i>';
                    btn.onclick = () => { 
                        playSfx(sfxClick);
                        resetKuisLevel(); 
                    };
                }
            }
        }

        function gameOverKuis() {
            playSfx(sfxKalah);
            const btn = document.getElementById('btnJawabKuis');
            btn.innerHTML = 'Ulang Petualangan <i class="fa-solid fa-rotate-right ms-1"></i>';
            btn.onclick = () => {
                playSfx(sfxClick);
                const lvlPage = document.getElementById('gameLevelPage');
                lvlPage.classList.remove('active');
                setTimeout(() => {
                    lvlPage.style.display = 'none';
                    triggerGameOverAdventure();
                }, 400);
            };
        }

        // ========================================================
        // 5. ENGINE ADVENTURE GAME 
        // ========================================================

        let bg2_TebingDasar_X = 190; let bg2_TebingDasar_Y = -27; 
        let bg2_Tebing2_X = 72; let bg2_Tebing2_Y = -15;      
        let bg2_Tebing3_X = 50; let bg2_Tebing3_Y = -10;      
        let bg2_TebingTimpa_X = 555; let bg2_TebingTimpa_Y = -30; 
        let bg2_TebingTimpa_Scale = 0.38; 
        let bg2_Tebing4_X = -70; let bg2_Tebing4_Y = -20;      

        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const playerSprite = document.getElementById('playerSprite');

        const images = {};
        const imagePaths = {
            bg1: '/img/adventure/background1.png',
            bg2: '/img/adventure/background2.png',
            bataSoal: '/img/adventure/bata_soal.png',
            jamur: '/img/adventure/jamur.png',
            siput: '/img/adventure/siput.png',
            kunci: '/img/adventure/kunci.png',
            tebing: '/img/adventure/tebing.png',
            tebingTimpa: '/img/adventure/tebing timpa.png',
            tebing2: '/img/adventure/tebing2.png',
            tebing3: '/img/adventure/tebing3.png',
            tebing4: '/img/adventure/tebing4.png',
            jembatan: '/img/adventure/jembatan.png',
            mercusuarTerbuka: '/img/adventure/mercusuar_pintu terbuka.png',
            mercusuarTertutup: '/img/adventure/mercusuar_pintu tertutup.png',
            tanahNgambang: '/img/adventure/tanah_ngambang.png',
            tandaTanya: '/img/adventure/tanda tanya.png'
        };

        let isMoving = false;
        let advGameStarted = false;
        let isAdvGameOver = false;

        let loadedImages = 0;
        let totalImages = Object.keys(imagePaths).length;

        for (let key in imagePaths) {
            images[key] = new Image();
            images[key].src = imagePaths[key];
            images[key].onload = () => {
                loadedImages++;
                if (loadedImages >= totalImages) finishLoading();
            };
            images[key].onerror = () => { loadedImages++; if (loadedImages >= totalImages) finishLoading(); }
        }

        function finishLoading() {
            document.getElementById('loadingText').style.display = 'none';
            document.getElementById('playBtnCss').style.display = 'block';
        }

        const NATIVE_HEIGHT = 600;
        let cssScale = 1;
        let totalWorldWidth = 0;
        let cameraX = 0;

        let tebingWidth = 0;
        let tebingDrawHeight = NATIVE_HEIGHT * 0.88;
        let tebingDrawY = NATIVE_HEIGHT * 0.36;
        let groundY = tebingDrawY + (tebingDrawHeight * 0.33);

        const holeStartPercent = 0.38, holeEndPercent = 0.52;
        let holeStartX = 0, holeEndX = 0;

        let tebing2Scale = 0.57, tebing2WidthStretch = 1.2, posisiXTebing2 = -320, tebing2Y = groundY - -12;
        let tebing3Scale = 0.50, posisiXTebing3 = 730, tebing3Y = groundY + 1;
        let tebingTimpaScale = 0.32, posisiXTebingTimpa = -140, tebingTimpaY = groundY - 17;
        let tebing4Scale = 0.35, posisiXTebing4 = 1550, tebing4Y = groundY - 8;
        let mercusuarScale = 0.25;

        let playerVisualOffset = 12; 
        let stepTolerance = 18;      

        images.tandaTanya = new Image();
        images.tandaTanya.src = '/img/adventure/tanda tanya.png';

        images.semak = new Image();
        images.semak.src = '/img/adventure/semak.png';

        function getBaseGroundYAt(x) {
            let t2Width = images.tebing2 ? images.tebing2.width * tebing2Scale * tebing2WidthStretch : 0;
            let t3Width = images.tebing3 ? images.tebing3.width * tebing3Scale : 0;
            let t4Width = images.tebing4 ? images.tebing4.width * tebing4Scale : 0;

            for (let i = 0; i < 2; i++) {
                let shift = i * tebingWidth;
                let currentTebingTimpaScale = (i === 1) ? bg2_TebingTimpa_Scale : tebingTimpaScale;
                let ttWidth = images.tebingTimpa ? images.tebingTimpa.width * currentTebingTimpaScale : 0;

                let tDasarOffsetX = (i === 1) ? bg2_TebingDasar_X : 0;
                let tDasarOffsetY = (i === 1) ? bg2_TebingDasar_Y : 0;
                let t2OffsetX = (i === 1) ? bg2_Tebing2_X : 0;
                let t2OffsetY = (i === 1) ? bg2_Tebing2_Y : 0;
                let t3OffsetX = (i === 1) ? bg2_Tebing3_X : 0;
                let t3OffsetY = (i === 1) ? bg2_Tebing3_Y : 0;
                let ttOffsetX = (i === 1) ? bg2_TebingTimpa_X : 0;
                let ttOffsetY = (i === 1) ? bg2_TebingTimpa_Y : 0;
                let t4OffsetX = (i === 1) ? bg2_Tebing4_X : 0;
                let t4OffsetY = (i === 1) ? bg2_Tebing4_Y : 0;

                let pijakanAkhirTebingTimpa = (posisiXTebingTimpa + shift + ttOffsetX) + ttWidth;
                let pijakanAkhirTebing2 = (posisiXTebing2 + shift + t2OffsetX) + t2Width;
                let pijakanAkhirTebing3 = (posisiXTebing3 + shift + t3OffsetX) + t3Width;
                let pijakanAkhirTebing4 = (posisiXTebing4 + shift + t4OffsetX) + t4Width;

                if (x >= (posisiXTebing4 + shift + t4OffsetX) && x <= pijakanAkhirTebing4) return tebing4Y + t4OffsetY;
                if (x >= (posisiXTebingTimpa + shift + ttOffsetX) && x <= pijakanAkhirTebingTimpa) return tebingTimpaY + ttOffsetY;
                if (x >= (posisiXTebing2 + shift + t2OffsetX) && x <= pijakanAkhirTebing2) return tebing2Y + t2OffsetY;
                if (x >= (posisiXTebing3 + shift + t3OffsetX) && x <= pijakanAkhirTebing3) return tebing3Y + t3OffsetY;

                if (i === 0) {
                    if (x > (holeStartX + shift) && x < (holeEndX + shift)) return groundY + 20 + tDasarOffsetY; 
                }
            }
            if (x >= tebingWidth) return groundY + bg2_TebingDasar_Y;
            return groundY;
        }

        function getPlayerGroundYAt(x) { return getBaseGroundYAt(x) + playerVisualOffset; }

        let score = 0, lives = 3, isInvincible = false, facingRight = true;
        let player = { x: 50, y: 0, width: 60, height: 90, speed: 7, dx: 0, dy: 0, gravity: 0.8, jumpPower: -16, isJumping: false };
        let bataSoal = { active: true };
        let bataSoal2 = { active: true };
        let kunciObj = { active: true };
        let tandaTanyaNgambang = { active: true };
        let tandaTanyaSemak = { active: true };
        let soalTerjawab = 0;

        let enemies = [];
        const keys = { right: false, left: false };

        window.addEventListener('keydown', (e) => {
            if (!advGameStarted || isPausedGame) return;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
            if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') && !player.isJumping) lompat();
        });
        window.addEventListener('keyup', (e) => {
            if (!advGameStarted || isPausedGame) return;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
        });

        function addControl(element, keyProp, isJump = false) {
            const startEvent = (e) => { e.preventDefault(); if (isJump && advGameStarted && !isPausedGame) lompat(); else keys[keyProp] = true; };
            const endEvent = (e) => { e.preventDefault(); if (!isJump) keys[keyProp] = false; };
            element.addEventListener('mousedown', startEvent, { passive: false });
            element.addEventListener('touchstart', startEvent, { passive: false });
            element.addEventListener('mouseup', endEvent, { passive: false });
            element.addEventListener('mouseleave', endEvent, { passive: false });
            element.addEventListener('touchend', endEvent, { passive: false });
        }
        addControl(document.getElementById('btnLeft'), 'left');
        addControl(document.getElementById('btnRight'), 'right');
        addControl(document.getElementById('btnUp'), 'up', true);

        function lompat() {
            if (!player.isJumping && !isPausedGame) { player.dy = player.jumpPower; player.isJumping = true; }
        }

        function initAdventureCanvas() {
            playerGifSrc = ""; 
            let windowRatio = window.innerWidth / window.innerHeight;
            canvas.width = NATIVE_HEIGHT * windowRatio;
            canvas.height = NATIVE_HEIGHT;
            cssScale = window.innerHeight / NATIVE_HEIGHT;

            let bgDrawWidth = 1500;
            if (images.bg1 && images.bg1.height) {
                bgDrawWidth = images.bg1.width * (NATIVE_HEIGHT / images.bg1.height);
                totalWorldWidth = bgDrawWidth * 2;
            } else {
                totalWorldWidth = 3000;
            }

            tebingWidth = bgDrawWidth;
            holeStartX = tebingWidth * holeStartPercent;
            holeEndX = tebingWidth * holeEndPercent;

            player.x = 50;
            player.dx = 0; player.dy = 0;
            let startGroundY = Math.min(
                getPlayerGroundYAt(player.x + 15),
                Math.min(getPlayerGroundYAt(player.x + player.width - 15), getPlayerGroundYAt(player.x + player.width / 2))
            );
            player.y = startGroundY - player.height;

            let bHeight = 60, bWidth = 60;
            if (images.bataSoal && images.bataSoal.width) bWidth = (images.bataSoal.width / images.bataSoal.height) * bHeight;
            bataSoal = { x: holeStartX + (holeEndX - holeStartX) / 2 - (bWidth / 2) + 300, y: groundY - 150, width: bWidth, height: bHeight, active: true };

            let kHeight = 40, kWidth = 40;
            if (images.kunci && images.kunci.width) kWidth = (images.kunci.width / images.kunci.height) * kHeight;
            kunciObj = { x: bataSoal.x + (bataSoal.width / 2) - (kWidth / 2), y: bataSoal.y - 50, width: kWidth, height: kHeight, active: true };

            enemies = [
                { type: 'jamur', x: 310, y: getBaseGroundYAt(300) + 0, width: 30, height: 30, speed: 0, dead: false, squashed: false },
                { type: 'siput', x: holeEndX + 222, y: getBaseGroundYAt(holeEndX + 222) - 20, width: 40, height: 25, speed: -2, startX: holeEndX + 222, range: 150, dead: false },
                { type: 'jamur', x: 310 + tebingWidth, y: getBaseGroundYAt(300 + tebingWidth) - 8, width: 30, height: 30, speed: 0, dead: false, squashed: false },
                { type: 'siput', x: holeEndX + 222 + tebingWidth, y: getBaseGroundYAt(holeEndX + 222 + tebingWidth) - 20, width: 40, height: 25, speed: -2, startX: holeEndX + 222 + tebingWidth, range: 150, dead: false },
                { type: 'jamur', x: totalWorldWidth - 470, y: getBaseGroundYAt(totalWorldWidth - 340) - 8, width: 30, height: 30, speed: 0, dead: false, squashed: false }
            ];

            playerSprite.src = "/img/adventure/" + getBaseCharacter() + ".gif?pause";
            drawAdventure();
        }

        function startCountdown() {
            playSfx(sfxClick);
            document.getElementById('advStartScreen').style.display = 'none';
            let overlay = document.getElementById('countdownOverlay');
            let text = document.getElementById('countdownText');
            overlay.style.display = 'flex';
            let count = 3; text.innerText = count;

            playSfx(sfx321);

            let countdownInterval = setInterval(() => {
                count--;
                if (count > 0) {
                    text.innerText = count; text.style.animation = 'none'; void text.offsetWidth; text.style.animation = 'zoomInOut 1s ease-in-out infinite';
                    playSfx(sfx321);
                } else if (count === 0) {
                    text.innerText = "GO!"; text.style.color = "#FFD700"; text.style.animation = 'none'; void text.offsetWidth; text.style.animation = 'zoomInOut 1s ease-in-out infinite';
                    playSfx(sfxBerhasil);
                } else {
                    clearInterval(countdownInterval);
                    overlay.style.display = 'none';
                    startAdventureGame();
                }
            }, 1000);
        }

        function startAdventureGame() {
            document.getElementById('advGameUI').style.display = 'block';
            document.getElementById('controlsContainer').style.display = 'flex';
            document.getElementById('advControlIcons').style.display = 'flex';
            if (!isMuted) bgm.play().catch(e => console.log("Audio block", e));

            playerSprite.style.display = 'block';
            advGameStarted = true;
            isAdvGameOver = false;
            requestAnimationFrame(gameLoop);
        }

        function restartAdventure() {
            playSfx(sfxClick);
            document.getElementById('advGameOverScreen').style.display = 'none';
            score = 0;
            lives = 3;
            document.getElementById('advScoreDisplay').innerText = score;
            
            let heartsHtml = '';
            for (let i = 0; i < lives; i++) heartsHtml += '<span class="heart-icon">❤️</span> ';
            document.getElementById('advLivesContainer').innerHTML = heartsHtml;

            initAdventureCanvas();
            startCountdown();
        }

        function updateAdventure() {
            if (isAdvGameOver || !advGameStarted || isPausedGame) return;

            if (keys.right) {
                player.dx = player.speed; facingRight = true;
                if (!isMoving) { playerSprite.src = "/img/adventure/" + getBaseCharacter() + ".gif?play=" + Date.now(); isMoving = true; }
            } else if (keys.left) {
                player.dx = -player.speed; facingRight = false;
                if (!isMoving) { playerSprite.src = "/img/adventure/" + getBaseCharacter() + ".gif?play=" + Date.now(); isMoving = true; }
            } else {
                player.dx = 0;
                if (isMoving) { playerSprite.src = "/img/adventure/" + getBaseCharacter() + ".gif?pause"; isMoving = false; }
            }

            if (player.dx !== 0 && !player.isJumping) {
                if (Date.now() - lastStepTime > 300) {
                    playSfx(sfxStep);
                    lastStepTime = Date.now();
                }
            }

            let prevX = player.x;
            let nextX = player.x + player.dx;
            let bottomY = player.y + player.height;

            if (player.dx > 0) {
                let rightEdgeGroundY = getPlayerGroundYAt(nextX + player.width);
                if (bottomY > rightEdgeGroundY + stepTolerance) { nextX = prevX; player.dx = 0; }
            } else if (player.dx < 0) {
                let leftEdgeGroundY = getPlayerGroundYAt(nextX);
                if (bottomY > leftEdgeGroundY + stepTolerance) { nextX = prevX; player.dx = 0; }
            }

            player.x = nextX;
            if (player.x < 0) player.x = 0;
            if (player.x + player.width > totalWorldWidth) player.x = totalWorldWidth - player.width;

            player.dy += player.gravity; player.y += player.dy;

            let leftGround = getPlayerGroundYAt(player.x + 15);
            let rightGround = getPlayerGroundYAt(player.x + player.width - 15);
            let centerGround = getPlayerGroundYAt(player.x + player.width / 2);
            let currentPlayerGroundY = Math.min(leftGround, Math.min(rightGround, centerGround));

            if (images.tanahNgambang && images.tanahNgambang.height) {
                let tnScale = 0.07;
                let tnWidth = images.tanahNgambang.width * tnScale;
                let tnPosisiX = (holeStartX - -1310);
                let tnPosisiY = groundY - 100;

                if (player.x + player.width - 15 > tnPosisiX && player.x + 15 < tnPosisiX + tnWidth) {
                    if (player.y + player.height - player.dy <= tnPosisiY + playerVisualOffset + 25) {
                        currentPlayerGroundY = Math.min(currentPlayerGroundY, tnPosisiY + playerVisualOffset);
                    }
                }
            }

            if (!player.isJumping && player.dy >= 0 && (player.y + player.height) <= currentPlayerGroundY && (currentPlayerGroundY - (player.y + player.height)) <= stepTolerance) {
                player.y = currentPlayerGroundY - player.height;
                player.dy = 0;
            }

            if (player.y + player.height >= currentPlayerGroundY && player.dy >= 0) {
                player.y = currentPlayerGroundY - player.height;
                player.dy = 0; player.isJumping = false;
            }

            cameraX = player.x - (canvas.width / 2) + (player.width / 2);
            if (cameraX < 0) cameraX = 0;
            if (cameraX > totalWorldWidth - canvas.width) cameraX = Math.max(0, totalWorldWidth - canvas.width);

            let screenPlayerX = player.x - cameraX;
            playerSprite.style.left = (screenPlayerX * cssScale) + 'px';
            playerSprite.style.top = (player.y * cssScale) + 'px';
            playerSprite.style.height = (player.height * cssScale) + 'px';
            playerSprite.style.width = 'auto';
            playerSprite.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
            playerSprite.style.opacity = (isInvincible && Math.floor(Date.now() / 100) % 2 === 0) ? '0' : '1';

            if (bataSoal.active) {
                if (player.x < bataSoal.x + bataSoal.width && player.x + player.width > bataSoal.x &&
                    player.y < bataSoal.y + bataSoal.height && player.y + player.height > bataSoal.y) {

                    if (player.dy < 0 && player.y > bataSoal.y) {
                        player.y = bataSoal.y + bataSoal.height;
                        player.dy = 0;
                        if (kunciObj.active) {
                            kunciObj.active = false;
                            bataSoal.active = false;
                            playSfx(sfxBerhasil); 
                            triggerQuizModal(0);
                        }
                        bataSoal.y -= 10;
                        setTimeout(() => { bataSoal.y += 10; }, 100);
                    }
                }
            }

            if (tandaTanyaNgambang.active) {
                let tnWidth = images.tanahNgambang ? images.tanahNgambang.width * 0.07 : 0;
                let tnPosX = (holeStartX + 1310);
                let tnPosY = groundY - 100;
                let ttX = tnPosX + (tnWidth / 2) - (45 / 2);
                let ttY = tnPosY - 45 - 20;
                
                if (player.x < ttX + 45 && player.x + player.width > ttX &&
                    player.y < ttY + 45 && player.y + player.height > ttY) {
                    tandaTanyaNgambang.active = false;
                    playSfx(sfxBerhasil);
                    triggerQuizModal(1);
                }
            }

            if (tandaTanyaSemak.active) {
                let semakW = images.semak ? images.semak.width * 0.18 : 0;
                let semakH = images.semak ? images.semak.height * 0.18 : 0;
                let sPosX = (310 + tebingWidth) + 270;
                let sPosY = getBaseGroundYAt(sPosX) - semakH + 15;
                let ttX = sPosX + (semakW / 2) - (45 / 2);
                let ttY = sPosY - 45 - 40;

                if (player.x < ttX + 45 && player.x + player.width > ttX &&
                    player.y < ttY + 45 && player.y + player.height > ttY) {
                    tandaTanyaSemak.active = false;
                    playSfx(sfxBerhasil);
                    triggerQuizModal(2);
                }
            }

            enemies.forEach(enemy => {
                if (enemy.dead) return;
                if (enemy.type === 'siput') {
                    enemy.x += enemy.speed;
                    if (enemy.x > enemy.startX || enemy.x < enemy.startX - enemy.range) enemy.speed *= -1;
                }

                if (enemy.squashed) return;

                let isColliding = (
                    player.x < enemy.x + enemy.width - 15 &&
                    player.x + player.width > enemy.x + 15 &&
                    player.y < enemy.y + enemy.height - 10 &&
                    player.y + player.height > enemy.y
                );

                if (isColliding && !isInvincible) {
                    let isFalling = player.dy > 0;
                    let isStomping = isFalling && (player.y + player.height - player.dy) <= enemy.y + 25;

                    if (enemy.type === 'jamur' && isStomping) {
                        enemy.squashed = true; enemy.height = enemy.height / 2; enemy.y += enemy.height;
                        player.dy = player.jumpPower * 0.6; player.isJumping = true;
                        score += 50; document.getElementById('advScoreDisplay').innerText = score;
                        playSfx(sfxBerhasil);
                        setTimeout(() => { enemy.dead = true; }, 400);
                    } else {
                        kurangiNyawaAdv(); 
                    }
                }
            });

            if (isMercusuarOpen) {
                let mScaleOriginal = 0.25;
                let mImg = images.mercusuarTerbuka;
                let mWidth1 = (mImg && mImg.width) ? mImg.width * mScaleOriginal : 0;
                let mX1 = totalWorldWidth - mWidth1 - 150 + bg2_TebingDasar_X;

                if (player.x + player.width > mX1 + 20) {
                    playSfx(sfxWin);
                    advGameStarted = false; 
                    alert("🎉 Selamat! Kamu berhasil menyelesaikan Level " + currentLevel + "!");

                    if (currentLevel === unlockedLevel && unlockedLevel < 10) {
                        unlockedLevel++;
                        localStorage.setItem('unlockedLevel_sakera', unlockedLevel);
                        const nextDot = document.getElementById('mapDot' + unlockedLevel);
                        const nextLock = document.getElementById('lockIcon' + unlockedLevel);
                        if (nextDot) nextDot.classList.remove('locked');
                        if (nextLock) nextLock.style.display = 'none';
                    }
                    quitAdventure();
                }
            }
        }

        function kurangiNyawaAdv() {
            playSfx(sfxKalah);
            lives--; 
            let heartsHtml = '';
            for (let i = 0; i < lives; i++) heartsHtml += '<span class="heart-icon">❤️</span> ';
            document.getElementById('advLivesContainer').innerHTML = heartsHtml;

            if (lives <= 0) {
                triggerGameOverAdventure();
            } else {
                isInvincible = true;
                setTimeout(() => { isInvincible = false; }, 2000);
            }
        }

        function triggerGameOverAdventure() {
            isAdvGameOver = true;
            advGameStarted = false;
            bgm.pause(); 

            document.getElementById('advFinalScore').innerText = score + skorKuis;
            document.getElementById('advGameOverScreen').style.display = 'flex';
            document.getElementById('controlsContainer').style.display = 'none';
            document.getElementById('advControlIcons').style.display = 'none';
            playerSprite.style.display = 'none';
        }

        function drawAdventure() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(-cameraX, 0);

            if (images.bg1 && images.bg1.height) {
                let zoomBackground = 1;
                let drawHeight1 = NATIVE_HEIGHT * zoomBackground;
                let drawWidth1 = images.bg1.width * (drawHeight1 / images.bg1.height);
                let offsetY = -(drawHeight1 - NATIVE_HEIGHT) * 0.7;

                ctx.drawImage(images.bg1, 0, offsetY, drawWidth1, drawHeight1);
                if (images.bg2 && images.bg2.height) {
                    ctx.drawImage(images.bg2, drawWidth1, offsetY, drawWidth1, drawHeight1);
                } else {
                    ctx.drawImage(images.bg1, drawWidth1, offsetY, drawWidth1, drawHeight1);
                }
            } else {
                ctx.fillStyle = "#87CEEB"; ctx.fillRect(0, 0, totalWorldWidth, NATIVE_HEIGHT);
            }

            for (let i = 0; i < 2; i++) {
                let shift = i * tebingWidth;

                let tDasarOffsetX = (i === 1) ? bg2_TebingDasar_X : 0;
                let tDasarOffsetY = (i === 1) ? bg2_TebingDasar_Y : 0;
                let t2OffsetX = (i === 1) ? bg2_Tebing2_X : 0;
                let t2OffsetY = (i === 1) ? bg2_Tebing2_Y : 0;
                let t3OffsetX = (i === 1) ? bg2_Tebing3_X : 0;
                let t3OffsetY = (i === 1) ? bg2_Tebing3_Y : 0;
                let ttOffsetX = (i === 1) ? bg2_TebingTimpa_X : 0;
                let ttOffsetY = (i === 1) ? bg2_TebingTimpa_Y : 0;
                let t4OffsetX = (i === 1) ? bg2_Tebing4_X : 0;
                let t4OffsetY = (i === 1) ? bg2_Tebing4_Y : 0;
                let currentTebingTimpaScale = (i === 1) ? bg2_TebingTimpa_Scale : tebingTimpaScale;

                if (images.tebing && images.tebing.height) {
                    ctx.drawImage(images.tebing, shift + tDasarOffsetX, tebingDrawY + tDasarOffsetY, tebingWidth, tebingDrawHeight);
                }
                if (images.tebing2 && images.tebing2.height) ctx.drawImage(images.tebing2, (posisiXTebing2 + shift) + t2OffsetX, tebing2Y + t2OffsetY, images.tebing2.width * tebing2Scale * tebing2WidthStretch, images.tebing2.height * tebing2Scale);
                if (images.tebing3 && images.tebing3.height) ctx.drawImage(images.tebing3, (posisiXTebing3 + shift) + t3OffsetX, tebing3Y + t3OffsetY, images.tebing3.width * tebing3Scale, images.tebing3.height * tebing3Scale);
                if (images.tebingTimpa && images.tebingTimpa.height) ctx.drawImage(images.tebingTimpa, (posisiXTebingTimpa + shift) + ttOffsetX, tebingTimpaY + ttOffsetY, images.tebingTimpa.width * currentTebingTimpaScale, images.tebingTimpa.height * currentTebingTimpaScale);
                if (images.tebing4 && images.tebing4.height) ctx.drawImage(images.tebing4, (posisiXTebing4 + shift) + t4OffsetX, tebing4Y + t4OffsetY, images.tebing4.width * tebing4Scale, images.tebing4.height * tebing4Scale);

                if (i === 0) {
                    if (images.jembatan && images.jembatan.height) {
                        let jembatanWidth = (holeEndX - holeStartX) + 60;
                        let jembatanHeight = images.jembatan.height * (jembatanWidth / images.jembatan.width);
                        ctx.drawImage(images.jembatan, (holeStartX - 205) + shift + tDasarOffsetX, groundY - 50 + tDasarOffsetY, jembatanWidth, jembatanHeight);
                    }
                }
            }

            let currentMercusuarImg = (isMercusuarOpen && images.mercusuarTerbuka) ? images.mercusuarTerbuka : images.mercusuarTertutup;
            if (currentMercusuarImg && currentMercusuarImg.height) {
                let mWidth1 = currentMercusuarImg.width * 0.25;
                let mHeight1 = currentMercusuarImg.height * 0.25;
                let mX1 = totalWorldWidth - mWidth1 - 150 + bg2_TebingDasar_X;
                let mY1 = groundY - mHeight1 + 10 + bg2_TebingDasar_Y;
                ctx.drawImage(currentMercusuarImg, mX1, mY1, mWidth1, mHeight1);
            }

            if (images.bataSoal && bataSoal.active) ctx.drawImage(images.bataSoal, bataSoal.x, bataSoal.y, bataSoal.width, bataSoal.height);

            if (images.kunci && kunciObj.active) {
                let floatOffset = Math.sin(Date.now() / 200) * 5;
                ctx.drawImage(images.kunci, kunciObj.x, kunciObj.y + floatOffset, kunciObj.width, kunciObj.height);
            }

            enemies.forEach(enemy => {
                if (enemy.dead) return;
                let imgEnemy = enemy.type === 'jamur' ? images.jamur : images.siput;
                if (imgEnemy && imgEnemy.height) {
                    if (enemy.type === 'siput' && enemy.speed < 0) {
                        ctx.save(); ctx.translate(enemy.x + enemy.width, enemy.y); ctx.scale(-1, 1);
                        ctx.drawImage(imgEnemy, 0, 0, enemy.width, enemy.height); ctx.restore();
                    } else {
                        ctx.drawImage(imgEnemy, enemy.x, enemy.y, enemy.width, enemy.height);
                    }
                }
            });

            if (images.semak && images.semak.height) {
                let semakScale = 0.18; 
                let semakWidth = images.semak.width * semakScale;
                let semakHeight = images.semak.height * semakScale;
                let semakPosisiX = (310 + tebingWidth) - -270;
                let semakPosisiY = getBaseGroundYAt(semakPosisiX) - semakHeight + 15;
                ctx.drawImage(images.semak, semakPosisiX, semakPosisiY, semakWidth, semakHeight);

                if (images.tandaTanya && images.tandaTanya.height && tandaTanyaSemak.active) {
                    let ttSemakWidth = 45; 
                    let ttSemakHeight = 45;
                    let ttSemakPosX = semakPosisiX + (semakWidth / 2) - (ttSemakWidth / 2);
                    let ttSemakPosY = semakPosisiY - ttSemakHeight - 40; 
                    let floatOffset = Math.sin(Date.now() / 200) * 5;
                    ctx.drawImage(images.tandaTanya, ttSemakPosX, ttSemakPosY + floatOffset, ttSemakWidth, ttSemakHeight);
                }
            }

            if (images.tanahNgambang && images.tanahNgambang.height) {
                let tnScale = 0.07; 
                let tnWidth = images.tanahNgambang.width * tnScale;
                let tnHeight = images.tanahNgambang.height * tnScale;
                let posisiX = (holeStartX - -1310);
                let posisiY = groundY - 100;
                ctx.drawImage(images.tanahNgambang, posisiX, posisiY, tnWidth, tnHeight);

                if (images.tandaTanya && images.tandaTanya.height && tandaTanyaNgambang.active) {
                    let ttWidth = 45; 
                    let ttHeight = 45; 
                    let ttPosisiX = posisiX + (tnWidth / 2) - (ttWidth / 2); 
                    let ttPosisiY = posisiY - ttHeight - 20; 
                    let floatOffset = Math.sin(Date.now() / 200) * 5;
                    ctx.drawImage(images.tandaTanya, ttPosisiX, ttPosisiY + floatOffset, ttWidth, ttHeight);
                }
            }

            ctx.restore();
        }

        function gameLoop() {
            if (advGameStarted && !isAdvGameOver && !isPausedGame) {
                updateAdventure();
                drawAdventure();
                requestAnimationFrame(gameLoop);
            }
        }

        window.addEventListener('resize', () => {
            if (document.getElementById('adventureWrapper').style.display === 'block') {
                initAdventureCanvas();
            }
        });

// Ekspos fungsi ke global window agar inline onclick/onchange tetap berfungsi 100% identik
if (typeof addControl !== 'undefined') window.addControl = addControl;
if (typeof cekJawabanKuis !== 'undefined') window.cekJawabanKuis = cekJawabanKuis;
if (typeof closeGameMap !== 'undefined') window.closeGameMap = closeGameMap;
if (typeof closeQuizSuccess !== 'undefined') window.closeQuizSuccess = closeQuizSuccess;
if (typeof drawAdventure !== 'undefined') window.drawAdventure = drawAdventure;
if (typeof finishLoading !== 'undefined') window.finishLoading = finishLoading;
if (typeof gameLoop !== 'undefined') window.gameLoop = gameLoop;
if (typeof gameOverKuis !== 'undefined') window.gameOverKuis = gameOverKuis;
if (typeof getBaseCharacter !== 'undefined') window.getBaseCharacter = getBaseCharacter;
if (typeof getBaseGroundYAt !== 'undefined') window.getBaseGroundYAt = getBaseGroundYAt;
if (typeof getPlayerGroundYAt !== 'undefined') window.getPlayerGroundYAt = getPlayerGroundYAt;
if (typeof initAdventureCanvas !== 'undefined') window.initAdventureCanvas = initAdventureCanvas;
if (typeof jalanTimerKuis !== 'undefined') window.jalanTimerKuis = jalanTimerKuis;
if (typeof kurangiNyawaAdv !== 'undefined') window.kurangiNyawaAdv = kurangiNyawaAdv;
if (typeof loadQuestion !== 'undefined') window.loadQuestion = loadQuestion;
if (typeof lompat !== 'undefined') window.lompat = lompat;
if (typeof openGameLevel !== 'undefined') window.openGameLevel = openGameLevel;
if (typeof openGameMap !== 'undefined') window.openGameMap = openGameMap;
if (typeof pausePlayerGif !== 'undefined') window.pausePlayerGif = pausePlayerGif;
if (typeof playSfx !== 'undefined') window.playSfx = playSfx;
if (typeof quitAdventure !== 'undefined') window.quitAdventure = quitAdventure;
if (typeof resetKuisLevel !== 'undefined') window.resetKuisLevel = resetKuisLevel;
if (typeof restartAdventure !== 'undefined') window.restartAdventure = restartAdventure;
if (typeof resumePlayerGif !== 'undefined') window.resumePlayerGif = resumePlayerGif;
if (typeof selectAvatar !== 'undefined') window.selectAvatar = selectAvatar;
if (typeof selectQuizOption !== 'undefined') window.selectQuizOption = selectQuizOption;
if (typeof setupBtnLanjutSoal !== 'undefined') window.setupBtnLanjutSoal = setupBtnLanjutSoal;
if (typeof startAdventureGame !== 'undefined') window.startAdventureGame = startAdventureGame;
if (typeof startCountdown !== 'undefined') window.startCountdown = startCountdown;
if (typeof syncMapLocks !== 'undefined') window.syncMapLocks = syncMapLocks;
if (typeof togglePause !== 'undefined') window.togglePause = togglePause;
if (typeof toggleSound !== 'undefined') window.toggleSound = toggleSound;
if (typeof triggerGameOverAdventure !== 'undefined') window.triggerGameOverAdventure = triggerGameOverAdventure;
if (typeof triggerQuizModal !== 'undefined') window.triggerQuizModal = triggerQuizModal;
if (typeof updateAdventure !== 'undefined') window.updateAdventure = updateAdventure;
if (typeof updateUINyawa !== 'undefined') window.updateUINyawa = updateUINyawa;
if (typeof updateUISkor !== 'undefined') window.updateUISkor = updateUISkor;
if (typeof updateUITimer !== 'undefined') window.updateUITimer = updateUITimer;
if (typeof waktuHabis !== 'undefined') window.waktuHabis = waktuHabis;
if (typeof sfxClick !== 'undefined') window.sfxClick = sfxClick;
if (typeof bgm !== 'undefined') window.bgm = bgm;
`
        );
        runPageScript(
            sandboxWindow,
            sandboxDocument,
            sandboxWindow.setInterval,
            sandboxWindow.clearInterval,
            sandboxWindow.setTimeout,
            sandboxWindow.clearTimeout,
            sandboxWindow.requestAnimationFrame,
            sandboxWindow.cancelAnimationFrame,
            sandboxWindow.Audio,
            navigate
        );
    } catch (err) {
        console.warn('[initGamePage] Script init warning:', err);
    }

    return () => {
        cleanup();
    };
}