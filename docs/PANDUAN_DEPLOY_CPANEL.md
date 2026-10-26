# Panduan Lengkap Deploy Jejak Bangkalan ke cPanel

Dokumen ini menjelaskan langkah-langkah praktis dan teruji untuk mendeploy aplikasi **Jejak Bangkalan Heritage** (React Vite + FastAPI RAG AI + SQLite) ke web hosting berbasis **cPanel**.

---

## 1. Arsitektur Deployment di cPanel

Arsitektur terbaik dan paling stabil untuk aplikasi ini di cPanel adalah memisahkan Frontend dan Backend menggunakan **Subdomain**:

```text
[ Pengguna / Browser ]
        │
        ├───> https://namadomain.com      ──> Frontend React (Static dist di public_html)
        │
        └───> https://api.namadomain.com  ──> Backend FastAPI + RAG AI (cPanel Setup Python App)
                                                   │
                                                   ├──> SQLite DB (database/jejak_bangkalan.db)
                                                   ├──> ChromaDB (chroma_db/)
                                                   └──> Google Gemini API
```

---

## 2. Prasyarat di cPanel

Pastikan akun hosting cPanel Anda memiliki:
1. **Fitur "Setup Python App"** (Didukung oleh CloudLinux / Phusion Passenger). Fitur ini tersedia di hampir seluruh penyedia shared hosting modern (Niagahoster, DomaiNesia, IDCloudHost, Dewaweb, Rumahweb, Hostinger cPanel, dll.).
2. **Versi Python**: 3.10 atau 3.11.
3. **SSL Gratis (AutoSSL / Let's Encrypt)** sudah aktif untuk domain utama dan subdomain.

---

## 3. Langkah Demi Langkah

### Langkah 1: Buat Subdomain untuk Backend API
1. Masuk ke **cPanel**.
2. Cari dan buka menu **Domains** atau **Subdomains**.
3. Buat subdomain baru:
   - **Subdomain**: `api` (sehingga menjadi `api.namadomain.com`).
   - **Document Root**: Biarkan default atau arahkan ke folder terpisah (misal `public_html/api` atau `api.namadomain.com`).

---

### Langkah 2: Konfigurasi dan Build Frontend (React)

Sebelum di-upload, sesuaikan alamat backend agar mengarah ke subdomain produksi:

1. Buat file `.env.production` di dalam folder `front-end/` di laptop/komputer Anda:
   ```env
   VITE_API_BASE_URL=https://api.namadomain.com
   VITE_RAG_API_URL=https://api.namadomain.com/chat
   ```
   *(Ganti `namadomain.com` dengan nama domain asli Anda)*

2. Jalankan perintah build di terminal lokal:
   ```bash
   cd front-end
   npm run build
   ```

3. Periksa folder `front-end/dist/`. Di dalamnya sudah terdapat:
   - `index.html`
   - Folder `assets/`, `img/`, `sound/`, `museum/`, `gallery/`, `logo/`, `icon/`
   - File `.htaccess` (sudah otomatis dikonfigurasi untuk mencegah error 404 saat halaman di-refresh).

4. Kompres seluruh **isi** di dalam folder `front-end/dist/` menjadi file ZIP (misal: `frontend_dist.zip`).

---

### Langkah 3: Upload Frontend ke cPanel

1. Di cPanel, buka **File Manager**.
2. Masuk ke direktori `public_html/`.
3. Unggah file `frontend_dist.zip`.
4. Ekstrak file zip tersebut langsung di dalam `public_html/`.
5. Pastikan file `index.html` dan `.htaccess` berada tepat di dalam `public_html/` (bukan di dalam subfolder `dist`).

---

### Langkah 4: Setup Backend Python FastAPI di cPanel

1. Di cPanel, cari dan buka menu **Setup Python App** (atau *Python Selector*).
2. Klik tombol **Create Application**:
   - **Python version**: Pilih **3.10** atau **3.11**.
   - **Application root**: Masukkan nama folder di direktori home Anda, misalnya `backend_api` (folder ini akan berada di `/home/username/backend_api`).
   - **Application URL**: Pilih subdomain yang sudah dibuat (`api.namadomain.com`).
   - **Application startup file**: Ketik `passenger_wsgi.py`.
   - **Application Entry point**: Ketik `application`.
3. Klik **Create**. cPanel akan membuat struktur dasar aplikasi dan virtual environment.

---

### Langkah 5: Upload File Backend

1. Buka **File Manager** cPanel, masuk ke folder aplikasi backend yang baru dibuat (misal: `/home/username/backend_api/`).
2. Unggah file & folder backend berikut dari proyek lokal Anda:
   - `app/` (seluruh folder)
   - `passenger_wsgi.py` (sudah disiapkan di folder `back-end/`)
   - `main.py`
   - `requirements.txt`
   - `chroma_db/` (folder vector store beserta isinya)
   - `database/` (folder database SQLite beserta `jejak_bangkalan.db`)
   - `.env` (buat file `.env` di folder ini)

3. Edit file `.env` di folder `backend_api` tersebut:
   ```env
   GEMINI_API_KEY=AIzaSy...masukkan_api_key_gemini_anda
   GEMINI_GENERATION_MODEL=gemini-3.5-flash-lite
   CHROMA_DB_DIR=./chroma_db
   SQLITE_DB_PATH=./database/jejak_bangkalan.db
   ```

---

### Langkah 6: Install Dependensi Python

Ada 2 cara untuk menginstal dependensi:

#### Cara A: Melalui Menu cPanel (Tanpa Terminal)
1. Buka kembali menu **Setup Python App** di cPanel.
2. Edit aplikasi Anda, cari bagian **Configuration files**.
3. Ketik `requirements.txt` lalu klik tombol **Add**.
4. Klik tombol **Run Pip Install** yang muncul di samping `requirements.txt`.
5. Tunggu hingga proses instalasi selesai.

#### Cara B: Melalui cPanel Terminal (Lebih Cepat & Jelas)
1. Buka menu **Terminal** di cPanel.
2. Salin perintah aktivasi virtual environment yang muncul di bagian atas halaman Python App Anda, contoh:
   ```bash
   source /home/username/virtualenv/backend_api/3.10/bin/activate
   ```
3. Masuk ke folder backend:
   ```bash
   cd /home/username/backend_api
   ```
4. Jalankan instalasi dependensi:
   ```bash
   pip install -r requirements.txt
   ```

---

### Langkah 7: Periksa Izin File (Permissions)

Di cPanel File Manager, pastikan izin file SQLite dapat dibaca dan ditulis oleh server web:
- Folder `/home/username/backend_api/database/` -> **755**
- File `database/jejak_bangkalan.db` -> **644** atau **664**
- Folder `/home/username/backend_api/chroma_db/` -> **755**
- File `chroma_db/chroma.sqlite3` -> **644** atau **664**

---

### Langkah 8: Restart dan Pengujian

1. Di menu **Setup Python App**, klik tombol **Restart**.
2. **Uji Backend API**:
   Buka browser Anda dan akses:
   - `https://api.namadomain.com/` -> Harus menampilkan status JSON:
     ```json
     {"status":"online","service":"Jejak Bangkalan Heritage Backend & RAG AI","version":"2.0.0"}
     ```
   - `https://api.namadomain.com/api/stats` -> Menampilkan statistik real-time situs.
3. **Uji Frontend**:
   Buka `https://namadomain.com/` di browser. Coba:
   - Navigasi ke `/warisan-budaya`, `/game`, `/virtual-tour`.
   - Coba lakukan **refresh (F5)** untuk memastikan routing `.htaccess` berjalan lancar tanpa 404.
   - Buka halaman **Asisten Cerdas**, kirim pertanyaan untuk memastikan integrasi AI RAG Gemini berhasil.

---

## 4. Troubleshooting Masalah Umum di cPanel

| Masalah | Penyebab | Solusi |
|---|---|---|
| **Error 404 saat refresh halaman frontend** | File `.htaccess` belum ter-upload atau tersembunyi | Pastikan centang opsi *Show Hidden Files (dotfiles)* di File Manager cPanel, dan pastikan file `.htaccess` ada di `public_html/`. |
| **500 Internal Server Error di Backend** | Modul belum terinstal atau path file salah | Periksa file `passenger_wsgi.py`. Pastikan sudah menjalankan `pip install -r requirements.txt`. Cek file `stderr.log` di root folder backend. |
| **Error ChromaDB: sqlite3 version < 3.35.0** | Versi bawaan SQLite di OS hosting lama | Tambahkan paket `pysqlite3-binary` (sudah dimasukkan di `requirements.txt`). Kode di `passenger_wsgi.py` otomatis mengganti modul sqlite bawaan. |
| **Mixed Content Error di Browser Console** | Frontend memanggil URL API dengan `http://` bukan `https://` | Pastikan `VITE_API_BASE_URL` dan `VITE_RAG_API_URL` menggunakan protokol `https://` dengan SSL aktif. |
| **Registrasi / Login Game Gagal (Database Locked)** | Permission folder/file SQLite hanya Read-only | Ubah permission folder `database/` menjadi `755` dan file `jejak_bangkalan.db` menjadi `664`. |
