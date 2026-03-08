"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/utils/translations';

// =========================================================================
// COMPONENTE NAVBAR (Embutido aqui apenas para o Canvas funcionar na prévia. 
// No seu VS Code, mantenha a importação do arquivo separado!)
// =========================================================================
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
  
  return (
    <nav className="bg-[#f7f5f2] dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center transition-colors duration-300">
      <Link href="/" className="text-2xl font-bold text-black dark:text-white tracking-tight">Ready4office</Link>
      <div className="flex space-x-2">
        <Link href="/" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-orange-600 dark:text-orange-400">{tNav.navHome}</Link>
        <Link href="/" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">{tNav.navTools}</Link>
        <Link href="/modelos" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-green-600 dark:text-green-400">{tNav.navTemplates}</Link>
      </div>
      
      <div className="flex items-center gap-4">
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
      </div>
    </nav>
  );
};

// =========================================================================
// CÓDIGO DA PÁGINA DO EDITOR
// =========================================================================

const COLORS = [
  { hex: '#000000', rgb: [0, 0, 0] }, { hex: '#DC2626', rgb: [0.86, 0.15, 0.15] },
  { hex: '#22C55E', rgb: [0.13, 0.77, 0.36] }, { hex: '#2563EB', rgb: [0.14, 0.38, 0.92] },
  { hex: '#F97316', rgb: [0.97, 0.45, 0.08] }
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function EditorPdfPage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang].editor;

  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [originalPdfBytes, setOriginalPdfBytes] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTool, setCurrentTool] = useState('select');
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [texts, setTexts] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) => new Promise(resolve => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; document.head.appendChild(s);
    });

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js'),
      loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js')
    ]).then(() => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      }
    });
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    const arrayBuffer = await file.arrayBuffer();
    setOriginalPdfBytes(arrayBuffer);

    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    
    const sectionWidth = containerRef.current.clientWidth - 48;
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const scale = Math.min(1.5, sectionWidth / unscaledViewport.width);
    
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;
    
    setPdfLoaded(true);
    setTexts([]);
  };

  const handleDownload = async () => {
    if (!originalPdfBytes) return;
    setIsProcessing(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      const firstPage = pdfDoc.getPages()[0];
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();
      const scaleX = pdfWidth / canvasRef.current.width;
      const scaleY = pdfHeight / canvasRef.current.height;

      texts.forEach(item => {
        if (!item.text.trim()) return;
        const fontSize = 16 * scaleY; 
        const pdfX = item.x * scaleX;
        const pdfY = pdfHeight - (item.y * scaleY) - fontSize; 

        firstPage.drawText(item.text, {
          x: pdfX, y: pdfY, size: fontSize, font: helveticaFont,
          color: rgb(item.colorRgb[0], item.colorRgb[1], item.colorRgb[2])
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url; a.download = 'documento_editado.pdf';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLayerClick = (e) => {
    if (currentTool !== 'text' || e.target !== textLayerRef.current) return;
    const rect = textLayerRef.current.getBoundingClientRect();
    const newText = { id: generateId(), x: e.clientX - rect.left, y: e.clientY - rect.top, text: '', colorHex: activeColor.hex, colorRgb: activeColor.rgb };
    setTexts([...texts, newText]);
    setCurrentTool('select');
    
    // Coloca o novo texto em modo de edição automaticamente
    setTimeout(() => {
      const newTextElement = document.querySelector(`[data-text-id="${newText.id}"]`);
      if (newTextElement) {
        newTextElement.focus();
        setIsEditing(newText.id);
      }
    }, 0);
  };

  const updateTextContent = (id, newContent) => {
  const trimmedContent = newContent.trim();
  setTexts(texts.map(t => t.id === id ? { ...t, text: trimmedContent } : t));
};

  const startDrag = (e, id) => {
    if (currentTool !== 'select' || isEditing === id) return;
    
    // Previne comportamento padrão apenas se o método existir
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    
    // Bloqueia a rolagem da tela durante o arrasto
    document.body.style.overflow = 'hidden';
    
    const textElement = e.target;
    const rect = textElement.getBoundingClientRect();
    const containerRect = textLayerRef.current.getBoundingClientRect();
    
    // Lida com diferentes tipos de eventos (mouse vs touch)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setDragOffset({ 
      x: clientX - rect.left, 
      y: clientY - rect.top 
    });
    setDraggingId(id);
  };
  const onDrag = (e) => {
    if (!draggingId || currentTool !== 'select') return;
    const containerRect = textLayerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let newX = Math.max(0, clientX - containerRect.left - dragOffset.x);
    let newY = Math.max(0, clientY - containerRect.top - dragOffset.y);
    setTexts(texts.map(t => t.id === draggingId ? { ...t, x: newX, y: newY } : t));
  };
  const stopDrag = () => {
    setDraggingId(null);
    // Restaura a rolagem da tela quando o arrasto termina
    document.body.style.overflow = '';
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900 ${currentTool === 'text' ? 'cursor-crosshair' : ''}`}>
      
      <Navbar lang={lang} setLang={setLang} />

      <div className="flex-1 flex flex-col md:flex-row px-4 md:px-8 pb-8 gap-4 md:gap-6 max-w-[1600px] mx-auto w-full mt-8">
        {/* Mobile Header */}
        <div className="md:hidden flex flex-col gap-4 w-full">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 text-sm">{t.fileLabel}</h2>
            {!pdfLoaded ? (
              <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center mb-3 cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
                 <svg className="mx-auto h-6 w-6 text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.uploadBtn}</p>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="application/pdf" />
              </div>
            ) : (
               <div className="text-xs text-green-600 font-medium mb-3 text-center bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-200 dark:border-green-800">
                 {t.loadedMsg}
               </div>
            )}
            <button onClick={handleDownload} disabled={!pdfLoaded || isProcessing} className={`w-full py-2 text-white font-semibold rounded-xl shadow-sm transition flex justify-center items-center gap-2 text-sm ${pdfLoaded ? 'bg-[#f9884e] hover:bg-[#e0753e]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              {isProcessing ? t.processingMsg : t.downloadBtn}
            </button>
          </div>

          {/* Mobile Tools Bar */}
          {pdfLoaded && (
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button onClick={() => setCurrentTool('select')} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${currentTool === 'select' ? 'border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
                  </button>
                  <button onClick={() => setCurrentTool('text')} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${currentTool === 'text' ? 'border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7V4h16v3M12 4v16m-3 0h6"/></svg>
                  </button>
                </div>
                <button onClick={() => setShowBottomSheet(!showBottomSheet)} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  <span className="text-xs">Cores</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-80 md:flex-col md:gap-6 md:flex-shrink-0">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">{t.fileLabel}</h2>
            {!pdfLoaded ? (
              <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center mb-4 cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
                 <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.uploadBtn}</p>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="application/pdf" />
              </div>
            ) : (
               <div className="text-sm text-green-600 font-medium mb-4 text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                 {t.loadedMsg}
               </div>
            )}
            <button onClick={handleDownload} disabled={!pdfLoaded || isProcessing} className={`w-full py-3 text-white font-semibold rounded-xl shadow-sm transition flex justify-center items-center gap-2 ${pdfLoaded ? 'bg-[#f9884e] hover:bg-[#e0753e]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              {isProcessing ? t.processingMsg : t.downloadBtn}
            </button>
          </div>

          {pdfLoaded && (
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">{t.toolsLabel}</h2>
              <div className="flex gap-4 mb-6">
                <button onClick={() => setCurrentTool('select')} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${currentTool === 'select' ? 'border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
                </button>
                <button onClick={() => setCurrentTool('text')} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${currentTool === 'text' ? 'border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7V4h16v3M12 4v16m-3 0h6"/></svg>
                </button>
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t.colorLabel}</h3>
              <div className="flex gap-2 mb-8">
                {COLORS.map((c, i) => (
                  <button key={i} onClick={() => setActiveColor(c)} className={`w-8 h-8 rounded-full ring-2 ring-offset-2 dark:ring-offset-[#1e1e1e] transition ${activeColor.hex === c.hex ? 'ring-gray-400' : 'ring-transparent hover:ring-gray-300'}`} style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <button onClick={() => setTexts([])} className="w-full py-2 border border-red-200 dark:border-red-900/50 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition flex justify-center items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                {t.clearBtn}
              </button>
            </div>
          )}
        </aside>

        <section ref={containerRef} className="flex-1 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 md:p-6 flex flex-col items-center justify-start overflow-auto relative min-h-[400px] md:min-h-[600px] transition-colors">
          {!pdfLoaded && (
            <div className="text-gray-400 dark:text-gray-500 mt-8 md:mt-20 text-center flex flex-col items-center">
               <svg className="h-12 w-12 md:h-16 md:w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <p className="text-sm md:text-base">{t.emptyMsg}</p>
            </div>
          )}
          <div className={`relative ${pdfLoaded ? 'shadow-lg border border-gray-200 dark:border-gray-700' : 'hidden'}`}>
            <canvas ref={canvasRef} className="block max-w-full h-auto" />
            <div 
              ref={textLayerRef} 
              onMouseDown={handleLayerClick} 
              onMouseMove={onDrag} 
              onMouseUp={stopDrag} 
              onMouseLeave={stopDrag}
              onTouchMove={onDrag}
              onTouchEnd={stopDrag}
              className="absolute top-0 left-0 w-full h-full overflow-hidden"
            >
              {texts.map(item => (
                <div
                  key={item.id}
                  data-text-id={item.id}
                  onMouseDown={(e) => startDrag(e, item.id)}
                  onTouchStart={(e) => startDrag(e.touches[0], item.id)}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const content = e.target.textContent || e.target.innerText || '';
                    updateTextContent(item.id, content);
                  }}
                  onFocus={() => setIsEditing(item.id)}
                  onBlur={(e) => {
                    setIsEditing(null);
                    const content = e.target.textContent || e.target.innerText || '';
                    updateTextContent(item.id, content);
                  }}
                  className={`absolute min-w-[50px] min-h-[24px] px-1 outline-none font-sans text-[14px] md:text-[16px] leading-[1.2] whitespace-nowrap 
                    ${currentTool === 'select' ? 'cursor-move hover:border-gray-300 border border-dashed border-transparent' : 'cursor-text'}
                    focus:border-orange-500 focus:bg-white focus:bg-opacity-90 dark:focus:bg-black dark:focus:bg-opacity-90 border border-dashed border-transparent`}
                  style={{ 
                    left: item.x, 
                    top: item.y, 
                    color: item.colorHex, 
                    userSelect: draggingId ? 'none' : 'auto',
                    touchAction: draggingId ? 'none' : 'auto'
                  }}
                >
                  {item.text || (document.activeElement?.parentNode === textLayerRef.current ? '' : '...')}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className={`md:hidden fixed inset-x-0 bottom-0 bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-800 rounded-t-2xl shadow-2xl transition-transform duration-300 z-50 ${showBottomSheet ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-4">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t.colorLabel}</h3>
            <button onClick={() => setShowBottomSheet(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex gap-3 mb-4 justify-center">
            {COLORS.map((c, i) => (
              <button key={i} onClick={() => { setActiveColor(c); setShowBottomSheet(false); }} className={`w-10 h-10 rounded-full ring-2 ring-offset-2 dark:ring-offset-[#1e1e1e] transition ${activeColor.hex === c.hex ? 'ring-gray-400' : 'ring-transparent hover:ring-gray-300'}`} style={{ backgroundColor: c.hex }} />
            ))}
          </div>
          <button onClick={() => { setTexts([]); setShowBottomSheet(false); }} className="w-full py-3 border border-red-200 dark:border-red-900/50 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition flex justify-center items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            {t.clearBtn}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Sheet Overlay */}
      {showBottomSheet && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowBottomSheet(false)}></div>
      )}
    </div>
  );
}