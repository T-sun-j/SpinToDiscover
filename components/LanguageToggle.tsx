"use client";

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const displayLang = language === 'en' ? 'EN' : 'CN';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity mt-4"
      aria-label={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}
    >
      <Image src="/img/earth.svg" alt="earth" width={16} height={16} priority className="h-6 w-6" />
      <span className="text-md font-medium text-[#093966]">{displayLang}</span>
    </button>
  );
}
