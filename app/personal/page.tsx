"use client";

import { Button } from '../../components/ui/button';
import { ArrowLeft, Edit, EyeOff, Trash2, MapPin, Heart, Share2, ChevronLeft, Plus, CirclePlus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useApi } from '../../lib/hooks/useApi';
import { getMyPageList } from '../../lib/services';
import { getUserInfo } from '../../lib/auth';
import { MyPageItem, UserInfoResponse, buildAvatarUrl } from '../../lib/api';
import { UI_CONSTANTS, HISTORY_CONSTANTS, API_CONSTANTS, ANIMATION_CONSTANTS } from '../../lib/constants';
import { classNames } from '../../lib/utils/classNames';
import { useAuth } from '../../contexts/AuthContext';
import { AuthGuard } from '../../components/AuthGuard';

export default function PersonalPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { getEmail } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [postsData, setPostsData] = useState<MyPageItem[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
    const hasLoaded = useRef(false);
    const userInfoLoaded = useRef(false);

    // 使用API Hook获取个人作品数据
    const { data, loading, error, execute, userParams } = useApi(
        async (params) => {
            const response = await getMyPageList({
                userId: params.userId,
                token: params.token,
                page: API_CONSTANTS.DEFAULT_PAGE,
                limit: API_CONSTANTS.DEFAULT_LIMIT,
            });
            return response.data;
        },
        {
            posts: [],
            pagination: {
                currentPage: API_CONSTANTS.DEFAULT_PAGE,
                totalPages: 1,
                totalItems: 0,
                hasNext: false,
                hasPrev: false
            }
        }
    );

    // 使用API Hook获取用户信息
    const {
        data: userInfoData,
        loading: userInfoLoading,
        error: userInfoError,
        execute: executeUserInfo
    } = useApi(
        async (params) => {
            const response = await getUserInfo({
                email: getEmail() || '',
                userId: params.userId,
                token: params.token,
            });
            // 直接返回response，因为getUserInfo已经返回了ApiResponse<UserInfoResponse>
            return response;
        },
        null
    );

    // 组件挂载时获取数据
    useEffect(() => {
        if (userParams && userParams.userId && userParams.token && !hasLoaded.current) {
            hasLoaded.current = true;
            execute();
        }
    }, [userParams?.userId, userParams?.token, execute]);

    // 获取用户信息
    useEffect(() => {
        if (userParams && userParams.userId && userParams.token && !userInfoLoaded.current) {
            userInfoLoaded.current = true;
            executeUserInfo();
        }
    }, [userParams?.userId, userParams?.token, executeUserInfo]);

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

    return (
        <AuthGuard>
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
                                    {userInfo?.nickname || 'Miaham'}
                                </h2>
                            </div>
                        </div>
                        {/* Edit and Settings buttons */}
                        <div className={classNames(
                            'flex items-center text-[#101729]',
                            UI_CONSTANTS.SPACING.GAP_2
                        )}>
                            <Link href="/personal-center">
                                <Button variant="ghost" size="icon">
                                    <ChevronLeft className={classNames(
                                        UI_CONSTANTS.SIZES.ICON_LG,
                                        UI_CONSTANTS.COLORS.PRIMARY
                                    )} />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* 用户信息 */}
                    <div className="relative flex flex-col gap-3 ml-14">
                        {/* 品牌信息 */}
                        <div className="flex items-center gap-3">
                            <span className="text-l text-[#101729] font-nunito">Brand:</span>
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
                                <span className="text-l text-[#101729] font-nunito ml-2">Brief:</span>
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
                        <p className="text-[12px] text-gray-700 font-inter">Customer Service Hotline:{userInfo.tel}</p>
                        <p className="text-[12px] text-gray-700 font-inter">Working hours:{userInfo.address}</p>
                        <p className="text-[12px] text-gray-700 font-inter">E-mail:{userInfo.email}</p>
                    </div>)}

                        {/* Edit按钮布局到底部右下角 */}
                        <Link
                            href="/brand-edit"
                            className="absolute right-0 bottom-0 flex items-center gap-1 hover:opacity-80"
                            style={{ zIndex: 10 }}
                        >
                            <Edit className="h-4 w-4 text-[#101729]" />
                        </Link>
                    </div>

                </div>
                <div className="mx-4" style={{ borderBottom: '1px solid #e5e7eb' }}></div>

                {/* My Posts section */}
                <div className={classNames(UI_CONSTANTS.SPACING.PX_6)}>

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
                        <div className="grid grid-cols-1 gap-4 text-[#101729]">
                            {postsData.map((post) => (
                                <div key={post.id} className="bg-white">
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
                                            {post.images.slice(0, 3).map((image, imageIndex) => (
                                                <Image
                                                    key={imageIndex}
                                                    src={buildAvatarUrl(image)}
                                                    alt={`Post ${post.id} image ${imageIndex + 1}`}
                                                    width={136}
                                                    height={96}
                                                    className="w-34 h-24 object-cover rounded flex-shrink-0"
                                                />
                                            ))}
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
                                        <div className={classNames(
                                            HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN
                                        )}>
                                            <div className={classNames(
                                                'flex items-center gap-3'
                                            )}>
                                                <button className={classNames(
                                                    'flex flex-col items-center gap-0.5 text-[#101729] hover:text-[#101729]'
                                                )}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className={classNames(
                                                        'text-xs',
                                                        UI_CONSTANTS.FONTS.NUNITO
                                                    )}>{t('personalPage.delete')}</span>
                                                </button>
                                                <button className={classNames(
                                                    'flex flex-col items-center gap-0.5 text-[#101729] hover:text-[#101729]'
                                                )}>
                                                    <EyeOff className="h-4 w-4" />
                                                    <span className={classNames(
                                                        'text-xs',
                                                        UI_CONSTANTS.FONTS.NUNITO
                                                    )}>{t('personalPage.hide')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div style={{ borderBottom: '1px solid #e5e7eb' }}></div>
                        </div>
                    )}

                    <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'py-4 mt-8')}>
                        <div className={classNames(
                            HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
                            UI_CONSTANTS.SPACING.GAP_4
                        )}>
                            {/* Post button */}
                            <Link href="/release">
                                <Button
                                    className={classNames(
                                        'bg-white rounded-full h-16 w-16 flex flex-col items-center justify-center gap-1 text-[#101729]',
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
                </div>
                {/* Footer */}
                <Footer />
            </main>
        </AuthGuard>
    );
}
