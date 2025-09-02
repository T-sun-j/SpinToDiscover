'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-xs px-2 py-1 h-auto",
          language === 'en' ? "text-white" : "text-muted-foreground"
        )}
        onClick={() => setLanguage('en')}
      >
        {t('footer.language.en')}
      </Button>
      <span className="text-muted-foreground text-xs">·</span>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-xs px-2 py-1 h-auto",
          language === 'zh' ? "text-white" : "text-muted-foreground"
        )}
        onClick={() => setLanguage('zh')}
      >
        {t('footer.language.zh')}
      </Button>
    </div>
  );
}
