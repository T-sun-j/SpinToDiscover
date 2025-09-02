'use client';

import { Button } from './ui/button';
import { UserRound, Globe2, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  showSearch?: boolean;
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
  rightAction?: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

export function Header({
  showSearch = false,
  showBackButton = false,
  backUrl = '/',
  title,
  rightAction,
  className = '',
  transparent = false
}: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className={`flex items-center justify-between py-3 w-full ${transparent ? 'bg-transparent' : 'bg-background/80 backdrop-blur-sm'} ${className}`}>
      {/* 左侧：Logo 或返回按钮 */}
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <Link href={backUrl}>
            <Button variant="ghost" size="icon" aria-label="back" className="text-foreground">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={24} height={24} priority className="h-6 w-6" />
          </Link>
        )}
        
        {/* 页面标题 */}
        {title && (
          <h1 className="text-lg font-semibold text-foreground ml-2">{title}</h1>
        )}
      </div>

      {/* 中间：搜索控件（可选） */}
      {showSearch && (
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="w-full rounded-full bg-card/60 px-10 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm"
            />
          </div>
        </div>
      )}

      {/* 右侧：用户图标或自定义操作 */}
      <div className="flex items-center gap-2">
        {rightAction || (
          <Button variant="ghost" size="icon" aria-label="account" className="text-foreground">
            <UserRound className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
