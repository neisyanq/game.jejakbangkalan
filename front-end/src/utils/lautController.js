/**
 * Controller Interaktif Teroptimasi (initLautPage)
 * Dilengkapi Runtime Sandbox agar bebas memory leak, bebas lag, dan mendukung penuh React SPA
 */
import { syncAuthDOM, bindAuthForms } from './authDomSync';
import { createPageSandbox } from './runtimeSandbox';

export function initLautPage(navigate) {
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
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const playerSprite = document.getElementById('playerSprite');

        // BACA LEVEL DARI URL AGAR TERSIMPAN BENAR
        let currentLevel = 3; // Laut umumnya level 3, 6, 9
        try {
            const urlParams = new URLSearchParams(window.location.search);
            currentLevel = parseInt(urlParams.get('level')) || 3;
            document.getElementById('gl-level-text').innerText = 'Level ' + currentLevel;
        } catch(e){}

        // MENYESUAIKAN AVATAR KUIS
        function getBaseCharacter() {
            if (typeof userAvatarGlobal !== 'undefined' && (userAvatarGlobal.toLowerCase().includes('avatar2') || userAvatarGlobal.toLowerCase().includes('marlena'))) return 'marlena';
            return 'sakera';
        }
        let baseCharKuis = getBaseCharacter();

        // ================= ASET GAMBAR =================
        const imgSakeraDive = '/img/laut/gif nyelam.gif';

        const images = {};
        const imagePaths = {
            bg1: '/img/laut/backgroundnya.png',
            ikan1: '/img/laut/ikan1.png',
            ikan2: '/img/laut/ikan2.png',
            ikan3: '/img/laut/ikan3.png',
            ikan4: '/img/laut/ikan4.png',
            ikan5: '/img/laut/ikan5.png',
            ikan6: '/img/laut/ikan6.png',
            sakeraDive: imgSakeraDive,
            peti: '/img/laut/peti.png'
        };

        let currentSprite = '';
        let loadedImages = 0;
        let totalImages = Object.keys(imagePaths).length;

        document.getElementById('loadingText').style.display = 'block';

        for (let key in imagePaths) {
            images[key] = new Image();
            images[key].src = imagePaths[key];
            images[key].onload = () => {
                loadedImages++;
                if (loadedImages >= totalImages) finishLoading();
            };
            images[key].onerror = () => {
                loadedImages++;
                if (loadedImages >= totalImages) finishLoading();
            }
        }

        function finishLoading() {
            document.getElementById('loadingText').style.display = 'none';
            document.getElementById('playBtnCss').style.display = 'block';
            initLevel();
        }

        // ========================================================
        // AUDIO & SOUND SYSTEM 
        // ========================================================
        const bgm = new Audio('/sound/backsound_laut.mp3');
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

        sfxKalah.volume = 0.7;
        sfxBerhasil.volume = 0.7;

        let isMuted = false;
        let isPaused = false;

        function playSfx(audioObj) {
            if (!isMuted && audioObj) {
                audioObj.currentTime = 0;
                audioObj.play().catch(e => console.log(e));
            }
        }

        function toggleMute() {
            playSfx(sfxClick);
            isMuted = !isMuted;
            const btnMute = document.getElementById('btnMute');
            if (isMuted) {
                bgm.pause();
                btnMute.style.backgroundImage = "url('/img/labirin/mute.png')";
            } else {
                if (gameStarted && !isPaused) bgm.play().catch(e => console.log(e));
                btnMute.style.backgroundImage = "url('/img/labirin/suara.png')";
            }
        }

        function togglePause() {
            playSfx(sfxClick);
            if (!gameStarted && !isPaused) return; 
            isPaused = !isPaused;
            const btnPause = document.getElementById('btnPause');
            if (isPaused) {
                bgm.pause();
                btnPause.style.backgroundImage = "url('/img/labirin/play.png')";
            } else {
                if (!isMuted) bgm.play().catch(e => console.log(e));
                btnPause.style.backgroundImage = "url('/img/labirin/pause.png')";
                requestAnimationFrame(gameLoop);
            }
        }

        // ================= RESOLUSI & VARIABEL GLOBAL =================
        const NATIVE_HEIGHT = 600;
        let cssScale = 1;
        let totalWorldWidth = 3500;
        let cameraX = 0;
        let cameraY = 0;
        let gameStarted = false;

        let score = 0;
        let lives = 3;
        let gameOver = false;
        let isInvincible = false;
        let facingRight = true;

        let player = {
            x: 100,
            y: NATIVE_HEIGHT / 2,
            width: 115,
            height: 145,
            speed: 7,
            dx: 0,
            dy: 0,
            rotation: 0
        };

        let enemies = [];
        let items = [];

        // ================= DATABASE SOAL KUIS (30 SOAL LENGKAP) =================
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

        let activeLevelData = quizDatabase[currentLevel] || quizDatabase[3];

        let kuisTimer, waktuKuis = 60;
        let isKuisSelesai = false;
        let currentQuestionIndex = 0;

        function changeSprite(newSrc) {
            if (currentSprite !== newSrc) {
                let randomParam = "?t=" + new Date().getTime();
                playerSprite.src = newSrc + (newSrc.includes(".gif") ? randomParam : "");
                currentSprite = newSrc;
            }
        }

        // ================= KONTROL & ANALOG JOYSTICK =================
        const keys = { right: false, left: false, down: false, up: false };
        let joyVec = { x: 0, y: 0, active: false };
        let oxygen = 100;
        let boostTime = 0;
        let sonarWave = { active: false, radius: 0, maxRadius: 900 };
        let bubbles = [];

        const minimapCanvas = document.getElementById('minimapCanvas');
        const minimapCtx = minimapCanvas.getContext('2d');

        window.addEventListener('keydown', (e) => {
            if (!gameStarted || isPaused) return;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') keys.up = true;
            if (e.key === 'Shift') triggerBoostDash();
            if (e.key === 'r' || e.key === 'R') triggerSonarPing();
        });

        window.addEventListener('keyup', (e) => {
            // Jangan abaikan keyup ketika kuis membuka overlay; jika diabaikan,
            // tombol gerak bisa tertahan dan karakter berenang sendiri.
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') keys.up = false;
        });

        (function initJoystick() {
            const zone = document.getElementById('joystickZone');
            const knob = document.getElementById('joystickKnob');
            if (!zone || !knob) return;
            const maxDist = 44;
            let dragging = false;

            function handleMove(clientX, clientY) {
                if (!gameStarted) return;
                const rect = zone.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                let dx = clientX - centerX;
                let dy = clientY - centerY;
                const dist = Math.hypot(dx, dy);

                if (dist > maxDist) { dx = (dx / dist) * maxDist; dy = (dy / dist) * maxDist; }
                knob.style.transform = \`translate(\${dx}px, \${dy}px)\`;
                joyVec.x = dx / maxDist;
                joyVec.y = dy / maxDist;
                joyVec.active = dist > 6;
                keys.right = joyVec.x > 0.25;
                keys.left = joyVec.x < -0.25;
                keys.down = joyVec.y > 0.25;
                keys.up = joyVec.y < -0.25;
            }
            function resetJoystick() {
                dragging = false; knob.style.transform = 'translate(0px, 0px)';
                joyVec.x = 0; joyVec.y = 0; joyVec.active = false;
                keys.right = keys.left = keys.up = keys.down = false;
            }

            zone.addEventListener('mousedown', (e) => { e.preventDefault(); dragging = true; handleMove(e.clientX, e.clientY); });
            window.addEventListener('mousemove', (e) => { if (dragging) handleMove(e.clientX, e.clientY); });
            window.addEventListener('mouseup', () => { if (dragging) resetJoystick(); });
            zone.addEventListener('touchstart', (e) => { e.preventDefault(); dragging = true; const t = e.touches[0]; handleMove(t.clientX, t.clientY); }, { passive: false });
            zone.addEventListener('touchmove', (e) => { e.preventDefault(); if (!dragging) return; const t = e.touches[0]; handleMove(t.clientX, t.clientY); }, { passive: false });
            zone.addEventListener('touchend', resetJoystick);
            zone.addEventListener('touchcancel', resetJoystick);
        })();

        function triggerBoostDash() {
            if (!gameStarted || isPaused || gameOver) return;
            const btn = document.getElementById('btnDash');
            if (btn && btn.classList.contains('cooldown')) return;
            playSfx(sfxClick);
            boostTime = 35; 
            isInvincible = true;
            setTimeout(() => { isInvincible = false; }, 700);
            for (let i = 0; i < 12; i++) {
                bubbles.push({ x: player.x + player.width / 2, y: player.y + player.height / 2 + (Math.random() * 40 - 20), r: Math.random() * 6 + 3, vy: -Math.random() * 2 - 1, alpha: 0.9 });
            }
            if (btn) { btn.classList.add('cooldown'); setTimeout(() => btn.classList.remove('cooldown'), 2500); }
        }

        function triggerSonarPing() {
            if (!gameStarted || isPaused || gameOver) return;
            const btn = document.getElementById('btnSonar');
            if (btn && btn.classList.contains('cooldown')) return;
            playSfx(sfxClick);
            sonarWave.active = true;
            sonarWave.radius = 10;
            if (btn) { btn.classList.add('cooldown'); setTimeout(() => btn.classList.remove('cooldown'), 3000); }
        }

        let floatingNoticeTimer = null;
        function showFloatingNotice(htmlText, borderColor = '#FFD700') {
            const el = document.getElementById('floatingNotice');
            if (!el) return;
            el.innerHTML = htmlText;
            el.style.borderColor = borderColor;
            el.style.display = 'block';
            clearTimeout(floatingNoticeTimer);
            floatingNoticeTimer = setTimeout(() => { el.style.display = 'none'; }, 2200);
        }

        function toggleMinimapSize(e) {
            if (e) e.stopPropagation();
            playSfx(sfxClick);
            const cont = document.getElementById('minimapContainer');
            cont.classList.toggle('expanded');
        }

        document.getElementById('minimapContainer').addEventListener('click', () => {
            triggerSonarPing();
            let nearestDist = Infinity;
            items.forEach(it => {
                if (!it.collected) {
                    const d = Math.round(Math.hypot(it.x - player.x, it.y - player.y) / 25);
                    if (d < nearestDist) nearestDist = d;
                }
            });
            if (nearestDist < Infinity) {
                showFloatingNotice(\`📡 Radar Aktif! Peti terdekat berjarak <b>\${nearestDist}m</b>\`, '#00e5ff');
            }
        });

        // ================= INISIASI LEVEL =================
        function initLevel() {
            let windowRatio = window.innerWidth / window.innerHeight;
            canvas.width = NATIVE_HEIGHT * windowRatio;
            canvas.height = NATIVE_HEIGHT;
            cssScale = window.innerHeight / NATIVE_HEIGHT;

            let startBatas = 200;
            enemies = [];
            items = [];

            let bgDrawW = canvas.width;
            let bgDrawH = (images.bg1 && images.bg1.width) ? (images.bg1.height * (bgDrawW / images.bg1.width)) : 2400;
            let maxFishY = Math.max(1800, bgDrawH - 120);
            let minFishY = 140;

            const kumpulanSpesies = [
                { type: 'ikan1', count: 16, dangerous: false },
                { type: 'ikan2', count: 14, dangerous: false },
                { type: 'ikan3', count: 18, dangerous: false },
                { type: 'ikan4', count: 16, dangerous: false },
                { type: 'ikan5', count: 14, dangerous: false },
                { type: 'ikan6', count: 18, dangerous: true } 
            ];

            let semuaIkanPool = [];
            kumpulanSpesies.forEach(sp => {
                for (let i = 0; i < sp.count; i++) { semuaIkanPool.push({ type: sp.type, dangerous: sp.dangerous }); }
            });

            for (let i = semuaIkanPool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [semuaIkanPool[i], semuaIkanPool[j]] = [semuaIkanPool[j], semuaIkanPool[i]];
            }

            let ruangBebasX = totalWorldWidth - startBatas - 180;
            let totalIkan = semuaIkanPool.length;

            semuaIkanPool.forEach((dataIkan, idx) => {
                let tipeIkan = dataIkan.type;
                let baseSlotX = startBatas + ((idx / totalIkan) * ruangBebasX);
                let randomX = Math.max(startBatas, Math.min(totalWorldWidth - 150, baseSlotX + (Math.random() * 280 - 140)));
                let letakY = minFishY + Math.random() * (maxFishY - minFishY);

                if (tipeIkan === 'ikan6' && randomX < 420 && Math.abs(letakY - (NATIVE_HEIGHT / 2)) < 180) {
                    randomX += 380;
                }

                let randomSpeed = (Math.random() * 2.6 + 1.4) * (Math.random() < 0.5 ? 1 : -1);
                if (tipeIkan === 'ikan6') randomSpeed *= 1.15; 
                let randomRange = 180 + (Math.random() * 420);
                let ikanWidth = (tipeIkan === 'ikan6') ? 64 : ((tipeIkan === 'ikan2' || tipeIkan === 'ikan4') ? 55 : 50);
                let ikanHeight = (tipeIkan === 'ikan6') ? 48 : ((tipeIkan === 'ikan2' || tipeIkan === 'ikan4') ? 40 : 35);

                enemies.push({
                    type: tipeIkan, dangerous: dataIkan.dangerous, x: randomX, y: letakY, baseY: letakY,
                    bobOffset: Math.random() * Math.PI * 2, bobSpeed: 0.025 + Math.random() * 0.03, bobAmp: 12 + Math.random() * 22,
                    width: ikanWidth, height: ikanHeight, speed: randomSpeed, startX: randomX, range: randomRange, dead: false
                });
            });

            let bgDrawWidth = canvas.width;
            let bgDrawHeight = images.bg1 ? (images.bg1.height * (bgDrawWidth / images.bg1.width)) : (NATIVE_HEIGHT * 2);
            let dasarLautPeti = Math.max(NATIVE_HEIGHT * 0.85, bgDrawHeight - 50);
            let jarakPeti = totalWorldWidth / 4;

            for (let p = 1; p <= 3; p++) {
                items.push({ type: 'peti', x: jarakPeti * p, y: dasarLautPeti - 80, width: 80, height: 80, collected: false });
            }

            changeSprite(imgSakeraDive);
            draw();
        }

        // ================= COUNTDOWN =================
        function startCountdown() {
            playSfx(sfxClick); 
            document.getElementById('startScreen').style.display = 'none';
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
                    startGame();
                }
            }, 1000);
        }

        function startGame() {
            document.getElementById('gameUI').style.display = 'block';
            document.getElementById('controlsContainer').style.display = 'flex';
            document.getElementById('actionButtonsContainer').style.display = 'flex';
            document.getElementById('minimapContainer').style.display = 'block';
            document.getElementById('gameCtrlUI').style.display = 'flex'; 
            playerSprite.style.display = 'block';
            gameStarted = true;
            isPaused = false;
            
            if (!isMuted) bgm.play().catch(e => console.log(e)); 
            requestAnimationFrame(gameLoop);
        }

        // ================= UPDATE LOGIKA KUIS =================
        function triggerQuizModal(index) {
            gameStarted = false; 
            if (!isMuted) bgm.pause();
            
            // --- TAMBAHKAN KODE RESET INI ---
            keys.up = false; keys.down = false; keys.left = false; keys.right = false;
            joyVec.active = false; joyVec.x = 0; joyVec.y = 0;
            player.dx = 0; player.dy = 0;
            const joystickKnob = document.getElementById('joystickKnob');
            if (joystickKnob) joystickKnob.style.transform = 'translate(0px, 0px)';
            // --------------------------------

            currentQuestionIndex = index;
            if (currentQuestionIndex >= activeLevelData.length) currentQuestionIndex = 0;

            const lvlPage = document.getElementById('gameLevelPage');
            lvlPage.style.display = 'block';
            setTimeout(() => { lvlPage.classList.add('active'); }, 50);

            document.getElementById('gl-health').innerText = lives;
            document.getElementById('gl-score').innerText = score;

            baseCharKuis = getBaseCharacter();
            loadQuestion();
        }

        function loadQuestion() {
            waktuKuis = 60;
            updateUITimer();
            isKuisSelesai = false;
            const qData = activeLevelData[currentQuestionIndex];

            document.getElementById('gl-question-counter').innerText = \`Pertanyaan \${currentQuestionIndex + 1}/3\`;
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
            let dotsHTML = '';
            for (let i = 0; i < 3; i++) {
                dotsHTML += (i === currentQuestionIndex) ? \`<div class="gl-dot active-diamond"></div>\` : \`<div class="gl-dot"></div>\`;
            }
            dotsCont.innerHTML = dotsHTML;

            const btn = document.getElementById('btnJawabKuis');
            btn.innerHTML = 'Jawab <i class="fa-solid fa-check ms-1"></i>';
            btn.onclick = cekJawabanKuis;

            clearInterval(kuisTimer);
            kuisTimer = setInterval(jalanTimerKuis, 1000);
        }

        function updateUITimer() {
            let m = Math.floor(waktuKuis / 60).toString().padStart(2, '0');
            let s = (waktuKuis % 60).toString().padStart(2, '0');
            document.getElementById('gl-timer').innerText = \`\${m}:\${s}\`;
        }

        function jalanTimerKuis() {
            if (isKuisSelesai) return;
            if (waktuKuis <= 5 && waktuKuis > 0) playSfx(sfxTimer);
            waktuKuis--; updateUITimer();
            if (waktuKuis <= 0) {
                isKuisSelesai = true; clearInterval(kuisTimer);
                lives--; document.getElementById('gl-health').innerText = lives;
                updateHeartsHUD();
                document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_salah.png';
                document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#5A110E; font-size:1.2rem;">Waktu Habis!</strong><br>Sayang sekali, kita kehabisan waktu dan nyawamu berkurang 1.';
                playSfx(sfxKalah); 
                
                if (lives <= 0) gameOverKuis(); else setupBtnCobaLagi();
            }
        }

        function selectQuizOption(el) {
            if (isKuisSelesai) return;
            playSfx(sfxClick);
            const options = document.getElementById('quizOptionsContainer');
            if (!options || !el) return;
            options.querySelectorAll('.gl-option').forEach(o => {
                o.classList.remove('selected');
                const radio = o.querySelector('input[type=radio]');
                if (radio) radio.checked = false;
            });
            el.classList.add('selected');
            const radio = el.querySelector('input[type=radio]');
            if (radio) radio.checked = true;
        }

        function setupBtnCobaLagi() {
            const btn = document.getElementById('btnJawabKuis');
            if (!btn) return;
            btn.innerHTML = 'Coba Lagi <i class="fa-solid fa-rotate-right ms-1"></i>';
            btn.onclick = () => {
                playSfx(sfxClick);
                // Pertahankan soal yang sama, jangan mengungkap jawaban benar.
                isKuisSelesai = false;
                const options = document.getElementById('quizOptionsContainer');
                if (options) options.querySelectorAll('.gl-option').forEach(o => {
                    o.classList.remove('selected', 'wrong', 'correct');
                    const radio = o.querySelector('input[type=radio]');
                    if (radio) radio.checked = false;
                });
                waktuKuis = 60;
                updateUITimer();
                clearInterval(kuisTimer);
                kuisTimer = setInterval(jalanTimerKuis, 1000);
                document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_berfikir.png';
                document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#5A110E; font-size:1rem;">Ayo coba lagi!</strong><br>Pilih jawabanmu dengan teliti.';
                btn.innerHTML = 'Jawab <i class="fa-solid fa-check ms-1"></i>';
                btn.onclick = cekJawabanKuis;
            };
        }

        function cekJawabanKuis() {
            if (isKuisSelesai) return;
            const sel = document.querySelector('#quizOptionsContainer .gl-option.selected input:checked');
            if (!sel) { playSfx(sfxClick); alert('Pilih jawaban terlebih dahulu!'); return; }

            clearInterval(kuisTimer);
            const selectedLabel = sel.closest('.gl-option');
            const selectedIcon = selectedLabel ? selectedLabel.querySelector('.gl-check i') : null;
            const correctAns = activeLevelData[currentQuestionIndex].ans;

            if (sel.value === correctAns) {
                isKuisSelesai = true;
                if (selectedLabel) selectedLabel.classList.add('correct');
                if (selectedIcon) selectedIcon.className = 'fa-solid fa-check';

                score += 20;
                document.getElementById('gl-score').innerText = score;
                document.getElementById('scoreDisplay').innerText = score;

                document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_betul.png';
                document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#28a745; font-size:1.2rem;"><i class="fa-solid fa-circle-check me-1"></i>Hebat, Jawaban Benar!</strong><br>Jawabanmu tepat! Kamu mendapatkan 20 poin.';
                
                // Jika benar, tombol akan berubah jadi "Lanjut Menyelam"
                setupBtnLanjutSoal();
                playSfx(sfxBenar); 
            } else {
                isKuisSelesai = true;
                if (selectedLabel) selectedLabel.classList.add('wrong');
                if (selectedIcon) selectedIcon.className = 'fa-solid fa-xmark';

                lives--; document.getElementById('gl-health').innerText = lives;
                updateHeartsHUD();

                document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_salah.png';
                playSfx(sfxSalah); 

                if (lives <= 0) {
                    document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#dc3545; font-size:1.2rem;"><i class="fa-solid fa-circle-xmark me-1"></i>Game Over!</strong><br>Jawaban salah dan nyawamu habis. Kamu harus mengulang dari awal!';
                    gameOverKuis();
                } else {
                    document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#dc3545; font-size:1.2rem;"><i class="fa-solid fa-circle-xmark me-1"></i>Yahh, Jawaban Salah!</strong><br>Jawabanmu kurang tepat. Nyawamu berkurang 1. Ayo coba lagi!';
                    
                    // Jika salah, panggil fungsi Coba Lagi
                    setupBtnCobaLagi();
                }
            }
        }

        function setupBtnLanjutSoal() {
            const btn = document.getElementById('btnJawabKuis');
            btn.innerHTML = 'Lanjut Menyelam <i class="fa-solid fa-person-swimming ms-1"></i>';
            btn.onclick = closeQuizSuccess;
        }

        function closeQuizSuccess() {
            playSfx(sfxClick);
            const lvlPage = document.getElementById('gameLevelPage');
            lvlPage.classList.remove('active');
            setTimeout(() => {
                lvlPage.style.display = 'none';
                const collectedCount = items.filter(i => i.collected).length;
                document.getElementById('chestCounterText').innerText = \`\${collectedCount}/\${items.length}\`;
                if (collectedCount >= items.length && lives > 0) {
                    showVictoryScreen();
                    return;
                }
                keys.up = keys.down = keys.left = keys.right = false;
                joyVec.active = false; joyVec.x = 0; joyVec.y = 0;
                player.dx = 0; player.dy = 0;
                gameStarted = true;
                if (!isMuted && !isPaused) bgm.play().catch(e => console.log(e));
                requestAnimationFrame(gameLoop);
            }, 400);
        }

        function showVictoryScreen() {
            gameOver = true; gameStarted = false; bgm.pause(); playSfx(sfxWin);
            
            let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel_sakera')) || 1;
            if (currentLevel === unlockedLevel && unlockedLevel < 10) {
                localStorage.setItem('unlockedLevel_sakera', unlockedLevel + 1);
            }
            
            document.getElementById('victoryScore').innerText = score;
            document.getElementById('victoryScreen').style.display = 'flex';
            document.getElementById('controlsContainer').style.display = 'none';
            document.getElementById('actionButtonsContainer').style.display = 'none';
            document.getElementById('minimapContainer').style.display = 'none';
            document.getElementById('gameCtrlUI').style.display = 'none';
            playerSprite.style.display = 'none';
        }

        function gameOverKuis() {
            playSfx(sfxKalah);
            const btn = document.getElementById('btnJawabKuis');
            btn.innerHTML = 'Ulang Petualangan <i class="fa-solid fa-rotate-right ms-1"></i>';
            btn.onclick = () => { playSfx(sfxClick); location.reload(); };
        }

        function updateHeartsHUD() {
            let heartsHtml = '';
            for (let i = 0; i < lives; i++) heartsHtml += '<span class="heart-icon">❤️</span> ';
            document.getElementById('livesContainer').innerHTML = heartsHtml;
        }

        function gameOverDisplay() {
            gameOver = true; document.getElementById('finalScore').innerText = score;
            document.getElementById('gameOverScreen').style.display = 'flex';
            document.getElementById('controlsContainer').style.display = 'none';
            document.getElementById('actionButtonsContainer').style.display = 'none';
            document.getElementById('minimapContainer').style.display = 'none';
            document.getElementById('gameCtrlUI').style.display = 'none';
            playerSprite.style.display = 'none';
            bgm.pause(); playSfx(sfxKalah);
        }

        // ================= UPDATE LOGIKA GAME LAUT =================
        function update() {
            if (gameOver || !gameStarted || isPaused) return;

            let bgDrawWidth = canvas.width;
            let bgDrawHeight = images.bg1 ? (images.bg1.height * (bgDrawWidth / images.bg1.width)) : (NATIVE_HEIGHT * 2);
            let batasPermukaan = 50;
            let dasarLaut = Math.max(NATIVE_HEIGHT * 0.85, bgDrawHeight - 50);

            let currentSpeed = player.speed;
            if (boostTime > 0) { currentSpeed = player.speed * 1.85; boostTime--; }

            let targetRotation = 0;

            if (joyVec.active) {
                player.dx = joyVec.x * currentSpeed;
                player.dy = joyVec.y * (currentSpeed * 0.85);
                if (Math.abs(joyVec.x) > 0.1) facingRight = joyVec.x > 0;
                targetRotation = joyVec.y * 35;
            } else {
                if (keys.down) { player.dy = 5; targetRotation = 35; } 
                else if (keys.up) { player.dy = -5; targetRotation = -35; } 
                else {
                    targetRotation = 0;
                    if (Math.abs(player.dy) > 0.5) player.dy *= 0.88; else player.dy = 0;
                }

                if (keys.right) { player.dx = currentSpeed; facingRight = true; }
                else if (keys.left) { player.dx = -currentSpeed; facingRight = false; }
                else { player.dx = 0; }
            }

            player.rotation += (targetRotation - player.rotation) * 0.15;

            if (player.y < batasPermukaan) { player.y = batasPermukaan; if (player.dy < 0) player.dy = 0; }
            if (player.y + player.height > dasarLaut) { player.y = dasarLaut - player.height; if (player.dy > 0) player.dy = 0; }

            player.x += player.dx;
            if (player.x < 0) player.x = 0;
            if (player.x + player.width > totalWorldWidth) player.x = totalWorldWidth - player.width;
            player.y += player.dy;

            if (player.y <= batasPermukaan + 150) oxygen = Math.min(100, oxygen + 0.5);
            else oxygen = Math.max(15, oxygen - 0.02);
            const oxyFill = document.getElementById('oxygenBarFill');
            if (oxyFill) {
                oxyFill.style.width = oxygen + '%';
                oxyFill.style.background = oxygen < 30 ? 'linear-gradient(90deg, #ff4d4d, #ff9900)' : 'linear-gradient(90deg, #00d2ff, #3a7bd5)';
            }

            if (Math.random() < 0.25) {
                bubbles.push({ x: player.x + (facingRight ? player.width * 0.7 : player.width * 0.3), y: player.y + player.height * 0.4, r: Math.random() * 4 + 2, vy: -Math.random() * 1.5 - 0.8, alpha: 0.75 });
            }
            bubbles.forEach(b => { b.y += b.vy; b.alpha -= 0.012; });
            bubbles = bubbles.filter(b => b.alpha > 0);

            if (sonarWave.active) {
                sonarWave.radius += 18;
                if (sonarWave.radius > sonarWave.maxRadius) sonarWave.active = false;
            }

            cameraX = player.x - (canvas.width / 2) + (player.width / 2);
            if (cameraX < 0) cameraX = 0;
            if (cameraX > totalWorldWidth - canvas.width) cameraX = Math.max(0, totalWorldWidth - canvas.width);

            cameraY = player.y - (canvas.height / 2) + (player.height / 2);
            if (cameraY < 0) cameraY = 0;
            let maxCamY = bgDrawHeight - canvas.height;
            if (cameraY > maxCamY) cameraY = Math.max(0, maxCamY);

            let screenPlayerX = player.x - cameraX;
            let screenPlayerY = player.y - cameraY;

            playerSprite.style.left = (screenPlayerX * cssScale) + 'px';
            playerSprite.style.top = (screenPlayerY * cssScale) + 'px';
            playerSprite.style.height = (player.height * cssScale) + 'px';
            playerSprite.style.width = 'auto';

            let flipTransform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
            playerSprite.style.transform = flipTransform + ' rotate(' + player.rotation + 'deg)';
            playerSprite.style.opacity = (isInvincible && Math.floor(Date.now() / 100) % 2 === 0) ? '0' : '1';

            items.forEach((item, index) => {
                if (item.collected) return;
                let isCollidingItem = (player.x < item.x + item.width - 20 && player.x + player.width > item.x + 20 && player.y < item.y + item.height - 20 && player.y + player.height > item.y + 20);
                if (isCollidingItem) {
                    playSfx(sfxLevelBuka); 
                    item.collected = true; 
                    const collectedCount = items.filter(i => i.collected).length;
                    document.getElementById('chestCounterText').innerText = \`\${collectedCount}/\${items.length}\`;
                    triggerQuizModal(index);
                }
            });

            enemies.forEach(enemy => {
                if (enemy.dead) return;
                enemy.x += enemy.speed;
                if (enemy.x > enemy.startX + enemy.range || enemy.x < enemy.startX - enemy.range) enemy.speed *= -1;

                if (enemy.baseY !== undefined) {
                    enemy.bobOffset += enemy.bobSpeed;
                    enemy.y = enemy.baseY + Math.sin(enemy.bobOffset) * enemy.bobAmp;
                }

                let isColliding = (player.x < enemy.x + enemy.width - 15 && player.x + player.width > enemy.x + 15 && player.y < enemy.y + enemy.height - 10 && player.y + player.height > enemy.y);
                if (isColliding) {
                    if (enemy.type === 'ikan6') {
                        if (!isInvincible) {
                            lives--; updateHeartsHUD(); playSfx(sfxSalah);
                            player.dy = -5;
                            const dmgOverlay = document.getElementById('damageOverlay');
                            if (dmgOverlay) {
                                dmgOverlay.style.opacity = '1';
                                setTimeout(() => { dmgOverlay.style.opacity = '0'; }, 350);
                            }
                            showFloatingNotice('⚠️ Awas! Terkena Ikan Berduri (Ikan 6) -1 ❤️', '#ff4d4d');
                            isInvincible = true; setTimeout(() => { isInvincible = false; }, 1500);
                            if (lives <= 0) gameOverDisplay();
                        }
                    } else {
                        if (Math.random() < 0.15) {
                            bubbles.push({ x: enemy.x + enemy.width / 2, y: enemy.y, r: Math.random() * 4 + 2, vy: -2, alpha: 0.85 });
                        }
                    }
                }
            });
        }

        // ================= RENDER GRAPHICS =================
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(-cameraX, -cameraY);

            if (images.bg1 && images.bg1.height) {
                let drawWidth = canvas.width;
                let drawHeight = images.bg1.height * (drawWidth / images.bg1.width);
                let currentBgX = 0;
                let flipBg = false;

                while (currentBgX < totalWorldWidth) {
                    ctx.save();
                    if (flipBg) {
                        ctx.translate(currentBgX + drawWidth, 0); ctx.scale(-1, 1);
                        ctx.drawImage(images.bg1, 0, 0, drawWidth, drawHeight);
                    } else {
                        ctx.drawImage(images.bg1, currentBgX, 0, drawWidth, drawHeight);
                    }
                    ctx.restore();
                    currentBgX += drawWidth;
                    flipBg = !flipBg;
                }
            }

            items.forEach(item => {
                if (item.collected) return;
                let imgItem = images[item.type];
                if (imgItem && imgItem.height) ctx.drawImage(imgItem, item.x, item.y, item.width, item.height);
            });

            enemies.forEach(enemy => {
                if (enemy.dead) return;
                let imgEnemy = images[enemy.type];
                if (imgEnemy && imgEnemy.height) {
                    ctx.save();
                    if (enemy.type === 'ikan6') {
                        ctx.shadowColor = 'rgba(255, 40, 40, 0.85)';
                        ctx.shadowBlur = 12;
                        let distToPlayer = Math.hypot((enemy.x - player.x), (enemy.y - player.y));
                        if (distToPlayer < 260) {
                            ctx.font = 'bold 14px Montserrat, sans-serif';
                            ctx.fillStyle = '#ff3b3b';
                            ctx.strokeStyle = '#000';
                            ctx.lineWidth = 3;
                            ctx.strokeText('⚠️', enemy.x + enemy.width / 2 - 8, enemy.y - 6);
                            ctx.fillText('⚠️', enemy.x + enemy.width / 2 - 8, enemy.y - 6);
                        }
                    }

                    if (enemy.speed < 0) {
                        ctx.translate(enemy.x + enemy.width, enemy.y); ctx.scale(-1, 1);
                        ctx.drawImage(imgEnemy, 0, 0, enemy.width, enemy.height);
                    } else {
                        ctx.drawImage(imgEnemy, enemy.x, enemy.y, enemy.width, enemy.height);
                    }
                    ctx.restore();
                }
            });

            bubbles.forEach(b => {
                ctx.save(); ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = \`rgba(200, 245, 255, \${b.alpha})\`; ctx.fill();
                ctx.strokeStyle = \`rgba(255, 255, 255, \${b.alpha})\`; ctx.lineWidth = 1; ctx.stroke();
                ctx.restore();
            });

            if (sonarWave.active) {
                const px = player.x + player.width / 2;
                const py = player.y + player.height / 2;
                ctx.save(); ctx.beginPath(); ctx.arc(px, py, sonarWave.radius, 0, Math.PI * 2);
                ctx.strokeStyle = \`rgba(0, 255, 213, \${1 - sonarWave.radius / sonarWave.maxRadius})\`;
                ctx.lineWidth = 4; ctx.stroke();

                items.forEach(item => {
                    if (item.collected) return;
                    ctx.beginPath(); ctx.setLineDash([8, 6]); ctx.moveTo(px, py);
                    ctx.lineTo(item.x + item.width / 2, item.y + item.height / 2);
                    ctx.strokeStyle = 'rgba(255, 215, 0, 0.75)'; ctx.lineWidth = 2.5; ctx.stroke();
                });
                ctx.restore();
            }

            ctx.restore();
            drawMinimap();
        }

        function drawMinimap() {
            if (!minimapCtx) return;
            const mw = minimapCanvas.width;
            const mh = minimapCanvas.height;
            const topPad = 24; const botPad = 20; const drawH = mh - topPad - botPad;

            let bgDrawWidth = canvas.width;
            let bgDrawHeight = images.bg1 && images.bg1.width ? (images.bg1.height * (bgDrawWidth / images.bg1.width)) : (NATIVE_HEIGHT * 2);
            let totalWorldHeight = Math.max(NATIVE_HEIGHT * 2, bgDrawHeight);

            minimapCtx.clearRect(0, 0, mw, mh);

            const grad = minimapCtx.createLinearGradient(0, topPad, 0, mh - botPad);
            grad.addColorStop(0, 'rgba(0, 170, 235, 0.9)'); grad.addColorStop(0.55, 'rgba(4, 72, 138, 0.94)'); grad.addColorStop(1, 'rgba(8, 28, 58, 0.98)');
            minimapCtx.fillStyle = grad; minimapCtx.fillRect(0, 0, mw, mh);

            minimapCtx.fillStyle = 'rgba(20, 85, 75, 0.45)';
            minimapCtx.beginPath(); minimapCtx.moveTo(0, mh - botPad);
            for (let rx = 0; rx <= mw; rx += 20) {
                let ry = (mh - botPad) - 6 - Math.sin(rx * 0.08) * 5 - Math.cos(rx * 0.03) * 4;
                minimapCtx.lineTo(rx, ry);
            }
            minimapCtx.lineTo(mw, mh - botPad); minimapCtx.closePath(); minimapCtx.fill();

            minimapCtx.strokeStyle = 'rgba(140, 230, 255, 0.14)'; minimapCtx.lineWidth = 1;
            for (let gx = mw / 4; gx < mw; gx += mw / 4) { minimapCtx.beginPath(); minimapCtx.moveTo(gx, topPad); minimapCtx.lineTo(gx, mh - botPad); minimapCtx.stroke(); }
            for (let gy = topPad + drawH / 3; gy < mh - botPad; gy += drawH / 3) { minimapCtx.beginPath(); minimapCtx.moveTo(0, gy); minimapCtx.lineTo(mw, gy); minimapCtx.stroke(); }

            const scaleX = mw / totalWorldWidth; const scaleY = drawH / totalWorldHeight;

            enemies.forEach(enemy => {
                if (enemy.dead) return;
                const ex = enemy.x * scaleX; const ey = topPad + (enemy.y * scaleY);
                if (enemy.type === 'ikan6') {
                    minimapCtx.beginPath(); minimapCtx.arc(ex, ey, 3.2, 0, Math.PI * 2);
                    minimapCtx.fillStyle = '#ff3b3b'; minimapCtx.fill();
                    minimapCtx.strokeStyle = 'rgba(255, 200, 200, 0.85)'; minimapCtx.lineWidth = 0.8; minimapCtx.stroke();
                } else {
                    minimapCtx.fillStyle = 'rgba(85, 216, 255, 0.65)'; minimapCtx.fillRect(ex - 1.2, ey - 1.2, 2.4, 2.4);
                }
            });

            const pulse = 4.5 + Math.sin(Date.now() / 160) * 1.4;
            items.forEach(item => {
                const ix = (item.x + item.width / 2) * scaleX; const iy = topPad + ((item.y + item.height / 2) * scaleY);
                minimapCtx.save(); minimapCtx.beginPath(); minimapCtx.arc(ix, iy, item.collected ? 3.2 : pulse, 0, Math.PI * 2);
                minimapCtx.fillStyle = item.collected ? 'rgba(150, 160, 170, 0.45)' : '#FFD700'; minimapCtx.fill();
                if (!item.collected) { minimapCtx.strokeStyle = '#ffffff'; minimapCtx.lineWidth = 1.3; minimapCtx.stroke(); }
                minimapCtx.restore();
            });

            const camRectX = cameraX * scaleX; const camRectY = topPad + (cameraY * scaleY);
            const camRectW = canvas.width * scaleX; const camRectH = canvas.height * scaleY;

            minimapCtx.fillStyle = 'rgba(255, 255, 255, 0.10)'; minimapCtx.fillRect(camRectX, camRectY, camRectW, camRectH);
            minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.95)'; minimapCtx.lineWidth = 1.8; minimapCtx.strokeRect(camRectX, camRectY, camRectW, camRectH);

            const px = (player.x + player.width / 2) * scaleX; const py = topPad + ((player.y + player.height / 2) * scaleY);

            minimapCtx.save(); minimapCtx.beginPath(); minimapCtx.moveTo(px, py);
            const dirSign = facingRight ? 1 : -1;
            minimapCtx.lineTo(px + dirSign * 16, py - 7); minimapCtx.lineTo(px + dirSign * 16, py + 7);
            minimapCtx.closePath(); minimapCtx.fillStyle = 'rgba(0, 255, 204, 0.28)'; minimapCtx.fill(); minimapCtx.restore();

            if (sonarWave.active) {
                minimapCtx.beginPath(); minimapCtx.arc(px, py, sonarWave.radius * scaleX, 0, Math.PI * 2);
                minimapCtx.strokeStyle = 'rgba(0, 255, 213, 0.9)'; minimapCtx.lineWidth = 1.8; minimapCtx.stroke();
            }

            minimapCtx.beginPath(); minimapCtx.arc(px, py, 5.5, 0, Math.PI * 2);
            minimapCtx.fillStyle = '#00ffcc'; minimapCtx.fill();
            minimapCtx.strokeStyle = '#ffffff'; minimapCtx.lineWidth = 2; minimapCtx.stroke();

            const coordEl = document.getElementById('minimapCoords');
            if (coordEl) { const depthM = Math.max(1, Math.round(player.y / 25)); coordEl.innerText = \`Kedalaman: \${depthM}m\`; }
        }

        function gameLoop() {
            if (!isPaused) { update(); draw(); }
            if (!gameOver && gameStarted) requestAnimationFrame(gameLoop);
        }

        window.addEventListener('resize', () => { location.reload(); });

// Ekspos fungsi ke global window 
if (typeof cekJawabanKuis !== 'undefined') window.cekJawabanKuis = cekJawabanKuis;
if (typeof changeSprite !== 'undefined') window.changeSprite = changeSprite;
if (typeof closeQuizSuccess !== 'undefined') window.closeQuizSuccess = closeQuizSuccess;
if (typeof draw !== 'undefined') window.draw = draw;
if (typeof drawMinimap !== 'undefined') window.drawMinimap = drawMinimap;
if (typeof finishLoading !== 'undefined') window.finishLoading = finishLoading;
if (typeof gameLoop !== 'undefined') window.gameLoop = gameLoop;
if (typeof gameOverDisplay !== 'undefined') window.gameOverDisplay = gameOverDisplay;
if (typeof gameOverKuis !== 'undefined') window.gameOverKuis = gameOverKuis;
if (typeof handleMove !== 'undefined') window.handleMove = handleMove;
if (typeof initJoystick !== 'undefined') window.initJoystick = initJoystick;
if (typeof initLevel !== 'undefined') window.initLevel = initLevel;
if (typeof jalanTimerKuis !== 'undefined') window.jalanTimerKuis = jalanTimerKuis;
if (typeof loadQuestion !== 'undefined') window.loadQuestion = loadQuestion;
if (typeof playSfx !== 'undefined') window.playSfx = playSfx;
if (typeof resetJoystick !== 'undefined') window.resetJoystick = resetJoystick;
if (typeof selectQuizOption !== 'undefined') window.selectQuizOption = selectQuizOption;
if (typeof setupBtnLanjutSoal !== 'undefined') window.setupBtnLanjutSoal = setupBtnLanjutSoal;
if (typeof showFloatingNotice !== 'undefined') window.showFloatingNotice = showFloatingNotice;
if (typeof showVictoryScreen !== 'undefined') window.showVictoryScreen = showVictoryScreen;
if (typeof startCountdown !== 'undefined') window.startCountdown = startCountdown;
if (typeof startGame !== 'undefined') window.startGame = startGame;
if (typeof toggleMinimapSize !== 'undefined') window.toggleMinimapSize = toggleMinimapSize;
if (typeof toggleMute !== 'undefined') window.toggleMute = toggleMute;
if (typeof togglePause !== 'undefined') window.togglePause = togglePause;
if (typeof triggerBoostDash !== 'undefined') window.triggerBoostDash = triggerBoostDash;
if (typeof triggerQuizModal !== 'undefined') window.triggerQuizModal = triggerQuizModal;
if (typeof triggerSonarPing !== 'undefined') window.triggerSonarPing = triggerSonarPing;
if (typeof update !== 'undefined') window.update = update;
if (typeof updateHeartsHUD !== 'undefined') window.updateHeartsHUD = updateHeartsHUD;
if (typeof updateUITimer !== 'undefined') window.updateUITimer = updateUITimer;
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
        console.warn('[initLautPage] Script init warning:', err);
    }

    return () => {
        cleanup();
    };
}