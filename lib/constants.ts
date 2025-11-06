/**
 * Application Constants
 * 应用程序常量
 */

// API相关常量
export const API_CONSTANTS = {
  // 分页默认值
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 999,
  MAX_LIMIT: 100,
  
  // 请求超时时间
  REQUEST_TIMEOUT: 10000,
  
  // 重试次数
  MAX_RETRIES: 3,
} as const;

// UI相关常量
export const UI_CONSTANTS = {
  // 颜色
  COLORS: {
    PRIMARY: '#11295b',
    PRIMARY_OPACITY_80: '#11295b/80',
    PRIMARY_OPACITY_60: '#11295b/60',
    GRAY_100: 'bg-gray-100',
    GRAY_400: 'text-gray-400',
    RED_500: 'text-red-500',
    WHITE: 'text-white',
  },
  
  // 字体
  FONTS: {
    POPPINS: 'font-poppins',
    NUNITO: 'font-nunito',
    INTER: 'font-inter',
  },
  
  // 字体权重
  FONT_WEIGHTS: {
    SEMIBOLD: 'font-semibold',
    NORMAL: 'font-normal',
  },
  
  // 尺寸
  SIZES: {
    ICON_SM: 'h-3.5 w-3.5',
    ICON_MD: 'h-6 w-6',
    ICON_LG: 'h-7 w-7',
    ICON_XL: 'h-8 w-8',
  },
  
  // 间距
  SPACING: {
    GAP_2: 'gap-2',
    GAP_4: 'gap-4',
    MB_2: 'mb-2',
    MB_4: 'mb-4',
    MB_6: 'mb-6',
    MY_4: 'my-4',
    PX_6: 'px-6',
    PY_2: 'py-2',
    PY_8: 'py-8',
    PY_12: 'py-12',
    PB_6: 'pb-6',
  },
  
  // 圆角
  BORDER_RADIUS: {
    ROUNDED_MD: 'rounded-md',
    ROUNDED_FULL: 'rounded-full',
  },
  
  // 阴影和透明度
  EFFECTS: {
    OPACITY_50: 'opacity-50',
    OPACITY_80: '/80',
    OPACITY_60: '/60',
  },
} as const;

// 历史页面特定常量
export const HISTORY_CONSTANTS = {
  // 图片相关
  IMAGES: {
    MAX_THUMBNAILS: 3,
    DEFAULT_IMAGE: '/img/band.png',
    THUMBNAIL_SIZE: {
      width: 360,
      height: 220,
    },
    THUMBNAIL_CLASS: 'w-full h-28 object-cover rounded-md',
  },
  
  // 布局相关
  LAYOUT: {
    GRID_COLS_3: 'grid-cols-3',
    MIN_HEIGHT_DVH: 'min-h-dvh',
    FLEX_COL: 'flex-col',
    FLEX_CENTER: 'flex items-center justify-center',
    FLEX_BETWEEN: 'flex items-center justify-between',
  },
  
  // 文本大小
  TEXT_SIZES: {
    TITLE: 'text-2xl',
    SUBTITLE: 'text-lg',
    BODY: 'text-[15px]',
    SMALL: 'text-sm',
    XS: 'text-xs',
  },
} as const;

// 动画相关常量
export const ANIMATION_CONSTANTS = {
  SPIN: 'animate-spin',
  FADE_IN: 'animate-fade-in',
  SLIDE_UP: 'animate-slide-up',
} as const;

// 响应式断点
export const BREAKPOINTS = {
  SM: 'sm:',
  MD: 'md:',
  LG: 'lg:',
  XL: 'xl:',
  '2XL': '2xl:',
} as const;

// 主题相关常量
export const THEME_CONSTANTS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// 错误消息常量
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timeout',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error occurred',
} as const;

// 成功消息常量
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully',
  OPERATION_COMPLETED: 'Operation completed successfully',
  SAVED: 'Changes saved successfully',
} as const;
