"use client";
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { translations } from '@/utils/translations';

const extractTextFromPdf = async (file, setExtractedPages, setIsProcessing) => {
  if (!file) {
    setExtractedPages([]);
    return;
  }
  setIsProcessing(true);
  try {
    const pdfjsLib = window.pdfjsLib;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');
      pages.push(text);
    }

    setExtractedPages(pages);
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error);
  } finally {
    setIsProcessing(false);
  }
};

const generateDocx = async (pages, fileName) => {
  const { Document, Packer, Paragraph, TextRun, PageBreak } = window.docx;

  const children = [];
  pages.forEach((pageText, index) => {
    const lines = pageText.split(/\n/);
    lines.forEach(line => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line || ' ', size: 24 })],
          spacing: { after: 120 },
        })
      );
    });

    if (index < pages.length - 1) {
      children.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }
  });

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.replace(/\.pdf$/i, '') + '.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function ConverterPdfWordPage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang].pdfToWord;

  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedPages, setExtractedPages] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) => new Promise((resolve) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') return resolve();
        existing.addEventListener('load', resolve, { once: true });
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => { s.dataset.loaded = 'true'; resolve(); };
      document.head.appendChild(s);
    });

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    loadScript('https://unpkg.com/docx@8.5.0/build/index.umd.js');
  }, []);

  useEffect(() => {
    if (!file) return;
    const timer = setTimeout(() => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        extractTextFromPdf(file, setExtractedPages, setIsProcessing);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [file]);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setExtractedPages([]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setExtractedPages([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900">
      
      <Navbar lang={lang} setLang={setLang} />

      <div className="flex-1 flex px-8 pb-8 gap-6 max-w-[1600px] mx-auto w-full mt-8">
        <aside className="w-80 flex flex-col gap-6 flex-shrink-0">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">{t.sidebarTitle}</h2>
            <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center mb-4 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition">
              <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.addBtn}</p>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".pdf" />
            </div>

            {file && (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] shadow-sm">
                <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-bold rounded-full w-8 h-8 flex items-center justify-center text-xs">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate flex-1">{file.name}</span>
                <button onClick={removeFile} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="w-full py-3 mt-4 text-purple-600 dark:text-purple-400 font-semibold rounded-xl bg-purple-50 dark:bg-purple-900/30 flex justify-center items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t.processingMsg}
              </div>
            )}
          </div>
        </aside>

        <section className="flex-1 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col min-h-[600px] transition-colors">
          {extractedPages.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center w-full mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.previewTitle}</h2>
                <button
                  onClick={() => generateDocx(extractedPages, file.name)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex gap-2 items-center text-sm shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  {t.downloadBtn}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {extractedPages.map((pageText, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-[#252525]">
                    <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">{t.pageLabel} {index + 1}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{pageText || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.emptyTitle}</h2>
              <p className="text-gray-400 dark:text-gray-500">{t.noFilesMsg}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
