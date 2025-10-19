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
import { getUserInfo, deleteArticle, hideArticle } from '../../../lib/auth';
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
    const [isFollowing, setIsFollowing] = useState(false);
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
            // 如果有登录信息，使用登录信息；否则使用默认信息
            const userId = authInfo?.userId || 'default';
            const token = authInfo?.token || 'default';
            
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
            // 如果有登录信息，使用登录信息；否则使用默认信息
            const userId = authInfo?.userId || 'default';
            const token = authInfo?.token || 'default';
            const email = authInfo?.email || 'default@example.com';
            
            const response = await getUserInfo({
                email: email,
                userId: targetUserId,
                token: token,
            });
            
            if (response.success && response.data) {
                setUserInfoData(response);
            } else {
                setUserInfoError(t('personalPage.loadUserInfoFailed'));
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
            loadPostsData();
        }
    }, [targetUserId]);

    // 获取用户信息
    useEffect(() => {
        if (targetUserId && !userInfoLoaded.current) {
            userInfoLoaded.current = true;
            loadUserInfo();
        }
    }, [targetUserId]);

    // 更新作品数据
    useEffect(() => {
        if (data?.posts) {
            setPostsData(data.posts);
        }
    }, [data]);

    // 更新用户信息数据
    useEffect(() => {
        if (userInfoData && userInfoData.success && userInfoData.data) {
            setUserInfo(userInfoData.data);
        }
    }, [userInfoData]);

    const handleBack = () => {
        router.back();
    };

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
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
                // 从列表中移除已删除的作品
                setPostsData(prev => prev.filter(post => post.id !== articleToDelete));
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
                // 更新本地作品状态
                setPostsData(prev => prev.map(post => 
                    post.id === articleId 
                        ? { ...post, status: newStatus }
                        : post
                ));
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
                                    'w-10 h-10 object-cover'
                                )}
                            />
                            <div>
                                <h2 className={classNames(
                                    'text-lg text-[#101729]',
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
                    <div className="relative flex flex-col gap-3 ml-14">
                        {/* 品牌信息 */}
                        <div className="flex items-center gap-3">
                            <span className="text-l text-[#101729] font-nunito">{t('personalPage.brand')}:</span>
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
                        </div>

                        {/* 简介 */}
                        {userInfo?.brief && (
                            <div className="flex items-start gap-3">
                                <span className="text-l text-[#101729] font-nunito ml-2">{t('personalPage.brief')}:</span>
                                <div className="flex-1 flex">
                                    <p className="text-[12px] pt-1 text-gray-700 font-inter leading-relaxed">{userInfo.brief}</p>
                                    {userInfo?.logo && (
                                        <img
                                            src={buildAvatarUrl(userInfo.logo)}
                                            alt="Brand Logo"
                                            className="h-8 w-auto ml-2"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        {userInfo?.tel && userInfo?.address && userInfo?.email && ( <div className="ml-14">
                        <p className="text-[12px] text-gray-700 font-inter">{t('personalPage.customerServiceHotline')}:{userInfo.tel}</p>
                        <p className="text-[12px] text-gray-700 font-inter">{t('personalPage.workingHours')}:{userInfo.address}</p>
                        <p className="text-[12px] text-gray-700 font-inter">{t('personalPage.email')}:{userInfo.email}</p>
                    </div>)}

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
                <div className="mx-4" style={{ borderBottom: '1px solid #e5e7eb' }}></div>

                {/* 错误和成功消息 */}
                {errorMessage && (
                    <div className="mx-4 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                )}
                
                {successMessage && (
                    <div className="mx-4 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                            <span>{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* My Posts section */}
                <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'h-[calc(72vh-200px)]')}>

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
                        <div className="grid grid-cols-1 gap-4 text-[#101729] overflow-y-auto h-[calc(72vh-90px)]">
                            {postsData.map((post) => {
                                
                                return (
                                <div key={post.id} className="bg-white" onClick={() => router.push(`/square/${post.id}`)}>
                                    <div className="py-4">
                                        <div className={classNames(
                                            'flex items-center gap-2',
                                            UI_CONSTANTS.SPACING.MB_4
                                        )}>
                                            <MapPin className={classNames(
                                                'h-3 w-3','text-[#101729]'
                                            )} />
                                            <span className={classNames(
                                                'text-xs', 'text-[#101729]'
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
                                            'text-[#101729] mb-2 text-sm',
                                            UI_CONSTANTS.FONTS.NUNITO,
                                            UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD,
                                        )}>{post.title}</h3>
                                        <p className={classNames(
                                            'text-xs text-[#101729] mb-3 line-clamp-2 leading-relaxed',
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
                                                            'text-xs',
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
                                                            'text-xs',
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
                    <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'py-4 mt-8 z-10')}>
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
                                        'text-lg font-bold'
                                    )}
                                    size="lg"
                                >
                                    <CirclePlus className="h-48 w-48 text-[#101729]" />
                                    <span className={classNames(
                                        'text-xs',
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
                            <AlertDialogTitle className="text-lg font-semibold text-gray-900 mb-2">
                                {t('personalPage.confirmDelete')}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-600 leading-relaxed">
                                {t('personalPage.confirmDeleteMessage')}<br />
                                {t('personalPage.confirmDeleteDescription')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-3  justify-center">
                            <AlertDialogCancel className="h-10 px-6 text-sm rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                                {t('personalPage.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDeleteArticle}
                                className="h-10 px-6 text-sm mt-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-medium"
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
