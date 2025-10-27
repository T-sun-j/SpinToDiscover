/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 忽略 useSearchParams Suspense 警告，这些是 Next.js 14 的已知问题
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // 在构建时忽略这些警告
  onDemandEntries: {
    // 禁用静态优化警告
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // 配置构建输出 - 支持静态导出和nginx部署
  output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',
  // 静态导出配置
  distDir: 'out',
  // 忽略构建警告
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // 环境变量配置
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_STATIC_URL: process.env.NEXT_PUBLIC_STATIC_URL,
  },
  // 重写规则，用于nginx代理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
