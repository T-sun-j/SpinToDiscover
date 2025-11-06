"use client";

import { Button } from '../../components/ui/button';
import { ArrowLeft, RotateCcw, Settings, CirclePlus, Bell, ChevronLeft, Loader2, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useApi } from '../../lib/hooks/useApi';
import { getUserInfo } from '../../lib/services';
import { UserInfoResponse } from '../../lib/api';
import { UI_CONSTANTS, HISTORY_CONSTANTS, API_CONSTANTS, ANIMATION_CONSTANTS } from '../../lib/constants';
import { buildAvatarUrl } from '../../lib/api';
import { classNames } from '../../lib/utils/classNames';
import { useAuth } from '../../contexts/AuthContext';
import { AuthGuard } from '../../components/AuthGuard';

export default function PersonalCenterPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { getEmail, clearAuthInfo } = useAuth();
    const [userData, setUserData] = useState<UserInfoResponse | null>(null);
    const hasLoaded = useRef(false);

    // 退出登录处理函数
    const handleLogout = () => {
        clearAuthInfo();
        router.push('/login');
    };

    // 使用API Hook获取用户信息
    const { data, loading, error, execute, userParams } = useApi(
        async (params) => {
            const response = await getUserInfo({
                email: params.email || getEmail() || '', // 优先使用存储的email
                userId: params.userId,
                token: params.token,
            });
            return response.data; // API直接返回用户数据，不需要.user
        },
        null as UserInfoResponse | null
    );

    // 组件挂载时获取数据
    useEffect(() => {
        if (userParams && userParams.email && userParams.userId && userParams.token && !hasLoaded.current) {
            hasLoaded.current = true;
            execute();
        }
    }, [userParams?.userId, userParams?.token, userParams?.email, execute]);

    // 更新用户数据
    useEffect(() => {
        if (data) {
            setUserData(data);
        }
    }, [data]);

    return (
        <AuthGuard>
            <main className={classNames(
                'flex',
                HISTORY_CONSTANTS.LAYOUT.MIN_HEIGHT_DVH,
                HISTORY_CONSTANTS.LAYOUT.FLEX_COL,
                'bg-white'
            )}>
                {/* Header with logo and language toggle */}
                <Header
                    showLanguage
                    logoLink="/square"
                />

            {/* 页面标题和返回按钮 */}
            <div className={classNames(
                HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN,
                UI_CONSTANTS.SPACING.PX_6,
                'py-4',
                'text-[#11295b]'
            )}>
                <h1 className={classNames(
                    'text-xl',
                    UI_CONSTANTS.COLORS.PRIMARY
                )}>{t('personalCenter.title')}</h1>
                <button
                    onClick={() => router.push('/square')}
                    className={classNames(
                        UI_CONSTANTS.COLORS.PRIMARY,
                        'hover:text-[#11295b]'
                    )}
                >
                    <ChevronLeft className={UI_CONSTANTS.SIZES.ICON_LG} />
                </button>
            </div>

            {/* User profile section */}
            <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'py-4')}>
                {loading && (
                    <div className={classNames(
                        HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
                        'py-4'
                    )}>
                        <Loader2 className={classNames(
                            UI_CONSTANTS.SIZES.ICON_MD,
                            ANIMATION_CONSTANTS.SPIN,
                            UI_CONSTANTS.COLORS.PRIMARY
                        )} />
                        <span className={classNames(
                            'ml-2',
                            UI_CONSTANTS.COLORS.PRIMARY,
                            UI_CONSTANTS.FONTS.NUNITO
                        )}>{t("userInfo.loading")}</span>
                    </div>
                )}

                {error && (
                    <div className={classNames(
                        HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
                        'py-4'
                    )}>
                        <AlertCircle className={classNames(
                            UI_CONSTANTS.SIZES.ICON_MD,
                            UI_CONSTANTS.COLORS.RED_500
                        )} />
                        <span className={classNames(
                            'ml-2',
                            UI_CONSTANTS.COLORS.RED_500,
                            UI_CONSTANTS.FONTS.NUNITO
                        )}>{t("userInfo.error")}</span>
                        <button
                            onClick={() => execute()}
                            className={classNames(
                                'ml-2 p-1',
                                UI_CONSTANTS.COLORS.PRIMARY,
                                'hover:text-[#11295b]/80'
                            )}
                        >
                            <RefreshCw className={classNames(
                                UI_CONSTANTS.SIZES.ICON_SM
                            )} />
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className={classNames('flex items-center', UI_CONSTANTS.SPACING.GAP_4)}>
                        {/* Profile picture */}
                        <div className="relative">
                            <Image
                                src={buildAvatarUrl(userData?.avatar)}
                                alt="Profile"
                                width={12}
                                height={12}
                                className={classNames(
                                    UI_CONSTANTS.BORDER_RADIUS.ROUNDED_FULL,
                                    'h-12 w-12 object-cover'
                                )}
                            />
                        </div>

                        {/* Username and user info */}
                        <div className="flex-1 flex items-center text-[#11295b]">
                            <div className="flex-1">
                                <h2 className={classNames(
                                    'text-xl',
                                    UI_CONSTANTS.COLORS.PRIMARY,
                                    UI_CONSTANTS.FONTS.POPPINS,
                                    'flex items-center gap-1'
                                )}>
                                    {userData?.nickname || userData?.email || 'User'}
                                    <Link href="/personalization">
                                        <Button variant="ghost" size="icon" className={classNames(
                                            UI_CONSTANTS.COLORS.PRIMARY,
                                            'p-1 h-7 w-7'
                                        )}>
                                            <RotateCcw className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </h2>
                            </div>
                        </div>

                        {/* Edit and Settings buttons */}
                        <div className={classNames('flex items-center', 'text-[#11295b]',UI_CONSTANTS.SPACING.GAP_2)}>
                            <Link href="/settings">
                                <Button variant="ghost" size="icon" className={UI_CONSTANTS.COLORS.PRIMARY}>
                                    <Settings className={UI_CONSTANTS.SIZES.ICON_LG} />
                                </Button>
                            </Link>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className={UI_CONSTANTS.COLORS.PRIMARY}
                                onClick={handleLogout}
                                title={t('personalCenter.logout')}
                            >
                                <LogOut className={UI_CONSTANTS.SIZES.ICON_LG} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Menu items */}
            <div className={classNames('flex-1', UI_CONSTANTS.SPACING.PX_6, 'py-4')}>
                <div className="space-y-4">
                    <Link href="/personal">
                        <Button
                            variant="ghost"
                            className={classNames(
                                'w-full justify-start',
                                'bg-[#11295b] text-white h-14 rounded-xl',
                                UI_CONSTANTS.FONTS.NUNITO,
                                'text-lg font-bold'
                            )}
                        >
                            {t('personalCenter.menu.myPage')}
                        </Button>
                    </Link>
                    <div className="h-2" />
                    <Link href="/followed">
                        <Button
                            variant="ghost"
                            className={classNames(
                                'w-full justify-start',
                                'bg-[#11295b] text-white h-14 rounded-xl',
                                UI_CONSTANTS.FONTS.NUNITO,
                                'text-lg font-bold'
                            )}
                        >
                            {t('personalCenter.menu.followed')}
                        </Button>
                    </Link>
                    <div className="h-2" />
                    <Link href="/history">
                        <Button
                            variant="ghost"
                            className={classNames(
                                'w-full justify-start',
                                'bg-[#11295b] text-white h-14 rounded-xl',
                                UI_CONSTANTS.FONTS.NUNITO,
                                'text-lg font-bold'
                            )}
                        >
                            {t('personalCenter.menu.history')}
                        </Button>
                    </Link>
                    <div className="h-2" />
                    <Link href="/favorite">
                        <Button
                            variant="ghost"
                            className={classNames(
                                'w-full justify-start',
                                'bg-[#11295b] text-white h-14 rounded-xl',
                                UI_CONSTANTS.FONTS.NUNITO,
                                'text-lg font-bold'
                            )}
                        >
                            {t('personalCenter.menu.favorites')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Post button and notifications */}
            <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'py-4')}>
                <div className={classNames(
                    HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
                    UI_CONSTANTS.SPACING.GAP_4
                )}>
                    {/* Post button */}
                    <Link href="/release">
                        <Button
                            className={classNames(
                                'bg-white rounded-full h-16 w-16 flex flex-col items-center justify-center gap-1 text-[#11295b]',
                                UI_CONSTANTS.COLORS.PRIMARY,
                                UI_CONSTANTS.FONTS.NUNITO,
                                'text-lg font-bold'
                            )}
                            size="lg"
                        >
                            <CirclePlus className="h-48 w-48 ,'text-[#11295b]'," />
                            <span className={classNames(
                                'text-xs','text-[#11295b]',
                                UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD
                            )}>{t('personalCenter.post.button')}</span>
                        </Button>
                    </Link>
                </div>
            </div>

                {/* Footer */}
                <div className="mt-auto">
                    <Footer />
                </div>
            </main>
        </AuthGuard>
    );
}
