"use client";
import React, { useState, useRef, useEffect } from 'react';
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
      <nav className="hidden md:flex bg-[#f7f5f2] dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 px-8 py-4 justify-between items-center transition-colors duration-300">
        <Link href="/" className="text-2xl font-bold text-black dark:text-white tracking-tight">Ready4office</Link>
        <div className="flex space-x-2">
          <Link href="/" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-orange-600 dark:text-orange-400">{tNav.navHome}</Link>
          <Link href="/" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">{tNav.navTools}</Link>
          <Link href="/modelos" className="px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-green-600 dark:text-green-400">{tNav.navTemplates}</Link>
        </div>
        <div className="flex items-center gap-4">
          {commonToggles}
        </div>
      </nav>

      <nav className="md:hidden bg-[#f7f5f2] dark:bg-[#121212] border-b border-gray-200 dark:border-gray-900 px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-black dark:text-white">Ready4office</Link>
          <div className="flex items-center gap-2">
            {commonToggles}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <Link href="/" className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] px-3 py-2 text-center text-orange-600 dark:text-orange-400">{tNav.navHome}</Link>
          <Link href="/" className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] px-3 py-2 text-center">{tNav.navTools}</Link>
          <Link href="/modelos" className="col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e] px-3 py-2 text-center text-green-600 dark:text-green-400">{tNav.navTemplates}</Link>
        </div>
      </nav>
    </>
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

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const previousBehavior = document.body.style.overscrollBehaviorY;
    document.body.style.overscrollBehaviorY = 'contain';
    return () => {
      document.body.style.overscrollBehaviorY = previousBehavior;
    };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    const arrayBuffer = await file.arrayBuffer();
    setOriginalPdfBytes(arrayBuffer);

    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const container = containerRef.current;
    const computedStyle = window.getComputedStyle(container);
    const paddingX = parseFloat(computedStyle.paddingLeft || '0') + parseFloat(computedStyle.paddingRight || '0');
    const availableWidth = Math.max(0, container.clientWidth - paddingX);
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const scale = Math.min(1.8, availableWidth / unscaledViewport.width);
    
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

  const addTextAtPosition = (clientX, clientY) => {
    const rect = textLayerRef.current.getBoundingClientRect();
    const newText = {
      id: generateId(),
      x: clientX - rect.left,
      y: clientY - rect.top,
      text: '',
      colorHex: activeColor.hex,
      colorRgb: activeColor.rgb
    };
    setTexts((prev) => [...prev, newText]);
    setCurrentTool('select');

    setTimeout(() => {
      const newTextElement = document.querySelector(`[data-text-id="${newText.id}"]`);
      if (newTextElement) {
        newTextElement.focus();
        setIsEditing(newText.id);
      }
    }, 0);
  };

  const handleLayerPointerDown = (event) => {
    if (currentTool !== 'text' || event.target !== textLayerRef.current) return;
    if (event.preventDefault && event.cancelable) {
      event.preventDefault();
    }
    addTextAtPosition(event.clientX, event.clientY);
  };

  const updateTextContent = (id, newContent) => {
    const trimmedContent = newContent.trim();
    setTexts((prev) => prev.map(t => t.id === id ? { ...t, text: trimmedContent } : t));
  };

  const lockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    const currentCount = Number(body.dataset.scrollLockCount || 0) + 1;
    body.dataset.scrollLockCount = String(currentCount);
    body.style.overflow = 'hidden';
  };

  const unlockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    const nextCount = Math.max(0, Number(body.dataset.scrollLockCount || 0) - 1);
    if (nextCount === 0) {
      delete body.dataset.scrollLockCount;
      body.style.overflow = '';
    } else {
      body.dataset.scrollLockCount = String(nextCount);
    }
  };

  useEffect(() => {
    if (!showBottomSheet) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [showBottomSheet]);

  const startDrag = (event, id) => {
    if (currentTool !== 'select' || isEditing === id) return;

    if (event.preventDefault && event.cancelable) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    lockBodyScroll();

    const textElement = event.target;
    const rect = textElement.getBoundingClientRect();
    const { clientX, clientY } = event;
    const containerRect = textLayerRef.current.getBoundingClientRect();

    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
    setDraggingId(id);
  };
  const onDrag = (event) => {
    if (!draggingId || currentTool !== 'select') return;
    if (event.preventDefault && event.cancelable) {
      event.preventDefault();
    }
    const containerRect = textLayerRef.current.getBoundingClientRect();
    const { clientX, clientY } = event;
    let newX = Math.max(0, clientX - containerRect.left - dragOffset.x);
    let newY = Math.max(0, clientY - containerRect.top - dragOffset.y);
    setTexts((prev) => prev.map(t => t.id === draggingId ? { ...t, x: newX, y: newY } : t));
  };
  const stopDrag = () => {
    setDraggingId(null);
    unlockBodyScroll();
  };

  const handlePointerUp = () => {
    stopDrag();
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900 overscroll-y-contain overflow-x-hidden ${currentTool === 'text' ? 'cursor-crosshair' : ''}`}>
      
      <Navbar lang={lang} setLang={setLang} />

      <div className="flex-1 flex flex-col md:flex-row px-3 sm:px-4 md:px-8 pb-8 gap-4 md:gap-6 max-w-[1600px] mx-auto w-full mt-6 md:mt-8">
        {/* Mobile Header */}
        <div className="md:hidden flex flex-col gap-4 w-full">
          <div className="rounded-3xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 shadow-sm p-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => fileInputRef.current.click()} className="h-12 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 bg-orange-50/40 dark:bg-orange-900/10 hover:border-orange-400 transition">
                {pdfLoaded ? 'Trocar PDF' : t.uploadBtn}
              </button>
              <button onClick={handleDownload} disabled={!pdfLoaded || isProcessing} className={`h-12 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold tracking-wide text-white transition ${pdfLoaded ? 'bg-[#f9884e] hover:bg-[#e0753e]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {isProcessing ? t.processingMsg : t.downloadBtn}
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="application/pdf" />
            <p className={`text-[11px] text-center font-semibold ${pdfLoaded ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
              {pdfLoaded ? t.loadedMsg : t.emptyMsg}
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button onClick={() => setCurrentTool('select')} className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition ${currentTool === 'select' ? 'border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-transparent text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
                </button>
                <button onClick={() => setCurrentTool('text')} className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition ${currentTool === 'text' ? 'border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'border-transparent text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                  <span className="text-base font-bold">T</span>
                </button>
              </div>
              <button onClick={() => setShowBottomSheet(!showBottomSheet)} className="px-3 py-2 rounded-2xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                {t.colorLabel}
              </button>
            </div>
            {pdfLoaded && (
              <button onClick={() => setTexts([])} className="w-full text-xs font-semibold text-red-500 border border-red-200 dark:border-red-900/50 rounded-2xl py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                {t.clearBtn}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-80 md:flex-col md:gap-6 md:flex-shrink-0">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">{t.fileLabel}</h2>
            {!pdfLoaded ? (
              <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center mb-4 cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
                 <svg className="mx-auto h-8 w-8 md:h-16 md:w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-sm md:text-base">{t.uploadBtn}</p>
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

        <section ref={containerRef} className="flex-1 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-3 sm:p-4 md:p-6 flex flex-col items-center justify-start overflow-auto relative min-h-[420px] md:min-h-[600px] transition-colors overscroll-y-contain touch-pan-y">
          {!pdfLoaded && (
            <div className="text-gray-400 dark:text-gray-500 mt-8 md:mt-20 text-center flex flex-col items-center">
               <svg className="h-12 w-12 md:h-16 md:w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <p className="text-sm md:text-base">{t.emptyMsg}</p>
            </div>
          )}
          <div className={`relative w-full flex justify-center ${pdfLoaded ? 'shadow-lg border border-gray-200 dark:border-gray-700 rounded-[28px] bg-white dark:bg-black/30 p-3 md:p-6' : 'hidden'}`}>
            <canvas ref={canvasRef} className="block max-w-full h-auto rounded-[20px]" />
            <div 
              ref={textLayerRef} 
              onPointerDown={handleLayerPointerDown}
              onPointerMove={onDrag} 
              onPointerUp={handlePointerUp} 
              onPointerLeave={handlePointerUp}
              className={`absolute top-0 left-0 w-full h-full overflow-hidden ${currentTool === 'select' ? 'touch-none' : 'touch-pan-y'}`}
            >
              {texts.map(item => (
                <div
                  key={item.id}
                  data-text-id={item.id}
                  onPointerDown={(e) => startDrag(e, item.id)}
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
        <div className="p-4 max-h-[45vh] min-h-[35vh] overflow-y-auto">
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
        <div className="md:hidden fixed inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent backdrop-blur-[2px] z-40 transition-opacity" onClick={() => setShowBottomSheet(false)}></div>
      )}
    </div>
  );
}