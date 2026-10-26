import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import pageStyles from '../assets/styles/laut.css?raw';
import { initLautPage } from '../utils/lautController.js';
import { interceptInternalLinks } from '../utils/navigationHelper';

const PAGE_HTML = `

    <!-- Layar Awal -->
    <div id="startScreen">
        <div class="title-game">
            <img loading="lazy" decoding="async" src="/img/laut/judul.png" alt="Petualangan Sakera di Laut">
        </div>
        <button id="playBtnCss" onclick="startCountdown()">▶ PLAY</button>
        <p id="loadingText">LOADING...</p>
    </div>

    <div id="countdownOverlay">
        <div id="countdownText">READY</div>
    </div>

    <!-- TOMBOL CONTROL UI (SUARA & PAUSE) -->
    <div class="game-ctrl-ui" id="gameCtrlUI">
        <button id="btnBackHome" class="ctrl-btn"
            onclick="playSfx(sfxClick); setTimeout(() => window.location.href='index.php', 300)"
            title="Kembali ke Beranda"></button>
        <button id="btnMute" class="ctrl-btn" onclick="toggleMute()" title="Mute/Unmute Suara"></button>
        <button id="btnPause" class="ctrl-btn" onclick="togglePause()" title="Pause/Play Game"></button>
    </div>

    <!-- EFEK DAMAGE MERAH & INFO POPUP -->
    <div id="damageOverlay"></div>
    <div id="floatingNotice">⚠️ Hati-hati! Ikan Berduri mengurangi nyawa!</div>

    <!-- MINIMAP KOTAK ALA MOBILE LEGENDS DI KIRI ATAS -->
    <div id="minimapContainer" title="Klik peta untuk pindah arah / Klik ikon pojok untuk perbesar">
        <div class="minimap-corner tl"></div>
        <div class="minimap-corner tr"></div>
        <div class="minimap-corner bl"></div>
        <div class="minimap-corner br"></div>
        <div id="minimapHeader">
            <span><i class="fa-solid fa-map-location-dot" style="color:#00e5ff;"></i> PETA LAUT</span>
            <span id="minimapCoords" style="color:#aeeeff;">Kedalaman: 1m</span>
            <span id="btnZoomMinimap" onclick="toggleMinimapSize(event)" title="Perbesar/Perkecil Peta" style="cursor:pointer; color:#fff; background:rgba(255,255,255,0.18); padding:1px 5px; border-radius:4px;"><i class="fa-solid fa-expand"></i></span>
        </div>
        <canvas id="minimapCanvas" width="320" height="195"></canvas>
        <div id="minimapLegend">
            <span class="legend-item"><span class="legend-dot" style="background:#00ffcc; box-shadow:0 0 4px #00ffcc;"></span>Sakera</span>
            <span class="legend-item"><span class="legend-dot" style="background:#FFD700; box-shadow:0 0 4px #FFD700;"></span>Peti</span>
            <span class="legend-item"><span class="legend-dot" style="background:#ff3b3b; box-shadow:0 0 4px #ff3b3b;"></span>Ikan6 (Bahaya)</span>
            <span class="legend-item"><span class="legend-dot" style="background:#55d8ff;"></span>Ikan Aman</span>
        </div>
    </div>

    <!-- UI -->
    <div class="game-ui" id="gameUI">
        <div id="livesContainer">
            <span class="heart-icon">❤️</span>
            <span class="heart-icon">❤️</span>
            <span class="heart-icon">❤️</span>
        </div>
        <div class="mt-2">
            <span class="star-icon">⭐</span>
            <span class="score-text" id="scoreDisplay">0</span>
        </div>
        <div class="hud-extra-row">
            <span>🧰</span>
            <span id="chestCounterText">0/3</span>
        </div>
        <div class="oxygen-bar-wrap" title="Oksigen (Naik ke permukaan untuk isi ulang)">
            <div id="oxygenBarFill"></div>
        </div>
    </div>

    <!-- Karakter -->
    <img loading="lazy" decoding="async" id="playerSprite" src="/img/laut/gif nyelam.gif" alt="Player">

    <!-- Kontrol Analog Bulet Transparan -->
    <div id="controlsContainer">
        <div id="joystickZone">
            <i class="fa-solid fa-caret-up joy-dir up"></i>
            <i class="fa-solid fa-caret-down joy-dir down"></i>
            <i class="fa-solid fa-caret-left joy-dir left"></i>
            <i class="fa-solid fa-caret-right joy-dir right"></i>
            <div id="joystickKnob"></div>
        </div>
    </div>

    <!-- Tombol Aksi Tambahan Bulet Transparan (Kanan Bawah) -->
    <div id="actionButtonsContainer">
        <button id="btnSonar" class="round-glass-btn" onclick="triggerSonarPing()" title="Radar Pencari Peti Harta Karun">
            <i class="fa-solid fa-satellite-dish"></i>
            <span>RADAR</span>
        </button>
        <button id="btnSurface" class="round-glass-btn" onmousedown="keys.up=true; playSfx(sfxClick)" onmouseup="keys.up=false" ontouchstart="keys.up=true; playSfx(sfxClick)" ontouchend="keys.up=false" title="Berenang Naik Cepat">
            <i class="fa-solid fa-angles-up"></i>
            <span>NAIK</span>
        </button>
        <button id="btnDash" class="round-glass-btn" onclick="triggerBoostDash()" title="Berenang Cepat (Turbo Dash)">
            <i class="fa-solid fa-bolt"></i>
            <span>TURBO</span>
        </button>
    </div>

    <!-- Game Over -->
    <div id="gameOverScreen">
        <h1>GAME OVER</h1>
        <p>SCORE: <span id="finalScore">0</span></p>
        <button class="btn btn-restart" onclick="playSfx(sfxClick); setTimeout(() => location.reload(), 300)">MAIN
            LAGI</button>
    </div>

    <!-- Victory Screen (Saat 3 Peti Terkumpul) -->
    <div id="victoryScreen">
        <h1>MISI SELESAI! 🏆</h1>
        <p style="font-size: 1.1rem; margin-bottom: 10px;">Semua Peti Berhasil Dijawab!</p>
        <p style="font-size: 1.3rem; color: #FFD700;">TOTAL SKOR: <span id="victoryScore">0</span></p>
        <div style="display:flex; gap: 15px;">
            <button class="btn btn-restart" onclick="playSfx(sfxClick); setTimeout(() => location.reload(), 300)">MAIN LAGI</button>
            <button class="btn btn-restart" style="background-color:#4CAF50; color:#fff;" onclick="playSfx(sfxClick); setTimeout(() => window.location.href='index.php', 300)">KEMBALI</button>
        </div>
    </div>

    <!-- ========================================================
         MODAL KUIS (OVERLAY DI ATAS GAME LAUT)
         ======================================================== -->
    <div id="gameLevelPage" class="game-level-page">
        <div class="gl-bg" style="background-image: url('/img/game/background2.png'); opacity: 0.95;"></div>
        <div class="gl-top-bar">
            <div class="gl-header-left">
                <!-- Tulisan "Harta Karun" diubah menjadi "Level 1" untuk menjaga konsistensi -->
                <div class="gl-level-info" style="background-image: url('/img/game/tombol_next.png');">
                    <i class="fa-solid fa-location-dot" style="color: #FFD700;"></i> <span id="gl-level-text">Level 1</span>
                </div>
            </div>
            <div class="gl-stats-container">
                <div class="gl-stat-item"><i class="fa-solid fa-star" style="color: #FFD700;"></i> <span
                        id="gl-score">0</span></div>
                <div class="gl-stat-divider"></div>
                <div class="gl-stat-item"><i class="fa-solid fa-heart" style="color: #FF6B6B;"></i> <span
                        id="gl-health">7</span></div>
                <div class="gl-stat-divider"></div>
                <div class="gl-stat-item"><i class="fa-solid fa-clock" style="color: #fff;"></i> <span
                        id="gl-timer">01:00</span></div>
            </div>
        </div>

        <div class="gl-content">
            <div class="gl-character-area">
                <img loading="lazy" decoding="async" id="kuisCharacterImg" src="/img/game/sakera_berfikir.png" class="gl-character-img"
                    alt="Karakter">
                <div class="gl-speech-bubble" id="kuisSpeechBubble">
                    <strong style="color:#5A110E; font-size:1.2rem;">Hmm...</strong><br>Ayo bantu aku menjawab
                    pertanyaan ini! Waktumu cuma 1 menit!
                </div>
            </div>
            <div class="gl-quiz-panel" style="background-image: url('/img/game/bingkaisoal.png');">
                <div class="gl-quiz-header" style="background-image: url('/img/game/info_soal.png');">
                    <i class="fa-solid fa-gem" style="color:#FFD700; font-size: 0.8rem;"></i> <span
                        id="gl-question-counter">Pertanyaan 1/3</span> <i class="fa-solid fa-gem"
                        style="color:#FFD700; font-size: 0.8rem;"></i>
                </div>
                <h3 class="gl-question-text" id="quizQuestionText">Soal akan muncul di sini...</h3>
                <div class="gl-options" id="quizOptionsContainer"></div>
                <div class="gl-quiz-footer mt-4">
                    <div class="gl-pagination" id="quizPaginationContainer"></div>
                    <button class="gl-btn-lanjut" id="btnJawabKuis" onclick="cekJawabanKuis()">
                        Jawab <i class="fa-solid fa-check ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <canvas id="gameCanvas"></canvas>
`;

export default function LautPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Pastikan body tidak terkunci overflow:hidden dari halaman game
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    const cleanupScript = initLautPage(navigate);
    const cleanupLinks = interceptInternalLinks(containerRef.current, navigate);

    return () => {
      if (typeof cleanupScript === 'function') cleanupScript();
      if (typeof cleanupLinks === 'function') cleanupLinks();
    };
  }, [navigate]);

  const pageStylesWithQuizFixes = `${pageStyles}
    /* Penyesuaian kuis laut: karakter lebih proporsional */
    .game-level-page .gl-character-area {
      display: flex !important;
      align-items: flex-end !important;
      justify-content: center !important;
      position: relative;
    }
    
    .game-level-page .gl-character-img {
      display: block;
      width: 100% !important;
      max-width: 280px !important; /* Perbesar max-width */
      height: auto !important; /* Biarkan tinggi menyesuaikan proporsi */
      object-fit: contain;
      position: relative;
      z-index: 2;
      bottom: 0px !important;
    }

    .game-level-page .gl-speech-bubble {
      position: absolute !important;
      top: 10% !important; /* Sesuaikan agar pas di atas kepala */
      right: -40px !important;
      width: max-content;
      max-width: 320px;
      z-index: 3;
    }
    
    @media (max-width: 700px) {
      .game-level-page .gl-character-img {
        max-width: 150px !important;
      }
      .game-level-page .gl-speech-bubble { 
        position: relative !important;
        top: 0 !important;
        right: 0 !important;
        max-width: 260px; 
      }
      .game-level-page .gl-character-area {
         flex-direction: column-reverse !important;
      }
    }
`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStylesWithQuizFixes }} />
      <div
        ref={containerRef}
        className="jejak-page-container"
        dangerouslySetInnerHTML={{ __html: PAGE_HTML }}
      />
    </>
  );
}