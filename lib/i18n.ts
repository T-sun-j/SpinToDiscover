export type Language = 'en' | 'zh';

export interface Translations {
  appName: {
    title: string;
    subtitle: string;
  };
  header: {
    searchPlaceholder: string;
  };
  buttons: {
    spinToDiscover: string;
    createAccount: string;
  };
  navigation: {
    quickAccess: string;
    discover: string;
    community: string;
    settings: string;
    help: string;
  };
  auth: {
    createAccount: string;
    email: string;
    password: string;
    confirmPassword: string;
    passwordsNotMatch: string;
    acceptTerms: string;
    termsOfUse: string;
    privacyPolicy: string;
    submit: string;
    alreadyHaveAccount: string;
  };
  personalization: {
    title: string;
    avatarUpload: string;
    clickToUpload: string;
    nickname: string;
    nicknamePlaceholder: string;
    errorMessage: string;
    submit: string;
    skip: string;
    back: string;
    submitting?: string;
  };
  discover: {
    searchPlaceholder: string;
    mapPlaceholder: string;
    popularPlaces: string;
    footer: string;
  };
  community: {
    onlineUsers: string;
    recentPosts: string;
    postContent: string;
  };
  settings: {
    profile: string;
    profileDesc: string;
    notifications: string;
    notificationsDesc: string;
    privacy: string;
    privacyDesc: string;
    appearance: string;
    appearanceDesc: string;
    language: string;
    languageDesc: string;
    version: string;
    setupTitle?: string;
    newEmail?: string;
    newPassword?: string;
    confirmPassword?: string;
    errorMessage?: string;
    submit?: string;
  };
  help: {
    welcome: string;
    welcomeDesc: string;
    faq: string;
    faqDesc: string;
    contact: string;
    contactDesc: string;
    support: string;
    supportDesc: string;
    quickHelp: string;
    quickHelp1: string;
    quickHelp2: string;
    quickHelp3: string;
    footer: string;
  };
  footer: {
    language: {
      en: string;
      zh: string;
    };
    links: {
      about: string;
      privacy: string;
    };
    copyright: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: {
      title: 'Spin to',
      subtitle: 'Discover',
    },
    header: {
      searchPlaceholder: 'Search...',
    },
    buttons: {
      spinToDiscover: 'Spin to Discover',
      createAccount: 'Create a new account',
    },
    navigation: {
      quickAccess: 'Quick Access',
      discover: 'Discover',
      community: 'Community',
      settings: 'Settings',
      help: 'Help',
    },
    auth: {
      createAccount: 'Create a new account',
      email: 'E-mail',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      passwordsNotMatch: 'Passwords do not match',
      acceptTerms: 'Read and accept the',
      termsOfUse: 'terms of use',
      privacyPolicy: 'Privacy Policy',
      submit: 'Submit',
      alreadyHaveAccount: 'I already have an account',
    },
    personalization: {
      title: 'Personalization',
      avatarUpload: 'Avatar upload',
      clickToUpload: 'click to upload',
      nickname: 'New nick name',
      nicknamePlaceholder: 'New nick name',
      errorMessage: 'Error Message',
      submit: 'Submit',
      skip: 'Skip',
      back: 'Back',
      submitting: 'Submitting...'
    },
    discover: {
      searchPlaceholder: 'Search places...',
      mapPlaceholder: 'Interactive map will be displayed here',
      popularPlaces: 'Popular Places',
      footer: 'Discover amazing places around the world',
    },
    community: {
      onlineUsers: 'Online Users',
      recentPosts: 'Recent Posts',
      postContent: 'Just discovered an amazing place!',
    },
    settings: {
      profile: 'Profile',
      profileDesc: 'Manage your account information',
      notifications: 'Notifications',
      notificationsDesc: 'Configure notification preferences',
      privacy: 'Privacy',
      privacyDesc: 'Control your privacy settings',
      appearance: 'Appearance',
      appearanceDesc: 'Customize app appearance',
      language: 'Language',
      languageDesc: 'Choose your preferred language',
      version: 'Version',
      setupTitle: 'Setup',
      newEmail: 'New E-mail',
      newPassword: 'New Passwords',
      confirmPassword: 'Confirm passwords',
      errorMessage: 'Error Message',
      submit: 'Submit',
    },
    help: {
      welcome: 'How can we help you?',
      welcomeDesc: 'Find answers to common questions and get support',
      faq: 'FAQ',
      faqDesc: 'Frequently asked questions',
      contact: 'Contact Us',
      contactDesc: 'Get in touch with our team',
      support: 'Support',
      supportDesc: 'Technical support and troubleshooting',
      quickHelp: 'Quick Help',
      quickHelp1: 'Use the search bar to find places',
      quickHelp2: 'Tap on map markers for details',
      quickHelp3: 'Join community discussions',
      footer: 'Need more help? Contact our support team',
    },
    footer: {
      language: {
        en: 'English (US)',
        zh: '中文(简体)',
      },
      links: {
        about: 'About Us',
        privacy: 'PrivacyPolicy',
      },
      copyright: '©2025 Spin to Discover',
    },
  },
  zh: {
    appName: {
      title: 'Spin to',
      subtitle: 'Discover',
    },
    header: {
      searchPlaceholder: '搜索...',
    },
    buttons: {
      spinToDiscover: '开始探索',
      createAccount: '创建新账户',
    },
    navigation: {
      quickAccess: '快速访问',
      discover: '探索',
      community: '社区',
      settings: '设置',
      help: '帮助',
    },
    auth: {
      createAccount: '创建新账户',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      passwordsNotMatch: '密码不匹配',
      acceptTerms: '阅读并接受',
      termsOfUse: '使用条款',
      privacyPolicy: '隐私政策',
      submit: '提交',
      alreadyHaveAccount: '我已有账户',
    },
    personalization: {
      title: '个人化',
      avatarUpload: '头像上传',
      clickToUpload: '点击上传',
      nickname: '新昵称',
      nicknamePlaceholder: '新昵称',
      errorMessage: '错误信息',
      submit: '提交',
      skip: '跳过',
      back: '返回',
      submitting: '提交中...'
    },
    discover: {
      searchPlaceholder: '搜索地点...',
      mapPlaceholder: '交互式地图将在此显示',
      popularPlaces: '热门地点',
      footer: '发现世界各地的精彩地点',
    },
    community: {
      onlineUsers: '在线用户',
      recentPosts: '最新动态',
      postContent: '刚刚发现了一个很棒的地方！',
    },
    settings: {
      profile: '个人资料',
      profileDesc: '管理您的账户信息',
      notifications: '通知',
      notificationsDesc: '配置通知偏好',
      privacy: '隐私',
      privacyDesc: '控制您的隐私设置',
      appearance: '外观',
      appearanceDesc: '自定义应用外观',
      language: '语言',
      languageDesc: '选择您偏好的语言',
      version: '版本',
      setupTitle: '设置',
      newEmail: '新邮箱',
      newPassword: '新密码',
      confirmPassword: '确认密码',
      errorMessage: '错误信息',
      submit: '提交',
    },
    help: {
      welcome: '我们如何帮助您？',
      welcomeDesc: '查找常见问题的答案并获得支持',
      faq: '常见问题',
      faqDesc: '常见问题解答',
      contact: '联系我们',
      contactDesc: '与我们的团队取得联系',
      support: '支持',
      supportDesc: '技术支持和故障排除',
      quickHelp: '快速帮助',
      quickHelp1: '使用搜索栏查找地点',
      quickHelp2: '点击地图标记查看详情',
      quickHelp3: '加入社区讨论',
      footer: '需要更多帮助？联系我们的支持团队',
    },
    footer: {
      language: {
        en: 'English (US)',
        zh: '中文(简体)',
      },
      links: {
        about: '关于我们',
        privacy: '隐私政策',
      },
      copyright: '© 2025 Spin to Discover',
    },
  },
};

export const defaultLanguage: Language = 'en';
