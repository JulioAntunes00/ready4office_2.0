"use client";
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const translations = {
  pt: {
    sidebarTitle: "Arquivos", addBtn: "Adicionar PDFs", limitMsg: "Limite: Máximo de 10 arquivos.", processingMsg: "Mesclando...",
    orderTitle: "Ordem dos Arquivos", orderDesc: "Arraste os itens para organizar a ordem final das páginas.",
    previewTitle: "Prévia Final", downloadBtn: "Baixar PDF", emptyTitle: "Aguardando Arquivos",
    oneFileMsg: "Você selecionou 1 arquivo. Selecione mais para poder juntar.", noFilesMsg: "Nenhum arquivo selecionado. Use o painel lateral."
  },
  en: {
    sidebarTitle: "Files", addBtn: "Add PDFs", limitMsg: "Limit: Max 10 files.", processingMsg: "Merging...",
    orderTitle: "File Order", orderDesc: "Drag items to organize the final page order.",
    previewTitle: "Final Preview", downloadBtn: "Download PDF", emptyTitle: "Waiting for Files",
    oneFileMsg: "You selected 1 file. Select more to merge.", noFilesMsg: "No files selected. Use the sidebar."
  }
};

export default function JuntarPdfPage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang];

  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) => new Promise(resolve => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; document.head.appendChild(s);
    });
    loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
  }, []);

  useEffect(() => {
    const autoMerge = async () => {
      if (files.length < 2) {
        setMergedPdfUrl(null);
        return;
      }
      setIsProcessing(true);
      try {
        const { PDFDocument } = window.PDFLib;
        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setMergedPdfUrl(url);
      } catch (error) {
        console.error("Erro ao juntar:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    if (window.PDFLib) {
      autoMerge();
    } else {
      setTimeout(autoMerge, 1000);
    }
  }, [files]); 

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 10) { alert(t.limitMsg); return; }
    const pdfFiles = selectedFiles.filter(f => f.type === 'application/pdf');
    setFiles([...files, ...pdfFiles]);
  };

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));

  const onDragStart = (e, index) => { setDraggedItemIndex(index); setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); };
  const onDragEnter = (e, index) => { e.preventDefault(); setDragOverItemIndex(index); };
  const onDragEnd = (e) => { e.target.style.opacity = '1'; setDraggedItemIndex(null); setDragOverItemIndex(null); };
  const onDrop = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newFiles = [...files];
    const draggedItem = newFiles[draggedItemIndex];
    newFiles.splice(draggedItemIndex, 1);
    newFiles.splice(index, 0, draggedItem);
    setFiles(newFiles);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900">
      
      <Navbar lang={lang} setLang={setLang} />

      <div className="flex-1 flex px-8 pb-8 gap-6 max-w-[1600px] mx-auto w-full mt-8">
        <aside className="w-80 flex flex-col gap-6 flex-shrink-0">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">{t.sidebarTitle}</h2>
            <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center mb-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
              <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.addBtn}</p>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="application/pdf" multiple />
            </div>
            {isProcessing && (
              <div className="w-full py-3 text-blue-600 dark:text-blue-400 font-semibold rounded-xl bg-blue-50 dark:bg-blue-900/30 flex justify-center items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t.processingMsg}
              </div>
            )}
          </div>
        </aside>

        <section className="flex-1 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col min-h-[600px] transition-colors">
          {files.length >= 2 ? (
            <div className="flex gap-6 h-full min-h-[600px]">
              <div className="w-1/3 flex flex-col border-r border-gray-200 dark:border-gray-700 pr-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.orderTitle}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.orderDesc}</p>
                <ul className="space-y-3">
                  {files.map((file, index) => (
                    <li 
                      key={`${file.name}-${index}`}
                      draggable
                      onDragStart={(e) => onDragStart(e, index)}
                      onDragEnter={(e) => onDragEnter(e, index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={onDragEnd}
                      onDrop={(e) => onDrop(e, index)}
                      className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-all bg-white dark:bg-[#252525] cursor-grab active:cursor-grabbing ${dragOverItemIndex === index ? 'border-blue-500 dark:border-blue-500 border-t-4' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">{index + 1}</div>
                      <span className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate flex-1">{file.name}</span>
                      <button onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="w-2/3 flex flex-col h-[600px]">
                 <div className="flex justify-between items-center w-full mb-4">
                   <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.previewTitle}</h2>
                   {mergedPdfUrl && (
                     <a href={mergedPdfUrl} download="arquivos_mesclados.pdf" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex gap-2 items-center text-sm shadow-sm">
                       {t.downloadBtn}
                     </a>
                   )}
                 </div>
                 {mergedPdfUrl ? (
                   <iframe src={mergedPdfUrl} className="w-full flex-1 rounded-xl border border-gray-300 dark:border-gray-700"></iframe>
                 ) : (
                   <div className="w-full flex-1 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center text-gray-400 dark:text-gray-600">...</div>
                 )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.emptyTitle}</h2>
              <p className="text-gray-400 dark:text-gray-500">{files.length === 1 ? t.oneFileMsg : t.noFilesMsg}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}