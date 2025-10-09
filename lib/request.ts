/**
 * Common Request Utility
 * 通用请求工具类
 */

import { API_CONFIG, ApiResponse, ApiRequestParams } from './api';

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
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new RequestError('Request timeout', 408);
      }
      throw new RequestError(error.message, 0);
    }
    
    throw new RequestError('Unknown error occurred', 0);
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
