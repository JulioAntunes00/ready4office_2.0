"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { translations } from '@/utils/translations';
import Navbar from '../../components/Navbar';

export default function ReciboPage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang].recibo;

  // SEO Dinâmico
  useEffect(() => {
    document.title = lang === 'pt' ? "Gerador de Recibo de Pagamento | Ready4Office" : "Payment Receipt Generator | Ready4Office";
  }, [lang]);
  
  // Form data state
  const [formData, setFormData] = useState({
    receiptNumber: '',
    receiptDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    currency: 'BRL',
    amount: '',
    amountWords: '',
    payerName: '',
    payerDocument: '',
    payerAddress: '',
    receiverName: '',
    receiverDocument: '',
    receiverAddress: '',
    description: '',
    observations: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePDF = async () => {
    // Implementação para gerar PDF
    // Por enquanto, vamos usar window.print()
    window.print();
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    return new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: formData.currency
    }).format(numValue);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f7f5f2] dark:bg-[#121212] font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900">
        
        {/* COMPONENTE NAVBAR GLOBAL */}
        <Navbar lang={lang} setLang={setLang} />

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 flex flex-col items-center px-8 py-16 max-w-300 mx-auto w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
        </div>

        {/* Edit Form */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 no-print">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.receiptInfo}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Receipt Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.receiptNumber}
              </label>
              <input
                type="text"
                value={formData.receiptNumber}
                onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder="001/2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.receiptDate}
              </label>
              <input
                type="date"
                value={formData.receiptDate}
                onChange={(e) => handleInputChange('receiptDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Payment Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.paymentMethod}
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
              >
                <option value="cash">{t.cash}</option>
                <option value="transfer">{t.transfer}</option>
                <option value="check">{t.check}</option>
                <option value="card">{t.card}</option>
                <option value="pix">{t.pix}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.currency}
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
              >
                <option value="BRL">BRL - Real Brasileiro</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
                <option value="CNY">CNY - Chinese Yuan</option>
              </select>
            </div>

            {/* Amount */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.amount}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder="0.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.amountWords}
              </label>
              <input
                type="text"
                value={formData.amountWords}
                onChange={(e) => handleInputChange('amountWords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={t.amountWordsPlaceholder}
              />
            </div>

            {/* Payer Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 mt-4">{t.payerInfo}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.payerName}
              </label>
              <input
                type="text"
                value={formData.payerName}
                onChange={(e) => handleInputChange('payerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={t.namePlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.payerDocument}
              </label>
              <input
                type="text"
                value={formData.payerDocument}
                onChange={(e) => handleInputChange('payerDocument', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={lang === 'pt' ? 'CPF/CNPJ' : 'SSN/Tax ID'}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.payerAddress}
              </label>
              <input
                type="text"
                value={formData.payerAddress}
                onChange={(e) => handleInputChange('payerAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={t.addressPlaceholder}
              />
            </div>

            {/* Receiver Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 mt-4">{t.receiverInfo}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.receiverName}
              </label>
              <input
                type="text"
                value={formData.receiverName}
                onChange={(e) => handleInputChange('receiverName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={t.namePlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.receiverDocument}
              </label>
              <input
                type="text"
                value={formData.receiverDocument}
                onChange={(e) => handleInputChange('receiverDocument', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={lang === 'pt' ? 'CPF/CNPJ' : 'SSN/Tax ID'}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.receiverAddress}
              </label>
              <input
                type="text"
                value={formData.receiverAddress}
                onChange={(e) => handleInputChange('receiverAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={t.addressPlaceholder}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.description}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={t.descriptionPlaceholder}
              />
            </div>

            {/* Observations */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.observations}
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                placeholder={t.observationsPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6 print:shadow-none print:border-none print:p-12 print:max-w-none print:m-0" id="receipt-content">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.receiptTitle}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gerado por www.ready4office.com</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><span className="font-medium text-gray-900 dark:text-white">{formData.receiptNumber || '___'}</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><span className="font-medium text-gray-900 dark:text-white">{new Date(formData.receiptDate).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US')}</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">{t[formData.paymentMethod]}</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><span className="font-medium text-gray-900 dark:text-white">{formData.currency}</span></p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(formData.amount)}</p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 dark:border-gray-600 py-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.amountWordsLabel}:</p>
            <p className="font-medium text-gray-900 dark:text-white">{formData.amountWords || '___'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{t.payerInfo}:</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{formData.payerName || '___'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{formData.payerDocument || '___'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{formData.payerAddress || '___'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{t.receiverInfo}:</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{formData.receiverName || '___'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{formData.receiverDocument || '___'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{formData.receiverAddress || '___'}</p>
            </div>
          </div>

          {formData.description && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{t.description}:</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{formData.description}</p>
            </div>
          )}

          {formData.observations && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{t.observations}:</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{formData.observations}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <div className="border-b border-gray-400 dark:border-gray-500 mb-2"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{t.payerSignature}</p>
            </div>
            <div className="text-center">
              <div className="border-b border-gray-400 dark:border-gray-500 mb-2"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{t.receiverSignature}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={generatePDF}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t.downloadBtn}
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            {t.printBtn}
          </button>
        </div>
      </main>
      </div>
      
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
            box-sizing: border-box;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </>
  );
}
