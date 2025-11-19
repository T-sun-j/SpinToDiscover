'use client';

import { Button } from './ui/button';
import { UserRound } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  showSearch?: boolean;
  showUser?: boolean;
  className?: string;
  transparent?: boolean;
  logoLink?: string;
  userLink?: string;
}

export function Header({
  showSearch = false,
  showUser = false,
  className = '',
  transparent = false,
  logoLink = '/',
  userLink = '/login',
}: HeaderProps) {
  const router = useRouter();
  const { authInfo } = useAuth();

  const handleUserClick = () => {
    // 检查本地存储是否有 token
    if (authInfo?.token && authInfo?.userId) {
      // 有 token 和 userId，跳转到当前用户的个人页面
      router.push(`/personal-center`);
    } else {
      // 没有 token，跳转到登录页面
      router.push('/login');
    }
  };

  return (
    <header className={`flex items-center justify-between pt-3 px-1 w-full  ${className}`}>
      {/* 左侧：Logo */}
      <div className="flex items-center gap-4">
        <Link href={logoLink} className="flex items-center gap-2 ml-2">
          <Image
            src={transparent ? "/img/logo-1.png" : "/img/logo-2.png"}
            alt="logo"
            width={52}
            height={22}
            priority
            className="h-16 w-auto"
          />
        </Link>  
      </div>

      {/* 右侧：搜索和用户图标 */}
      <div className="flex items-center">
        {showSearch ? (
          <Link href="/search" aria-label="search">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Image
                src="/img/search.png"
                alt="search"
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </Button>
          </Link>
        ) : null}

        {showUser ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground"
            onClick={handleUserClick}
            aria-label="account"
          >
            <Image
                src="/img/user.png"
                alt="search"
                width={28}
                height={28}
                className="h-7 w-7"
              />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
