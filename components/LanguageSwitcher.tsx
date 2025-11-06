'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2 mr-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-[11px] px-0 py-1 h-auto font-inter",
          language === 'en' ? "text-muted-foreground" : "text-muted-foreground"
        )}
        // onClick={() => setLanguage('en')}
      >
        {t('footer.language.en')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-[11px] px-0 py-1 h-auto font-inter",
          language === 'zh' ? "text-muted-foreground" : "text-muted-foreground"
        )}
        // onClick={() => setLanguage('zh')}
      >
        {t('footer.language.zh')}
      </Button>
    </div>
  );
}
