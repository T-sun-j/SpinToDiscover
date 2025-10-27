#!/bin/bash

# SpinToDiscover 部署脚本
# 用于自动化部署到传统服务器

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="SpinToDiscover"
FRONTEND_DIR="."
OUTPUT_DIR="out"
SERVER_USER="root"
SERVER_HOST="your-server.com"
SERVER_PATH="/var/www/spintodiscover"
BACKUP_DIR="/var/www/backups"

# 函数：打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 函数：检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message $RED "错误: $1 命令未找到，请先安装 $1"
        exit 1
    fi
}

# 函数：构建前端项目
build_frontend() {
    print_message $YELLOW "开始构建前端项目..."
    
    # 检查Node.js和npm
    check_command "node"
    check_command "npm"
    
    # 安装依赖
    print_message $YELLOW "安装依赖..."
    npm install
    
    # 检查环境配置文件
    if [ ! -f ".env.local" ]; then
        print_message $YELLOW "未找到 .env.local 文件，复制生产环境配置..."
        cp env.production .env.local
    fi
    
    # 构建项目
    print_message $YELLOW "构建项目..."
    npm run build:static
    
    if [ ! -d "$OUTPUT_DIR" ]; then
        print_message $RED "构建失败：未找到输出目录 $OUTPUT_DIR"
        exit 1
    fi
    
    print_message $GREEN "前端构建完成！"
}

# 函数：备份当前版本
backup_current() {
    print_message $YELLOW "备份当前版本..."
    
    # 在服务器上创建备份
    ssh $SERVER_USER@$SERVER_HOST "mkdir -p $BACKUP_DIR"
    ssh $SERVER_USER@$SERVER_HOST "if [ -d '$SERVER_PATH/out' ]; then cp -r $SERVER_PATH/out $BACKUP_DIR/out.backup.\$(date +%Y%m%d_%H%M%S); fi"
    
    print_message $GREEN "备份完成！"
}

# 函数：部署到服务器
deploy_to_server() {
    print_message $YELLOW "部署到服务器..."
    
    # 检查服务器连接
    if ! ssh $SERVER_USER@$SERVER_HOST "echo '连接成功'" &> /dev/null; then
        print_message $RED "无法连接到服务器 $SERVER_HOST"
        exit 1
    fi
    
    # 创建目标目录
    ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH"
    
    # 上传文件
    print_message $YELLOW "上传文件到服务器..."
    rsync -avz --delete $OUTPUT_DIR/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/out/
    
    # 设置权限
    ssh $SERVER_USER@$SERVER_HOST "chown -R www-data:www-data $SERVER_PATH && chmod -R 755 $SERVER_PATH"
    
    print_message $GREEN "部署完成！"
}

# 函数：重启服务
restart_services() {
    print_message $YELLOW "重启Nginx服务..."
    
    # 测试Nginx配置
    ssh $SERVER_USER@$SERVER_HOST "nginx -t"
    
    # 重启Nginx
    ssh $SERVER_USER@$SERVER_HOST "systemctl reload nginx"
    
    print_message $GREEN "服务重启完成！"
}

# 函数：验证部署
verify_deployment() {
    print_message $YELLOW "验证部署..."
    
    # 检查文件是否存在
    if ssh $SERVER_USER@$SERVER_HOST "test -f $SERVER_PATH/out/index.html"; then
        print_message $GREEN "部署验证成功！"
        print_message $GREEN "网站地址: http://$SERVER_HOST"
    else
        print_message $RED "部署验证失败：未找到 index.html 文件"
        exit 1
    fi
}

# 函数：显示帮助信息
show_help() {
    echo "SpinToDiscover 部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  build     仅构建项目，不部署"
    echo "  deploy    构建并部署到服务器"
    echo "  backup    仅备份当前版本"
    echo "  restart   仅重启服务"
    echo "  verify    验证部署状态"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 build     # 仅构建项目"
    echo "  $0 deploy    # 完整部署流程"
}

# 主函数
main() {
    case "${1:-deploy}" in
        "build")
            build_frontend
            ;;
        "deploy")
            build_frontend
            backup_current
            deploy_to_server
            restart_services
            verify_deployment
            ;;
        "backup")
            backup_current
            ;;
        "restart")
            restart_services
            ;;
        "verify")
            verify_deployment
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_message $RED "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
