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
  className?: string;
  transparent?: boolean;
  logoLink?: string;
}

export function Header({
  showSearch = false,
  showLanguage = false,
  showUser = false,
  className = '',
  transparent = false,
  logoLink = '/',
}: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className={`flex items-center justify-between py-3 w-full  ${className}`}>
      {/* 左侧：Logo 和语言切换 */}
      <div className="flex items-center gap-3">
        <Link href={logoLink} className="flex items-center gap-2 ml-4">
          <Image
            src={transparent ? "/img/logo-1.png" : "/img/logo-2.png"}
            alt="logo"
            width={84}
            height={48}
            priority
            className="h-14 w-36"
          />
        </Link>  
        {showLanguage ? <LanguageToggle /> : null}
      </div>

      {/* 右侧：搜索和用户图标 */}
      <div className="flex items-center gap-2">
        {showSearch ? (
          <Link href="/search" aria-label="search">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
        ) : null}

        {showUser ? (
          <Link href="/login" aria-label="account">
            <Button variant="ghost" size="icon" className="text-foreground">
              <UserRound className="h-5 w-5" />
            </Button>
          </Link>
        ) : null}
      </div>
    </header>
  );
}
