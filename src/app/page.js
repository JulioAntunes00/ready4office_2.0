"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ToolCard from '../components/tools/ToolCard';
import { translations } from '@/utils/translations';
import { incrementVisitCount, formatVisitCount } from '@/utils/visitCounter';

export default function Home() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang].home;

  const [visits, setVisits] = useState(null);

  // SEO Dinâmico
  useEffect(() => {
    document.title = lang === 'pt' ? "Ready4Office | Ferramentas PDF Online" : "Ready4Office | Online PDF Tools";
  }, [lang]);

  useEffect(() => {
    // Contador de visitas local que ignora bots
    const visitCount = incrementVisitCount();
    setVisits(visitCount);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900">
      
      {/* AQUI ESTÁ A NAVBAR GLOBAL */}
      <Navbar lang={lang} setLang={setLang} />

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center px-8 py-16 max-w-[1400px] mx-auto w-full text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">{t.heroTitle}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto transition-colors">{t.heroSub}</p>

        {/* GRID DE FERRAMENTAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          
          {/* Card: Editor */}
          <ToolCard
            title={t.toolEditorTitle}
            description={t.toolEditorDesc}
            href="/editor"
            color="primary"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          />

          {/* Card: Mesclar */}
          <ToolCard
            title={t.toolMergeTitle}
            description={t.toolMergeDesc}
            href="/pdf-merge"
            color="secondary"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            }
          />

          {/* Card: Converter Imagem para PDF */}
          <ToolCard
            title={t.toolConvertTitle}
            description={t.toolConvertDesc}
            href="/image-to-pdf"
            color="success"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01" />
              </svg>
            }
          />

          {/* Card: PDF para Word */}
          <ToolCard
            title={t.toolPdfWordTitle}
            description={t.toolPdfWordDesc}
            href="/pdf-to-word"
            color="purple"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />

          {/* Card: Assinatura Digital */}
          <ToolCard
            title="Assinatura Digital"
            description="Assine PDFs online com carimbo de data e hora. Seguro e profissional."
            href="/digital-signature"
            color="indigo"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25zm6-3.75v.008v-.008z" />
              </svg>
            }
          />

          {/* Card: Comprimir */}
          <ToolCard
            title={t.toolCompressTitle}
            description={t.toolCompressDesc}
            disabled={true}
            color="gray"
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            }
          />

        </div>
      </main>

      <Footer lang={lang} visits={visits !== null ? formatVisitCount(visits) : null} />
    </div>
  );
}
