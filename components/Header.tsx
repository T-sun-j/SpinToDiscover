'use client';

import { Button } from './ui/button';
import { UserRound, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  showSearch?: boolean;
  showLanguage?: boolean;
  showUser?: boolean;
  backUrl?: string;
  title?: string;
  rightAction?: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

export function Header({
  showSearch = false,
  showLanguage = false,
  showUser = false,
  backUrl = '/',
  title,
  rightAction,
  className = '',
  transparent = false
}: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className={`flex items-center justify-between py-3 w-full  ${className}`}>
      {/* 左侧：Logo 和语言切换 */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 ml-4">
          <Image
            src={transparent ? "/img/logo-1.png" : "/img/logo-2.png"}
            alt="logo"
            width={72}
            height={48}
            priority
            className="h-14 w-36"
          />
        </Link>
        {showLanguage ? <LanguageToggle /> : null}
      </div>

      {/* 右侧：搜索和用户图标 */}
      <div className="flex items-center gap-2">
        {showSearch ? <Button variant="ghost" size="icon" aria-label="search" className="text-foreground">
          <Search className="h-5 w-5" />
        </Button> : null}

        {showUser ? (
          <Button variant="ghost" size="icon" aria-label="account" className="text-foreground">
            <UserRound className="h-5 w-5" />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
