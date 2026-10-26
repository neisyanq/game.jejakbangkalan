import os
import sqlite3
import hashlib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "jejak_bangkalan.db"

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode("utf-8")).hexdigest()

def init_database():
    print(f"=== Menyiapkan Database SQLite di: {DB_PATH} ===")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # 1. Tabel users
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_lengkap TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar TEXT DEFAULT 'avatar1.png',
        jenis_kelamin TEXT DEFAULT 'Laki-laki',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Tabel heritage_sites
    cur.execute("""
    CREATE TABLE IF NOT EXISTS heritage_sites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        cat_label TEXT NOT NULL,
        location TEXT NOT NULL,
        image TEXT,
        description TEXT
    );
    """)

    # 3. Tabel archives
    cur.execute("""
    CREATE TABLE IF NOT EXISTS archives (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        kategori TEXT NOT NULL,
        gambar TEXT,
        keterangan TEXT
    );
    """)

    # 4. Tabel virtual_tours
    cur.execute("""
    CREATE TABLE IF NOT EXISTS virtual_tours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        lokasi TEXT NOT NULL,
        folder_path TEXT NOT NULL
    );
    """)

    # --- SEED DATA USERS ---
    users_data = [
        ("Nesya", "nesyanq", "nesya271205@gmail.com", hash_pw("nesya123"), "avatar2.png", "Perempuan"),
        ("Petualang Bangkalan", "petualang", "petualang@jejakbangkalan.id", hash_pw("bangkalan123"), "avatar1.png", "Laki-laki"),
        ("Administrator", "admin", "admin@jejakbangkalan.id", hash_pw("admin123"), "avatar1.png", "Laki-laki")
    ]
    for u in users_data:
        cur.execute("""
            INSERT OR IGNORE INTO users (nama_lengkap, username, email, password, avatar, jenis_kelamin)
            VALUES (?, ?, ?, ?, ?, ?)
        """, u)

    # --- SEED DATA VIRTUAL TOURS ---
    vt_data = [
        ("Museum Cakraningrat", "Pusat Kota Bangkalan", "data/museum cakraningrat/index.htm"),
        ("Makam Syaikhona Kholil", "Martajasah, Bangkalan", "data/syaikhona kholil/index.htm"),
        ("Mercusuar Sembilangan", "Socah, Bangkalan", "data/mercusuar/index.htm"),
        ("Masjid Agung Bangkalan", "Pusat Kota Bangkalan", "data/masjid agung/index.htm")
    ]
    cur.execute("DELETE FROM virtual_tours")
    for vt in vt_data:
        cur.execute("INSERT INTO virtual_tours (nama, lokasi, folder_path) VALUES (?, ?, ?)", vt)

    # --- SEED DATA HERITAGE SITES (29 Warisan Budaya) ---
    heritage_sites_data = [
        ("Makam Aer Mata Ibu", "situs", "Situs Sejarah", "Arosbaya", "/img/situs/aer mata.jpg", "Kompleks pemakaman para bangsawan dan raja-raja Bangkalan trah Cakraningrat."),
        ("Makam Syaikhona Kholil", "situs", "Situs Sejarah", "Martajasah", "/img/situs/syaikhona kholil.jpg", "Makam ulama kharismatik yang menjadi guru bagi banyak pendiri organisasi Islam di Nusantara."),
        ("Benteng Erfprins", "situs", "Situs Sejarah", "Bangkalan", "/img/situs/erfprins.jpg", "Sisa-sisa benteng pertahanan era kolonial Belanda di tepian pesisir Bangkalan."),
        ("Mercusuar Sembilangan", "situs", "Situs Sejarah", "Socah", "/img/situs/mercusuar sembilangan.jpg", "Mercusuar tua peninggalan era Hindia Belanda yang dibangun pada akhir abad ke-19."),
        ("Masjid Agung Bangkalan", "situs", "Situs Sejarah", "Bangkalan", "/img/situs/masjid agung.jpg", "Masjid tertua dan terbesar di pusat kabupaten Bangkalan dengan arsitektur perpaduan budaya."),
        ("Situs Kokop", "situs", "Situs Sejarah", "Kokop", "/img/situs/situs kokop.jpg", "Peninggalan sejarah dan arkeologi purbakala di wilayah utara Bangkalan."),
        ("Roto", "tradisi", "Tradisi & Ritual", "Bangkalan", "/img/tradisi/roto.jpg", "Tradisi upacara adat dan ritual doa keselamatan masyarakat pesisir."),
        ("Gumbhruk", "tradisi", "Tradisi & Ritual", "Bangkalan", "/img/tradisi/gumbhruk.jpg", "Kesenian tutur dan ritual berbasis tabuhan sakral khas Madura barat."),
        ("Nyadar", "tradisi", "Tradisi & Ritual", "Bangkalan", "/img/tradisi/nyadar.jpg", "Tradisi ziarah leluhur pembuat garam dan pesta syukuran tahunan."),
        ("Roat Dhisa", "tradisi", "Tradisi & Ritual", "Bangkalan", "/img/tradisi/roat dhisa.jpg", "Upacara ruwatan desa sebagai wujud syukur atas hasil bumi dan perlindungan dari marabahaya."),
        ("Tajin Sorah", "tradisi", "Tradisi & Ritual", "Bangkalan", "/img/tradisi/tajin sorah.jpg", "Tradisi memasak dan membagikan bubur suro khas bulan Muharram."),
        ("Batik Gentongan", "seni", "Seni & Kerajinan", "Tanjungbumi", "/img/seni/batik gentongan.jpg", "Karya seni batik tulis legendaris dengan teknik pewarnaan alami di dalam gentong tanah liat."),
        ("Karapan Sapi", "seni", "Seni & Kerajinan", "Bangkalan", "/img/seni/karapan sapi.jpg", "Perlombaan pacuan sepasang sapi jantan khas Madura yang penuh prestise dan semarak."),
        ("Sapi Sonok", "seni", "Seni & Kerajinan", "Bangkalan", "/img/seni/sapi sonok.jpg", "Kontes kecantikan dan keserasian langkah sepasang sapi betina yang dihias anggun."),
        ("Tari Muang Sangkal", "seni", "Seni & Kerajinan", "Bangkalan", "/img/seni/tari muang sangkal.jpg", "Tarian penyambutan sakral untuk membuang kesialan atau mara bahaya bagi para tamu kehormatan."),
        ("Topeng Ghettak", "seni", "Seni & Kerajinan", "Bangkalan", "/img/seni/topeng ghettak.jpg", "Tari topeng tradisional Madura dengan ekspresi tegas dan gerakan hentakan kaki yang ritmis."),
        ("Pecut Samandiman", "seni", "Seni & Kerajinan", "Bangkalan", "/img/seni/pecut samandiman.jpg", "Pusaka cambuk legendaris simbol keberanian dan kepemimpinan jawara Madura."),
        ("Odheng Madura", "seni", "Seni & Kerajinan", "Bangkalan", "/img/seni/odheng madura.jpg", "Penutup kepala tradisional pria khas Madura dengan lipatan simpul sarat makna filosofis."),
        ("Clurit Madura", "seni", "Seni & Kerajinan", "Bangkalan", "/img/seni/clurit madura.jpg", "Senjata tradisional bilah lengkung khas Madura yang kaya akan nilai historis dan tempaan logam."),
        ("Perahu Sandeq Khas", "seni", "Seni & Kerajinan", "Bangkalan", "/img/seni/perahu sandeq.jpg", "Seni pembuatan kapal kayu tradisional para nelayan tangguh Madura."),
        ("Nasi Serpang", "kuliner", "Kuliner", "Bangkalan", "/img/kuliner/nasi serpang.jpg", "Makanan tradisional khas Kabupaten Bangkalan yang memadukan lauk laut dan olahan daging."),
        ("Topak Ladeh", "kuliner", "Kuliner", "Bangkalan", "/img/kuliner/topak lodeh.jpg", "Hidangan khas Bangkalan yang identik dengan perayaan Lebaran Ketupat."),
        ("Tajin Sobih", "kuliner", "Kuliner", "Desa Sobih", "/img/kuliner/tajin sobih.jpg", "Jajanan tradisional berupa campuran aneka bubur manis yang berasal dari Desa Sobih."),
        ("Sewel", "kuliner", "Kuliner", "Kecamatan Socah", "/img/kuliner/sewel socah.jpg", "Jajanan gurih khas wilayah Socah yang terbuat dari tepung tapioka dengan campuran udang."),
        ("Bebek Sinjay", "kuliner", "Kuliner", "Bangkalan", "/img/kuliner/bebek sinjay.jpg", "Kuliner populer dari Bangkalan yang sangat terkenal dengan sajian bebek goreng rempah gurih."),
        ("Soto Tongkol", "kuliner", "Kuliner", "Bangkalan", "/img/kuliner/soto tongkol.jpg", "Hidangan soto unik yang memanfaatkan ikan tongkol sebagai bahan utamanya."),
        ("Soto Mata Sapi", "kuliner", "Kuliner", "Kecamatan Burneh", "/img/kuliner/soto mata.jpg", "Kuliner unik khas wilayah Burneh yang menggunakan bagian mata sapi yang direbus lunak."),
        ("Bongko Arosbaya", "kuliner", "Kuliner", "Arosbaya", "/img/kuliner/bongko arosbaya.jpg", "Kuliner jajanan tradisional yang sangat khas dan terkait erat dengan sejarah di wilayah Arosbaya."),
        ("Ledre Sepuluh", "kuliner", "Kuliner", "Bangkalan", "/img/kuliner/ledre sepuluh.jpg", "Ragam jajanan tradisional khas Bangkalan yang merupakan bagian penting dari khazanah kuliner.")
    ]
    cur.execute("DELETE FROM heritage_sites")
    for s in heritage_sites_data:
        cur.execute("""
            INSERT INTO heritage_sites (title, category, cat_label, location, image, description)
            VALUES (?, ?, ?, ?, ?, ?)
        """, s)

    # --- SEED DATA ARCHIVES (Koleksi Museum Cakraningrat) ---
    archives_data = [
        ("Keramik Kuno", "Koleksi Arkeologi", "src/assets/images/museum_cakraningrat/koleksi1/keramik1.jpg", "Koleksi piring, mangkok, dan guci keramik kuno dari Eropa, Cina, India, dan Khmer."),
        ("Pekinangan", "Koleksi Etnografi", "src/assets/images/museum_cakraningrat/koleksi1/pekinangan2.jpg", "Seperangkat wadah kuningan untuk menyimpan perlengkapan mengunyah sirih pinang di lingkungan keraton."),
        ("Tenong dan Lesung", "Koleksi Etnografi", "src/assets/images/museum_cakraningrat/koleksi1/tenong dan lesung3.jpg", "Tenong anyaman bambu untuk membawa makanan adat dan lesung batu/kayu penumbuk padi tradisional."),
        ("Kursi Keraton", "Koleksi Sejarah", "src/assets/images/museum_cakraningrat/koleksi1/kursi keraton4.jpg", "Kursi kayu ukir tempat duduk penguasa Bangkalan dan kursi unik ahli nujum kerajaan."),
        ("Batik Kuno Madura", "Koleksi Seni", "src/assets/images/museum_cakraningrat/koleksi1/batik5.jpg", "Kain batik kuno dengan motif flora fauna khas Bangkalan berpewarna alami."),
        ("Peralatan Membatik", "Koleksi Teknologi", "src/assets/images/museum_cakraningrat/koleksi1/peralatan membatik6.jpg", "Anglo, kuali, canting tembaga, dan wajan kuno yang digunakan para pembatik masa lalu."),
        ("Ukiran Kayu Bangkalan", "Koleksi Seni", "src/assets/images/museum_cakraningrat/koleksi1/ukiran kayu7.jpg", "Hiasan ukiran kayu tiga dimensi dengan motif ornamen keraton Madura."),
        ("Penggilingan Jamu Kuno", "Koleksi Farmasi Tradisional", "src/assets/images/museum_cakraningrat/koleksi1/penggilingan jamu8.jpg", "Batu pipisan dan gandik untuk menghaluskan ramuan herbal madura."),
        ("Kendi Tanah Liat", "Koleksi Keramik Tradisional", "src/assets/images/museum_cakraningrat/koleksi1/kendi9.jpg", "Wadah air minum khas dari tanah liat berpendingin alami."),
        ("Kemokon", "Koleksi Etnografi", "src/assets/images/museum_cakraningrat/koleksi1/kemokon10.jpg", "Wadah perhiasan dan ramuan wewangian milik putri bangsawan Bangkalan."),
        ("Kaca Rias Keraton", "Koleksi Sejarah", "src/assets/images/museum_cakraningrat/koleksi1/kaca rias11.jpg", "Cermin rias kayu berukir harum dengan laci kosmetik bangsawan wanita."),
        ("Gamelan Se Senen / Car Balih", "Koleksi Musik Tradisional", "src/assets/images/museum_cakraningrat/koleksi2/Tabhuwen Se Senen Car Balih1.jpg", "Alat musik isyarat pejabat keraton berkumpul pada masa Panembahan Cakraningrat VIII (1870 M)."),
        ("Tabhuwan Lajing", "Koleksi Musik Tradisional", "src/assets/images/museum_cakraningrat/koleksi2/Tabhuwan Lajing2.jpg", "Gamelan era Sultan Abdul Kadirun / Cakra Adiningrat II (1815-1845) untuk pagelaran seni keraton."),
        ("Tabhuwan Ratna Dumilah", "Koleksi Musik Tradisional", "src/assets/images/museum_cakraningrat/koleksi2/Tabhuwan Ratna Dumilah3.jpg", "Gamelan era Adipati Cakraningrat VII (1849 M)."),
        ("Lonceng Kandjen Poeja", "Koleksi Sejarah", "src/assets/images/museum_cakraningrat/koleksi2/Lonceng4.jpg", "Lonceng perunggu besar tahun 1870 untuk memanggil prajurit keraton."),
        ("Rebab Keraton", "Koleksi Musik Tradisional", "src/assets/images/museum_cakraningrat/koleksi2/Rebab5.jpg", "Instrumen gesek berdawai dua pengiring tembang madura keraton."),
        ("Thuk-Thuk Pengiring Karapan", "Koleksi Seni", "src/assets/images/museum_cakraningrat/koleksi2/Thuk-Thuk6.jpg", "Kentongan kayu utuh berlubang pengiring atraksi karapan sapi."),
        ("Kendang Gamelan", "Koleksi Musik Tradisional", "src/assets/images/museum_cakraningrat/koleksi2/Kendang7.jpg", "Kendang pengatur tempo irama gamelan dan penuntun tari keraton."),
        ("Bedhung Masjid Keraton", "Koleksi Religi", "src/assets/images/museum_cakraningrat/koleksi2/Bedhung8.jpg", "Bedug penanda waktu salat dan perayaan keagamaan masyarakat Bangkalan.")
    ]
    cur.execute("DELETE FROM archives")
    for a in archives_data:
        cur.execute("INSERT INTO archives (nama, kategori, gambar, keterangan) VALUES (?, ?, ?, ?)", a)

    conn.commit()
    
    # Verifikasi jumlah
    u_c = cur.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    h_c = cur.execute("SELECT COUNT(*) FROM heritage_sites").fetchone()[0]
    a_c = cur.execute("SELECT COUNT(*) FROM archives").fetchone()[0]
    v_c = cur.execute("SELECT COUNT(*) FROM virtual_tours").fetchone()[0]
    conn.close()

    print("=== Database SQLite Berhasil Diinisialisasi! ===")
    print(f"Users: {u_c} | Heritage Sites: {h_c} | Archives: {a_c} | Virtual Tours: {v_c}")

if __name__ == "__main__":
    init_database()
