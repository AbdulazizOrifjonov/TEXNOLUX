import React, { useState, useEffect } from 'react';

export default function AppSplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 550);

    const timer2 = setTimeout(() => {
      setVisible(false);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-white dark:bg-[#0a0a0c] flex flex-col items-center justify-center transition-opacity duration-350 ease-out select-none pointer-events-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white ring-2 ring-slate-200 dark:ring-blue-500/40 shadow-lg animate-pulse flex items-center justify-center">
          <img
            src="/texnolux-logo.jpg?v=2"
            alt="TEXNOLUX"
            className="w-full h-full object-cover scale-[1.03]"
          />
        </div>

        <h1 className="mt-4 font-black text-2xl sm:text-3xl tracking-wider text-slate-950 dark:text-white uppercase font-sans">
          TEXNO<span className="text-blue-600 dark:text-sky-400">LUX</span>
        </h1>
        <p className="mt-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600 dark:text-sky-400">
          Ishonchli va Barakali
        </p>

        <div className="w-28 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-5">
          <div className="w-1/2 h-full bg-blue-600 dark:bg-sky-400 rounded-full animate-[wyueBar_1.2s_ease-in-out_infinite_alternate]" />
        </div>
      </div>
    </div>
  );
}
