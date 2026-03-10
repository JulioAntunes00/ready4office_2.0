"use client";

import { useState, useEffect } from 'react';

export const useLanguage = (initialLang = 'pt') => {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    // Salvar preferência no localStorage
    localStorage.setItem('preferred-language', lang);
  }, [lang]);

  useEffect(() => {
    // Carregar preferência do localStorage
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && savedLang !== lang) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLang(prevLang => prevLang === 'pt' ? 'en' : 'pt');
  };

  return {
    lang,
    setLang,
    toggleLanguage,
    isPortuguese: lang === 'pt',
    isEnglish: lang === 'en'
  };
};
