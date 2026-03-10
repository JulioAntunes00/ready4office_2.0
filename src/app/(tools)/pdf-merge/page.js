"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/utils/translations';

const autoMerge = async (files, setMergedPdfUrl, setIsProcessing) => {
  if (files.length < 2) {
    setMergedPdfUrl(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return null;
    });
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

    setMergedPdfUrl(prevUrl => {
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      return url;
    });
  } catch (error) {
    console.error("Erro ao juntar:", error);
  } finally {
    setIsProcessing(false);
  }
};

export default function JuntarPdfPage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang].juntar;

  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbnails, setThumbnails] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [partialSlideDistance, setPartialSlideDistance] = useState({});

  const fileInputRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const loadScript = (src) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout loading PDF libraries')), 10000)
    );

    Promise.race([
      Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js'),
        loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js')
      ]),
      timeoutPromise
    ]).then(() => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      }
    }).catch(error => {
      console.error('Failed to load PDF libraries:', error);
    });
  }, []);

  useEffect(() => {
    let timer;
    if (window.PDFLib) {
      autoMerge(files, setMergedPdfUrl, setIsProcessing);
    } else {
      timer = setTimeout(() => autoMerge(files, setMergedPdfUrl, setIsProcessing), 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [files]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 10) { alert(t.limitMsg); return; }
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    setFiles(prev => [...prev, ...pdfFiles]);
  };

  const handleDownload = () => {
    if (mergedPdfUrl) {
      const a = document.createElement('a');
      a.href = mergedPdfUrl;
      a.download = 'arquivos_mesclados.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const generateThumbnail = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const loadingTask = window.pdfjsLib.getDocument({ data: e.target.result });
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);
          
          // Para mobile: formato A4 vertical com aspect ratio fixo
          const isMobile = window.innerWidth < 768;
          const targetWidth = isMobile ? 200 : 300;
          const aspectRatio = 1.414; // A4 aspect ratio (height/width)
          const targetHeight = targetWidth * aspectRatio;
          
          const viewport = page.getViewport({ scale: 1 });
          const scale = targetWidth / viewport.width;
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          // Canvas com aspect ratio A4
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          // Fundo branco para garantir formato A4
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, targetWidth, targetHeight);
          
          // Calcular escala para caber no formato A4 mantendo proporção
          const finalScale = Math.min(targetWidth / viewport.width, targetHeight / viewport.height);
          const scaledWidth = viewport.width * finalScale;
          const scaledHeight = viewport.height * finalScale;
          const x = (targetWidth - scaledWidth) / 2;
          const y = (targetHeight - scaledHeight) / 2;
          
          await page.render({ 
            canvasContext: context, 
            viewport: page.getViewport({ scale: finalScale }),
            transform: [1, 0, 0, 1, x, y]
          }).promise;
          
          resolve(canvas.toDataURL());
        } catch (error) {
          console.error('Erro ao gerar thumbnail:', error);
          resolve(null);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  useEffect(() => {
    files.forEach(async (file, index) => {
      if (!thumbnails[index]) {
        const thumbnail = await generateThumbnail(file);
        setThumbnails(prev => ({ ...prev, [index]: thumbnail }));
      }
    });
  }, [files, thumbnails]);

  // Detectar scroll para efeito no botão VOLTAR
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  };

  const unlockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };

  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
    setIsDragging(true);
    lockBodyScroll();
    triggerHaptic();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setIsDragging(false);
    unlockBodyScroll();
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    
    // Reindexar thumbnails corretamente
    const newThumbnails = {};
    Object.keys(thumbnails).forEach(key => {
      const oldIndex = parseInt(key);
      const file = files[oldIndex];
      const newIndex = newFiles.indexOf(file);
      if (newIndex !== -1) {
        newThumbnails[newIndex] = thumbnails[oldIndex];
      }
    });
    
    setFiles(newFiles);
    setThumbnails(newThumbnails);
    setDragOverIndex(null);
    triggerHaptic();
  };

  const removeFileWithBubbleEffect = (index) => {
    const element = document.getElementById(`file-${index}`);
    if (element) {
      element.classList.add('bubble-pop');
      triggerHaptic();
      
      setTimeout(() => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setThumbnails(prev => {
          const newThumbnails = { ...prev };
          delete newThumbnails[index];
          const reindexed = {};
          Object.keys(newThumbnails).forEach(key => {
            const numKey = parseInt(key);
            if (numKey < index) {
              reindexed[numKey] = newThumbnails[key];
            } else if (numKey > index) {
              reindexed[numKey - 1] = newThumbnails[key];
            }
          });
          return reindexed;
        });
      }, 300);
    }
  };

  return (
    <>
      {/* Mobile Version */}
      <div className={`md:hidden min-h-screen bg-linear-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900 ${isDragging ? 'overflow-hidden' : ''}`}>
        
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300 ${isScrolled ? 'scale-75 opacity-80' : 'scale-100 opacity-100'}`}>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#f9884e] dark:hover:text-[#f9884e]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            VOLTAR
          </Link>
        </div>

        <div className={`fixed left-4 z-30 transition-all duration-300 ${files.length > 0 ? 'top-24' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}`}>
          <button
            onClick={() => fileInputRef.current.click()}
            className={`relative ${files.length > 0 ? 'w-12 h-12 rounded-full' : 'px-6 py-3 rounded-2xl'} bg-[#f9884e] hover:bg-[#e0753e] text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold`}
          >
            {files.length > 0 ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                  {files.length}
                </div>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Arquivo
              </>
            )}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="application/pdf" multiple />
        </div>

        {files.length >= 2 && (
          <div className="fixed left-4 top-36 z-30">
            <button
              onClick={handleDownload}
              disabled={!mergedPdfUrl || isProcessing}
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              title="Baixar PDF mesclado"
            >
              {isProcessing ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </button>
          </div>
        )}

        <div className="flex items-center justify-center min-h-screen p-4 pt-20">
          {files.length === 0 ? (
            <div className="text-center px-4">
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Nenhum arquivo selecionado</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Clique no botão para adicionar PDFs</p>
            </div>
          ) : (
            <div className="w-full max-w-48 mx-auto space-y-3 px-4">
              {files.map((file, index) => {
                // Calcular se este card deve "escorregar" para dar espaço
                const shouldSlideUp = draggedIndex !== null && dragOverIndex !== null && 
                  index >= dragOverIndex && index < draggedIndex;
                const shouldSlideDown = draggedIndex !== null && dragOverIndex !== null && 
                  index <= dragOverIndex && index > draggedIndex;
                
                return (
                  <div
                    key={`${file.name}-${index}`}
                    id={`file-${index}`}
                    ref={el => cardRefs.current[index] = el}
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDragOffset({
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top
                      });
                      setDragPosition({
                        x: rect.left,
                        y: rect.top
                      });
                      handleDragStart(index);
                      triggerHaptic();
                    }}
                    onTouchMove={(e) => {
                      if (draggedIndex !== index) return;
                      e.preventDefault();
                      const touch = e.touches[0];
                      
                      // Atualizar posição do card arrastado
                      setDragPosition({
                        x: touch.clientX - dragOffset.x,
                        y: touch.clientY - dragOffset.y
                      });
                      
                      // Calcular distâncias parciais para animação contínua
                      const newPartialDistances = {};
                      const draggedCard = cardRefs.current[draggedIndex];
                      if (draggedCard) {
                        const draggedRect = draggedCard.getBoundingClientRect();
                        
                        for (let i = 0; i < files.length; i++) {
                          if (i === draggedIndex) continue;
                          const card = cardRefs.current[i];
                          if (card) {
                            const rect = card.getBoundingClientRect();
                            const distance = Math.abs(draggedRect.top - rect.top);
                            const maxDistance = 100; // Distância máxima para animação
                            
                            if (distance < maxDistance) {
                              // Calcular quanto este card deve se mover (0 a 100%)
                              const progress = 1 - (distance / maxDistance);
                              const moveDirection = draggedRect.top > rect.top ? 1 : -1;
                              const slideAmount = progress * 32 * moveDirection; // 32px max movement
                              
                              newPartialDistances[i] = slideAmount;
                            } else {
                              newPartialDistances[i] = 0;
                            }
                          }
                        }
                      }
                      setPartialSlideDistance(newPartialDistances);
                      
                      // Encontrar card sob o dedo para drop final
                      for (let i = 0; i < files.length; i++) {
                        if (i === draggedIndex) continue;
                        const card = cardRefs.current[i];
                        if (card) {
                          const rect = card.getBoundingClientRect();
                          const centerY = rect.top + rect.height / 2;
                          if (touch.clientY > rect.top && touch.clientY < rect.bottom) {
                            if (touch.clientY < centerY && i < draggedIndex) {
                              setDragOverIndex(i);
                            } else if (touch.clientY > centerY && i > draggedIndex) {
                              setDragOverIndex(i);
                            } else {
                              setDragOverIndex(i);
                            }
                            break;
                          }
                        }
                      }
                    }}
                    onTouchEnd={(e) => {
                      if (dragOverIndex !== null && draggedIndex !== null && dragOverIndex !== draggedIndex) {
                        const newFiles = [...files];
                        const draggedFile = newFiles[draggedIndex];
                        newFiles.splice(draggedIndex, 1);
                        newFiles.splice(dragOverIndex, 0, draggedFile);
                        
                        const newThumbnails = {};
                        Object.keys(thumbnails).forEach(key => {
                          const oldIndex = parseInt(key);
                          const f = files[oldIndex];
                          const newIndex = newFiles.indexOf(f);
                          if (newIndex !== -1) {
                            newThumbnails[newIndex] = thumbnails[oldIndex];
                          }
                        });
                        
                        setFiles(newFiles);
                        setThumbnails(newThumbnails);
                        triggerHaptic();
                      }
                      setDragPosition({ x: 0, y: 0 });
                      setDragOffset({ x: 0, y: 0 });
                      setPartialSlideDistance({});
                      handleDragEnd();
                    }}
                    onTouchCancel={() => {
                      setDragPosition({ x: 0, y: 0 });
                      setDragOffset({ x: 0, y: 0 });
                      setPartialSlideDistance({});
                      handleDragEnd();
                    }}
                    className={`touch-none transition-all duration-300 ease-out ${
                      draggedIndex === index ? 'opacity-0 scale-95' : ''
                    }`}
                    style={{
                      transform: draggedIndex === index ? '' : 
                        `translateY(${partialSlideDistance[index] || 0}px) scale(${1 - Math.abs(partialSlideDistance[index] || 0) * 0.01})`
                    }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {thumbnails[index] ? (
                        <img src={thumbnails[index]} alt={file.name} className="w-full aspect-3/4 object-contain bg-gray-50 dark:bg-gray-900" />
                      ) : (
                        <div className="w-full aspect-3/4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                          <svg className="w-10 h-10 text-gray-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2 bg-[#f9884e] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow">
                        {index + 1}
                      </div>
                      
                      <button
                        onClick={() => removeFileWithBubbleEffect(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Card flutuante que segue o dedo */}
              {draggedIndex !== null && (
                <div
                  className="fixed z-50 pointer-events-none transition-none"
                  style={{
                    left: dragPosition.x,
                    top: dragPosition.y,
                    width: cardRefs.current[draggedIndex]?.offsetWidth || 300
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden scale-105 opacity-95">
                    {thumbnails[draggedIndex] ? (
                      <img src={thumbnails[draggedIndex]} alt={files[draggedIndex]?.name} className="w-full aspect-3/4 object-contain bg-gray-50 dark:bg-gray-900" />
                    ) : (
                      <div className="w-full aspect-3/4 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2 bg-[#f9884e] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow">
                      {draggedIndex + 1}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes bubblePop {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.8; }
            100% { transform: scale(0); opacity: 0; }
          }
          
          .bubble-pop {
            animation: bubblePop 0.3s ease-out forwards;
          }
        `}</style>
      </div>

      {/* Desktop Version (mantém o layout original) */}
      <div className={`hidden md:block min-h-screen bg-linear-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900 ${isDragging ? 'overflow-hidden' : ''}`}>
        
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#f9884e] dark:hover:text-[#f9884e]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            VOLTAR
          </Link>
        </div>

        <div className={`fixed left-8 z-30 transition-all duration-300 ${files.length > 0 ? 'top-1/2 transform -translate-y-1/2' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}`}>
          <button
            onClick={() => fileInputRef.current.click()}
            className={`relative ${files.length > 0 ? 'w-14 h-14 rounded-full' : 'px-8 py-4 rounded-2xl'} bg-[#f9884e] hover:bg-[#e0753e] text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold`}
          >
            {files.length > 0 ? (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                  {files.length}
                </div>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Arquivo
              </>
            )}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="application/pdf" multiple />
        </div>

        {files.length >= 2 && (
          <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30 mt-20">
            <button
              onClick={handleDownload}
              disabled={!mergedPdfUrl || isProcessing}
              className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              title="Baixar PDF mesclado"
            >
              {isProcessing ? (
                <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </button>
          </div>
        )}

        <div className="flex items-center justify-center min-h-screen p-8 pt-20">
          {files.length === 0 ? (
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Nenhum arquivo selecionado</h2>
              <p className="text-gray-500 dark:text-gray-400">Clique no botão para adicionar PDFs</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl w-full">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  id={`file-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`relative cursor-grab active:cursor-grabbing transition-all duration-200 ${
                    draggedIndex === index ? 'scale-120 rotate-3 shadow-2xl z-50 opacity-90' : 'hover:scale-105 hover:shadow-xl'
                  } ${dragOverIndex === index ? 'scale-105 ring-2 ring-[#f9884e]' : ''}`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {thumbnails[index] ? (
                      <img src={thumbnails[index]} alt={file.name} className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-900" />
                    ) : (
                      <div className="w-full h-64 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate mb-1">{file.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    
                    <div className="absolute top-2 left-2 bg-[#f9884e] text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md">
                      {index + 1}
                    </div>
                    
                    <button
                      onClick={() => removeFileWithBubbleEffect(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                      title="Remover arquivo"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes bubblePop {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.8; }
            100% { transform: scale(0); opacity: 0; }
          }
          
          .bubble-pop {
            animation: bubblePop 0.3s ease-out forwards;
          }
          
          .scale-120 {
            transform: scale(1.2);
          }
        `}</style>
      </div>
    </>
  );
}
