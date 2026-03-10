"use client";

import React from 'react';
import Link from 'next/link';

const Footer = ({ lang = 'pt', visits = null }) => {
  const t = {
    pt: {
      footerAboutTitle: "Sobre",
      footerAboutDesc: "Ready4Office é sua solução completa para manipulação de documentos PDF online. Oferecemos ferramentas profissionais e gratuitas para suas necessidades diárias.",
      footerLinksTitle: "Ferramentas",
      footerLink1: "Editor PDF",
      footerLink2: "Juntar PDF",
      footerLink3: "Modelos",
      footerInfoTitle: "Informações",
      footerInfo1: "contato@ready4office.com",
      footerInfo2: "Segurança e Privacidade",
      footerInfo3: "Processamento Rápido",
      footerCopyright: "Todos os direitos reservados.",
      footerDeveloped: "Desenvolvido com ❤️ no Brasil",
      footerVisits: "visitas"
    },
    en: {
      footerAboutTitle: "About",
      footerAboutDesc: "Ready4Office is your complete solution for online PDF document manipulation. We offer professional and free tools for your daily needs.",
      footerLinksTitle: "Tools",
      footerLink1: "PDF Editor",
      footerLink2: "Merge PDF",
      footerLink3: "Templates",
      footerInfoTitle: "Information",
      footerInfo1: "contact@ready4office.com",
      footerInfo2: "Security & Privacy",
      footerInfo3: "Fast Processing",
      footerCopyright: "All rights reserved.",
      footerDeveloped: "Developed with ❤️ in Brazil",
      footerVisits: "visits"
    }
  };

  const translations = t[lang] || t.pt;

  return (
    <footer className="bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors">
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">
              {translations.footerAboutTitle}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {translations.footerAboutDesc}
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">
              {translations.footerLinksTitle}
            </h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <a href="/editor" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  {translations.footerLink1}
                </a>
              </li>
              <li>
                <a href="/juntar-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {translations.footerLink2}
                </a>
              </li>
              <li>
                <a href="#modelos" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  {translations.footerLink3}
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">
              {translations.footerInfoTitle}
            </h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>📧 {translations.footerInfo1}</li>
              <li>🔒 {translations.footerInfo2}</li>
              <li>⚡ {translations.footerInfo3}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-500 dark:text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} Ready4Office - Global PDF Solutions. {translations.footerCopyright}</p>
          <p className="mt-2">{translations.footerDeveloped}</p>
          {visits !== null && (
            <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-600">
              {visits} {translations.footerVisits}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
