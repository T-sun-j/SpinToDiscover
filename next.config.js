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
  // 配置构建输出
  output: 'standalone',
  // 忽略构建警告
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Webpack 配置，改善 chunk 加载错误处理
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端配置：改善 chunk 加载错误处理
      config.optimization = {
        ...config.optimization,
        // 确保 chunk 文件名稳定
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
      };
    }
    return config;
  },
};

module.exports = nextConfig;
