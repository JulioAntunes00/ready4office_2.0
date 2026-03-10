"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/utils/translations';

const Navbar = ({ lang, setLang }) => {
  const tNav = translations[lang].navbar;
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const setTheme = (mode) => {
    localStorage.theme = mode;
    setIsDark(mode === 'dark');
  };
  
  const commonToggles = (
    <>
      <div className="flex bg-gray-200 dark:bg-gray-800 rounded-full p-1 transition-colors">
        <button onClick={() => setTheme('light')} className={`px-3 py-1 text-xs font-bold rounded-full transition ${!isDark ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
          Light
        </button>
        <button onClick={() => setTheme('dark')} className={`px-3 py-1 text-xs font-bold rounded-full transition ${isDark ? 'bg-[#333] shadow text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
          Dark
        </button>
      </div>

      <div className="flex bg-gray-200 dark:bg-gray-800 rounded-full p-1 transition-colors">
        <button onClick={() => setLang('pt')} className={`px-3 py-1 text-xs font-bold rounded-full transition ${lang === 'pt' ? 'bg-white dark:bg-[#333] shadow text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
          PT
        </button>
        <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-bold rounded-full transition ${lang === 'en' ? 'bg-white dark:bg-[#333] shadow text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
          EN
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-[#f7f5f2] dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 px-8 py-4 justify-between items-center transition-colors duration-300">
        <Link href="/" className="text-2xl font-bold text-black dark:text-white tracking-tight">Ready4office</Link>
        <div className="flex space-x-2">
          <Link href="/" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-orange-600 dark:text-orange-400">{tNav.navHome}</Link>
          <Link href="/modelos" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">{tNav.navTools}</Link>
        </div>

        <div className="flex items-center gap-4">
          {commonToggles}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-[#f7f5f2] dark:bg-[#121212] border-b border-gray-200 dark:border-gray-900 px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-black dark:text-white">Ready4office</Link>
          <div className="flex items-center gap-2">
            {commonToggles}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <Link href="/" className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] px-3 py-2 text-center text-orange-600 dark:text-orange-400">{tNav.navHome}</Link>
          <Link href="/modelos" className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] px-3 py-2 text-center">{tNav.navTools}</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;