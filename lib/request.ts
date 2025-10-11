/**
 * Common Request Utility
 * 通用请求工具类
 */

import { API_CONFIG, ApiResponse, ApiRequestParams } from './api';

// 检查是否有有效的认证信息
function hasValidAuth(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authInfo = localStorage.getItem('auth_info');
    if (!authInfo) return false;
    
    const parsed = JSON.parse(authInfo);
    return !!(parsed.userId && parsed.token && parsed.email);
  } catch (error) {
    console.warn('Failed to parse auth info:', error);
    return false;
  }
}

// 认证错误处理函数
function handleAuthError(error: any) {
  // 检查是否是认证相关错误
  if (error.status === 401 || error.code === 401 || 
      error.message?.includes('token') || 
      error.message?.includes('unauthorized') ||
      error.message?.includes('authentication') ||
      error.message?.includes('Token') ||
      error.message?.includes('Unauthorized')) {
    
    console.log('Authentication error detected:', error);
    
    // 清除本地存储的认证信息
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_info');
      document.cookie = 'auth_info=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    }
    
    // 跳转到登录页，避免循环重定向
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      
      // 检查是否已经在登录页面或已经有redirect参数
      if (currentPath.startsWith('/login') || currentSearch.includes('redirect=')) {
        console.log('Already on login page or has redirect, using default login URL');
        window.location.href = '/login';
      } else {
        // 只使用路径名，避免查询参数导致的循环
        const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        console.log('Redirecting to login with clean path:', loginUrl);
        window.location.href = loginUrl;
      }
    }
  }
}

// 请求错误类
export class RequestError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: number
  ) {
    super(message);
    this.name = 'RequestError';
  }
}

// 将对象转换为URL查询参数
function objectToQueryString(params: ApiRequestParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// 通用请求函数
export async function request<T = any>(
  action: string,
  params: ApiRequestParams = {},
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // 对于需要认证的请求，检查是否有有效的token
    const requiresAuth = ['getuserinfo', 'postsquare', 'gethomelist', 'postcomments', 
                         'loveinformation', 'collectinformation', 'collectuser', 'userprofile'];
    
    if (requiresAuth.includes(action) && !hasValidAuth()) {
      console.log('Request requires authentication but no valid token found');
      handleAuthError({ status: 401, message: 'No valid authentication token' });
      throw new RequestError('Authentication required', 401);
    }
    
    // 构建完整URL
    const queryString = objectToQueryString({ action, ...params });
    const url = `${API_CONFIG.BASE_URL}?${queryString}`;
    
    // 合并请求选项
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      },
      ...options,
    };
    
    // 创建超时控制器
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    // 发起请求
    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    });
    
    // 清除超时定时器
    clearTimeout(timeoutId);
    
    // 检查响应状态
    if (!response.ok) {
      throw new RequestError(
        `HTTP Error: ${response.status} ${response.statusText}`,
        response.status
      );
    }
    
    // 解析响应数据
    const data = await response.json();
    
    // 检查业务逻辑错误
    if (data.error || (data.code !== undefined && data.code !== 0) || data.success === false) {
      throw new RequestError(
        data.message || data.error || 'Unknown error',
        response.status,
        data.code
      );
    }
    
    return data;
    
  } catch (error) {
    // 处理不同类型的错误
    if (error instanceof RequestError) {
      // 检查认证错误并处理
      handleAuthError(error);
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new RequestError('Request timeout', 408);
      }
      const requestError = new RequestError(error.message, 0);
      handleAuthError(requestError);
      throw requestError;
    }
    
    const unknownError = new RequestError('Unknown error occurred', 0);
    handleAuthError(unknownError);
    throw unknownError;
  }
}

// POST请求函数
export async function postRequest<T = any>(
  action: string,
  params: ApiRequestParams = {},
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const queryString = objectToQueryString({ action, ...params });
  
  return request<T>(action, {}, {
    method: 'POST',
    body: queryString,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    ...options,
  });
}

// 带重试机制的请求函数
export async function requestWithRetry<T = any>(
  action: string,
  params: ApiRequestParams = {},
  options: RequestInit = {},
  maxRetries: number = 3
): Promise<ApiResponse<T>> {
  let lastError: RequestError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await request<T>(action, params, options);
    } catch (error) {
      lastError = error as RequestError;
      
      // 如果是最后一次尝试，直接抛出错误
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // 如果是客户端错误(4xx)，不进行重试
      if (lastError.status && lastError.status >= 400 && lastError.status < 500) {
        throw lastError;
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw lastError!;
}
