"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/utils/translations';

const Navbar = ({ lang, setLang }) => {
  const tNav = translations[lang].navbar;
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const theme = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(theme);
    setMounted(true);
  }, []);

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

  return (
    <nav className="bg-[#f7f5f2] dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center transition-colors duration-300 md:sticky md:top-0 md:z-50">
      <Link href="/" className="text-2xl font-bold text-black dark:text-white tracking-tight">Ready4office</Link>
      <div className="flex space-x-2">
        <Link href="/" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-orange-600 dark:text-orange-400">{tNav.navHome}</Link>
        <Link href="/" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">{tNav.navTools}</Link>
        <Link href="/modelos" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-green-600 dark:text-green-400">{tNav.navTemplates}</Link>
      </div>
      
      <div className="flex items-center gap-4">
        {/* BOTÃO DARK/LIGHT */}
        <div className="flex bg-gray-200 dark:bg-gray-800 rounded-full p-1 transition-colors">
          <button onClick={() => setTheme('light')} className={`px-3 py-1 text-xs font-bold rounded-full transition ${(!mounted || !isDark) ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
            Light
          </button>
          <button onClick={() => setTheme('dark')} className={`px-3 py-1 text-xs font-bold rounded-full transition ${(mounted && isDark) ? 'bg-[#333] shadow text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
            Dark
          </button>
        </div>

        {/* BOTÃO IDIOMA */}
        <div className="flex bg-gray-200 dark:bg-gray-800 rounded-full p-1 transition-colors">
          <button onClick={() => setLang('pt')} className={`px-3 py-1 text-xs font-bold rounded-full transition ${lang === 'pt' ? 'bg-white dark:bg-[#333] shadow text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            PT
          </button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-bold rounded-full transition ${lang === 'en' ? 'bg-white dark:bg-[#333] shadow text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            EN
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;