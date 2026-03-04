"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

// --- DICIONÁRIO DE TRADUÇÃO ---
const translations = {
  pt: {
    heroTitle: "Editor de PDF e Ferramentas Online Grátis",
    heroSub: "Edite, junte e assine documentos PDF direto no seu navegador. Rápido, seguro e sem precisar instalar programas.",
    btnOpen: "Abrir Ferramenta",
    btnSoon: "Em breve",
    toolEditorTitle: "Editor de PDF",
    toolEditorDesc: "Adicione textos, preencha formulários e assine declarações online com segurança.",
    toolMergeTitle: "Juntar PDFs",
    toolMergeDesc: "Mesclar PDF online. Una vários documentos num único arquivo rapidamente e organize a ordem.",
    toolCompressTitle: "Comprimir PDF",
    toolCompressDesc: "Em breve. Reduza o peso dos seus arquivos mantendo a máxima qualidade original."
  },
  en: {
    heroTitle: "Free Online PDF Editor & Tools",
    heroSub: "Edit, merge, and sign PDF documents directly in your browser. Fast, secure, and no installation required.",
    btnOpen: "Open Tool",
    btnSoon: "Coming soon",
    toolEditorTitle: "PDF Editor",
    toolEditorDesc: "Add text, fill out forms, and sign documents online easily and securely.",
    toolMergeTitle: "Merge PDFs",
    toolMergeDesc: "Combine multiple PDF documents into a single file and organize the page order.",
    toolCompressTitle: "Compress PDF",
    toolCompressDesc: "Coming soon. Reduce your file sizes while maintaining maximum original quality."
  }
};

export default function Home() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang];

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

      <footer className="py-8 text-center text-gray-400 dark:text-gray-600 text-xs border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors">
        &copy; {new Date().getFullYear()} Ready4Office - Global PDF Solutions
      </footer>
    </div>
  );
}