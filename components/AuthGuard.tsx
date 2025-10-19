"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from './ui/LoadingStates';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// 不需要登录的页面路径
const PUBLIC_PATHS = [
  '/',
  '/square',
  '/login',
  '/register',
  '/forgot-password',
  '/change-password',
  '/personalization',
  '/about',
  '/privacy',
];

// 检查路径是否为公开路径
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  });
}

// 检查是否会导致循环重定向
function wouldCauseRedirectLoop(pathname: string, search: string): boolean {
  console.log('Checking for redirect loop:', { pathname, search });
  
  // 如果当前路径是登录页面，不要重定向
  if (pathname.startsWith('/login')) {
    console.log('Current path is login page, preventing redirect');
    return true;
  }
  
  // 检查重定向参数是否指向登录页面
  const urlParams = new URLSearchParams(search);
  const redirectParam = urlParams.get('redirect');
  
  if (redirectParam) {
    console.log('Found redirect parameter:', redirectParam);
    
    try {
      // 解码重定向参数
      const decodedRedirect = decodeURIComponent(redirectParam);
      console.log('Decoded redirect:', decodedRedirect);
      
      // 检查是否包含登录页面路径
      if (decodedRedirect.includes('/login')) {
        console.log('Redirect contains /login, preventing loop');
        return true;
      }
      
      // 检查是否有嵌套的重定向参数
      if (decodedRedirect.includes('redirect=')) {
        console.log('Redirect contains nested redirect parameter, preventing loop');
        return true;
      }
      
      // 检查是否有查询参数（可能包含嵌套重定向）
      if (decodedRedirect.includes('?')) {
        console.log('Redirect contains query parameters, preventing loop');
        return true;
      }
      
      // 检查是否包含编码的重定向参数
      if (decodedRedirect.includes('%2Flogin') || decodedRedirect.includes('%252Flogin')) {
        console.log('Redirect contains encoded login path, preventing loop');
        return true;
      }
    } catch (error) {
      // 如果解码失败，也认为可能是循环重定向
      console.warn('Failed to decode redirect parameter:', redirectParam, error);
      return true;
    }
  }
  
  console.log('No redirect loop detected');
  return false;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, authInfo } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化检查
  useEffect(() => {
    // 给认证上下文一些时间来初始化
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 等待初始化完成
    if (!isInitialized) {
      console.log('AuthGuard: Waiting for initialization...');
      return;
    }

    console.log('AuthGuard useEffect triggered:', {
      pathname,
      search: window.location.search,
      isAuthenticated,
      hasAuthInfo: !!authInfo,
      isPublic: isPublicPath(pathname),
      isInitialized
    });

    // 如果是公开路径，不需要检查认证状态
    if (isPublicPath(pathname)) {
      console.log('Public path, no auth check needed');
      return;
    }

    // 如果未认证，跳转到登录页
    if (!isAuthenticated || !authInfo?.userId || !authInfo?.token) {
      console.log('User not authenticated, checking for redirect loop');
      
      // 检查是否会导致循环重定向
      if (wouldCauseRedirectLoop(pathname, window.location.search)) {
        console.warn('Prevented redirect loop to login page');
        return;
      }
      
      // 额外检查：如果当前已经在登录页面，不要重定向
      if (pathname === '/login') {
        console.warn('Already on login page, preventing redirect');
        return;
      }
      
      // 保存当前路径，登录后可以跳转回来
      // 只使用路径名，不包含查询参数，避免重复编码
      const cleanPath = pathname;
      
      // 检查当前URL是否已经有redirect参数，如果有则使用默认路径
      const currentSearch = window.location.search;
      const hasExistingRedirect = currentSearch.includes('redirect=');
      
      let loginUrl;
      if (hasExistingRedirect) {
        // 如果已经有redirect参数，使用默认路径避免嵌套
        loginUrl = '/login';
        console.log('Existing redirect detected, using default login URL');
      } else {
        loginUrl = `/login?redirect=${encodeURIComponent(cleanPath)}`;
        console.log('Redirecting to login:', loginUrl);
      }
      
      router.push(loginUrl);
    } else {
      console.log('User is authenticated, allowing access');
    }
  }, [isAuthenticated, authInfo, pathname, router, isInitialized]);

  // 如果是公开路径，直接渲染子组件
  if (isPublicPath(pathname)) {
    return <>{children}</>;
  }

  // 如果未认证，显示加载状态或自定义fallback
  if (!isAuthenticated || !authInfo?.userId || !authInfo?.token) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <LoadingSpinner size="lg" text={t('common.verifying')} />
        </div>
      </div>
    );
  }

  // 已认证，渲染子组件
  return <>{children}</>;
}

// 高阶组件版本，用于包装页面组件
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard fallback={fallback}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
