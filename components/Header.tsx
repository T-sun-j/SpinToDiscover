'use client';

import { Button } from './ui/button';
import { UserRound, Search } from 'lucide-react';
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
    <header className={`flex items-center justify-between py-3 w-full  ${className}`}>
      {/* 左侧：Logo */}
      <div className="flex items-center gap-3">
        <Link href={logoLink} className="flex items-center gap-2 ml-2">
          <Image
            src={transparent ? "/img/logo-1.png" : "/img/logo-2.png"}
            alt="logo"
            width={42}
            height={14}
            priority
            className="h-14 w-42"
          />
        </Link>  
      </div>

      {/* 右侧：搜索和用户图标 */}
      <div className="flex items-center gap-2">
        {showSearch ? (
          <Link href="/search" aria-label="search">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Search className={`h-7 w-7 ${transparent ? 'text-white' : 'text-[#11295b]'}`} />
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
            <UserRound className={`h-7 w-7 ${transparent ? 'text-white' : 'text-[#11295b]'}`} />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
