/**
 * Custom API Hooks
 * 自定义API钩子
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUserParams } from '../../contexts/AuthContext';

// 通用API状态类型
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// 用户参数类型
export interface UserParams {
  userId: string;
  token: string;
  email?: string;
}

// 通用API Hook
export function useApi<T>(
  apiCall: (params: UserParams) => Promise<T>,
  fallbackData?: T
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const searchParams = useSearchParams();
  const { userParams: storedUserParams } = useUserParams();

  // 获取用户参数
  const getUserParams = useCallback((): UserParams | null => {
    // 优先从存储的认证信息获取
    if (storedUserParams) {
      return storedUserParams;
    }
    
    // 如果存储中没有，尝试从URL参数获取
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (userId && token) {
      return { userId, token, email: email || undefined };
    }
    return null;
  }, [searchParams, storedUserParams]);

  // 执行API调用
  const execute = useCallback(async (params?: UserParams) => {
    const userParams = params || getUserParams();
    
    if (!userParams) {
      if (fallbackData) {
        setState({
          data: fallbackData,
          loading: false,
          error: null,
          success: true,
        });
      }
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall(userParams);
      setState({
        data: result,
        loading: false,
        error: null,
        success: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '请求失败';
      setState({
        data: fallbackData || null,
        loading: false,
        error: errorMessage,
        success: false,
      });
    }
  }, [apiCall, getUserParams, fallbackData]);

  // 重置状态
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
    userParams: getUserParams(),
  };
}

// 专门用于广场内容的Hook
export function useSquareContent(postId?: string) {
  const [userParams, setUserParams] = useState<UserParams | null>(null);

  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get('userId');
    const token = new URLSearchParams(window.location.search).get('token');
    
    if (userId && token) {
      setUserParams({ userId, token });
    }
  }, []);

  return { userParams };
}
