# SpinLinX - 后端API接口参考文档

## 📋 项目概述

**SpinLinX** 是一个现代化的移动端社交发现应用，支持多语言（英语/中文），主要功能包括用户认证、内容发现、广场社交、个人设置等。

## 🏗️ 技术架构

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **状态管理**: React Context
- **国际化**: 自定义i18n系统
- **部署**: 静态导出 (Static Export)

---

## 🔐 用户认证模块

### 1. 用户注册
```http
POST /api/auth/register
```

**请求参数:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "acceptTerms": true,
  "language": "en" // "en" | "zh"
}
```

**响应:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid-string",
    "email": "user@example.com",
    "status": "pending_verification"
  }
}
```

### 2. 用户登录
```http
POST /api/auth/login
```

**请求参数:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "nickname": "User123",
      "avatar": "https://example.com/avatar.jpg",
      "language": "en"
    }
  }
}
```

### 3. 忘记密码
```http
POST /api/auth/forgot-password
```

**请求参数:**
```json
{
  "email": "user@example.com"
}
```

### 4. 重置密码
```http
POST /api/auth/reset-password
```

**请求参数:**
```json
{
  "token": "reset-token",
  "newPassword": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

---

## 👤 用户个人化模块

### 1. 更新用户信息
```http
PUT /api/user/profile
```

**请求参数:**
```json
{
  "nickname": "NewNickname",
  "avatar": "base64-image-data", // 可选
  "language": "zh"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "email": "user@example.com",
    "nickname": "NewNickname",
    "avatar": "https://example.com/avatar.jpg",
    "language": "zh",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. 获取用户信息
```http
GET /api/user/profile
```

**响应:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "email": "user@example.com",
    "nickname": "UserNickname",
    "avatar": "https://example.com/avatar.jpg",
    "language": "en",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 🏛️ 广场内容模块

### 1. 获取广场内容列表
```http
GET /api/square/posts?tab=recommend&page=1&limit=10
```

**查询参数:**
- `tab`: "recommend" | "following" | "nearby"
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `location`: 位置筛选 (可选)

**响应:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid-string",
        "title": "Amazing Place Discovery",
        "description": "This is an introduction text about some brand stories...",
        "location": "Istanbul, Turkey",
        "publisher": {
          "id": "user-uuid",
          "nickname": "Miaham",
          "avatar": "https://example.com/avatar.jpg"
        },
        "images": [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
          "https://example.com/image3.jpg"
        ],
        "video": "https://example.com/video.mp4", // 可选
        "likes": 562,
        "shares": 1210,
        "collects": 234,
        "commentsCount": 15,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2. 获取广场内容详情
```http
GET /api/square/posts/{postId}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "title": "Amazing Place Discovery",
    "description": "This is an introduction text about some brand stories and features of this product...",
    "location": "Istanbul, Turkey",
    "publisher": {
      "id": "user-uuid",
      "nickname": "Miaham",
      "avatar": "https://example.com/avatar.jpg"
    },
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg"
    ],
    "video": "https://example.com/video.mp4",
    "brandInfo": {
      "website": "www.example.com",
      "logo": "Brand Logo",
      "intro": "Brand introduction text",
      "operatingHours": "Mon-Fri 9:00-18:00",
      "customerService": "+1-234-567-8900",
      "workingHours": "24/7 Customer Support",
      "email": "contact@example.com"
    },
    "interactions": {
      "likes": 562,
      "shares": 1210,
      "collects": 234,
      "userLiked": false,
      "userCollected": false
    },
    "comments": [
      {
        "id": "comment-uuid",
        "author": {
          "id": "user-uuid",
          "nickname": "Commenter",
          "avatar": "https://example.com/avatar.jpg"
        },
        "content": "We warmly welcome all friends who are interested in such brands...",
        "replies": 0,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3. 创建广场内容
```http
POST /api/square/posts
```

**请求参数:**
```json
{
  "title": "New Discovery",
  "description": "Description of the discovery",
  "location": "Paris, France",
  "images": ["base64-image1", "base64-image2"],
  "video": "base64-video", // 可选
  "brandInfo": {
    "website": "www.example.com",
    "logo": "Brand Logo",
    "intro": "Brand introduction",
    "operatingHours": "Mon-Fri 9:00-18:00",
    "customerService": "+1-234-567-8900",
    "workingHours": "24/7 Support",
    "email": "contact@example.com"
  }
}
```

### 4. 内容互动
```http
POST /api/square/posts/{postId}/interact
```

**请求参数:**
```json
{
  "action": "like" | "unlike" | "collect" | "uncollect" | "share"
}
```

### 5. 添加评论
```http
POST /api/square/posts/{postId}/comments
```

**请求参数:**
```json
{
  "content": "This is a great discovery!",
  "parentId": "parent-comment-uuid" // 可选，用于回复
}
```

---

## 🗺️ 发现模块

### 1. 搜索地点
```http
GET /api/discover/search?q=keyword&location=lat,lng&radius=5000
```

**查询参数:**
- `q`: 搜索关键词
- `location`: 经纬度 "lat,lng"
- `radius`: 搜索半径(米)
- `category`: 分类筛选 (可选)

**响应:**
```json
{
  "success": true,
  "data": {
    "places": [
      {
        "id": "place-uuid",
        "name": "Eiffel Tower",
        "description": "Iconic iron tower in Paris",
        "location": {
          "lat": 48.8584,
          "lng": 2.2945,
          "address": "Champ de Mars, 7th arrondissement, Paris"
        },
        "images": ["https://example.com/eiffel1.jpg"],
        "rating": 4.8,
        "reviewsCount": 1250,
        "category": "landmark",
        "distance": 1200 // 距离用户位置(米)
      }
    ],
    "total": 25
  }
}
```

### 2. 获取热门地点
```http
GET /api/discover/popular?location=lat,lng&limit=20
```

---

## 🌐 国际化模块

### 1. 获取翻译内容
```http
GET /api/i18n/translations?lang=en
```

**查询参数:**
- `lang`: "en" | "zh"

**响应:**
```json
{
  "success": true,
  "data": {
    "language": "en",
    "translations": {
      "appName": {
        "title": "Spin to",
        "subtitle": "Discover"
      },
      "auth": {
        "createAccount": "Create a new account",
        "email": "E-mail",
        "password": "Password"
      },
      "square": {
        "title": "Square",
        "recommend": "Recommend",
        "following": "Following",
        "nearby": "Nearby"
      }
    }
  }
}
```

---

## 📱 通用响应格式

### 成功响应
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* 具体数据 */ },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "email": "Email format is invalid",
      "password": "Password must be at least 8 characters"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🔒 认证与授权

### JWT Token 格式
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "uuid-string",
    "email": "user@example.com",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### 请求头
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
Accept-Language: en | zh
```

---

## 📊 数据模型

### 用户模型 (User)
```typescript
interface User {
  id: string;
  email: string;
  password: string; // 加密存储
  nickname: string;
  avatar?: string;
  language: 'en' | 'zh';
  status: 'active' | 'inactive' | 'banned';
  createdAt: Date;
  updatedAt: Date;
}
```

### 广场内容模型 (SquarePost)
```typescript
interface SquarePost {
  id: string;
  title: string;
  description: string;
  location: string;
  publisherId: string;
  images: string[];
  video?: string;
  brandInfo?: {
    website: string;
    logo: string;
    intro: string;
    operatingHours: string;
    customerService: string;
    workingHours: string;
    email: string;
  };
  likes: number;
  shares: number;
  collects: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 评论模型 (Comment)
```typescript
interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string; // 用于回复
  replies: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 部署建议

### 环境变量
```env
# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/spintodiscover

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 文件存储
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# 邮件服务
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 其他
NODE_ENV=production
PORT=3000
```

### 推荐技术栈
- **框架**: Node.js + Express.js 或 NestJS
- **数据库**: PostgreSQL + Prisma ORM
- **缓存**: Redis
- **文件存储**: AWS S3 或 Cloudinary
- **认证**: JWT + bcrypt
- **邮件**: Nodemailer
- **文档**: Swagger/OpenAPI

---

## 📝 开发注意事项

1. **安全性**
   - 所有密码使用 bcrypt 加密
   - JWT token 设置合理过期时间
   - 输入验证和SQL注入防护
   - CORS 配置

2. **性能优化**
   - 数据库索引优化
   - Redis 缓存热点数据
   - 图片压缩和CDN
   - 分页查询

3. **国际化**
   - 支持动态语言切换
   - 翻译内容缓存
   - 时区处理

4. **错误处理**
   - 统一错误响应格式
   - 详细错误日志
   - 用户友好的错误信息

---

*此文档基于当前前端项目结构分析生成，实际开发时请根据具体需求调整。*
