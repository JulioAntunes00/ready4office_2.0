"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/utils/translations';
import Navbar from '../../components/Navbar';

export default function AssinaturaPage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang].assinatura;

  // SEO Dinâmico
  useEffect(() => {
    document.title = lang === 'pt' ? "Assinatura Digital de PDF | Ready4Office" : "Digital PDF Signature | Ready4Office";
  }, [lang]);

  // Estados
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [location, setLocation] = useState({
    pais: 'Detectando...',
    cidade: '',
    dataHora: '',
    timezone: ''
  });
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [signatureColor, setSignatureColor] = useState('#000000');
  const [signatureSize, setSignatureSize] = useState(2);
  const [pdfPages, setPdfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Detectar localização
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        
        if (data.status === 'success') {
          const formatoData = getDateFormatByCountry(data.countryCode);
          const dataHora = new Date().toLocaleString(formatoData.locale, {
            timeZone: data.timezone,
            ...formatoData.options
          });

          setLocation({
            pais: data.country,
            cidade: data.city,
            dataHora: dataHora,
            timezone: data.timezone
          });
        }
      } catch (error) {
        // Fallback para sistema
        setLocation({
          pais: 'Local',
          cidade: '',
          dataHora: new Date().toLocaleString(),
          timezone: ''
        });
      }
    };

    detectLocation();
  }, []);

  // Formato de data por país
  const getDateFormatByCountry = (countryCode) => {
    const formats = {
      'BR': { locale: 'pt-BR', options: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } },
      'US': { locale: 'en-US', options: { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true } },
      'DE': { locale: 'de-DE', options: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } },
      'FR': { locale: 'fr-FR', options: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } },
      'ES': { locale: 'es-ES', options: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } },
      'IT': { locale: 'it-IT', options: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } },
      'GB': { locale: 'en-GB', options: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } },
      'CA': { locale: 'en-CA', options: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' } },
      'AU': { locale: 'en-AU', options: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } },
      'MX': { locale: 'es-MX', options: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } }
    };
    
    return formats[countryCode] || formats['BR'];
  };

  // Upload de PDF
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      
      // Carregar páginas do PDF
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
        const pages = [];
        
        for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 5); pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          pages.push({
            pageNum,
            dataUrl: canvas.toDataURL(),
            width: viewport.width,
            height: viewport.height
          });
        }
        
        setPdfPages(pages);
        setCurrentPage(0);
      } catch (error) {
        console.error('Erro ao carregar PDF:', error);
      }
    }
  };

  // Canvas para assinatura
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineWidth = signatureSize;
    ctx.strokeStyle = signatureColor;
    ctx.lineCap = 'round';
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      setSignatureData(canvas.toDataURL());
    }
  };

  // Limpar assinatura
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  // Função auxiliar para converter cor em rotação de hue
  const getHueRotation = (color) => {
    const colors = {
      '#000000': 0,
      '#FF0000': 0,
      '#00FF00': 120,
      '#0000FF': 240,
      '#FFA500': 30,
      '#800080': 270
    };
    return colors[color] || 0;
  };

  // Download do PDF assinado
  const downloadSignedPDF = async () => {
    if (!pdfFile || !signatureData) {
      alert('Por favor, faça upload de um PDF e desenhe uma assinatura primeiro.');
      return;
    }

    try {
      // Criar PDF com jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Adicionar conteúdo do documento original (simulado)
      doc.setFontSize(16);
      doc.text('Conteúdo do Documento', 20, 30);
      doc.setFontSize(12);
      doc.text('Este é um exemplo de documento com assinatura digital.', 20, 50);
      doc.text('O documento original seria inserido aqui.', 20, 70);
      
      // Adicionar informações de localização e data no final da página (pequeno)
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Assinado em: ${location.dataHora}`, pageWidth - 80, pageHeight - 30);
      doc.text(`Local: ${location.pais} ${location.city ? `(${location.city})` : ''}`, pageWidth - 80, pageHeight - 25);
      
      // Adicionar assinatura como imagem no final
      if (signatureData) {
        const imgWidth = 40;
        const imgHeight = 20;
        doc.addImage(signatureData, 'PNG', 20, pageHeight - 40, imgWidth, imgHeight);
      }

      // Download do PDF
      doc.save('documento_assinado.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900">
        
        <Navbar lang={lang} setLang={setLang} />

        <main className="flex-1 flex flex-col items-center px-8 py-16 max-w-300 mx-auto w-full">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
          </div>

          {/* Upload de PDF */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.uploadTitle}</h2>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {pdfFile ? (
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{t.fileSelected}: {pdfFile.name}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t.changeFile}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{t.uploadInstructions}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t.selectFile}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Informações de localização */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.locationInfo}</h2>
            
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                {t.locationDetected}: {location.pais} {location.city && `(${location.city})`}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t.dateTime}: {location.dataHora}
              </p>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                {t.changeLocation}
              </button>
            </div>
          </div>

          {/* Canvas para assinatura */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.signatureTitle}</h2>
            
            <div className="mb-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="border border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={clearSignature}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {t.clearSignature}
              </button>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">{t.color}:</label>
                <input
                  type="color"
                  value={signatureColor}
                  onChange={(e) => setSignatureColor(e.target.value)}
                  className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">{t.size}:</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={signatureSize}
                  onChange={(e) => setSignatureSize(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </div>

          {/* Preview do PDF real e posicionamento da assinatura */}
          {pdfFile && signatureData && pdfPages.length > 0 && (
            <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 w-full max-w-4xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.previewTitle || "Preview do Documento"}</h2>
              
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-[#252525] relative">
                <div className="text-gray-700 dark:text-gray-300 mb-4">
                  <p className="font-medium">Documento: {pdfFile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Arraste a assinatura para a posição desejada:</p>
                </div>
                
                {/* Controles de páginas */}
                {pdfPages.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                    >
                      ←
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Página {currentPage + 1} de {pdfPages.length}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(pdfPages.length - 1, currentPage + 1))}
                      disabled={currentPage === pdfPages.length - 1}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                )}
                
                {/* Preview do PDF real */}
                <div className="relative bg-white border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-auto" style={{ maxHeight: '600px' }}>
                  <div className="relative">
                    <img 
                      src={pdfPages[currentPage]?.dataUrl} 
                      alt={`Página ${currentPage + 1}`}
                      className="w-full h-auto"
                      style={{ maxWidth: '100%', display: 'block' }}
                    />
                    
                    {/* Assinatura sobre o PDF */}
                    <div 
                      className="absolute cursor-move"
                      style={{ 
                        left: `${signaturePosition.x}px`, 
                        top: `${signaturePosition.y}px`,
                        width: '100px',
                        height: '50px'
                      }}
                      onMouseDown={(e) => {
                        const startX = e.clientX - signaturePosition.x;
                        const startY = e.clientY - signaturePosition.y;
                        
                        const handleMouseMove = (e) => {
                          setSignaturePosition({
                            x: e.clientX - startX,
                            y: e.clientY - startY
                          });
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    >
                      <img 
                        src={signatureData} 
                        alt="Assinatura" 
                        className="w-full h-full object-contain"
                        style={{ 
                          filter: signatureColor === '#000000' ? 'none' : `hue-rotate(${getHueRotation(signatureColor)}deg)` 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Controles de posicionamento precisos */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Posição X:</label>
                    <input
                      type="range"
                      min="0"
                      max={pdfPages[currentPage]?.width - 100 || 500}
                      value={signaturePosition.x}
                      onChange={(e) => setSignaturePosition(prev => ({ ...prev, x: Number(e.target.value) }))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{signaturePosition.x}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Posição Y:</label>
                    <input
                      type="range"
                      min="0"
                      max={pdfPages[currentPage]?.height - 50 || 800}
                      value={signaturePosition.y}
                      onChange={(e) => setSignaturePosition(prev => ({ ...prev, y: Number(e.target.value) }))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{signaturePosition.y}</span>
                  </div>
                  
                  <button
                    onClick={() => setSignaturePosition({ x: 50, y: 50 })}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={downloadSignedPDF}
              disabled={!pdfFile || !signatureData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {t.downloadSigned}
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
