/**
 * Global API Configuration
 * 全局API配置
 */

// 服务器配置
export const SERVER_CONFIG = {
  // 服务器基础URL
  BASE_URL: 'https://std.spinlinx.com',
  
  // 静态资源URL
  STATIC_URL: 'https://std.spinlinx.com',
  // STATIC_URL: 'https://dis.diatal.com',
}

// 工具函数：构建头像URL
export const buildAvatarUrl = (avatarPath?: string, fallback: string = '/img/avatar.png'): string => {
  if (!avatarPath || avatarPath.trim() === '') {
    return fallback;
  }
  
  // 如果已经是完整URL，验证并返回
  if (avatarPath.startsWith('http')) {
    try {
      new URL(avatarPath);
      return avatarPath;
    } catch {
      return fallback;
    }
  }
  
  // 构建完整URL
  const fullUrl = `${SERVER_CONFIG.STATIC_URL}${avatarPath}`;
  try {
    new URL(fullUrl);
    return fullUrl;
  } catch {
    return fallback;
  }
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
  url?: string;
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
// 品牌信息类型
export interface BrandInfo {
  website: string;
  logo: string;
  intro: string;
  operatingHours: string;
  adress: string;
  customerService: string;
  workingHours: string;
  tel: string;
  email: string;
}

// 互动信息类型
export interface Interactions {
  likes: number;
  shares: number;
  collects: number;
  userCollected: boolean;
  userLiked: boolean;
}

export interface SquareContent {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  video?: string;
  brandInfo?: BrandInfo;
  interactions?: Interactions; // 改为可选，因为API可能不返回
  publisher: Publisher;
  comments: Comment[]; // 评论数组
  createdAt: string;
  updatedAt: string;
  message?: string;
  success?: boolean;
  // 直接字段，根据API返回结构
  likes?: number;
  collects?: number;
  shares?: number;
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
  author: {
    id: string;
    nickname: string;
    avatar?: string;
  };
  content: string;
  replies: number; // 回复数量
  replyList: Comment[]; // 回复列表
  createdAt: string; // 格式: "YYYY-MM-DD HH:MM"
  parentId?: string; // 父评论ID，用于回复
  updatedAt?: string; // 可选更新时间
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

// 获取收藏列表请求参数类型
export interface GetCollectListRequest {
  userId: string;
  token: string;
  page?: number;
  limit?: number;
}

// 收藏项目类型
export interface CollectItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  video?: string;
  location: string;
  collectedAt: string;
  author: {
    userId: string;
    nickname: string;
    avatar: string;
  };
}

// 收藏列表响应类型
export interface CollectListResponse {
  dataList: CollectItem[];
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
  status?: number; // 作品状态：0显示，1隐藏
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

// 获取其他用户信息请求参数类型
export interface GetOtherUserInfoRequest {
  userId: string;
  token: string;
  otherId: string;
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
  customerService?: string | null;
  workingHours?: string | null;
  isFollow: boolean;
  userData: UserInfoResponse;
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

// 视频上传响应类型
export interface UploadVideoResponse {
  url: string;
  code: number;
  msg: string;
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

// 获取关注列表请求参数类型
export interface GetFollowedListRequest {
  userId: string;
  token: string;
}

// 获取粉丝列表请求参数类型
export interface GetFollowersListRequest {
  userId: string;
  token: string;
}

// 用户信息类型（用于关注/粉丝列表）
export interface FollowUser {
  userId: string;
  avatar: string;
  nickname: string;
}

// 关注/粉丝列表响应类型
export interface FollowListResponse {
  dataList: FollowUser[];
  success: boolean;
  message: string;
}

// 删除作品请求
export interface DeleteArticleRequest {
  userId: string;
  token: string;
  id: string; // 作品ID
}

// 隐藏作品请求
export interface HideArticleRequest {
  userId: string;
  token: string;
  id: string; // 作品ID
  status: number; // 1隐藏，0显示
}

// 发表评论请求接口
export interface PostCommentRequest {
  userId: string;
  token: string;
  productId: string; // 内容ID
  parentId?: string; // 父评论ID，回复评论时使用
  content: string; // 评论内容
}

// 搜索请求参数类型
export interface SearchRequest {
  userId: string;
  token: string;
  typeid: string; // 'all' | 'articles' | 'users' | 'brands'
  title: string; // 搜索关键词
}

// 用户搜索结果项类型
export interface UserSearchResult {
  id: string;
  name?: string;
  avatar?: string;
  addtime: string;
}

// 文章搜索结果项类型
export interface ArticleSearchResult {
  id: string;
  title: string;
  description: string;
  addtime: string;
}

// 搜索结果响应类型
export interface SearchResponse {
  userDataList: UserSearchResult[];
  articleDataList: ArticleSearchResult[];
  success: boolean;
  message: string;
}
