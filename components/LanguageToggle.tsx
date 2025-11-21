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
      className={`flex items-center ${transparent ? 'text-white' : 'text-[#0F1728]'} hover:opacity-80 transition-opacity`}
      aria-label={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}
    >
      <Image 
        src={transparent ? "/img/lang.png" : "/img/lang-d.png"} 
        alt="Language" 
        width={24} 
        height={24} 
        className="h-4 w-4"
      />
      <span className={`text-[10px] font-medium ml-1 ${transparent ? 'text-white' : 'text-[#0F1728]'}`}>
        {displayLang}
      </span>
    </button>
  );
}
