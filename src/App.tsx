import React, { useState, useEffect } from 'react';
import { Article, Comment, LogEntry, Role, User } from './types';
import { 
  INITIAL_ARTICLES, 
  INITIAL_COMMENTS, 
  INITIAL_LOGS 
} from './data/mockArticles';
import { generateAutoNews } from './lib/autoJournalist';
import ThemeToggle from './components/ThemeToggle';
import ReaderSection from './components/ReaderSection';
import PublisherDashboard from './components/PublisherDashboard';
import DeveloperDashboard from './components/DeveloperDashboard';
import LoginPage from './components/LoginPage';
import { 
  BookOpen, 
  Newspaper, 
  Terminal, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Laptop, 
  ShieldCheck, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database initialization from localStorage or mocks
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('portal_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('portal_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('portal_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('portal_theme');
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Simultaneous sessions for both staff roles
  const [loggedUsers, setLoggedUsers] = useState<Record<'publisher' | 'developer', User | null>>(() => {
    const saved = localStorage.getItem('portal_logged_users');
    try {
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    
    // Fallback migration from old portal_user
    const oldSaved = localStorage.getItem('portal_user');
    if (oldSaved) {
      try {
        const parsed = JSON.parse(oldSaved) as User;
        if (parsed && (parsed.role === 'publisher' || parsed.role === 'developer')) {
          return {
            publisher: parsed.role === 'publisher' ? parsed : null,
            developer: parsed.role === 'developer' ? parsed : null
          };
        }
      } catch {}
    }
    return { publisher: null, developer: null };
  });

  const [activeRole, setActiveRole] = useState<Role>(() => {
    const savedRole = localStorage.getItem('portal_active_role');
    return (savedRole as Role) || 'reader';
  });

  const currentUser = (activeRole === 'publisher' || activeRole === 'developer')
    ? loggedUsers[activeRole]
    : null;

  // Login modal triggers
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingRoleSwitch, setPendingRoleSwitch] = useState<'publisher' | 'developer' | null>(null);

  // Liked articles tracker
  const [likedArticleIds, setLikedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('portal_liked_articles');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarked articles (Baca Nanti) tracker
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('portal_bookmarked_articles');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic status toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Autopilot news generation states
  const [autoPilotEnabled, setAutoPilotEnabled] = useState<boolean>(() => {
    return localStorage.getItem('portal_autopilot_enabled') === 'true';
  });
  const [autoPilotInterval, setAutoPilotInterval] = useState<number>(() => {
    const saved = localStorage.getItem('portal_autopilot_interval');
    return saved ? parseInt(saved, 10) : 25;
  });
  const [autoPilotStatus, setAutoPilotStatus] = useState<'pending' | 'approved'>(() => {
    const saved = localStorage.getItem('portal_autopilot_status');
    return (saved as 'pending' | 'approved') || 'approved';
  });

  useEffect(() => {
    localStorage.setItem('portal_autopilot_enabled', String(autoPilotEnabled));
  }, [autoPilotEnabled]);

  useEffect(() => {
    localStorage.setItem('portal_autopilot_interval', String(autoPilotInterval));
  }, [autoPilotInterval]);

  useEffect(() => {
    localStorage.setItem('portal_autopilot_status', autoPilotStatus);
  }, [autoPilotStatus]);

  // Autopilot generator background trigger
  useEffect(() => {
    if (!autoPilotEnabled) return;

    const intervalId = setInterval(() => {
      const newArt = generateAutoNews('Semua', autoPilotStatus);
      setArticles((prev) => [newArt, ...prev]);
      logSystemEvent(
        'info', 
        `[PILOT OTOMATIS] Robot AI memposting berita baru secara otomatis: "${newArt.title}" (${newArt.category}). Status penayangan: ${newArt.status?.toUpperCase()}`, 
        'Wartawan AI'
      );
      triggerToast(`Berita AI Baru Terbit: "${newArt.title.substring(0, 30)}..."`);
    }, autoPilotInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoPilotEnabled, autoPilotInterval, autoPilotStatus]);

  // Manual Trigger for Auto News
  const handleTriggerManualAutoNews = (category?: string, status: 'pending' | 'approved' = 'approved') => {
    const newArt = generateAutoNews(category, status);
    setArticles((prev) => [newArt, ...prev]);
    logSystemEvent(
      'info', 
      `[AI MANUAL] Pemicu manual diaktifkan. Berita baru berhasil dibuat: "${newArt.title}" [${newArt.category}]. Status penayangan: ${newArt.status?.toUpperCase()}`, 
      'Wartawan AI'
    );
    triggerToast(`Sukses membuat Berita AI: "${newArt.title.substring(0, 30)}..."`);
  };

  // Sync to database
  useEffect(() => {
    localStorage.setItem('portal_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('portal_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('portal_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('portal_liked_articles', JSON.stringify(likedArticleIds));
  }, [likedArticleIds]);

  useEffect(() => {
    localStorage.setItem('portal_bookmarked_articles', JSON.stringify(bookmarkedArticleIds));
  }, [bookmarkedArticleIds]);

  useEffect(() => {
    localStorage.setItem('portal_logged_users', JSON.stringify(loggedUsers));
    
    // Compatibility fallback for single active session key portal_user
    const currentActiveUser = (activeRole === 'publisher' || activeRole === 'developer')
      ? loggedUsers[activeRole]
      : null;
    if (currentActiveUser) {
      localStorage.setItem('portal_user', JSON.stringify(currentActiveUser));
    } else {
      localStorage.removeItem('portal_user');
    }
  }, [loggedUsers, activeRole]);

  useEffect(() => {
    localStorage.setItem('portal_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portal_theme', theme);
  }, [theme]);

  // Toast trigger helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Log dispatch helper
  const logSystemEvent = (level: 'info' | 'warning' | 'error', message: string, source: string = 'Sistem Broker') => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      source
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // AUTH HANDLERS
  const handleRoleClick = (role: Role) => {
    setMobileMenuOpen(false);
    if (role === 'reader') {
      setActiveRole('reader');
      return;
    }

    // Checking credentials for publisher/developer in concurrent sessions list
    const sessionUser = loggedUsers[role];
    if (sessionUser) {
      setActiveRole(role);
      logSystemEvent('info', `Navigasi ke panel ${role} dikonfirmasi untuk sesi ${sessionUser.name}.`, 'Aplikasi Router');
    } else {
      setPendingRoleSwitch(role);
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (role: 'publisher' | 'developer', name: string) => {
    const newUser: User = { username: role, role, name };
    setLoggedUsers((prev) => ({
      ...prev,
      [role]: newUser
    }));
    setActiveRole(role);
    setShowLoginModal(false);
    setPendingRoleSwitch(null);
    triggerToast(`Berhasil masuk sebagai ${name}!`);
    logSystemEvent('info', `Otorisasi login berhasil. Sesi staf dibentuk untuk: ${name}.`, 'Petugas Keamanan');
  };

  const handleLogOut = () => {
    setMobileMenuOpen(false);
    const loggingOutRole = activeRole;
    if (loggingOutRole === 'publisher' || loggingOutRole === 'developer') {
      logSystemEvent('info', `Sesi staf ${currentUser?.name || 'misterius'} (${loggingOutRole}) dihentikan secara sukarela.`, 'Petugas Keamanan');
      setLoggedUsers((prev) => ({
        ...prev,
        [loggingOutRole]: null
      }));
    }
    setActiveRole('reader');
    triggerToast('Anda telah keluar dari akun staf.');
  };

  // CORE DATA MUTATIONS
  const handleAddArticle = (newArt: Article) => {
    setArticles((prev) => [newArt, ...prev]);
    logSystemEvent('info', `Artikel baru diusulkan penerbit: "${newArt.title}" oleh ${newArt.author}. Menunggu persetujuan Developer.`, 'Enjin Redaksi');
    triggerToast('Pengajuan berita berhasil dikirim! Menunggu ACC (persetujuan) Developer.');
  };

  const handleUpdateArticleStatus = (id: string, status: 'approved' | 'rejected') => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    const affected = articles.find((a) => a.id === id);
    logSystemEvent('info', `Developer memperbarui status berita "${affected?.title || id}" menjadi [${status.toUpperCase()}].`, 'Konsol Pengembang');
    triggerToast(`Status berita berhasil diperbarui ke: ${status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}`);
  };

  const handleDeleteArticle = (id: string) => {
    const artToDelete = articles.find((a) => a.id === id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    logSystemEvent('warning', `Artikel dihapus permanen dari portal: "${artToDelete?.title || 'Id tak dikenal'}"`, 'Enjin Redaksi');
    triggerToast('Rilis berita telah dihapus.');
  };

  const handleAddComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
    logSystemEvent('info', `Komentar baru dikirim oleh ${newComment.userName} untuk berita ${newComment.articleId}.`, 'Manajer Komentar');
    triggerToast('Apresiasi tanggapan berhasil dikirim!');
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    logSystemEvent('warning', `Komentar pembaca dengan ID "${id}" dibersihkan oleh redaktur.`, 'Manajer Komentar');
    triggerToast('Komentar telah dihapus.');
  };

  const handleToggleCommentApproval = (id: string) => {
    setComments((prev) => 
      prev.map((c) => (c.id === id ? { ...c, isApproved: !c.isApproved } : c))
    );
    const comment = comments.find((c) => c.id === id);
    const nextStatus = comment?.isApproved ? 'TERTAHAN' : 'TAYANG';
    logSystemEvent('info', `Status penayangan komentar oleh "${comment?.userName}" diubah menjadi ${nextStatus}.`, 'Manajer Komentar');
  };

  const handleLikeArticle = (id: string) => {
    const alreadyLiked = likedArticleIds.includes(id);
    if (alreadyLiked) {
      setLikedArticleIds((prev) => prev.filter((item) => item !== id));
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, likes: Math.max(0, a.likes - 1) } : a))
      );
      logSystemEvent('info', `Apresiasi ditarik kembali (Unlike) untuk artikel: ${id}`, 'Enjin Statistik');
      triggerToast('Apresiasi artikel ditarik kembali.');
    } else {
      setLikedArticleIds((prev) => [...prev, id]);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a))
      );
      logSystemEvent('info', `Satu apresiasi (Like) baru dicatat untuk artikel: ${id}`, 'Enjin Statistik');
      triggerToast('Apresiasi artikel dicatat!');
    }
  };

  const handleToggleBookmark = (id: string) => {
    const alreadyBookmarked = bookmarkedArticleIds.includes(id);
    if (alreadyBookmarked) {
      setBookmarkedArticleIds((prev) => prev.filter((item) => item !== id));
      logSystemEvent('info', `Artikel dihapus dari Baca Nanti (Bookmark): ${id}`, 'Enjin Portal');
      triggerToast('Artikel dihapus dari daftar Baca Nanti.');
    } else {
      setBookmarkedArticleIds((prev) => [...prev, id]);
      logSystemEvent('info', `Artikel disimpan ke Baca Nanti (Bookmark): ${id}`, 'Enjin Portal');
      triggerToast('Artikel disimpan ke daftar Baca Nanti.');
    }
  };

  const handleIncrementViews = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a))
    );
    logSystemEvent('info', `Kunjungan halaman (View) bertambah untuk berita: ${id}`, 'Enjin Analitis');
  };

  // SYSTEM LOG OPERATIONS
  const handleAddLog = (newLog: LogEntry) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
    logSystemEvent('info', 'Layar terminal logs dibersihkan oleh programmer.', 'Konsol Pengembang');
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('portal_articles');
    localStorage.removeItem('portal_comments');
    localStorage.removeItem('portal_logs');
    setArticles(INITIAL_ARTICLES);
    setComments(INITIAL_COMMENTS);
    setLogs(INITIAL_LOGS);
    triggerToast('Database berhasil dipulihkan!');
    logSystemEvent('warning', 'Peringatan keras: Prosedur reset darurat dipicu. Data dipulihkan ke bawaan pabrik.', 'Pusat Kontrol');
  };

  return (
    <div id="portal-app-wrapper" className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 transition-colors duration-250">
      
      {/* 1. TOP PORTAL HEADER (BANNER) */}
      <div id="top-portal-announcer" className="hidden sm:flex bg-zinc-900 border-b border-zinc-800 text-zinc-400 py-2.5 px-6 text-[10px] uppercase tracking-wider font-semibold items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Edisi Hari Ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="h-3 w-px bg-zinc-700"></span>
          <span className="flex items-center gap-1 font-bold text-zinc-350">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Enjin Jurnalisme Cerdas Terdaftar Resmi
          </span>
        </div>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <span className="text-zinc-300">
              Sesi staf aktif: <strong className="text-white font-bold">{currentUser.name}</strong> ({currentUser.role === 'developer' ? 'Pengembang' : 'Penerbit'})
            </span>
          ) : (
            <span className="text-zinc-500 font-bold">PERS DAN PENGELOLA WEB WAJIB LOGIN UNTUK AKSES DASBOR</span>
          )}
        </div>
      </div>

      {/* 2. NAVIGATION BAR (RESPONSIVE) */}
      <nav id="navbar-portal" className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 border-b border-gray-100 dark:border-zinc-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo/Identity */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleRoleClick('reader')} id="navbar-brand">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white block leading-none">
                  KabarNusantara
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                  PERS INDEPENDEN
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Multi-role switcher) */}
            <div className="hidden lg:flex items-center gap-1.5" id="navbar-nav-links">
              <button
                id="nav-btn-reader"
                onClick={() => handleRoleClick('reader')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeRole === 'reader'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Baca Berita (Public)</span>
              </button>

              <button
                id="nav-btn-publisher"
                onClick={() => handleRoleClick('publisher')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeRole === 'publisher'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-650 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>Ruang Redaksi (Publisher)</span>
              </button>

              <button
                id="nav-btn-developer"
                onClick={() => handleRoleClick('developer')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeRole === 'developer'
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                    : 'text-gray-650 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Pengelola Sistem (Developer)</span>
              </button>
            </div>

            {/* Utility actions (Theme Toggle, Auth Control) */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle 
                id="nav-utility-theme-toggle" 
                theme={theme}
                onToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              />
              
              {currentUser ? (
                <button
                  id="btn-navbar-logout"
                  onClick={handleLogOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-100 dark:border-rose-900/10 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({currentUser.name})</span>
                </button>
              ) : (
                <button
                  id="btn-navbar-login"
                  onClick={() => {
                    setPendingRoleSwitch(null);
                    setShowLoginModal(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Staf Log In</span>
                </button>
              )}
            </div>

            {/* Mobile Actions (Menu Burger) */}
            <div className="flex items-center gap-1.5 lg:hidden" id="navbar-mobile-controls">
              <ThemeToggle 
                id="nav-mobile-theme" 
                theme={theme}
                onToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              />
              <button
                id="btn-sidebar-burger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-gray-600 dark:text-zinc-300 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 hover:dark:bg-zinc-700/80 transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
              id="mobile-nav-drawer"
            >
              <div className="px-4 pt-3 pb-5 space-y-2.5">
                <button
                  id="mobile-btn-reader"
                  onClick={() => handleRoleClick('reader')}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold rounded-xl text-left transition-all cursor-pointer ${
                    activeRole === 'reader'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-850'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-indigo-650" />
                  <span>Baca Berita (Public)</span>
                </button>

                <button
                  id="mobile-btn-publisher"
                  onClick={() => handleRoleClick('publisher')}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold rounded-xl text-left transition-all cursor-pointer ${
                    activeRole === 'publisher'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-850'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-emerald-650" />
                  <span>Ruang Redaksi (Publisher Panel)</span>
                </button>

                <button
                  id="mobile-btn-developer"
                  onClick={() => handleRoleClick('developer')}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold rounded-xl text-left transition-all cursor-pointer ${
                    activeRole === 'developer'
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400'
                      : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-850'
                  }`}
                >
                  <Terminal className="w-4 h-4 text-sky-650" />
                  <span>Pengelola Sistem (Developer Console)</span>
                </button>

                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
                  {currentUser ? (
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest px-4">
                        Sesi aktif: {currentUser.name}
                      </p>
                      <button
                        id="mobile-btn-logout"
                        onClick={handleLogOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-left cursor-pointer transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluarkan Akun Staf</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      id="mobile-btn-login"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setPendingRoleSwitch(null);
                        setShowLoginModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Masuk Staf</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. DYNAMIC MAIN STAGE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="portal-main-stage">
        
        {/* Dynamic perspective notification banner */}
        {activeRole !== 'reader' && (
          <div id="role-notify-strip" className="mt-5 p-3 px-4 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                Saat ini melihat portal dari kacamata: <strong className="text-white uppercase tracking-wider">{activeRole === 'publisher' ? '✍️ Redaktur Penerbit' : '💻 Pengembang Web'}</strong>
              </span>
            </div>
            
            <button
              id="role-switch-back-to-public"
              onClick={() => setActiveRole('reader')}
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-all"
            >
              Lihat Portal Sebagai Pembaca (Public View) &rarr;
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeRole === 'reader' && (
            <div key="reader-panel">
              <ReaderSection
                articles={articles}
                comments={comments}
                onAddComment={handleAddComment}
                onLikeArticle={handleLikeArticle}
                onIncrementViews={handleIncrementViews}
                likedArticleIds={likedArticleIds}
                bookmarkedArticleIds={bookmarkedArticleIds}
                onToggleBookmark={handleToggleBookmark}
              />
            </div>
          )}

          {activeRole === 'publisher' && (
            <div key="publisher-panel">
              <PublisherDashboard
                articles={articles}
                comments={comments}
                onAddArticle={handleAddArticle}
                onDeleteArticle={handleDeleteArticle}
                onDeleteComment={handleDeleteComment}
                onToggleCommentApproval={handleToggleCommentApproval}
                publisherName={currentUser?.name || 'Redaktur'}
                autoPilotEnabled={autoPilotEnabled}
                setAutoPilotEnabled={setAutoPilotEnabled}
                autoPilotInterval={autoPilotInterval}
                setAutoPilotInterval={setAutoPilotInterval}
                autoPilotStatus={autoPilotStatus}
                setAutoPilotStatus={setAutoPilotStatus}
                onTriggerManualAutoNews={handleTriggerManualAutoNews}
              />
            </div>
          )}

          {activeRole === 'developer' && (
            <div key="developer-panel">
              <DeveloperDashboard
                articles={articles}
                comments={comments}
                logs={logs}
                onAddLog={handleAddLog}
                onClearLogs={handleClearLogs}
                onResetDatabase={handleResetDatabase}
                onUpdateArticleStatus={handleUpdateArticleStatus}
                developerName={currentUser?.name || 'Developer Utama'}
                autoPilotEnabled={autoPilotEnabled}
                setAutoPilotEnabled={setAutoPilotEnabled}
                autoPilotInterval={autoPilotInterval}
                setAutoPilotInterval={setAutoPilotInterval}
                autoPilotStatus={autoPilotStatus}
                setAutoPilotStatus={setAutoPilotStatus}
                onTriggerManualAutoNews={handleTriggerManualAutoNews}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. FOOTER */}
      <footer id="portal-footer" className="mt-12 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 py-8 text-center text-xs text-gray-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-zinc-300 font-bold">
              <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center text-white text-[10px] uppercase font-bold">
                K
              </div>
              <span>KabarNusantara</span>
            </div>
            <p className="font-medium text-gray-400" id="copyright-text">
              © 2026 KabarNusantara Portal Berita Adaptif. Dibuat dengan presisi tinggi. All rights reserved.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800/40 flex flex-wrap justify-center gap-4 text-[11px] font-semibold dark:text-zinc-400">
            <button id="foot-nav-reader" onClick={() => handleRoleClick('reader')} className="hover:text-indigo-600 cursor-pointer">Fitur Pembaca</button>
            <span className="text-gray-300 dark:text-zinc-800">•</span>
            <button id="foot-nav-pub" onClick={() => handleRoleClick('publisher')} className="hover:text-indigo-600 cursor-pointer">Masuk Penerbit (Publisher)</button>
            <span className="text-gray-300 dark:text-zinc-800">•</span>
            <button id="foot-nav-dev" onClick={() => handleRoleClick('developer')} className="hover:text-indigo-600 cursor-pointer">Konsol Pengembang (Developer)</button>
          </div>
        </div>
      </footer>

      {/* 5. PORTAL STAFFF AUTHENTICATION MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div key="login-dialog-wrap">
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onClose={() => {
                setShowLoginModal(false);
                setPendingRoleSwitch(null);
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 6. TOAST GLOBAL NOTIFICATIONS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            id="global-toast"
            className="fixed bottom-6 right-6 z-50 bg-gray-950 dark:bg-zinc-800/90 text-white rounded-xl px-5 py-3 shadow-2xl text-xs font-bold border border-zinc-800 tracking-wide flex items-center gap-2 backdrop-blur-xs"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
