/* GAMEPAGE.JSX */
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import pageStyles from '../assets/styles/game.css?raw';
import { initGamePage } from '../utils/gameController.js';
import { interceptInternalLinks } from '../utils/navigationHelper';

const PAGE_HTML = `
<!-- Navbar Premium -->
<nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="index.php"><img loading="lazy" decoding="async" src="/img/logo.png" alt="Logo" class="navbar-logo-custom"></a>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavGame">
            <i class="fa-solid fa-bars-staggered text-dark fs-3"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavGame">
            <ul class="navbar-nav mx-auto gap-1 navbar-nav-custom">
                <li class="nav-item"><a class="nav-link" href="index.php">Beranda</a></li>
                <li class="nav-item"><a class="nav-link" href="warisan_budaya.php">Warisan Budaya</a></li>
                <li class="nav-item"><a class="nav-link" href="virtual_tour.php">Virtual Tour</a></li>
                <li class="nav-item"><a class="nav-link active" href="game.php">Game</a></li>
                <li class="nav-item"><a class="nav-link" href="asisten_cerdas.php">Asisten Cerdas</a></li>
                <li class="nav-item"><a class="nav-link" href="tentang_kami.php">Tentang Kami</a></li>
            </ul>  
            <div class="js-nav-user-wrapper" style="display:none;">
                <div class="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">  
                    <div class="nav-user-chip" data-bs-toggle="modal" data-bs-target="#userProfileModal">  
                        <img loading="lazy" decoding="async" src="/img/avatar1.png" data-js-user-avatar="true" alt="Avatar" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">  
                        <span>Hai, <span data-js-user-firstname="true">Petualang</span>!</span>  
                    </div>  
                </div>
            </div>  
        </div>  
    </div>  
</nav>

<!-- Game Hero Section -->  
<div class="game-hero">  
    <div class="container-fluid px-4 px-xl-5 position-relative z-2 w-100">  
        <div class="row">  
            <div class="col-lg-6 col-md-8 col-sm-12 ms-lg-4 pt-5 mt-4">  
                <div class="game-hero-content" data-aos="fade-right" data-aos-duration="1000">  
                    <div class="game-subtitle"><i class="fa-solid fa-gamepad"></i> Game Edukasi Heritage</div>  
                    <h1 class="game-title">Jelajahi, Pelajari,<br>Lestarikan <span>Budaya Bangkalan!</span></h1>  
                    <p class="game-desc">Dalam game ini kamu akan menjelajahi berbagai lokasi bersejarah, mengenal tokoh, dan mempelajari keunikan budaya Bangkalan melalui tantangan seru dan interaktif!</p>  
                    <div class="d-flex flex-wrap gap-3 align-items-center">  
                        <button class="btn-game-primary js-auth-logged-in" style="display:none;" onclick="openGameMap()"><i class="fa-solid fa-play"></i> Lanjutkan Petualangan</button>  
                        <button class="btn-game-primary js-auth-guest" data-bs-toggle="modal" data-bs-target="#gameRegisterModal"><i class="fa-solid fa-play"></i> Mulai Petualangan</button>  
                        
                        <!-- TOMBOL RUANG BELAJAR MENGARAH KE HALAMAN BARU -->
                        <button class="btn-game-secondary" onclick="window.__jejakNavigate('/materi')"><i class="fa-solid fa-book-open"></i> Ruang Belajar</button>  
                        
                        <button class="btn-game-secondary border-0 text-muted shadow-none" style="background:transparent;" data-bs-toggle="modal" data-bs-target="#caraBermainModal"><i class="fa-solid fa-circle-info"></i> Cara Bermain</button>  
                    </div>  
                </div>  
            </div>  
        </div>  
    </div>  
</div>

<!-- ========================================================  
     PETA GAME & WRAPPER LAINNYA
     ======================================================== -->  
<!-- PETA GAME -->  
<div id="gameMapWrapper" class="game-map-wrapper">  
    <img loading="lazy" decoding="async" src="/img/judulpeta.png" alt="Peta Bangkalan" class="map-game-title" onerror="this.style.display='none'">  
    <img loading="lazy" decoding="async" src="/img/petagame.png" alt="Map Game" class="map-game-bg">

    <img loading="lazy" decoding="async" src="/img/level1.png" class="map-level-dot level-1" id="mapDot1" style="top: 50%; left: 16.5%; width: 70px; height: 100px;" onclick="openGameLevel(1)">
    <i class="fa-solid fa-lock level-lock lock-2" id="lockIcon2" style="top: 58%; left: 29.5%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level2.png" class="map-level-dot level-2 locked" id="mapDot2" style="top: 56%; left: 27.5%;" onclick="openGameLevel(2)">
    <i class="fa-solid fa-lock level-lock lock-3" id="lockIcon3" style="top: 67%; left: 38.5%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level3.png" class="map-level-dot level-3 locked" id="mapDot3" style="top: 65%; left: 36.5%;" onclick="openGameLevel(3)">
    <i class="fa-solid fa-lock level-lock lock-4" id="lockIcon4" style="top: 75%; left: 48%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level4.png" class="map-level-dot level-4 locked" id="mapDot4" style="top: 73%; left: 46%;" onclick="openGameLevel(4)">
    <i class="fa-solid fa-lock level-lock lock-5" id="lockIcon5" style="top: 64%; left: 57.2%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level5.png" class="map-level-dot level-5 locked" id="mapDot5" style="top: 62%; left: 55%;" onclick="openGameLevel(5)">
    <i class="fa-solid fa-lock level-lock lock-6" id="lockIcon6" style="top: 48%; left: 63.3%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level6.png" class="map-level-dot level-6 locked" id="mapDot6" style="top: 46%; left: 61%;" onclick="openGameLevel(6)">
    <i class="fa-solid fa-lock level-lock lock-7" id="lockIcon7" style="top: 39%; left: 68%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level7.png" class="map-level-dot level-7 locked" id="mapDot7" style="top: 37%; left: 66%;" onclick="openGameLevel(7)">
    <i class="fa-solid fa-lock level-lock lock-8" id="lockIcon8" style="top: 26%; left: 73%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level8.png" class="map-level-dot level-8 locked" id="mapDot8" style="top: 24%; left: 71%;" onclick="openGameLevel(8)">
    <i class="fa-solid fa-lock level-lock lock-9" id="lockIcon9" style="top: 22%; left: 81%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level9.png" class="map-level-dot level-9 locked" id="mapDot9" style="top: 20%; left: 79%;" onclick="openGameLevel(9)">
    <i class="fa-solid fa-lock level-lock lock-10" id="lockIcon10" style="top: 18%; left: 87%;"></i>  
    <img loading="lazy" decoding="async" src="/img/level10.png" class="map-level-dot level-10 locked" id="mapDot10" style="top: 14%; left: 85%;" onclick="openGameLevel(10)">

    <img loading="lazy" decoding="async" src="/img/kompas.png" alt="Kompas" class="map-game-compass" onerror="this.style.display='none'">

    <button onclick="closeGameMap()" class="gl-btn-back" style="position: absolute; top: 20px; left: 20px; z-index: 200;">  
        <i class="fa-solid fa-chevron-left"></i>  
    </button>  
</div>  

<!-- ADVENTURE WRAPPER -->  
<div id="adventureWrapper">
    <div class="adv-control-icons" id="advControlIcons">  
        <button id="btnBackMap" class="adv-control-btn" onclick="quitAdventure()"></button>  
        <button id="btnPausePlay" class="adv-control-btn" onclick="togglePause()"></button>  
        <button id="btnSoundToggle" class="adv-control-btn" onclick="toggleSound()"></button>  
    </div>
    <div id="advStartScreen">  
        <h1 class="title-game">PETUALANGAN<br>SAKERA</h1>  
        <button id="playBtnCss" onclick="startCountdown()">▶ PLAY</button>  
        <p id="loadingText">LOADING...</p>  
    </div>
    <div id="countdownOverlay">  
        <div id="countdownText">READY</div>  
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
    <img loading="lazy" decoding="async" id="playerSprite" src="/img/adventure/sakera.gif" alt="Player">
    <div id="controlsContainer">  
        <div class="d-pad">  
            <button id="btnUp" class="control-btn"></button>  
            <button id="btnLeft" class="control-btn"></button>  
            <button id="btnDown" class="control-btn"></button>  
            <button id="btnRight" class="control-btn"></button>  
        </div>  
    </div>
    <div id="advGameOverScreen">  
        <h1>GAME OVER</h1>  
        <p>SCORE: <span id="advFinalScore">0</span></p>  
        <button class="btn btn-restart" onclick="restartAdventure()">MULAI ULANG</button>  
        <button class="btn btn-restart mt-3 bg-white" onclick="quitAdventure()">KEMBALI KE PETA</button>  
    </div>
    <canvas id="gameCanvas"></canvas>  
</div>

<!-- MODAL KUIS OVERLAY -->  
<div id="gameLevelPage" class="game-level-page">  
    <div class="gl-bg" style="background-image: url('/img/game/background2.png'); opacity: 0.95;"></div>  
    <div class="gl-top-bar">  
        <div class="gl-header-left">  
            <div class="gl-level-info" style="background-image: url('/img/game/tombol_next.png');">  
                <i class="fa-solid fa-location-dot" style="color: #FFD700;"></i> <span id="gl-level-text">Level 1</span>  
            </div>  
        </div>  
        <div class="gl-stats-container">  
            <div class="gl-stat-item"><i class="fa-solid fa-star" style="color: #FFD700;"></i> <span id="gl-score">0</span></div>  
            <div class="gl-stat-divider"></div>  
            <div class="gl-stat-item"><i class="fa-solid fa-heart" style="color: #FF6B6B;"></i> <span id="gl-health">7</span></div>  
            <div class="gl-stat-divider"></div>  
            <div class="gl-stat-item"><i class="fa-solid fa-clock" style="color: #fff;"></i> <span id="gl-timer">01:00</span></div>  
        </div>  
    </div>
    <div class="gl-content">  
        <div class="gl-character-area">  
            <img loading="lazy" decoding="async" id="kuisCharacterImg" src="/img/game/sakera_berfikir.png" class="gl-character-img" alt="Karakter">  
            <div class="gl-speech-bubble" id="kuisSpeechBubble">  
                <strong style="color:#5A110E; font-size:1.2rem;">Hmm...</strong><br>Ayo bantu aku menjawab pertanyaan ini! Waktumu cuma 1 menit!  
            </div>  
        </div>  
        <div class="gl-quiz-panel" style="background-image: url('/img/game/bingkaisoal.png');">  
            <div class="gl-quiz-header" style="background-image: url('/img/game/info_soal.png');">  
                <i class="fa-solid fa-gem" style="color:#FFD700; font-size: 0.8rem;"></i> <span id="gl-question-counter">Pertanyaan 1/3</span> <i class="fa-solid fa-gem" style="color:#FFD700; font-size: 0.8rem;"></i>  
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

<!-- MODALS (REGIS, LOGIN, CARA BERMAIN, PROFIL) -->  
<div class="modal fade" id="gameRegisterModal" tabindex="-1" aria-hidden="true">  
    <div class="modal-dialog modal-lg modal-dialog-centered">  
        <div class="modal-content modal-game-reg">  
            <div class="modal-header modal-game-header flex-column">  
                <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"></button>  
                <h3 class="modal-game-title">Mulai Petualanganmu</h3>  
            </div>  
            <div class="modal-body px-4 pb-4 pt-1">  
                <form method="POST" action="">  
                    <div class="row">  
                        <div class="col-md-6 pe-md-3">  
                            <label class="form-game-label">Nama Lengkap</label>  
                            <div class="input-game-wrap"><i class="fa-regular fa-user icon-prefix"></i><input type="text" name="nama_lengkap" class="form-control input-game-icon shadow-none" required></div>  
                            <label class="form-game-label">Username</label>  
                            <div class="input-game-wrap"><i class="fa-regular fa-user icon-prefix"></i><input type="text" name="username" class="form-control input-game-icon shadow-none" required></div>  
                            <label class="form-game-label">Email</label>  
                            <div class="input-game-wrap"><i class="fa-regular fa-envelope icon-prefix"></i><input type="email" name="email" class="form-control input-game-icon shadow-none" required></div>  
                        </div>  
                        <div class="col-md-6 ps-md-3">  
                            <label class="form-game-label">Kata Sandi</label>  
                            <div class="input-game-wrap"><i class="fa-solid fa-lock icon-prefix"></i><input type="password" name="password" class="form-control input-game-icon shadow-none" required minlength="8"></div>  
                            <label class="form-game-label">Jenis Kelamin</label>  
                            <div class="input-game-wrap">  
                                <select name="jenis_kelamin" class="form-control input-game-icon shadow-none" required style="padding-left: 15px !important;">  
                                    <option value="Laki-laki">Laki-laki</option>  
                                    <option value="Perempuan">Perempuan</option>  
                                </select>  
                            </div>  
                            <label class="form-game-label mt-1">Pilih Avatar</label>  
                            <div class="char-select-container mb-0">  
                                <label class="char-card selected" onclick="selectAvatar('avatar1.png', this)"><input type="radio" name="avatar" value="avatar1.png" required checked><img loading="lazy" decoding="async" src="/img/avatar1.png"><span>Sakera</span><div class="char-check"><i class="fa-solid fa-check"></i></div></label>  
                                <label class="char-card" onclick="selectAvatar('avatar2.png', this)"><input type="radio" name="avatar" value="avatar2.png" required><img loading="lazy" decoding="async" src="/img/avatar2.png"><span>Marlena</span><div class="char-check"><i class="fa-solid fa-check"></i></div></label>  
                            </div>  
                        </div>  
                    </div>  
                    <div class="mt-3 px-md-3">  
                        <button type="submit" name="register_game" class="btn-game-submit">Daftar Akun <i class="fa-solid fa-arrow-right ms-2"></i></button>  
                        <div class="game-login-link mt-2"><span>Sudah punya akun? <a href="#" data-bs-toggle="modal" data-bs-target="#gameLoginModal" data-bs-dismiss="modal">Masuk di sini</a></span></div>  
                    </div>  
                </form>  
            </div>  
        </div>  
    </div>  
</div>

<div class="modal fade" id="gameLoginModal" tabindex="-1" aria-hidden="true">  
    <div class="modal-dialog modal-dialog-centered">  
        <div class="modal-content modal-game-reg">  
            <div class="modal-header modal-game-header flex-column">  
                <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"></button>  
                <h3 class="modal-game-title">Selamat Datang!</h3>  
            </div>  
            <div class="modal-body px-4 pb-4 pt-3">  
                <form method="POST" action="">  
                    <label class="form-game-label">Username atau Email</label>  
                    <div class="input-game-wrap mb-3"><i class="fa-regular fa-user icon-prefix"></i><input type="text" name="login_user" class="form-control input-game-icon shadow-none" required></div>  
                    <label class="form-game-label">Kata Sandi</label>  
                    <div class="input-game-wrap mb-2"><i class="fa-solid fa-lock icon-prefix"></i><input type="password" name="login_password" class="form-control input-game-icon shadow-none" required></div>  
                    <button type="submit" name="login_game" class="btn-game-submit mt-4">Masuk Sekarang <i class="fa-solid fa-arrow-right ms-2"></i></button>  
                    <div class="game-login-link mt-3"><span>Belum punya akun? <a href="#" data-bs-toggle="modal" data-bs-target="#gameRegisterModal" data-bs-dismiss="modal">Daftar sekarang</a></span></div>  
                </form>  
            </div>  
        </div>  
    </div>  
</div>  

<div class="modal fade modal-cara-bermain" id="caraBermainModal" tabindex="-1" aria-hidden="true">  
    <div class="modal-dialog modal-lg modal-dialog-centered">  
        <div class="modal-content bg-transparent border-0 shadow-none position-relative text-center">  
            <button type="button" class="btn-close-cara" data-bs-dismiss="modal" style="position: absolute; top: 10px; right: 15px; width: 42px; height: 42px; border-radius: 50%; background: #8B261D; color: #fff; border: 3px solid #FFE4B5; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; z-index: 30; box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: pointer;">  
                <i class="fa-solid fa-xmark"></i>  
            </button>  
            <img loading="lazy" decoding="async" src="/img/cara bermain.png" alt="Cara Bermain" class="img-fluid mx-auto d-block" style="max-height: 95vh; width: 100%; max-width: 100%; object-fit: contain; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.45));">  
        </div>  
    </div>  
</div>

<div class="modal fade" id="userProfileModal" tabindex="-1" aria-hidden="true">  
    <div class="modal-dialog modal-dialog-centered modal-sm profile-modal-dialog">  
        <div class="modal-content modal-profile-content">  
            <div class="profile-header-bg">  
                <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" style="z-index: 10;"></button>  
            </div>  
            <div class="modal-body p-4 pt-0 text-center" style="font-family: 'Montserrat', sans-serif;">  
                <div class="profile-avatar-container">  
                    <img loading="lazy" decoding="async" src="/img/avatar1.png" data-js-user-avatar="true" class="profile-avatar-img" onerror="this.src='https://ui-avatars.com/api/?name=User&background=8C6228&color=fff'">  
                </div>  
                <h3 class="profile-name font-heading mt-3 mb-0" style="font-size: 1.3rem; color: var(--primary-dark);">  
                    <span data-js-user-fullname="true">Tamu</span>  
                </h3>  
                <p class="text-muted small mb-0">Pengelana Sejarah</p>            
                <div class="text-start mt-4 bg-white p-3 rounded-3 border" style="border-color: #EFEBE1 !important;">  
                    <div class="d-flex align-items-center mb-3">  
                        <i class="fa-solid fa-user-tag me-3" style="width: 20px; color: var(--primary-gold);"></i>  
                        <div>  
                            <small class="text-muted d-block" style="font-size: 0.75rem;">Username</small>  
                            <span class="fw-bold text-dark"><span data-js-user-username="true">User Baru</span></span>  
                        </div>  
                    </div>  
                    <div class="d-flex align-items-center mb-3">  
                        <i class="fa-solid fa-envelope me-3" style="width: 20px; color: var(--primary-gold);"></i>  
                        <div class="text-truncate">  
                            <small class="text-muted d-block" style="font-size: 0.75rem;">Email Terdaftar</small>  
                            <span class="fw-bold text-dark"><span data-js-user-email="true">Belum ada email</span></span>  
                        </div>  
                    </div>  
                    <div class="d-flex align-items-center">  
                        <i class="fa-solid fa-venus-mars me-3" style="width: 20px; color: var(--primary-gold);"></i>  
                        <div>  
                            <small class="text-muted d-block" style="font-size: 0.75rem;">Jenis Kelamin</small>  
                            <span class="fw-bold text-dark"><span data-js-user-jk="true">-</span></span>  
                        </div>  
                    </div>  
                </div>
                <div class="d-grid gap-2 mt-4">  
                    <a href="?logout=true" class="btn btn-dark rounded-pill fw-bold" style="background-color: var(--primary-red) !important; border-color: var(--primary-red) !important; font-family: 'Montserrat', sans-serif;">  
                        <i class="fa-solid fa-right-from-bracket me-2"></i> Keluar  
                    </a>  
                </div>  
            </div>  
        </div>  
    </div>  
</div>  
`;  

export default function GamePage() {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(bg => bg.remove());

        const cleanupScript = initGamePage(navigate);
        const cleanupLinks = interceptInternalLinks(containerRef.current, navigate);
        
        return () => {
            if (typeof cleanupScript === 'function') cleanupScript();
            if (typeof cleanupLinks === 'function') cleanupLinks();
        };
    }, [navigate]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
            <div ref={containerRef} className="jejak-page-container" dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
        </>
    );
}