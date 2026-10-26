# Jejak Bangkalan Heritage (React JSX + Node.js + FastAPI RAG AI)

Arsitektur Full-Stack Modern untuk platform pelestarian budaya **Jejak Bangkalan Heritage**. Seluruh tampilan visual, animasi, peta interaktif Leaflet, Virtual Tour 360, Game Edukasi (Peta Level, Kuis, Labirin 3D/Canvas, Petualangan Laut Sakera), dan Chatbot Asisten Cerdas RAG AI dipertahankan **100% identik** dengan peningkatan struktur kode yang rapi, modular, dan profesional.

---

## Susunan Struktur Folder (`jejak_bangkalan/`)

```text
jejak_bangkalan/
├── front-end/                          # FRONTEND (React 18 JSX + Vite + CSS Modular)
│   ├── public/
│   │   └── img/                        # Tempat seluruh aset gambar, logo, museum, sound, & data 360
│   ├── src/
│   │   ├── assets/styles/              # CSS Modular untuk masing-masing halaman
│   │   │   ├── beranda.css
│   │   │   ├── warisanBudaya.css
│   │   │   ├── virtualTour.css
│   │   │   ├── game.css
│   │   │   ├── labirin.css
│   │   │   ├── laut.css
│   │   │   ├── asistenCerdas.css
│   │   │   └── tentangKami.css
│   │   ├── components/
│   │   │   └── LoadingScreen.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # State Login/Register/Profil User
│   │   ├── data/
│   │   │   └── heritageData.js         # Data Koleksi Museum (30 item) & Warisan Budaya (29 item)
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/                      # Komponen Halaman React (JSX)
│   │   │   ├── BerandaPage.jsx         # Dari index.php
│   │   │   ├── WarisanBudayaPage.jsx   # Dari warisan_budaya.php
│   │   │   ├── VirtualTourPage.jsx     # Dari virtual_tour.php
│   │   │   ├── GamePage.jsx            # Dari game.php
│   │   │   ├── LabirinPage.jsx         # Dari labirin.php
│   │   │   ├── LautPage.jsx            # Dari laut.php
│   │   │   ├── AsistenCerdasPage.jsx   # Dari asisten_cerdas.php
│   │   │   └── TentangKamiPage.jsx     # Dari tentang_kami.php
│   │   ├── services/
│   │   │   ├── apiService.js           # Client API Auth & Statistik (dengan LocalStorage Fallback)
│   │   │   └── ragService.js           # Client API Chatbot RAG AI
│   │   ├── utils/
│   │   │   ├── authDomSync.js          # Pengganti koneksi.php di sisi client
│   │   │   ├── navigationHelper.js     # Router SPA tanpa reload halaman
│   │   │   └── *Controller.js          # Controller JS untuk tiap halaman
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── script.js
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── back-end/                           # BACKEND UTAMA (FastAPI + Node.js Express)
│   ├── app/
│   │   ├── ai/                         # Modul RAG AI terintegrasi
│   │   ├── Controllers/                # Logic Register & Login (Pengganti koneksi.php)
│   │   ├── core/                       # Konfigurasi & koneksi SQLite/MySQL
│   │   ├── routers/                    # Endpoint /api/auth/*, /api/stats, /api/heritage
│   │   └── schemas/                    # Validasi Pydantic
│   ├── migrations/
│   │   └── 001_init_jejak_bangkalan.sql
│   ├── node-server/                    # Alternatif Backend menggunakan Node.js + Express
│   │   ├── server.js
│   │   └── package.json
│   ├── .env.example
│   ├── main.py                         # Entrypoint Server FastAPI (Port 8000)
│   └── requirements.txt
│
├── rag-heritage/                       # STANDALONE SERVICE AI RAG (ChromaDB + Gemini)
│   ├── data/
│   │   └── knowledge_base.json         # Basis pengetahuan 59 dokumen sejarah & budaya Bangkalan
│   ├── tests/
│   │   └── pertanyaan_uji.json
│   ├── .env.example
│   ├── .gitignore
│   ├── api.py
│   ├── chat_terminal.py
│   ├── config.py
│   ├── indexing.py
│   ├── rag.py
│   └── requirements.txt
│
├── database/
│   ├── jejak_bangkalan.db              # Database SQLite siap pakai (terisi data awal)
│   └── init_db.py                      # Skrip inisialisasi tabel & data awal SQLite
├── docker-compose.yml
└── package.json
```

---

## Cara Menjalankan Proyek dengan Baik dan Benar

### Prasyarat Sistem:
- **Node.js**: v18+ atau v20+ (Termasuk `npm`)
- **Python**: v3.10+ (Termasuk `pip`)
- **Koneksi Internet** (Untuk koneksi Google Gemini API dan CDN library seperti Leaflet/Bootstrap)

---

### Langkah Cepat (Melalui Root Monorepo)

Jika seluruh dependensi sudah terpasang, Anda cukup membuka **2 terminal terpisah**:

#### Terminal 1 (Backend FastAPI + RAG AI - Port 8000):
```bash
npm run start:backend
```

#### Terminal 2 (Frontend React Vite - Port 5173):
```bash
npm run dev:frontend
```
Buka browser di **`http://localhost:5173`**.

---

### Langkah Manual Lengkap (Langkah demi Langkah)

#### 1. Inisialisasi Database SQLite
Database SQLite digunakan untuk autentikasi user, statistik situs, data warisan budaya, dan virtual tour. Jalankan skrip inisialisasi:
```bash
python database/init_db.py
```
*Database `database/jejak_bangkalan.db` akan langsung terisi dengan 3 user awal, 29 warisan budaya, 19 arsip museum, dan 4 titik virtual tour.*

#### 2. Konfigurasi Lingkungan (`.env`)
Pastikan file `back-end/.env` sudah memiliki `GEMINI_API_KEY` dan konfigurasi model:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_GENERATION_MODEL=gemini-3.5-flash-lite
CHROMA_DB_DIR=../chroma_db
HOST=0.0.0.0
PORT=8000
```
> **Catatan:** Database vektor ChromaDB di folder `chroma_db/` sudah berisi 87 dokumen budaya Bangkalan yang terindeks dan siap pakai tanpa perlu indexing ulang.

#### 3. Menjalankan Backend (Port 8000)
Buka terminal dan masuk ke folder `back-end`:
```bash
cd back-end
pip install -r requirements.txt
python main.py
```
Backend akan aktif di `http://localhost:8000` dan menyediakan endpoint:
- `GET /` — Health check status
- `POST /chat` — AI Asisten Cerdas RAG Gemini
- `GET /api/stats` — Statistik real-time
- `GET /api/heritage` & `GET /api/archives` — Katalog warisan & museum
- `POST /api/auth/register` & `POST /api/auth/login` — Autentikasi petualang

#### 4. Menjalankan Frontend React (Port 5173)
Buka terminal baru dan masuk ke folder `front-end`:
```bash
cd front-end
npm install
npm run dev
```
Buka `http://localhost:5173` di browser Anda.

---

### Opsi Alternatif: Backend Node.js (Express)
Jika ingin menggunakan server Node.js pengganti PHP (`koneksi.php`):
```bash
cd back-end/node-server
npm install
npm start
```
*Server Express akan berjalan di port 5000 dan mem-proxy request AI ke server Python port 8000.*

---

### Akun Uji Coba Default:
- **Username**: `admin` | **Password**: `admin123`
- **Username**: `petualang` | **Password**: `bangkalan123`
- **Username**: `nesyanq` | **Password**: `nesya123`
*(Anda juga bisa mendaftar akun baru langsung melalui modal Register di website)*

