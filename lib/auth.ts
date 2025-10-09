/**
 * Authentication API Services
 * 认证相关API服务
 */

import { request, RequestError } from './request';
import { 
  RegisterRequest, 
  RegisterResponse, 
  LoginResponse,
  ApiResponse,
  PostSquareRequest, 
  GetHomeListRequest, 
  GetSquareDetailRequest,
  SquareListResponse,
  SquareContent,
  PostCommentRequest,
  PostCommentResponse,
  LoveRequest,
  CollectRequest,
  FollowUserRequest,
  InteractionResponse,
  GetUserInfoRequest,
  UserInfoResponse,
  UploadAvatarRequest,
  UploadAvatarResponse,
  API_CONFIG
} from './api';

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
 * @returns Promise<ApiResponse<LoginResponse>>
 */
export async function loginUser(
  email: string, 
  password: string, 
  language: string = 'en'
): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await request<LoginResponse>('login', {
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
 * @param userInfoData 用户信息查询数据
 * @returns Promise<ApiResponse<UserInfoResponse>>
 */
export async function getUserInfo(
  userInfoData: GetUserInfoRequest
): Promise<ApiResponse<UserInfoResponse>> {
  try {
    const response = await request<UserInfoResponse>('getuserinfo', {
      email: userInfoData.email,
      userId: userInfoData.userId,
      token: userInfoData.token,
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

/**
 * 发布广场内容API
 * @param postData 发布数据
 * @returns Promise<ApiResponse>
 */
export async function postSquareContent(postData: PostSquareRequest): Promise<ApiResponse> {
  try {
    const response = await request('postsquare', {
      userId: postData.userId,
      token: postData.token,
      title: postData.title,
      description: postData.description,
      location: postData.location,
      images: postData.images || '',
      video: postData.video || '',
      website: postData.website || '',
      logo: postData.logo || '',
      intro: postData.intro || '',
      operatingHours: postData.operatingHours || '',
      customerService: postData.customerService || '',
      workingHours: postData.workingHours || '',
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`发布广场内容失败: ${error.message}`);
    }
    throw new Error('发布广场内容过程中发生未知错误');
  }
}

/**
 * 获取广场内容列表API
 * @param listData 列表查询数据
 * @returns Promise<ApiResponse<SquareListResponse>>
 */
export async function getSquareContentList(listData: GetHomeListRequest): Promise<ApiResponse<SquareListResponse>> {
  try {
    const response = await request('gethomelist', {
      userId: listData.userId,
      token: listData.token,
      tab: listData.tab || '',
      page: listData.page || 1,
      limit: listData.limit || 10,
      location: listData.location,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`获取广场内容列表失败: ${error.message}`);
    }
    throw new Error('获取广场内容列表过程中发生未知错误');
  }
}

/**
 * 获取广场内容详情API
 * @param detailData 详情查询数据
 * @returns Promise<ApiResponse<SquareContent>>
 */
export async function getSquareContentDetail(detailData: GetSquareDetailRequest): Promise<ApiResponse<SquareContent>> {
  try {
    const response = await request('gethomelist', {
      userId: detailData.userId,
      token: detailData.token,
      postId: detailData.postId,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`获取广场内容详情失败: ${error.message}`);
    }
    throw new Error('获取广场内容详情过程中发生未知错误');
  }
}

/**
 * 发表评论API
 * @param commentData 评论数据
 * @returns Promise<ApiResponse<PostCommentResponse>>
 */
export async function postComment(commentData: PostCommentRequest): Promise<ApiResponse<PostCommentResponse>> {
  try {
    const response = await request<PostCommentResponse>('postcomments', {
      userId: commentData.userId,
      token: commentData.token,
      productId: commentData.productId,
      parentId: commentData.parentId || '',
      content: commentData.content,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`发表评论失败: ${error.message}`);
    }
    throw new Error('发表评论过程中发生未知错误');
  }
}

/**
 * 点赞/取消点赞API
 * @param loveData 点赞数据
 * @returns Promise<ApiResponse<InteractionResponse>>
 */
export async function toggleLove(loveData: LoveRequest): Promise<ApiResponse<InteractionResponse>> {
  try {
    const response = await request<InteractionResponse>('loveinformation', {
      userId: loveData.userId,
      token: loveData.token,
      productId: loveData.productId,
      isLove: loveData.isLove,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`点赞操作失败: ${error.message}`);
    }
    throw new Error('点赞操作过程中发生未知错误');
  }
}

/**
 * 收藏/取消收藏内容API
 * @param collectData 收藏数据
 * @returns Promise<ApiResponse<InteractionResponse>>
 */
export async function toggleCollect(collectData: CollectRequest): Promise<ApiResponse<InteractionResponse>> {
  try {
    const response = await request<InteractionResponse>('collectinformation', {
      userId: collectData.userId,
      token: collectData.token,
      productId: collectData.productId,
      isCollect: collectData.isCollect,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`收藏操作失败: ${error.message}`);
    }
    throw new Error('收藏操作过程中发生未知错误');
  }
}

/**
 * 关注/取消关注用户API
 * @param followData 关注数据
 * @returns Promise<ApiResponse<InteractionResponse>>
 */
export async function toggleFollowUser(followData: FollowUserRequest): Promise<ApiResponse<InteractionResponse>> {
  try {
    const response = await request<InteractionResponse>('collectuser', {
      userId: followData.userId,
      token: followData.token,
      authorId: followData.authorId,
      isCollect: followData.isCollect,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`关注操作失败: ${error.message}`);
    }
    throw new Error('关注操作过程中发生未知错误');
  }
}

/**
 * 上传头像API
 * @param file 头像文件
 * @returns Promise<ApiResponse<UploadAvatarResponse>>
 */
export async function uploadAvatar(file: File): Promise<ApiResponse<UploadAvatarResponse>> {
  try {
    // 将文件转换为base64
    const base64String = await fileToBase64(file);
    
    // 使用与其他API相同的请求模式，使用集中配置的端点
    const response = await uploadRequest<UploadAvatarResponse>(API_CONFIG.ENDPOINTS.UPLOAD_IMG, base64String);
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`头像上传失败: ${error.message}`);
    }
    throw new Error('头像上传过程中发生未知错误');
  }
}

/**
 * 将文件转换为base64字符串
 * @param file 文件对象
 * @returns Promise<string> base64字符串
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 文件上传请求函数 - 使用与其他API相同的模式
 * @param action 操作名称
 * @param base64Data base64数据
 * @returns Promise<ApiResponse<T>>
 */
async function uploadRequest<T = any>(
  action: string,
  base64Data: string
): Promise<ApiResponse<T>> {
  try {
    // 构建上传URL，使用集中配置
    const url = `${API_CONFIG.UPLOAD_URL}?action=${action}`;
    
    // 创建请求体数据
    const formData = new FormData();
    formData.append('avatar', base64Data);
    
    // 创建超时控制器
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    // 发起请求
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
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
        data.message || data.error || 'Upload failed',
        response.status,
        data.code
      );
    }
    
    return {
      success: true,
      data: data.data || data,
      message: data.message,
      code: data.code,
    };
    
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
