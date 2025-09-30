/**
 * API Cache Utilities
 * API缓存工具
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class ApiCache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultExpiresIn = 5 * 60 * 1000; // 5分钟

  set<T>(key: string, data: T, expiresIn?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: expiresIn || this.defaultExpiresIn,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // 清理过期的缓存项
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiresIn) {
        this.cache.delete(key);
      }
    }
  }

  // 获取缓存统计信息
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// 全局缓存实例
export const apiCache = new ApiCache();

// 定期清理过期缓存
setInterval(() => {
  apiCache.cleanup();
}, 60 * 1000); // 每分钟清理一次

// 缓存装饰器
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
  expiresIn?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    // 尝试从缓存获取
    const cached = apiCache.get(key);
    if (cached) {
      return cached;
    }

    // 执行原函数
    const result = await fn(...args);
    
    // 缓存结果
    apiCache.set(key, result, expiresIn);
    
    return result;
  }) as T;
}

// 生成缓存键的工具函数
export function generateCacheKey(prefix: string, ...args: any[]): string {
  return `${prefix}:${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(':')}`;
}
