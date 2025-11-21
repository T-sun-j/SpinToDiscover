"use client";

import { Button } from '../../../components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';
import { ArrowLeft, Edit, EyeOff, Eye, Trash2, MapPin, Star, Share2, ChevronLeft, Plus, CirclePlus, Loader2, AlertCircle, RefreshCw, Bookmark, Heart, SquareArrowOutUpRight } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useApi } from '../../../lib/hooks/useApi';
import { getMyPageList } from '../../../lib/services';
import { getUserInfo, getOtherUserInfo, deleteArticle, hideArticle, toggleFollowUser, toggleLove, toggleCollect, shareContent } from '../../../lib/auth';
import { MyPageItem, UserInfoResponse, buildAvatarUrl, SERVER_CONFIG } from '../../../lib/api';
import { UI_CONSTANTS, HISTORY_CONSTANTS, API_CONSTANTS, ANIMATION_CONSTANTS } from '../../../lib/constants';
import { classNames } from '../../../lib/utils/classNames';
import { useAuth } from '../../../contexts/AuthContext';
import { AuthGuard } from '../../../components/AuthGuard';
import { toast } from "sonner";
import { OptimizedImage } from '../../../components/ui/OptimizedImage';

interface PersonalPageProps {
    params: { userId: string };
}

export default function PersonalPage({ params }: PersonalPageProps) {
    const { t } = useLanguage();
    const router = useRouter();
    const { getEmail, authInfo } = useAuth();

    // 使用useApi hook获取用户参数
    const { userParams } = useApi(
        async (params) => {
            // 这个函数不会被调用，我们只是用它来获取userParams
            return null;
        },
        null
    );
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [postsData, setPostsData] = useState<MyPageItem[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null); // 正在删除的作品ID
    const [isHiding, setIsHiding] = useState<string | null>(null); // 正在隐藏的作品ID
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
    // 图片预览状态
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // 互动状态管理
    const [postInteractions, setPostInteractions] = useState<{
        [key: string]: {
            isLove: boolean;
            isCollect: boolean;
            likes: number;
            bookmarks: number;
            isInteracting: boolean;
        }
    }>({});
    const hasLoaded = useRef(false);
    const userInfoLoaded = useRef(false);

    // 从路由参数获取目标用户ID
    const targetUserId = params.userId;
    console.log(targetUserId);

    // 直接管理API状态，不依赖useApi hook
    const [data, setData] = useState<any>({
        posts: [],
        pagination: {
            currentPage: API_CONSTANTS.DEFAULT_PAGE,
            totalPages: 1,
            totalItems: 0,
            hasNext: false,
            hasPrev: false
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [userInfoData, setUserInfoData] = useState<any>(null);
    const [userInfoLoading, setUserInfoLoading] = useState(false);
    const [userInfoError, setUserInfoError] = useState<string | null>(null);

    // 加载个人作品数据
    const loadPostsData = async () => {
        if (!targetUserId) return;

        setLoading(true);
        setError(null);

        try {
            // 优先使用userParams中的token，如果没有则使用authInfo中的token
            const token = userParams?.token || authInfo?.token || '';
            const response = await getMyPageList({
                userId: targetUserId,
                token: token,
                page: API_CONSTANTS.DEFAULT_PAGE,
                limit: API_CONSTANTS.DEFAULT_LIMIT,
            });

            if (response.success && response.data) {
                setData(response.data);
            } else {
                setError(t('personalPage.loadPostsFailed') as string);
            }
        } catch (error) {
            console.error('加载作品数据失败:', error);
            setError(t('personalPage.loadPostsError') as string);
        } finally {
            setLoading(false);
        }
    };

    // 加载用户信息
    const loadUserInfo = async () => {
        if (!targetUserId) return;

        setUserInfoLoading(true);
        setUserInfoError(null);

        try {
            // 优先使用userParams中的token，如果没有则使用authInfo中的token
            const token = userParams?.token || authInfo?.token || '';
            const currentUserId = authInfo?.userId || '';

            let response: any;

            // 判断是否为查看自己的页面
            if (targetUserId === currentUserId) {
                // 查看自己的页面，使用getUserInfo接口
                response = await getUserInfo({
                    email: authInfo?.email || '',
                    userId: targetUserId,
                    token: token,
                });
                if (response.success && response.data) {
                    setUserInfoData(response);
                } else {
                    setUserInfoError(t('personalPage.loadUserInfoFailed') as string);
                }
            } else {
                // 查看其他用户的页面，使用getOtherUserInfo接口
                response = await getOtherUserInfo({
                    userId: currentUserId,
                    token: token,
                    otherId: targetUserId,
                });
                if (response.success && response) {
                    console.log(response);
                    setUserInfoData(response);
                    setUserInfo(response.userData);
                    setIsFollowing(response.isFollow);
                } else {
                    setUserInfoError(t('personalPage.loadUserInfoFailed') as string);
                }
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
            setUserInfoError(t('personalPage.loadUserInfoError') as string);
        } finally {
            setUserInfoLoading(false);
        }
    };

    // 组件挂载时获取数据
    useEffect(() => {
        if (targetUserId && !hasLoaded.current) {
            hasLoaded.current = true;
            // 只有查看自己的页面时才调用loadPostsData
            if (targetUserId === authInfo?.userId) {
                loadPostsData();
            }
        }
    }, [targetUserId, authInfo?.userId]);

    // 获取用户信息
    useEffect(() => {
        if (targetUserId && !userInfoLoaded.current) {
            userInfoLoaded.current = true;
            loadUserInfo();
        }
    }, [targetUserId]);

    // 更新用户信息数据
    useEffect(() => {
        if (userInfoData && userInfoData.success) {
            if (userInfoData.data) {
                setUserInfo(userInfoData.data);
            }
            // 从API响应中获取关注状态
            if (userInfoData.isFollow !== undefined) {
                setIsFollowing(userInfoData.isFollow);
            }

            // 如果是查看其他用户页面，从getOtherUserInfo响应中获取作品数据
            if (targetUserId !== authInfo?.userId && userInfoData.proDataList) {
                setPostsData(userInfoData.proDataList);
                console.log(userInfoData.proDataList, 'userInfoData.proDataList');
                setData({
                    posts: userInfoData.proDataList,
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: userInfoData.proDataList.length,
                        hasNext: false,
                        hasPrev: false
                    }
                });
            }
        }
    }, [userInfoData, targetUserId, authInfo?.userId]);

    // 更新作品数据 - 只对查看自己页面的情况生效
    useEffect(() => {
        if (data?.posts && targetUserId === authInfo?.userId) {
            setPostsData(data.posts);
        }
    }, [data, targetUserId, authInfo?.userId]);

    // 初始化互动状态
    useEffect(() => {
        if (postsData.length > 0) {
            const newInteractions: { [key: string]: any } = {};
            postsData.forEach((post: MyPageItem) => {
                // 从post数据中获取互动状态，如果没有则使用默认值
                newInteractions[post.id] = {
                    isLove: false, // 个人页面可能没有isLove字段，需要从API获取
                    isCollect: false, // 个人页面可能没有isCollect字段，需要从API获取
                    likes: post.likes || 0,
                    bookmarks: post.collects || 0,
                    isInteracting: false
                };
            });
            setPostInteractions(newInteractions);
        }
    }, [postsData]);

    const handleBack = () => {
        router.back();
    };

    const handleFollowToggle = async () => {
        if (!authInfo || !targetUserId || isFollowLoading) {
            return;
        }

        setIsFollowLoading(true);

        try {
            const response = await toggleFollowUser({
                userId: authInfo.userId,
                token: authInfo.token,
                authorId: targetUserId,
                isCollect: isFollowing ? 1 : 0, // 1: 取消关注, 0: 关注
            });

            if (response.success) {
                setIsFollowing(!isFollowing);
                toast.success(isFollowing ? t('personalPage.unfollowSuccess') : t('personalPage.followSuccess'));

                // 关注/取消关注成功后，重新调用getOtherUserInfo接口刷新数据
                if (targetUserId !== authInfo?.userId) {
                    try {
                        const refreshResponse = await getOtherUserInfo({
                            userId: authInfo.userId,
                            token: authInfo.token,
                            otherId: targetUserId,
                        });

                        if (refreshResponse.success && refreshResponse) {
                            setUserInfoData(refreshResponse);
                            // 根据API响应结构处理数据
                            const responseData = refreshResponse as any;
                            if (responseData.userData) {
                                setUserInfo(responseData.userData);
                            }
                            if (responseData.isFollow !== undefined) {
                                setIsFollowing(responseData.isFollow);
                            }

                            // 更新作品数据
                            if (responseData.proDataList) {
                                setPostsData(responseData.proDataList);
                                setData({
                                    posts: responseData.proDataList,
                                    pagination: {
                                        currentPage: 1,
                                        totalPages: 1,
                                        totalItems: responseData.proDataList.length,
                                        hasNext: false,
                                        hasPrev: false
                                    }
                                });
                            }
                        }
                    } catch (refreshError) {
                        console.error('刷新用户信息失败:', refreshError);
                        // 即使刷新失败，也不影响关注操作的成功
                    }
                }
            } else {
                // 处理API错误，如"用户不存在"
                if (response.message && response.message.includes('用户不存在')) {
                    toast.error(t('personalPage.userNotFound') || '用户不存在');
                } else {
                    toast.error(response.message || (isFollowing ? t('personalPage.unfollowError') : t('personalPage.followError')));
                }
            }
        } catch (error) {
            console.error('关注操作失败:', error);
            toast.error(error instanceof Error ? error.message : (isFollowing ? t('personalPage.unfollowProcessError') : t('personalPage.followProcessError')));
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleVideoPlay = (videoUrl: string) => {
        setPlayingVideoUrl(videoUrl);
        setIsVideoPlaying(true);
    };

    const handleVideoClose = () => {
        setIsVideoPlaying(false);
        setPlayingVideoUrl(null);
    };

    // 图片预览功能
    const handleImagePreview = (imageUrl: string, allImages: string[], index: number) => {
        setPreviewImages(allImages);
        setCurrentImageIndex(index);
        setPreviewImageUrl(imageUrl);
        setIsImagePreviewOpen(true);
    };

    const handleImagePreviewClose = () => {
        setIsImagePreviewOpen(false);
        setPreviewImageUrl(null);
        setPreviewImages([]);
        setCurrentImageIndex(0);
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            const newIndex = currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            setPreviewImageUrl(previewImages[newIndex]);
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < previewImages.length - 1) {
            const newIndex = currentImageIndex + 1;
            setCurrentImageIndex(newIndex);
            setPreviewImageUrl(previewImages[newIndex]);
        }
    };

    // 打开删除确认对话框
    const handleDeleteClick = (articleId: string) => {
        setArticleToDelete(articleId);
        setDeleteDialogOpen(true);
    };

    // 确认删除作品
    const handleDeleteArticle = async () => {
        if (!authInfo || !articleToDelete) {
            toast.error(t('personalPage.authInfoMissing'));
            return;
        }

        setIsDeleting(articleToDelete);
        setDeleteDialogOpen(false);

        try {
            const response = await deleteArticle({
                userId: authInfo.userId,
                token: authInfo.token,
                id: articleToDelete,
            });

            if (response.success) {
                toast.success(t('personalPage.deleteSuccess'));
                // 重新加载数据以获取最新状态 - 只有查看自己页面时才重新加载
                if (targetUserId === authInfo?.userId) {
                    await loadPostsData();
                }
            } else {
                toast.error(response.message || t('personalPage.deleteError'));
            }
        } catch (error) {
            console.error('删除作品失败:', error);
            toast.error(error instanceof Error ? error.message : t('personalPage.deleteProcessError'));
        } finally {
            setIsDeleting(null);
            setArticleToDelete(null);
        }
    };

    // 隐藏/显示作品
    const handleHideArticle = async (articleId: string, currentStatus: number = 0) => {
        if (!authInfo) {
            toast.error(t('personalPage.authInfoMissing'));
            return;
        }

        const newStatus = currentStatus === 1 ? 0 : 1; // 切换状态
        const actionText = newStatus === 1 ? t('personalPage.hide') : t('personalPage.show');

        setIsHiding(articleId);

        try {
            const response = await hideArticle({
                userId: authInfo.userId,
                token: authInfo.token,
                id: articleId,
                status: newStatus,
            });

            if (response.success) {
                toast.success(newStatus === 1 ? t('personalPage.hideSuccess') : t('personalPage.showSuccess'));
                // 重新加载数据以获取最新状态 - 只有查看自己页面时才重新加载
                if (targetUserId === authInfo?.userId) {
                    await loadPostsData();
                }
            } else {
                toast.error(response.message || (newStatus === 1 ? t('personalPage.hideError') : t('personalPage.showError')));
            }
        } catch (error) {
            console.error(`${actionText}作品失败:`, error);
            toast.error(error instanceof Error ? error.message : (newStatus === 1 ? t('personalPage.hideProcessError') : t('personalPage.showProcessError')));
        } finally {
            setIsHiding(null);
        }
    };

    // 点赞功能
    const handleLike = async (postId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止事件冒泡，避免触发帖子点击

        if (!authInfo?.userId || !authInfo?.token) {
            router.push('/login');
            return;
        }

        const currentInteraction = postInteractions[postId];
        if (currentInteraction?.isInteracting) return;

        setPostInteractions(prev => ({
            ...prev,
            [postId]: {
                ...prev[postId],
                isInteracting: true
            }
        }));

        try {
            const response = await toggleLove({
                userId: authInfo.userId,
                token: authInfo.token,
                productId: postId,
                isLove: currentInteraction?.isLove ? 0 : 1
            });

            if (response.success) {
                setPostInteractions(prev => ({
                    ...prev,
                    [postId]: {
                        ...prev[postId],
                        isLove: !prev[postId]?.isLove,
                        likes: (prev[postId]?.likes || 0) + (prev[postId]?.isLove ? -1 : 1),
                        isInteracting: false
                    }
                }));
            } else {
                toast.error(t('square.operationFailed'));
            }
        } catch (error) {
            console.error('点赞失败:', error);
            toast.error(t('square.operationFailed'));
        } finally {
            setPostInteractions(prev => ({
                ...prev,
                [postId]: {
                    ...prev[postId],
                    isInteracting: false
                }
            }));
        }
    };

    // 收藏功能
    const handleBookmark = async (postId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止事件冒泡，避免触发帖子点击

        if (!authInfo?.userId || !authInfo?.token) {
            router.push('/login');
            return;
        }

        const currentInteraction = postInteractions[postId];
        if (currentInteraction?.isInteracting) return;

        setPostInteractions(prev => ({
            ...prev,
            [postId]: {
                ...prev[postId],
                isInteracting: true
            }
        }));

        try {
            const response = await toggleCollect({
                userId: authInfo.userId,
                token: authInfo.token,
                productId: postId,
                isCollect: currentInteraction?.isCollect ? 0 : 1
            });

            if (response.success) {
                setPostInteractions(prev => ({
                    ...prev,
                    [postId]: {
                        ...prev[postId],
                        isCollect: !prev[postId]?.isCollect,
                        bookmarks: (prev[postId]?.bookmarks || 0) + (prev[postId]?.isCollect ? -1 : 1),
                        isInteracting: false
                    }
                }));
            } else {
                toast.error(t('square.operationFailed'));
            }
        } catch (error) {
            console.error('收藏失败:', error);
            toast.error(t('square.operationFailed'));
        } finally {
            setPostInteractions(prev => ({
                ...prev,
                [postId]: {
                    ...prev[postId],
                    isInteracting: false
                }
            }));
        }
    };

    // 分享功能
    const handleShare = async (post: MyPageItem, event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止事件冒泡，避免触发帖子点击

        // 先调用分享接口增加分享次数
        if (authInfo?.userId && authInfo?.token) {
            try {
                await shareContent({
                    userId: authInfo.userId,
                    token: authInfo.token,
                    productId: post.id,
                });
                // 分享接口调用成功后更新分享数量
                setPostsData(prevPosts =>
                    prevPosts.map(p =>
                        p.id === post.id
                            ? { ...p, shares: (p.shares || 0) + 1 }
                            : p
                    )
                );
            } catch (error) {
                console.error('分享接口调用失败:', error);
                // 即使接口调用失败，也继续执行分享功能
            }
        }

        // 继续原有的分享链接功能
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title || 'Untitled',
                    text: post.description || '',
                    url: `${window.location.origin}/square/${post.id}`,
                });
            } else {
                // 复制链接到剪贴板
                await navigator.clipboard.writeText(`${window.location.origin}/square/${post.id}`);
                toast.success(t('square.linkCopied'));
            }
        } catch (error) {
            // 用户取消分享时不显示错误
            if ((error as Error).name !== 'AbortError') {
                console.error('分享失败:', error);
            }
        }
    };

    // 判断是否为查看自己的页面
    const isOwnPage = targetUserId === authInfo?.userId;

    // 个人页面不需要强制登录验证，但需要处理未登录状态
    return (
        <div className="min-h-screen bg-white">
            {/* SVG 渐变定义 */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <linearGradient id="bookmark-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                    <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FD9507" />
                        <stop offset="100%" stopColor="#CE14B0" />
                    </linearGradient>
                </defs>
            </svg>
            <main className=" flex min-h-dvh flex-col bg-white">
                {/* Header */}
                <Header />

                {/* User and Brand Info */}
                <div className={"p-4"}>
                    <div className={classNames(
                        HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN,
                        'z-100'
                    )}>
                        <div className={classNames(
                            'flex items-center text-[#11295b]',
                            UI_CONSTANTS.SPACING.GAP_2
                        )}>
                            <Image
                                src={buildAvatarUrl(userInfo?.avatar)}
                                alt="User Avatar"
                                width={16}
                                height={16}
                                className={classNames(
                                    UI_CONSTANTS.BORDER_RADIUS.ROUNDED_FULL,
                                    'w-9 h-9 object-cover'
                                )}
                            />
                            <div>
                                <h2 className={classNames(
                                    'text-sm text-[#0F1728]',
                                    UI_CONSTANTS.COLORS.PRIMARY,
                                    UI_CONSTANTS.FONTS.INTER
                                )}>
                                    {userInfo?.nickname}
                                </h2>
                            </div>
                        </div>
                        {/* Edit and Settings buttons */}
                        <div className={classNames(
                            'flex items-center text-[#0F1728]',
                            UI_CONSTANTS.SPACING.GAP_2
                        )}>

                            <Button variant="ghost" size="icon" onClick={handleBack}>
                                <ChevronLeft className='h-7 w-7 z-10' />
                            </Button>

                        </div>

                    </div>
                    {/* 关注按钮 - 只有查看其他用户页面时才显示 */}
                    {targetUserId !== authInfo?.userId && (
                        <div className="flex items-center gap-2 ml-10" style={{ zIndex: 10 }}>
                            <button
                                onClick={handleFollowToggle}
                                disabled={isFollowLoading}
                                className={classNames(
                                    'flex items-center px-2 w-24 h-6 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                                    isFollowing
                                        ? 'w-36 text-[#11295b] hover:text-[#11295b] font-poppins font-semibold text-sm'
                                        : ' bg-[#11295b] text-white hover:bg-[#11295b] hover:text-white font-poppins font-semibold text-sm'
                                )}
                            >
                                {isFollowLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Star className={classNames(
                                        'h-4 w-4',
                                        isFollowing ? 'mr-1 fill-[#12295B]' : ' ml-2 mr-1',
                                    )} fill={isFollowing ? 'currentColor' : 'none'} />
                                )}
                                <span>
                                    {isFollowLoading
                                        ? t('personalPage.processing')
                                        : isFollowing
                                            ? t('personalPage.following')
                                            : t('personalPage.follow')
                                    }
                                </span>
                            </button>
                        </div>
                    )}

                    {/* 用户信息 */}
                    <div className="relative flex flex-col gap-3 mt-3">
                        {/* 品牌信息 */}
                        <div className="flex items-center">
                            <span className="text-sm text-[#0F1728] text-left font-nunito  flex-shrink-0">{t('personalPage.brand')}:</span>
                            <div className="flex items-center gap-2 flex-1 pl-1">
                                {userInfo?.brand ? (
                                    userInfo?.officialsite ? (
                                        <a
                                            href={userInfo.officialsite.startsWith('http') ? userInfo.officialsite : `https://${userInfo.officialsite}`}
                                            className="text-[#0F1728] font-nunito underline font-semibold hover:opacity-80"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {userInfo.brand}
                                        </a>
                                    ) : (
                                        <span className="text-[#0F1728] text-sm font-nunito font-semibold">{userInfo.brand}</span>
                                    )
                                ) : (
                                    <span className="text-[#0F1728] text-sm font-nunito font-semibold">--</span>
                                )}

                            </div>
                        </div>


                        {/* 简介 */}
                        {userInfo?.brief && (
                            <div className="flex items-start w-[70%]">
                                <span className="text-sm text-[#0F1728] text-left font-nunito flex-shrink-0">{t('personalPage.brief')}:</span>
                                <div className="flex-1 ml-3 w-full">
                                    <p className="text-xs text-[#0F1728] font-inter w-full">{userInfo.brief}</p>
                                    {userInfo?.tel && <p className="text-xs text-gray-700 font-inter pt-4 w-full"><span className="font-semibold mr-1">{t('personalPage.customerServiceHotline')}:</span>{userInfo?.tel}</p>}
                                    {userInfo?.workHour && <p className="text-xs text-gray-700 font-inter w-full"><span className="font-semibold mr-1">{t('personalPage.workHour')}:</span>{userInfo?.workHour}</p>}
                                    {userInfo?.email && <p className="text-xs text-gray-700 font-inter w-full"><span className="font-semibold mr-1">{t('personalPage.email')}:</span>{userInfo?.email}</p>}
                                    {userInfo?.address && <p className="text-xs text-gray-700 font-inter w-full"><span className="font-semibold mr-1">{t('personalPage.address')}:</span>{userInfo?.address}</p>}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center ml-10" style={{ zIndex: 10 }}>
                            <button
                                onClick={() => window.open(userInfo?.officialsite?.startsWith('http') ? userInfo?.officialsite : `https://${userInfo?.officialsite}`, '_blank')}
                                className="flex items-center bg-[#12295B] text-white px-2 w-32 h-6 rounded-lg text-sm transition-all duration-200"
                            >
                                <span className="text-sm text-white font-poppins font-semibold text-center w-full">{t('personalPage.online')}</span>
                            </button>
                        </div>
                        {userInfo?.logo && (
                            <Image
                                src={buildAvatarUrl(userInfo.logo)}
                                alt="Brand Logo"
                                width={32}
                                height={32}
                                className="absolute right-2 top-2 flex items-center h-24 w-24  object-cover"
                            />
                        )}
                        {/* Edit按钮布局到底部右下角 - 只有查看自己的页面时才显示 */}
                        {targetUserId === authInfo?.userId && (
                            <Link
                                href="/brand-edit"
                                className="absolute right-2 bottom-[30px] flex items-center hover:opacity-80"
                                style={{ zIndex: 10 }}
                            >
                                <Image src="/img/edit.png" alt="Edit" width={5} height={5} className="h-5 w-5" />
                            </Link>
                        )}
                    </div>

                </div>

                {/* My Posts section */}
                <div className=" px-4">
                    <div
                        className=" my-4"
                        style={{ borderBottom: '1px solid #e5e7eb' }}
                    ></div>
                    <h2 className="text-[17px] text-[#0F1728] font-poppins font-semibold">{t("personalPage.myPosts")}</h2>

                    {loading && (
                        <div className={classNames(
                            HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
                            UI_CONSTANTS.SPACING.PY_8
                        )}>
                            <Loader2 className={classNames(
                                UI_CONSTANTS.SIZES.ICON_MD,
                                ANIMATION_CONSTANTS.SPIN,
                                UI_CONSTANTS.COLORS.PRIMARY
                            )} />
                            <span className={classNames(
                                'ml-2 text-[#11295b]',
                                UI_CONSTANTS.COLORS.PRIMARY,
                                UI_CONSTANTS.FONTS.NUNITO
                            )}>{t("personalPage.loading")}</span>
                        </div>
                    )}

                    {error && (
                        <div className={classNames(
                            HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
                            UI_CONSTANTS.SPACING.PY_8
                        )}>
                            <AlertCircle className={classNames(
                                UI_CONSTANTS.SIZES.ICON_MD,
                                UI_CONSTANTS.COLORS.RED_500
                            )} />
                            <span className={classNames(
                                'ml-2 text-[#11295b]',
                                UI_CONSTANTS.COLORS.RED_500,
                                UI_CONSTANTS.FONTS.NUNITO
                            )}>{t("personalPage.error")}</span>
                        </div>
                    )}

                    {!loading && !error && postsData.length === 0 && (
                        <div className={classNames(
                            'flex flex-col items-center justify-center text-[#11295b]',
                            UI_CONSTANTS.SPACING.PY_12
                        )}>
                            <div className={classNames(
                                'w-16 h-16',
                                UI_CONSTANTS.COLORS.GRAY_100,
                                UI_CONSTANTS.BORDER_RADIUS.ROUNDED_FULL,
                                HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
                                UI_CONSTANTS.SPACING.MB_4
                            )}>
                                <AlertCircle className={classNames(
                                    UI_CONSTANTS.SIZES.ICON_XL,
                                    UI_CONSTANTS.COLORS.GRAY_400
                                )} />
                            </div>
                            <h3 className={classNames(
                                HISTORY_CONSTANTS.TEXT_SIZES.SUBTITLE,
                                UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD,
                                UI_CONSTANTS.COLORS.PRIMARY,
                                UI_CONSTANTS.FONTS.NUNITO,
                                UI_CONSTANTS.SPACING.MB_2
                            )}>
                                {t("personalPage.noPosts")}
                            </h3>
                            <p className={classNames(
                                UI_CONSTANTS.COLORS.PRIMARY_OPACITY_60,
                                UI_CONSTANTS.FONTS.INTER,
                                'text-center text-[#11295b]'
                            )}>
                                {t("personalPage.noPostsDescription")}
                            </p>
                        </div>
                    )}

                    {!loading && !error && postsData.length > 0 && (
                        <div className="flex-1 overflow-y-auto h-[calc(72vh-230px)]">
                            <div className="space-y-0">
                                {postsData.map((post, index) => (
                                    <div key={post.id}>
                                        <div
                                            className="bg-white pt-2 cursor-pointer hover:shadow-sm transition-shadow"
                                            onClick={() => router.push(`/square/${post.id}`)}
                                        >


                                            {/* 标题 */}
                                            <h3 className="text-[#12295B] text-[17px] leading-[34px] italic font-nunito font-semibold">{post.title}</h3>

                                            {/* 描述 */}
                                            <p className="text-sm text-[#20313B] leading-[17px] font-inter">{post.description}</p>

                                            {/* 图片列表 */}
                                            <div className="flex gap-2 overflow-x-auto my-2">
                                                {/* 如果有视频，显示视频第一帧 */}
                                                {post.video && (
                                                    <div
                                                        className="relative w-34 h-24 rounded flex-shrink-0 bg-gray-200 overflow-hidden cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 阻止事件冒泡，避免触发父元素的点击事件
                                                            handleVideoPlay(buildAvatarUrl(post.video));
                                                        }}
                                                    >
                                                        <video
                                                            src={buildAvatarUrl(post.video)}
                                                            className="w-full h-full object-cover"
                                                            muted
                                                            preload="metadata"
                                                            onLoadedMetadata={(e) => {
                                                                // 设置到第一帧
                                                                e.currentTarget.currentTime = 0.1;
                                                            }}
                                                        />
                                                        {/* 视频播放图标覆盖层 */}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-30">
                                                        <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {(post.images || [])
                                                    .filter(image => !!image && image.trim() !== "")
                                                    .map((image, imageIndex) => {
                                                        const imageUrl = buildAvatarUrl(image);
                                                        const allImages = (post.images || [])
                                                            .filter(img => !!img && img.trim() !== "")
                                                            .map(img => buildAvatarUrl(img));
                                                        return (
                                                            <div
                                                                key={imageIndex}
                                                                className="relative w-36 h-24 rounded flex-shrink-0 bg-gray-100 overflow-hidden cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // 阻止事件冒泡，避免触发父元素的点击事件
                                                                    handleImagePreview(imageUrl, allImages, imageIndex);
                                                                }}
                                                            >
                                                                <OptimizedImage
                                                                    src={imageUrl}
                                                                    alt={`Post ${post.id} image ${imageIndex + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                            </div>

                                            {/* 发布者信息和互动按钮 */}
                                            <div className="flex items-center justify-between my-2">
                                                {/* 位置和时间信息 */}
                                                <div className="flex flex-col gap-1">
                                                    {post.updatedAt && (
                                                        <span className="text-xs text-gray-600">
                                                            {post.updatedAt}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center  mt-2">
                                                        <MapPin className="h-4 w-4 text-[#0F1728] font-semibold" />
                                                        <span className="text-sm text-[#0F1728] font-inter">{post.location}</span>
                                                    </div>
                                                </div>

                                                {/* 互动按钮 */}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={(e) => handleBookmark(post.id, e)}
                                                        disabled={!authInfo?.userId || postInteractions[post.id]?.isInteracting}
                                                        className={`flex flex-col items-center gap-0.5 transition-colors ${postInteractions[post.id]?.isCollect
                                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent'
                                                            : 'text-[#0F1728] hover:text-[#0F1728]'
                                                            } ${(!authInfo?.userId || postInteractions[post.id]?.isInteracting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        title={!authInfo?.userId ? (t('square.pleaseLoginFirst') as string) : ''}
                                                    >
                                                        <Bookmark
                                                            className="h-6 w-6 font-semibold"
                                                            style={postInteractions[post.id]?.isCollect ? { fill: 'url(#bookmark-gradient)' } : {}}
                                                        />
                                                        <span className={`text-xs font-nunito ${postInteractions[post.id]?.isCollect ? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent' : ''}`}>
                                                            {postInteractions[post.id]?.bookmarks || post.collects || 0}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleLike(post.id, e)}
                                                        disabled={!authInfo?.userId || postInteractions[post.id]?.isInteracting}
                                                        className={`flex flex-col items-center gap-0.5 transition-colors ${postInteractions[post.id]?.isLove
                                                            ? 'bg-gradient-to-r from-[#FD9507] to-[#CE14B0] bg-clip-text text-transparent'
                                                            : 'text-[#0F1728] hover:text-[#0F1728]'
                                                            } ${(!authInfo?.userId || postInteractions[post.id]?.isInteracting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        title={!authInfo?.userId ? (t('square.pleaseLoginFirst') as string) : ''}
                                                    >
                                                        <Heart
                                                            className="h-6 w-6 font-semibold"
                                                            style={postInteractions[post.id]?.isLove ? { fill: 'url(#heart-gradient)' } : {}}
                                                        />
                                                        <span className={`text-xs font-nunito ${postInteractions[post.id]?.isLove ? 'bg-gradient-to-r from-[#FD9507] to-[#CE14B0] bg-clip-text text-transparent' : ''}`}>
                                                            {postInteractions[post.id]?.likes || post.likes || 0}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleShare(post, e)}
                                                        className="flex flex-col items-center gap-0.5 text-[#0F1728] hover:text-[#0F1728] transition-colors"
                                                    >
                                                        <SquareArrowOutUpRight className="h-6 w-6 font-semibold" />
                                                        <span className="text-xs font-nunito">{post.shares || t('square.share')}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 只有查看自己的页面时才显示编辑操作按钮 */}
                                            {targetUserId === authInfo?.userId && (
                                                <div className="flex items-center gap-3 mt-2 mb-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 阻止事件冒泡
                                                            router.push(`re`);
                                                        }}

                                                        className={classNames(
                                                            'flex flex-col items-center gap-0.5 text-[#0F1728] hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                        )}
                                                    >
                                                        <Edit className="h-5 w-5 font-semibold" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 阻止事件冒泡
                                                            handleHideArticle(post.id, post.status || 0);
                                                        }}
                                                        disabled={isHiding === post.id}
                                                        className={classNames(
                                                            'flex flex-col items-center gap-0.5 text-[#0F1728] hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                        )}
                                                    >
                                                        {isHiding === post.id ? (
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                        ) : post.status === 1 ? (
                                                            <Eye className="h-5 w-5 font-semibold" />
                                                        ) : (
                                                            <EyeOff className="h-5 w-5 font-semibold" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 阻止事件冒泡，避免触发父元素的点击事件
                                                            handleDeleteClick(post.id);
                                                        }}
                                                        disabled={isDeleting === post.id}
                                                        className={classNames(
                                                            'flex flex-col items-center gap-0.5 text-[#0F1728] hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                        )}
                                                    >
                                                        {isDeleting === post.id ? (
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-5 w-5 font-semibold" />
                                                        )}
                                                    </button>

                                                </div>
                                            )}
                                        </div>
                                        {/* 分隔线 */}
                                        {index < postsData.length - 1 && (
                                            <div
                                                className=" my-4"
                                                style={{ borderBottom: '1px solid #e5e7eb' }}
                                            ></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Footer - 只有查看自己的页面时才显示发布按钮 */}
                {targetUserId === authInfo?.userId && (
                    <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'z-10')}>
                        <div className={classNames(
                            HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,

                        )}>
                            {/* Post button */}
                            <Link href="/release">
                                <Button
                                    className={classNames(
                                        'bg-transparent rounded-full flex flex-col items-center justify-center gap-1 text-[#11295b]',
                                        UI_CONSTANTS.FONTS.NUNITO,
                                        'text-sm font-semibold'
                                    )}
                                    size="lg"
                                >
                                    <Image src="/img/post.png" alt="post" width={16} height={16} className='h-14 w-14' />
                                    <span className={classNames(
                                    'text-sm', 'text-[#0F1728]','font-semibold font-poppins'

                                    )}>{t('personalCenter.post.button')}</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
                <Footer />

                {/* 删除确认对话框 */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="max-w-sm p-6 bg-white border border-gray-200 shadow-xl">
                        <AlertDialogHeader className="text-center">
                            <AlertDialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                                {t('personalPage.confirmDelete')}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-base text-gray-600 leading-relaxed">
                                {t('personalPage.confirmDeleteMessage')}<br />
                                {t('personalPage.confirmDeleteDescription')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-3  justify-center">
                            <AlertDialogCancel className="h-10 px-6 text-base rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                                {t('personalPage.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteArticle}
                                className="h-10 px-6 text-base mt-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-medium"
                            >
                                {t('personalPage.confirm')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* 全屏视频播放弹窗 */}
                {isVideoPlaying && playingVideoUrl && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* 关闭按钮 */}
                            <button
                                onClick={handleVideoClose}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* 视频播放器 */}
                            <video
                                src={playingVideoUrl}
                                className="max-w-full max-h-full object-contain"
                                controls
                                autoPlay
                                onEnded={handleVideoClose}
                                onError={(e) => {
                                    console.error('视频播放失败:', e);
                                    handleVideoClose();
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* 图片预览弹窗 */}
                {isImagePreviewOpen && previewImageUrl && (
                    <div
                        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
                        onClick={handleImagePreviewClose}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* 关闭按钮 */}
                            <button
                                onClick={handleImagePreviewClose}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* 上一张按钮 */}
                            {currentImageIndex > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevImage();
                                    }}
                                    className="absolute left-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}

                            {/* 下一张按钮 */}
                            {currentImageIndex < previewImages.length - 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNextImage();
                                    }}
                                    className="absolute right-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}

                            {/* 图片显示 */}
                            <div
                                className="max-w-full max-h-full flex items-center justify-center px-16"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={previewImageUrl}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>

                            {/* 图片索引指示器 */}
                            {previewImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                                    {currentImageIndex + 1} / {previewImages.length}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
