/**
 * Global API Configuration
 * 全局API配置
 */

// API基础配置
export const API_CONFIG = {
  // 基础URL
  BASE_URL: 'http://www.discover.com/homeapi.php',
  
  // 请求超时时间 (毫秒)
  TIMEOUT: 10000,
  
  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
  },
  
  // API端点配置
  ENDPOINTS: {
    REGISTER: 'register',
    LOGIN: 'login',
    // 可以在这里添加更多端点
  }
} as const;

// API响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

// API请求参数类型
export interface ApiRequestParams {
  [key: string]: string | number | boolean;
}

// 注册请求参数类型
export interface RegisterRequest {
  email: string;
  password: string;
  language: string;
  acceptTerms: boolean;
  location: string;
}

// 注册响应类型
export interface RegisterResponse {
  userId?: string;
  token?: string;
  message?: string;
}
