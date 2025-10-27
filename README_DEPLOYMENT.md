# SpinToDiscover 传统服务器部署指南

## 概述

本项目已配置为支持传统服务器部署，使用Nginx作为反向代理，将前端静态文件和后端API分离部署。

## 项目结构

```
项目根目录/
├── 前端项目 (SpinToDiscover)
│   ├── out/                    # 静态导出目录
│   ├── nginx.conf             # Nginx配置
│   ├── deploy.sh              # 部署脚本
│   ├── env.production         # 生产环境配置
│   └── ...
└── 后端项目 (同级目录)
    ├── homeapi.php
    ├── upimg.php
    ├── videoyasuo.php
    └── ...
```

## 快速开始

### 1. 环境准备

确保服务器已安装：
- Node.js 18+
- Nginx
- PHP 8.0+ (后端需要)

### 2. 配置修改

#### 2.1 修改部署脚本配置

编辑 `deploy.sh` 文件，修改以下配置：

```bash
SERVER_USER="your-username"        # 服务器用户名
SERVER_HOST="your-server.com"      # 服务器地址
SERVER_PATH="/var/www/spintodiscover"  # 部署路径
```

#### 2.2 修改Nginx配置

编辑 `nginx.conf` 文件：

1. 修改 `server_name` 为你的域名
2. 确认后端代理地址和端口
3. 调整文件路径

### 3. 部署步骤

#### 3.1 构建项目

```bash
# 仅构建项目
./deploy.sh build

# 或者使用npm命令
npm run build:static
```

#### 3.2 完整部署

```bash
# 构建并部署到服务器
./deploy.sh deploy
```

#### 3.3 其他操作

```bash
# 仅备份当前版本
./deploy.sh backup

# 仅重启服务
./deploy.sh restart

# 验证部署状态
./deploy.sh verify
```

## 详细配置说明

### 前端配置修改

#### 1. API配置 (`lib/api.ts`)

已修改为支持环境变量和相对路径：

```typescript
export const SERVER_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? '' : 'http://localhost:3000'),
  STATIC_URL: process.env.NEXT_PUBLIC_STATIC_URL || (typeof window !== 'undefined' ? '' : 'http://localhost:3000'),
}
```

#### 2. Next.js配置 (`next.config.js`)

已配置为支持静态导出：

```javascript
output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',
distDir: 'out',
```

### 后端配置

确保后端API文件在服务器上正确部署，包括：

- `homeapi.php` - 主要API接口
- `upimg.php` - 图片上传接口  
- `videoyasuo.php` - 视频上传接口

### Nginx配置

Nginx配置文件包含：

1. **静态文件服务** - 服务前端静态文件
2. **API代理** - 将 `/api/` 请求代理到后端
3. **上传代理** - 处理文件上传请求
4. **SPA路由** - 支持前端路由

## 环境变量

### 生产环境 (env.production)

```bash
NEXT_PUBLIC_API_BASE_URL=      # 留空使用相对路径
NEXT_PUBLIC_STATIC_URL=        # 留空使用相对路径
NODE_ENV=production
```

### 本地开发 (.env.local)

```bash
NEXT_PUBLIC_API_BASE_URL=      # 留空使用相对路径
NEXT_PUBLIC_STATIC_URL=        # 留空使用相对路径
NODE_ENV=development
```

## 部署流程

### 自动化部署

使用提供的部署脚本：

```bash
# 完整部署流程
./deploy.sh deploy
```

### 手动部署

1. **构建前端**
   ```bash
   npm run build:static
   ```

2. **上传文件**
   ```bash
   rsync -avz out/ user@server:/var/www/spintodiscover/out/
   ```

3. **配置Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/spintodiscover
   sudo ln -s /etc/nginx/sites-available/spintodiscover /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 常见问题

### 1. API请求失败

**问题**: 前端无法访问后端API

**解决方案**:
- 检查Nginx代理配置
- 确认后端服务运行状态
- 检查防火墙设置

### 2. 静态资源加载失败

**问题**: CSS、JS文件无法加载

**解决方案**:
- 检查文件路径和权限
- 确认Nginx静态文件配置
- 检查文件是否存在

### 3. 上传功能失败

**问题**: 图片或视频上传失败

**解决方案**:
- 检查上传文件大小限制
- 确认后端上传接口正常
- 检查文件权限设置

### 4. 路由问题

**问题**: 刷新页面出现404

**解决方案**:
- 确认Nginx SPA路由配置
- 检查 `try_files` 指令

## 监控和维护

### 日志查看

```bash
# Nginx访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 系统日志
sudo journalctl -u nginx -f
```

### 性能优化

1. **启用gzip压缩**
2. **配置静态资源缓存**
3. **使用CDN加速**
4. **优化图片资源**

### 安全配置

1. **配置HTTPS证书**
2. **设置安全头**
3. **限制文件上传**
4. **定期更新系统**

## 更新部署

当需要更新项目时：

```bash
# 使用部署脚本
./deploy.sh deploy

# 或手动更新
npm run build:static
rsync -avz out/ user@server:/var/www/spintodiscover/out/
sudo systemctl reload nginx
```

## 技术支持

如遇到问题，请检查：

1. 服务器环境是否满足要求
2. 配置文件是否正确
3. 网络连接是否正常
4. 日志文件中的错误信息

更多详细信息请参考 `DEPLOYMENT.md` 文件。
