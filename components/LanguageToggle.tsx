"use client";

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

interface LanguageToggleProps {
  transparent?: boolean;
}

export function LanguageToggle({ transparent = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const displayLang = language === 'en' ? 'EN' : 'CN';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center text-[#0F1728] hover:opacity-80 transition-opacity"
      aria-label={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}
    >
      <Image 
        src="/img/en.png" 
        alt="Language" 
        width={20} 
        height={20} 
        className="h-5 w-5"
      />
      <span className={`text-[10px] font-medium ml-1 ${transparent ? 'text-[#0F1728]' : 'text-[#0F1728]'}`}>
        {displayLang}
      </span>
    </button>
  );
}
