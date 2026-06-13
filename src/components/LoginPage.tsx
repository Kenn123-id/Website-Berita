import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User as UserIcon, 
  Terminal, 
  Newspaper, 
  ChevronRight, 
  AlertCircle, 
  RefreshCw, 
  UserPlus, 
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onLoginSuccess: (role: 'publisher' | 'developer', name: string) => void;
  onClose: () => void;
}

interface RegisteredStaff {
  username: string;
  role: 'publisher' | 'developer';
  name: string;
  password?: string;
}

export default function LoginPage({ onLoginSuccess, onClose }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register input states
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'publisher' | 'developer'>('publisher');

  // Status states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStaffList, setShowStaffList] = useState(false);

  // Load and sync local accounts database
  const [registeredStaff, setRegisteredStaff] = useState<RegisteredStaff[]>(() => {
    const saved = localStorage.getItem('portal_registered_staff');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('portal_registered_staff', JSON.stringify(registeredStaff));
  }, [registeredStaff]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Simulate authenticating processing
    setTimeout(() => {
      setIsLoading(false);
      const cleanUser = username.trim().toLowerCase();

      // Find in localStorage custom staff accounts
      const matchedUser = registeredStaff.find(
        (staff) => staff.username.toLowerCase() === cleanUser && staff.password === password
      );

      if (matchedUser) {
        onLoginSuccess(matchedUser.role, matchedUser.name);
      } else if (cleanUser === 'developer' && password === 'dev123') {
        // Fallback standard demo account
        onLoginSuccess('developer', 'Developer Agung');
      } else if (cleanUser === 'publisher' && password === 'pub123') {
        // Fallback standard demo account
        onLoginSuccess('publisher', 'Redaktur Utama');
      } else {
        setError('Nama pengguna atau kata sandi Anda salah. Pastikan ejaan kuku Anda benar.');
      }
    }, 850);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanRegName = regName.trim();
    const cleanRegUser = regUsername.trim().toLowerCase();

    if (!cleanRegName || !cleanRegUser || !regPassword) {
      setError('Formulir registrasi belum lengkap. Harap isi semua field!');
      return;
    }

    if (cleanRegUser.length < 3) {
      setError('Nama pengguna (username) minimal 3 karakter.');
      return;
    }

    // Check duplication
    const usernameTaken = registeredStaff.some((staff) => staff.username.toLowerCase() === cleanRegUser) ||
                        cleanRegUser === 'developer' ||
                        cleanRegUser === 'publisher';

    if (usernameTaken) {
      setError(`Nama pengguna "${regUsername}" sudah terdaftar. Gunakan nama pengguna unik lain.`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      const newStaff: RegisteredStaff = {
        name: cleanRegName,
        username: cleanRegUser,
        role: regRole,
        password: regPassword
      };

      setRegisteredStaff((prev) => [...prev, newStaff]);
      setSuccess(`Registrasi Berhasil! Akun "${cleanRegName}" sebagai ${regRole === 'publisher' ? 'Penerbit (Publisher)' : 'Pengembang (Developer)'} siap digunakan. Silakan login.`);
      
      // Auto focus fields to login tab
      setUsername(cleanRegUser);
      setPassword(regPassword);
      setMode('login');

      // Clear input fields
      setRegName('');
      setRegUsername('');
      setRegPassword('');
    }, 900);
  };

  const handleAutofill = (role: 'publisher' | 'developer') => {
    if (role === 'developer') {
      setUsername('developer');
      setPassword('dev123');
    } else {
      setUsername('publisher');
      setPassword('pub123');
    }
    setError(null);
  };

  return (
    <div id="login-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        id="login-card"
        className="w-full max-w-md overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl my-8"
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              {mode === 'login' ? (
                <Lock className="w-6 h-6 animate-pulse" />
              ) : (
                <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              )}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white" id="login-title">
              {mode === 'login' ? 'Masuk Staf Redaksi' : 'Registrasi Staf Baru'}
            </h2>
            <p className="text-xs mt-1 text-gray-500 dark:text-zinc-400 leading-relaxed">
              Mendukung otentikasi penuh untuk Penerbit Berita (Publisher) dan Pengelola Web (Developer)
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-gray-100 dark:border-zinc-800/80 mb-6" id="auth-tabs">
            <button
              type="button"
              id="tab-btn-login"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold text-center border-b-2 transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500'
                  : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200'
              }`}
            >
              Sign In (Masuk)
            </button>
            <button
              type="button"
              id="tab-btn-register"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold text-center border-b-2 transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500'
                  : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200'
              }`}
            >
              Register (Daftar)
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div id="auth-error" className="flex items-start gap-2.5 p-3.5 mb-5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div id="auth-success" className="flex items-start gap-2.5 p-3.5 mb-5 text-xs font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">
                  Nama Pengguna
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    id="login-username"
                    type="text"
                    required
                    placeholder="Masukkan username Anda..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50/50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700/80 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Masukkan password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50/50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700/80 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 font-bold text-xs text-white bg-indigo-650 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengautentikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Panel Kontrol</span>
                    <ChevronRight className="w-4 h-4 animate-pulse" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4" id="register-form">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">
                  Nama Lengkap (Panggilan Redaksi)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <input
                    id="register-name"
                    type="text"
                    required
                    placeholder="Contoh: Redaktur Berita, Budi Santoso..."
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50/50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700/80 rounded-xl outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">
                  Ucap Nama Pengguna (Username login)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    id="register-username"
                    type="text"
                    required
                    placeholder="Contoh: andiredaktur, budidev..."
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50/50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700/80 rounded-xl outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="register-password"
                    type="password"
                    required
                    placeholder="Masukkan sandi unik..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50/50 dark:bg-zinc-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700/80 rounded-xl outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Role Picker Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-2">
                  Peran Staf Otoritatif
                </label>
                <div className="grid grid-cols-2 gap-3" id="register-role-picker">
                  <button
                    type="button"
                    onClick={() => setRegRole('publisher')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      regRole === 'publisher'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 font-bold shadow-xs'
                        : 'border-gray-150 bg-white hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                    }`}
                  >
                    <Newspaper className="w-4 h-4" />
                    <span className="text-[11px]">Penerbit (Publisher)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('developer')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      regRole === 'developer'
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 font-bold shadow-xs'
                        : 'border-gray-150 bg-white hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    <span className="text-[11px]">Developer (Pimpinan)</span>
                  </button>
                </div>
              </div>

              <button
                id="btn-register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/10 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Daftarkan Akun Staf Anda</span>
                    <CheckCircle2 className="w-4 h-4 animate-pulse" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Collapsible Registered Accounts list for testing/validation */}
          <div className="mt-5 border-t border-gray-100 dark:border-zinc-800/80 pt-4" id="staff-database-view">
            <button
              type="button"
              id="btn-toggle-staff-list"
              onClick={() => setShowStaffList(!showStaffList)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-zinc-450 hover:text-gray-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              <span>Basis Data Staf ({registeredStaff.length + 2} Akun Tersedia)</span>
              {showStaffList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showStaffList && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2.5"
                >
                  <div className="space-y-1.5 p-2 bg-gray-50/50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-800/80 rounded-xl max-h-40 overflow-y-auto font-mono text-[10px]">
                    <div className="flex items-center justify-between text-gray-400 border-b border-gray-100 dark:border-zinc-805/50 pb-1.5 font-sans font-bold">
                      <span>Username / Role</span>
                      <span>Password</span>
                    </div>
                    {/* Demo Defaults */}
                    <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10 px-1.5 py-1 rounded">
                      <span className="font-semibold">publisher [Penerbit]</span>
                      <span className="font-bold">pub123</span>
                    </div>
                    <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/10 px-1.5 py-1 rounded">
                      <span className="font-semibold">developer [Developer]</span>
                      <span className="font-bold">dev123</span>
                    </div>
                    {/* Registered Locals */}
                    {registeredStaff.length > 0 ? (
                      registeredStaff.map((staff, idx) => (
                        <div key={idx} className="flex items-center justify-between text-gray-700 dark:text-zinc-300 border-t border-gray-100/50 dark:border-zinc-900/40 pt-1.5 px-1.5">
                          <span>
                            {staff.username} <span className="text-[9px] uppercase font-bold text-gray-400">[{staff.role === 'publisher' ? 'pub' : 'dev'}]</span>
                          </span>
                          <span className="font-bold">{staff.password || '******'}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[9px] text-gray-400 text-center py-1 font-sans">Belum ada akun kustom terdaftar. Daftarlah di tab Register.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 text-center">
            <button
              id="btn-close-login"
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer underline underline-offset-4 font-semibold"
            >
              Kembali sebagai Pembaca umum
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
