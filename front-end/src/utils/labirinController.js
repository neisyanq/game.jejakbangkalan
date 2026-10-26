/**
 * Controller Interaktif Teroptimasi (initLabirinPage)
 * Dilengkapi Runtime Sandbox agar bebas memory leak, bebas lag, dan mendukung penuh React SPA
 */
import { syncAuthDOM, bindAuthForms } from './authDomSync';
import { createPageSandbox } from './runtimeSandbox';

export function initLabirinPage(navigate) {
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
        AOS.init({ once: true, offset: 50 });

        function selectAvatar(avatarValue, element) {
            playSfx(sfxClick); 
            const cards = document.querySelectorAll('.char-card');
            cards.forEach(card => card.classList.remove('selected'));
            element.classList.add('selected');
        }

        // ========================================================
        // AUDIO & SOUND SYSTEM (BGM & SFX)
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

        const sfxStep = new Audio('/sound/click.mp3');
        sfxStep.volume = 0.2;

        let isMuted = false;
        let isPaused = false;
        let lastStepTime = 0;

        function playSfx(audioObj) {
            if (!isMuted && audioObj) {
                audioObj.currentTime = 0;
                audioObj.play().catch(e => console.log("Audio play di-block browser: ", e));
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
                if (advGameStarted && !isPaused) bgm.play();
                btnMute.style.backgroundImage = "url('/img/labirin/suara.png')";
            }
        }

        function togglePause() {
            playSfx(sfxClick);
            isPaused = !isPaused;
            const btnPause = document.getElementById('btnPause');
            if (isPaused) {
                advGameStarted = false; 
                bgm.pause();
                btnPause.style.backgroundImage = "url('/img/labirin/play.png')";
            } else {
                advGameStarted = true; 
                if (!isMuted) bgm.play();
                btnPause.style.backgroundImage = "url('/img/labirin/pause.png')";
                requestAnimationFrame(gameLoop);
            }
        }

        // ========================================================
        // 1. DATABASE KUIS (30 SOAL LENGKAP)
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
        // 2. ENGINE GAME LABIRIN TOP-DOWN
        // ========================================================
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const playerSprite = document.getElementById('playerSprite');

        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        const images = {};
        const imagePaths = {
            bgMaze: '/img/labirin/labirin background.png',
            maze: '/img/labirin/labirin.png',
            kunci: '/img/labirin/kunci.png',
            tanya: '/img/labirin/tanda tanya.png',
            pintuTutup: '/img/labirin/pintu tertutup.png',
            pintuBuka: '/img/labirin/pintu terbuka.png'
        };

        function getBaseCharacter() {
            if (typeof userAvatarGlobal !== 'undefined' && (userAvatarGlobal.toLowerCase().includes('avatar2') || userAvatarGlobal.toLowerCase().includes('marlena'))) {
                return 'marlena';
            }
            return 'sakera';
        }

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
            playerSprite.src = "/img/labirin/" + getBaseCharacter() + ".gif";
            drawMazeToOffscreen();
        }

        let advGameStarted = false;
        let isAdvGameOver = false;

        // BACA LEVEL DARI URL
        const urlParams = new URLSearchParams(window.location.search);
        let currentLevel = parseInt(urlParams.get('level')) || 2; // Labirin umumnya level 2, 5, 8

        let score = 0, lives = 3, facingRight = true;
        let hasKey = false;

        let quiz1Solved = false;
        let quiz2Solved = false;
        let quiz3Solved = false;
        let activeQuizIndex = 0;

        let player = {
            x: 100, y: 100,
            width: 50, height: 80, 
            speed: 5, dx: 0, dy: 0
        };

        let kunciObj = { x: 0, y: 0, width: 45, height: 45, active: true };
        let tanyaObj = { x: 0, y: 0, width: 50, height: 50, active: true };
        let tanyaObj2 = { x: 0, y: 0, width: 50, height: 50, active: true };
        let tanyaObj3 = { x: 0, y: 0, width: 50, height: 50, active: true };
        let pintuObj = { x: 0, y: 0, width: 100, height: 120, status: 'tertutup' };

        const keys = { up: false, down: false, left: false, right: false };

        window.addEventListener('keydown', (e) => {
            if (!advGameStarted || isPaused) return;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
        });

        window.addEventListener('keyup', (e) => {
            if (!advGameStarted || isPaused) return;
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
        });

        function addControl(element, keyProp) {
            const startEvent = (e) => { e.preventDefault(); keys[keyProp] = true; };
            const endEvent = (e) => { e.preventDefault(); keys[keyProp] = false; };
            element.addEventListener('mousedown', startEvent, { passive: false });
            element.addEventListener('touchstart', startEvent, { passive: false });
            element.addEventListener('mouseup', endEvent, { passive: false });
            element.addEventListener('mouseleave', endEvent, { passive: false });
            element.addEventListener('touchend', endEvent, { passive: false });
        }
        addControl(document.getElementById('btnUp'), 'up');
        addControl(document.getElementById('btnDown'), 'down');
        addControl(document.getElementById('btnLeft'), 'left');
        addControl(document.getElementById('btnRight'), 'right');

        function initLabirinCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            offCanvas.width = canvas.width;
            offCanvas.height = canvas.height;

            baseCharKuis = getBaseCharacter();
            if (baseCharKuis === 'sakera') {
                player.width = 110;
                player.height = 80;
            } else {
                player.width = 50;
                player.height = 80;
            }

            player.x = canvas.width * 0.09;
            player.y = canvas.height * 0.38;
            player.dx = 0; player.dy = 0;

            pintuObj.x = canvas.width * 0.79;
            pintuObj.y = canvas.height * 0.37;

            tanyaObj.x = canvas.width * 0.49;
            tanyaObj.y = canvas.height * 0.59;
            tanyaObj2.x = canvas.width * 0.27;
            tanyaObj2.y = canvas.height * 0.29;
            tanyaObj3.x = (canvas.width * 0.64) - 2;
            tanyaObj3.y = canvas.height * 0.443;

            kunciObj.x = canvas.width * 0.19;
            kunciObj.y = canvas.height * 0.2;

            drawMazeToOffscreen();
            drawLabirin();

            // Set Data Soal Level Saat ini
            activeLevelData = quizDatabase[currentLevel] || quizDatabase[2];
        }

        window.onload = () => {
            initLabirinCanvas();
        };

        function startCountdown() {
            playSfx(sfxClick);
            document.getElementById('advStartScreen').style.display = 'none';
            let overlay = document.getElementById('countdownOverlay');
            let text = document.getElementById('countdownText');
            overlay.style.display = 'flex';

            playSfx(sfx321); 
            let count = 3; text.innerText = count;

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
            document.getElementById('gameCtrlUI').style.display = 'flex'; 

            document.getElementById('gameTitleUI').style.display = 'block';

            playerSprite.style.display = 'block';
            advGameStarted = true;
            isAdvGameOver = false;

            if (!isMuted) bgm.play(); 

            requestAnimationFrame(gameLoop);
        }

        function restartAdventure() {
            playSfx(sfxClick);
            document.getElementById('advGameOverScreen').style.display = 'none';

            hasKey = false;
            quiz1Solved = false;
            quiz2Solved = false;
            quiz3Solved = false;

            kunciObj.active = true;
            tanyaObj.active = true;
            tanyaObj2.active = true;
            tanyaObj3.active = true;
            pintuObj.status = 'tertutup';

            score = 0;
            lives = 3;
            document.getElementById('advScoreDisplay').innerText = score;

            let heartsHtml = '';
            for (let i = 0; i < lives; i++) heartsHtml += '<span class="heart-icon">❤️</span> ';
            document.getElementById('advLivesContainer').innerHTML = heartsHtml;

            bgm.pause();
            bgm.currentTime = 0;

            initLabirinCanvas();
            startCountdown();
        }

        function isWallTabrakan(nextX, nextY) {
            if (!images.maze) return false;

            let hW = 8;
            let hH = 8;
            let hX = nextX + (player.width / 2) - (hW / 2);
            let hY = nextY + player.height - hH - 2;

            if (hX < 0 || hX + hW > offCanvas.width || hY < 0 || hY + hH > offCanvas.height) return true;

            let batasKananRumah = canvas.width * 0.22;
            let batasBawahRumah = canvas.height * 0.28;
            if (hX < batasKananRumah && hY < batasBawahRumah) return true;

            let imgData = offCtx.getImageData(hX, hY, hW, hH).data;
            for (let i = 3; i < imgData.length; i += 4) {
                if (imgData[i] > 10) return true;
            }
            return false;
        }

        function updateAdventure() {
            if (isAdvGameOver || !advGameStarted || isPaused) return;

            if (keys.up) player.dy = -player.speed;
            else if (keys.down) player.dy = player.speed;
            else player.dy = 0;

            if (keys.left) { player.dx = -player.speed; facingRight = false; }
            else if (keys.right) { player.dx = player.speed; facingRight = true; }
            else player.dx = 0;

            let nextX = player.x + player.dx;
            let nextY = player.y + player.dy;

            if (nextX < 0) nextX = 0;
            if (nextX + player.width > canvas.width) nextX = canvas.width - player.width;
            if (nextY < 0) nextY = 0;
            if (nextY + player.height > canvas.height) nextY = canvas.height - player.height;

            if (!isWallTabrakan(nextX, nextY)) {
                player.x = nextX;
                player.y = nextY;
            } else {
                if (!isWallTabrakan(nextX, player.y)) {
                    player.x = nextX;
                } else if (!isWallTabrakan(player.x, nextY)) {
                    player.y = nextY;
                }
            }

            if (player.dx !== 0 || player.dy !== 0) {
                if (Date.now() - lastStepTime > 300) {
                    playSfx(sfxStep);
                    lastStepTime = Date.now();
                }
            }

            playerSprite.style.left = player.x + 'px';
            playerSprite.style.top = player.y + 'px';
            playerSprite.style.width = player.width + 'px';
            playerSprite.style.height = player.height + 'px';
            playerSprite.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';

            let interX = player.x + (player.width / 2) - 25; 
            let interObj = { x: interX, y: player.y, width: 50, height: player.height };

            if (kunciObj.active && intersectRect(interObj, kunciObj)) {
                playSfx(sfxBerhasil);
                kunciObj.active = false;
                hasKey = true;
                if (quiz1Solved && quiz2Solved && quiz3Solved) {
                    pintuObj.status = 'terbuka';
                    playSfx(sfxLevelBuka);
                }
            }

            if (tanyaObj.active && intersectRect(interObj, tanyaObj)) {
                playSfx(sfxClick);
                tanyaObj.active = false;
                triggerQuizModal(0); 
            }

            if (tanyaObj2.active && intersectRect(interObj, tanyaObj2)) {
                playSfx(sfxClick);
                tanyaObj2.active = false;
                triggerQuizModal(1); 
            }

            if (tanyaObj3.active && intersectRect(interObj, tanyaObj3)) {
                playSfx(sfxClick);
                tanyaObj3.active = false;
                triggerQuizModal(2); 
            }

            if (intersectRect(interObj, pintuObj)) {
                if (pintuObj.status === 'terbuka') {
                    bgm.pause();
                    playSfx(sfxWin); 
                    advGameStarted = false;
                    document.getElementById('gameOverTitle').innerText = "LEVEL SELESAI!";
                    document.getElementById('gameOverTitle').style.color = "#FFD700";
                    
                    let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel_sakera')) || 1;
                    if (currentLevel === unlockedLevel && unlockedLevel < 10) {
                        localStorage.setItem('unlockedLevel_sakera', unlockedLevel + 1);
                    }
                    
                    triggerGameOverAdventure();
                } else {
                    if (player.dx > 0) player.x -= player.speed * 2;
                    if (player.dx < 0) player.x += player.speed * 2;
                    if (player.dy > 0) player.y -= player.speed * 2;
                    if (player.dy < 0) player.y += player.speed * 2;
                }
            }
        }

        function intersectRect(r1, r2) {
            return !(r2.x > r1.x + r1.width ||
                r2.x + r2.width < r1.x ||
                r2.y > r1.y + r1.height ||
                r2.y + r2.height < r1.y);
        }

        function triggerGameOverAdventure() {
            isAdvGameOver = true;
            advGameStarted = false;
            document.getElementById('advFinalScore').innerText = score + skorKuis;
            document.getElementById('advGameOverScreen').style.display = 'flex';
            document.getElementById('controlsContainer').style.display = 'none';
            document.getElementById('gameCtrlUI').style.display = 'none'; 
            document.getElementById('gameTitleUI').style.display = 'none';
            playerSprite.style.display = 'none';
        }

        function drawMazeToOffscreen() {
            if (!images.maze || !images.maze.height) return;
            offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
            let originalWidth = images.maze.width;
            let originalHeight = images.maze.height;
            let scaleSize = 0.95;
            let scale = Math.min((offCanvas.width * scaleSize) / originalWidth, (offCanvas.height * scaleSize) / originalHeight);
            let pelebarSamping = 1.3;
            let labirinWidth = (originalWidth * scale) * pelebarSamping;
            let labirinHeight = originalHeight * scale;
            let posX = (offCanvas.width - labirinWidth) / 2;
            let posY = (offCanvas.height - labirinHeight) / 2;
            posY = posY + 50;
            offCtx.drawImage(images.maze, posX, posY, labirinWidth, labirinHeight);
        }

        function drawLabirin() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (images.bgMaze && images.bgMaze.height) {
                ctx.drawImage(images.bgMaze, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = "#87CEEB"; ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            if (images.maze && images.maze.height) {
                let originalWidth = images.maze.width;
                let originalHeight = images.maze.height;
                let scaleSize = 0.95;
                let scale = Math.min((canvas.width * scaleSize) / originalWidth, (canvas.height * scaleSize) / originalHeight);
                let pelebarSamping = 1.3;
                let labirinWidth = (originalWidth * scale) * pelebarSamping;
                let labirinHeight = originalHeight * scale;
                let posX = (canvas.width - labirinWidth) / 2;
                let posY = (canvas.height - labirinHeight) / 2;
                posY = posY + 50;
                ctx.drawImage(images.maze, posX, posY, labirinWidth, labirinHeight);
            }

            if (kunciObj.active && images.kunci) {
                let floatOffset = Math.sin(Date.now() / 200) * 5;
                ctx.drawImage(images.kunci, kunciObj.x, kunciObj.y + floatOffset, kunciObj.width, kunciObj.height);
            }
            if (tanyaObj.active && images.tanya) {
                let floatOffset = Math.sin(Date.now() / 200) * 5;
                ctx.drawImage(images.tanya, tanyaObj.x, tanyaObj.y + floatOffset, tanyaObj.width, tanyaObj.height);
            }
            if (tanyaObj2.active && images.tanya) {
                let floatOffset = Math.sin(Date.now() / 200) * 5;
                ctx.drawImage(images.tanya, tanyaObj2.x, tanyaObj2.y + floatOffset, tanyaObj2.width, tanyaObj2.height);
            }
            if (tanyaObj3.active && images.tanya) {
                let floatOffset = Math.sin(Date.now() / 200) * 5;
                ctx.drawImage(images.tanya, tanyaObj3.x, tanyaObj3.y + floatOffset, tanyaObj3.width, tanyaObj3.height);
            }

            let imgPintu = (pintuObj.status === 'terbuka') ? images.pintuBuka : images.pintuTutup;
            if (imgPintu) {
                ctx.drawImage(imgPintu, pintuObj.x, pintuObj.y, pintuObj.width, pintuObj.height);
            }
        }

        function gameLoop() {
            if (advGameStarted && !isAdvGameOver) {
                updateAdventure();
                drawLabirin();
                requestAnimationFrame(gameLoop);
            }
        }

        window.addEventListener('resize', () => {
            if (document.getElementById('adventureWrapper').style.display === 'block') {
                initLabirinCanvas();
            }
        });

        // ========================================================
        // 3. LOGIKA KUIS SPESIFIK (1 KOTAK = 1 SOAL)
        // ========================================================
        let kuisTimer, waktuKuis = 60, nyawaKuis = 7, skorKuis = 0;
        let isKuisSelesai = false;
        let baseCharKuis = 'sakera';
        let activeLevelData = [];

        function triggerQuizModal(qIndex) {
            advGameStarted = false;
            if (!isMuted) bgm.pause();
            player.dx = 0; player.dy = 0;
            keys.up = false; keys.down = false; keys.left = false; keys.right = false;

            activeQuizIndex = qIndex; 

            const lvlPage = document.getElementById('gameLevelPage');
            lvlPage.style.display = 'block';
            setTimeout(() => { lvlPage.classList.add('active'); }, 50);

            resetKuisLevel();
        }

        function closeQuizSuccess() {
            playSfx(sfxClick);
            const lvlPage = document.getElementById('gameLevelPage');
            lvlPage.classList.remove('active');
            setTimeout(() => {
                lvlPage.style.display = 'none';

                let semuaSelesai = (quiz1Solved && quiz2Solved && quiz3Solved);
                if (hasKey && semuaSelesai && pintuObj.status !== 'terbuka') {
                    pintuObj.status = 'terbuka';
                    playSfx(sfxLevelBuka); 
                }

                advGameStarted = true;
                if (!isMuted && !isPaused) bgm.play().catch(e => console.log(e));
                requestAnimationFrame(gameLoop);
            }, 400);
        }

        function resetKuisLevel() {
            waktuKuis = 60; isKuisSelesai = false;
            document.getElementById('gl-level-text').innerText = 'Level ' + currentLevel;
            updateUINyawa(); updateUISkor(); updateUITimer();
            loadQuestion();
        }

        function loadQuestion() {
            waktuKuis = 60; updateUITimer(); isKuisSelesai = false;
            const qData = activeLevelData[activeQuizIndex];

            document.getElementById('gl-question-counter').innerText = \`Kuis Kotak \${activeQuizIndex + 1}/3\`;
            document.getElementById('quizQuestionText').innerText = qData.q;
            document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_berfikir.png';
            document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#5A110E; font-size:1.2rem;">Hmm...</strong><br>Ayo bantu aku menjawab pertanyaan ini! Waktumu cuma 1 menit!';

            const optsCont = document.getElementById('quizOptionsContainer');
            let optsHTML = '';
            for (const [key, value] of Object.entries(qData.opts)) {
                optsHTML += \`<label class="gl-option" onclick="selectQuizOption(this)"><input type="radio" name="kuisOpt" value="\${key}"><div class="gl-option-letter">\${key}</div><div class="gl-option-text">\${value}</div><div class="gl-check"><i class="fa-solid fa-check"></i></div></label>\`;
            }
            optsCont.innerHTML = optsHTML;

            document.getElementById('quizPaginationContainer').innerHTML = '';

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

            if (nyawaKuis <= 0) {
                document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#5A110E; font-size:1.2rem;">Waktu Habis!</strong><br>Sayang sekali, kita kehabisan waktu dan nyawamu habis.';
                gameOverKuis();
            } else {
                document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#5A110E; font-size:1.2rem;">Waktu Habis!</strong><br>Nyawamu berkurang 1. Ayo coba lagi!';
                setupBtnCobaLagi();
            }
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
            const correctAns = activeLevelData[activeQuizIndex].ans;

            if (sel.value === correctAns) {
                if (selectedLabel) selectedLabel.classList.add('correct');
                if (selectedIcon) selectedIcon.className = 'fa-solid fa-check';

                playSfx(sfxBenar); 
                skorKuis += 20; updateUISkor();

                if (activeQuizIndex === 0) quiz1Solved = true;
                if (activeQuizIndex === 1) quiz2Solved = true;
                if (activeQuizIndex === 2) quiz3Solved = true;

                let semuaSelesai = (quiz1Solved && quiz2Solved && quiz3Solved);
                let msg = (hasKey && semuaSelesai) ? "Pintu mercusuar sekarang telah TERBUKA!" : "Terus kumpulkan kunci dan jawab kuis di kotak lainnya!";

                document.getElementById('kuisCharacterImg').src = '/img/game/' + baseCharKuis + '_betul.png';
                document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#28a745; font-size:1.2rem;"><i class="fa-solid fa-circle-check me-1"></i>Hebat, Jawaban Benar!</strong><br>Jawabanmu tepat! ' + msg;

                const btn = document.getElementById('btnJawabKuis');
                btn.innerHTML = 'Lanjut Jelajah <i class="fa-solid fa-person-running ms-1"></i>';
                btn.onclick = closeQuizSuccess;

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
                    document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#dc3545; font-size:1.2rem;"><i class="fa-solid fa-circle-xmark me-1"></i>Game Over!</strong><br>Jawaban salah dan nyawamu habis. Kamu harus mengulang level!';
                    gameOverKuis();
                } else {
                    document.getElementById('kuisSpeechBubble').innerHTML = '<strong style="color:#dc3545; font-size:1.2rem;"><i class="fa-solid fa-circle-xmark me-1"></i>Yahh, Jawaban Salah!</strong><br>Jawaban kamu kurang tepat. Jangan menyerah, ayo coba lagi!';
                    setupBtnCobaLagi();
                }
            }
        }

        function setupBtnCobaLagi() {
            const btn = document.getElementById('btnJawabKuis');
            btn.innerHTML = 'Coba Lagi <i class="fa-solid fa-rotate-right ms-1"></i>';
            btn.onclick = () => {
                playSfx(sfxClick);
                loadQuestion();
            };
        }

        function gameOverKuis() {
            playSfx(sfxKalah);
            const btn = document.getElementById('btnJawabKuis');
            btn.innerHTML = 'Ulang Level <i class="fa-solid fa-rotate-right ms-1"></i>';
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

// Ekspos fungsi ke global window
if (typeof addControl !== 'undefined') window.addControl = addControl;
if (typeof cekJawabanKuis !== 'undefined') window.cekJawabanKuis = cekJawabanKuis;
if (typeof closeQuizSuccess !== 'undefined') window.closeQuizSuccess = closeQuizSuccess;
if (typeof drawLabirin !== 'undefined') window.drawLabirin = drawLabirin;
if (typeof drawMazeToOffscreen !== 'undefined') window.drawMazeToOffscreen = drawMazeToOffscreen;
if (typeof finishLoading !== 'undefined') window.finishLoading = finishLoading;
if (typeof gameLoop !== 'undefined') window.gameLoop = gameLoop;
if (typeof gameOverKuis !== 'undefined') window.gameOverKuis = gameOverKuis;
if (typeof getBaseCharacter !== 'undefined') window.getBaseCharacter = getBaseCharacter;
if (typeof initLabirinCanvas !== 'undefined') window.initLabirinCanvas = initLabirinCanvas;
if (typeof intersectRect !== 'undefined') window.intersectRect = intersectRect;
if (typeof isWallTabrakan !== 'undefined') window.isWallTabrakan = isWallTabrakan;
if (typeof jalanTimerKuis !== 'undefined') window.jalanTimerKuis = jalanTimerKuis;
if (typeof loadQuestion !== 'undefined') window.loadQuestion = loadQuestion;
if (typeof playSfx !== 'undefined') window.playSfx = playSfx;
if (typeof resetKuisLevel !== 'undefined') window.resetKuisLevel = resetKuisLevel;
if (typeof restartAdventure !== 'undefined') window.restartAdventure = restartAdventure;
if (typeof selectAvatar !== 'undefined') window.selectAvatar = selectAvatar;
if (typeof selectQuizOption !== 'undefined') window.selectQuizOption = selectQuizOption;
if (typeof setupBtnCobaLagi !== 'undefined') window.setupBtnCobaLagi = setupBtnCobaLagi;
if (typeof startAdventureGame !== 'undefined') window.startAdventureGame = startAdventureGame;
if (typeof startCountdown !== 'undefined') window.startCountdown = startCountdown;
if (typeof toggleMute !== 'undefined') window.toggleMute = toggleMute;
if (typeof togglePause !== 'undefined') window.togglePause = togglePause;
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
        console.warn('[initLabirinPage] Script init warning:', err);
    }

    return () => {
        cleanup();
    };
}