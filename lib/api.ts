/**
 * Global API Configuration
 * 全局API配置
 */

// 服务器配置
export const SERVER_CONFIG = {
  // 服务器基础URL
  BASE_URL: 'http://dis.diatal.com',
  
  // 静态资源URL
  STATIC_URL: 'http://dis.diatal.com',
}

// 工具函数：构建头像URL
export const buildAvatarUrl = (avatarPath?: string, fallback: string = '/img/avatar.png'): string => {
  if (!avatarPath) {
    return fallback;
  }
  
  // 如果已经是完整URL，直接返回
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  // 构建完整URL
  return `${SERVER_CONFIG.STATIC_URL}${avatarPath}`;
}

// API基础配置
export const API_CONFIG = {
  // 基础URL
  BASE_URL: `${SERVER_CONFIG.BASE_URL}/homeapi.php`,
  
  // 上传服务URL
  UPLOAD_URL: `${SERVER_CONFIG.BASE_URL}/upimg.php`,
  
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
    UPLOAD_IMG: 'uploadimg',
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

// 分页参数类型
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// 位置信息类型
export interface LocationInfo {
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  country?: string;
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
  userId: string;
  token: string;
  email: string;
  message?: string;
}

// 登录响应类型
export interface LoginResponse {
  userId: string;
  token: string;
  email: string;
  message?: string;
}

// 发布广场内容请求参数类型
export interface PostSquareRequest {
  userId: string;
  token: string;
  title: string;
  description: string;
  location: string;
  images?: string;
  video?: string;
  website?: string;
  logo?: string;
  intro?: string;
  operatingHours?: string;
  customerService?: string;
  workingHours?: string;
}

// 获取广场内容列表请求参数类型
export interface GetHomeListRequest {
  userId: string;
  token: string;
  tab?: string;
  page?: number;
  limit?: number;
  location: string;
}

// 获取广场详情请求参数类型
export interface GetSquareDetailRequest {
  userId: string;
  token: string;
  postId: string;
}

// 发布者信息类型
export interface Publisher {
  id: string;
  nickname: string;
  avatar: string;
}

// 广场内容响应类型
export interface SquareContent {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  video?: string;
  website?: string;
  logo?: string;
  intro?: string;
  operatingHours?: string;
  customerService?: string;
  workingHours?: string;
  publisher: Publisher;
  likes: number;
  shares: number;
  collects: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

// 分页信息类型
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 广场内容列表响应类型
export interface SquareListResponse {
  posts: SquareContent[];
  pagination: Pagination;
}

// 发表评论请求参数类型
export interface PostCommentRequest {
  userId: string;
  token: string;
  productId: string;
  parentId?: string;
  content: string;
}

// 评论响应类型
export interface Comment {
  id: string;
  author: Publisher;
  content: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

// 发表评论响应类型
export interface PostCommentResponse {
  comment: Comment;
  message: string;
}

// 点赞请求参数类型
export interface LoveRequest {
  userId: string;
  token: string;
  productId: string;
  isLove: 0 | 1; // 0: 取消点赞, 1: 点赞
}

// 收藏内容请求参数类型
export interface CollectRequest {
  userId: string;
  token: string;
  productId: string;
  isCollect: 0 | 1; // 0: 取消收藏, 1: 收藏
}

// 关注用户请求参数类型
export interface FollowUserRequest {
  userId: string;
  token: string;
  authorId: string;
  isCollect: 0 | 1; // 0: 取消关注, 1: 关注
}

// 互动响应类型
export interface InteractionResponse {
  success: boolean;
  message: string;
  data?: {
    isLoved?: boolean;
    isCollected?: boolean;
    isFollowed?: boolean;
    likesCount?: number;
    collectsCount?: number;
  };
}

// 获取浏览历史请求参数类型
export interface GetBrowsingListRequest {
  userId: string;
  token: string;
  page?: number;
  limit?: number;
}

// 浏览历史项类型
export interface BrowsingHistoryItem {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  video?: string;
  publisher: Publisher;
  likes: number;
  shares: number;
  collects: number;
  commentsCount: number;
  viewedAt: string; // 浏览时间
  createdAt: string;
  updatedAt: string;
}

// 浏览历史列表响应类型
export interface BrowsingListResponse {
  history: BrowsingHistoryItem[];
  pagination: Pagination;
}

// 获取个人作品列表请求参数类型
export interface GetMyPageListRequest {
  userId: string;
  token: string;
  page?: number;
  limit?: number;
}

// 个人作品项类型
export interface MyPageItem {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  video?: string;
  publisher: Publisher;
  likes: number;
  shares: number;
  collects: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

// 个人作品列表响应类型
export interface MyPageListResponse {
  posts: MyPageItem[];
  pagination: Pagination;
}

// 获取用户信息请求参数类型
export interface GetUserInfoRequest {
  email: string;
  userId: string;
  token: string;
}

// 用户信息类型
export interface UserInfo {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  language: string;
  location?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

// 用户信息响应类型
export interface UserInfoResponse {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  language: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  address?: string | null;
  brand?: string | null;
  brief?: string | null;
  location?: string;
  logo?: string | null;
  officialsite?: string | null;
  tel?: string;
}

// 头像上传请求参数类型
export interface UploadAvatarRequest {
  avatar: File;
}

// 头像上传响应类型
export interface UploadAvatarResponse {
  img: string;
  code: number;
}

// 更新用户品牌信息请求参数类型
export interface UpdateUserBrandRequest {
  email: string;
  userId: string;
  token: string;
  brand?: string;
  brief?: string;
  logo?: string;
  officialsite?: string;
  tel?: string;
  address?: string;
  location?: string;
}

// 更新用户品牌信息响应类型
export interface UpdateUserBrandResponse {
  success: boolean;
  message: string;
  data?: any;
}
