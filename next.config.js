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
};

module.exports = nextConfig;
