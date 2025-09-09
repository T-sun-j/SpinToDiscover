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
    login: string;
    loginTitle: string;
    forgetPassword: string;
    passwordRequirements: string;
    submitting: string;
    forgotPasswordTitle: string;
    emailValidation: string;
    sendResetEmail: string;
    changePasswordTitle: string;
    newPassword: string;
    confirmNewPassword: string;
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
  square: {
    title: string;
    searchPlaceholder: string;
    nearbyPlaces: string;
    recommend: string;
    following: string;
    nearby: string;
    filter: string;
    location: string;
    titleContent: string;
    description: string;
    publisher: string;
    collect: string;
    like: string;
    share: string;
    comments: string;
    inputComments: string;
    send: string;
    reply: string;
    showAll: string;
    collapse: string;
    expand: string;
    brandWebsite: string;
    brandLogo: string;
    brandIntro: string;
    operatingHours: string;
    customerService: string;
    workingHours: string;
    email: string;
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
      login: 'Log in',
      loginTitle: 'Log in',
      forgetPassword: 'Forget password?',
      passwordRequirements: '8 characters or more, including uppercase and lowercase letters, numbers',
      submitting: 'Logging in...',
      forgotPasswordTitle: 'Forget password',
      emailValidation: 'Email format validation required',
      sendResetEmail: 'Send password reset email to this email',
      changePasswordTitle: 'Change passwords',
      newPassword: 'New Passwords',
      confirmNewPassword: 'Confirm passwords',
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
    square: {
      title: 'Square',
      searchPlaceholder: 'Search places...',
      nearbyPlaces: 'Nearby Places',
      recommend: 'Recommend',
      following: 'Following',
      nearby: 'Nearby',
      filter: 'Filter',
      location: 'Istanbul',
      titleContent: 'Title or central idea content text',
      description: 'This is an introduction text about some brand stories and features of this product, which is edited and uploaded to the system by each buyer, and published after being reviewed by the administrator.',
      publisher: 'Miaham',
      collect: 'Collect',
      like: 'Like',
      share: 'Share',
      comments: 'Comments',
      inputComments: 'Input your comments',
      send: 'Send',
      reply: 'Reply',
      showAll: 'Show All',
      collapse: 'Collapse',
      expand: 'Expand',
      brandWebsite: 'loropiana.com/en/',
      brandLogo: 'Loro Piana',
      brandIntro: 'Brand Introduction',
      operatingHours: 'Monday to Friday 9am to 6pm CET (excluding public holidays) Saturday and Sunday 9am to 7pm CET (excluding public holidays)',
      customerService: 'Customer Service Hotline: 4008 508 580',
      workingHours: 'Working hours: 9:00 - 22:00 (Spring Festival statutory holiday 18:00-16:00)',
      email: 'E-mail customerservice.cn@loropiana.com',
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
      login: '登录',
      loginTitle: '登录',
      forgetPassword: '忘记密码？',
      passwordRequirements: '8位以上含字母大小写,数字',
      submitting: '登录中...',
      forgotPasswordTitle: '忘记密码',
      emailValidation: '需邮箱规则验证',
      sendResetEmail: '点击提示发送修改密码邮件至该邮箱',
      changePasswordTitle: '修改密码',
      newPassword: '新密码',
      confirmNewPassword: '确认密码',
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
    square: {
      title: '广场',
      searchPlaceholder: '搜索地点...',
      nearbyPlaces: '附近地点',
      recommend: '推荐',
      following: '关注',
      nearby: '附近',
      filter: '筛选',
      location: '伊斯坦布尔',
      titleContent: '标题或中心思想内容文本',
      description: '这是一段关于某些品牌故事和产品特色的介绍文本，由每个买家编辑并上传到系统中，经管理员审核后发布。',
      publisher: '米亚汉',
      collect: '收藏',
      like: '点赞',
      share: '分享',
      comments: '评论',
      inputComments: '输入您的评论',
      send: '发送',
      reply: '回复',
      showAll: '显示全部',
      collapse: '收起',
      expand: '展开',
      brandWebsite: 'loropiana.com/en/',
      brandLogo: 'Loro Piana',
      brandIntro: '品牌简介',
      operatingHours: '周一至周五上午9点至下午6点CET（公共假期除外）周六和周日上午9点至晚上7点CET（公共假期除外）',
      customerService: '客服热线：4008 508 580',
      workingHours: '工作时间：9:00 - 22:00（春节法定节假日18:00-16:00）',
      email: '邮箱 customerservice.cn@loropiana.com',
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
