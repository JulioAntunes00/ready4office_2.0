"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { translations } from '@/utils/translations';

export default function Home() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang].home;

  // SEO Dinâmico
  useEffect(() => {
    document.title = lang === 'pt' ? "Ready4Office | Ferramentas PDF Online" : "Ready4Office | Online PDF Tools";
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900">
      
      {/* AQUI ESTÁ A NAVBAR GLOBAL */}
      <Navbar lang={lang} setLang={setLang} />

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center px-8 py-16 max-w-[1200px] mx-auto w-full text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">{t.heroTitle}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto transition-colors">{t.heroSub}</p>

        {/* GRID DE FERRAMENTAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* Card: Editor */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 transition-colors">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.toolEditorTitle}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm flex-1 leading-relaxed">{t.toolEditorDesc}</p>
            <Link href="/editor" className="w-full py-3 bg-[#f9884e] text-white font-semibold rounded-2xl hover:bg-[#e0753e] transition-colors shadow-lg shadow-orange-100 dark:shadow-none">
              {t.btnOpen}
            </Link>
          </div>

          {/* Card: Mesclar */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.toolMergeTitle}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm flex-1 leading-relaxed">{t.toolMergeDesc}</p>
              <Link href="/juntar-pdf" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 dark:shadow-none">
                {t.btnOpen}
              </Link>
          </div>

          {/* Card: Comprimir */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center opacity-60 transition-colors">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.toolCompressTitle}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm flex-1 leading-relaxed">{t.toolCompressDesc}</p>
              <button disabled className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-semibold rounded-2xl cursor-not-allowed transition-colors">
                {t.btnSoon}
              </button>
          </div>

        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors">
        <div className="max-w-[1200px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Coluna 1: Sobre */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t.footerAboutTitle}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {t.footerAboutDesc}
              </p>
            </div>

            {/* Coluna 2: Links Rápidos */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t.footerLinksTitle}</h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li><a href="/editor" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">{t.footerLink1}</a></li>
                <li><a href="/juntar-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t.footerLink2}</a></li>
                <li><a href="#modelos" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">{t.footerLink3}</a></li>
              </ul>
            </div>

            {/* Coluna 3: Contato */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t.footerInfoTitle}</h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>📧 {t.footerInfo1}</li>
                <li>🔒 {t.footerInfo2}</li>
                <li>⚡ {t.footerInfo3}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-500 dark:text-gray-600 text-xs">
            <p>&copy; {new Date().getFullYear()} Ready4Office - Global PDF Solutions. {t.footerCopyright}</p>
            <p className="mt-2">{t.footerDeveloped}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
