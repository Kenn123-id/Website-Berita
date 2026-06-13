import { Article, Comment, LogEntry } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Transformasi AI di Indonesia: Peluang Emas atau Ancaman Lapangan Kerja?',
    excerpt: 'Kecerdasan Buatan (AI) kini merambah berbagai sektor industri di tanah air. Bagaimana pelaku usaha menyikapinya?',
    content: `Kecerdasan Buatan (Artificial Intelligence) terus berkembang pesat dan mulai diimplementasikan secara luas di berbagai industri di Indonesia, mulai dari layanan keuangan hingga manufaktur dan seni kreatif.\n\nMenurut laporan terbaru dari Asosiasi Digital Indonesia, lebih dari 65% perusahaan berskala menengah hingga besar di kota-kota besar telah mulai memanfaatkan otomasi berbasis kecerdasan buatan dalam kegiatan operasional mereka sehari-hari.\n\nPara pendukung teknologi ini menyatakan bahwa AI merupakan akselerator luar biasa untuk efisiensi waktu dan kreativitas manusia. Sebagai contoh, di bidang medis, algoritma pintar dapat mempercepat pembacaan hasil rontgen dengan tingkat akurasi hingga 95%.\n\nNamun, di balik optimisme ini, tersimpan kekhawatiran yang mendalam dari kalangan buruh dan tenaga kerja administratif. Dewan Tenaga Kerja Nasional memperkirakan sekitar 12% dari total profesi repetitif rentan terkena dampak substitusi mesin dalam waktu lima tahun ke depan.\n\nPemerintah didorong untuk menerapkan kebijakan penguatan keahlian (upskilling) serta kurikulum baru yang menekankan penguasaan literasi teknologi di bangku sekolah agar generasi muda siap menghadapi gelombang teknologi berikutnya.`,
    category: 'Teknologi',
    createdAt: '2026-06-10T10:30:00Z',
    author: 'Budi Santoso',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    views: 1240,
    likes: 88,
  },
  {
    id: 'art-2',
    title: 'KTT Ekonomi Hijau ASEAN 2026: Kesepakatan Pendanaan Transisi Energi Disahkan',
    excerpt: 'Para pemimpin negara Asia Tenggara berkumpul dan sepakat mengalokasikan triliunan rupiah untuk proyek net-zero emission.',
    content: `Konferensi Tingkat Tinggi (KTT) Ekonomi Hijau ASEAN yang diselenggarakan di Jakarta minggu ini resmi ditutup dengan penandatanganan Deklarasi Jakarta untuk Transisi Energi Terpadu.\n\nDalam deklarasi tersebut, negara-negara anggota berkomitmen meluncurkan dana fasilitas hijau bersama senilai total $12 Miliar USD yang akan didistribusikan untuk pembangunan megaproyek energi angin dan surya di wilayah pesisir.\n\n"Ini merupakan momentum bersejarah di mana kita berpindah dari sekadar retorika menuju aksi nyata pembiayaan terstruktur," ujar Menteri Keuangan Indonesia dalam pidatonya di hadapan pers.\n\nTantangan terbesar tetap berada pada pengurangan ketergantungan pembangkit listrik tenaga uap beraliran batu bara yang saat ini menyumbang porsi dominan pasokan listrik di Asia Tenggara. Transisi ini diharapkan membuka lebih dari 2 juta lapangan kerja hijau baru hingga tahun 2030.`,
    category: 'Ekonomi',
    createdAt: '2026-06-09T14:15:00Z',
    author: 'Siti Rahma',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    views: 890,
    likes: 45,
  },
  {
    id: 'art-3',
    title: 'Gaya Hidup Minimalis Generasi Z Indonesia: Memilih Kebebasan Dibanding Kepemilikan',
    excerpt: 'Mengapa menyewa barang, hunian komunal, dan investasi portofolio digital jauh lebih populer saat ini?',
    content: `Fenomena pergeseran nilai kepemilikan menjadi perhatian serius para sosiolog belakangan ini. Generasi muda, khususnya Gen Z di Indonesia, dilaporkan lebih memilih mengalokasikan dana mereka untuk pengalaman hidup dibanding kepemilikan aset fisik konvensional.\n\n"Buat apa punya mobil kalau macet dan cicilannya tinggi? Pakai transportasi umum atau sewa online jauh lebih praktis dan hemat," tutur Alif (22), mahasiswa tingkat akhir di Jakarta.\n\nTren ini juga memicu suburnya bisnis rental pakaian bermerek, skuter listrik, bahkan hunian berkonsep co-living. Alih-alih membeli rumah tapak yang harganya semakin tidak terjangkau, mereka memilih menyewa ruang estatis yang ringkas dengan fasilitas lengkap.\n\nNamun, perencana keuangan memperingatkan agar generasi ini tetap menyisihkan pendapatan untuk instrumen lindung nilai seperti reksa dana atau emas digital guna bekal masa tua kelak.`,
    category: 'Gaya Hidup',
    createdAt: '2026-06-08T09:00:00Z',
    author: 'Andi Wijaya',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800',
    views: 1532,
    likes: 210,
  },
  {
    id: 'art-4',
    title: 'Pilkada Serentak 2026: Edukasi Pemilih Muda Sangat Menentukan Arah Demokrasi',
    excerpt: 'Dengan 56% daftar pemilih tetap didominasi oleh pemilih muda, kampanye digital beralih ke platform media sosial interaktif.',
    content: `Menjelang pesta demokrasi pemilihan kepala daerah serentak akhir tahun ini, Komisi Pemilihan Umum (KPU) mengumumkan bahwa pemilih berkategori milenial dan Gen Z menyumbang persentase terbesar dalam sejarah pemilu Indonesia.\n\nHal ini mendorong tim sukses seluruh kandidat untuk memindahkan medan pertempuran kampanye ke ranah digital. Video edukatif pendek beserta infografis interaktif menjadi amunisi utama kandidat menarik simpati.\n\nPara analis politik menggarisbawahi pentingnya literasi politik digital agar para pemilih muda bebas dari belenggu hoaks, kampanye hitam, dan pengaruh manipulasi algoritma. Dialog kritis tatap muka di universitas tetap dipandang krusial guna menguji integritas asli visi misi paslon secara transparan.`,
    category: 'Politik',
    createdAt: '2026-06-07T11:45:00Z',
    author: 'Pratiwi Kusuma',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800',
    views: 1102,
    likes: 72,
  },
  {
    id: 'art-5',
    title: 'Kuliner Tradisional Indonesia Tembus Nominasi Bintang Michelin Dunia',
    excerpt: 'Tiga restoran legendaris di Bali dan Jakarta diakui atas konsistensinya menyajikan cita rasa autentik Nusantara.',
    content: `Sektor pariwisata kuliner Indonesia kembali menorehkan prestasi membanggakan di kancah internasional. Publikasi terbaru Michelin Guide memberikan apresiasi luar biasa pada kepiawaian chef lokal dalam mengawinkan teknik kuliner modern dengan bahan rempah orisinal.\n\n"Kami bangga bisa membawa bumbu rendang dan kuah soto dengan presentasi fine-dining berkelas tinggi," kata Chef Chandra, pemegang kemudi dapur salah satu restoran penerima penghargaan di Jakarta Selatan.\n\nKunjungan wisatawan mancanegara diperkirakan melonjak seiring maraknya ulasan kritikus makanan internasional yang penasaran dengan keberagaman rempah Indonesia seperti pala dari Banda dan cengkeh maluku yang diolah dengan estetika kontemporer.`,
    category: 'Gaya Hidup',
    createdAt: '2026-06-06T16:20:00Z',
    author: 'Chef Chandra',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    views: 2314,
    likes: 312,
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'com-1',
    articleId: 'art-1',
    userName: 'Rian_TechEnthusiast',
    content: 'Artikel yang informatif! AI memang mempercepat kerja, tapi kurikulum pendidikan kita memang harus segera menyesuaikan agar tidak tertinggal.',
    createdAt: '2026-06-10T11:00:00Z',
    likes: 12,
    isApproved: true,
  },
  {
    id: 'com-2',
    articleId: 'art-1',
    userName: 'IbuSumiarti',
    content: 'Sebagai pegawai administrasi, saya cukup cemas dengan perkembangan ini. Semoga pemerintah benar-benar memberi perlindungan kerja.',
    createdAt: '2026-06-10T12:30:00Z',
    likes: 8,
    isApproved: true,
  },
  {
    id: 'com-3',
    articleId: 'art-2',
    userName: 'GreenWarrior',
    content: 'Kabar luar biasa! Transisi energi terbarukan ini mendesak sekali demi warisan bumi anak cucu kita.',
    createdAt: '2026-06-09T15:00:00Z',
    likes: 15,
    isApproved: true,
  },
  {
    id: 'com-4',
    articleId: 'art-3',
    userName: 'Vian_Genz',
    content: 'Betul banget artikel ini. Saya pribadi pilih sewa motor/mobil daripada beli. Biaya perawatannya sekarang bikin pusing kepala haha.',
    createdAt: '2026-06-08T10:15:00Z',
    likes: 21,
    isApproved: true,
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-06-11T08:30:00Z',
    level: 'info',
    message: 'Layanan web Portal Berita berhasil dinyalakan pada port 3000.',
    source: 'Sistem Sistem',
  },
  {
    id: 'log-2',
    timestamp: '2026-06-11T08:35:00Z',
    level: 'info',
    message: 'Koneksi basis data lokal berhasil dibentuk, total artikel dimuat: 5.',
    source: 'Sistem SQL / StorageEngine',
  },
  {
    id: 'log-3',
    timestamp: '2026-06-11T08:36:12Z',
    level: 'info',
    message: 'Toleransi beban memori aman pada kapasitas 34.5MB.',
    source: 'Layanan Server',
  }
];
