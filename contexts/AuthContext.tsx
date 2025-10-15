"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

// 用户认证信息类型
export interface AuthInfo {
  userId: string;
  token: string;
  email: string;
}

// 认证上下文类型
interface AuthContextType {
  authInfo: AuthInfo | null;
  isAuthenticated: boolean;
  setAuthInfo: (authInfo: AuthInfo | null) => void;
  clearAuthInfo: () => void;
  // 便捷方法
  getUserId: () => string | null;
  getToken: () => string | null;
  getEmail: () => string | null;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
interface AuthProviderProps {
  children: ReactNode;
}

// 存储键名常量
const AUTH_STORAGE_KEY = 'auth_info';
const AUTH_COOKIE_KEY = 'auth_info';

// Cookie工具函数
function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// 从存储中获取认证信息
function getStoredAuthInfo(): AuthInfo | null {
  try {
    // 优先从localStorage获取
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // 如果localStorage没有，尝试从cookie获取
    const cookieData = getCookie(AUTH_COOKIE_KEY);
    if (cookieData) {
      return JSON.parse(cookieData);
    }
    
    return null;
  } catch (error) {
    console.error('Error reading stored auth info:', error);
    return null;
  }
}

// 存储认证信息
function storeAuthInfo(authInfo: AuthInfo | null) {
  try {
    if (authInfo) {
      const authData = JSON.stringify(authInfo);
      // 存储到localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, authData);
      // 存储到cookie（30天过期）
      setCookie(AUTH_COOKIE_KEY, authData, 30);
    } else {
      // 清除存储
      localStorage.removeItem(AUTH_STORAGE_KEY);
      deleteCookie(AUTH_COOKIE_KEY);
    }
  } catch (error) {
    console.error('Error storing auth info:', error);
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authInfo, setAuthInfoState] = useState<AuthInfo | null>(null);
  const searchParams = useSearchParams();

  // 初始化时从存储中获取认证信息
  useEffect(() => {
    console.log('AuthContext: Initializing auth state...');
    
    // 首先尝试从URL参数获取
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (userId && token && email) {
      console.log('AuthContext: Found auth info in URL parameters');
      const urlAuthInfo = { userId, token, email };
      setAuthInfoState(urlAuthInfo);
      storeAuthInfo(urlAuthInfo);
    } else {
      // 如果URL没有参数，从存储中获取
      console.log('AuthContext: Checking local storage for auth info...');
      const storedAuthInfo = getStoredAuthInfo();
      if (storedAuthInfo) {
        console.log('AuthContext: Found stored auth info:', { 
          userId: storedAuthInfo.userId, 
          hasToken: !!storedAuthInfo.token,
          email: storedAuthInfo.email 
        });
        setAuthInfoState(storedAuthInfo);
      } else {
        console.log('AuthContext: No stored auth info found');
      }
    }
  }, [searchParams]);

  // 设置认证信息
  const setAuthInfo = (newAuthInfo: AuthInfo | null) => {
    setAuthInfoState(newAuthInfo);
    storeAuthInfo(newAuthInfo);
  };

  // 清除认证信息
  const clearAuthInfo = () => {
    setAuthInfoState(null);
    storeAuthInfo(null);
  };

  // 获取用户ID
  const getUserId = () => {
    return authInfo?.userId || null;
  };

  // 获取令牌
  const getToken = () => {
    return authInfo?.token || null;
  };

  // 获取邮箱
  const getEmail = () => {
    return authInfo?.email || null;
  };

  // 是否已认证
  const isAuthenticated = !!(authInfo?.userId && authInfo?.token && authInfo?.email);

  const value: AuthContextType = {
    authInfo,
    isAuthenticated,
    setAuthInfo,
    clearAuthInfo,
    getUserId,
    getToken,
    getEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 使用认证上下文的Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 便捷Hook：获取用户参数对象
export function useUserParams() {
  const { authInfo, isAuthenticated } = useAuth();
  
  return {
    userParams: authInfo ? {
      userId: authInfo.userId,
      token: authInfo.token,
      email: authInfo.email
    } : null,
    isAuthenticated
  };
}
