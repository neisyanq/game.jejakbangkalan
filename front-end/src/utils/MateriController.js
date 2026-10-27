// src/utils/MateriController.js

export function initMateriPage(navigate) {
    // ========================================================
    // 1. SISTEM NAVIGASI TAB MATERI & SIDEBAR
    // ========================================================
    const tabs = document.querySelectorAll('.materi-tab');
    const sections = document.querySelectorAll('.materi-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            const sidebar = document.getElementById('materiSidebar');
            if (sidebar) sidebar.classList.remove('show');

            if (window.speechSynthesis) window.speechSynthesis.cancel();
            stopReadingTimer();

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

    const startReadingTimer = () => {
        stopReadingTimer();

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

    const stopReadingTimer = () => {
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
        startReadingTimer();
    };

    window.backToSejarahMenu = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        stopReadingTimer();

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
        startReadingTimer();
    };

    window.backToWarisanMenu = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        stopReadingTimer();

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

        if (btnElement) btnElement.classList.add('active');

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

    // ========================================================
    // LOGIC KAMUS BAHASA MADURA (TERHUBUNG KE MYSQL MELALUI API)
    // ========================================================
    let isIndoToMadura = true;

    // Menarik Statistik Jumlah Kata di Database
    // Menarik Statistik Jumlah Kata di Database
    const fetchKamusStats = async() => {
        try {
            // AMBIL URL DARI ENV
            const API_URL =
                import.meta.env.VITE_API_URL;
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

    // Panggil stats awal saat komponen diload
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
            window.toggleHistoryPanel();
            const event = new KeyboardEvent('keyup', { key: 'Enter' });
            input.dispatchEvent(event);
        }
    };

    window.updateKamusUI = (query, result, isIndoToMad) => {
        const mainWord = document.getElementById('kamusMainWord');
        const artiWord = document.getElementById('kamusArtiWord');
        const pronounce = document.getElementById('kamusPronounce');
        const kataTerkait = document.getElementById('kataTerkaitList');

        if (!query && !result) {
            if (mainWord) mainWord.innerHTML = "Pilih/Cari Kata";
            if (artiWord) artiWord.innerHTML = "Silakan gunakan kolom pencarian di atas untuk mencari terjemahan kata.";
            if (pronounce) pronounce.innerHTML = "/pencarian/";
            return;
        }

        if (!result) {
            if (mainWord) mainWord.innerHTML = query.toLowerCase();
            if (artiWord) artiWord.innerHTML = `<em>Kata tidak ditemukan dalam database MySQL.</em>`;
            if (pronounce) pronounce.innerHTML = `/- /`;
            if (kataTerkait) kataTerkait.innerHTML = `<div class="k-related-item">Tidak ada hasil pencarian. <span>( - )</span></div>`;
            return;
        }

        const terjemahan = isIndoToMad ? result.madura : result.indo;
        const makna = isIndoToMad ? result.indo : result.madura;
        const tipeKata = result.tipe ? result.tipe : "Kata Umum";
        const pelafalan = result.pelafalan ? result.pelafalan : terjemahan.toLowerCase().replace(/\s+/g, '.');

        if (mainWord) mainWord.innerHTML = terjemahan.toLowerCase();
        if (artiWord) artiWord.innerHTML = `(${isIndoToMad ? 'Indo' : 'Madura'}) ${makna}`;
        if (pronounce) pronounce.innerHTML = `/${pelafalan}/`;

        const badgeTipe = document.getElementById('kamusTipe');
        if (badgeTipe) badgeTipe.innerText = tipeKata;

        document.getElementById('kamusContohMadura').innerHTML = isIndoToMad ? `"${terjemahan}..."` : `"${makna}..."`;
        document.getElementById('kamusContohIndo').innerHTML = isIndoToMad ? `(${makna}...)` : `(${terjemahan}...)`;

        if (kataTerkait) {
            kataTerkait.innerHTML = `
                <div class="k-related-item" style="color:#D97706">${terjemahan} <span>(${isIndoToMad ? 'Madura' : 'Indonesia'})</span> <i class="fa-solid fa-check"></i></div>
                <div class="k-related-item">${makna} <span>(${isIndoToMad ? 'Indonesia' : 'Madura'})</span></div>
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
            if (panel && !panel.classList.contains('show')) {
                panel.classList.add('show');
            }
            window.renderHistory();

            const mainWord = document.getElementById('kamusMainWord');
            const artiWord = document.getElementById('kamusArtiWord');

            if (mainWord) mainWord.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="font-size:2.5rem; color:#D97706;"></i>';
            if (artiWord) artiWord.innerHTML = `Mencari ke database untuk "${query}" ...`;

            // Hit API MENGGUNAKAN ENV
            const API_URL =
                import.meta.env.VITE_API_URL;
            const langMode = isIndoToMadura ? 'ind2mad' : 'mad2ind';
            const apiUrl = `${API_URL}?action=search&q=${encodeURIComponent(query)}&lang=${langMode}&dialect=bangkalan`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(res => {
                    if (res.status === 'success' && res.data.length > 0) {
                        const found = res.data[0];
                        window.updateKamusUI(query, found, isIndoToMadura);
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

    // ========================================================
    // FUNGSI UMUM LAINNYA
    // ========================================================
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
            const textToSpeak = textElement.innerText;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            utterance.onend = () => { isSpeaking = false; };
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
            const textToCopy = textElement.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert("Teks berhasil disalin ke Clipboard!");
            }).catch(() => {
                alert("Gagal menyalin teks.");
            });
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

            if (titleElement && locationElement) {
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

    return () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        stopReadingTimer();

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
}
