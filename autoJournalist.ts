import { Article } from '../types';

const AUTHORS = [
  'Wartawan AI - Joko Geller',
  'Kantor Berita AI - Sinta Dewi',
  'Jurnalis Robot - Budi Santoso',
  'AI Editorial - Lestari Putri',
  'Koresponden AI - Fahri Ramadhan',
  'Robot Pers - Maya Indah'
];

const IMAGES: Record<string, string[]> = {
  Teknologi: [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', // cyber
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800', // tech code
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', // microchip
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800', // modern tech
  ],
  Ekonomi: [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800', // stock graph
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800', // binary trading
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800', // economic chart
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800', // money stacks
  ],
  'Gaya Hidup': [
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800', // fashion shoe
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800', // lifestyle concert
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800', // healthy food
    'https://images.unsplash.com/photo-1469033090074-7539c0dc590e?auto=format&fit=crop&q=80&w=800', // cafe lifestyle
  ],
  Politik: [
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800', // political voting
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', // globe tech
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800', // assembly
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800', // formal discussion
  ]
};

interface NewsTemplate {
  title: string;
  excerpt: string;
  content: string;
}

const TEMPLATES: Record<string, NewsTemplate[]> = {
  Teknologi: [
    {
      title: 'Kecerdasan Buatan (AI) Melokalisasi Bahasa Daerah di Seluruh Nusantara',
      excerpt: 'Teknologi model bahasa besar (LLM) kini mampu menerjemahkan ratusan dialek asli Indonesia secara real-time dengan akurasi yang mengagumkan.',
      content: 'Penerapan kecerdasan buatan kini tidak lagi terbatas pada bahasa-bahasa internasional utama. Sebuah konsorsium riset teknologi komunikasi nasional berhasil merancang model bahasa modular berukuran cerdas yang memahami leksikon bahasa daerah lokal mulai dari Sunda Halus, Jawa Krama, hingga ragam dialek di ujung timur Papua. Dukungan teknologi ini ditargetkan langsung untuk sektor pelayanan kesehatan desa dan penyuluhan pertanian, agar masyarakat pedalaman dapat mengakses anjuran kritis tanpa terkendala batasan bahasa formal nasional.'
    },
    {
      title: 'Satelit Keamanan Nusantara RI-3 Siap Mengorbit di Khatulistiwa',
      excerpt: 'Langkah besar kedaulatan digital Indonesia melalui peluncuran satelit orbit rendah baru dengan integrasi sensor optik kebencanaan tercanggih.',
      content: 'Lembaga Penerbangan Sipil bersama Badan Sandi Negara menjadwalkan peluncuran konstelasi satelit komunikasi rendah berpemancar radar mikro pekan depan. Satelit RI-3 dirancang dengan sistem sensor optik pasif yang mampu menangkap perubahan termal lempeng bumi di cincin api khatulistiwa sebelum terjadi bencana alam seismik. Selain berfungsi sebagai penguat sinyal telekomunikasi pedesaan, satelit ini adalah benteng pertahanan deteksi dini kebencanaan mandiri milik Indonesia.'
    },
    {
      title: 'Uji Coba Perdana Jaringan Internet Quantum WiFi Mulai Diterapkan',
      excerpt: 'Ujicoba quantum di pusat teknologi digital Bandung mencatatkan rekor kecepatan transmisi data nirkabel terenkripsi sempurna.',
      content: 'Keamanan data di masa depan menginjak era baru yang mutlak. Jaringan nirkabel nirkunci digital berbasis kriptografi kuantum diuji coba secara masif di kota Bandung. Menggunakan manipulasi pembiasan foton cahaya, teknologi internet ini tidak hanya menjanjikan kecepatan transfer hingga 500 Gbps, melainkan juga kekebalan mutlak dari penyadapan siber karena partikel komunikasi akan otomatis rusak berkeping-keping apabila disentuh oleh pihak luar tanpa otorisasi.'
    },
    {
      title: 'Sistem Robot Tani "Saka Tani" Resmi Raih Apresiasi Inovasi Asia',
      excerpt: 'Robot pembersih hama bertenaga surya buatan mahasiswa Malang sukses meningkatkan efektivitas panen raya hingga 40 persen.',
      content: 'Gairah pemuda bertalenta berhasil merevolusi cara kerja sektor agraris konvensional. Robot otonom bertenaga fotovoltaik surya bernama "Saka Tani" resmi merebut posisi emas dalam ajang inovasi penemuan se-Asia. Dengan bekal vision AI, robot ini menyusuri sela-sela pematang sawah secara mandiri, mengidentifikasi ulat grayak serta hama wereng secara mekanis tanpa bahan kimia, sekaligus memberikan pupuk titik-presisi langsung ke pangkal tanaman padi.'
    }
  ],
  Ekonomi: [
    {
      title: 'Rupiah Menguat Tajam Imbas Pengumuman Stabilisasi Suku Bunga Domestik',
      excerpt: 'Langkah taktis moneter menghasilkan sentimen positif luar biasa di lantai bursa seiring masuknya modal asing dalam volume besar.',
      content: 'Kombinasi regulasi moneter yang tangguh dengan kenaikan surplus ekspor sumber daya alam terbarukan mendorong mata uang Rupiah menggilas dominasi indeks mata uang asing pada penutupan pekan ini. Investor institusional menyambut optimis komitmen bank sentral dalam menjaga tingkat suku bunga stabil yang beriringan dengan penyederhanaan izin usaha hilirisasi sumber daya bumi, mengindikasikan pasar keuangan domestik terus kokoh dan menarik.'
    },
    {
      title: 'Hilirisasi Energi Hijau Indonesia Menandatangani Kontrak Ekspor Perdana',
      excerpt: 'Sebanyak tiga puluh ribu ton biodiesel berbasis kelapa sawit olahan modern siap diberangkatkan ke negara sekutu Uni Eropa.',
      content: 'Kemandirian energi berkelanjutan bukan lagi angan melingkar di atas kertas. Pelabuhan Tanjung Priok hari ini menyaksikan pelepasan tangki ekspor perdana bahan bakar ramah lingkungan hasil hilirisasi minyak nabati mentah yang dikelola pabrik domestik secara total. Langkah ekspor jangka panjang ini tidak hanya mendatangkan devisa dalam skala triliunan, melainkan menegaskan kepemimpinan Indonesia di kancah bahan bakar nabati dunia.'
    },
    {
      title: 'Aplikasi UMKM Go-Global Meluncur, Targetkan Distribusi Logistik 1 Juta Toko',
      excerpt: 'Platform logistik terpadu yang memangkas jalur distribusi ke luar negeri ini resmi disubsidi pemerintah guna mendorong pertumbuhan ekspor mikro.',
      content: 'Konektivitas pedagang kecil dengan pasar internasional kini diwadahi oleh sistem logistik terpadu "UMKM Go-Global". Platform cerdas ini otomatis menyinkronkan dokumen bea cukai, sertifikasi halal, dan pengiriman kargo dalam satu dasbor terpadu. Pemerintah memberikan keringanan tarif pajak pengiriman hingga 50 persen dengan harapan produk kerajinan tangan dan kopi specialty nusantara dapat menjamur di kafe-kafe perkotaan benua Eropa dan Amerika.'
    }
  ],
  'Gaya Hidup': [
    {
      title: 'Tren Wisata Ramah Lingkungan "Slow Travel" Mulai Menggeliat di Bali dan Lombok',
      excerpt: 'Ratusan pelancong milenial mulai meninggalkan model pariwisata cepat dan beralih menghayati kearifan lokal pedesaan secara berkelanjutan.',
      content: 'Dunia pariwisata perlahan bergeser dari sekadar berburu foto estetik menuju pencarian ketenangan jiwa sejati. Konsep "Slow Travel" atau perjalanan lambat kian digandrungi, di mana para wisatawan menetap berminggu-minggu di desa adat, mempelajari cara bertani, memasak masakan tradisional menggunakan tungku kayu, hingga berkontribusi langsung pada edukasi anak-anak setempat. Model ini terbukti melestarikan budaya lokal dan mengalirkan ekonomi langsung ke saku warga asli.'
    },
    {
      title: 'Fenomena Kedai Kopi "Anti-Flicker" Ramai Dipadati Eksekutif Muda Kota Besar',
      excerpt: 'Sebuah gerakan sosial meluncur lewat kedai kopi yang melarang penggunaan perangkat elektronik pintar saat jam sore guna interaksi sosial alami.',
      content: 'Kebisingan notifikasi ponsel membuat masyarakat modern mulai jenuh dengan koneksi digital tanpa henti. Di Jakarta, jejaring kedai kopi bernuansa retro merintis kebijakan unik de-digitalisasi sore hari. Pada jam 16.00 hingga 19.00, seluruh stopkontak listrik dimatikan dan akses Wi-Fi diputus total. Pengunjung didorong untuk mengobrol tatap muka bebas gawai, membaca buku fisik, atau bermain catur kayu, memicu lahirnya komunitas sosial baru yang hangat.'
    },
    {
      title: 'Pakaian Ramah Lingkungan Berbahan Serat Nanas Menjadi Primadona Desainer Nasional',
      excerpt: 'Eksplorasi serat alam lokal sisa perkebunan bertransformasi menjadi kain mewah dengan nilai estetik luar biasa di panggung peragaan busana.',
      content: 'Lapis industri fesyen kian melangkah menuju sirkularitas berkesinambungan. Dalam gelaran mode tahunan nasional, gaun-gaun megah berpola asimetris yang memikau penonton rupanya dirajut dari serat daun nanas sirsak yang biasanya dibuang begitu saja oleh petani. Karakter serat nanas yang kuat, berkilau alami seperti sutra, dan mudah menyerap pewarna herbal menjadi masa depan tekstil hijau dunia yang ramah bumi.'
    }
  ],
  Politik: [
    {
      title: 'Reformasi Birokrasi Berbasis AI: Layanan Dokumen Kependudukan Beres dalam 5 Menit',
      excerpt: 'Uji coba sistem pelayanan administrasi tanpa berkas fisik berhasil diterapkan di sepuluh kabupaten daerah pilot.',
      content: 'Kementerian PAN-RB meluncurkan terobosan radikal penyeragaman layanan kependudukan berbasis tanda tangan elektronik terverifikasi dan pemrosesan dokumen otomatis oleh asisten robotik birokrat. Warga kini tidak perlu lagi meminta antrean nomor sub-seksi atau membawa salinan berkas fotokopi berlembar-lembar. Kebijakan ini diharapkan mampu menekan potensi suap dan pungli pelayanan publik secara signifikan hingga ke titik nol.'
    },
    {
      title: 'Dewan Kota Meluncurkan Program Penyerapan Anggaran Interaktif Partisipatif Rakyat',
      excerpt: 'Masyarakat kini dapat langsung mengajukan proposal perbaikan lingkungan dan mengalokasikan dana pembangunan secara voting digital.',
      content: 'Demokrasi deliberatif modern kini diwujudkan dalam genggaman ponsel warga kota. Melalui sistem partisipasi digital terpadu, anggaran kota tidak lagi disusun secara top-down sengketa ruang sidang tertutup, melainkan warga mengajukan titik jalan rusak, pengadaan taman baca, hingga posko medis darurat untuk didebatkan secara santun dan divoting secara terbuka demi pemerataan keadilan sosial.'
    }
  ]
};

// Generate highly detailed automatic news article
export function generateAutoNews(selectedCategory?: string, forceStatus: 'pending' | 'approved' = 'pending'): Article {
  const categories = Object.keys(TEMPLATES);
  const finalCategory = selectedCategory && selectedCategory !== 'Semua' 
    ? selectedCategory 
    : categories[Math.floor(Math.random() * categories.length)];

  const templatesList = TEMPLATES[finalCategory];
  const template = templatesList[Math.floor(Math.random() * templatesList.length)];

  // Select images array matching category
  const imagesList = IMAGES[finalCategory] || IMAGES['Teknologi'];
  const finalImage = imagesList[Math.floor(Math.random() * imagesList.length)];

  const finalAuthor = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];

  const idSuffix = Math.floor(Math.random() * 9000) + 1000;
  const uniqueId = `ai-news-${Date.now()}-${idSuffix}`;

  // Random views & likes to show metrics realistically
  const randomViews = Math.floor(Math.random() * 80) + 5;
  const randomLikes = Math.floor(Math.random() * (randomViews / 2)) + 1;

  // Mix dynamic variations in title to avoid duplicates
  const dynamicModifiers = [
    '',
    ' [UTAMA]',
    ' Hari Ini',
    ' - Analisis Khusus',
    ' Terbaru',
    ' Terkini'
  ];
  const modifier = dynamicModifiers[Math.floor(Math.random() * dynamicModifiers.length)];

  return {
    id: uniqueId,
    title: `${template.title}${modifier}`,
    excerpt: template.excerpt,
    content: `${template.content} Melalui pemaparan eksklusif tim redaksi jurnalisme bersertifikat, perkembangan ini akan terus dipantau perkembangannya dari jam ke jam guna menjangkau khalayak pembaca cerdas secara komprehensif dan tajam terpercaya.`,
    category: finalCategory,
    createdAt: new Date().toISOString(),
    author: finalAuthor,
    image: finalImage,
    views: randomViews,
    likes: randomLikes,
    status: forceStatus
  };
}
