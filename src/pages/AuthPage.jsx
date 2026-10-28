import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  UserPlus,
  LogIn,
  ArrowRight,
  Code2,
  User,
  Palette,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function AuthPage({ profiles, currentUser, onLogin, onRegisterProfile }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('register'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('buyer'); // 'buyer' | 'creator'

  // Form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [headline, setHeadline] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const RedirectByRole = (user) => {
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'creator') navigate('/dashboard');
    else navigate('/library');
  };

  const handleQuickDemoLogin = (profile) => {
    onLogin(profile);
    RedirectByRole(profile);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const found = profiles.find(
        (p) =>
          p.email?.toLowerCase() === email.toLowerCase() ||
          p.username?.toLowerCase() === email.toLowerCase()
      );
      if (!found) {
        setErrorMsg(
          'Akun tidak ditemukan. Silakan gunakan tombol Demo 1-Klik di bawah atau daftar akun baru.'
        );
        return;
      }
      onLogin(found);
      RedirectByRole(found);
      return;
    }

    // Register akun baru
    const cleanUsername =
      username.trim().toLowerCase().replace(/[^a-z0-9]/g, '') ||
      `user${Date.now().toString().slice(-4)}`;

    const newProfile = {
      id: `${selectedRole}-${Date.now()}`,
      role: selectedRole,
      email: email.trim(),
      full_name: fullName.trim(),
      username: cleanUsername,
      headline:
        selectedRole === 'creator'
          ? headline.trim() || 'Kreator Digital & Freelancer Lokal'
          : 'Pembeli & Klien Lapak Digi',
      whatsapp_number: whatsapp.trim() || '6281234567890',
      avatar_url:
        selectedRole === 'creator'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
      bio:
        selectedRole === 'creator'
          ? 'Kreator resmi di ekosistem Lapak Digi.'
          : 'Member pembeli terverifikasi di Lapak Digi.',
      location: 'Indonesia',
      bank_info: selectedRole === 'creator' ? 'BCA • Rekening Kreator' : '',
    };

    onRegisterProfile(newProfile);
    RedirectByRole(newProfile);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Form Pendaftaran / Login Berdasarkan Role */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/40 space-y-6">
          <div className="flex items-center justify-between">
            <BrandLogo size="sm" showTagline={true} />
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Daftar Baru
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Masuk Akun
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {mode === 'register'
                ? 'Pilih Peran & Buat Akun Lapak Digi'
                : 'Masuk ke Ekosistem Lapak Digi'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {mode === 'register'
                ? 'Kami memisahkan halaman Pembeli dan Studio Kreator agar pengalaman bertransaksi jauh lebih fokus dan aman.'
                : 'Masukkan email atau username Anda untuk mengakses halaman sesuai peran akun.'}
            </p>
          </div>

          {/* Pilihan Role Saat Daftar */}
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Ingin Mendaftar Sebagai Apa?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('buyer')}
                  className={`flex items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition ${
                    selectedRole === 'buyer'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/15'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`rounded-xl p-2.5 ${
                      selectedRole === 'buyer'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-900">
                      Pembeli / Customer
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500 leading-relaxed">
                      Download produk digital instan & sewa freelancer dengan garansi dana Escrow.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('creator')}
                  className={`flex items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition ${
                    selectedRole === 'creator'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/15'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`rounded-xl p-2.5 ${
                      selectedRole === 'creator'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-900">
                      Kreator / Freelancer
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500 leading-relaxed">
                      Buka toko produk & jasa gratis. Terima <strong>95% pendapatan bersih</strong> (komisi platform hanya 5%).
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Username Unik
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: budicreator"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                {mode === 'register' ? 'Alamat Email Aktif' : 'Email atau Username'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  mode === 'register' ? 'nama@email.com' : 'Ketik rakadev / dimasbuyer / email...'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm focus:border-indigo-600 focus:outline-none"
              />
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  {selectedRole === 'creator' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Keahlian / Headline Kreator
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Web Developer & UI Designer"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition ${
                mode === 'register' && selectedRole === 'creator'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
              }`}
            >
              {mode === 'register' ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>
                    Daftar Sekarang sebagai{' '}
                    {selectedRole === 'creator' ? 'Kreator (Terima 95%)' : 'Pembeli / Customer'}
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Masuk ke Akun Saya</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Panel Demo Instan 3 Role (Customer, Kreator, & Developer Platform) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-[11px] font-bold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> Mode Simulasi & Pengujian Cepat
            </div>

            <div>
              <h2 className="text-xl font-extrabold">
                Coba Langsung 3 Sudut Pandang Role (1-Klik Login)
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Klik salah satu akun di bawah ini untuk langsung melihat perbedaan halaman antara{' '}
                <strong>Pembeli</strong>, <strong>Kreator (95%)</strong>, dan{' '}
                <strong>Developer Pemilik Platform (Komisi 5%)</strong>:
              </p>
            </div>

            <div className="space-y-3">
              {/* 1. Role Pembeli */}
              {profiles
                .filter((p) => p.role === 'buyer')
                .map((buyer) => (
                  <button
                    key={buyer.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(buyer)}
                    className="w-full flex items-center justify-between gap-3 rounded-2xl bg-slate-800/90 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-400 p-3.5 text-left transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block rounded bg-indigo-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-200">
                          1. Akun Pembeli / Customer
                        </span>
                        <p className="text-sm font-bold text-white truncate mt-0.5">
                          {buyer.full_name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          Akses Library File & Status Booking Jasa
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white flex-shrink-0" />
                  </button>
                ))}

              {/* 2. Role Kreator */}
              {profiles
                .filter((p) => p.role === 'creator')
                .map((creator) => (
                  <button
                    key={creator.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(creator)}
                    className="w-full flex items-center justify-between gap-3 rounded-2xl bg-slate-800/90 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-400 p-3.5 text-left transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={creator.avatar_url}
                        alt={creator.full_name}
                        className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="inline-block rounded bg-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-200">
                          2. Akun Kreator (Terima 95%)
                        </span>
                        <p className="text-sm font-bold text-white truncate mt-0.5">
                          {creator.full_name} (@{creator.username})
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          Kelola Katalog, Dompet 95%, & Tarik Dana
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white flex-shrink-0" />
                  </button>
                ))}

              {/* 3. Role Developer / Admin Platform */}
              {profiles
                .filter((p) => p.role === 'admin')
                .map((admin) => (
                  <button
                    key={admin.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(admin)}
                    className="w-full flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-400/40 p-3.5 text-left transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                        <Code2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block rounded bg-amber-400/30 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-200">
                          3. Developer / Owner Platform (Komisi 5%)
                        </span>
                        <p className="text-sm font-bold text-white truncate mt-0.5">
                          {admin.full_name}
                        </p>
                        <p className="text-[11px] text-amber-100/80 truncate">
                          Pantau Keuntungan 5%, Escrow, & Payout Kreator
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-amber-300 group-hover:translate-x-0.5 transition flex-shrink-0" />
                  </button>
                ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                Setiap transaksi otomatis membagi <strong>95% ke Dompet Kreator</strong> dan{' '}
                <strong>5% ke Kas Developer Platform</strong> secara transparan.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

