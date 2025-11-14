"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

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
      className="flex items-center text-foreground hover:opacity-80 transition-opacity"
      aria-label={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}
    >
      <Globe className={`h-5 w-5 ${transparent ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
      <span className={`text-sm font-medium ml-1 ${transparent ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
        {displayLang}
      </span>
    </button>
  );
}
