"use client";
import React, { useState, useRef } from 'react';
import { translations } from '@/utils/translations';

export default function ReciboPage() {
  const [lang, setLang] = useState('pt');
  const t = translations[lang].recibo;
  
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Language Selector */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex">
            <button
              onClick={() => setLang('pt')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                lang === 'pt' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Português (Brasil)
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                lang === 'en' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 no-print">
          <h2 className="text-xl font-semibold mb-4">{t.receiptInfo}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Receipt Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.receiptNumber}
              </label>
              <input
                type="text"
                value={formData.receiptNumber}
                onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="001/2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.receiptDate}
              </label>
              <input
                type="date"
                value={formData.receiptDate}
                onChange={(e) => handleInputChange('receiptDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Payment Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.paymentMethod}
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.currency}
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.amount}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.amountWords}
              </label>
              <input
                type="text"
                value={formData.amountWords}
                onChange={(e) => handleInputChange('amountWords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.amountWordsPlaceholder}
              />
            </div>

            {/* Payer Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-3 mt-4">{t.payerInfo}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.payerName}
              </label>
              <input
                type="text"
                value={formData.payerName}
                onChange={(e) => handleInputChange('payerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.namePlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.payerDocument}
              </label>
              <input
                type="text"
                value={formData.payerDocument}
                onChange={(e) => handleInputChange('payerDocument', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={lang === 'pt' ? 'CPF/CNPJ' : 'SSN/Tax ID'}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.payerAddress}
              </label>
              <input
                type="text"
                value={formData.payerAddress}
                onChange={(e) => handleInputChange('payerAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.addressPlaceholder}
              />
            </div>

            {/* Receiver Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-3 mt-4">{t.receiverInfo}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.receiverName}
              </label>
              <input
                type="text"
                value={formData.receiverName}
                onChange={(e) => handleInputChange('receiverName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.namePlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.receiverDocument}
              </label>
              <input
                type="text"
                value={formData.receiverDocument}
                onChange={(e) => handleInputChange('receiverDocument', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={lang === 'pt' ? 'CPF/CNPJ' : 'SSN/Tax ID'}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.receiverAddress}
              </label>
              <input
                type="text"
                value={formData.receiverAddress}
                onChange={(e) => handleInputChange('receiverAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.addressPlaceholder}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.description}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.descriptionPlaceholder}
              />
            </div>

            {/* Observations */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.observations}
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.observationsPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6 print:shadow-none print:border-none print:p-12 print:max-w-none print:m-0" id="receipt-content">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.receiptTitle}</h1>
            <p className="text-sm text-gray-500">Gerado por www.ready4office.com</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium text-gray-900">{formData.receiptNumber || '___'}</span></p>
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium text-gray-900">{new Date(formData.receiptDate).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US')}</span></p>
              <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">{t[formData.paymentMethod]}</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium text-gray-900">{formData.currency}</span></p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(formData.amount)}</p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-3 mb-4">
            <p className="text-sm text-gray-600 mb-1">{t.amountWordsLabel}:</p>
            <p className="font-medium text-gray-900">{formData.amountWords || '___'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t.payerInfo}:</h3>
              <p className="text-sm text-gray-700 mb-1">{formData.payerName || '___'}</p>
              <p className="text-xs text-gray-600 mb-1">{formData.payerDocument || '___'}</p>
              <p className="text-xs text-gray-600">{formData.payerAddress || '___'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t.receiverInfo}:</h3>
              <p className="text-sm text-gray-700 mb-1">{formData.receiverName || '___'}</p>
              <p className="text-xs text-gray-600 mb-1">{formData.receiverDocument || '___'}</p>
              <p className="text-xs text-gray-600">{formData.receiverAddress || '___'}</p>
            </div>
          </div>

          {formData.description && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t.description}:</h3>
              <p className="text-sm text-gray-700">{formData.description}</p>
            </div>
          )}

          {formData.observations && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{t.observations}:</h3>
              <p className="text-sm text-gray-700">{formData.observations}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2"></div>
              <p className="text-xs text-gray-600">{t.payerSignature}</p>
            </div>
            <div className="text-center">
              <div className="border-b border-gray-400 mb-2"></div>
              <p className="text-xs text-gray-600">{t.receiverSignature}</p>
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
    </div>
  );
}
