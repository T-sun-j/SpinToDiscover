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
    resetPasswordTitle: string;
    resetPasswordSuccess: string;
    resetPasswordError: string;
    invalidResetLink: string;
    resetPasswordSubmitting: string;
    resetPasswordSuccessMessage: string;
    resetPasswordRedirecting: string;
    forgotPasswordSuccessMessage: string;
    forgotPasswordErrorMessage: string;
    forgotPasswordSubmitting: string;
    forgotPasswordSuccess: string;
    loginErrorMessage: string;
    loginError: string;
    loginSubmitting: string;
    registerErrorMessage: string;
    registerError: string;
    registerSubmitting: string;
    registerSuccess: string;
    passwordMismatch: string;
    termsAnd: string;
    locationPermissionDenied: string;
    locationError: string;
    gettingLocation: string;
    defaultLocation: string;
    getUserInfoError: string;
    updateUserInfoError: string;
    updateUserInfoSuccess: string;
    noAuthInfo: string;
    avatarUploadError: string;
    avatarUploading: string;
    skipping: string;
    fileSizeError: string;
    fileTypeError: string;
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
      gettingLocation: string;
      loading: string;
      noContent: string;
      noRecommendContent: string;
      noNearbyContent: string;
      loginRequired: string;
      pagination: string;
      loadDetailFailed: string;
      loadDetailError: string;
      commentSubmitFailed: string;
      commentSubmitError: string;
      operationFailed: string;
      likeFailed: string;
      collectFailed: string;
      linkCopied: string;
      followFailed: string;
      contentNotExist: string;
      contentDeleted: string;
      loginRequiredForDetail: string;
      followed: string;
      follow: string;
      pleaseLoginFirst: string;
      videoPlayError: string;
      loadContentFailed: string;
      loadContentError: string;
      locationPermissionDenied: string;
      locationError: string;
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
    currentEmail?: string;
    passwordTooShort?: string;
    authError?: string;
    resetSuccess?: string;
    resetError?: string;
    submitting?: string;
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
  search: {
    title: string;
    back: string;
    searchConditions: {
      all: string;
      articles: string;
      users: string;
      brands: string;
    };
    keywordInput: string;
    history: string;
    deleteHistory: string;
    searchResults: string;
    users: string;
    articles: string;
    noResults: string;
    searchPlaceholder: string;
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
  common: {
    loading: string;
    retry: string;
    error: string;
    verifying: string;
  };
  personalCenter: {
    title: string;
    back: string;
    profile: {
      edit: string;
      settings: string;
    };
    menu: {
      myPage: string;
      followed: string;
      history: string;
      favorites: string;
    };
    post: {
      button: string;
      notifications: string;
    };
    logout: string;
  };
    personalPage: {
      title: string;
      brief: string;
      customerServiceHotline: string;
      workingHours: string;
      email: string;
      myPosts: string;
      follow: string;
      followed: string;
      editInfo: string;
      delete: string;
      hide: string;
      show: string;
      loading: string;
      error: string;
      noPosts: string;
      noPostsDescription: string;
      refresh: string;
      deleting: string;
      processing: string;
      deleteSuccess: string;
      deleteError: string;
      deleteProcessError: string;
      hideSuccess: string;
      showSuccess: string;
      hideError: string;
      showError: string;
      hideProcessError: string;
      showProcessError: string;
      authInfoMissing: string;
      loadPostsFailed: string;
      loadPostsError: string;
      loadUserInfoFailed: string;
      loadUserInfoError: string;
      videoPlayError: string;
      confirmDelete: string;
      confirmDeleteMessage: string;
      confirmDeleteDescription: string;
      cancel: string;
      confirm: string;
    };
    userInfo: {
      loading: string;
      error: string;
      followers: string;
      following: string;
      posts: string;
    };
  releasePage: {
    title: string;
    fieldTitle: string;
    fieldContent: string;
    location: string;
    advantageInfo: string;
    fillBrandInfo: string;
    brandProductionName: string;
    briefDescription: string;
    errorMessage: string;
    allowingComments: string;
    releaseButton: string;
    uploadMedia: string;
    video: string;
    uploadingImages: string;
    uploadingVideo: string;
    publishingContent: string;
    publishSuccess: string;
    publishError: string;
    imageUploadError: string;
    videoUploadError: string;
    retryLocation: string;
    locationError: string;
    locationParseError: string;
    locationFailed: string;
    locationPermissionDenied: string;
    locationUnavailable: string;
    locationTimeout: string;
    authInfoMissing: string;
    getUserInfoFailed: string;
    onlyOneVideoAllowed: string;
    addImage: string;
    titleRequired: string;
    contentRequired: string;
    unknownError: string;
    gettingLocation: string;
    publishProcessError: string;
    publishing: string;
    addMedia: string;
    mediaFiles: string;
  };
  favoritePage: {
    title: string;
    favoriting: string;
    follower: string;
    username: string;
    back: string;
    favoriteItem: string;
    removeFromFavorites: string;
    publisher: string;
    emptyTitle: string;
    emptyDescription: string;
    loading: string;
    error: string;
    noImage: string;
    collectedOn: string;
  };
  about: {
    title: string;
    back: string;
    introduction: string;
    belief: string;
    missionTitle: string;
    mission: string;
    valuesTitle: string;
    values: string;
    experience: string;
    motto: string;
    protectTitle: string;
    protectDescription: string;
  };
  privacy: {
    title: string;
    back: string;
    purposeTitle: string;
    purpose: string;
    designTitle: string;
    design: string;
    findingsTitle: string;
    findings: string;
    trustTitle: string;
    trust: string;
    securityTitle: string;
    security: string;
    dataCollectionTitle: string;
    dataCollection: string;
    dataUsageTitle: string;
    dataUsage: string;
    contactTitle: string;
    contact: string;
  };
  protect: {
    title: string;
    back: string;
    mainTitle: string;
    craftImageAlt: string;
    artisanImageAlt: string;
    introduction: string;
    mission: string;
    impact: string;
    donateLink: string;
    transparencyTitle: string;
    transparency: string;
  };
  history: {
    title: string;
    back: string;
    refresh: string;
    loading: string;
    error: string;
    noHistory: string;
    noHistoryDescription: string;
    noImage: string;
    viewedOn: string;
    location: string;
  };
  brandEditPage: {
    title: string;
    brand: string;
    brief: string;
    logo: string;
    officialSite: string;
    telMobile: string;
    address: string;
    location: string;
    submit: string;
    submitting: string;
    submitSuccess: string;
    submitError: string;
    loginRequired: string;
    authInfoMissing: string;
    invalidImageType: string;
    imageTooLarge: string;
    logoUploadFailed: string;
    uploading: string;
    logoUploaded: string;
    getUserInfoFailed: string;
    loading: string;
    getCurrentLocation: string;
    gettingLocation: string;
    locationError: string;
    locationFailed: string;
    locationPermissionDenied: string;
    locationUnavailable: string;
    locationTimeout: string;
    locationParseError: string;
  };

  // 关注页面
  followedPage: {
    following: string;
    follower: string;
    loading: string;
    error: string;
    refresh: string;
    noFollowing: string;
    noFollowers: string;
    noFollowingDescription: string;
    noFollowersDescription: string;
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
      resetPasswordTitle: 'Reset Password',
      resetPasswordSuccess: 'Password reset successfully!',
      resetPasswordError: 'Failed to reset password, please try again',
      invalidResetLink: 'Reset password link is invalid or expired',
      resetPasswordSubmitting: 'Resetting...',
      resetPasswordSuccessMessage: 'Password reset successfully! Redirecting to login page...',
      resetPasswordRedirecting: 'Redirecting...',
      forgotPasswordSuccessMessage: 'Reset email sent, please check your inbox',
      forgotPasswordErrorMessage: 'Failed to send reset email, please try again',
      forgotPasswordSubmitting: 'Sending...',
      forgotPasswordSuccess: 'Email sent',
      loginErrorMessage: 'Invalid email format',
      loginError: 'Login failed, please try again',
      loginSubmitting: 'Logging in...',
      registerErrorMessage: 'Registration failed, please try again',
      registerError: 'An error occurred during registration',
      registerSubmitting: 'Registering...',
      registerSuccess: 'Registration successful! Redirecting...',
      passwordMismatch: 'Passwords do not match',
      termsAnd: 'and',
      locationPermissionDenied: 'Location permission denied, using default location',
      locationError: 'Failed to get location, using default location',
      gettingLocation: 'Getting location...',
      defaultLocation: 'Default Location',
      getUserInfoError: 'Failed to get user information',
      updateUserInfoError: 'Failed to update user information',
      updateUserInfoSuccess: 'User information updated successfully',
      noAuthInfo: 'No authentication information found. Please try registering again.',
      avatarUploadError: 'Avatar upload failed',
      avatarUploading: 'Uploading avatar...',
      skipping: 'Skipping...',
      fileSizeError: 'File size too large (max 5MB)',
      fileTypeError: 'Invalid file type (only images allowed)',
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
      brandWebsite: 'ii.loropiana.com/en/',
      brandLogo: 'Loro Piana',
      brandIntro: 'Brand Introduction',
      operatingHours: 'Monday to Friday 9am to 8pm CET (excluding public holidays) Saturday and Sunday 10am to 7pm CET (excluding public holidays)',
      customerService: 'Customer Service Hotline: 4008 568 580',
      workingHours: 'Working hours: 9:00-22:00 (Spring Festival statutory holiday 10:00-16:00)',
      email: 'E-mail customerservice.cn@loropiana.com',
      gettingLocation: 'Getting location...',
      loading: 'Loading...',
      noContent: 'No Content',
      noRecommendContent: 'No recommended content, please try again later',
      noNearbyContent: 'No content found in current location, try another place!',
      loginRequired: 'Please login to view personalized content recommendations',
      pagination: 'Page {current} of {total}, {items} items total',
      loadDetailFailed: 'Failed to load details',
      loadDetailError: 'Error occurred while loading details',
      commentSubmitFailed: 'Failed to submit comment, please try again',
      commentSubmitError: 'Failed to submit comment',
      operationFailed: 'Operation failed, please try again',
      likeFailed: 'Failed to like',
      collectFailed: 'Failed to collect',
      linkCopied: 'Link copied to clipboard',
      followFailed: 'Failed to follow',
      contentNotExist: 'Content does not exist',
      contentDeleted: 'The content you are accessing may have been deleted or does not exist',
      loginRequiredForDetail: 'Please login to view content details',
      followed: 'Followed',
      follow: 'Follow',
      pleaseLoginFirst: 'Please login first',
      videoPlayError: 'Video playback failed',
      loadContentFailed: 'Failed to load content',
      loadContentError: 'Error occurred while loading content',
      locationPermissionDenied: 'Location permission denied',
      locationError: 'Failed to get location',
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
      currentEmail: 'Current Email',
      passwordTooShort: 'Password must be at least 6 characters',
      authError: 'Authentication required',
      resetSuccess: 'Password reset successfully',
      resetError: 'Password reset failed',
      submitting: 'Updating...',
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
    search: {
      title: 'Search',
      back: 'Back',
      searchConditions: {
        all: 'All',
        articles: 'Articles',
        users: 'Users',
        brands: 'Brands',
      },
      keywordInput: 'Enter keywords',
      history: 'History',
      deleteHistory: 'Delete search history',
      searchResults: 'Search Results',
      users: 'Users',
      articles: 'Articles',
      noResults: 'No results found',
      searchPlaceholder: 'Search...',
    },
    footer: {
      language: {
        en: 'English (US)',
        zh: '中文(简体)',
      },
      links: {
        about: 'About Us',
        privacy: 'Privacy Policy',
      },
      copyright: '© 2025 Spin to Discover',
    },
    common: {
      loading: 'Loading...',
      retry: 'Retry',
      error: 'Error',
      verifying: 'Verifying identity...',
    },
    personalCenter: {
      title: 'User center',
      back: 'Back',
      profile: {
        edit: 'Edit',
        settings: 'Settings',
      },
      menu: {
        myPage: 'My page',
        followed: 'Followed & Following',
        history: 'Browsing History',
        favorites: 'Favorite',
      },
      post: {
        button: 'POST',
        notifications: 'Notifications',
      },
      logout: 'Logout',
    },
    personalPage: {
      title: 'Personal Page',
      brief: 'Brief description of the personal page',
      customerServiceHotline: 'Customer Service Hotline',
      workingHours: 'Working Hours',
      email: 'Email',
      myPosts: 'My Posts',
      follow: 'Follow',
      followed: 'Followed',
      editInfo: 'Edit Info',
      delete: 'Delete',
      hide: 'Hide',
      show: 'Show',
      loading: 'Loading posts...',
      error: 'Failed to load posts',
      noPosts: 'No Posts Found',
      noPostsDescription: 'Start creating content to see your posts here.',
      refresh: 'Refresh',
      deleting: 'Deleting...',
      processing: 'Processing...',
      deleteSuccess: 'Post deleted successfully',
      deleteError: 'Failed to delete post',
      deleteProcessError: 'Unknown error occurred while deleting post',
      hideSuccess: 'Post hidden successfully',
      showSuccess: 'Post shown successfully',
      hideError: 'Failed to hide post',
      showError: 'Failed to show post',
      hideProcessError: 'Unknown error occurred while hiding post',
      showProcessError: 'Unknown error occurred while showing post',
      authInfoMissing: 'User authentication information missing',
      loadPostsFailed: 'Failed to load posts data',
      loadPostsError: 'Error occurred while loading posts data',
      loadUserInfoFailed: 'Failed to load user information',
      loadUserInfoError: 'Error occurred while loading user information',
      videoPlayError: 'Video playback failed',
      confirmDelete: 'Confirm Delete',
      confirmDeleteMessage: 'Are you sure you want to delete this post?',
      confirmDeleteDescription: 'This action cannot be undone and the post will be permanently removed.',
      cancel: 'Cancel',
      confirm: 'Confirm Delete',
    },
    userInfo: {
      loading: 'Loading user info...',
      error: 'Failed to load user info',
      followers: 'followers',
      following: 'following',
      posts: 'posts',
    },
    releasePage: {
      title: 'Release',
      fieldTitle: 'Field Title',
      fieldContent: 'Field Content',
      location: 'Location',
      advantageInfo: 'Advantage Info.',
      fillBrandInfo: 'Fill Brand Info',
      brandProductionName: 'Brand Production Name',
      briefDescription: 'Brief Description',
      errorMessage: 'Error Message',
      allowingComments: 'Allowing Comments',
      releaseButton: 'Release',
      uploadMedia: 'Upload Image/Video',
      video: 'Video',
      uploadingImages: 'Uploading images...',
      uploadingVideo: 'Uploading video...',
      publishingContent: 'Publishing content...',
      publishSuccess: 'Published successfully!',
      publishError: 'Publishing failed, please try again',
      imageUploadError: 'Image upload failed',
      videoUploadError: 'Video upload failed',
      retryLocation: 'Retry Location',
      locationError: 'Your browser does not support geolocation',
      locationParseError: 'Location obtained but address parsing failed',
      locationFailed: 'Failed to get location',
      locationPermissionDenied: 'User denied location request',
      locationUnavailable: 'Location information unavailable',
      locationTimeout: 'Location request timeout',
      authInfoMissing: 'User authentication information missing',
      getUserInfoFailed: 'Failed to get user information',
      onlyOneVideoAllowed: 'Only one video is allowed',
      addImage: 'Add Image',
      titleRequired: 'Title cannot be empty',
      contentRequired: 'Content cannot be empty',
      unknownError: 'Unknown error',
      gettingLocation: 'Getting location...',
      publishProcessError: 'Error occurred during publishing',
      publishing: 'Publishing...',
      addMedia: 'Add Media',
      mediaFiles: 'media files',
    },
    favoritePage: {
      title: 'Favorite',
      favoriting: 'Following',
      follower: 'Follower',
      username: 'Username',
      back: 'Back',
      favoriteItem: 'Favorite item',
      removeFromFavorites: 'Remove from favorites',
      publisher: 'Publisher',
      emptyTitle: 'No favorites yet',
      emptyDescription: 'Start exploring and save your favorite places and content to see them here.',
      loading: 'Loading...',
      error: 'Failed to load favorites',
      noImage: 'No image',
      collectedOn: 'Collected on',
    },
    about: {
      title: 'About Us',
      back: 'Back',
      introduction: 'Spin to Discover is not just a platform - it is a stage for meaningful connections.',
      belief: 'We believe that every brand and every artist has a story, a vision, and a spark of soul that deserves to be seen.',
      missionTitle: 'Our Mission',
      mission: 'Our mission is to bring together independent creators, artisans, designers, and artists from around the world, curating a global map of light - where every point you see is a story waiting to be discovered.',
      valuesTitle: 'Our Values',
      values: 'Here, we value originality, craftsmanship, creativity, and authenticity. Every brand and artist that joins Spin to Discover is chosen for their unique identity, meaningful vision, and cultural significance.',
      experience: 'By spinning the globe, you are not just exploring products or artworks - you are discovering stories, dreams, and the people behind them.',
      motto: 'Spin. Discover. Connect. Because the world shines brighter when we share our light.',
      protectTitle: 'Together, let\'s protect what truly matters',
      protectDescription: 'Spin to Protect is the charitable initiative of Spin to Discover',
    },
    privacy: {
      title: 'Privacy Policy',
      back: 'Back',
      purposeTitle: 'Purpose',
      purpose: 'The purpose of this paper is to analyze the effect of privacy and perceived security on the level of trust shown by the consumer in the internet. It also aims to reveal and test the close relationship between the trust in a web site and the degree of loyalty to it.',
      designTitle: 'Design/Methodology/Approach',
      design: 'This study employs a comprehensive approach to examine the relationship between privacy, security, trust, and user loyalty in online platforms.',
      findingsTitle: 'Findings',
      findings: 'The research reveals that an individual\'s loyalty to a web site is closely linked to the levels of trust. Trust affects intention to buy, effective purchasing behavior, preference, cost and frequency of visits, and profitability.',
      trustTitle: 'Trust and Loyalty',
      trust: 'Trust in the internet is particularly influenced by the security perceived by consumers. When users feel secure about their personal information, they are more likely to engage with the platform and develop loyalty.',
      securityTitle: 'Security Measures',
      security: 'We implement industry-standard security measures to protect your personal information, including encryption, secure data transmission, and regular security audits.',
      dataCollectionTitle: 'Data Collection',
      dataCollection: 'We collect only the information necessary to provide our services and improve your experience. This includes account information, usage data, and preferences you choose to share.',
      dataUsageTitle: 'Data Usage',
      dataUsage: 'Your data is used to personalize your experience, provide customer support, and improve our services. We never sell your personal information to third parties.',
      contactTitle: 'Contact Us',
      contact: 'If you have any questions about this Privacy Policy, please contact us at privacy@spintodiscover.com',
    },
    protect: {
      title: 'Spin to Protect',
      back: 'Back',
      mainTitle: 'Together, let\'s protect what truly matters',
      craftImageAlt: 'Hands working on traditional craft',
      artisanImageAlt: 'Artisan woman in her workshop',
      introduction: 'Spin to Protect is the charitable initiative of Spin to Discover, inviting you to contribute and transform your brand\'s light into real-world impact.',
      mission: 'All donations will support disaster relief, education, and essential aid for underserved communities through trusted global partners. We commit to 100% transparency—every donation will be tracked and reported, and you may choose your preferred cause or allow the platform to allocate it where it\'s most needed.',
      impact: 'No matter the amount, your contribution is a beam of hope that brings light to the world\'s darkest corners.',
      donateLink: 'How to donate?',
      transparencyTitle: 'Transparency Commitment',
      transparency: 'We provide detailed reports on how every donation is used, ensuring complete transparency in our charitable activities.',
    },
    history: {
      title: 'Browsing History',
      back: 'Back',
      refresh: 'Refresh',
      loading: 'Loading history...',
      error: 'Failed to load history',
      noHistory: 'No History Found',
      noHistoryDescription: 'Your browsing history will appear here once you start exploring content.',
      noImage: 'No Image',
      viewedOn: 'Viewed on',
      location: 'Location',
    },
    brandEditPage: {
      title: 'My page',
      brand: 'Brand',
      brief: 'Brief',
      logo: 'Logo',
      officialSite: 'Official Site',
      telMobile: 'Tel/Mobile',
      address: 'Work Hours',
      location: 'Location',
      submit: 'Submit',
      submitting: 'Submitting...',
      submitSuccess: 'Submitted successfully, redirecting...',
      submitError: 'Submission failed',
      loginRequired: 'Please login first',
      authInfoMissing: 'User authentication information missing',
      invalidImageType: 'Please select a valid image file',
      imageTooLarge: 'Image file is too large (max 10MB)',
      logoUploadFailed: 'Logo upload failed',
      uploading: 'Uploading...',
      logoUploaded: 'Logo uploaded successfully',
      getUserInfoFailed: 'Failed to get user information',
      loading: 'Loading...',
      getCurrentLocation: 'Get Current Location',
      gettingLocation: 'Getting location...',
      locationError: 'Your browser does not support geolocation',
      locationFailed: 'Failed to get location',
      locationPermissionDenied: 'User denied location request',
      locationUnavailable: 'Location information unavailable',
      locationTimeout: 'Location request timeout',
      locationParseError: 'Location obtained but address parsing failed',
    },
    followedPage: {
      following: 'Following',
      follower: 'Followers',
      loading: 'Loading...',
      error: 'Failed to load data',
      refresh: 'Refresh',
      noFollowing: 'No Following',
      noFollowers: 'No Followers',
      noFollowingDescription: 'You haven\'t followed anyone yet. Start following users to see them here.',
      noFollowersDescription: 'No one is following you yet. Share great content to attract followers.',
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
      resetPasswordTitle: '重置密码',
      resetPasswordSuccess: '密码重置成功！',
      resetPasswordError: '重置密码失败，请重试',
      invalidResetLink: '重置密码链接无效或已过期',
      resetPasswordSubmitting: '重置中...',
      resetPasswordSuccessMessage: '密码重置成功！正在跳转到登录页面...',
      resetPasswordRedirecting: '跳转中...',
      forgotPasswordSuccessMessage: '重置邮件已发送，请检查您的邮箱',
      forgotPasswordErrorMessage: '发送重置邮件失败，请重试',
      forgotPasswordSubmitting: '发送中...',
      forgotPasswordSuccess: '邮件已发送',
      loginErrorMessage: '邮箱格式无效',
      loginError: '登录失败，请重试',
      loginSubmitting: '登录中...',
      registerErrorMessage: '注册失败，请重试',
      registerError: '注册过程中发生错误',
      registerSubmitting: '注册中...',
      registerSuccess: '注册成功！正在跳转...',
      passwordMismatch: '密码不匹配',
      termsAnd: '和',
      locationPermissionDenied: '位置权限被拒绝，使用默认位置',
      locationError: '获取位置失败，使用默认位置',
      gettingLocation: '获取位置中...',
      defaultLocation: '默认位置',
      getUserInfoError: '获取用户信息失败',
      updateUserInfoError: '更新用户信息失败',
      updateUserInfoSuccess: '用户信息更新成功',
      noAuthInfo: '未找到认证信息，请重新注册。',
      avatarUploadError: '头像上传失败',
      avatarUploading: '正在上传头像...',
      skipping: '正在跳过...',
      fileSizeError: '文件大小过大（最大5MB）',
      fileTypeError: '无效的文件类型（仅支持图片）',
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
      brandWebsite: 'ii.loropiana.com/en/',
      brandLogo: 'Loro Piana',
      brandIntro: '品牌简介',
      operatingHours: '周一至周五上午9点至晚上8点CET（公共假期除外）周六和周日上午10点至晚上7点CET（公共假期除外）',
      customerService: '客服热线：4008 568 580',
      workingHours: '工作时间：9:00-22:00（春节法定节假日10:00-16:00）',
      email: '邮箱 customerservice.cn@loropiana.com',
      gettingLocation: '正在获取位置信息...',
      loading: '加载中...',
      noContent: '暂无内容',
      noRecommendContent: '暂无推荐内容，请稍后再试',
      noNearbyContent: '当前位置暂无发现内容，换个地方试试吧！',
      loginRequired: '请先登录以查看个性化内容推荐',
      pagination: '第 {current} 页，共 {total} 页，总计 {items} 条内容',
      loadDetailFailed: '加载详情失败',
      loadDetailError: '加载详情时发生错误',
      commentSubmitFailed: '评论提交失败，请重试',
      commentSubmitError: '评论提交失败',
      operationFailed: '操作失败，请重试',
      likeFailed: '点赞失败',
      collectFailed: '收藏失败',
      linkCopied: '链接已复制到剪贴板',
      followFailed: '关注失败',
      contentNotExist: '内容不存在',
      contentDeleted: '您访问的内容可能已被删除或不存在',
      loginRequiredForDetail: '请先登录以查看内容详情',
      followed: '已关注',
      follow: '关注',
      pleaseLoginFirst: '请先登录',
      videoPlayError: '视频播放失败',
      loadContentFailed: '加载内容失败',
      loadContentError: '加载内容时发生错误',
      locationPermissionDenied: '用户拒绝了地理位置权限',
      locationError: '获取地理位置失败',
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
      currentEmail: '当前邮箱',
      passwordTooShort: '密码至少需要6位字符',
      authError: '需要身份验证',
      resetSuccess: '密码重置成功',
      resetError: '密码重置失败',
      submitting: '更新中...',
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
    search: {
      title: '搜索',
      back: '返回',
      searchConditions: {
        all: '全部',
        articles: '文章',
        users: '用户',
        brands: '品牌',
      },
      keywordInput: '输入关键词',
      history: '历史记录',
      deleteHistory: '删除搜索历史',
      searchResults: '搜索结果',
      users: '用户',
      articles: '文章',
      noResults: '未找到结果',
      searchPlaceholder: '搜索...',
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
    common: {
      loading: '加载中...',
      retry: '重试',
      error: '错误',
      verifying: '正在验证身份...',
    },
    personalCenter: {
      title: '个人中心',
      back: '返回',
      profile: {
        edit: '修改',
        settings: '设置',
      },
      menu: {
        myPage: '我的页面',
        followed: '关注与被关注',
        history: '浏览记录',
        favorites: '我的收藏',
      },
      post: {
        button: '发布',
        notifications: '通知',
      },
      logout: '退出登录',
    },
    personalPage: {
      title: '个人页面',
      brief: '个人页面的简要描述',
      customerServiceHotline: '客服热线',
      workingHours: '工作时间',
      email: '邮箱',
      myPosts: '我的帖子',
      follow: '关注',
      followed: '已关注',
      editInfo: '编辑信息',
      delete: '删除',
      hide: '隐藏',
      show: '显示',
      loading: '加载帖子中...',
      error: '加载帖子失败',
      noPosts: '暂无帖子',
      noPostsDescription: '开始创建内容，您的帖子将显示在这里。',
      refresh: '刷新',
      deleting: '删除中...',
      processing: '处理中...',
      deleteSuccess: '作品删除成功',
      deleteError: '删除作品失败',
      deleteProcessError: '删除作品时发生未知错误',
      hideSuccess: '作品隐藏成功',
      showSuccess: '作品显示成功',
      hideError: '隐藏作品失败',
      showError: '显示作品失败',
      hideProcessError: '隐藏作品时发生未知错误',
      showProcessError: '显示作品时发生未知错误',
      authInfoMissing: '用户认证信息缺失',
      loadPostsFailed: '加载作品数据失败',
      loadPostsError: '加载作品数据时发生错误',
      loadUserInfoFailed: '加载用户信息失败',
      loadUserInfoError: '加载用户信息时发生错误',
      videoPlayError: '视频播放失败',
      confirmDelete: '确认删除',
      confirmDeleteMessage: '确定要删除这个作品吗？',
      confirmDeleteDescription: '此操作不可撤销，删除后将无法恢复。',
      cancel: '取消',
      confirm: '确认删除',
    },
    userInfo: {
      loading: '加载用户信息中...',
      error: '加载用户信息失败',
      followers: '关注者',
      following: '关注中',
      posts: '帖子',
    },
    releasePage: {
      title: '发布页面',
      fieldTitle: '字段标题',
      fieldContent: '字段内容',
      location: '位置',
      advantageInfo: '优势信息',
      fillBrandInfo: '填写品牌信息',
      brandProductionName: '品牌生产名称',
      briefDescription: '简要描述',
      errorMessage: '错误信息',
      allowingComments: '允许评论',
      releaseButton: '发布按钮',
      uploadMedia: '上传图片/视频',
      video: '视频',
      uploadingImages: '正在上传图片...',
      uploadingVideo: '正在上传视频...',
      publishingContent: '正在发布内容...',
      publishSuccess: '发布成功！',
      publishError: '发布失败，请重试',
      imageUploadError: '图片上传失败',
      videoUploadError: '视频上传失败',
      retryLocation: '重新获取位置',
      locationError: '您的浏览器不支持地理位置功能',
      locationParseError: '位置获取成功，但地址解析失败',
      locationFailed: '获取位置失败',
      locationPermissionDenied: '用户拒绝了位置请求',
      locationUnavailable: '位置信息不可用',
      locationTimeout: '获取位置超时',
      authInfoMissing: '用户认证信息缺失',
      getUserInfoFailed: '获取用户信息失败',
      onlyOneVideoAllowed: '只能上传一个视频',
      addImage: '添加图片',
      titleRequired: '标题不能为空',
      contentRequired: '内容不能为空',
      unknownError: '未知错误',
      gettingLocation: '获取位置中...',
      publishProcessError: '发布过程中发生错误',
      publishing: '发布中...',
      addMedia: '添加媒体',
      mediaFiles: '个媒体文件',
    },
    favoritePage: {
      title: '我的收藏',
      favoriting: '关注',
      follower: '粉丝',
      username: '用户名',
      back: '返回',
      favoriteItem: '收藏项目',
      removeFromFavorites: '从收藏中移除',
      publisher: '发布者',
      emptyTitle: '暂无收藏',
      emptyDescription: '开始探索并保存您喜欢的地点和内容，它们将显示在这里。',
      loading: '加载中...',
      error: '加载收藏失败',
      noImage: '无图片',
      collectedOn: '收藏于',
    },
    about: {
      title: '关于我们',
      back: '返回',
      introduction: 'Spin to Discover 不仅仅是一个平台——它是有意义连接的舞台。',
      belief: '我们相信每个品牌和每位艺术家都有自己的故事、愿景和值得被看见的灵魂火花。',
      missionTitle: '我们的使命',
      mission: '我们的使命是将来自世界各地的独立创作者、工匠、设计师和艺术家聚集在一起，策划一个全球光明地图——您看到的每个点都是一个等待被发现的故事。',
      valuesTitle: '我们的价值观',
      values: '在这里，我们重视原创性、工艺、创造力和真实性。每个加入 Spin to Discover 的品牌和艺术家都因其独特的身份、有意义的愿景和文化意义而被选中。',
      experience: '通过旋转地球仪，您不仅仅是在探索产品或艺术品——您正在发现故事、梦想和背后的人们。',
      motto: '旋转。发现。连接。因为当我们分享光明时，世界会更加明亮。',
      protectTitle: '让我们一起保护真正重要的东西',
      protectDescription: 'Spin to Protect 是 Spin to Discover 的慈善倡议',
    },
    privacy: {
      title: '隐私政策',
      back: '返回',
      purposeTitle: '目的',
      purpose: '本文的目的是分析隐私和感知安全对消费者在互联网上表现出的信任水平的影响。它还旨在揭示和测试网站信任度与忠诚度之间的密切关系。',
      designTitle: '设计/方法/方法',
      design: '本研究采用综合方法来检验在线平台中隐私、安全、信任和用户忠诚度之间的关系。',
      findingsTitle: '发现',
      findings: '研究显示，个人对网站的忠诚度与信任水平密切相关。信任影响购买意图、有效购买行为、偏好、访问成本和频率以及盈利能力。',
      trustTitle: '信任与忠诚',
      trust: '对互联网的信任特别受到消费者感知安全的影响。当用户对其个人信息感到安全时，他们更有可能与平台互动并发展忠诚度。',
      securityTitle: '安全措施',
      security: '我们实施行业标准的安全措施来保护您的个人信息，包括加密、安全数据传输和定期安全审计。',
      dataCollectionTitle: '数据收集',
      dataCollection: '我们只收集提供服务和改善您体验所需的信息。这包括账户信息、使用数据和您选择分享的偏好。',
      dataUsageTitle: '数据使用',
      dataUsage: '您的数据用于个性化您的体验、提供客户支持和改善我们的服务。我们从不向第三方出售您的个人信息。',
      contactTitle: '联系我们',
      contact: '如果您对此隐私政策有任何疑问，请通过 privacy@spintodiscover.com 联系我们',
    },
    protect: {
      title: 'Spin to Protect',
      back: '返回',
      mainTitle: '让我们一起保护真正重要的东西',
      craftImageAlt: '制作传统工艺品的双手',
      artisanImageAlt: '工作坊中的女工匠',
      introduction: 'Spin to Protect 是 Spin to Discover 的慈善倡议，邀请您贡献并将您品牌的光明转化为现实世界的影响。',
      mission: '所有捐款将通过可信的全球合作伙伴支持救灾、教育和为服务不足社区提供基本援助。我们承诺100%透明度——每笔捐款都将被跟踪和报告，您可以选择您偏好的事业或让平台将其分配到最需要的地方。',
      impact: '无论金额多少，您的贡献都是为世界最黑暗角落带来光明的希望之光。',
      donateLink: '如何捐款？',
      transparencyTitle: '透明度承诺',
      transparency: '我们提供每笔捐款使用情况的详细报告，确保我们慈善活动的完全透明度。',
    },
    history: {
      title: '浏览记录',
      back: '返回',
      refresh: '刷新',
      loading: '加载历史记录中...',
      error: '加载历史记录失败',
      noHistory: '暂无浏览记录',
      noHistoryDescription: '当您开始探索内容时，您的浏览记录将显示在这里。',
      noImage: '无图片',
      viewedOn: '浏览于',
      location: '位置',
    },
    brandEditPage: {
      title: '我的页面',
      brand: '品牌',
      brief: '简介',
      logo: '标志',
      officialSite: '官方网站',
      telMobile: '电话/手机',
      address: '工作时间',
      location: '位置',
      submit: '提交',
      submitting: '提交中...',
      submitSuccess: '提交成功，正在跳转...',
      submitError: '提交失败',
      loginRequired: '请先登录',
      authInfoMissing: '用户认证信息缺失',
      invalidImageType: '请选择有效的图片文件',
      imageTooLarge: '图片文件过大（最大10MB）',
      logoUploadFailed: 'Logo上传失败',
      uploading: '上传中...',
      logoUploaded: 'Logo上传成功',
      getUserInfoFailed: '获取用户信息失败',
      loading: '加载中...',
      getCurrentLocation: '获取当前位置',
      gettingLocation: '获取位置中...',
      locationError: '您的浏览器不支持地理位置功能',
      locationFailed: '获取位置失败',
      locationPermissionDenied: '用户拒绝了位置请求',
      locationUnavailable: '位置信息不可用',
      locationTimeout: '获取位置超时',
      locationParseError: '位置获取成功，但地址解析失败',
    },
    followedPage: {
      following: '关注',
      follower: '粉丝',
      loading: '加载中...',
      error: '加载数据失败',
      refresh: '刷新',
      noFollowing: '暂无关注',
      noFollowers: '暂无粉丝',
      noFollowingDescription: '您还没有关注任何人。开始关注用户以在这里看到他们。',
      noFollowersDescription: '还没有人关注您。分享精彩内容来吸引粉丝吧。',
    },
  },
};

export const defaultLanguage: Language = 'en';
