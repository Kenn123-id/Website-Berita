import React, { useState } from 'react';
import { LogEntry, Article, Comment } from '../types';
import { 
  Terminal, 
  Settings, 
  Database, 
  Cpu, 
  FileCode, 
  Trash2, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  Activity,
  Check,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

interface DeveloperDashboardProps {
  articles: Article[];
  comments: Comment[];
  logs: LogEntry[];
  onAddLog: (log: LogEntry) => void;
  onClearLogs: () => void;
  onResetDatabase: () => void;
  onUpdateArticleStatus: (id: string, status: 'approved' | 'rejected') => void;
  developerName: string;
  autoPilotEnabled: boolean;
  setAutoPilotEnabled: (val: boolean) => void;
  autoPilotInterval: number;
  setAutoPilotInterval: (val: number) => void;
  autoPilotStatus: 'pending' | 'approved';
  setAutoPilotStatus: (val: 'pending' | 'approved') => void;
  onTriggerManualAutoNews: (category?: string, status?: 'pending' | 'approved') => void;
}

export default function DeveloperDashboard({
  articles,
  comments,
  logs,
  onAddLog,
  onClearLogs,
  onResetDatabase,
  onUpdateArticleStatus,
  developerName,
  autoPilotEnabled,
  setAutoPilotEnabled,
  autoPilotInterval,
  setAutoPilotInterval,
  autoPilotStatus,
  setAutoPilotStatus,
  onTriggerManualAutoNews
}: DeveloperDashboardProps) {
  const [activeTab, setActiveTab] = useState<'console' | 'approval' | 'database' | 'system'>('console');
  
  // Custom Log State
  const [logLevel, setLogLevel] = useState<'info' | 'warning' | 'error'>('info');
  const [logMessage, setLogMessage] = useState('');
  const [logSource, setLogSource] = useState('Konsol Pengembang');

  // Trigger custom log
  const handleTriggerLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logMessage.trim()) return;

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: logLevel,
      message: logMessage.trim(),
      source: logSource.trim() || 'Konsol Pengembang'
    };

    onAddLog(newLog);
    setLogMessage('');
  };

  // Estimate local storage usage
  const getStorageSize = () => {
    try {
      const artStr = localStorage.getItem('portal_articles') || '';
      const comStr = localStorage.getItem('portal_comments') || '';
      const logStr = localStorage.getItem('portal_logs') || '';
      const totalBytes = (artStr.length + comStr.length + logStr.length) * 2; // UTF-16 characters use 2 bytes
      return `${(totalBytes / 1024).toFixed(2)} KB`;
    } catch {
      return '0.00 KB';
    }
  };

  return (
    <div id="developer-dashboard" className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white" id="dev-header-title">
            Panel Pengembang Sistem (Developer Console)
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Teknisi aktif: <strong className="text-sky-600 dark:text-sky-400">{developerName}</strong>. Panel ini memberikan akses visual instan ke logs, skema database lokal, dan pengesetan ulang sistem.
          </p>
        </div>

        {/* Console Subtab Headers */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-105 dark:bg-zinc-850 rounded-xl self-start" id="dev-subtabs">
          {(() => {
            const pendingCount = articles.filter((a) => a.status === 'pending').length;
            return (['console', 'approval', 'database', 'system'] as const).map((tab) => {
              const labels = {
                console: 'Terminal Logs',
                approval: `Persetujuan Berita ${pendingCount > 0 ? `(${pendingCount})` : ''}`,
                database: 'Skema & Reset',
                system: 'Status Enjin UI'
              };
              return (
                <button
                  key={tab}
                  id={`btn-dev-tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-zinc-450 hover:text-gray-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            });
          })()}
        </div>
      </div>

      {/* Grid of System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="dev-metrics-deck">
        <div className="bg-zinc-900 text-zinc-100 rounded-xl p-4 space-y-1 border border-zinc-850">
          <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-bold block">Status Memori Temp</span>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-bold font-mono">34.8 MB / G-V8</span>
          </div>
        </div>

        <div className="bg-zinc-900 text-zinc-100 rounded-xl p-4 space-y-1 border border-zinc-850">
          <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-bold block">Latensi Respon</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-bold font-mono">0.02 md (Lokal)</span>
          </div>
        </div>

        <div className="bg-zinc-900 text-zinc-100 rounded-xl p-4 space-y-1 border border-zinc-850">
          <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-bold block">Kira-kira Ukuran DB</span>
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold font-mono">{getStorageSize()}</span>
          </div>
        </div>

        <div className="bg-zinc-900 text-zinc-100 rounded-xl p-4 space-y-1 border border-zinc-850">
          <span className="text-[10px] text-zinc-450 uppercase tracking-widest font-bold block">Total Record DB</span>
          <div className="flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-bold font-mono">{articles.length + comments.length} entri</span>
          </div>
        </div>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dev-view-console">
          {/* Logs Terminal view */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Terminal className="text-indigo-650 w-4 h-4 shrink-0" />
                <span>Konsol Real-Time System Log</span>
              </h3>
              <button
                id="btn-clear-logs"
                onClick={onClearLogs}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Kosongkan Terminal
              </button>
            </div>

            {/* Virtualized terminal screen */}
            <div className="bg-zinc-950 text-emerald-400 font-mono text-xs rounded-xl p-4 h-80 overflow-y-auto space-y-2 border border-zinc-850 shadow-inner" id="terminal-screen">
              {logs.map((log) => {
                const colors = {
                  info: 'text-emerald-400',
                  warning: 'text-amber-400',
                  error: 'text-rose-500 font-bold'
                };
                const prefixes = {
                  info: '[INFO]',
                  warning: '[WARN]',
                  error: '[ERR!]'
                };
                return (
                  <div key={log.id} id={`log-item-${log.id}`} className="leading-relaxed hover:bg-zinc-900/40 p-0.5 rounded-sm transition-all text-[11px]">
                    <span className="text-zinc-650 mr-1.5">[{log.timestamp.slice(11, 19)}]</span>
                    <span className={`${colors[log.level]} mr-2.5`}>{prefixes[log.level]}</span>
                    <span className="text-zinc-400 mr-2">[{log.source}]</span>
                    <span className="text-zinc-100">{log.message}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulate Action Dispatcher */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-105 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-zinc-200 text-sm flex items-center gap-1.5">
              <Play className="w-4 h-4 text-indigo-650 shrink-0" />
              <span>Simulasikan Berkas Sistem</span>
            </h3>

            <p className="text-xs text-gray-400 leading-relaxed">
              Kirimkan log peristiwa buatan langsung ke sistem untuk menguji reaksi visual penanganan galat dan respons aktivitas.
            </p>

            <form onSubmit={handleTriggerLog} className="space-y-4" id="log-generator-form">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">Level Log</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['info', 'warning', 'error'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLogLevel(lvl)}
                      className={`py-1 rounded-md text-[10px] font-bold uppercase border cursor-pointer border-transparent transition-all ${
                        logLevel === lvl 
                          ? lvl === 'info' ? 'bg-emerald-600 text-white shadow-xs' : lvl === 'warning' ? 'bg-amber-500 text-white shadow-xs' : 'bg-rose-600 text-white shadow-xs'
                          : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">Sumber Sistem</label>
                <input
                  type="text"
                  placeholder="Contoh: OtentikasiAPI"
                  value={logSource}
                  onChange={(e) => setLogSource(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-lg outline-hidden transition-all focus:border-indigo-500 font-mono"
                  id="log-input-src"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">Pesan Log Peristiwa</label>
                <textarea
                  placeholder="Ketik status atau teks error di sini..."
                  rows={3}
                  value={logMessage}
                  required
                  onChange={(e) => setLogMessage(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-lg outline-hidden transition-all focus:border-indigo-500 font-mono resize-none"
                  id="log-input-msg"
                />
              </div>

              <button
                id="btn-dispatch-log"
                type="submit"
                className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow-indigo-500/10 cursor-pointer transition-all duration-150"
              >
                <span>Dispatch Peristiwa</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dev-view-db">
          {/* Schema Viewer */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-gray-800 dark:text-zinc-200 text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Skema Rekaman JSON Lokasi</span>
            </h3>

            <p className="text-xs text-gray-400">
              Sistem ini memetakan tipe rekaman relasi data menggunakan struktur TypeScript di bawah ini secara reaktif.
            </p>

            <pre className="p-3 bg-zinc-950 text-indigo-300 font-mono text-[10px] rounded-lg overflow-x-auto select-all max-h-[300px]">
{`interface Article {
  id: string; // Kunci primer (Kategori + Timestamp)
  title: string; // Penyajian judul utama
  excerpt: string; // Ringkasan pendek feed
  content: string; // Isi penuh berita teks panjang
  category: "Teknologi" | "Ekonomi" | "Gaya Hidup" | "Politik";
  createdAt: string; // Representasi waktu ISO8601
  author: string; // Penanda wartawan pelapor
  image: string; // Tautan cover Unsplash valid
  views: number; // Jumlah tontonan reaktif
  likes: number; // Dukungan like pembaca
}

interface Comment {
  id: string; // Identifier unik
  articleId: string; // Kunci asing ke Article.id
  userName: string; // Nama samaran pengomentar
  content: string; // Teks opini utuh
  createdAt: string;
  isApproved: boolean; // Persetujuan moderasi penerbit
}`}
            </pre>
          </div>

          {/* Hard Reset Card */}
          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-5 space-y-4 shadow-sm self-start">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <h3 className="font-bold text-gray-900 dark:text-rose-400 text-sm">Reset Darurat Enjin</h3>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
              Menghapus seluruh berita baru dan kembalikan artikel bawaan asal ke database lokal (`localStorage`). Seluruh modifikasi penerbit beserta komentar uji coba akan diganti baru.
            </p>

            <button
              id="btn-master-db-reset"
              onClick={() => {
                if(window.confirm('Yakin ingin mereset seluruh database Portal Berita ke pengaturan bawaan pabrik?')) {
                  onResetDatabase();
                }
              }}
              className="w-full flex items-center justify-center gap-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Database ke Default</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'approval' && (
        <div className="space-y-6" id="dev-view-approval">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Daftar Peninjauan Berita (Persetujuan Redaksi)
            </h3>
            <p className="text-xs text-gray-400">
              Berikut adalah berita-berita terbaru yang diajukan oleh Penerbit. Anda dapat meneliti isinya, lalu memberikan persetujuan (ACC) agar tayang di beranda pembaca, atau menolaknya secara mutlak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="pending-articles-grid">
            {articles.filter((art) => art.status === 'pending').length === 0 ? (
              <div className="col-span-full bg-white dark:bg-zinc-900 border border-gray-105 dark:border-zinc-800 rounded-2xl p-10 text-center space-y-3" id="empty-pending-state">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">Semua Berita Bersih</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Tidak ada berita baru yang berstatus 'PENDING'. Semua rilis jurnalisme telah ditinjau dan terproses dengan baik.
                </p>
              </div>
            ) : (
              articles
                .filter((art) => art.status === 'pending')
                .map((art) => (
                  <div
                    key={art.id}
                    id={`art-review-${art.id}`}
                    className="bg-white dark:bg-zinc-900 border border-gray-105 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="h-44 w-full relative bg-gray-100 dark:bg-zinc-950">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-900/80 text-white backdrop-blur-md uppercase">
                          {art.category}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-5 space-y-3">
                        <span className="text-[10px] font-bold text-gray-400 font-mono block">
                          ID: {art.id} | Ditulis oleh: <strong className="text-indigo-600 dark:text-indigo-400">{art.author}</strong>
                        </span>
                        <h4 className="font-bold text-gray-950 dark:text-white text-sm tracking-tight leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-semibold">
                          {art.excerpt}
                        </p>
                        
                        <div className="pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1">Preview Isi Berita:</span>
                          <p className="text-[11px] text-gray-650 dark:text-zinc-300 line-clamp-4 bg-gray-50 dark:bg-zinc-950/40 p-2.5 rounded-lg border border-gray-100 dark:border-zinc-850 font-mono">
                            {art.content}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-850 flex items-center gap-2.5">
                      <button
                        id={`btn-reject-${art.id}`}
                        onClick={() => onUpdateArticleStatus(art.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-150 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        <X className="w-4 h-4" />
                        <span>TOLAK BERITA</span>
                      </button>

                      <button
                        id={`btn-approve-${art.id}`}
                        onClick={() => onUpdateArticleStatus(art.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10"
                      >
                        <Check className="w-4 h-4" />
                        <span>ACC / SETUJUI</span>
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-105 dark:border-zinc-800 rounded-xl p-6 space-y-4" id="dev-view-system">
          <h3 className="font-bold text-gray-800 dark:text-zinc-200 text-sm flex items-center gap-1.5 border-b border-gray-100 dark:border-zinc-800 pb-3">
            <Settings className="w-4 h-4 text-indigo-650 shrink-0 animate-spin-slow" />
            <span>Spesifikasi Konfigurasi & Responsivitas</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 dark:text-zinc-300">
            <div className="bg-gray-50 dark:bg-zinc-850 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Teknologi Render</span>
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-gray-500 dark:text-zinc-400 font-medium">
                <li>Kerangka Utama: <strong className="text-gray-700 dark:text-zinc-300">React JS 19.x & Vite UI</strong></li>
                <li>Gaya Bahasa: <strong className="text-gray-700 dark:text-zinc-300">TypeScript 5.8 </strong></li>
                <li>Penghias Tampilan: <strong className="text-gray-700 dark:text-zinc-300">Tailwind CSS v4 (Utilitas Murni)</strong></li>
                <li>Ikon Set: <strong className="text-gray-700 dark:text-zinc-300">Lucide React SVG Kit</strong></li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-850 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>Adaptasi Responsif</span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                Telah diintegrasikan penyesuaian media query fluid menggunakan kelas prefix Tailwind (<code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-rose-500 font-mono text-[10px]">sm:</code>, <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-rose-500 font-mono text-[10px]">md:</code>, <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-rose-500 font-mono text-[10px]">lg:</code>, <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-rose-500 font-mono text-[10px]">xl:</code>) sehingga website berita ini beradaptasi otomatis di:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-gray-500 dark:text-zinc-400 font-medium">
                <li>Telepon Pintar (Mobile viewport &lt; 640px)</li>
                <li>Tablet Portabel (Tablet viewport 768px - 1024px)</li>
                <li>Layar Lebar Desktop/TV (Desktop viewport &gt; 1024px)</li>
              </ul>
            </div>
          </div>

          {/* AI AUTOMATIC JOURNALIST DEV SPEC CARD */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-950/50 rounded-xl space-y-3 mt-4 text-xs">
            <h4 className="font-bold text-gray-800 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span>Enjin AI Autopilot Info (Sistem Utama)</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                autoPilotEnabled ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-450'
              }`}>
                {autoPilotEnabled ? '● BERJALAN' : '○ MATI'}
              </span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-500 dark:text-zinc-400 font-semibold" id="dev-autopilot-spec-list">
              <div className="bg-white dark:bg-zinc-900 border border-indigo-50 dark:border-zinc-800/60 p-3 rounded-lg">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">FREKUENSI TICK</span>
                <span className="text-xs text-gray-800 dark:text-white font-bold block mt-1">{autoPilotInterval} detik per siklus</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-indigo-50 dark:border-zinc-800/60 p-3 rounded-lg">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">ALUR PERSIDANGAN PERS</span>
                <span className="text-xs text-gray-800 dark:text-white font-bold block mt-1">
                  {autoPilotStatus === 'approved' ? 'TAYANG LANGSUNG (ACC)' : 'MODERASI DRAFT (PENDING)'}
                </span>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-indigo-50 dark:border-zinc-800/60 p-3 rounded-lg">
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">AKSI CEPAT</span>
                <button
                  id="dev-btn-trigger-ai"
                  onClick={() => onTriggerManualAutoNews('Semua', 'approved')}
                  className="mt-1 flex items-center justify-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                >
                  Paksa Rilis AI (ACC)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
