# SpinToDiscover 部署指南

## 项目结构

```
/var/www/
├── spintodiscover/          # 前端项目目录
│   ├── out/                 # Next.js静态导出目录
│   ├── nginx.conf           # Nginx配置文件
│   └── ...
└── backend/                 # 后端项目目录（同级目录）
    ├── homeapi.php
    ├── upimg.php
    ├── videoyasuo.php
    └── ...
```

## 部署步骤

### 1. 环境准备

确保服务器已安装：
- Node.js 18+ 
- Nginx
- PHP 8.0+（后端需要）

### 2. 前端部署

#### 2.1 构建前端项目

```bash
# 进入前端项目目录
cd /path/to/SpinToDiscover

# 安装依赖
npm install

# 使用生产环境配置构建
cp env.production .env.local
npm run build

# 构建完成后，out目录包含所有静态文件
```

#### 2.2 部署到服务器

```bash
# 将构建好的文件复制到服务器
scp -r out/ user@your-server:/var/www/spintodiscover/

# 或者使用rsync
rsync -avz out/ user@your-server:/var/www/spintodiscover/out/
```

### 3. 后端部署

#### 3.1 部署后端文件

```bash
# 将后端PHP文件复制到服务器
scp -r backend/ user@your-server:/var/www/backend/
```

#### 3.2 配置后端

确保后端API文件在 `/var/www/backend/` 目录下，包括：
- `homeapi.php` - 主要API接口
- `upimg.php` - 图片上传接口
- `videoyasuo.php` - 视频上传接口

### 4. Nginx配置

#### 4.1 复制配置文件

```bash
# 复制nginx配置到nginx配置目录
sudo cp nginx.conf /etc/nginx/sites-available/spintodiscover
sudo ln -s /etc/nginx/sites-available/spintodiscover /etc/nginx/sites-enabled/
```

#### 4.2 修改配置

编辑 `/etc/nginx/sites-available/spintodiscover`：

1. 修改 `server_name` 为你的域名
2. 确认 `root` 路径指向正确的前端目录
3. 确认后端代理地址和端口

#### 4.3 测试并重启Nginx

```bash
# 测试配置
sudo nginx -t

# 重启nginx
sudo systemctl restart nginx
```

### 5. 环境变量配置

#### 5.1 生产环境

创建 `.env.production` 文件：

```bash
# 生产环境配置
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_STATIC_URL=
NODE_ENV=production
```

#### 5.2 本地开发

创建 `.env.local` 文件：

```bash
# 本地开发配置
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_STATIC_URL=
NODE_ENV=development
```

## 目录权限

确保Nginx有权限访问文件：

```bash
# 设置正确的权限
sudo chown -R www-data:www-data /var/www/spintodiscover/
sudo chmod -R 755 /var/www/spintodiscover/
```

## 常见问题

### 1. API请求失败

检查：
- 后端服务是否正常运行
- Nginx代理配置是否正确
- 防火墙是否阻止了端口访问

### 2. 静态资源加载失败

检查：
- 文件路径是否正确
- 文件权限是否正确
- Nginx配置中的静态文件处理规则

### 3. 上传功能失败

检查：
- 上传文件大小限制
- 后端上传接口是否正常
- 文件权限设置

## 监控和维护

### 1. 日志查看

```bash
# Nginx访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 后端PHP错误日志
sudo tail -f /var/log/php/error.log
```

### 2. 性能优化

- 启用Nginx gzip压缩
- 配置静态资源缓存
- 使用CDN加速静态资源

### 3. 安全配置

- 配置HTTPS证书
- 设置安全头
- 限制文件上传类型和大小
- 定期更新系统和依赖

## 更新部署

当需要更新前端时：

```bash
# 1. 重新构建
npm run build

# 2. 备份当前版本
sudo cp -r /var/www/spintodiscover/out /var/www/spintodiscover/out.backup.$(date +%Y%m%d_%H%M%S)

# 3. 部署新版本
rsync -avz out/ user@your-server:/var/www/spintodiscover/out/

# 4. 重启Nginx（如果需要）
sudo systemctl reload nginx
```
