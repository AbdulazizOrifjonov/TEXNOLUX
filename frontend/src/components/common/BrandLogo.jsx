import React from 'react';

export default function BrandLogo({ size = 'md', showTagline = false, darkSurface = false }) {
  const circleClass =
    size === 'lg'
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : size === 'sm'
      ? 'w-8 h-8'
      : 'w-9 h-9 sm:w-10 sm:h-10';

  const titleClass =
    size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : size === 'sm'
      ? 'text-sm sm:text-base'
      : 'text-base sm:text-lg';

  const textColor = darkSurface
    ? 'text-white'
    : 'text-slate-950 dark:text-white';

  const taglineColor = darkSurface
    ? 'text-sky-400'
    : 'text-blue-600 dark:text-sky-400';

  return (
    <div className="inline-flex items-center gap-2.5 shrink-0 select-none">
      <div
        className={`${circleClass} rounded-full overflow-hidden bg-white ring-1 ring-slate-200 dark:ring-blue-500/40 shadow-xs shrink-0 flex items-center justify-center`}
      >
        <img
          src="/texnolux-logo.jpg?v=2"
          alt="TEXNOLUX"
          className="w-full h-full object-cover scale-[1.03]"
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${titleClass} font-black tracking-tight uppercase font-sans ${textColor}`}>
          TEXNO<span className="text-blue-600 dark:text-sky-400">LUX</span>
        </span>
        {showTagline && (
          <span className={`hidden lg:block text-[9px] font-extrabold tracking-[0.14em] uppercase mt-0.5 whitespace-nowrap ${taglineColor}`}>
            Ishonchli va Barakali
          </span>
        )}
      </div>
    </div>
  );
}
