import React from 'react';

/**
 * BrandLogo — Identitas Visual Resmi "Lapak Digi"
 * Filosofi Desain:
 * - Monogram geometris "L" (Lapak / Fondasi Etalase) & "D" (Digital Portal) yang saling mengunci.
 * - Gradasi Indigo (#4F46E5 - Produk Digital) ke Emerald (#10B981 - Jasa 1-on-1)
 *   merepresentasikan ekosistem hibrida Produk + Jasa.
 * - Titik aksen hijau zamrud melambangkan status "Online / Instant Access".
 */
export default function BrandLogo({ size = 'md', showTagline = true, theme = 'light' }) {
  const dimensions = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size] || 'h-10 w-10';

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size] || 'text-xl';

  const isDark = theme === 'dark';

  return (
    <div className="group inline-flex items-center gap-3 select-none">
      {/* Custom Geometric SVG Emblem */}
      <div className={`relative ${dimensions} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Ambient Glow Effect on Hover */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 opacity-0 blur-sm transition duration-300 group-hover:opacity-50" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative h-full w-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="lapakDigiBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="50%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="lapakDigiL" x1="12" y1="10" x2="30" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
            <linearGradient id="lapakDigiD" x1="22" y1="11" x2="38" y2="31" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>

          {/* Base Squircle */}
          <rect width="48" height="48" rx="14" fill="url(#lapakDigiBg)" />

          {/* Inner Glass Highlight Border */}
          <rect
            x="1.25"
            y="1.25"
            width="45.5"
            height="45.5"
            rx="12.75"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />

          {/* Pillar "L" (Lapak / Etalase) */}
          <path
            d="M13.5 13.5C13.5 12.1193 14.6193 11 16 11H18.5C19.8807 11 21 12.1193 21 13.5V30.5H27.5C28.8807 30.5 30 31.6193 30 33V34.5C30 35.8807 28.8807 37 27.5 37H16C14.6193 37 13.5 35.8807 13.5 34.5V13.5Z"
            fill="url(#lapakDigiL)"
          />

          {/* Loop "D" (Digital Wing / Cursor) */}
          <path
            d="M24 11H27.2C32.6124 11 37 15.2533 37 20.5C37 25.7467 32.6124 30 27.2 30H24V24H27C28.933 24 30.5 22.433 30.5 20.5C30.5 18.567 28.933 17 27 17H24V11Z"
            fill="url(#lapakDigiD)"
          />

          {/* Active Digital Node Dot */}
          <circle cx="34.5" cy="34.5" r="2.75" fill="#6EE7B7" />
        </svg>
      </div>

      {/* Wordmark Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-extrabold tracking-tight ${textSizes} flex items-center`}>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>Lapak</span>
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            Digi
          </span>
          <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>

        {showTagline && (
          <span
            className={`mt-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`}
          >
            Creator Marketplace
          </span>
        )}
      </div>
    </div>
  );
}

