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
      recommend: string;
      following: string;
      nearby: string;
      comments: string;
      inputComments: string;
      send: string;
      reply: string;
      showAll: string;
      collapse: string;
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
      operationFailed: string;
      linkCopied: string;
      contentNotExist: string;
      contentDeleted: string;
      loginRequiredForDetail: string;
      followed: string;
      follow: string;
      pleaseLoginFirst: string;
      clearFilter: string;
      noComments: string;
      submittingComment: string;
      replyingTo: string;
      share: string;
      readMore: string;
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
      brand: string;
      brief: string;
      customerServiceHotline: string;
      workHour: string;
      email: string;
      address: string;
      online: string;
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
      followSuccess: string;
      unfollowSuccess: string;
      followError: string;
      unfollowError: string;
      followProcessError: string;
      unfollowProcessError: string;
      following: string;
      userNotFound: string;
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
    shopUrl: string;
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
    lastUpdated: string;
    introduction: string;
    section1Title: string;
    section1Subtitle1: string;
    section1Subtitle1Items: string[];
    section1Subtitle2: string;
    section1Subtitle2Items: string[];
    section1Subtitle3: string;
    section1Subtitle3Items: string[];
    section2Title: string;
    section2Items: string[];
    section2Note: string;
    section3Title: string;
    section3Items: string[];
    section3Note: string;
    section4Title: string;
    section4Items: string[];
    section5Title: string;
    section5Items: string[];
    section6Title: string;
    section6Content: string;
    section7Title: string;
    section7Content: string;
    mediaLicenseTitle: string;
    mediaLicenseIntro: string;
    mediaLicenseSection1Title: string;
    mediaLicenseSection1Content: string;
    mediaLicenseSection1Items: string[];
    mediaLicenseSection1Note: string;
    mediaLicenseSection2Title: string;
    mediaLicenseSection2Items: string[];
    mediaLicenseSection3Title: string;
    mediaLicenseSection3Items: string[];
    mediaLicenseSection4Title: string;
    mediaLicenseSection4Content: string;
    mediaLicenseSection5Title: string;
    mediaLicenseSection5Items: string[];
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
    workHour: string;
    email: string;
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
    brandRequired: string;
    imageFormatNotSupported: string;
    workHourRequired: string;
    emailRequired: string;
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
  regionSelect: {
    title: string;
    searching: string;
    confirm: string;
    searchHint: string;
    searchDescription: string;
    noResults: string;
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
      spinToDiscover: 'Explore',
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
      locationPermissionDenied: 'Location access is turned off. Please click "Retry" to request permission again, or enable location access in your browser settings.',
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
      recommend: 'Recommend',
      following: 'Following',
      nearby: 'Nearby',
      comments: 'Comments',
      inputComments: 'Input your comments',
      send: 'Send',
      reply: 'Reply',
      showAll: 'Show All',
      collapse: 'Collapse',
      gettingLocation: 'Getting location...',
      loading: 'Loading...',
      noContent: 'No Content',
      noRecommendContent: 'No recommended content, please try again later',
      noNearbyContent: 'No content found in current location, try another place!',
      loginRequired: 'Please login to view personalized content recommendations',
      pagination: '{items} items total',
      loadDetailFailed: 'Failed to load details',
      loadDetailError: 'Error occurred while loading details',
      commentSubmitFailed: 'Failed to submit comment, please try again',
      operationFailed: 'Operation failed, please try again',
      linkCopied: 'Link copied to clipboard',
      contentNotExist: '',
      contentDeleted: 'The content you are accessing may have been deleted or does not exist',
      loginRequiredForDetail: 'Please login to view content details',
      followed: 'Followed',
      follow: 'Follow',
      pleaseLoginFirst: 'Please login first',
      clearFilter: 'Clear filter',
      noComments: 'No comments yet',
      submittingComment: 'Sending...',
      replyingTo: 'Replying to',
      share: 'Share',
      readMore: 'Read More >',
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
        articles: 'Posts',
        users: 'Users',
        brands: 'Brands',
      },
      keywordInput: 'Enter keywords',
      history: 'History',
      deleteHistory: 'Delete search history',
      searchResults: 'Search Results',
      users: 'Users',
      articles: 'Posts',
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
      copyright: '© 2025',
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
      brand: 'Brand',
      brief: 'Brief',
      customerServiceHotline: 'Tel/Mobile',
      address: 'Address',
      workHour: 'Work Hours',
      email: 'E-mail',
      online: 'Shop Now',
      myPosts: 'Posts',
      follow: 'Follow',
      followed: 'Followed',
      editInfo: 'Edit Info',
      delete: 'Delete',
      hide: 'Hide',
      show: 'Show',
      loading: 'Loading posts...',
      error: 'Failed to load posts',
      noPosts: 'No Posts Yet',
      noPostsDescription: 'Share a moment, a story, or something you’ve discovered.',
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
      followSuccess: 'Followed successfully',
      unfollowSuccess: 'Unfollowed successfully',
      followError: 'Failed to follow',
      unfollowError: 'Failed to unfollow',
      followProcessError: 'Error occurred while following',
      unfollowProcessError: 'Error occurred while unfollowing',
      following: 'Following',
      userNotFound: 'User not found',
    },
    userInfo: {
      loading: 'Loading user info...',
      error: 'Failed to load user info',
      followers: 'followers',
      following: 'following',
      posts: 'posts',
    },
    releasePage: {
      title: 'Post',
      fieldTitle: 'Write a clear title for your post',
      fieldContent: 'Share your story, insight, or creation',
      location: 'Location',
      advantageInfo: 'Advantage Info.',
      fillBrandInfo: 'Fill in with brand information',
      brandProductionName: 'Product or collection name',
      briefDescription: 'Highlight the unique features or craftsmanship',
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
      locationPermissionDenied: 'Location access is turned off. Please click "Retry" to request permission again, or enable location access in your browser settings.',
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
      shopUrl: 'Online shop',
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
      introduction: 'SpinLinX is not just a platform - it is a stage for meaningful connections.',
      belief: 'We believe that every brand and every artist has a story, a vision, and a spark of soul that deserves to be seen.',
      missionTitle: 'Our Mission',
      mission: 'Our mission is to bring together independent creators, artisans, designers, and artists from around the world, curating a global map of light - where every point you see is a story waiting to be discovered.',
      valuesTitle: 'Our Values',
      values: 'Here, we value originality, craftsmanship, creativity, and authenticity. Every brand and artist that joins SpinLinX is chosen for their unique identity, meaningful vision, and cultural significance.',
      experience: 'By spinning the globe, you are not just exploring products or artworks - you are discovering stories, dreams, and the people behind them.',
      motto: 'SpinLinX Because the world shines brighter when we share our light.',
      protectTitle: 'Together, let\'s protect what truly matters',
      protectDescription: 'Spin to Protect is the charitable initiative of SpinLinX',
    },
    privacy: {
      title: 'SpinLinX Privacy Policy',
      back: 'Back',
      lastUpdated: 'Last Updated: 2025',
      introduction: 'SpinLinX ("The Orbit Tree Limited") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information.',
      section1Title: '1. Information We Collect',
      section1Subtitle1: '1.1 Information You Provide',
      section1Subtitle1Items: [
        'Name / Username',
        'Profile photo',
        'Brand information (brand name, brief, logo)',
        'Text, photos, videos, comments you upload',
        'Contact details (phone, email), address (with permission)',
      ],
      section1Subtitle2: '1.2 Automatically Collected Information',
      section1Subtitle2Items: [
        'Device type & OS version',
        'IP address, security logs',
        'Usage data: browsing, clicks, time on page',
        'Location data (with permission)',
      ],
      section1Subtitle3: '1.3 Information from Third Parties',
      section1Subtitle3Items: [
        'Authorized data from third-party login providers',
      ],
      section2Title: '2. How We Use Your Information',
      section2Items: [
        'Provide, operate, and improve the SpinLinX platform',
        'Personalize recommendations',
        'Visualize global "Light Points Map" (no personal data revealed)',
        'Display brand pages and user posts',
        'Ensure account and platform security',
        'Customer support',
        'Comply with legal obligations',
      ],
      section2Note: 'We do NOT sell any personal data.',
      section3Title: '3. Information Sharing',
      section3Items: [
        'You give explicit consent',
        'Required by law or authorities',
        'With service partners (cloud storage, moderation) to the minimum necessary extent',
      ],
      section3Note: 'Partners may not use your data for independent purposes.',
      section4Title: '4. Data Storage & Security',
      section4Items: [
        'Encrypted data storage',
        'Encrypted transmission (HTTPS/SSL/TLS)',
        'Multi-layer access control',
        'Mandatory user notification in case of a security incident',
      ],
      section5Title: '5. Your Rights',
      section5Items: [
        'Edit or delete your profile',
        'Remove uploaded content',
        'Withdraw permissions at any time',
        'Request account deletion',
        'Request data access or export (where applicable)',
      ],
      section6Title: '6. Protection of Minors',
      section6Content: 'Users under 18 must use SpinLinX under guardian supervision.',
      section7Title: '7. Policy Updates',
      section7Content: 'We may update this policy as needed and notify users through the app.',
      mediaLicenseTitle: 'Media Usage License Agreement',
      mediaLicenseIntro: 'By uploading any content to SpinLinX, you understand and agree to this license.',
      mediaLicenseSection1Title: '1. License Grant',
      mediaLicenseSection1Content: 'You grant SpinLinX a: Worldwide, royalty-free, sublicensable, transferable, non-exclusive license for purposes including:',
      mediaLicenseSection1Items: [
        'Display within the platform',
        'Recommendation modules, featured sections',
        'Discover / Light Points visualization',
        'Platform demonstrations, tutorials, and non-commercial promotion',
        'Brand and content aggregation',
      ],
      mediaLicenseSection1Note: 'Any commercial use beyond this scope requires separate written consent.',
      mediaLicenseSection2Title: '2. Ownership',
      mediaLicenseSection2Items: [
        'You retain full copyright to your creations',
        'SpinLinX does not claim ownership',
        'You guarantee your content does not infringe any rights',
      ],
      mediaLicenseSection3Title: '3. Duration',
      mediaLicenseSection3Items: [
        'Effective upon upload',
        'Ends when you delete the content or close your account',
        'Backup versions will be cleared within reasonable time',
      ],
      mediaLicenseSection4Title: '4. Revocation',
      mediaLicenseSection4Content: 'Content deletion terminates the license. Account deletion terminates all licenses.',
      mediaLicenseSection5Title: '5. Platform Commitments',
      mediaLicenseSection5Items: [
        'Alter or distort your content',
        'Use it in commercial advertising without approval',
        'Use it in harmful or inappropriate contexts',
        'Violate copyright, privacy, or likeness rights',
      ],
    },
    protect: {
      title: 'Spin to Protect',
      back: 'Back',
      mainTitle: 'Together, let\'s protect what truly matters',
      craftImageAlt: 'Hands working on traditional craft',
      artisanImageAlt: 'Artisan woman in her workshop',
      introduction: 'Spin to Protect is the charitable initiative of SpinLinX, inviting you to contribute and transform your brand\'s light into real-world impact.',
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
      brand: 'Enter your brand or creator name',
      brief: 'Describe your story, vision, or whatmakes your brand unique',
      logo: 'Logo',
      officialSite: 'Website link (optional)',
      telMobile: 'Your contact number',
      address: 'Store or office address',
      workHour: 'Business hours (e.g.9:00-13:00)',
      email: 'Business email for inquiries',
      location: 'Location',
      submit: 'Submit',
      submitting: 'Submitting...',
      submitSuccess: 'Submitted successfully, redirecting...',
      submitError: 'Submission failed',
      loginRequired: 'Please login first',
      authInfoMissing: 'User authentication information missing',
      invalidImageType: 'Please select a valid image file',
      imageTooLarge: 'Image file is too large (max 10MB)',
      imageFormatNotSupported: 'Image format not supported. Please select a valid image file (JPG, PNG, etc.)',
      logoUploadFailed: 'Logo upload failed',
      uploading: 'Uploading...',
      logoUploaded: 'Logo uploaded successfully',
      getUserInfoFailed: 'Failed to get user information',
      loading: 'Loading...',
      getCurrentLocation: 'Get Current Location',
      gettingLocation: 'Getting location...',
      locationError: 'Your browser does not support geolocation',
      locationFailed: 'Failed to get location',
      locationPermissionDenied: 'Location access is turned off. Please click "Retry" to request permission again, or enable location access in your browser settings.',
      locationUnavailable: 'Location information unavailable',
      locationTimeout: 'Location request timeout',
      locationParseError: 'Location obtained but address parsing failed',
      brandRequired: 'Brand name is required',
      workHourRequired: 'Work hours are required',
      emailRequired: 'Email is required',
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
    regionSelect: {
      title: 'Region Select',
      searching: 'Searching...',
      confirm: 'Confirm',
      searchHint: 'Search for a city',
      searchDescription: 'Enter the name of a city to find and select it',
      noResults: 'No cities found',
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
      spinToDiscover: '立即探索',
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
      locationPermissionDenied: '位置权限已关闭。请点击"重试"再次请求权限，或在浏览器设置中启用位置访问权限。',
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
      recommend: '推荐',
      following: '关注',
      nearby: '附近',
      comments: '评论',
      inputComments: '输入您的评论',
      send: '发送',
      reply: '回复',
      showAll: '显示全部',
      collapse: '收起',
      gettingLocation: '正在获取位置信息...',
      loading: '加载中...',
      noContent: '暂无内容',
      noRecommendContent: '暂无推荐内容，请稍后再试',
      noNearbyContent: '当前位置暂无发现内容，换个地方试试吧！',
      loginRequired: '请先登录以查看个性化内容推荐',
      pagination: '总计 {items} 条内容',
      loadDetailFailed: '加载详情失败',
      loadDetailError: '加载详情时发生错误',
      commentSubmitFailed: '评论提交失败，请重试',
      operationFailed: '操作失败，请重试',
      linkCopied: '链接已复制到剪贴板',
      contentNotExist: '暂不支持查看',
      contentDeleted: '您访问的内容可能已被删除或不存在',
      loginRequiredForDetail: '请先登录以查看内容详情',
      followed: '已关注',
      follow: '关注',
      pleaseLoginFirst: '请先登录',
      clearFilter: '清除筛选',
      noComments: '暂无评论',
      submittingComment: '发送中...',
      replyingTo: '回复',
      share: '分享',
      readMore: '阅读更多 >',
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
      copyright: '© 2025 ',
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
      brand: '品牌',
      brief: '简介',
      customerServiceHotline: '客服热线',
      workHour: '工作时间',
      address: '地址',
      email: '邮箱',
      online: '立即访问',
      myPosts: '我的帖子',
      follow: '关注',
      followed: '已关注',
      editInfo: '编辑信息',
      delete: '删除',
      hide: '隐藏',
      show: '显示',
      loading: '加载内容中...',
      error: '加载内容失败',
      noPosts: '暂无内容',
      noPostsDescription: '分享此刻、故事，或你发现的美好。',
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
      followSuccess: '已关注',
      unfollowSuccess: '已取消关注',
      followError: '关注失败',
      unfollowError: '取消关注失败',
      followProcessError: '关注时发生错误',
      unfollowProcessError: '取消关注时发生错误',
      following: '已关注',
      userNotFound: '用户不存在',
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
      locationPermissionDenied: '位置权限已关闭。请点击"重试"再次请求权限，或在浏览器设置中启用位置访问权限。',
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
      shopUrl: '在线商城',
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
      introduction: 'SpinLinX 不仅仅是一个平台——它是有意义连接的舞台。',
      belief: '我们相信每个品牌和每位艺术家都有自己的故事、愿景和值得被看见的灵魂火花。',
      missionTitle: '我们的使命',
      mission: '我们的使命是将来自世界各地的独立创作者、工匠、设计师和艺术家聚集在一起，策划一个全球光明地图——您看到的每个点都是一个等待被发现的故事。',
      valuesTitle: '我们的价值观',
      values: '在这里，我们重视原创性、工艺、创造力和真实性。每个加入 SpinLinX 的品牌和艺术家都因其独特的身份、有意义的愿景和文化意义而被选中。',
      experience: '通过旋转地球仪，您不仅仅是在探索产品或艺术品——您正在发现故事、梦想和背后的人们。',
      motto: 'SpinLinX。因为当我们分享光明时，世界会更加明亮。',
      protectTitle: '让我们一起保护真正重要的东西',
      protectDescription: 'Spin to Protect 是 SpinLinX 的慈善倡议',
    },
    privacy: {
      title: 'SpinLinX 隐私条款',
      back: '返回',
      lastUpdated: '最后更新：2025',
      introduction: 'SpinLinX（"The Orbit Tree Limited"）致力于保护用户的隐私。本隐私条款说明我们如何收集、使用、存储及保护您的个人信息。',
      section1Title: '一、我们收集的信息',
      section1Subtitle1: '1. 您主动提供的信息',
      section1Subtitle1Items: [
        '姓名 / 用户名',
        '头像',
        '品牌信息（如品牌名、简介、联系方式）',
        '您发布的文字、图片、视频、语音、评论',
        '联系方式（电话、邮箱）、地址（在您授权后）',
      ],
      section1Subtitle2: '2. 系统自动收集的信息',
      section1Subtitle2Items: [
        '设备类型、系统版本',
        'IP 地址、安全日志',
        '使用数据：浏览、点击、停留时长',
        '位置信息（经授权后）',
      ],
      section1Subtitle3: '3. 第三方来源信息',
      section1Subtitle3Items: [
        '第三方登录所提供的授权资料（如头像、昵称）',
      ],
      section2Title: '二、我们如何使用信息',
      section2Items: [
        '运营、维护及优化 SpinLinX 服务',
        '个性化内容推荐',
        '生成全球光点地图（光点展示不含个人隐私）',
        '品牌主页展示与内容发布',
        '账号安全、反作弊、风险监测',
        '客服沟通与问题处理',
        '依法依规履行法律义务',
      ],
      section2Note: '我们不会出售任何用户个人数据。',
      section3Title: '三、我们如何共享信息',
      section3Items: [
        '在您授权或同意的情况下',
        '为遵守法律、政府或执法机关要求',
        '与协助服务运作的第三方合作方（如云存储、内容审核），限必要范围使用',
      ],
      section3Note: '合作方不得将信息用于任何独立或额外目的。',
      section4Title: '四、信息的存储与保护',
      section4Items: [
        '数据使用加密技术存储',
        '传输采用 HTTPS/SSL/TLS 加密',
        '多层安全系统与权限控制',
        '若发生数据安全事件，我们将依法通知用户',
      ],
      section5Title: '五、您的权利',
      section5Items: [
        '编辑、更新或删除您的个人资料',
        '删除已发布内容',
        '撤回授权（如位置信息、相册权限等）',
        '申请注销账号',
        '要求导出或访问您的数据（如适用）',
      ],
      section6Title: '六、未成年人的隐私',
      section6Content: '未满18岁用户须在监护人指导下使用本平台。',
      section7Title: '七、本条款的更新',
      section7Content: '我们可能依据运营需要更新本隐私条款，更新内容将在应用内公告。',
      mediaLicenseTitle: '图片 / 视频使用授权协议',
      mediaLicenseIntro: '当您在 SpinLinX 上传任何内容，即表示您理解并同意本授权协议。',
      mediaLicenseSection1Title: '一、授权范围',
      mediaLicenseSection1Content: '您授予 SpinLinX：全球范围内、免版税、可再授权、可转让、非独占性的许可，用于以下用途：',
      mediaLicenseSection1Items: [
        '在平台内展示您的内容',
        '用于推荐位、精选内容、光点地图',
        '用于平台相关示例展示、教学、推广（非商业销售用途）',
        '用于品牌信息聚合与内容展示',
      ],
      mediaLicenseSection1Note: '如需进行超出以上范围的商业用途，我们会另行取得您的书面授权。',
      mediaLicenseSection2Title: '二、内容所有权',
      mediaLicenseSection2Items: [
        '您保留对所有原创内容的完整版权',
        'SpinLinX 不主张内容所有权',
        '您确认内容已获必要授权且不侵权、不违法',
      ],
      mediaLicenseSection3Title: '三、授权期限',
      mediaLicenseSection3Items: [
        '自您上传内容起生效',
        '持续至您删除内容或注销账号',
        '删除内容后，我们会在合理时间内清除缓存及备份副本',
      ],
      mediaLicenseSection4Title: '四、撤销授权',
      mediaLicenseSection4Content: '您可以随时删除内容中止授权，或申请注销账户以终止全部授权。',
      mediaLicenseSection5Title: '五、平台承诺',
      mediaLicenseSection5Items: [
        '不歪曲、不篡改您的内容',
        '不在未经同意的情况下用于商业广告',
        '不在破坏您品牌形象的环境中使用',
        '不侵犯您的版权、隐私或肖像权',
      ],
    },
    protect: {
      title: 'Spin to Protect',
      back: '返回',
      mainTitle: '让我们一起保护真正重要的东西',
      craftImageAlt: '制作传统工艺品的双手',
      artisanImageAlt: '工作坊中的女工匠',
      introduction: 'Spin to Protect 是 SpinLinX 的慈善倡议，邀请您贡献并将您品牌的光明转化为现实世界的影响。',
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
      brand: '输入您的品牌或创作者名称',
      brief: '描述您的故事、愿景或使您的品牌与众不同之处',
      logo: 'Logo',
      officialSite: '官方网站链接（可选）',
      telMobile: '您的联系方式',
      workHour: '营业时间（例如：9:00-13:00）',
      address: '商店或办公室地址',
      email: '业务电子邮件用于咨询',
      location: '位置',
      submit: '提交',
      submitting: '提交中...',
      submitSuccess: '提交成功，正在跳转...',
      submitError: '提交失败',
      loginRequired: '请先登录',
      authInfoMissing: '用户认证信息缺失',
      invalidImageType: '请选择有效的图片文件',
      imageTooLarge: '图片文件过大（最大10MB）',
      imageFormatNotSupported: '图片格式不支持，请选择有效的图片文件（JPG、PNG等）',
      logoUploadFailed: 'Logo上传失败',
      uploading: '上传中...',
      logoUploaded: 'Logo上传成功',
      getUserInfoFailed: '获取用户信息失败',
      loading: '加载中...',
      getCurrentLocation: '获取当前位置',
      gettingLocation: '获取位置中...',
      locationError: '您的浏览器不支持地理位置功能',
      locationFailed: '获取位置失败',
      locationPermissionDenied: '位置权限已关闭。请点击"重试"再次请求权限，或在浏览器设置中启用位置访问权限。',
      locationUnavailable: '位置信息不可用',
      locationTimeout: '获取位置超时',
      locationParseError: '位置获取成功，但地址解析失败',
      brandRequired: '品牌名称不能为空',
      workHourRequired: '工作时间不能为空',
      emailRequired: '邮箱不能为空',
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
    regionSelect: {
      title: '地区选择',
      searching: '搜索中...',
      confirm: '确认',
      searchHint: '搜索城市',
      searchDescription: '输入城市名称来查找并选择',
      noResults: '未找到城市',
    },
  },
};

export const defaultLanguage: Language = 'en';
