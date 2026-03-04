"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

// --- DICIONÁRIO DE TRADUÇÃO ---
const translations = {
  pt: {
    title: "Modelos de PDF Prontos para Baixar",
    subtitle: "Documentos em branco e modelos profissionais para baixar e preencher agora.",
    downloadBtn: "Baixar PDF",
    editBtn: "Editar Online",
    searchPlaceholder: "Procurar modelo...",
    categories: ["Todos", "Trabalho", "Pessoal", "Contratos"],
    items: [
      { id: 1, title: "Recibo de Pagamento", desc: "Modelo simples para comprovação de valores.", cat: "Pessoal" },
      { id: 2, title: "Declaração de Residência", desc: "Para fins de comprovação de morada.", cat: "Pessoal" },
      { id: 3, title: "Currículo Moderno", desc: "Design focado na legibilidade e conversão.", cat: "Trabalho" },
      { id: 4, title: "Contrato de Arrendamento", desc: "Básico para imóveis residenciais.", cat: "Contratos" }
    ]
  },
  en: {
    title: "Ready-to-use PDF Templates",
    subtitle: "Blank professional documents for you to download and fill out now.",
    downloadBtn: "Download PDF",
    editBtn: "Edit Online",
    searchPlaceholder: "Search template...",
    categories: ["All", "Work", "Personal", "Contracts"],
    items: [
      { id: 1, title: "Payment Receipt", desc: "Simple model for proof of payment.", cat: "Personal" },
      { id: 2, title: "Proof of Residence", desc: "Address verification template.", cat: "Personal" },
      { id: 3, title: "Modern Resume", desc: "Design focused on readability.", cat: "Work" },
      { id: 4, title: "Rental Agreement", desc: "Basic for residential properties.", cat: "Contracts" }
    ]
  }
};

export default function ModelosPage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang];

  // SEO Dinâmico
  useEffect(() => {
    document.title = lang === 'pt' ? "Modelos de PDF Gratuitos | Ready4Office" : "Free PDF Templates | Ready4Office";
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900">
      
      {/* COMPONENTE NAVBAR GLOBAL */}
      <Navbar lang={lang} setLang={setLang} />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center px-8 py-16 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 transition-colors">{t.title}</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto transition-colors">{t.subtitle}</p>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="w-full max-w-md mb-12 relative">
            <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-green-400 outline-none transition-colors"
            />
            <svg className="w-5 h-5 absolute right-6 top-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        {/* CATEGORIAS */}
        <div className="flex gap-3 mb-12 overflow-x-auto w-full justify-center no-scrollbar">
            {t.categories.map((cat, i) => (
                <button key={i} className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${i === 0 ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    {cat}
                </button>
            ))}
        </div>

        {/* GRID DE MODELOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full">
            {t.items.map((item) => (
                <div key={item.id} className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-6 group hover:shadow-md dark:hover:shadow-black/50 transition-all">
                    
                    {/* Ícone PDF */}
                    <div className="w-20 h-28 bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="text-[10px] uppercase font-bold mt-1">PDF</span>
                    </div>
                    
                    {/* Detalhes do Modelo */}
                    <div className="flex-1">
                        <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase mb-1">{item.cat}</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.desc}</p>
                        
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-sm font-semibold hover:bg-black dark:hover:bg-gray-600 transition-colors">
                                {t.downloadBtn}
                            </button>
                            <Link href="/editor" className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center block">
                                {t.editBtn}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </main>
    </div>
  );
}