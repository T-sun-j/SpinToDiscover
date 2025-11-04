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
  GetOtherUserInfoRequest,
  UserInfoResponse,
  UploadAvatarRequest,
  UploadAvatarResponse,
  UploadVideoResponse,
  UpdateUserBrandRequest,
  UpdateUserBrandResponse,
  GetFollowedListRequest,
  GetFollowersListRequest,
  FollowListResponse,
  GetBrowsingListRequest,
  BrowsingListResponse,
  GetCollectListRequest,
  CollectListResponse,
  DeleteArticleRequest,
  HideArticleRequest,
  SearchRequest,
  SearchResponse,
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
 * 获取其他用户信息API
 * @param otherUserData 其他用户信息查询数据
 * @returns Promise<ApiResponse<UserInfoResponse>>
 */
export async function getOtherUserInfo(
  otherUserData: GetOtherUserInfoRequest
): Promise<ApiResponse<UserInfoResponse>> {
  try {
    const response = await request<UserInfoResponse>('getothersmassage', {
      userId: otherUserData.userId,
      token: otherUserData.token,
      otherId: otherUserData.otherId,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`获取其他用户信息失败: ${error.message}`);
    }
    throw new Error('获取其他用户信息过程中发生未知错误');
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
 * 更新用户品牌信息API
 * @param brandData 品牌信息数据
 * @returns Promise<ApiResponse<UpdateUserBrandResponse>>
 */
export async function updateUserBrand(
  brandData: UpdateUserBrandRequest
): Promise<ApiResponse<UpdateUserBrandResponse>> {
  try {
    const response = await request<UpdateUserBrandResponse>('updateuserbrand', {
      email: brandData.email,
      userId: brandData.userId,
      token: brandData.token,
      brand: brandData.brand || '',
      brief: brandData.brief || '',
      logo: brandData.logo || '',
      officialsite: brandData.officialsite || '',
      tel: brandData.tel || '',
      address: brandData.address || '',
      location: brandData.location || '',
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`更新品牌信息失败: ${error.message}`);
    }
    throw new Error('更新品牌信息过程中发生未知错误');
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
    // 推荐页面不需要传递 userId 和 token
    const isRecommendTab = listData.tab === 'recommend';

    const requestParams: any = {
      tab: listData.tab || '',
      page: listData.page || 1,
      limit: listData.limit || 10,
      location: listData.location,
    };

    if (!isRecommendTab) {
      requestParams.userId = listData.userId;
      requestParams.token = listData.token;
    }

    const response = await request('gethomelist', requestParams);
    
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
    const response = await request<SquareContent>('getdetail', {
      userId: detailData.userId,
      token: detailData.token,
      postId: detailData.postId,
    });
    
    // 处理评论数据：comments在data外面（顶层），需要合并到data中
    if (response.success && response.data) {
      // 优先从顶层response获取comments（因为comments在data外面）
      if (Array.isArray((response as any).comments)) {
        response.data.comments = (response as any).comments;
      } 
      // 如果顶层没有，检查data中是否有comments
      else if (Array.isArray(response.data.comments)) {
        // comments已经在data中，无需处理
      } 
      // 如果都没有，初始化为空数组
      else {
        response.data.comments = [];
      }
    }
    
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
 * 上传图片API
 * @param file 图片文件
 * @returns Promise<ApiResponse<UploadAvatarResponse>>
 */
export async function uploadAvatar(file: File): Promise<ApiResponse<UploadAvatarResponse>> {
  try {
    // 检查文件大小（限制为10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`图片文件过大，请选择小于10MB的文件。当前文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }
    
    console.log(`Image file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Image file type: ${file.type}`);
    
    // 将文件转换为base64
    const base64String = await fileToBase64(file);
    
    // 构建图片上传URL - 根据API文档使用uploadimg
    const url = `${API_CONFIG.UPLOAD_URL}?action=uploadimg`;
    
    console.log(`Image upload URL: ${url}`);
    console.log(`Base64 data length: ${base64String.length}`);
    
    // 创建请求体数据 - 使用FormData避免URL过长
    const formData = new FormData();
    formData.append('avatar', base64String);
    
    // 创建超时控制器
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
    
    // 发起POST请求
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
    
    // 获取响应文本
    const responseText = await response.text();
    
    console.log(`Image upload response status: ${response.status}`);
    console.log(`Image upload response text: ${responseText}`);
    
    // 检查响应是否为空
    if (!responseText.trim()) {
      throw new RequestError('Empty response from image upload server', response.status);
    }
    
    // 尝试解析JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Successfully parsed image upload JSON response:', data);
    } catch (jsonError) {
      console.log('Failed to parse JSON, treating as text response');
      // 如果不是JSON格式，作为纯文本处理
      data = { img: responseText.trim() };
    }
    
    // 检查业务逻辑错误
    if (data.error || (data.code !== undefined && data.code !== 0) || data.success === false) {
      throw new RequestError(
        data.message || data.error || 'Image upload failed',
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
    console.error('Image upload error:', error);
    if (error instanceof RequestError) {
      throw new Error(`图片上传失败: ${error.message}`);
    }
    throw new Error('图片上传过程中发生未知错误');
  }
}

/**
 * 上传视频API
 * @param file 视频文件
 * @returns Promise<ApiResponse<UploadVideoResponse>>
 */
export async function uploadVideo(file: File): Promise<ApiResponse<UploadVideoResponse>> {
  try {
    // 检查文件大小（限制为200MB）
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      throw new Error(`视频文件过大，请选择小于200MB的文件。当前文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }
    
    console.log(`Video file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Video file type: ${file.type}`);
    
    // 构建视频上传URL - 根据HTML代码使用videoyasuo.php
    const baseUrl = API_CONFIG.UPLOAD_URL.replace('/upimg.php', '/videoyasuo.php');
    const url = `${baseUrl}?action=pushvideo`;
    
    console.log(`Video upload URL: ${url}`);
    
    // 创建请求体数据 - 使用multipart/form-data格式
    const formData = new FormData();
    formData.append('video', file);
    
    // 创建超时控制器 - 视频上传需要更长时间
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5分钟超时
    
    // 发起POST请求 - 使用multipart/form-data
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      // 不设置Content-Type，让浏览器自动设置multipart/form-data
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
    
    // 获取响应文本
    const responseText = await response.text();
    
    console.log(`Video upload response status: ${response.status}`);
    console.log(`Video upload response text length: ${responseText.length}`);
    console.log(`Video upload response text: ${responseText}`);

    // 检查响应是否为空
    if (!responseText.trim()) {
      console.log('Empty response from video upload server, treating as success');
      // 空响应可能表示上传成功，返回默认成功响应
      return {
        success: true,
        data: { url: 'upload_success', code: 0, msg: 'ok' } as UploadVideoResponse,
        message: 'Video uploaded successfully',
        code: 0,
      };
    }
    
    // 尝试解析JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Successfully parsed video upload JSON response:', data);
    } catch (jsonError) {
      console.log('Failed to parse JSON, treating as text response');
      // 如果不是JSON格式，作为纯文本处理
      data = { img: responseText.trim() };
    }
    
    // 检查业务逻辑错误
    if (data.error || (data.code !== undefined && data.code !== 0) || data.success === false) {
      throw new RequestError(
        data.message || data.error || 'Video upload failed',
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
    if (error instanceof RequestError) {
      throw new Error(`视频上传失败: ${error.message}`);
    }
    throw new Error('视频上传过程中发生未知错误');
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
    // 根据action类型使用不同的字段名
    const fieldName = action === 'pushvideo' ? 'video' : 'avatar';
    formData.append(fieldName, base64Data);
    
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
    
    // 获取响应文本
    const responseText = await response.text();
    
    // 检查响应是否为空
    if (!responseText.trim()) {
      throw new RequestError('Empty response from server', response.status);
    }
    
    // 尝试解析JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      
      // 如果不是JSON格式，检查是否是纯文本响应
      if (responseText.trim()) {
        // 如果响应是纯文本，可能是文件路径或URL
        
        return {
          success: true,
          data: { img: responseText.trim() } as T,
          message: 'Upload successful',
          code: 0,
        };
      } else {
        throw new RequestError('Invalid response format from server', response.status);
      }
    }
    
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
      // 检查是否是JSON解析错误
      if (error.message.includes('JSON') || error.message.includes('json')) {
        throw new RequestError(`Server response parsing error: ${error.message}`, 0);
      }
      throw new RequestError(error.message, 0);
    }
    
    throw new RequestError('Unknown error occurred', 0);
  }
}

/**
 * 获取我关注的用户列表API
 * @param params 关注列表查询参数
 * @returns Promise<ApiResponse<FollowListResponse>>
 */
export async function getFollowedList(params: GetFollowedListRequest): Promise<ApiResponse<FollowListResponse>> {
  try {
    const response = await request<FollowListResponse>('collectuserlist', {
      userId: params.userId,
      token: params.token,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`获取关注列表失败: ${error.message}`);
    }
    throw new Error('获取关注列表过程中发生未知错误');
  }
}

/**
 * 获取我的粉丝列表API
 * @param params 粉丝列表查询参数
 * @returns Promise<ApiResponse<FollowListResponse>>
 */
export async function getFollowersList(params: GetFollowersListRequest): Promise<ApiResponse<FollowListResponse>> {
  try {
    const response = await request<FollowListResponse>('collectmylist', {
      userId: params.userId,
      token: params.token,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`获取粉丝列表失败: ${error.message}`);
    }
    throw new Error('获取粉丝列表过程中发生未知错误');
  }
}

/**
 * 获取浏览记录列表API
 * @param params 浏览记录查询参数
 * @returns Promise<ApiResponse<BrowsingListResponse>>
 */
export async function getBrowsingList(params: GetBrowsingListRequest): Promise<ApiResponse<BrowsingListResponse>> {
  try {
    const response = await request<BrowsingListResponse>('getbrowsinglist', {
      userId: params.userId,
      token: params.token,
      page: params.page || 1,
      limit: params.limit || 10,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`获取浏览记录失败: ${error.message}`);
    }
    throw new Error('获取浏览记录过程中发生未知错误');
  }
}

/**
 * 获取收藏列表API
 * @param params 收藏列表查询参数
 * @returns Promise<ApiResponse<CollectListResponse>>
 */
export async function getCollectList(params: GetCollectListRequest): Promise<ApiResponse<CollectListResponse>> {
  try {
    const response = await request<CollectListResponse>('getcollectlist', {
      userId: params.userId,
      token: params.token,
      page: params.page || 1,
      limit: params.limit || 10,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`获取收藏列表失败: ${error.message}`);
    }
    throw new Error('获取收藏列表过程中发生未知错误');
  }
}

/**
 * 删除作品API
 * @param params 删除作品参数
 * @returns Promise<ApiResponse>
 */
export async function deleteArticle(params: DeleteArticleRequest): Promise<ApiResponse> {
  try {
    const response = await request('userArticleDel', {
      userId: params.userId,
      token: params.token,
      id: params.id,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`删除作品失败: ${error.message}`);
    }
    throw new Error('删除作品过程中发生未知错误');
  }
}

/**
 * 隐藏/显示作品API
 * @param params 隐藏作品参数
 * @returns Promise<ApiResponse>
 */
export async function hideArticle(params: HideArticleRequest): Promise<ApiResponse> {
  try {
    const response = await request('userArticleHide', {
      userId: params.userId,
      token: params.token,
      id: params.id,
      status: params.status,
    });
    
    return response;
  } catch (error) {
    if (error instanceof RequestError) {
      throw new Error(`隐藏作品失败: ${error.message}`);
    }
    throw new Error('隐藏作品过程中发生未知错误');
  }
}

/**
 * 搜索API
 * @param params 搜索参数
 * @returns Promise<SearchResponse>
 */
export async function searchContent(params: SearchRequest): Promise<SearchResponse> {
  try {
    const response = await request<SearchResponse>('queryall', {
      userId: params.userId,
      token: params.token,
      typeid: params.typeid,
      title: params.title,
    });
    
    console.log('Search API response:', response);
    
    // 检查token失效
    if (!response.success && response.message?.includes('token失效')) {
      throw new Error('TOKEN_EXPIRED');
    }
    
    // 直接返回响应，因为request函数已经返回了原始API响应
    return response as SearchResponse;
  } catch (error) {
    console.error('Search API error:', error);
    if (error instanceof RequestError) {
      if (error.message.includes('token失效') || error.message.includes('TOKEN_EXPIRED')) {
        throw new Error('TOKEN_EXPIRED');
      }
      throw new Error(`搜索失败: ${error.message}`);
    }
    throw new Error('搜索过程中发生未知错误');
  }
}
