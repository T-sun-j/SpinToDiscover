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
import { ArrowLeft, Edit, EyeOff, Eye, Trash2, MapPin, Heart, Share2, ChevronLeft, Plus, CirclePlus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useApi } from '../../../lib/hooks/useApi';
import { getMyPageList } from '../../../lib/services';
import { getUserInfo, getOtherUserInfo, deleteArticle, hideArticle, toggleFollowUser } from '../../../lib/auth';
import { MyPageItem, UserInfoResponse, buildAvatarUrl } from '../../../lib/api';
import { UI_CONSTANTS, HISTORY_CONSTANTS, API_CONSTANTS, ANIMATION_CONSTANTS } from '../../../lib/constants';
import { classNames } from '../../../lib/utils/classNames';
import { useAuth } from '../../../contexts/AuthContext';
import { AuthGuard } from '../../../components/AuthGuard';

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
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
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
                setError(t('personalPage.loadPostsFailed'));
            }
        } catch (error) {
            console.error('加载作品数据失败:', error);
            setError(t('personalPage.loadPostsError'));
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
                    setUserInfoError(t('personalPage.loadUserInfoFailed'));
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
                    setUserInfoError(t('personalPage.loadUserInfoFailed'));
                }
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
            setUserInfoError(t('personalPage.loadUserInfoError'));
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
                console.log(userInfoData.proDataList,'userInfoData.proDataList');
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

    const handleBack = () => {
        router.back();
    };

    const handleFollowToggle = async () => {
        if (!authInfo || !targetUserId || isFollowLoading) {
            return;
        }

        setIsFollowLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await toggleFollowUser({
                userId: authInfo.userId,
                token: authInfo.token,
                authorId: targetUserId,
                isCollect: isFollowing ? 1 : 0, // 1: 取消关注, 0: 关注
            });

            if (response.success) {
                setIsFollowing(!isFollowing);
                setSuccessMessage(isFollowing ? t('personalPage.unfollowSuccess') : t('personalPage.followSuccess'));
                
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
                
                // 3秒后清除成功消息
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                // 处理API错误，如"用户不存在"
                if (response.message && response.message.includes('用户不存在')) {
                    setErrorMessage(t('personalPage.userNotFound') || '用户不存在');
                } else {
                    setErrorMessage(response.message || (isFollowing ? t('personalPage.unfollowError') : t('personalPage.followError')));
                }
            }
        } catch (error) {
            console.error('关注操作失败:', error);
            setErrorMessage(error instanceof Error ? error.message : (isFollowing ? t('personalPage.unfollowProcessError') : t('personalPage.followProcessError')));
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

    // 打开删除确认对话框
    const handleDeleteClick = (articleId: string) => {
        setArticleToDelete(articleId);
        setDeleteDialogOpen(true);
    };

    // 确认删除作品
    const handleDeleteArticle = async () => {
        if (!authInfo || !articleToDelete) {
            setErrorMessage(t('personalPage.authInfoMissing'));
            return;
        }

        setIsDeleting(articleToDelete);
        setErrorMessage('');
        setSuccessMessage('');
        setDeleteDialogOpen(false);

        try {
            const response = await deleteArticle({
                userId: authInfo.userId,
                token: authInfo.token,
                id: articleToDelete,
            });

            if (response.success) {
                setSuccessMessage(t('personalPage.deleteSuccess'));
                // 重新加载数据以获取最新状态 - 只有查看自己页面时才重新加载
                if (targetUserId === authInfo?.userId) {
                    await loadPostsData();
                }
                // 3秒后清除成功消息
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(response.message || t('personalPage.deleteError'));
            }
        } catch (error) {
            console.error('删除作品失败:', error);
            setErrorMessage(error instanceof Error ? error.message : t('personalPage.deleteProcessError'));
        } finally {
            setIsDeleting(null);
            setArticleToDelete(null);
        }
    };

    // 隐藏/显示作品
    const handleHideArticle = async (articleId: string, currentStatus: number = 0) => {
        if (!authInfo) {
            setErrorMessage(t('personalPage.authInfoMissing'));
            return;
        }

        const newStatus = currentStatus === 1 ? 0 : 1; // 切换状态
        const actionText = newStatus === 1 ? t('personalPage.hide') : t('personalPage.show');
        
        setIsHiding(articleId);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await hideArticle({
                userId: authInfo.userId,
                token: authInfo.token,
                id: articleId,
                status: newStatus,
            });

            if (response.success) {
                setSuccessMessage(newStatus === 1 ? t('personalPage.hideSuccess') : t('personalPage.showSuccess'));
                // 重新加载数据以获取最新状态 - 只有查看自己页面时才重新加载
                if (targetUserId === authInfo?.userId) {
                    await loadPostsData();
                }
                // 3秒后清除成功消息
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage(response.message || (newStatus === 1 ? t('personalPage.hideError') : t('personalPage.showError')));
            }
        } catch (error) {
            console.error(`${actionText}作品失败:`, error);
            setErrorMessage(error instanceof Error ? error.message : (newStatus === 1 ? t('personalPage.hideProcessError') : t('personalPage.showProcessError')));
        } finally {
            setIsHiding(null);
        }
    };

    // 判断是否为查看自己的页面
    const isOwnPage = targetUserId === authInfo?.userId;
    
    // 个人页面不需要强制登录验证，但需要处理未登录状态
    return (
        <main className=" flex min-h-dvh flex-col bg-white">
                {/* Header */}
                <Header
                    showLanguage
                />

                {/* User and Brand Info */}
                <div className={"p-4"}>
                    <div className={classNames(
                        HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN
                    )}>
                        <div className={classNames(
                            'flex items-center text-[#101729]',
                            UI_CONSTANTS.SPACING.GAP_4
                        )}>
                            <Image
                                src={buildAvatarUrl(userInfo?.avatar)}
                                alt="User Avatar"
                                width={16}
                                height={16}
                                className={classNames(
                                    UI_CONSTANTS.BORDER_RADIUS.ROUNDED_FULL,
                                    'w-12 h-12 object-cover'
                                )}
                            />
                            <div>
                                <h2 className={classNames(
                                    'text-xl text-[#101729]',
                                    UI_CONSTANTS.COLORS.PRIMARY,
                                    UI_CONSTANTS.FONTS.POPPINS
                                )}>
                                    {userInfo?.nickname}
                                </h2>
                            </div>
                        </div>
                        {/* Edit and Settings buttons */}
                        <div className={classNames(
                            'flex items-center text-[#101729]',
                            UI_CONSTANTS.SPACING.GAP_2
                        )}>

                                <Button variant="ghost" size="icon" onClick={handleBack}>
                                    <ChevronLeft className={classNames(
                                        UI_CONSTANTS.SIZES.ICON_LG,
                                        UI_CONSTANTS.COLORS.PRIMARY
                                    )} />
                                </Button>

                        </div>
                    </div>

                    {/* 用户信息 */}
                    <div className="relative flex flex-col gap-3 mt-3">
                        {/* 品牌信息 */}
                        <div className="flex items-center">
                            <span className="text-l text-[#101729] text-right font-nunito min-w-[50px] flex-shrink-0">{t('personalPage.brand')}:</span>
                            <div className="flex items-center gap-2 flex-1 pl-4">
                                {userInfo?.brand ? (
                                    userInfo?.officialsite ? (
                                        <a
                                            href={userInfo.officialsite.startsWith('http') ? userInfo.officialsite : `https://${userInfo.officialsite}`}
                                            className="text-[#101729] font-nunito underline hover:opacity-80"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {userInfo.brand}
                                        </a>
                                    ) : (
                                        <span className="text-[#101729] font-nunito">{userInfo.brand}</span>
                                    )
                                ) : (
                                    <span className="text-[#777] font-nunito">--</span>
                                )}
                                {userInfo?.logo && (
                                    <Image
                                        src={buildAvatarUrl(userInfo.logo)}
                                        alt="Brand Logo"
                                        width={32}
                                        height={32}
                                        className="h-12 w-auto max-w-20 object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {/* 简介 */}
                        {userInfo?.brief && (
                            <div className="flex items-start">
                                <span className="text-l text-[#101729] text-right font-nunito min-w-[50px] flex-shrink-0">{t('personalPage.brief')}:</span>
                                <div className="flex-1 pl-4">
                                    <p className="text-base text-gray-700 font-inter leading-relaxed">{userInfo.brief}</p>
                                </div>
                            </div>
                        )}
                        {userInfo?.tel && userInfo?.address && userInfo?.email && ( <div className="ml-17">
                        <p className="text-sm text-gray-700 font-inter">{t('personalPage.customerServiceHotline')}:{userInfo.tel}</p>
                        <p className="text-sm text-gray-700 font-inter">{t('personalPage.workingHours')}:{userInfo.address}</p>
                        <p className="text-sm text-gray-700 font-inter">{t('personalPage.email')}:{userInfo.email}</p>
                    </div>)}

                        {/* 关注按钮 - 只有查看其他用户页面时才显示 */}
                        {targetUserId !== authInfo?.userId && (
                            <div className="flex items-center gap-2" style={{ zIndex: 10 }}>
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={isFollowLoading}
                                    className={classNames(
                                        'flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                                        isFollowing 
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' 
                                            : 'bg-[#101729] text-white hover:bg-gray-800'
                                    )}
                                >
                                    {isFollowLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Heart className={classNames(
                                            'h-4 w-4',
                                            isFollowing ? 'fill-current' : ''
                                        )} />
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

                        {/* Edit按钮布局到底部右下角 - 只有查看自己的页面时才显示 */}
                        {targetUserId === authInfo?.userId && (
                            <Link
                                href="/brand-edit"
                                className="absolute right-0 bottom-0 flex items-center gap-1 hover:opacity-80"
                                style={{ zIndex: 10 }}
                            >
                                <Edit className="h-4 w-4 text-[#101729]" />
                            </Link>
                        )}
                    </div>

                </div>
                

                {/* 错误和成功消息 */}
                {errorMessage && (
                    <div className="mx-4 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600 text-base">
                            <AlertCircle className="h-5 w-5" />
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                )}
                
                {successMessage && (
                    <div className="mx-4 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 text-base">
                            <span>{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* My Posts section */}
                <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'h-[calc(72vh-130px)]')}>

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
                                'ml-2 text-[#101729]',
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
                                'ml-2 text-[#101729]',
                                UI_CONSTANTS.COLORS.RED_500,
                                UI_CONSTANTS.FONTS.NUNITO
                            )}>{t("personalPage.error")}</span>
                        </div>
                    )}

                    {!loading && !error && postsData.length === 0 && (
                        <div className={classNames(
                            'flex flex-col items-center justify-center text-[#101729]',
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
                                'text-center text-[#101729]'
                            )}>
                                {t("personalPage.noPostsDescription")}
                            </p>
                        </div>
                    )}

                    {!loading && !error && postsData.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 text-[#101729] overflow-y-auto h-[calc(72vh-130px)]">
                            {postsData.map((post) => {
                                
                                return (
                                    
                                <div key={post.id} className="bg-white" onClick={() => router.push(`/square/${post.id}`)}>
                                    <div className="" style={{ borderBottom: '1px solid #e5e7eb' }}></div>
                                    <div className="py-4">
                                        <div className={classNames(
                                            'flex items-center gap-2',
                                            UI_CONSTANTS.SPACING.MB_4
                                        )}>
                                            <MapPin className={classNames(
                                                'h-3 w-3','text-[#101729]'
                                            )} />
                                            <span className={classNames(
                                                'text-sm', 'text-[#101729]'
                                            )}>{post.location}</span>
                                        </div>
                                        <div className={classNames(
                                            'flex gap-2 mb-3 overflow-x-auto'
                                        )}>
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
                                                                <path d="M8 5v14l11-7z"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* 显示图片（如果有视频，则显示较少图片；如果没有视频，则显示最多3张） */}
                                            {(post.images || [])
                                                .filter(image => !!image && image.trim() !== "")
                                                .slice(0, post.video ? 2 : 3)
                                                .map((image, imageIndex) => {
                                                const imageUrl = buildAvatarUrl(image);
                                                return (
                                                    <div key={imageIndex} className="relative w-34 h-24 rounded flex-shrink-0 bg-gray-100 overflow-hidden">
                                                        <Image
                                                            src={imageUrl}
                                                            alt={`Post ${post.id} image ${imageIndex + 1}`}
                                                            width={136}
                                                            height={96}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                console.error(`Failed to load image: ${imageUrl}`);
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <h3 className={classNames(
                                            'text-[#101729] mb-2 text-base',
                                            UI_CONSTANTS.FONTS.NUNITO,
                                            UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD,
                                        )}>{post.title}</h3>
                                        <p className={classNames(
                                            'text-sm text-[#101729] mb-3 line-clamp-2 leading-relaxed',
                                            UI_CONSTANTS.FONTS.INTER
                                        )}>{post.description}</p>
                                        {/* 只有查看自己的页面时才显示操作按钮 */}
                                        {targetUserId === authInfo?.userId && (
                                            <div className={classNames(
                                                HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN
                                            )}>
                                                <div className={classNames(
                                                    'flex items-center gap-3'
                                                )}>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 阻止事件冒泡，避免触发父元素的点击事件
                                                            handleDeleteClick(post.id);
                                                        }}
                                                        disabled={isDeleting === post.id}
                                                        className={classNames(
                                                            'flex flex-col items-center gap-0.5 text-[#101729] hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                        )}
                                                    >
                                                        {isDeleting === post.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                        <span className={classNames(
                                                            'text-sm',
                                                            UI_CONSTANTS.FONTS.NUNITO
                                                        )}>
                                                            {isDeleting === post.id ? t('personalPage.deleting') : t('personalPage.delete')}
                                                        </span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 阻止事件冒泡
                                                            handleHideArticle(post.id, post.status || 0);
                                                        }}
                                                        disabled={isHiding === post.id}
                                                        className={classNames(
                                                            'flex flex-col items-center gap-0.5 text-[#101729] hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                        )}
                                                    >
                                                        {isHiding === post.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : post.status === 1 ? (
                                                            <Eye className="h-4 w-4" />
                                                        ) : (
                                                            <EyeOff className="h-4 w-4" />
                                                        )}
                                                        <span className={classNames(
                                                            'text-sm',
                                                            UI_CONSTANTS.FONTS.NUNITO
                                                        )}>
                                                            {isHiding === post.id 
                                                                ? t('personalPage.processing') 
                                                                : post.status === 1 
                                                                    ? t('personalPage.show') 
                                                                    : t('personalPage.hide')
                                                            }
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}                
                </div>
                {/* Footer - 只有查看自己的页面时才显示发布按钮 */}
                {targetUserId === authInfo?.userId && (
                    <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'z-10')}>
                        <div className={classNames(
                            HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
                            UI_CONSTANTS.SPACING.GAP_4
                        )}>
                            {/* Post button */}
                            <Link href="/release">
                                <Button
                                    className={classNames(
                                        'bg-transparent rounded-full h-16 w-16 flex flex-col items-center justify-center gap-1 text-[#101729]',
                                        UI_CONSTANTS.FONTS.NUNITO,
                                        'text-xl font-bold'
                                    )}
                                    size="lg"
                                >
                                    <CirclePlus className="h-12 w-12 text-[#101729]" />
                                    <span className={classNames(
                                        'text-sm',
                                        UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD
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
            </main>
    );
}
