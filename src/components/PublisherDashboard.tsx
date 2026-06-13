import React, { useState } from 'react';
import { Article, Comment } from '../types';
import { 
  Plus, 
  Trash2, 
  Eye, 
  Heart, 
  MessageSquare, 
  Check, 
  X, 
  TrendingUp, 
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PublisherDashboardProps {
  articles: Article[];
  comments: Comment[];
  onAddArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onToggleCommentApproval: (id: string) => void;
  publisherName: string;
  autoPilotEnabled: boolean;
  setAutoPilotEnabled: (val: boolean) => void;
  autoPilotInterval: number;
  setAutoPilotInterval: (val: number) => void;
  autoPilotStatus: 'pending' | 'approved';
  setAutoPilotStatus: (val: 'pending' | 'approved') => void;
  onTriggerManualAutoNews: (category?: string, status?: 'pending' | 'approved') => void;
}

const PRESET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800', label: 'Media & Pers' },
  { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', label: 'Keamanan AI' },
  { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800', label: 'Rapat Ekonomi' },
  { url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800', label: 'Sepatu Gaya Hidup' },
  { url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800', label: 'Bilik Politik' }
];

export default function PublisherDashboard({
  articles,
  comments,
  onAddArticle,
  onDeleteArticle,
  onDeleteComment,
  onToggleCommentApproval,
  publisherName,
  autoPilotEnabled,
  setAutoPilotEnabled,
  autoPilotInterval,
  setAutoPilotInterval,
  autoPilotStatus,
  setAutoPilotStatus,
  onTriggerManualAutoNews
}: PublisherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'create' | 'articles' | 'comments'>('analytics');

  // New Article Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Teknologi');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(publisherName);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Stats calculations
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);
  const totalComments = comments.length;

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !excerpt.trim() || !content.trim() || !author.trim()) {
      setFormError('Semua kolom form pembuatan berita wajib diisi.');
      return;
    }

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category,
      createdAt: new Date().toISOString(),
      author: author.trim(),
      image: imageUrl,
      views: 0,
      likes: 0,
      status: 'pending'
    };

    onAddArticle(newArticle);
    setFormSuccess(true);
    
    // Clean up
    setTitle('');
    setExcerpt('');
    setContent('');
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('articles');
    }, 1500);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div id="publisher-dashboard" className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white" id="pub-dashboard-title">
            Dasbor Redaksi Penerbit
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Selamat bekerja, <strong className="text-indigo-600 dark:text-indigo-400">{publisherName}</strong>. Di sini Anda memiliki otorisasi penuh untuk menerbitkan berita dan mengelola opini publik.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-850 rounded-xl max-w-max self-start" id="pub-tabs">
          {(['analytics', 'create', 'articles', 'comments'] as const).map((tab) => {
            const labels = {
              analytics: 'Metrik & Ringkasan',
              create: 'Berita Baru',
              articles: 'Kelola Berita',
              comments: 'Moderasi Komentar'
            };
            return (
              <button
                key={tab}
                id={`btn-pub-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-zinc-450 hover:text-gray-800 dark:hover:text-zinc-250'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <motion.div
            key="tab-analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
            id="pub-view-analytics"
          >
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="pub-statistics-cards">
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total Kunjungan</p>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalViews}</h4>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Apresiasi (Likes)</p>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalLikes}</h4>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Opini Masuk</p>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalComments}</h4>
                </div>
              </div>
            </div>

            {/* ROBOT JURNALISME AI / AUTOMATIC WRITER ENGINE */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-950 border border-indigo-100/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4" id="ai-journalist-panel">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100/40 dark:border-zinc-800/50 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-xl">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                      <span>Pilot Otomatis Penulisan AI (Robot Jurnalis)</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        autoPilotEnabled 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 animate-pulse' 
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                      }`}>
                        {autoPilotEnabled ? '● Aktif' : '○ Nonaktif'}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-450 mt-0.5">
                      Izinkan agen AI menulis, merilis, dan memvisualisasikan berita secara berkala tanpa input manusia.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="btn-trigger-ai-news"
                    onClick={() => onTriggerManualAutoNews('Semua', autoPilotStatus)}
                    className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-550"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-delayed" />
                    <span>Hasilkan 1 Berita Sekarang</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                {/* 1. Toggle Autopilot switch */}
                <div className="bg-white/80 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100/65 dark:border-zinc-900 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wide">Status Kontrol</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Toggle untuk menyalakan robot penulis otomatis latar belakang.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      id="toggle-autopilot-btn"
                      onClick={() => setAutoPilotEnabled(!autoPilotEnabled)}
                      className={`w-full py-2 px-4 rounded-lg font-bold text-xs transition-all cursor-pointer text-center ${
                        autoPilotEnabled
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-850 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-900'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750'
                      }`}
                    >
                      {autoPilotEnabled ? 'Matikan Autopilot' : 'Aktifkan Autopilot'}
                    </button>
                  </div>
                </div>

                {/* 2. Interval Rate selector */}
                <div className="bg-white/80 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100/65 dark:border-zinc-900 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wide">Frekuensi Rilis</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Durasi interval per rilis otomatis artikel berita baru.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[15, 30, 60, 180].map((sec) => (
                      <button
                        key={sec}
                        id={`interval-btn-${sec}`}
                        onClick={() => setAutoPilotInterval(sec)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                          autoPilotInterval === sec
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-750'
                        }`}
                      >
                        {sec < 60 ? `${sec} Detik` : `${sec / 60} Menit`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Status/Policy selector */}
                <div className="bg-white/80 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100/65 dark:border-zinc-900 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 dark:text-zinc-350 uppercase tracking-wide">Kebijakan Editorial</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Alur persetujuan saat berita diterbitkan oleh robot.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="policy-approved-btn"
                      onClick={() => setAutoPilotStatus('approved')}
                      className={`flex-1 py-1.5 px-3 rounded-md font-bold text-[10px] text-center transition-all cursor-pointer ${
                        autoPilotStatus === 'approved'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-750'
                      }`}
                    >
                      Tayang Kelihatan
                    </button>
                    <button
                      id="policy-pending-btn"
                      onClick={() => setAutoPilotStatus('pending')}
                      className={`flex-1 py-1.5 px-3 rounded-md font-bold text-[10px] text-center transition-all cursor-pointer ${
                        autoPilotStatus === 'pending'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-750'
                      }`}
                    >
                      Pending Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance charts or quick breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category distribution */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Popularitas Kategori</span>
                </h3>
                <div className="space-y-3" id="category-bars">
                  {['Teknologi', 'Ekonomi', 'Gaya Hidup', 'Politik'].map((cat) => {
                    const count = articles.filter(a => a.category === cat).length;
                    const catViews = articles.filter(a => a.category === cat).reduce((sum, a) => sum + a.views, 0);
                    const percentage = totalViews > 0 ? Math.round((catViews / totalViews) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-gray-700 dark:text-zinc-350">{cat} ({count} berita)</span>
                          <span className="text-gray-400">{catViews} pembaca ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full" 
                            style={{ width: `${percentage || 1}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Publisher rules message card */}
              <div className="bg-gradient-to-br from-indigo-550 to-indigo-700 dark:from-zinc-900 dark:to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1 bg-white/20 text-white rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kode Etik Jurnalisme</span>
                  </span>
                  <h3 className="text-xl font-bold tracking-tight">Kebenaran, Keseimbangan, Integritas</h3>
                  <p className="text-xs text-indigo-100 leading-relaxed">
                    Setiap jurnalis wajib memeriksa kebenaran informasi sebelum mempublikasikannya, menyajikan secara adil, tidak mencampuradukkan fakta dan opini, serta selalu menjaga profesionalitas yang diatur undang-undang pers.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/10 text-[11px] text-indigo-200">
                  Terdaftar resmi pada Badan Pers Digital Indonesia • Verifikasi 2026.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: CREATE NEWS */}
        {activeTab === 'create' && (
          <motion.div
            key="tab-create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto"
            id="pub-view-create"
          >
            <div className="mb-6 pb-4 border-b border-gray-50 dark:border-zinc-800/80">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Formulir Rilis Berita Baru</h3>
              <p className="text-xs text-gray-400">Tulis berita orisinal berkualitas tinggi dan tayangkan secara nasional sekarang.</p>
            </div>

            {formSuccess && (
              <div className="p-4 mb-5 text-sm font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>Pengajuan berita baru sukses! Status masih 'PENDING' & menunggu persetujuan (ACC) Developer.</span>
              </div>
            )}

            {formError && (
              <div className="p-4 mb-5 text-sm font-semibold text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center gap-2">
                <X className="w-5 h-5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateArticle} className="space-y-5" id="new-article-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">Judul Berita</label>
                  <input
                    id="new-title"
                    type="text"
                    placeholder="Contoh: Terobosan PLTS Baru Di Madura..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 outline-hidden transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">Kategori Berita</label>
                  <select
                    id="new-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 outline-hidden transition-all"
                  >
                    <option value="Teknologi">Teknologi</option>
                    <option value="Ekonomi">Ekonomi</option>
                    <option value="Gaya Hidup">Gaya Hidup</option>
                    <option value="Politik">Politik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5 font-bold">Penulis / Wartawan</label>
                <input
                  id="new-author"
                  type="text"
                  placeholder="Nama Penulis"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 outline-hidden transition-all"
                  required
                />
              </div>

              {/* Cover Image URL Selection with Presets */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Tautan Cover Foto Berita</span>
                  </label>
                  <input
                    id="new-image-url"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 outline-hidden transition-all font-mono"
                    required
                  />
                </div>

                <div className="p-3.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Atau Pilih Preset Gambar Sesuai Vibe:</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md border-transparent hover:border-gray-300 dark:hover:border-zinc-650 tracking-wide transition-all border ${
                          imageUrl === preset.url 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-350 hover:bg-gray-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">Kutipan Singkat (Excerpt)</label>
                <input
                  id="new-excerpt"
                  type="text"
                  placeholder="Tulis 1-2 kalimat ringkasan tentang isi berita ini..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 outline-hidden transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">Isi Lengkap Berita</label>
                <textarea
                  id="new-content"
                  rows={8}
                  placeholder="Gunakan paragraf ganda (\n\n) untuk membuat pemisah paragraf agar terlihat rapi..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl focus:border-indigo-500 outline-hidden transition-all resize-y"
                  required
                />
              </div>

              <button
                id="btn-publish-article"
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer shadow-md hover:shadow-indigo-500/15 duration-150"
              >
                <Plus className="w-4 h-4" />
                <span>Terbitkan Berita Sekarang</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* TAB 3: MANAGE ARTICLES */}
        {activeTab === 'articles' && (
          <motion.div
            key="tab-articles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs"
            id="pub-view-manage-list"
          >
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Arsip Berita Aktif</h3>
              <p className="text-xs text-gray-400 mt-0.5">Daftar semua berita yang dipasang pada portal. Anda dapat menghapus rilis lama.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-800" id="articles-table-wrapper">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-800/70 border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold">
                    <th className="p-3.5">Judul Berita</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Penulis</th>
                    <th className="p-3.5">Tanggal Pasang</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Metrik (Views/Likes)</th>
                    <th className="p-3.5 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-700 dark:text-zinc-300">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400 text-xs">Belum ada berita dipasang. Silakan buat satu!</td>
                    </tr>
                  ) : (
                    articles.map((art) => (
                      <tr key={art.id} id={`row-art-${art.id}`} className="hover:bg-gray-50/55 dark:hover:bg-zinc-800/10 transition-colors">
                        <td className="p-3.5 font-bold text-gray-950 dark:text-white max-w-xs truncate">{art.title}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-3.5">{art.author}</td>
                        <td className="p-3.5">{formatDate(art.createdAt)}</td>
                        <td className="p-3.5 text-center">
                          {art.status === 'rejected' ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-950/30">
                              DITOLAK
                            </span>
                          ) : art.status === 'pending' ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-950/30">
                              PENDING
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/30 border-dashed">
                              AKTIF
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center font-mono">
                          <span className="inline-flex items-center gap-1 text-sky-650 mr-2" title="Kunjungan">
                            <Eye className="w-3.5 h-3.5" /> {art.views}
                          </span>
                          <span className="inline-flex items-center gap-1 text-rose-500 font-sans" title="Likes">
                            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> {art.likes}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            id={`btn-del-art-${art.id}`}
                            onClick={() => onDeleteArticle(art.id)}
                            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-colors"
                            title="Hapus Berita"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 4: MODERATE COMMENTS */}
        {activeTab === 'comments' && (
          <motion.div
            key="tab-comments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs"
            id="pub-view-moderate-comments"
          >
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Moderasi Opini Pembaca</h3>
              <p className="text-xs text-gray-400 mt-0.5">Pantau tanggapan pembaca yang masuk. Anda bisa menghapus tanggapan negatif atau menyembunyikannya.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-800" id="comments-table-wrapper">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-800/70 border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold">
                    <th className="p-3.5">Asal Beritaku</th>
                    <th className="p-3.5">Nama Pembaca</th>
                    <th className="p-3.5">Isi Tanggapan / Kritik</th>
                    <th className="p-3.5">Tanggal Dikirim</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-700 dark:text-zinc-300">
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400 text-xs">Belum ada opini pembaca masuk.</td>
                    </tr>
                  ) : (
                    comments.map((com) => {
                      const rootArticle = articles.find(a => a.id === com.articleId);
                      return (
                        <tr key={com.id} id={`row-com-${com.id}`} className="hover:bg-gray-50/55 dark:hover:bg-zinc-800/10 transition-colors">
                          <td className="p-3.5 max-w-[130px] truncate font-medium text-gray-500">
                            {rootArticle ? rootArticle.title : 'Berita Dihapus'}
                          </td>
                          <td className="p-3.5 font-bold text-gray-900 dark:text-white">{com.userName}</td>
                          <td className="p-3.5 max-w-xs">{com.content}</td>
                          <td className="p-3.5">{formatDate(com.createdAt)}</td>
                          <td className="p-3.5 text-center">
                            <button
                              id={`btn-toggle-approve-${com.id}`}
                              onClick={() => onToggleCommentApproval(com.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide transition-all uppercase cursor-pointer ${
                                com.isApproved
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100'
                                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100'
                              }`}
                              title="Klik untuk ubah status tayang"
                            >
                              {com.isApproved ? 'TAYANG' : 'TERTAHAN'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              id={`btn-del-com-${com.id}`}
                              onClick={() => onDeleteComment(com.id)}
                              className="p-1.5 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-colors"
                              title="Hapus Tanggapan Selamanya"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
