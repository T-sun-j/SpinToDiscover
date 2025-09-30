"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

// 用户认证信息类型
export interface AuthInfo {
  userId: string;
  token: string;
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
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authInfo, setAuthInfoState] = useState<AuthInfo | null>(null);
  const searchParams = useSearchParams();

  // 从URL参数中获取认证信息
  useEffect(() => {
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');
    
    if (userId && token) {
      setAuthInfoState({ userId, token });
    }
  }, [searchParams]);

  // 设置认证信息
  const setAuthInfo = (newAuthInfo: AuthInfo | null) => {
    setAuthInfoState(newAuthInfo);
  };

  // 清除认证信息
  const clearAuthInfo = () => {
    setAuthInfoState(null);
  };

  // 获取用户ID
  const getUserId = () => {
    return authInfo?.userId || null;
  };

  // 获取令牌
  const getToken = () => {
    return authInfo?.token || null;
  };

  // 是否已认证
  const isAuthenticated = !!(authInfo?.userId && authInfo?.token);

  const value: AuthContextType = {
    authInfo,
    isAuthenticated,
    setAuthInfo,
    clearAuthInfo,
    getUserId,
    getToken,
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
      token: authInfo.token
    } : null,
    isAuthenticated
  };
}
