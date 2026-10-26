import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import pageStyles from '../assets/styles/labirin.css?raw';
import { initLabirinPage } from '../utils/labirinController.js';
import { interceptInternalLinks } from '../utils/navigationHelper';

const PAGE_HTML = `
    <div id="adventureWrapper">
        <div id="advStartScreen">
            <h1 class="title-game">LABIRIN<br>HERITAGE</h1>
            <button id="playBtnCss" onclick="startCountdown()">▶ PLAY</button>
            <p id="loadingText">LOADING...</p>
        </div>

        <div id="countdownOverlay">
            <div id="countdownText">READY</div>
        </div>

        <!-- TAMBAHAN: GAMBAR JUDUL DI ATAS TENGAH -->
        <img loading="lazy" decoding="async" id="gameTitleUI" src="/img/labirin/judul.png" alt="Judul Game">

        <!-- TOMBOL CONTROL UI (SUARA & PAUSE) -->
        <div class="game-ctrl-ui" id="gameCtrlUI">
            <!-- TAMBAHAN: TOMBOL BACK -->
            <button id="btnBackHome" class="ctrl-btn" onclick="window.location.href='index.php'"
                title="Kembali ke Beranda"></button>
            <button id="btnMute" class="ctrl-btn" onclick="toggleMute()" title="Mute/Unmute Suara"></button>
            <button id="btnPause" class="ctrl-btn" onclick="togglePause()" title="Pause/Play Game"></button>
        </div>

        <div class="adv-game-ui" id="advGameUI">
            <div id="advLivesContainer">
                <span class="heart-icon">❤️</span><span class="heart-icon">❤️</span><span class="heart-icon">❤️</span>
            </div>
            <div class="mt-2">
                <span class="star-icon">⭐</span>
                <span class="score-text" id="advScoreDisplay">0</span>
            </div>
        </div>

        <img loading="lazy" decoding="async" id="playerSprite" src="" alt="Player" style="display: none; position: absolute; z-index: 5;">

        <div id="controlsContainer">
            <div class="d-pad">
                <button id="btnUp" class="control-btn"></button>
                <button id="btnLeft" class="control-btn"></button>
                <button id="btnDown" class="control-btn"></button>
                <button id="btnRight" class="control-btn"></button>
            </div>
        </div>

        <div id="advGameOverScreen">
            <h1 id="gameOverTitle">GAME OVER</h1>
            <p>SCORE: <span id="advFinalScore">0</span></p>
            <button class="btn btn-restart" onclick="restartAdventure()">MULAI ULANG</button>
            <a href="index.php" class="btn btn-restart mt-3 bg-white" style="text-decoration: none;">KEMBALI KE
                BERANDA</a>
        </div>

        <canvas id="gameCanvas"></canvas>
    </div>
    <!-- ========================================================
         MODAL KUIS (OVERLAY DI ATAS LABIRIN)
         ======================================================== -->
    <div id="gameLevelPage" class="game-level-page">
        <div class="gl-bg" style="background-image: url('/img/game/background2.png'); opacity: 0.95;"></div>
        <div class="gl-top-bar">
            <div class="gl-header-left">
                <div class="gl-level-info" style="background-image: url('/img/game/tombol_next.png');">
                    <i class="fa-solid fa-location-dot" style="color: #FFD700;"></i> <span id="gl-level-text">Level
                        1</span>
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
    <!-- ========================================================
         MODALS (REGIS, LOGIN, CARA BERMAIN, PROFIL)
         ======================================================== -->
    <!-- Modal Register -->
    <div class="modal fade" id="gameRegisterModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content modal-game-reg">
                <div class="modal-header modal-game-header flex-column">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3"
                        data-bs-dismiss="modal"></button>
                    <h3 class="modal-game-title">Mulai Petualanganmu</h3>
                </div>
                <div class="modal-body px-4 pb-4 pt-1">
                    <form method="POST" action="">
                        <div class="row">
                            <div class="col-md-6 pe-md-3">
                                <label class="form-game-label">Nama Lengkap</label>
                                <div class="input-game-wrap"><i class="fa-regular fa-user icon-prefix"></i><input
                                        type="text" name="nama_lengkap" class="form-control input-game-icon shadow-none"
                                        required></div>
                                <label class="form-game-label">Username</label>
                                <div class="input-game-wrap"><i class="fa-regular fa-user icon-prefix"></i><input
                                        type="text" name="username" class="form-control input-game-icon shadow-none"
                                        required></div>
                                <label class="form-game-label">Email</label>
                                <div class="input-game-wrap"><i class="fa-regular fa-envelope icon-prefix"></i><input
                                        type="email" name="email" class="form-control input-game-icon shadow-none"
                                        required></div>
                            </div>
                            <div class="col-md-6 ps-md-3">
                                <label class="form-game-label">Kata Sandi</label>
                                <div class="input-game-wrap"><i class="fa-solid fa-lock icon-prefix"></i><input
                                        type="password" name="password" class="form-control input-game-icon shadow-none"
                                        required minlength="8"></div>
                                <label class="form-game-label">Jenis Kelamin</label>
                                <div class="input-game-wrap">
                                    <select name="jenis_kelamin" class="form-control input-game-icon shadow-none"
                                        required style="padding-left: 15px !important;">
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <label class="form-game-label mt-1">Pilih Avatar</label>
                                <div class="char-select-container mb-0">
                                    <label class="char-card selected" onclick="selectAvatar('avatar1.png', this)"><input
                                            type="radio" name="avatar" value="avatar1.png" required checked><img loading="lazy" decoding="async"
                                            src="/img/avatar1.png"><span>Sakera</span>
                                        <div class="char-check"><i class="fa-solid fa-check"></i></div>
                                    </label>
                                    <label class="char-card" onclick="selectAvatar('avatar2.png', this)"><input
                                            type="radio" name="avatar" value="avatar2.png" required><img loading="lazy" decoding="async"
                                            src="/img/avatar2.png"><span>Marlena</span>
                                        <div class="char-check"><i class="fa-solid fa-check"></i></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3 px-md-3">
                            <button type="submit" name="register_game" class="btn-game-submit">Daftar Akun <i
                                    class="fa-solid fa-arrow-right ms-2"></i></button>
                            <div class="game-login-link mt-2"><span>Sudah punya akun? <a href="#" data-bs-toggle="modal"
                                        data-bs-target="#gameLoginModal" data-bs-dismiss="modal">Masuk di
                                        sini</a></span></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Login -->
    <div class="modal fade" id="gameLoginModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-game-reg">
                <div class="modal-header modal-game-header flex-column">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3"
                        data-bs-dismiss="modal"></button>
                    <h3 class="modal-game-title">Selamat Datang!</h3>
                </div>
                <div class="modal-body px-4 pb-4 pt-3">
                    <form method="POST" action="">
                        <label class="form-game-label">Username atau Email</label>
                        <div class="input-game-wrap mb-3"><i class="fa-regular fa-user icon-prefix"></i><input
                                type="text" name="login_user" class="form-control input-game-icon shadow-none" required>
                        </div>
                        <label class="form-game-label">Kata Sandi</label>
                        <div class="input-game-wrap mb-2"><i class="fa-solid fa-lock icon-prefix"></i><input
                                type="password" name="login_password" class="form-control input-game-icon shadow-none"
                                required></div>
                        <button type="submit" name="login_game" class="btn-game-submit mt-4">Masuk Sekarang <i
                                class="fa-solid fa-arrow-right ms-2"></i></button>
                        <div class="game-login-link mt-3"><span>Belum punya akun? <a href="#" data-bs-toggle="modal"
                                    data-bs-target="#gameRegisterModal" data-bs-dismiss="modal">Daftar
                                    sekarang</a></span></div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Cara Bermain -->
    <div class="modal fade modal-cara-bermain" id="caraBermainModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content"
                style="background-image: url('https://www.transparenttextures.com/patterns/rice-paper.png'); border: 4px solid #fff; overflow: visible !important;">
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                    style="position:absolute; right:15px; top:15px; z-index:100;"></button>
                <div class="row g-0 h-100 align-items-end" style="padding: 10px 20px;">
                    <div class="col-lg-4 col-md-5 d-none d-md-block position-relative" style="min-height: 480px;">
                        <div class="sakera-container"
                            style="position: absolute; bottom: 0; left: -10%; width: 130%; height: 100%; display: flex; align-items: flex-end; z-index: 10; pointer-events: none;">
                            <img loading="lazy" decoding="async" src="/img/sakera.png" style="width:100%; object-fit:contain;">
                        </div>
                    </div>
                    <div class="col-lg-8 col-md-7 px-4 pb-4 pt-4 position-relative" style="z-index: 1;">
                        <div class="text-center mb-2 position-relative">
                            <h3 style="color:#A83232; font-family:'Playfair Display', serif; font-weight:800;">Cara
                                Bermain Labirin</h3>
                        </div>
                        <div class="d-flex justify-content-start" style="position: relative; z-index: 20;">
                            <div style="background:#fff; border:3px solid #D4AF37; padding:15px; border-radius:15px;">
                                <h5
                                    style="color: #5A110E; font-weight: 800; font-size: 1.1rem; margin-bottom: 5px; font-family: 'Montserrat', sans-serif;">
                                    Halo, Petualang!</h5>
                                <p
                                    style="color: #444; font-size: 0.95rem; margin-bottom: 0; font-family: 'Montserrat', sans-serif;">
                                    Jelajahi labirin, temukan kunci rahasia, dan jawab pertanyaan di kotak tanda tanya
                                    agar pintu keluar menuju mercusuar terbuka!</p>
                            </div>
                        </div>
                        <div class="row g-3 mt-3 text-center">
                            <div class="col-md-3 col-6"><i class="fa-solid fa-arrows-up-down-left-right fa-2x mb-2"
                                    style="color:#8C6228;"></i><br><b>Jelajah Labirin</b></div>
                            <div class="col-md-3 col-6"><i class="fa-solid fa-key fa-2x mb-2"
                                    style="color:#D4AF37;"></i><br><b>Ambil Kunci</b></div>
                            <div class="col-md-3 col-6"><i class="fa-solid fa-circle-question fa-2x mb-2"
                                    style="color:#A83232;"></i><br><b>Jawab Kuis</b></div>
                            <div class="col-md-3 col-6"><i class="fa-solid fa-door-open fa-2x mb-2"
                                    style="color:#8C6228;"></i><br><b>Pintu Keluar</b></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Profil -->
    <div class="modal fade" id="userProfileModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm" style="max-width: 380px;">
            <div class="modal-content modal-profile-content">
                <div class="profile-header-bg">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"
                        style="z-index: 10;"></button>
                </div>
                <div class="modal-body p-4 pt-0 text-center" style="font-family: 'Montserrat', sans-serif;">
                    <div class="profile-avatar-container">
                        <img loading="lazy" decoding="async" src="/img/avatar1.png" data-js-user-avatar="true"
                            class="profile-avatar-img"
                            style="width:80px; border-radius:50%; border:3px solid #D4AF37; margin-top:-40px; background:#fff;">
                    </div>
                    <h3 class="profile-name mt-2" style="color:#8C6228; font-weight:800;">
                        <span data-js-user-fullname="true">Tamu</span>
                    </h3>
                    <p class="text-muted small mb-4">Pengelana Sejarah</p>
                    <div class="d-grid gap-2 mt-4">
                        <a href="?logout=true" class="btn btn-outline-danger w-100 rounded-pill font-heading py-2"
                            style="border-radius: 30px;"><i class="fa-solid fa-right-from-bracket me-2"></i> Keluar
                            Akun</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- SCRIPTS -->
`;

export default function LabirinPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Pastikan body tidak terkunci overflow:hidden dari halaman game
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    const cleanupScript = initLabirinPage(navigate);
    const cleanupLinks = interceptInternalLinks(containerRef.current, navigate);

    return () => {
      if (typeof cleanupScript === 'function') cleanupScript();
      if (typeof cleanupLinks === 'function') cleanupLinks();
    };
  }, [navigate]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <div
        ref={containerRef}
        className="jejak-page-container"
        dangerouslySetInnerHTML={{ __html: PAGE_HTML }}
      />
    </>
  );
}