/**
 * Authentication API Services
 * 认证相关API服务
 */

import { request, RequestError } from './request';
import { RegisterRequest, RegisterResponse, ApiResponse } from './api';

/**
 * 用户注册API
 * @param registerData 注册数据
 * @returns Promise<ApiResponse<RegisterResponse>>
 */
export async function registerUser(registerData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  try {
    const response = await request<RegisterResponse>('register', {
      email: registerData.email,
      password: registerData.password,
      language: registerData.language,
      acceptTerms: registerData.acceptTerms,
      location: registerData.location,
    });
    
    return response;
  } catch (error) {
    // 处理注册错误
    if (error instanceof RequestError) {
      throw new Error(`注册失败: ${error.message}`);
    }
    throw new Error('注册过程中发生未知错误');
  }
}

/**
 * 用户登录API
 * @param email 邮箱
 * @param password 密码
 * @param language 语言设置
 * @returns Promise<ApiResponse>
 */
export async function loginUser(
  email: string, 
  password: string, 
  language: string = 'en'
): Promise<ApiResponse> {
  try {
    const response = await request('login', {
      email,
      password,
      language,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`登录失败: ${error.message}`);
    }
    throw new Error('登录过程中发生未知错误');
  }
}

/**
 * 忘记密码API
 * @param email 邮箱
 * @returns Promise<ApiResponse>
 */
export async function forgotPassword(email: string): Promise<ApiResponse> {
  try {
    const response = await request('forgot-password', {
      email,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`发送重置邮件失败: ${error.message}`);
    }
    throw new Error('发送重置邮件过程中发生未知错误');
  }
}

/**
 * 重置密码API
 * @param email 邮箱
 * @param newPassword 新密码
 * @param userId 用户ID
 * @param token 重置令牌
 * @returns Promise<ApiResponse>
 */
export async function resetPassword(
  email: string,
  newPassword: string,
  userId: string,
  token: string
): Promise<ApiResponse> {
  try {
    const response = await request('reset-password', {
      email,
      newPassword,
      userId,
      token,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`重置密码失败: ${error.message}`);
    }
    throw new Error('重置密码过程中发生未知错误');
  }
}

/**
 * 获取用户信息API
 * @param email 邮箱
 * @param userId 用户ID
 * @param token 用户令牌
 * @returns Promise<ApiResponse>
 */
export async function getUserInfo(
  email: string,
  userId: string,
  token: string
): Promise<ApiResponse> {
  try {
    const response = await request('getuserinfo', {
      email,
      userId,
      token,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`获取用户信息失败: ${error.message}`);
    }
    throw new Error('获取用户信息过程中发生未知错误');
  }
}

/**
 * 更新用户信息API
 * @param email 邮箱
 * @param userId 用户ID
 * @param token 用户令牌
 * @param nickname 昵称
 * @param avatar 头像
 * @param language 语言
 * @returns Promise<ApiResponse>
 */
export async function updateUserInfo(
  email: string,
  userId: string,
  token: string,
  nickname: string,
  avatar?: string,
  language: string = 'en'
): Promise<ApiResponse> {
  try {
    const response = await request('userprofile', {
      email,
      userId,
      token,
      nickname,
      avatar: avatar || '',
      language,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`更新用户信息失败: ${error.message}`);
    }
    throw new Error('更新用户信息过程中发生未知错误');
  }
}

/**
 * 验证邮箱是否已存在 (预留接口)
 * @param email 邮箱
 * @returns Promise<boolean>
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const response = await request('checkEmail', { email });
    return response.data?.exists || false;
  } catch (error) {
    // 如果检查失败，假设邮箱不存在，允许注册
    return false;
  }
}
