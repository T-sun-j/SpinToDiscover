"use client";

import { Button } from '../../components/ui/button';
import { ArrowLeft, Edit, EyeOff, Trash2, MapPin, Heart, Share2, ChevronLeft, Plus, CirclePlus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useApi } from '../../lib/hooks/useApi';
import { getMyPageList } from '../../lib/services';
import { MyPageItem } from '../../lib/api';
import { UI_CONSTANTS, HISTORY_CONSTANTS, API_CONSTANTS, ANIMATION_CONSTANTS } from '../../lib/constants';
import { classNames } from '../../lib/utils/classNames';

export default function PersonalPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isFollowing, setIsFollowing] = useState(false);
    const [postsData, setPostsData] = useState<MyPageItem[]>([]);

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

    // 组件挂载时获取数据
    useEffect(() => {
        if (userParams) {
            execute();
        }
    }, [execute, userParams]);

    // 更新作品数据
    useEffect(() => {
        if (data?.posts) {
            setPostsData(data.posts);
        }
    }, [data]);

    const handleBack = () => {
        router.back();
    };

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
    };

    // 模拟数据
    const post = {
        id: 1,
        title: t('square.titleContent'),
        location: t('square.location'),
        publisher: t('square.publisher'),
        description: t('square.description'),
        likes: 23,
        totalLikes: 505,
        shares: 1232,
        collects: 1232,
        images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop'
        ],
        video: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        brandWebsite: t('square.brandWebsite'),
        brandLogo: t('square.brandLogo'),
        operatingHours: t('square.operatingHours'),
        customerService: t('square.customerService'),
        workingHours: t('square.workingHours'),
        email: t('square.email'),
        comments: [
            {
                id: 1,
                author: t('square.publisher'),
                content: 'We warmly welcome all friends who are interested in such brands to explore better product experiences together.',
                replies: 1
            },
            {
                id: 2,
                author: t('square.publisher'),
                content: 'Please click on our website to get in touch with us.',
                replies: 0
            }
        ]
    };

    return (
        <main className={classNames(
            'flex',
            HISTORY_CONSTANTS.LAYOUT.MIN_HEIGHT_DVH,
            HISTORY_CONSTANTS.LAYOUT.FLEX_COL,
            'bg-white'
        )}>
            {/* Header */}
            <Header
                showLanguage
                showSearch
                showUser
            />

            {/* User and Brand Info */}
            <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'py-4')}>
                <div className={classNames(
                    HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN
                )}>
                    <div className={classNames(
                        'flex items-center',
                        UI_CONSTANTS.SPACING.GAP_4
                    )}>
                        <Image
                            src="/img/avatar.png"
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
                                'text-lg',
                                UI_CONSTANTS.COLORS.PRIMARY,
                                UI_CONSTANTS.FONTS.POPPINS
                            )}>Miaham</h2>
                        </div>
                    </div>
                    {/* Edit and Settings buttons */}
                    <div className={classNames(
                        'flex items-center',
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

                {/* 品牌信息 */}
                <div className="flex flex-col gap-3 ml-14">
                    {/* 品牌网站 */}
                    <div className="flex items-center gap-3">
                        <span className="text-l text-gray-700 font-nunito">Brand:</span>
                        <a href={`https://${post.brandWebsite}`} className="text-[#101729] hover:underline font-nunito">
                            {post.brandWebsite}
                        </a>
                    </div>

                    {/* 营业时间 */}
                    <div className="flex items-start gap-3">
                        <span className="text-l text-gray-700 font-nunito">Brief:</span>
                        <div className="flex-1 flex ">
                            <p className="text-[12px] text-gray-700 font-inter leading-relaxed">{post.operatingHours}</p>
                            <img
                                src="/img/band.png"
                                alt="Loro Piana Logo"
                                className="h-8 w-auto"
                            />
                        </div>
                    </div>
                    <div className="ml-8">
                        <p className="text-[12px] text-gray-700 font-inter">{post.customerService}</p>
                        <p className="text-[12px] text-gray-700 font-inter">{post.workingHours}</p>
                        <p className="text-[12px] text-gray-700 font-inter">{post.email}</p>
                    </div>
                </div>
            </div>
            <div className="mx-4" style={{ borderBottom: '1px solid #e5e7eb' }}></div>

            {/* My Posts section */}
            <div className={classNames(UI_CONSTANTS.SPACING.PX_6, 'py-4')}>
                <div className={classNames(
                    HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN,
                    UI_CONSTANTS.SPACING.MB_4
                )}>
                    <h2 className={classNames(
                        'text-lg',
                        UI_CONSTANTS.COLORS.PRIMARY,
                        UI_CONSTANTS.FONTS.POPPINS
                    )}>{t('personalPage.myPosts')}</h2>
                    <button
                        aria-label={t("personalPage.refresh")}
                        onClick={() => execute()}
                        disabled={loading}
                        className={classNames(
                            UI_CONSTANTS.COLORS.PRIMARY,
                            'hover:text-[#101729]/80',
                            'disabled:opacity-50'
                        )}
                    >
                        <RefreshCw className={classNames(
                            UI_CONSTANTS.SIZES.ICON_MD,
                            loading && ANIMATION_CONSTANTS.SPIN
                        )} />
                    </button>
                </div>

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
                            'ml-2',
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
                            'ml-2',
                            UI_CONSTANTS.COLORS.RED_500,
                            UI_CONSTANTS.FONTS.NUNITO
                        )}>{t("personalPage.error")}</span>
                    </div>
                )}

                {!loading && !error && postsData.length === 0 && (
                    <div className={classNames(
                        'flex flex-col items-center justify-center',
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
                            'text-center'
                        )}>
                            {t("personalPage.noPostsDescription")}
                        </p>
                    </div>
                )}

                {!loading && !error && postsData.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        {postsData.map((post) => (
                            <div key={post.id} className="bg-white">
                                <div className="py-4">
                                    <div className={classNames(
                                        'flex items-center gap-2',
                                        UI_CONSTANTS.SPACING.MB_4
                                    )}>
                                        <MapPin className={classNames(
                                            'h-3 w-3',
                                            UI_CONSTANTS.COLORS.GRAY_400
                                        )} />
                                        <span className={classNames(
                                            'text-xs',
                                            UI_CONSTANTS.COLORS.GRAY_400
                                        )}>{post.location}</span>
                                    </div>
                                    <div className={classNames(
                                        'flex gap-2 mb-3 overflow-x-auto'
                                    )}>
                                        {post.images.slice(0, 3).map((image, imageIndex) => (
                                            <Image
                                                key={imageIndex}
                                                src={image || HISTORY_CONSTANTS.IMAGES.DEFAULT_IMAGE}
                                                alt={`Post ${post.id} image ${imageIndex + 1}`}
                                                width={136}
                                                height={96}
                                                className="w-34 h-24 object-cover rounded flex-shrink-0"
                                            />
                                        ))}
                                    </div>
                                    <h3 className={classNames(
                                        'text-gray-900 mb-2 text-sm',
                                        UI_CONSTANTS.FONTS.NUNITO
                                    )}>{post.title}</h3>
                                    <p className={classNames(
                                        'text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed',
                                        UI_CONSTANTS.FONTS.INTER
                                    )}>{post.description}</p>
                                    <div className={classNames(
                                        HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN
                                    )}>
                                        <div className={classNames(
                                            'flex items-center gap-3'
                                        )}>
                                            <button className={classNames(
                                                'flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700'
                                            )}>
                                                <Trash2 className="h-4 w-4" />
                                                <span className={classNames(
                                                    'text-xs',
                                                    UI_CONSTANTS.FONTS.NUNITO
                                                )}>{t('personalPage.delete')}</span>
                                            </button>
                                            <button className={classNames(
                                                'flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700'
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
                                    'bg-white rounded-full h-16 w-16 flex flex-col items-center justify-center gap-1',
                                    UI_CONSTANTS.COLORS.PRIMARY,
                                    UI_CONSTANTS.FONTS.NUNITO,
                                    'text-lg font-bold'
                                )}
                                size="lg"
                            >
                                <CirclePlus className="h-48 w-48" />
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
    );
}
