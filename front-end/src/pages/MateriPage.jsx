// src/pages/MateriPage.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const pageStyles = `
/* src/assets/styles/Materi.css */

:root {
    --materi-dark: #2B1407;
    --materi-gold: #D4AF37;
    --materi-red: #8B261D;
    --materi-bg: #1a0f0a;
}

.materi-game-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: url('/img/game/background2.png') center/cover no-repeat;
    background-color: var(--materi-bg);
    z-index: 2500;
    font-family: 'Montserrat', sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.materi-game-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(110, 65, 35, 0.55);
    z-index: 1;
}

.materi-top-bar {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 40px;
    background: linear-gradient(to bottom, rgba(43, 20, 7, 0.95), transparent);
    border-bottom: 2px solid rgba(212, 175, 55, 0.3);
}

.materi-btn-back {
    background: var(--materi-red);
    border: 2px solid var(--materi-gold);
    color: white;
    padding: 10px 25px;
    border-radius: 30px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    font-size: 1rem;
}

.materi-btn-back:hover {
    background: var(--materi-gold);
    color: var(--materi-dark);
    transform: scale(1.05);
}

.materi-title-container {
    text-align: center;
}

.materi-main-title {
    font-family: 'Playfair Display', serif;
    color: var(--materi-gold);
    margin: 0;
    font-size: 2.2rem;
    font-weight: 900;
    text-shadow: 3px 3px 0 var(--materi-red), 6px 6px 10px rgba(0, 0, 0, 0.8);
    letter-spacing: 2px;
}

.materi-subtitle {
    color: #EFEBE1;
    margin: 5px 0 0 0;
    font-weight: 600;
    letter-spacing: 3px;
    font-size: 0.9rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

.materi-stats {
    display: flex;
    align-items: center;
    gap: 15px;
}

.materi-stats .stat-badge {
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid var(--materi-gold);
    color: white;
    padding: 10px 25px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
}

.materi-hamburger-btn {
    position: relative;
    z-index: 90;
    background: rgba(43, 20, 7, 0.95);
    border: 2px solid var(--materi-gold);
    color: var(--materi-gold);
    padding: 10px 18px;
    border-radius: 12px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.materi-hamburger-btn:hover {
    background: var(--materi-gold);
    color: var(--materi-dark);
    transform: scale(1.05);
}

.materi-layout {
    position: relative;
    z-index: 10;
    display: flex;
    flex-grow: 1;
    padding: 15px 30px 25px 30px;
    gap: 20px;
    overflow: hidden;
}

.materi-sidebar-nav {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: rgba(43, 20, 7, 0.95);
    border: 2px solid #8C6228;
    border-radius: 20px;
    padding: 20px;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8), -10px 0 30px rgba(0, 0, 0, 0.7);
    overflow-y: auto;
    position: absolute;
    right: -400px;
    top: 15px;
    height: calc(100% - 30px);
    z-index: 100;
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.materi-sidebar-nav.show {
    right: 30px;
}

.materi-sidebar-nav::-webkit-scrollbar {
    width: 5px;
}

.materi-sidebar-nav::-webkit-scrollbar-thumb {
    background: var(--materi-gold);
    border-radius: 10px;
}

.materi-tab {
    background: transparent;
    border: 2px solid transparent;
    color: #D1BFAE;
    padding: 16px 20px;
    text-align: left;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1.05rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 15px;
}

.materi-tab i {
    font-size: 1.3rem;
    width: 25px;
    text-align: center;
}

.materi-tab:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.materi-tab.active {
    background: linear-gradient(90deg, rgba(140, 98, 40, 0.8), transparent);
    border-left: 4px solid var(--materi-gold);
    color: var(--materi-gold);
    box-shadow: inset 5px 0 15px rgba(212, 175, 55, 0.2);
}

.materi-content-viewer {
    flex-grow: 1;
    background-color: #EFE4D1;
    border: 4px solid var(--materi-gold);
    border-radius: 30px;
    padding: 25px 45px;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
    margin-right: 0px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    transition: background-color 0.4s ease, color 0.4s ease;
}

.materi-content-viewer.reading-mode {
    background-color: #FFFDF8;
    color: #111;
}

.materi-content-viewer.reading-mode .materi-text-content h2,
.materi-content-viewer.reading-mode .materi-sejarah-title {
    color: #111;
}

.materi-content-viewer.reading-mode .materi-scroll-box {
    color: #222;
}

.materi-content-viewer::-webkit-scrollbar {
    display: none;
}

.materi-section {
    display: none;
}

.materi-section.active {
    display: block;
    animation: fadeInMateri 0.5s ease;
}

@keyframes fadeInMateri {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.materi-card-game {
    display: flex;
    flex-direction: column;
    background: transparent;
    border: none;
    border-radius: 0;
    overflow: visible;
    box-shadow: none;
}

.materi-text-content {
    padding: 10px 0;
}

.materi-text-content h2 {
    font-family: 'Playfair Display', serif;
    color: var(--materi-red);
    font-weight: 900;
    font-size: 2.2rem;
    margin-bottom: 12px;
    border-bottom: 2px dashed #8C6228;
    padding-bottom: 10px;
}

.materi-scroll-box {
    overflow-y: auto;
    color: #333;
    line-height: 1.8;
    font-size: 1.05rem;
    font-weight: 500;
    transition: font-size 0.3s ease;
    text-align: justify;
}

mark {
    background-color: #FFD700;
    color: #000;
    padding: 0 2px;
    border-radius: 3px;
    font-weight: bold;
}

.materi-scroll-box p {
    margin-bottom: 15px;
}

.materi-tools-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 25px;
    padding: 14px 22px;
    background: linear-gradient(135deg, rgba(43, 20, 7, 0.85), rgba(110, 65, 35, 0.75));
    border: 2px solid var(--materi-gold);
    border-radius: 30px;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.tool-group {
    display: flex;
    gap: 10px;
    align-items: center;
}

.materi-tool-btn {
    background: var(--materi-red);
    color: var(--materi-gold);
    border: 2px solid var(--materi-gold);
    padding: 9px 18px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.materi-tool-btn:hover {
    background: var(--materi-gold);
    color: var(--materi-dark);
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(212, 175, 55, 0.4);
}

.materi-action-icon-btn {
    background: var(--materi-red);
    color: var(--materi-gold);
    border: 2px solid var(--materi-gold);
    width: 44px;
    height: 44px;
    border-radius: 14px;
    cursor: pointer;
    font-size: 1.15rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.materi-action-icon-btn:hover {
    background: var(--materi-gold);
    color: var(--materi-dark);
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(212, 175, 55, 0.5);
}

.materi-search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.materi-search-wrapper.hidden-search {
    display: none !important;
}

.materi-search-wrapper i {
    position: absolute;
    left: 15px;
    color: var(--materi-gold);
    font-size: 0.95rem;
}

.materi-search-input {
    padding: 9px 15px 9px 40px;
    border-radius: 25px;
    border: 2px solid var(--materi-gold);
    background: rgba(255, 255, 255, 0.95);
    font-family: inherit;
    color: #333;
    font-weight: 600;
    outline: none;
    width: 230px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.materi-search-input:focus {
    border-color: #FFD700;
    width: 230px;
    background: #fff;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.reading-timer-wrapper {
    display: none;
    flex-grow: 1;
    max-width: 400px;
    margin-left: auto;
    margin-right: 15px;
    background: var(--materi-red);
    border: 2px solid var(--materi-gold);
    padding: 8px 18px;
    border-radius: 25px;
    align-items: center;
    gap: 15px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.reading-timer-wrapper.active {
    display: flex;
}

.timer-status-text {
    font-size: 0.95rem;
    font-weight: bold;
    color: var(--materi-gold);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
}

.timer-status-text i {
    font-size: 1.2rem;
    color: var(--materi-gold);
}

.reading-timer-container {
    flex-grow: 1;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    height: 9px;
    overflow: hidden;
    border: 1px solid var(--materi-gold);
}

.reading-timer-bar {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #FFD700);
    transition: width 0.1s linear;
}

.materi-scroll-top-btn {
    position: absolute;
    bottom: 30px;
    right: 30px;
    background: var(--materi-red);
    color: white;
    border: 2px solid var(--materi-gold);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s ease;
}

.materi-scroll-top-btn.show {
    opacity: 1;
    visibility: visible;
}

.sejarah-menu-container {
    display: block;
}

.sejarah-menu-container.hidden {
    display: none;
}

.sejarah-detail-container {
    display: none;
}

.sejarah-detail-container.active {
    display: block;
}

.btn-back-sejarah-top {
    display: none;
    background: var(--materi-red);
    border: 2px solid var(--materi-gold);
    color: var(--materi-gold);
    padding: 9px 18px;
    border-radius: 25px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    align-items: center;
    gap: 8px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.btn-back-sejarah-top:hover {
    background: var(--materi-gold);
    color: var(--materi-dark);
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(212, 175, 55, 0.4);
}

.btn-back-sejarah-top.active {
    display: inline-flex;
}

.sejarah-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 15px;
    justify-content: start;
}

.sejarah-card-item {
    background: #FFFDF8;
    border: 2px solid var(--materi-gold);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    max-width: 280px;
    width: 100%;
    min-height: 310px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sejarah-card-item:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
}

.sejarah-card-img-wrap {
    position: relative;
    width: 100%;
    height: 160px;
}

.sejarah-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.sejarah-card-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: white;
    color: var(--materi-red);
    font-size: 0.7rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 20px;
}

.sejarah-card-body {
    padding: 15px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
}

.sejarah-card-title {
    font-family: 'Cinzel', 'Playfair Display', serif;
    color: #4A2E18;
    font-size: 1.3rem !important;
    font-weight: 700;
    line-height: 1.35;
    margin: 0 0 10px 0;
}

.sejarah-card-location {
    font-size: 0.75rem;
    color: #666;
    display: flex;
    align-items: flex-start;
    line-height: 1.4;
    gap: 6px;
    margin-bottom: 10px;
}

.sejarah-card-location i {
    margin-top: 3px;
}

.sejarah-card-arrow {
    width: 36px;
    height: 36px;
    background: #F4EADB;
    border: 1.5px solid var(--materi-gold);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--materi-dark);
    font-size: 0.9rem;
    align-self: flex-start;
    transition: all 0.3s ease;
}

.sejarah-card-item:hover .sejarah-card-arrow {
    background: var(--materi-red);
    color: white;
    transform: rotate(-45deg);
}

.sejarah-block {
    display: none;
}

.sejarah-block.active-block {
    display: block;
}

.sejarah-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.materi-sejarah-title {
    font-family: 'Playfair Display', serif;
    color: var(--materi-red);
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
}

.warisan-filter-container {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: var(--materi-gold) transparent;
}

.warisan-filter-container::-webkit-scrollbar {
    height: 6px;
}

.warisan-filter-container::-webkit-scrollbar-thumb {
    background: var(--materi-gold);
    border-radius: 10px;
}

.warisan-filter-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border: 2px solid #C4B29E;
    border-radius: 30px;
    padding: 8px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: max-content;
}

.warisan-filter-btn:hover {
    border-color: var(--materi-gold);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.warisan-filter-btn.active {
    background: #8C6228;
    border-color: #8C6228;
}

.warisan-filter-btn.active .filter-btn-text strong,
.warisan-filter-btn.active .filter-btn-text span,
.warisan-filter-btn.active .filter-btn-icon {
    color: white;
}

.filter-btn-icon {
    font-size: 1.5rem;
    color: #8C6228;
    transition: color 0.3s ease;
}

.filter-btn-text {
    text-align: left;
    display: flex;
    flex-direction: column;
}

.filter-btn-text strong {
    font-size: 0.95rem;
    color: #4A2E18;
    transition: color 0.3s ease;
}

.filter-btn-text span {
    font-size: 0.7rem;
    color: #666;
    transition: color 0.3s ease;
}

.sejarah-detail-content {
    display: flex;
    gap: 25px;
    align-items: flex-start;
}

.sejarah-detail-image {
    flex: 0 0 350px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.single-image-container {
    position: relative;
    width: 100%;
    height: 230px;
    border-radius: 16px;
    border: 3px solid var(--materi-gold);
    overflow: hidden;
    background: #000;
}

.single-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-slider-container {
    position: relative;
    width: 100%;
    height: 230px;
    border-radius: 16px;
    border: 3px solid var(--materi-gold);
    overflow: hidden;
    background: #000;
}

.image-slider-track {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease-in-out;
}

.image-slider-track img {
    min-width: 100%;
    height: 100%;
    object-fit: cover;
}

.slider-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(43, 20, 7, 0.8);
    color: var(--materi-gold);
    border: 2px solid var(--materi-gold);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.9rem;
    z-index: 10;
    transition: all 0.3s ease;
}

.slider-btn:hover {
    background: var(--materi-gold);
    color: var(--materi-dark);
}

.slider-btn-prev {
    left: 10px;
}

.slider-btn-next {
    right: 10px;
}

.slider-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 5px;
}

.slider-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #C4B29E;
    border: 1px solid var(--materi-gold);
    cursor: pointer;
    transition: background 0.3s ease;
}

.slider-dot.active {
    background: var(--materi-red);
}

.sejarah-detail-text {
    flex: 1;
}

@media (max-width: 768px) {
    .sejarah-detail-content {
        flex-direction: column;
    }
    .sejarah-detail-image {
        flex: 1 1 100%;
        max-width: 100%;
    }
}

.materi-btn-action {
    background: #4CAF50;
    color: white;
    border: 3px solid #2E7D32;
    padding: 10px 30px;
    border-radius: 40px;
    font-weight: 900;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 15px;
}

.materi-item-info {
    padding: 15px;
}

.vt-links-game {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

.vt-link-btn {
    background: rgba(255, 255, 255, 0.8);
    border: 3px solid var(--materi-gold);
    border-radius: 16px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    width: 200px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.vt-link-btn:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
}

.materi-vt-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
}

.materi-vt-modal-overlay.show {
    opacity: 1;
    visibility: visible;
}

.materi-vt-modal {
    width: 80%;
    height: 85%;
    background: #EFE4D1;
    border: 4px solid var(--materi-gold);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.materi-vt-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 25px;
    background: rgba(43, 20, 7, 0.95);
    border-bottom: 2px solid var(--materi-gold);
}

.materi-vt-title {
    color: var(--materi-gold);
    margin: 0;
    font-size: 1.3rem;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
}

.materi-vt-iframe {
    flex-grow: 1;
    width: 100%;
    border: none;
    background: #000;
}

/* ======================================================== */
/* KELAS CSS TAMBAHAN KAMUS MADURA                          */
/* ======================================================== */

.k-ui-wrapper {
    display: flex;
    gap: 20px;
    height: 100%;
    width: 100%;
    color: #5A3A22;
    font-family: 'Montserrat', sans-serif;
    position: relative;
}
.k-card {
    background-color: #FCF8F2; 
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #EBE1D1;
    display: flex;
    flex-direction: column;
}
.k-card-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #5A3A22;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.k-col-left {
    flex: 0 0 280px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    padding-right: 5px;
}
.k-col-left::-webkit-scrollbar, .k-col-center::-webkit-scrollbar, .k-col-right::-webkit-scrollbar {
    width: 6px;
}
.k-col-left::-webkit-scrollbar-thumb, .k-col-center::-webkit-scrollbar-thumb, .k-col-right::-webkit-scrollbar-thumb {
    background: #D5C6B3;
    border-radius: 10px;
}
.k-menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.k-stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #5A3A22;
    background-color: transparent;
    border-bottom: 1px dashed #EBE1D1;
}
.k-stat-item:last-child {
    border-bottom: none;
}
.k-menu-item.active .k-count {
    color: #EBE1D1;
}
.k-menu-item i {
    width: 25px;
    font-size: 1.1rem;
}
.k-count {
    opacity: 0.7;
    font-size: 0.75rem;
}
.k-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}
.k-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
}
.k-btn-filter {
    background: transparent;
    border: 1px solid #D5C6B3;
    border-radius: 8px;
    padding: 10px 5px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #5A3A22;
    text-align: center;
    cursor: pointer;
    transition: 0.2s ease;
}
.k-btn-filter:hover {
    border-color: #7C4C24;
}
.k-btn-filter.active {
    background-color: #7C4C24;
    color: white;
    border-color: #7C4C24;
}
.k-col-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 5px;
}
.k-top-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}
.k-btn-action {
    background: transparent;
    border: 1px solid #D5C6B3;
    padding: 6px 15px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #5A3A22;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
}
.k-btn-action:hover {
    background: #F4EADB;
    border-color: #7C4C24;
}
.k-word-header {
    display: flex;
    align-items: center;
    gap: 15px;
}
/* UKURAN FONT JUDUL DIPERBAIKI AGAR RESPONSIVE & TIDAK OVERFLOW */
.k-main-word {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 900;
    color: #4A2E18;
    margin: 0;
    word-break: break-word;
    line-height: 1.1;
}
.k-btn-audio-main {
    background-color: #7C4C24;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 1.1rem;
    transition: transform 0.2s ease;
    flex-shrink: 0;
}
.k-btn-audio-main:hover {
    transform: scale(1.1);
}
.k-pronounce {
    font-size: 1.1rem;
    color: #886F58;
    margin-top: 5px;
    font-style: italic;
}
.k-badges-row {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: 2px dashed #EBE1D1;
}
.k-badge-main {
    background-color: #7C4C24;
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
}
.k-badge-sub {
    background-color: #F4EADB;
    color: #5A3A22;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}
.k-section-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: #4A2E18;
    margin-bottom: 10px;
}
.k-arti-text {
    font-size: 1.1rem;
    color: #333;
    line-height: 1.6;
}
.k-contoh-box {
    background-color: #F4EADB;
    padding: 20px;
    border-radius: 12px;
    border-left: 4px solid #7C4C24;
    margin-top: 10px;
}
.k-contoh-madura {
    font-weight: 800;
    font-size: 1rem;
    color: #4A2E18;
    margin-bottom: 8px;
}
.k-contoh-indo {
    font-size: 0.9rem;
    color: #666;
}
.k-info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    border: 1px solid #EBE1D1;
    border-radius: 12px;
    padding: 15px;
    margin-top: 15px;
}
.k-info-item {
    display: flex;
    gap: 12px;
    align-items: center;
}
.k-info-item i {
    font-size: 1.3rem;
    color: #7C4C24;
}
.k-info-text span {
    display: block;
    font-size: 0.75rem;
    color: #886F58;
    margin-bottom: 2px;
}
.k-info-text strong {
    font-size: 0.9rem;
    color: #4A2E18;
}
.k-info-waveform {
    height: 15px;
    width: 60px;
    background: repeating-linear-gradient(90deg, #7C4C24 0px, #7C4C24 2px, transparent 2px, transparent 4px);
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
}
.k-fakta-box {
    background-color: #FDF0D5;
    padding: 15px 20px;
    border-radius: 12px;
    display: flex;
    gap: 15px;
    align-items: flex-start;
    margin-top: 10px;
}
.k-fakta-box i {
    color: #D97706;
    font-size: 1.5rem;
}
.k-fakta-text h4 {
    margin: 0 0 5px 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: #4A2E18;
}
.k-fakta-text p {
    margin: 0;
    font-size: 0.85rem;
    color: #666;
    line-height: 1.5;
}
.k-col-right {
    flex: 0 0 300px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    padding-right: 5px;
}
.k-audio-player {
    background-color: #7C4C24;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
}
.k-audio-btn {
    background-color: white;
    color: #7C4C24;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 0.8rem;
    border: none;
}
.k-audio-progress-bar {
    flex-grow: 1;
    height: 4px;
    background-color: rgba(255,255,255,0.3);
    border-radius: 2px;
    position: relative;
}
.k-audio-progress-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 30%; /* Mockup */
    background-color: white;
    border-radius: 2px;
}
.k-audio-time {
    font-size: 0.75rem;
    font-weight: 600;
}
.k-related-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.k-related-header span {
    font-size: 0.75rem;
    color: #886F58;
    cursor: pointer;
    font-weight: 600;
}
.k-related-list {
    display: flex;
    flex-direction: column;
}
.k-related-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #EBE1D1;
    font-size: 0.85rem;
    font-weight: 700;
    color: #5A3A22;
    cursor: pointer;
    transition: 0.2s;
}
.k-related-item:hover {
    color: #D97706;
}
.k-related-item:last-child {
    border-bottom: none;
}
.k-related-item span {
    font-weight: 400;
    color: #886F58;
    font-size: 0.75rem;
}
.k-fav-desc {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 15px;
    display: block;
}
.k-btn-favorit {
    background-color: #7C4C24;
    color: white;
    width: 100%;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}
.k-btn-favorit:hover {
    background: #5D3A1B;
}

/* ======================================================== */
/* TAMBAHAN FITUR INPUT PENCARIAN, TOGGLE BAHASA & RIWAYAT  */
/* ======================================================== */
.k-interactive-bar {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    background-color: #FCF8F2;
    border-radius: 16px;
    padding: 12px 20px;
    border: 1px solid #EBE1D1;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.k-lang-toggle-btn {
    background: #7C4C24;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(124, 76, 36, 0.4);
    min-width: 180px;
    justify-content: center;
}

.k-lang-toggle-btn:hover {
    background: #5D3A1B;
    transform: translateY(-2px);
}

.k-input-wrapper {
    flex-grow: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.k-input-wrapper i {
    position: absolute;
    left: 15px;
    color: #886F58;
    font-size: 1.1rem;
}

.k-interactive-input {
    width: 100%;
    padding: 14px 15px 14px 45px;
    border-radius: 12px;
    border: 1px solid #D5C6B3;
    background: white;
    font-family: inherit;
    font-size: 1rem;
    color: #5A3A22;
    outline: none;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;
}

.k-interactive-input:focus {
    border-color: #7C4C24;
    box-shadow: 0 0 0 3px rgba(124, 76, 36, 0.2);
}

.k-btn-riwayat {
    background: transparent;
    color: #7C4C24;
    border: 2px solid #7C4C24;
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.k-btn-riwayat:hover {
    background: #7C4C24;
    color: white;
}

/* KELAS BARU UNTUK PANEL RIWAYAT STATIS DI SAMPING */
.k-history-card {
    background-color: #FCF8F2;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #EBE1D1;
    display: none; 
    flex-direction: column;
    margin-bottom: 15px;
    animation: fadeInMateri 0.3s ease;
}

/* Penyesuaian Header Riwayat agar Judul dan Tombol X Sejajar Rapi */
.k-history-header-custom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    margin-bottom: 5px;
    border-bottom: 2px dashed #EBE1D1;
}

.k-history-header-custom h3 {
    font-size: 1.1rem; 
    margin: 0; 
    font-weight: 800;
    color: #4A2E18;
}

.k-close-btn-custom {
    background: var(--materi-red);
    border: 2px solid var(--materi-gold);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.k-close-btn-custom:hover {
    background: var(--materi-gold);
    color: var(--materi-dark);
    transform: scale(1.05);
}

.k-history-card.show {
    display: flex;
}

.k-history-list {
    max-height: 250px;
    overflow-y: auto;
    padding: 0;
    margin: 0;
    list-style: none;
}

.k-history-list::-webkit-scrollbar {
    width: 6px;
}

.k-history-list::-webkit-scrollbar-thumb {
    background: #D5C6B3;
    border-radius: 10px;
}

.k-history-item {
    padding: 10px 0;
    border-bottom: 1px solid #EBE1D1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    transition: background 0.2s;
}

.k-history-item:hover {
    background: #F4EADB;
}

.k-history-item:last-child {
    border-bottom: none;
}

.k-history-query {
    font-weight: 700;
    color: #4A2E18;
    font-size: 0.95rem;
}

.k-history-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.k-history-time {
    font-size: 0.75rem;
    color: #886F58;
}

.k-history-type {
    background: #EBE1D1;
    color: #5A3A22;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 700;
}

.k-history-empty {
    padding: 15px 0;
    text-align: left;
    color: #886F58;
    font-style: italic;
    font-size: 0.85rem;
}

/* Styling Tombol Close (X) yang disamakan dengan tema game */
.k-close-btn-custom {
    background: var(--materi-red);
    border: 2px solid var(--materi-gold);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.k-close-btn-custom:hover {
    background: var(--materi-gold);
    color: var(--materi-dark);
    transform: scale(1.05);
}
`;

const PAGE_HTML = `
<div id="materiGameWrapper" class="materi-game-wrapper">
    <!-- Game-like Header -->
    <div class="materi-top-bar">
        <button class="materi-btn-back" onclick="window.history.back()">
            <i class="fa-solid fa-arrow-left"></i> Kembali ke Game
        </button>
        <div class="materi-title-container">
            <h1 class="materi-main-title">PUSTAKA BELAJAR</h1>
            <p class="materi-subtitle">Ensiklopedia Budaya Bangkalan</p>
        </div>

        <div class="materi-stats">
            <button id="materiHamburger" class="materi-hamburger-btn" onclick="window.toggleSidebar()">
                <i class="fa-solid fa-bars"></i>
            </button>
        </div>
    </div>

    <!-- Content Area -->
    <div class="materi-layout">

        <!-- Sidebar Navigation -->
        <aside id="materiSidebar" class="materi-sidebar-nav">
            <button class="materi-tab active" data-target="sejarah"><i class="fa-solid fa-scroll"></i> Sejarah Bangkalan</button>
            <button class="materi-tab" data-target="warisan"><i class="fa-solid fa-masks-theater"></i> Warisan Budaya</button>
            <button class="materi-tab" data-target="rumah-budaya"><i class="fa-solid fa-book-open"></i> Kamus Madura</button>
            <button class="materi-tab" data-target="galeri"><i class="fa-solid fa-images"></i> Galeri Museum</button>
        </aside>

        <!-- Main Content Viewer -->
        <main id="materiContent" class="materi-content-viewer">

            <!-- TOOLBAR INTERAKTIF -->
            <div class="materi-tools-bar">
                <div class="tool-group">
                    <button id="btnBackTop" class="btn-back-sejarah-top" onclick="window.backToSejarahMenu()">
                        <i class="fa-solid fa-arrow-left"></i> Kembali ke Pilihan
                    </button>
                    <button class="materi-tool-btn" title="Mode Baca" onclick="window.toggleReadMode()">
                        <i class="fa-solid fa-moon"></i> Mode Baca
                    </button>
                    <button class="materi-tool-btn" title="Perkecil Teks" onclick="window.zoomText(-1)">
                        <i class="fa-solid fa-font"></i> A-
                    </button>
                    <button class="materi-tool-btn" title="Perbesar Teks" onclick="window.zoomText(1)">
                        <i class="fa-solid fa-font"></i> A+
                    </button>
                </div>

                <!-- TIMER 3 MENIT -->
                <div id="readingTimerWrapper" class="reading-timer-wrapper">
                    <span id="timerStatusText" class="timer-status-text">
                        <i class="fa-solid fa-clock"></i> 03:00
                    </span>
                    <div class="reading-timer-container">
                        <div id="readingTimerBar" class="reading-timer-bar"></div>
                    </div>
                </div>

                <div class="tool-group">
                    <div id="searchWrapper" class="materi-search-wrapper">
                        <i class="fa-solid fa-search"></i>
                        <input type="text" id="searchInput" class="materi-search-input" placeholder="Cari di materi..." onkeyup="window.searchText(event)">
                    </div>
                </div>
            </div>

            <!-- 1. SEJARAH -->
            <section id="sejarah" class="materi-section active">
                <div class="materi-card-game">
                    <div class="materi-text-content">
                        <h2>Sejarah & Tokoh Bangkalan</h2>

                        <div id="sejarahMenu" class="sejarah-menu-container">
                            <p style="font-weight: 600; margin-bottom: 15px; color: #444;">Pilih salah satu situs di bawah untuk melihat informasi selengkapnya:</p>

                            <div class="sejarah-cards-grid">
                                <!-- Kartu 1 -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-cakraningrat')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SEJARAH</span>
                                        <img src="/img/materi/museumcakraningrat/1.jpg" alt="Museum Cakraningrat">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Museum Cakraningrat</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Jl. Soekarno Hatta No. 39A, Kelurahan Mlajah, Kecamatan Bangkalan, Kabupaten Bangkalan, Jawa Timur.
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 2 -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-mercusuar')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SEJARAH</span>
                                        <img src="/img/materi/mercusuarsembilangan/1.jpg" alt="Mercusuar Sembilangan">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Mercusuar Sembilangan</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Desa Sembilangan, Kecamatan Socah, Kabupaten Bangkalan, Jawa Timur.
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 3 -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-syaikhona')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">RELIGI</span>
                                        <img src="/img/materi/makamsyakhona/1.jpg" alt="Makam Syaikhona Kholil">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Makam Syaikhona Kholil</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Jl. Mertajasah, Desa/Kelurahan Mertajasah, Kecamatan Bangkalan, Kabupaten Bangkalan, Jawa Timur
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 4 -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-masjid')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">RELIGI</span>
                                        <img src="/img/materi/masjidagung&makam/1.jpg" alt="Masjid Agung">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Masjid Agung & Sultan Kadirun</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Jl. Sultan Abdul Kadirun No. 5, Kelurahan Demangan, Kecamatan Bangkalan, Kabupaten Bangkalan, Jawa Timur.
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 5: Benteng Erfprins -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-benteng')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SEJARAH</span>
                                        <img src="/img/materi/Benteng Erfprins/1.jpg" alt="Benteng Erfprins">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Benteng Erfprins</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Kelurahan Pejagan, Kecamatan Bangkalan, Kabupaten Bangkalan, Jawa Timur
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 6: Makam Agung Arosbaya -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-arosbaya')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">RELIGI</span>
                                        <img src="/img/materi/Makam Agung Arosbaya/1.jpg" alt="Makam Agung Arosbaya">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Makam Agung Arosbaya</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Dusun Makam Agung, Desa Makam Agung, Kecamatan Arosbaya, Kabupaten Bangkalan, Jawa Timur
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 7: Bunker Sembilangan -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-bunker')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SEJARAH</span>
                                        <img src="/img/materi/Bunker Sembilangan/1.jpg" alt="Bunker Sembilangan">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Bunker Sembilangan</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Kawasan Desa Sembilangan, Kecamatan Socah, Kabupaten Bangkalan, Jawa Timur.
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 8: Klenteng Eng An Bio -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-klenteng')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">BUDAYA</span>
                                        <img src="/img/materi/Klenteng Eng An Bio/1.jpg" alt="Klenteng Eng An Bio">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Klenteng Eng An Bio</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Jl. Panglima Sudirman No. 116, Kelurahan Pejagan, Kecamatan Bangkalan, Kabupaten Bangkalan, Jawa Timur
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 9: Makam Sunan Cendana -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-sunancendana')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">RELIGI</span>
                                        <img src="/img/materi/Makam Sunan Cendana/1.jpg" alt="Makam Sunan Cendana">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Makam Sunan Cendana</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Desa Ketetang, Kecamatan Kwanyar, Kabupaten Bangkalan, Jawa Timur.
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 10: Makam Ki Demung Plakaran -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-demung')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SEJARAH</span>
                                        <img src="/img/materi/Makam Ki Demung Plakaran/1.jpg" alt="Makam Ki Demung Plakaran">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Makam Ki Demung Plakaran</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Desa Plakaran, Kecamatan Arosbaya, Kabupaten Bangkalan, Jawa Timur.
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 11: Batik Gentongan Tanjung Bumi -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-gentongan')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">WARISAN</span>
                                        <img src="/img/materi/Sentra Batik Tulis/1.jpg" alt="Batik Tulis Gentongan">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Batik Gentongan Tanjung Bumi</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Desa Paseseh, Kecamatan Tanjung Bumi, Kabupaten Bangkalan, Jawa Timur.
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 12: Tanean Lanjhang -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-tanean')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">KEARIFAN</span>
                                        <img src="/img/materi/Rumah Tradisional Tanean Lanjhang/1.jpg" alt="Tanean Lanjhang">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Rumah Tradisional Tanean Lanjhang</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Desa Bandang Laok, Kecamatan Kokop, Kabupaten Bangkalan, Jawa Timur
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 13: Gedung Merdeka Bangkalan -->
                                <div class="sejarah-card-item" onclick="window.showSejarahDetail('block-gedungmerdeka')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SEJARAH</span>
                                        <img src="/img/materi/Gedung Merdeka Bangkalan/1.jpg" alt="Gedung Merdeka Bangkalan">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Gedung Merdeka Bangkalan</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-location-dot"></i> Kawasan Kota Bangkalan, Kabupaten Bangkalan, Jawa Timur.
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4">
                                <button class="materi-btn-action" onclick="window.markAsRead('sejarah')">Tandai Selesai Modul Sejarah</button>
                            </div>
                        </div>

                        <!-- KONTEN DETAIL SEJARAH -->
                        <div id="sejarahDetail" class="sejarah-detail-container">
                            <div class="materi-scroll-box" id="scrollBoxSejarah">

                                <!-- Blok 1: Museum Cakraningrat -->
                                <div class="sejarah-block" id="block-cakraningrat" data-folder="museumcakraningrat">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-building-columns"></i> Museum Cakraningrat</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-cakraningrat')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-cakraningrat')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-cakraningrat')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/museumcakraningrat/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/museumcakraningrat/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/museumcakraningrat/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/museumcakraningrat/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/museumcakraningrat/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-cakraningrat">
                                            <p>Museum Cakraningrat merupakan salah satu tempat wisata edukasi dan budaya yang berada di Kabupaten Bangkalan, Pulau Madura, Jawa Timur. Museum ini menjadi tempat untuk mengenal dan mempelajari sejarah serta perkembangan kebudayaan masyarakat Bangkalan dari masa ke masa. Nama Cakraningrat berkaitan dengan sejarah pemerintahan bangsawan dan para penguasa Madura yang memiliki peran penting dalam perkembangan wilayah Bangkalan. Melalui museum ini, pengunjung dapat memperoleh gambaran mengenai kehidupan masyarakat Madura pada masa lampau, termasuk tradisi, adat istiadat, serta peninggalan sejarah yang menjadi bagian dari identitas daerah.</p>
                                            <p>Selain sebagai tempat penyimpanan benda-benda bersejarah, Museum Cakraningrat juga berperan dalam melestarikan warisan budaya Madura agar tetap dikenal oleh generasi muda. Keberadaan museum ini dapat dimanfaatkan sebagai sarana pembelajaran interaktif bagi pelajar dan masyarakat untuk memahami nilai-nilai sejarah, kesenian, serta kearifan lokal Bangkalan. Dengan mengunjungi museum, pengunjung diharapkan dapat meningkatkan pengetahuan dan rasa cinta terhadap budaya daerah sekaligus menumbuhkan kesadaran akan pentingnya menjaga dan melestarikan warisan budaya sebagai bagian dari kekayaan bangsa Indonesia.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 2: Mercusuar Sembilangan -->
                                <div class="sejarah-block" id="block-mercusuar" data-folder="mercusuarsembilangan">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-tower-observation"></i> Mercusuar Sembilangan</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-mercusuar')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-mercusuar')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-mercusuar')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/mercusuarsembilangan/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/mercusuarsembilangan/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/mercusuarsembilangan/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/mercusuarsembilangan/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/mercusuarsembilangan/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-mercusuar">
                                            <p>Museum Mercusuar Sembilangan merupakan salah satu bangunan bersejarah yang terletak di Desa Sembilangan, Kecamatan Socah, Kabupaten Bangkalan, Madura, Jawa Timur. Bangunan ini didirikan pada tahun 1879 pada masa pemerintahan Raja Willem III dari Belanda dan menjadi salah satu peninggalan kolonial yang memiliki nilai sejarah penting bagi Bangkalan. Mercusuar ini memiliki struktur menara besi bercat putih dengan tangga melingkar di bagian dalamnya. Sejak awal pembangunannya, mercusuar berfungsi sebagai alat bantu navigasi untuk memandu kapal-kapal yang melintasi Selat Madura, terutama kapal yang hendak menuju Pelabuhan Tanjung Perak di Surabaya. Keberadaannya menjadi bukti perkembangan transportasi dan aktivitas pelayaran pada masa kolonial Belanda.</p>
                                            <p>Selain memiliki nilai sejarah, Mercusuar Sembilangan juga menjadi bagian dari warisan budaya dan identitas masyarakat Bangkalan yang perlu dijaga kelestariannya. Keunikan arsitektur serta usianya yang telah mencapai lebih dari satu abad menjadikan bangunan ini menarik untuk dipelajari sebagai sumber pengetahuan mengenai sejarah maritim dan peninggalan kolonial di Madura. Kawasan di sekitar mercusuar juga menawarkan pemandangan pesisir yang menambah daya tariknya sebagai destinasi wisata sejarah. Melalui pengenalan dan pelestarian Mercusuar Sembilangan, masyarakat, khususnya generasi muda, dapat memahami nilai sejarah yang terkandung di dalamnya sekaligus menumbuhkan kesadaran untuk menjaga warisan budaya daerah agar tetap dikenal oleh generasi berikutnya.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 3: Makam Syaikhona Kholil -->
                                <div class="sejarah-block" id="block-syaikhona" data-folder="makamsyakhona">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-kaaba"></i> Makam Syaikhona Kholil</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-syaikhona')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-syaikhona')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-syaikhona')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/makamsyakhona/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/makamsyakhona/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/makamsyakhona/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/makamsyakhona/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/makamsyakhona/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-syaikhona">
                                            <p>Makam Syaikhona Kholil merupakan salah satu destinasi wisata religi dan sejarah yang terletak di Desa Martajasah, Kecamatan Bangkalan, Kabupaten Bangkalan, Madura, Jawa Timur. Makam ini merupakan tempat peristirahatan terakhir KH. Muhammad Kholil bin Abdul Latif, yang lebih dikenal sebagai Syaikhona Kholil atau Mbah Kholil, seorang ulama besar yang memiliki peran penting dalam perkembangan pendidikan Islam di Nusantara. Beliau dikenal memiliki ilmu agama yang mendalam dan mendirikan pesantren yang menjadi tempat belajar banyak santri dari berbagai daerah. Syaikhona Kholil juga berperan penting dalam menginspirasi berdirinya Nahdlatul Ulama (NU) melalui murid-muridnya, termasuk KH. Hasyim Asy'ari. Beliau wafat pada 29 Ramadan 1343 H, yang umumnya dicatat bertepatan dengan 1925 M.</p>
                                            <p>Hingga saat ini, Makam Syaikhona Kholil menjadi tempat ziarah yang ramai dikunjungi masyarakat dari berbagai daerah di Indonesia. Kompleks makam yang berada di kawasan Masjid Syaikhona Kholil ini tidak hanya memiliki nilai religius, tetapi juga menyimpan nilai sejarah dan budaya yang berkaitan dengan perkembangan Islam serta tradisi pesantren di Madura. Para peziarah datang untuk berdoa, mengenang jasa beliau, dan meneladani semangatnya dalam menuntut ilmu, mengajarkan agama, serta membimbing masyarakat. Keberadaan makam ini menjadi bagian penting dari identitas Bangkalan sekaligus sarana untuk mengenalkan sejarah tokoh ulama kepada generasi muda agar warisan keilmuan dan keteladanan Syaikhona Kholil tetap terjaga.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 4: Masjid Agung Bangkalan & Makam -->
                                <div class="sejarah-block" id="block-masjid" data-folder="masjidagung&makam">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-mosque"></i> Masjid Agung & Sultan Kadirun</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-masjid')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-masjid')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-masjid')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/masjidagung&makam/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/masjidagung&makam/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/masjidagung&makam/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/masjidagung&makam/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/masjidagung&makam/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-masjid">
                                            <p>Masjid Agung Bangkalan atau Masjid Agung Sultan Kadirun merupakan salah satu bangunan bersejarah dan pusat wisata religi di Kabupaten Bangkalan, Madura, Jawa Timur. Sejarah masjid ini berkaitan erat dengan perkembangan pemerintahan Kerajaan dan Kesultanan Bangkalan. Pada masa perpindahan pusat pemerintahan ke Bangkalan, masjid menjadi salah satu bangunan penting yang berada di kawasan keraton bersama bangunan pemerintahan dan paseban. Pembangunan dan pemugaran besar masjid dilakukan pada masa Sultan Raden Maulana Abdul Kadir, yang dikenal sebagai Sultan Kadirun, dengan pemancangan tiang utama pada 10 April 1819. Pada awalnya, masjid digunakan khusus oleh keluarga keraton, kemudian diwakafkan dan dibuka untuk masyarakat umum sebagai tempat ibadah serta penyebaran agama Islam.</p>
                                            <p>Sultan Raden Maulana Abdul Kadir atau Sultan Kadirun merupakan salah satu tokoh penting dalam sejarah Bangkalan yang dikenal sebagai penguasa religius dan memiliki peran dalam perkembangan Islam di wilayah tersebut. Beliau memerintah Kesultanan Bangkalan dan berperan dalam mengubah masjid keraton menjadi masjid jami yang dapat digunakan oleh masyarakat luas. Keberadaan Masjid Agung Bangkalan juga memiliki keunikan dari segi arsitektur, terutama atap bertingkat dan ornamen ukiran yang mencerminkan perpaduan unsur tradisional dengan pengaruh zaman kolonial. Sepanjang sejarahnya, masjid ini telah mengalami beberapa kali pemugaran untuk menjaga kondisi bangunan dan menyesuaikan kebutuhan jamaah, tetapi tetap menjadi salah satu simbol sejarah Islam dan kebudayaan masyarakat Bangkalan.</p>
                                            <p>Tidak jauh dari sejarah masjid tersebut, terdapat Makam Sultan Abdul Kadirun yang berada di kompleks pemakaman atau cungkup di belakang Masjid Agung Bangkalan. Sultan Kadirun wafat pada 28 Januari 1847 dan dimakamkan di kawasan masjid yang memiliki hubungan erat dengan perjalanan hidup serta kepemimpinannya. Di dalam kompleks makam tersebut juga terdapat makam sejumlah anggota keluarga dan kerabat Kesultanan Bangkalan. Hingga kini, makam Sultan Abdul Kadirun menjadi bagian dari peninggalan sejarah yang dikunjungi masyarakat untuk berziarah sekaligus mengenal lebih dekat tokoh yang berjasa dalam perkembangan Bangkalan. Keberadaan masjid dan makam dalam kawasan menunjukkan eratnya hubungan antara pemerintahan kesultanan, penyebaran agama Islam, dan tradisi masyarakat setempat, sehingga keduanya memiliki nilai penting sebagai warisan sejarah dan budaya yang perlu dilestarikan.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 5: Benteng Erfprins -->
                                <div class="sejarah-block" id="block-benteng" data-folder="Benteng Erfprins">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-landmark"></i> Benteng Erfprins</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-benteng')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-benteng')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-benteng')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Benteng Erfprins/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Benteng Erfprins/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Benteng Erfprins/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Benteng Erfprins/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Benteng Erfprins/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-benteng">
                                            <p>Benteng Erfprins merupakan salah satu peninggalan sejarah masa kolonial Belanda yang terletak di Kelurahan Pejagan, Kabupaten Bangkalan. Keberadaan benteng ini berkaitan dengan perkembangan kekuasaan dan aktivitas militer kolonial di wilayah Madura. Bangkalan memiliki posisi strategis karena terletak di bagian barat Pulau Madura dan berdekatan dengan jalur pelayaran menuju Surabaya.</p>
                                            <p>Bangunan ini menjadi saksi perjalanan sejarah Bangkalan pada masa kolonial dan menggambarkan bagaimana kepentingan pertahanan memengaruhi perkembangan wilayah tersebut. Hingga kini, Benteng Erfprins memiliki nilai penting sebagai peninggalan sejarah lokal yang perlu diteliti, dikenalkan kepada masyarakat, dan dilestarikan agar generasi muda dapat memahami jejak kolonialisme di Madura.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 6: Makam Agung Arosbaya -->
                                <div class="sejarah-block" id="block-arosbaya" data-folder="Makam Agung Arosbaya">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-kaaba"></i> Makam Agung Arosbaya</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-arosbaya')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-arosbaya')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-arosbaya')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Makam Agung Arosbaya/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Makam Agung Arosbaya/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Makam Agung Arosbaya/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Makam Agung Arosbaya/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Makam Agung Arosbaya/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-arosbaya">
                                            <p>Makam Agung Arosbaya merupakan kompleks pemakaman bersejarah di Kecamatan Arosbaya, Kabupaten Bangkalan, yang berkaitan dengan tokoh-tokoh penguasa Madura Barat. Kompleks ini antara lain dikaitkan dengan Pangeran Pragalba, Pangeran Tengah, dan Pangeran Pratanu. Arosbaya sendiri dikenal sebagai salah satu kawasan penting dalam perkembangan pemerintahan Bangkalan pada masa kerajaan.</p>
                                            <p>Keberadaan kompleks makam ini menunjukkan hubungan erat antara sejarah pemerintahan, tradisi pemakaman, dan perkembangan kebudayaan masyarakat Madura. Makam Agung Arosbaya juga menjadi tempat untuk mengenal tokoh-tokoh yang berperan dalam perjalanan sejarah Bangkalan. Situs ini penting sebagai sumber pembelajaran sejarah lokal sekaligus pengingat akan warisan leluhur yang perlu dijaga keberadaannya.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 7: Bunker Sembilangan -->
                                <div class="sejarah-block" id="block-bunker" data-folder="Bunker Sembilangan">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-shield"></i> Bunker Sembilangan</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-bunker')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-bunker')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-bunker')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Bunker Sembilangan/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Bunker Sembilangan/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Bunker Sembilangan/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Bunker Sembilangan/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Bunker Sembilangan/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-bunker">
                                            <p>Bunker Sembilangan merupakan salah satu peninggalan bersejarah yang tercatat dalam inventaris objek warisan budaya Kabupaten Bangkalan. Situs ini berada di kawasan Sembilangan dan menjadi bagian dari jejak bangunan pertahanan di wilayah pesisir Madura. Kawasan tersebut juga memiliki nilai strategis karena berdekatan dengan jalur pelayaran antara Pulau Madura dan Pulau Jawa.</p>
                                            <p>Bangunan bunker dapat membantu masyarakat memahami pentingnya pertahanan wilayah dalam perjalanan sejarah pesisir Bangkalan. Keberadaannya juga melengkapi cerita sejarah kawasan Sembilangan yang tidak hanya berkaitan dengan pelayaran, tetapi juga dengan infrastruktur dan kepentingan pertahanan. Untuk menjelaskan periode pembangunan serta peristiwa yang pernah berlangsung di bunker ini secara lebih spesifik, diperlukan verifikasi melalui arsip atau penelitian lokal.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 8: Klenteng Eng An Bio -->
                                <div class="sejarah-block" id="block-klenteng" data-folder="Klenteng Eng An Bio">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-place-of-worship"></i> Klenteng Eng An Bio</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-klenteng')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-klenteng')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-klenteng')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Klenteng Eng An Bio/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Klenteng Eng An Bio/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Klenteng Eng An Bio/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Klenteng Eng An Bio/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Klenteng Eng An Bio/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-klenteng">
                                            <p>Klenteng Eng An Bio merupakan tempat ibadah bersejarah yang berada di Jalan Panglima Sudirman, Kabupaten Bangkalan. Klenteng ini dikenal sebagai bagian dari jejak keberadaan komunitas Tionghoa di Bangkalan. Menurut informasi sejarah lokal, pendiriannya dikaitkan dengan Ong Ki Chai sekitar tahun 1805, dengan dukungan lahan dari Kapiten Kuang Pang yang merupakan tokoh komunitas Tionghoa pada masa tersebut.</p>
                                            <p>Keberadaan Klenteng Eng An Bio memperlihatkan keragaman budaya dan sejarah kehidupan masyarakat Bangkalan. Bangunannya menjadi bagian dari warisan budaya yang menunjukkan interaksi antarkelompok masyarakat dalam perjalanan perkembangan kota. Situs ini dapat digunakan sebagai sarana pembelajaran tentang sejarah komunitas Tionghoa, tradisi keagamaan, arsitektur, dan nilai toleransi dalam kehidupan masyarakat Madura.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 9: Makam Sunan Cendana -->
                                <div class="sejarah-block" id="block-sunancendana" data-folder="Makam Sunan Cendana">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-kaaba"></i> Makam Sunan Cendana</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-sunancendana')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-sunancendana')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-sunancendana')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Makam Sunan Cendana/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Makam Sunan Cendana/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Makam Sunan Cendana/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Makam Sunan Cendana/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Makam Sunan Cendana/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-sunancendana">
                                            <p>Makam Sunan Cendana terletak di Desa Ketetang, Kecamatan Kwanyar, Kabupaten Bangkalan. Situs ini dikenal sebagai tempat peristirahatan tokoh ulama yang dalam tradisi masyarakat setempat disebut Sunan Cendana dan juga dikenal dengan nama Syekh Zainal Abidin. Makam tersebut menjadi bagian dari jejak penyebaran Islam dan perkembangan tradisi keagamaan di wilayah Bangkalan.</p>
                                            <p>Hingga kini, makam tersebut menjadi tujuan ziarah bagi masyarakat yang ingin mengenang jasa tokoh agama serta mendekatkan diri melalui kegiatan keagamaan. Keberadaannya menunjukkan bahwa sejarah Bangkalan tidak hanya dibentuk oleh pemerintahan kerajaan, tetapi juga oleh peran ulama dalam kehidupan sosial dan budaya masyarakat. Situs ini dapat dimanfaatkan untuk memperkenalkan sejarah lokal sekaligus nilai penghormatan terhadap tokoh agama dan warisan tradisi masyarakat Madura.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 10: Makam Ki Demung Plakaran -->
                                <div class="sejarah-block" id="block-demung" data-folder="Makam Ki Demung Plakaran">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-monument"></i> Makam Ki Demung Plakaran</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-demung')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-demung')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-demung')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Makam Ki Demung Plakaran/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Makam Ki Demung Plakaran/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Makam Ki Demung Plakaran/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Makam Ki Demung Plakaran/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Makam Ki Demung Plakaran/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-demung">
                                            <p>Makam Ki Demung Plakaran merupakan situs makam bersejarah yang terletak di Desa Plakaran, Kecamatan Arosbaya, Kabupaten Bangkalan. Situs ini dikenal dalam tradisi lokal sebagai tempat yang berkaitan dengan tokoh leluhur Plakaran dan sering dihubungkan dengan perkembangan awal pemerintahan di Madura Barat. Kawasan Arosbaya dan sekitarnya memang menyimpan sejumlah situs makam yang berkaitan dengan sejarah kerajaan dan tokoh-tokoh masa lampau.</p>
                                            <p>Makam Ki Demung Plakaran menjadi salah satu tempat untuk mengenal tradisi sejarah lisan dan penghormatan masyarakat terhadap leluhur. Situs ini juga dapat memperkaya pemahaman tentang hubungan antara tokoh lokal, perkembangan wilayah, dan pembentukan identitas budaya Bangkalan. Cerita mengenai tokoh yang dimakamkan di sini sebaiknya disajikan dengan membedakan informasi yang telah terdokumentasi dari kisah yang berkembang dalam tradisi masyarakat setempat.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 11: Batik Tulis Gentongan Tanjung Bumi -->
                                <div class="sejarah-block" id="block-gentongan" data-folder="Sentra Batik Tulis">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-shirt"></i> Batik Gentongan Tanjung Bumi</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-gentongan')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-gentongan')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-gentongan')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Sentra Batik Tulis/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Sentra Batik Tulis/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Sentra Batik Tulis/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Sentra Batik Tulis/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Sentra Batik Tulis/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-gentongan">
                                            <p>Batik Tulis Gentongan Tanjung Bumi merupakan warisan budaya khas Bangkalan yang berkembang melalui tradisi membatik masyarakat pesisir Madura. Salah satu sentra produksinya berada di Desa Paseseh, selain sejumlah desa lain di Kecamatan Tanjung Bumi. Kegiatan membatik telah menjadi bagian dari kehidupan sosial dan ekonomi masyarakat secara turun-temurun. Batik ini memiliki karakter visual yang khas, dengan motif beragam dan warna yang cenderung berani, seperti merah, kuning, dan hijau.</p>
                                            <p>Keistimewaan Batik Gentongan terletak pada teknik pewarnaannya yang menggunakan gentong atau wadah tanah liat untuk merendam kain dalam proses pewarnaan. Proses ini dapat berlangsung lama sehingga menghasilkan warna yang khas dan menjadi pembeda dari batik lainnya. Pada 23 April 2026, Batik Tulis Gentongan Tanjung Bumi diberitakan memperoleh sertifikat Indikasi Geografis sebagai pengakuan atas identitas dan karakteristik khasnya. Warisan ini penting dilestarikan karena mencerminkan keterampilan, kreativitas, serta identitas budaya masyarakat Bangkalan.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 12: Rumah Tradisional Tanean Lanjhang -->
                                <div class="sejarah-block" id="block-tanean" data-folder="Rumah Tradisional Tanean Lanjhang">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-house"></i> Rumah Tradisional Tanean Lanjhang</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-tanean')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-tanean')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-tanean')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Rumah Tradisional Tanean Lanjhang/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Rumah Tradisional Tanean Lanjhang/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Rumah Tradisional Tanean Lanjhang/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Rumah Tradisional Tanean Lanjhang/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Rumah Tradisional Tanean Lanjhang/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-tanean">
                                            <p>Tanean Lanjhang merupakan pola permukiman tradisional masyarakat Madura yang juga ditemukan di Kabupaten Bangkalan. Salah satu lokasi yang pernah dikaji secara khusus adalah kelompok permukiman Tanean Lanjhang di Dusun Baktalbak, Desa Bandang Laok, Kecamatan Kokop. Istilah tanean merujuk pada halaman atau pekarangan, sedangkan lanjhang berarti panjang. Permukiman ini terbentuk dari beberapa rumah keluarga yang tersusun memanjang dalam satu lingkungan bersama.</p>
                                            <p>Dalam susunannya, Tanean Lanjhang dapat mencakup rumah utama, rumah anggota keluarga lainnya, langgar atau musala, dapur, serta kandang. Penataan bangunan mencerminkan hubungan kekerabatan dan nilai kebersamaan yang kuat dalam kehidupan masyarakat Madura. Pola permukiman ini bukan sekadar bentuk arsitektur, tetapi juga gambaran cara masyarakat mengatur kehidupan keluarga, menjaga hubungan antargenerasi, dan menjalankan aktivitas sehari-hari. Oleh karena itu, Tanean Lanjhang layak diperkenalkan sebagai warisan arsitektur dan budaya Bangkalan.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 13: Gedung Merdeka Bangkalan -->
                                <div class="sejarah-block" id="block-gedungmerdeka" data-folder="Gedung Merdeka Bangkalan">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-building"></i> Gedung Merdeka Bangkalan</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-gedungmerdeka')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-gedungmerdeka')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-gedungmerdeka')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>

                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="image-slider-container">
                                                <button class="slider-btn slider-btn-prev" onclick="window.slideImage(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                                <div class="image-slider-track" id="sliderTrack">
                                                    <img src="/img/materi/Gedung Merdeka Bangkalan/1.jpg" alt="Slide 1">
                                                    <img src="/img/materi/Gedung Merdeka Bangkalan/2.jpg" alt="Slide 2">
                                                    <img src="/img/materi/Gedung Merdeka Bangkalan/3.jpg" alt="Slide 3">
                                                    <img src="/img/materi/Gedung Merdeka Bangkalan/4.jpg" alt="Slide 4">
                                                    <img src="/img/materi/Gedung Merdeka Bangkalan/5.jpg" alt="Slide 5">
                                                </div>
                                                <button class="slider-btn slider-btn-next" onclick="window.slideImage(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                            <div class="slider-dots" id="sliderDots">
                                                <span class="slider-dot active" onclick="window.currentSlide(0)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(1)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(2)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(3)"></span>
                                                <span class="slider-dot" onclick="window.currentSlide(4)"></span>
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-gedungmerdeka">
                                            <p>Gedung Merdeka merupakan bangunan yang tercatat dalam dokumen inventaris kebudayaan Kabupaten Bangkalan. Pencatatannya menunjukkan bahwa bangunan ini termasuk objek yang perlu diperhatikan dalam penelusuran sejarah arsitektur dan perkembangan kawasan perkotaan Bangkalan. Nama Gedung Merdeka juga menjadikannya salah satu objek yang menarik untuk diteliti lebih jauh dari segi riwayat penggunaan, perubahan fungsi, dan kaitannya dengan aktivitas masyarakat pada masa lalu.</p>
                                            <p>Sebagai bangunan lama, Gedung Merdeka berpotensi menjadi sumber pembelajaran tentang perkembangan fasilitas publik dan lingkungan kota Bangkalan. Riwayat bangunan, pihak yang membangun, serta fungsi awalnya perlu ditelusuri melalui arsip daerah atau keterangan resmi pengelola sebelum dimasukkan sebagai fakta sejarah yang pasti.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <!-- 2. WARISAN BUDAYA -->
            <section id="warisan" class="materi-section">
                <div class="materi-card-game">
                    <div class="materi-text-content">
                        <h2>Warisan Budaya Madura</h2>

                        <!-- MENU KARTU PILIHAN AWAL WARISAN -->
                        <div id="warisanMenu" class="sejarah-menu-container">

                            <!-- FITUR FILTER KATEGORI WARISAN BUDAYA -->
                            <div class="warisan-filter-container">
                                <button class="warisan-filter-btn active" onclick="window.filterWarisan('all', this)">
                                    <i class="fa-solid fa-landmark filter-btn-icon"></i>
                                    <div class="filter-btn-text">
                                        <strong>Semua</strong>
                                        <span>Lihat semua budaya</span>
                                    </div>
                                </button>
                                <button class="warisan-filter-btn" onclick="window.filterWarisan('tari', this)">
                                    <i class="fa-solid fa-person-dress filter-btn-icon"></i>
                                    <div class="filter-btn-text">
                                        <strong>Tarian Tradisional</strong>
                                        <span>Gerak & makna</span>
                                    </div>
                                </button>
                                <button class="warisan-filter-btn" onclick="window.filterWarisan('kesenian', this)">
                                    <i class="fa-solid fa-masks-theater filter-btn-icon"></i>
                                    <div class="filter-btn-text">
                                        <strong>Kesenian</strong>
                                        <span>Seni rupa & pertunjukan</span>
                                    </div>
                                </button>
                                <button class="warisan-filter-btn" onclick="window.filterWarisan('tradisi', this)">
                                    <i class="fa-solid fa-hands-holding filter-btn-icon"></i>
                                    <div class="filter-btn-text">
                                        <strong>Tradisi & Upacara</strong>
                                        <span>Adat istiadat</span>
                                    </div>
                                </button>
                                <button class="warisan-filter-btn" onclick="window.filterWarisan('religi', this)">
                                    <i class="fa-solid fa-mosque filter-btn-icon"></i>
                                    <div class="filter-btn-text">
                                        <strong>Religi</strong>
                                        <span>Keagamaan</span>
                                    </div>
                                </button>
                                <button class="warisan-filter-btn" onclick="window.filterWarisan('kuliner', this)">
                                    <i class="fa-solid fa-utensils filter-btn-icon"></i>
                                    <div class="filter-btn-text">
                                        <strong>Kuliner</strong>
                                        <span>Makanan & minuman</span>
                                    </div>
                                </button>
                            </div>

                            <p style="font-weight: 600; margin-bottom: 15px; color: #444;">Pilih salah satu tradisi di bawah untuk melihat informasi selengkapnya:</p>

                            <div class="sejarah-cards-grid">

                                <!-- Kartu 1: Karapan Sapi -->
                                <div class="sejarah-card-item" data-category="tradisi" onclick="window.showWarisanDetail('block-karapan')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">TRADISI</span>
                                        <img src="/img/budaya/karapan sapi.jpg" alt="Karapan Sapi">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Karapan Sapi</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Budaya Khas Masyarakat Madura
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 2: Tari Moang Sangkal -->
                                <div class="sejarah-card-item" data-category="tari" onclick="window.showWarisanDetail('block-moang')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SENI TARI</span>
                                        <img src="/img/budaya/tari moang sangkal.jpg" alt="Tari Moang Sangkal">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Tari Moang Sangkal</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Kesenian Penolak Bala Madura
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 3: Sapi Sonok -->
                                <div class="sejarah-card-item" data-category="tradisi" onclick="window.showWarisanDetail('block-sonok')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">TRADISI</span>
                                        <img src="/img/budaya/sapi sonok.jpg" alt="Sapi Sonok">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Sapi Sonok</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Kontes Kecantikan Sapi Madura
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 4: Rokat Tase -->
                                <div class="sejarah-card-item" data-category="tradisi" onclick="window.showWarisanDetail('block-rokat')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">UPACARA</span>
                                        <img src="/img/budaya/rokat tase.jpg" alt="Rokat Tase">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Rokat Tase'</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Syukuran Masyarakat Pesisir
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 5: Tari Rokat -->
                                <div class="sejarah-card-item" data-category="tari" onclick="window.showWarisanDetail('block-tarirokat')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SENI TARI</span>
                                        <img src="/img/budaya/tari rokat.jpg" onerror="this.src='/img/arsip3.png'" alt="Tari Rokat">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Tari Rokat</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 6: Tari Angklung Topeng -->
                                <div class="sejarah-card-item" data-category="tari" onclick="window.showWarisanDetail('block-angklung')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SENI TARI</span>
                                        <img src="/img/budaya/tari angklung topeng.jpg" onerror="this.src='/img/arsip3.png'" alt="Tari Angklung Topeng">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Tari Angklung Topeng</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Kesenian Lokal
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 7: Tari Nelayan -->
                                <div class="sejarah-card-item" data-category="tari" onclick="window.showWarisanDetail('block-tarinelayan')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">SENI TARI</span>
                                        <img src="/img/budaya/tari nelayan.jpg" onerror="this.src='/img/arsip3.png'" alt="Tari Nelayan">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Tari Nelayan</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Pesisir Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 8: Sholawat Nabi -->
                                <div class="sejarah-card-item" data-category="religi" onclick="window.showWarisanDetail('block-sholawatnabi')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">RELIGI</span>
                                        <img src="/img/budaya/sholawat nabi.jpg" onerror="this.src='/img/arsip3.png'" alt="Sholawat Nabi">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Sholawat Nabi</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Religi
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 9: Sandur Madura -->
                                <div class="sejarah-card-item" data-category="kesenian" onclick="window.showWarisanDetail('block-sandur')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">KESENIAN</span>
                                        <img src="/img/budaya/sandur madura.jpg" onerror="this.src='/img/arsip2.png'" alt="Sandur Madura">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Sandur Madura</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 10: Hadrah Jidor -->
                                <div class="sejarah-card-item" data-category="kesenian" onclick="window.showWarisanDetail('block-hadrah')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">KESENIAN</span>
                                        <img src="/img/budaya/hadrah jidor.jpg" onerror="this.src='/img/arsip2.png'" alt="Hadrah Jidor">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Hadrah Jidor</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 11: Kejung Bangkalan -->
                                <div class="sejarah-card-item" data-category="kesenian" onclick="window.showWarisanDetail('block-kejung')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">KESENIAN</span>
                                        <img src="/img/budaya/kejung bangkalan.jpg" onerror="this.src='/img/arsip2.png'" alt="Kejung Bangkalan">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Kejung Bangkalan</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Tradisi Tutur
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 12: Kirab Budaya -->
                                <div class="sejarah-card-item" data-category="tradisi" onclick="window.showWarisanDetail('block-kirab')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">TRADISI</span>
                                        <img src="/img/budaya/kirab budaya.jpg" onerror="this.src='/img/arsip3.png'" alt="Kirab Budaya">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Kirab Budaya</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 13: Peringatan Maulid Nabi -->
                                <div class="sejarah-card-item" data-category="religi" onclick="window.showWarisanDetail('block-maulid')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">TRADISI</span>
                                        <img src="/img/budaya/maulid.jpg" onerror="this.src='/img/arsip3.png'" alt="Peringatan Maulid Nabi">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Peringatan Maulid Nabi</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Keagamaan Lokal
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 14: Tellasan (Lebaran) -->
                                <div class="sejarah-card-item" data-category="tradisi" onclick="window.showWarisanDetail('block-tellasan')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge">TRADISI</span>
                                        <img src="/img/budaya/tellasan.jpg" onerror="this.src='/img/arsip3.png'" alt="Tellasan (Lebaran)">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Tellasan (Lebaran)</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Madura Raya
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 15: Nasi Serpang -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-serpang')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/nasi serpang.jpg" onerror="this.src='/img/arsip2.png'" alt="Nasi Serpang">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Nasi Serpang</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 16: Topak Ladeh -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-topak')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/topak lodeh.jpg" onerror="this.src='/img/arsip2.png'" alt="Topak Ladeh">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Topak Ladeh</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 17: Tajin Sobih -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-tajin')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/tajin sobih.jpg" onerror="this.src='/img/arsip2.png'" alt="Tajin Sobih">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Tajin Sobih</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Desa Sobih
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 18: Sewel -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-sewel')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/sewel socah.jpg" onerror="this.src='/img/arsip2.png'" alt="Sewel">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Sewel</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Kecamatan Socah
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 19: Bebek Sinjay -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-sinjay')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/bebek sinjay.jpg" onerror="this.src='/img/arsip2.png'" alt="Bebek Sinjay">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Bebek Sinjay</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 20: Soto Tongkol -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-sototongkol')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/soto tongkol.jpg" onerror="this.src='/img/arsip2.png'" alt="Soto Tongkol">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Soto Tongkol</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 21: Soto Mata Sapi -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-sotomata')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/soto mata.jpg" onerror="this.src='/img/arsip2.png'" alt="Soto Mata Sapi">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Soto Mata Sapi</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Kecamatan Burneh
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 22: Bongko Arosbaya -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-bongko')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/bongko arosbaya.jpg" onerror="this.src='/img/arsip2.png'" alt="Bongko Arosbaya">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Bongko Arosbaya</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Arosbaya
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                                <!-- Kartu 23: Ledre Sepuluh -->
                                <div class="sejarah-card-item" data-category="kuliner" onclick="window.showWarisanDetail('block-ledre')">
                                    <div class="sejarah-card-img-wrap">
                                        <span class="sejarah-card-badge" style="background:#D97706;color:white;">KULINER</span>
                                        <img src="/img/kuliner/ledre sepuluh.jpg" onerror="this.src='/img/arsip2.png'" alt="Ledre Sepuluh">
                                    </div>
                                    <div class="sejarah-card-body">
                                        <div>
                                            <h3 class="sejarah-card-title">Ledre Sepuluh</h3>
                                            <div class="sejarah-card-location">
                                                <i class="fa-solid fa-map-location-dot"></i> Bangkalan
                                            </div>
                                        </div>
                                        <div class="sejarah-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>

                            </div>

                            <div class="mt-4">
                                <button class="materi-btn-action" onclick="window.markAsRead('warisan')">Tandai Selesai Modul Warisan Budaya</button>
                            </div>
                        </div>

                        <!-- KONTEN DETAIL WARISAN BUDAYA -->
                        <div id="warisanDetail" class="sejarah-detail-container">
                        <div class="materi-scroll-box" id="scrollBoxWarisan">

                                <!-- Blok 1: Karapan Sapi -->
                                <div class="sejarah-block" id="block-karapan">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-horse-head"></i> Karapan Sapi</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-karapan')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-karapan')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-karapan')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/karapan sapi.jpg" alt="Karapan Sapi">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-karapan">
                                            <p>Karapan Sapi adalah tradisi balap sapi khas masyarakat Madura yang telah berlangsung secara turun-temurun. Tradisi ini bukan hanya sekadar perlombaan ketangkasan, melainkan juga ajang prestise bagi para pemilik sapi. Sapi-sapi yang dilombakan merupakan sapi pilihan yang dirawat secara khusus agar memiliki kecepatan dan kekuatan maksimal di lintasan.</p>
                                            <p>Dalam pelaksanaannya, sepasang sapi dikendalikan oleh seorang joki menggunakan kereta kayu melintasi lintasan pacu. Acara ini biasanya diiringi dengan sorak-sorai penonton dan musik tradisional saronen yang semakin memeriahkan suasana. Karapan Sapi menjadi simbol kekuatan, kerja keras, serta kebanggaan masyarakat Madura, sekaligus daya tarik wisata budaya yang sangat populer.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 2: Tari Moang Sangkal -->
                                <div class="sejarah-block" id="block-moang">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-person-dress"></i> Tari Moang Sangkal</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-moang')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-moang')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-moang')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/tari moang sangkal.jpg" alt="Tari Moang Sangkal">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-moang">
                                            <p>Tari Moang Sangkal adalah tarian tradisional Madura yang memiliki makna sakral sebagai tarian penolak bala atau menjauhkan diri dari malapetaka. "Moang" berarti membuang, sedangkan "Sangkal" berarti kesialan. Tarian ini umumnya dibawakan oleh penari perempuan dengan gerakan yang gemulai, anggun, namun tetap tegas sesuai dengan karakteristik masyarakat Madura.</p>
                                            <p>Dalam pertunjukannya, penari sering kali membawa mangkok kuningan yang berisi beras kuning dan bunga sebagai simbol doa dan harapan keselamatan. Tari Moang Sangkal biasa dipentaskan pada acara-acara besar, penyambutan tamu kehormatan, hingga ritual adat budaya setempat yang sarat akan makna spiritual dan penghormatan kepada Sang Pencipta.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 3: Sapi Sonok -->
                                <div class="sejarah-block" id="block-sonok">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-ribbon"></i> Sapi Sonok</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-sonok')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-sonok')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-sonok')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/sapi sonok.jpg" alt="Sapi Sonok">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-sonok">
                                            <p>Sapi Sonok adalah tradisi peragaan atau kontes kecantikan sepasang sapi betina yang dihias dengan pernak-pernik dekoratif khas Madura. Berbeda dengan Karapan Sapi yang mengutamakan kecepatan, Sapi Sonok lebih menitikberatkan pada keindahan, keserasian langkah, dan keanggunan sapi saat berjalan menyusuri lintasan menuju garis akhir (gapura).</p>
                                            <p>Sapi yang diikutkan dalam kontes ini dirawat dengan sangat baik, mulai dari asupan gizi, kebersihan, hingga pelatihan berjalan. Saat tampil, sapi-sapi tersebut dipakaikan pakaian adat sapi yang mewah dan diiringi alunan musik saronen. Tradisi ini menonjolkan nilai kelembutan, seni, dan apresiasi peternak Madura terhadap hewan peliharaannya.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 4: Rokat Tase -->
                                <div class="sejarah-block" id="block-rokat">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-water"></i> Rokat Tase'</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-rokat')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-rokat')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-rokat')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/rokat tase.jpg" alt="Rokat Tase">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-rokat">
                                            <p>Rokat Tase' (Petik Laut) merupakan upacara syukuran yang rutin diselenggarakan oleh masyarakat nelayan di pesisir Bangkalan dan Madura secara umum. Tradisi ini dilakukan sebagai wujud rasa syukur kepada Sang Pencipta atas hasil tangkapan laut yang melimpah selama satu tahun terakhir, serta sebagai doa agar dijauhkan dari marabahaya saat melaut di masa mendatang.</p>
                                            <p>Puncak acara Rokat Tase' ditandai dengan pelepasan sesaji atau perahu kecil yang dihias (getek) ke tengah laut, diiringi dengan pembacaan doa oleh tokoh agama atau sesepuh desa. Selain prosesi sakral, perayaan ini juga sering dimeriahkan dengan berbagai perlombaan, pertunjukan seni, dan makan bersama, yang bertujuan untuk mempererat tali silaturahmi antarwarga pesisir.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 5: Tari Rokat -->
                                <div class="sejarah-block" id="block-tarirokat">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-person-dress"></i> Tari Rokat</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-tarirokat')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-tarirokat')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-tarirokat')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/tari rokat.jpg" onerror="this.src='/img/arsip3.png'" alt="Tari Rokat">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-tarirokat">
                                            <p>Tarian yang berkaitan dengan tradisi rokat atau ritual masyarakat Madura. Gerak dan penyajiannya dapat merepresentasikan harapan akan keselamatan, kesejahteraan, serta hubungan masyarakat dengan tradisi leluhur.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 6: Tari Angklung Topeng -->
                                <div class="sejarah-block" id="block-angklung">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-person-dress"></i> Tari Angklung Topeng</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-angklung')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-angklung')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-angklung')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/tari angklung topeng.jpg" onerror="this.src='/img/arsip3.png'" alt="Tari Angklung Topeng">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-angklung">
                                            <p>Pertunjukan tari yang memadukan unsur gerak, topeng, dan musik tradisional. Kesenian ini memperlihatkan kreativitas masyarakat dalam mengolah seni pertunjukan sebagai bagian dari warisan budaya daerah.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 7: Tari Nelayan -->
                                <div class="sejarah-block" id="block-tarinelayan">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-person-dress"></i> Tari Nelayan</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-tarinelayan')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-tarinelayan')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-tarinelayan')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/tari nelayan.jpg" onerror="this.src='/img/arsip3.png'" alt="Tari Nelayan">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-tarinelayan">
                                            <p>Tarian bertema kehidupan masyarakat pesisir yang menggambarkan aktivitas melaut, kerja sama, dan semangat para nelayan. Tema ini sesuai dengan kehidupan sebagian masyarakat pesisir Bangkalan.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 8: Sholawat Nabi -->
                                <div class="sejarah-block" id="block-sholawatnabi">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-music"></i> Sholawat Nabi</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-sholawatnabi')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-sholawatnabi')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-sholawatnabi')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/sholawat nabi.jpg" onerror="this.src='/img/arsip3.png'" alt="Sholawat Nabi">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-sholawatnabi">
                                            <p>Seni pertunjukan yang memadukan gerakan tari dengan lantunan selawat. Pertunjukan ini mencerminkan perpaduan seni dan nilai keagamaan dalam kehidupan masyarakat Madura.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 9: Sandur Madura -->
                                <div class="sejarah-block" id="block-sandur">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-masks-theater"></i> Sandur Madura</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-sandur')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-sandur')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-sandur')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/sandur madura.jpg" onerror="this.src='/img/arsip2.png'" alt="Sandur Madura">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-sandur">
                                            <p>Kesenian pertunjukan tradisional yang memadukan gerak, musik, dan interaksi antarpelaku seni. Sandur memiliki fungsi hiburan sekaligus menjadi sarana menjaga kebersamaan dan identitas budaya masyarakat.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 10: Hadrah Jidor -->
                                <div class="sejarah-block" id="block-hadrah">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-drum"></i> Hadrah Jidor</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-hadrah')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-hadrah')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-hadrah')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/hadrah jidor.jpg" onerror="this.src='/img/arsip2.png'" alt="Hadrah Jidor">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-hadrah">
                                            <p>Kesenian musik bernuansa Islami yang menggunakan alat tabuh dan lantunan pujian atau selawat. Pertunjukan ini dapat dijumpai dalam kegiatan keagamaan dan acara masyarakat.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 11: Kejung Bangkalan -->
                                <div class="sejarah-block" id="block-kejung">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-microphone-lines"></i> Kejung Bangkalan</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-kejung')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-kejung')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-kejung')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/kejung bangkalan.jpg" onerror="this.src='/img/arsip2.png'" alt="Kejung Bangkalan">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-kejung">
                                            <p>Seni sastra lisan berupa lantunan tembang dengan bentuk pantun atau papareghan. Kejung menyimpan ungkapan, pesan, dan pengalaman hidup yang diwariskan melalui tradisi tutur.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 12: Kirab Budaya -->
                                <div class="sejarah-block" id="block-kirab">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-people-group"></i> Kirab Budaya</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-kirab')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-kirab')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-kirab')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/kirab budaya.jpg" onerror="this.src='/img/arsip3.png'" alt="Kirab Budaya">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-kirab">
                                            <p>Kegiatan arak-arakan yang menampilkan kekayaan budaya daerah melalui pakaian tradisional, kesenian, dan atribut khas masyarakat. Kirab budaya dapat menjadi sarana memperkenalkan warisan lokal kepada generasi muda.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 13: Peringatan Maulid Nabi -->
                                <div class="sejarah-block" id="block-maulid">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-mosque"></i> Peringatan Maulid Nabi</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-maulid')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-maulid')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-maulid')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/maulid.jpg" onerror="this.src='/img/arsip3.png'" alt="Peringatan Maulid Nabi">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-maulid">
                                            <p>Peringatan kelahiran Nabi Muhammad SAW yang diisi dengan pembacaan selawat, doa, pengajian, dan kegiatan berbagi. Tradisi ini mencerminkan kuatnya kehidupan keagamaan serta kebersamaan masyarakat.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 14: Tellasan (Lebaran) -->
                                <div class="sejarah-block" id="block-tellasan">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-handshake"></i> Tellasan (Lebaran)</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-tellasan')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-tellasan')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-tellasan')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/budaya/tellasan.jpg" onerror="this.src='/img/arsip3.png'" alt="Tellasan (Lebaran)">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-tellasan">
                                            <p>Perayaan hari raya yang menjadi momen silaturahmi, saling memaafkan, dan berkumpul bersama keluarga. Tradisi ini merupakan kebiasaan sosial-keagamaan masyarakat Madura secara umum.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 15: Nasi Serpang -->
                                <div class="sejarah-block" id="block-serpang">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-utensils"></i> Nasi Serpang</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-serpang')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-serpang')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-serpang')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/nasi serpang.jpg" onerror="this.src='/img/arsip2.png'" alt="Nasi Serpang">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-serpang">
                                            <p>Nasi Serpang merupakan makanan tradisional khas Kabupaten Bangkalan, Madura, yang terdiri atas nasi putih dengan beragam lauk dalam satu sajian. Hidangan ini dikenal karena memadukan lauk dari hasil laut dan olahan daging, sehingga menghadirkan cita rasa yang beragam.</p>
                                            <p>Dalam satu porsi Nasi Serpang, lauk yang biasa disajikan antara lain pepes ikan tongkol, kerang berbumbu, telur asin, dendeng sapi, sohun berbumbu, sambal terasi, dan kerupuk. Jenis lauk dapat berbeda sesuai penjualnya.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 16: Topak Ladeh -->
                                <div class="sejarah-block" id="block-topak">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-bowl-food"></i> Topak Ladeh</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-topak')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-topak')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-topak')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/topak lodeh.jpg" onerror="this.src='/img/arsip2.png'" alt="Topak Ladeh">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-topak">
                                            <p>Topak Ladeh adalah hidangan khas Bangkalan yang identik dengan perayaan Lebaran Ketupat atau Tellasan Topak. Kata topak merujuk pada ketupat atau lontong, sedangkan ladeh merujuk pada kuah berbumbu yang menjadi ciri utama hidangan ini.</p>
                                            <p>Makanan ini disajikan dengan ketupat atau lontong yang dipadukan dengan kuah kental berbumbu rempah dan santan. Lauknya dapat berupa daging sapi, jeroan, serta sayuran seperti kacang panjang. Bumbu yang digunakan menghasilkan rasa gurih dan kaya rempah.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 17: Tajin Sobih -->
                                <div class="sejarah-block" id="block-tajin">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-bowl-rice"></i> Tajin Sobih</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-tajin')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-tajin')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-tajin')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/tajin sobih.jpg" onerror="this.src='/img/arsip2.png'" alt="Tajin Sobih">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-tajin">
                                            <p>Tajin Sobih merupakan jajanan tradisional khas Bangkalan yang berasal dari Desa Sobih, Kecamatan Burneh. Dalam bahasa Madura, kata tajin berarti bubur, sedangkan Sobih merujuk pada nama desa asal makanan tersebut.</p>
                                            <p>Tajin Sobih terdiri atas beberapa jenis olahan bubur dan adonan tepung, seperti bubur sumsum, butiran kenyal menyerupai cenil atau grendul, serta mutiara. Sajian tersebut dilengkapi santan dan siraman gula merah cair yang memberikan perpaduan rasa manis dan gurih.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 18: Sewel -->
                                <div class="sejarah-block" id="block-sewel">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-utensils"></i> Sewel</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-sewel')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-sewel')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-sewel')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/sewel socah.jpg" onerror="this.src='/img/arsip2.png'" alt="Sewel">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-sewel">
                                            <p>Sewel merupakan jajanan gurih khas wilayah Socah, Kabupaten Bangkalan. Makanan ini dibuat dari tepung tapioka atau tepung kanji yang dicampur dengan udang dan bumbu. Adonan kemudian dibentuk dan dimasak hingga bagian luarnya matang, sementara bagian dalamnya tetap kenyal.</p>
                                            <p>Sewel memiliki karakter rasa gurih dengan aroma udang yang cukup kuat. Teksturnya sering dibandingkan dengan cireng karena sama-sama berbahan dasar tepung tapioka, tetapi campuran udang menjadi salah satu ciri pembeda Sewel.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 19: Bebek Sinjay -->
                                <div class="sejarah-block" id="block-sinjay">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-drumstick-bite"></i> Bebek Sinjay</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-sinjay')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-sinjay')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-sinjay')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/bebek sinjay.jpg" onerror="this.src='/img/arsip2.png'" alt="Bebek Sinjay">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-sinjay">
                                            <p>Bebek Sinjay merupakan kuliner populer dari Bangkalan yang dikenal melalui sajian bebek goreng berbumbu dan sambal pencit. Nama Sinjay melekat pada usaha kuliner yang berkembang di Bangkalan dan menjadi salah satu tujuan wisata kuliner di Madura.</p>
                                            <p>Hidangan ini umumnya terdiri atas nasi putih, daging bebek yang dimasak dengan bumbu kemudian digoreng, sambal pencit, dan pelengkap seperti kremesan. Sambal pencit dibuat dengan bahan utama mangga muda yang dipadukan dengan cabai dan bumbu lainnya. Rasanya cenderung pedas dan asam segar, sehingga memberikan kontras dengan rasa gurih bebek goreng.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 20: Soto Tongkol -->
                                <div class="sejarah-block" id="block-sototongkol">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-bowl-food"></i> Soto Tongkol</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-sototongkol')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-sototongkol')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-sototongkol')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/soto tongkol.jpg" onerror="this.src='/img/arsip2.png'" alt="Soto Tongkol">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-sototongkol">
                                            <p>Soto Tongkol merupakan hidangan berkuah yang menggunakan ikan tongkol sebagai bahan utama. Berbeda dengan soto yang umumnya menggunakan daging sapi atau ayam, makanan ini memanfaatkan ikan sehingga menghasilkan karakter rasa yang berbeda.</p>
                                            <p>Ikan tongkol diolah bersama bumbu rempah untuk menghasilkan kuah yang gurih dan beraroma. Hidangan ini dapat disajikan dengan nasi atau lontong serta pelengkap sesuai kebiasaan penjualnya. Komposisi dan cara penyajiannya bisa berbeda antara satu tempat dengan tempat lainnya.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 21: Soto Mata Sapi -->
                                <div class="sejarah-block" id="block-sotomata">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-bowl-food"></i> Soto Mata Sapi</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-sotomata')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-sotomata')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-sotomata')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/soto mata.jpg" onerror="this.src='/img/arsip2.png'" alt="Soto Mata Sapi">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-sotomata">
                                            <p>Soto Mata Sapi merupakan kuliner unik yang dikenal di wilayah Burneh, Kabupaten Bangkalan. Sesuai namanya, bahan utama yang digunakan adalah bagian mata sapi yang diolah bersama kuah soto berbumbu.</p>
                                            <p>Sebelum disajikan, bagian mata sapi direbus cukup lama agar teksturnya menjadi lunak. Kuahnya dikenal berwarna kemerahan dan kaya rempah. Hidangan ini dapat disajikan bersama lontong, kecambah, bawang goreng, dan kacang goreng, dengan tambahan jeroan sesuai pilihan.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 22: Bongko Arosbaya -->
                                <div class="sejarah-block" id="block-bongko">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-utensils"></i> Bongko Arosbaya</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-bongko')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-bongko')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-bongko')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/bongko arosbaya.jpg" onerror="this.src='/img/arsip2.png'" alt="Bongko Arosbaya">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-bongko">
                                            <p>Bongko Arosbaya tercatat sebagai salah satu kuliner tradisional yang dikaitkan dengan wilayah Arosbaya, Kabupaten Bangkalan. Nama makanan ini menunjukkan keterkaitannya dengan daerah setempat dan menjadi salah satu contoh kekayaan jajanan lokal Madura.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Blok 23: Ledre Sepuluh -->
                                <div class="sejarah-block" id="block-ledre">
                                    <div class="sejarah-header">
                                        <h3 class="materi-sejarah-title"><i class="fa-solid fa-utensils"></i> Ledre Sepuluh</h3>
                                        <div class="tool-group">
                                            <button class="materi-action-icon-btn" onclick="window.speakText('teks-ledre')" title="Bacakan Teks"><i class="fa-solid fa-volume-high"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.copyText('teks-ledre')" title="Salin Teks"><i class="fa-solid fa-copy"></i></button>
                                            <button class="materi-action-icon-btn" onclick="window.toggleBookmark('block-ledre')" title="Simpan/Bookmark"><i class="fa-solid fa-bookmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="sejarah-detail-content">
                                        <div class="sejarah-detail-image">
                                            <div class="single-image-container">
                                                <img src="/img/kuliner/ledre sepuluh.jpg" onerror="this.src='/img/arsip2.png'" alt="Ledre Sepuluh">
                                            </div>
                                        </div>
                                        <div class="sejarah-detail-text" id="teks-ledre">
                                            <p>Ledre Sepuluh termasuk dalam daftar kuliner khas Kabupaten Bangkalan. Makanan ini dapat diperkenalkan sebagai bagian dari ragam jajanan tradisional yang berkembang di masyarakat setempat.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <!-- 3. KAMUS MADURA (RUMAH BUDAYA) -->
            <section id="rumah-budaya" class="materi-section">
                <div class="materi-card-game">
                    <div class="materi-text-content" style="height: 100%;">
                        <h2>Kamus Bahasa Madura</h2>
                        
                        <!-- Interactive Search Bar & History -->
                        <div class="k-interactive-bar">
                            <button id="btnLangToggle" class="k-lang-toggle-btn" onclick="window.toggleKamusLang()">
                                IND <i class="fa-solid fa-arrows-rotate"></i> MAD
                            </button>
                            <div class="k-input-wrapper">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <input type="text" id="kamusInputInteractive" class="k-interactive-input" placeholder="Ketik kata Indonesia lalu tekan Enter..." onkeyup="window.handleKamusInput(event)">
                            </div>
                            <button class="k-btn-riwayat" onclick="window.toggleHistoryPanel()">
                                <i class="fa-solid fa-clock-rotate-left"></i> Riwayat
                            </button>
                        </div>

                        <!-- Main Dictionary UI -->
                        <div class="k-ui-wrapper">
                            
                            <!-- Left Column: Stats & Filter -->
                            <div class="k-col-left">
                                <div class="k-card">
                                    <div class="k-card-title"><i class="fa-solid fa-chart-pie"></i> Statistik Kata</div>
                                    <div style="display: flex; flex-direction: column; gap: 4px;">
                                        <div class="k-stat-item" style="background-color: #7C4C24; color: white; border-radius: 8px; padding: 12px 15px; margin-bottom: 5px;">
                                            <span style="font-weight: 700;">Semua Kata</span> <span class="k-count" id="countAll" style="font-weight: 700;">0</span>
                                        </div>
                                        <div class="k-stat-item">
                                            <span>Kata Benda (Nomina)</span> <span class="k-count" id="countNomina">0</span>
                                        </div>
                                        <div class="k-stat-item">
                                            <span>Kata Kerja (Verba)</span> <span class="k-count" id="countVerba">0</span>
                                        </div>
                                        <div class="k-stat-item">
                                            <span>Kata Sifat (Adjektiva)</span> <span class="k-count" id="countAdjektiva">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Center Column: Word Detail -->
                            <div class="k-col-center">
                                <div class="k-card" style="flex-grow: 1;">
                                    <div class="k-word-header">
                                        <h1 class="k-main-word" id="kamusMainWord">Pilih/Cari Kata</h1>
                                        <button class="k-btn-audio-main" onclick="window.speakText('kamusMainWord')"><i class="fa-solid fa-volume-high"></i></button>
                                    </div>
                                    <div class="k-pronounce" id="kamusPronounce">/pencarian/</div>
                                    
                                    <div class="k-badges-row">
                                        <span class="k-badge-main" id="kamusTipe">Kata Umum</span>
                                        <span class="k-badge-sub">Bangkalan</span>
                                    </div>

                                    <div class="k-section-title mt-3">Arti / Terjemahan:</div>
                                    <div class="k-arti-text" id="kamusArtiWord">Silakan gunakan kolom pencarian di atas untuk mencari terjemahan kata.</div>

                                    <div class="k-contoh-box">
                                        <div class="k-contoh-madura" id="kamusContohMadura">"..."</div>
                                        <div class="k-contoh-indo" id="kamusContohIndo">(...)</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column: Related & History Panel -->
                            <div class="k-col-right">
                                
                                <!-- Panel Riwayat -->
                                <div id="historyPanel" class="k-history-card">
                                    <div class="k-history-header-custom">
                                        <h3>Riwayat Pencarian</h3>
                                        <button class="k-close-btn-custom" onclick="window.toggleHistoryPanel()" title="Tutup Riwayat">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                    <ul id="historyList" class="k-history-list">
                                        <li class="k-history-empty">Belum ada riwayat pencarian.</li>
                                    </ul>
                                </div>

                                <div class="k-card">
                                    <div class="k-related-header">
                                        <strong>Kata Terkait / Sinonim</strong>
                                    </div>
                                    <div class="k-related-list" id="kataTerkaitList">
                                        <div class="k-related-item">Tidak ada hasil pencarian. <span>( - )</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 4. GALERI MUSEUM (DENGAN DATA KOLEKSI MUSEUM CAKRANINGRAT) -->
            <section id="galeri" class="materi-section">
                <div class="materi-card-game">
                    <div class="materi-text-content">
                        <h2>Galeri Koleksi Museum Cakraningrat</h2>
                        <p class="section-desc">Telusuri berbagai koleksi peninggalan bersejarah, artefak kerajaan, dan barang antik yang tersimpan di Museum Cakraningrat Bangkalan.</p>

                        <!-- Grid Kartu Koleksi dengan gaya Warisan Budaya -->
                        <div class="row g-4 mt-3">
                            
                            <!-- Koleksi 1: Keramik -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card card-discover h-100" style="cursor: pointer;" onclick="alert('Keramik: Barang bukti perdagangan gelap berupa piring, mangkok, dan lepek asal Eropa, China, India, Khemer, dan Jepang.')">
                                    <div class="img-wrapper" style="height: 200px;">
                                        <img loading="lazy" decoding="async" src="src/assets/images/museum_cakraningrat/koleksi1/keramik1.jpg" alt="Keramik" onerror="this.src='https://images.unsplash.com/photo-1542124749-9856f6c91a32?auto=format&fit=crop&w=400&q=80'">
                                        <div class="badge-discover">Keramik</div>
                                    </div>
                                    <div class="card-body-custom p-3">
                                        <h5 class="card-title-custom" style="font-size: 1.2rem;">Keramik Kuno</h5>
                                        <div class="card-location small text-muted"><i class="fa-solid fa-box-archive text-danger me-1"></i> Piring, Mangkok & Dekorasi</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Koleksi 2: Pekinangan -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card card-discover h-100" style="cursor: pointer;" onclick="alert('Pekinangan: Seperangkat wadah kuningan untuk sirih pinang bangsawan, lengkap dengan Bukor dan Paduwan.')">
                                    <div class="img-wrapper" style="height: 200px;">
                                        <img loading="lazy" decoding="async" src="src/assets/images/museum_cakraningrat/koleksi1/pekinangan2.jpg" alt="Pekinangan" onerror="this.src='https://images.unsplash.com/photo-1542124749-9856f6c91a32?auto=format&fit=crop&w=400&q=80'">
                                        <div class="badge-discover">Peralatan</div>
                                    </div>
                                    <div class="card-body-custom p-3">
                                        <h5 class="card-title-custom" style="font-size: 1.2rem;">Pekinangan</h5>
                                        <div class="card-location small text-muted"><i class="fa-solid fa-box-archive text-danger me-1"></i> Wadah Sirih Bangsawan</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Koleksi 3: Tenong dan Lesung -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card card-discover h-100" style="cursor: pointer;" onclick="alert('Tenong & Lesung: Wadah anyaman bambu untuk makanan hajatan serta alat tradisional penumbuk padi.')">
                                    <div class="img-wrapper" style="height: 200px;">
                                        <img loading="lazy" decoding="async" src="src/assets/images/museum_cakraningrat/koleksi1/tenong dan lesung3.jpg" alt="Tenong dan Lesung" onerror="this.src='https://images.unsplash.com/photo-1542124749-9856f6c91a32?auto=format&fit=crop&w=400&q=80'">
                                        <div class="badge-discover">Tradisional</div>
                                    </div>
                                    <div class="card-body-custom p-3">
                                        <h5 class="card-title-custom" style="font-size: 1.2rem;">Tenong dan Lesung</h5>
                                        <div class="card-location small text-muted"><i class="fa-solid fa-box-archive text-danger me-1"></i> Alat Rumah Tangga</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Koleksi 4: Kursi Keraton -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card card-discover h-100" style="cursor: pointer;" onclick="alert('Kursi Keraton: Alas duduk penguasa lokal Bangkalan berukir kayu, termasuk kursi unik berbentuk belah ketupat untuk ahli nujum.')">
                                    <div class="img-wrapper" style="height: 200px;">
                                        <img loading="lazy" decoding="async" src="src/assets/images/museum_cakraningrat/koleksi1/kursi keraton4.jpg" alt="Kursi Keraton" onerror="this.src='https://images.unsplash.com/photo-1542124749-9856f6c91a32?auto=format&fit=crop&w=400&q=80'">
                                        <div class="badge-discover">Kerajaan</div>
                                    </div>
                                    <div class="card-body-custom p-3">
                                        <h5 class="card-title-custom" style="font-size: 1.2rem;">Kursi Keraton</h5>
                                        <div class="card-location small text-muted"><i class="fa-solid fa-box-archive text-danger me-1"></i> Kayu Ukir Pilihan</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Koleksi 5: Batik Madura -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card card-discover h-100" style="cursor: pointer;" onclick="alert('Batik: Karya seni kain bermotif khas Madura dengan corak unik sebagai identitas budaya lokal.')">
                                    <div class="img-wrapper" style="height: 200px;">
                                        <img loading="lazy" decoding="async" src="src/assets/images/museum_cakraningrat/koleksi1/batik5.jpg" alt="Batik" onerror="this.src='https://images.unsplash.com/photo-1542124749-9856f6c91a32?auto=format&fit=crop&w=400&q=80'">
                                        <div class="badge-discover">Kriya</div>
                                    </div>
                                    <div class="card-body-custom p-3">
                                        <h5 class="card-title-custom" style="font-size: 1.2rem;">Batik Madura</h5>
                                        <div class="card-location small text-muted"><i class="fa-solid fa-box-archive text-danger me-1"></i> Kain Tradisional</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Koleksi 6: Meriam Peninggalan -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card card-discover h-100" style="cursor: pointer;" onclick="alert('Meriam: Senjata peperangan perunggu peninggalan Cakraningrat II dan VOC lengkap dengan lambang Cakra.')">
                                    <div class="img-wrapper" style="height: 200px;">
                                        <img loading="lazy" decoding="async" src="src/assets/images/museum_cakraningrat/koleksi4/Meriam1.jpg" alt="Meriam" onerror="this.src='https://images.unsplash.com/photo-1542124749-9856f6c91a32?auto=format&fit=crop&w=400&q=80'">
                                        <div class="badge-discover">Militer</div>
                                    </div>
                                    <div class="card-body-custom p-3">
                                        <h5 class="card-title-custom" style="font-size: 1.2rem;">Meriam Kuno</h5>
                                        <div class="card-location small text-muted"><i class="fa-solid fa-box-archive text-danger me-1"></i> Senjata Perang Kerajaan</div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="mt-4">
                            <button class="materi-btn-action" onclick="window.markAsRead('galeri')">Tandai Selesai Modul Galeri</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- TOMBOL SCROLL TO TOP -->
        <button id="scrollTopBtn" class="materi-scroll-top-btn" onclick="window.scrollToTop()" title="Kembali ke Atas">
            <i class="fa-solid fa-arrow-up"></i>
        </button>
    </div>
</div>
`;

export default function MateriPage() {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        // ========================================================
        // 1. SISTEM NAVIGASI TAB MATERI & SIDEBAR
        // ========================================================
        const tabs = document.querySelectorAll('.materi-tab');
        const sections = document.querySelectorAll('.materi-section');

        // Sembunyikan search bar atas jika default aktif di kamus/galeri/vr
        const activeTabCheck = document.querySelector('.materi-tab.active');
        const searchWrapperInit = document.getElementById('searchWrapper');
        if (activeTabCheck && searchWrapperInit) {
            const activeTarget = activeTabCheck.getAttribute('data-target');
            if (activeTarget === 'rumah-budaya' || activeTarget === 'galeri' || activeTarget === 'virtual360') {
                searchWrapperInit.classList.add('hidden-search');
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                if (targetSection) targetSection.classList.add('active');

                // TUTUP SIDEBAR DENGAN HALUS SAAT MENU DIPILIH
                const sidebar = document.getElementById('materiSidebar');
                if (sidebar) {
                    sidebar.classList.remove('show');
                }

                // TAMBAHAN: Sembunyikan pencarian atas jika di menu Kamus, Galeri, atau VR
                const searchWrapper = document.getElementById('searchWrapper');
                if (searchWrapper) {
                    if (targetId === 'rumah-budaya' || targetId === 'galeri' || targetId === 'virtual360') {
                        searchWrapper.classList.add('hidden-search');
                    } else {
                        searchWrapper.classList.remove('hidden-search');
                    }
                }
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                if (window.stopReadingTimer) window.stopReadingTimer();

                if (typeof window.backToSejarahMenu === 'function') window.backToSejarahMenu();
                if (typeof window.backToWarisanMenu === 'function') window.backToWarisanMenu();

                const btnBackTop = document.getElementById('btnBackTop');
                if (btnBackTop) btnBackTop.classList.remove('active');
            });
        });

        window.toggleSidebar = () => {
            const sidebar = document.getElementById('materiSidebar');
            if (sidebar) sidebar.classList.toggle('show');
        };

        // ========================================================
        // 2. SISTEM TIMER 3 MENIT
        // ========================================================
        let readingInterval = null;

        window.startReadingTimer = () => {
            if (window.stopReadingTimer) window.stopReadingTimer();
            const timerWrapper = document.getElementById('readingTimerWrapper');
            const timerBar = document.getElementById('readingTimerBar');
            const timerStatusText = document.getElementById('timerStatusText');

            if (!timerWrapper || !timerBar || !timerStatusText) return;
            timerWrapper.classList.add('active');

            let duration = 180;
            let timeLeft = duration;
            timerBar.style.width = '100%';

            readingInterval = setInterval(() => {
                timeLeft -= 1;
                let percentage = (timeLeft / duration) * 100;
                timerBar.style.width = `${percentage}%`;

                let mins = Math.floor(timeLeft / 60);
                let secs = timeLeft % 60;
                timerStatusText.innerHTML = `<i class="fa-solid fa-clock"></i> ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

                if (timeLeft <= 0) {
                    clearInterval(readingInterval);
                    timerStatusText.innerHTML = '<i class="fa-solid fa-clock"></i> Selesai!';
                    setTimeout(() => {
                        if (timerWrapper) timerWrapper.classList.remove('active');
                    }, 2000);
                }
            }, 1000);
        };

        window.stopReadingTimer = () => {
            if (readingInterval) {
                clearInterval(readingInterval);
                readingInterval = null;
            }
            const timerWrapper = document.getElementById('readingTimerWrapper');
            if (timerWrapper) timerWrapper.classList.remove('active');
        };

        // ========================================================
        // LOGIC MENU SEJARAH & WARISAN BUDAYA
        // ========================================================
        let currentSlideIndex = 0;

        const updateSlider = () => {
            const activeBlock = document.querySelector('.sejarah-block.active-block');
            if (!activeBlock) return;
            const track = activeBlock.querySelector('#sliderTrack');
            const dots = activeBlock.querySelectorAll('.slider-dot');
            if (track) {
                track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            }
            dots.forEach((dot, idx) => {
                if (idx === currentSlideIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        };

        window.slideImage = (direction) => {
            currentSlideIndex = (currentSlideIndex + direction + 5) % 5;
            updateSlider();
        };

        window.currentSlide = (index) => {
            currentSlideIndex = index;
            updateSlider();
        };

        window.showSejarahDetail = (blockId) => {
            const menu = document.getElementById('sejarahMenu');
            if (menu) menu.classList.add('hidden');

            const detailContainer = document.getElementById('sejarahDetail');
            if (detailContainer) detailContainer.classList.add('active');

            const searchWrapper = document.getElementById('searchWrapper');
            if (searchWrapper) searchWrapper.classList.add('hidden-search');

            const btnBackTop = document.getElementById('btnBackTop');
            if (btnBackTop) {
                btnBackTop.setAttribute('onclick', 'window.backToSejarahMenu()');
                btnBackTop.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Kembali ke Pilihan Situs';
                btnBackTop.classList.add('active');
            }

            const allBlocks = document.querySelectorAll('.sejarah-block');
            allBlocks.forEach(block => block.classList.remove('active-block'));

            const activeBlock = document.getElementById(blockId);
            if (activeBlock) activeBlock.classList.add('active-block');

            currentSlideIndex = 0;
            updateSlider();

            const viewer = document.getElementById('materiContent');
            if (viewer) viewer.scrollTop = 0;
            window.startReadingTimer();
        };

        window.backToSejarahMenu = () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (window.stopReadingTimer) window.stopReadingTimer(); 

            const detailContainer = document.getElementById('sejarahDetail');
            if (detailContainer) detailContainer.classList.remove('active');

            const menu = document.getElementById('sejarahMenu');
            if (menu) menu.classList.remove('hidden');

            const searchWrapper = document.getElementById('searchWrapper');
            if (searchWrapper) searchWrapper.classList.remove('hidden-search');

            const btnBackTop = document.getElementById('btnBackTop');
            if (btnBackTop) btnBackTop.classList.remove('active');
        };

        window.showWarisanDetail = (blockId) => {
            const menu = document.getElementById('warisanMenu');
            if (menu) menu.classList.add('hidden');

            const detailContainer = document.getElementById('warisanDetail');
            if (detailContainer) detailContainer.classList.add('active');

            const searchWrapper = document.getElementById('searchWrapper');
            if (searchWrapper) searchWrapper.classList.add('hidden-search');

            const btnBackTop = document.getElementById('btnBackTop');
            if (btnBackTop) {
                btnBackTop.setAttribute('onclick', 'window.backToWarisanMenu()');
                btnBackTop.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Kembali ke Pilihan Tradisi';
                btnBackTop.classList.add('active');
            }

            const allBlocks = document.querySelectorAll('.sejarah-block');
            allBlocks.forEach(block => block.classList.remove('active-block'));

            const activeBlock = document.getElementById(blockId);
            if (activeBlock) activeBlock.classList.add('active-block');

            const viewer = document.getElementById('materiContent');
            if (viewer) viewer.scrollTop = 0;
            window.startReadingTimer();
        };

        window.backToWarisanMenu = () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (window.stopReadingTimer) window.stopReadingTimer(); 

            const detailContainer = document.getElementById('warisanDetail');
            if (detailContainer) detailContainer.classList.remove('active');

            const menu = document.getElementById('warisanMenu');
            if (menu) menu.classList.remove('hidden');

            const searchWrapper = document.getElementById('searchWrapper');
            if (searchWrapper) searchWrapper.classList.remove('hidden-search');

            const btnBackTop = document.getElementById('btnBackTop');
            if (btnBackTop) btnBackTop.classList.remove('active');
        };

        window.filterWarisan = (category, btnElement) => {
            const btns = document.querySelectorAll('.warisan-filter-btn');
            btns.forEach(btn => btn.classList.remove('active'));

            if (btnElement) {
                btnElement.classList.add('active');
            }

            const cards = document.querySelectorAll('#warisanMenu .sejarah-card-item');
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInMateri 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        // ============================================
        // LOGIC KAMUS FETCH API MYSQL
        // ============================================
        let isIndoToMadura = true;

        const fetchKamusStats = async () => {
            try {
                // AMBIL URL DARI ENV
                const API_URL = import.meta.env.VITE_API_URL; 
                const response = await fetch(`${API_URL}?action=stats&dialect=bangkalan`);
                const res = await response.json();

                if (res.status === 'success' && res.data) {
                    const countAll = document.getElementById('countAll');
                    const countNomina = document.getElementById('countNomina');
                    const countVerba = document.getElementById('countVerba');
                    const countAdjektiva = document.getElementById('countAdjektiva');

                    if (countAll) countAll.innerText = res.data.total;
                    if (countNomina) countNomina.innerText = res.data.nomina;
                    if (countVerba) countVerba.innerText = res.data.verba;
                    if (countAdjektiva) countAdjektiva.innerText = res.data.adjektiva;
                }
            } catch (error) {
                console.error("Gagal memuat statistik kamus:", error);
                const countAll = document.getElementById('countAll');
                if (countAll) countAll.innerText = "Error";
            }
        };

        fetchKamusStats();

        window.toggleKamusLang = () => {
            isIndoToMadura = !isIndoToMadura;
            const btn = document.getElementById('btnLangToggle');
            const input = document.getElementById('kamusInputInteractive');

            if (btn) {
                btn.innerHTML = isIndoToMadura ?
                    'IND <i class="fa-solid fa-arrows-rotate"></i> MAD' :
                    'MAD <i class="fa-solid fa-arrows-rotate"></i> IND';
            }

            if (input) {
                input.placeholder = isIndoToMadura ?
                    "Ketik kata Indonesia lalu tekan Enter..." :
                    "Ketik kata Madura lalu tekan Enter...";
            }

            window.updateKamusUI(null, null, isIndoToMadura);
        };

        window.renderHistory = () => {
            const list = document.getElementById('historyList');
            if (!list) return;

            let history = JSON.parse(localStorage.getItem('jejak_ai_history')) || [];

            if (history.length === 0) {
                list.innerHTML = '<li class="k-history-empty">Belum ada riwayat pencarian.</li>';
                return;
            }

            list.innerHTML = history.slice().reverse().map(item => `
                <li class="k-history-item" onclick="window.loadHistoryItem('${item.query}')">
                    <div class="k-history-query">"${item.query}"</div>
                    <div class="k-history-meta">
                        <span class="k-history-time"><i class="fa-regular fa-clock"></i> ${item.time}</span>
                        <span class="k-history-type">${item.type}</span>
                    </div>
                </li>
            `).join('');
        };

        window.toggleHistoryPanel = () => {
            const panel = document.getElementById('historyPanel');
            if (panel) {
                panel.classList.toggle('show');
                if (panel.classList.contains('show')) {
                    window.renderHistory();
                }
            }
        };

        window.loadHistoryItem = (query) => {
            const input = document.getElementById('kamusInputInteractive');
            if (input) {
                input.value = query;
                input.focus();
                const event = new KeyboardEvent('keyup', { key: 'Enter' });
                input.dispatchEvent(event);
            }
        };

        // ============================================
        // LOGIKA PENYARINGAN DIALEK BANGKALAN SAJA
        // ============================================
        // ============================================
        // LOGIKA PENYARINGAN DIALEK BANGKALAN SAJA
        // ============================================
        const formatDialekBangkalanSaja = (text) => {
            if (!text) return "";
            
            // Pecah kalimat jika ada tanda | (pipa) atau ; (titik koma)
            let parts = text.split(/\||;/);
            
            // Saring hanya bagian yang mengandung kata kunci wilayah Bangkalan {bkl}
            // ATAU yang merupakan kata umum/peribahasa yang tidak punya tag spesifik wilayah lain.
            let filteredParts = parts.filter(p => {
                const low = p.toLowerCase();
                if ((low.includes('{pmk}') || low.includes('{smp}') || low.includes('{sum}')) && !low.includes('{bkl}')) {
                    return false;
                }
                return true;
            });
            
            if (filteredParts.length === 0) {
                filteredParts = parts; 
            }
            
            // Gabungkan kembali dan ganti tag menjadi badge visual yang rapi
            let result = filteredParts.map(p => p.trim()).join('<br/>');
            
            result = result
                .replace(/{bkl}/gi, '<span style="background:#D97706; color:white; padding:2px 8px; border-radius:12px; font-size:0.65rem; vertical-align:middle; margin-left:6px; margin-right:4px;">Bangkalan</span>')
                .replace(/{pb}/gi, '<span style="background:#8B261D; color:white; padding:2px 8px; border-radius:12px; font-size:0.65rem; vertical-align:middle; margin-left:6px; margin-right:4px;">Peribahasa</span>')
                .replace(/{pmk}/gi, '')
                .replace(/{smp}/gi, '')
                .replace(/{sum}/gi, '');
                
            return result;
        };

       window.updateKamusUI = (query, dataList, isIndoToMad) => {
            const mainWord = document.getElementById('kamusMainWord');
            const artiWord = document.getElementById('kamusArtiWord');
            const pronounce = document.getElementById('kamusPronounce');
            const kataTerkait = document.getElementById('kataTerkaitList');
            const contohMadura = document.getElementById('kamusContohMadura');
            const contohIndo = document.getElementById('kamusContohIndo');

            if (!query && !dataList) {
                if (mainWord) mainWord.innerHTML = "Pilih/Cari Kata";
                if (artiWord) artiWord.innerHTML = "Silakan gunakan kolom pencarian di atas untuk mencari terjemahan kata.";
                if (pronounce) pronounce.innerHTML = "/pencarian/";
                return;
            }

            if (!dataList || (Array.isArray(dataList) && dataList.length === 0)) {
                if (mainWord) mainWord.innerHTML = query.toLowerCase();
                if (artiWord) artiWord.innerHTML = `<em>Kata tidak ditemukan dalam database MySQL.</em>`;
                if (pronounce) pronounce.innerHTML = `/- /`;
                if (contohMadura) contohMadura.innerHTML = `"..."`;
                if (contohIndo) contohIndo.innerHTML = "(...)";
                if (kataTerkait) kataTerkait.innerHTML = `<div class="k-related-item">Tidak ada hasil pencarian. <span>( - )</span></div>`;
                return;
            }

            // Ambil definisi utama (utamakan index = 1)
            let mainItem = Array.isArray(dataList) ? (dataList.find(item => item.sentence_index == 1) || dataList[0]) : dataList;
            
            // Ambil contoh kalimat (index > 1) untuk ditaruh di kotak bawah
            let exampleItem = Array.isArray(dataList) ? dataList.find(item => item.sentence_index > 1) : null;

            const terjemahanAsli = isIndoToMad ? mainItem.madura : mainItem.indo;
            const maknaAsli = isIndoToMad ? mainItem.indo : mainItem.madura;
            
            const terjemahanFormatted = formatDialekBangkalanSaja(terjemahanAsli);
            const maknaFormatted = formatDialekBangkalanSaja(maknaAsli);

            const tipeKata = mainItem.tipe ? mainItem.tipe : "Kata Umum";
            const rawPelafalan = terjemahanAsli.replace(/\{.*?\}/g, '').trim().toLowerCase();
            const pelafalan = mainItem.pelafalan ? mainItem.pelafalan : rawPelafalan.replace(/\s+/g, '.');

            if (mainWord) mainWord.innerHTML = terjemahanFormatted;
            if (artiWord) artiWord.innerHTML = `(${isIndoToMad ? 'Indo' : 'Madura'}) <br/> ${maknaFormatted}`;
            if (pronounce) pronounce.innerHTML = `/${pelafalan}/`;

            const badgeTipe = document.getElementById('kamusTipe');
            if (badgeTipe) badgeTipe.innerText = tipeKata;

            // Bagian Bawah: Menampilkan Contoh Kalimat jika ada
            if (exampleItem) {
                const exMadura = isIndoToMad ? exampleItem.madura : exampleItem.indo;
                const exIndo = isIndoToMad ? exampleItem.indo : exampleItem.madura;
                if (contohMadura) contohMadura.innerHTML = `"${formatDialekBangkalanSaja(exMadura)}"`;
                if (contohIndo) contohIndo.innerHTML = `(${formatDialekBangkalanSaja(exIndo)})`;
            } else {
                if (contohMadura) contohMadura.innerHTML = `"${terjemahanFormatted}"`;
                if (contohIndo) contohIndo.innerHTML = `(${maknaFormatted})`;
            }

            const cleanT = terjemahanAsli.replace(/\{.*?\}/g, '').split('|')[0].trim();
            const cleanM = maknaAsli.replace(/\{.*?\}/g, '').split('|')[0].trim();

            if (kataTerkait) {
                kataTerkait.innerHTML = `
                    <div class="k-related-item" style="color:#D97706">${cleanT} <span>(${isIndoToMad ? 'Madura' : 'Indonesia'})</span> <i class="fa-solid fa-check"></i></div>
                    <div class="k-related-item">${cleanM} <span>(${isIndoToMad ? 'Indonesia' : 'Madura'})</span></div>
                `;
            }
        };
        window.handleKamusInput = (event) => {
            if (event.key === 'Enter') {
                const query = event.target.value.trim().toLowerCase();
                if (!query) return;

                let history = JSON.parse(localStorage.getItem('jejak_ai_history')) || [];
                const now = new Date();
                const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

                const newItem = {
                    query: query,
                    time: timeString,
                    type: isIndoToMadura ? 'IND ➝ MAD' : 'MAD ➝ IND'
                };

                history.push(newItem);
                if (history.length > 30) history.shift();
                localStorage.setItem('jejak_ai_history', JSON.stringify(history));
                
                const panel = document.getElementById('historyPanel');
                if (panel && panel.classList.contains('show')) {
                    window.renderHistory();
                }

                const mainWord = document.getElementById('kamusMainWord');
                const artiWord = document.getElementById('kamusArtiWord');

                if (mainWord) mainWord.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="font-size:2.5rem; color:#D97706;"></i>';
                if (artiWord) artiWord.innerHTML = `Mencari ke database untuk "${query}" ...`;

                // AMBIL URL DARI ENV
                const API_URL = import.meta.env.VITE_API_URL;
                const langMode = isIndoToMadura ? 'ind2mad' : 'mad2ind';
                const apiUrl = `${API_URL}?action=search&q=${encodeURIComponent(query)}&lang=${langMode}&dialect=bangkalan`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(res => {
                        if(res.status === 'success' && res.data.length > 0) {
                            window.updateKamusUI(query, res.data, isIndoToMadura);
                        } else {
                            window.updateKamusUI(query, null, isIndoToMadura);
                        }
                    })
                    .catch(err => {
                        console.error("API Error:", err);
                        if (artiWord) artiWord.innerHTML = `<em>Gagal terhubung ke database MySQL. Pastikan server aktif.</em>`;
                        if (mainWord) mainWord.innerHTML = `Error DB`;
                    })
                    .finally(() => {
                        event.target.value = '';
                    });
            }
        };

        // ============================================
        // VIRTUAL TOUR & LAINNYA
        // ============================================
        window.openVTModal = (title, url) => {
            const overlay = document.getElementById('vtModalOverlay');
            const modalTitle = document.getElementById('vtModalTitle');
            const iframe = document.getElementById('vtIframe');
            if (overlay && modalTitle && iframe) {
                modalTitle.innerText = title;
                iframe.src = url;
                overlay.classList.add('show');
            }
        };

        window.closeVTModal = () => {
            const overlay = document.getElementById('vtModalOverlay');
            const iframe = document.getElementById('vtIframe');
            if (overlay) {
                overlay.classList.remove('show');
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                }
                setTimeout(() => { if (iframe) iframe.src = ''; }, 300);
            }
        };

        window.toggleFullscreenVT = () => {
            const modal = document.getElementById('vtModal');
            if (!modal) return;
            if (!document.fullscreenElement) {
                if (modal.requestFullscreen) modal.requestFullscreen();
                else if (modal.webkitRequestFullscreen) modal.webkitRequestFullscreen();
                else if (modal.msRequestFullscreen) modal.msRequestFullscreen();
                modal.classList.add('fullscreen');
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                modal.classList.remove('fullscreen');
            }
        };

        let readSections = JSON.parse(localStorage.getItem('jejak_materi_progress')) || [];
        const TOTAL_SECTIONS = 5;

        const updateProgressUI = () => {
            const current = readSections.length;
            const percentage = Math.round((current / TOTAL_SECTIONS) * 100);
            const progressBadge = document.getElementById('materi-progress');
            if (progressBadge) progressBadge.innerText = `${percentage}% Selesai`;

            readSections.forEach(id => {
                const section = document.getElementById(id);
                if (section) {
                    const btn = section.querySelector('.materi-btn-action');
                    if (btn && !btn.classList.contains('completed')) {
                        btn.classList.add('completed');
                        btn.innerHTML = '<i class="fa-solid fa-check-double me-2"></i> Materi Dikuasai';
                        btn.onclick = null;
                    }
                }
            });
        };

        window.markAsRead = (sectionId) => {
            if (typeof window.sfxBerhasil !== 'undefined') {
                window.sfxBerhasil.currentTime = 0;
                window.sfxBerhasil.play().catch(() => {});
            } else {
                const sfx = new Audio('/sound/berhasil.mp3');
                sfx.play().catch(() => {});
            }

            if (!readSections.includes(sectionId)) {
                readSections.push(sectionId);
                localStorage.setItem('jejak_materi_progress', JSON.stringify(readSections));
                updateProgressUI();
            }
        };

        let isSpeaking = false;
        window.speakText = (elementId) => {
            if (!('speechSynthesis' in window)) {
                alert("Browser Anda tidak mendukung fitur suara.");
                return;
            }
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                isSpeaking = false;
                return;
            }
            const textElement = document.getElementById(elementId);
            if (textElement) {
                // Ambil teks murni tanpa tag HTML/Badge di dalamnya
                let cleanText = textElement.textContent || textElement.innerText || "";
                cleanText = cleanText.replace(/Bangkalan/g, '').replace(/Peribahasa/g, '').trim();

                if (!cleanText || cleanText === "Pilih/Cari Kata") {
                    alert("Silakan cari kata terlebih dahulu di kolom pencarian!");
                    isSpeaking = false;
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.lang = 'id-ID'; // Menggunakan engine pelafalan standar browser
                utterance.rate = 0.85; // Kecepatan sedikit diperlambat agar pelafalan kata terdengar jelas dan natural
                
                utterance.onend = () => { isSpeaking = false; };
                utterance.onerror = () => { isSpeaking = false; };
                
                window.speechSynthesis.speak(utterance);
                isSpeaking = true;
            }
        };

        window.currentZoomValue = window.currentZoomValue || 1.05; 
        window.zoomText = (direction) => {
            const minZoom = 0.85; 
            const maxZoom = 1.65; 
            if (direction > 0 && window.currentZoomValue < maxZoom) {
                window.currentZoomValue = parseFloat((window.currentZoomValue + 0.1).toFixed(2));
            } else if (direction < 0 && window.currentZoomValue > minZoom) {
                window.currentZoomValue = parseFloat((window.currentZoomValue - 0.1).toFixed(2));
            }
            const textElements = document.querySelectorAll('.materi-scroll-box, .materi-scroll-box p, .sejarah-detail-text, .sejarah-detail-text p');
            textElements.forEach(el => {
                el.style.fontSize = `${window.currentZoomValue}rem`;
                el.style.transition = 'font-size 0.3s ease'; 
            });
        };

        window.toggleReadMode = () => {
            const viewer = document.getElementById('materiContent');
            if (viewer) viewer.classList.toggle('reading-mode');
        };

        window.copyText = (elementId) => {
            const textElement = document.getElementById(elementId);
            if (textElement) {
                navigator.clipboard.writeText(textElement.innerText).then(() => {
                    alert("Teks berhasil disalin ke Clipboard!");
                }).catch(() => { alert("Gagal menyalin teks."); });
            }
        };

        let bookmarks = JSON.parse(localStorage.getItem('jejak_materi_bookmarks')) || [];
        const initBookmarks = () => {
            bookmarks.forEach(id => {
                const block = document.getElementById(id);
                if (block) {
                    block.classList.add('bookmarked');
                    const btn = block.querySelector('.materi-action-icon-btn[title="Simpan/Bookmark"]');
                    if (btn) btn.classList.add('active-bookmark');
                }
            });
        };
        initBookmarks();

        window.toggleBookmark = (blockId) => {
            const block = document.getElementById(blockId);
            if (!block) return;
            const btn = block.querySelector('.materi-action-icon-btn[title="Simpan/Bookmark"]');
            if (bookmarks.includes(blockId)) {
                bookmarks = bookmarks.filter(id => id !== blockId);
                block.classList.remove('bookmarked');
                if (btn) btn.classList.remove('active-bookmark');
                alert("Bookmark dihapus.");
            } else {
                bookmarks.push(blockId);
                block.classList.add('bookmarked');
                if (btn) btn.classList.add('active-bookmark');
                alert("Materi berhasil di-Bookmark!");
            }
            localStorage.setItem('jejak_materi_bookmarks', JSON.stringify(bookmarks));
        };

        window.searchText = (event) => {
            const query = event.target.value.toLowerCase();
            const cards = document.querySelectorAll('.sejarah-card-item');
            cards.forEach(card => {
                const titleElement = card.querySelector('.sejarah-card-title');
                const locationElement = card.querySelector('.sejarah-card-location');
                if(titleElement && locationElement) {
                    const title = titleElement.innerText.toLowerCase();
                    const location = locationElement.innerText.toLowerCase();
                    if (title.includes(query) || location.includes(query)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        };

        const contentViewer = document.getElementById('materiContent');
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (contentViewer && scrollTopBtn) {
            contentViewer.addEventListener('scroll', () => {
                if (contentViewer.scrollTop > 150) scrollTopBtn.classList.add('show');
                else scrollTopBtn.classList.remove('show');
            });
        }

        window.scrollToTop = () => {
            if (contentViewer) contentViewer.scrollTo({ top: 0, behavior: 'smooth' });
        };

        updateProgressUI();

        // Cleanup function (penting agar window.functions tidak numpuk)
        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (window.stopReadingTimer) window.stopReadingTimer();

            delete window.startReadingTimer;
            delete window.stopReadingTimer;
            delete window.markAsRead;
            delete window.toggleSidebar;
            delete window.openVTModal;
            delete window.closeVTModal;
            delete window.toggleFullscreenVT;
            delete window.speakText;
            delete window.zoomText;
            delete window.toggleReadMode;
            delete window.copyText;
            delete window.toggleBookmark;
            delete window.searchText;
            delete window.scrollToTop;
            delete window.showSejarahDetail;
            delete window.backToSejarahMenu;
            delete window.showWarisanDetail;
            delete window.backToWarisanMenu;
            delete window.slideImage;
            delete window.currentSlide;
            delete window.filterWarisan;

            delete window.toggleKamusLang;
            delete window.handleKamusInput;
            delete window.toggleHistoryPanel;
            delete window.renderHistory;
            delete window.loadHistoryItem;
            delete window.updateKamusUI;
        };
    }, [navigate]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
            <div ref={containerRef} dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
        </>
    );
}
