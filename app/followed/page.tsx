"use client";

import { Button } from '../../components/ui/button';
import { ChevronLeft, Loader2, Earth } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { AuthGuard } from '../../components/AuthGuard';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useApi } from '../../lib/hooks/useApi';
import { getFollowedList, getFollowersList } from '../../lib/auth';
import { FollowUser, buildAvatarUrl } from '../../lib/api';
import { classNames } from '../../lib/utils/classNames';
import { UI_CONSTANTS, ANIMATION_CONSTANTS } from '../../lib/constants';

export default function FollowedPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'following';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followedUsers, setFollowedUsers] = useState<FollowUser[]>([]);
  const [followersUsers, setFollowersUsers] = useState<FollowUser[]>([]);
  const hasLoadedFollowed = useRef(false);
  const hasLoadedFollowers = useRef(false);

  // 使用API Hook获取关注列表
  const { 
    data: followedData, 
    loading: followedLoading, 
    error: followedError, 
    execute: executeFollowed,
    userParams 
  } = useApi(
    async (params) => {
      const response = await getFollowedList({
        userId: params.userId,
        token: params.token,
      });
      return response;
    },
    null
  );

  // 使用API Hook获取粉丝列表
  const { 
    data: followersData, 
    loading: followersLoading, 
    error: followersError, 
    execute: executeFollowers
  } = useApi(
    async (params) => {
      const response = await getFollowersList({
        userId: params.userId,
        token: params.token,
      });
      return response;
    },
    null
  );

  // 组件挂载时根据URL参数获取数据
  useEffect(() => {
    if (userParams && userParams.userId && userParams.token) {
      const tabFromUrl = searchParams.get('tab') || 'following';
      if (tabFromUrl === 'following' && !hasLoadedFollowed.current) {
        hasLoadedFollowed.current = true;
        executeFollowed();
      } else if (tabFromUrl === 'follower' && !hasLoadedFollowers.current) {
        hasLoadedFollowers.current = true;
        executeFollowers();
      }
    }
  }, [userParams?.userId, userParams?.token, searchParams, executeFollowed, executeFollowers]);

  // 更新关注用户数据
  useEffect(() => {
    if (followedData && followedData.success) {
      const responseData = followedData as any;
      if (responseData.dataList) {
        console.log('关注列表数据:', responseData.dataList);
        setFollowedUsers(responseData.dataList);
        
      }
    }
  }, [followedData]);

  // 更新粉丝用户数据
  useEffect(() => {
    if (followersData && followersData.success) {
      const responseData = followersData as any;
      if (responseData.dataList) {
        console.log('粉丝列表数据:', responseData.dataList);
        setFollowersUsers(responseData.dataList);
      }
    }
  }, [followersData]);

  const handleBack = () => {
    router.back();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // 更新URL参数
    router.push(`/followed?tab=${tab}`, { scroll: false });
    
    // 切换tab时重新调用相应的API
    if (userParams && userParams.userId && userParams.token) {
      if (tab === 'following') {
        executeFollowed();
      } else if (tab === 'follower') {
        executeFollowers();
      }
    }
  };

  // 当URL参数变化时更新activeTab
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'following';
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);


  const currentUsers = activeTab === 'following' ? followedUsers : followersUsers;
  console.log('currentUsers:', currentUsers);
  const currentLoading = activeTab === 'following' ? followedLoading : followersLoading;
  const currentError = activeTab === 'following' ? followedError : followersError;

  return (
    <AuthGuard>
      <main className="flex min-h-dvh flex-col bg-white">
        {/* Header */}
        <Header
          showSearch
          showUser
        />


      {/* Tabs for Following/Follower */}
      <div className="flex items-center justify-between px-4 py-4 z-100">
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange('following')}
            className={`text-lg font-semibold font-nunito px-6 rounded-full ${activeTab === 'following' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' : 'text-gray-500'}`}
          >
            {t('followedPage.following')}
          </button>
          <button
            onClick={() => handleTabChange('follower')}
            className={`text-lg font-semibold font-nunito px-4 rounded-full ${activeTab === 'follower' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' : 'text-gray-500'}`}
          >
            {t('followedPage.follower')}
          </button>
        </div>
        <button onClick={handleBack} className="text-[#0F1728] hover:text-[#0F1728] font-nunito">
          <ChevronLeft className="h-7 w-7 z-10" />
        </button>
      </div>

      {/* Loading State */}
      {currentLoading && (
        <div className={classNames(
          'flex items-center justify-center',
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
          )}>{t('followedPage.loading')}</span>
        </div>
      )}

      {/* Error State */}
      {currentError && (
        <div className={classNames(
          'flex items-center justify-center',
          UI_CONSTANTS.SPACING.PY_8
        )}>
          <Earth className={classNames(
            UI_CONSTANTS.SIZES.ICON_MD,
            UI_CONSTANTS.COLORS.RED_500
          )} />
          <span className={classNames(
            'ml-2 text-[#11295b]',
            UI_CONSTANTS.COLORS.RED_500,
            UI_CONSTANTS.FONTS.NUNITO
          )}>{t('followedPage.error')}</span>
        </div>
      )}

      {/* Empty State */}
      {!currentLoading && !currentError && currentUsers.length === 0 && (
        <div className={classNames(
          'flex flex-col items-center justify-center text-[#11295b]',
          UI_CONSTANTS.SPACING.PY_12
        )}>
          <div className={classNames(
            'w-16 h-16',
            UI_CONSTANTS.COLORS.GRAY_100,
            UI_CONSTANTS.BORDER_RADIUS.ROUNDED_FULL,
            'flex items-center justify-center',
            UI_CONSTANTS.SPACING.MB_4
          )}>
            <Earth className={classNames(
              UI_CONSTANTS.SIZES.ICON_XL,
              UI_CONSTANTS.COLORS.GRAY_400
            )} />
          </div>
          <h3 className={classNames(
            'text-lg',
            UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD,
            UI_CONSTANTS.COLORS.PRIMARY,
            UI_CONSTANTS.FONTS.NUNITO,
            UI_CONSTANTS.SPACING.MB_2
          )}>
            {activeTab === 'following' ? t('followedPage.noFollowing') : t('followedPage.noFollowers')}
          </h3>
          <p className={classNames(
            UI_CONSTANTS.COLORS.PRIMARY_OPACITY_60,
            UI_CONSTANTS.FONTS.INTER,
            'text-center text-[#11295b] px-4'
          )}>
            {activeTab === 'following' ? t('followedPage.noFollowingDescription') : t('followedPage.noFollowersDescription')}
          </p>
        </div>
      )}

      {/* User List */}
      {!currentLoading && !currentError && currentUsers.length > 0 && (
        <div className="flex-1 px-4 py-4 space-y-4">
          {currentUsers.map((user) => (
            <Link href={`/personal/${user.userId}`} key={user.userId}>
              <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg">
                <Image
                  src={buildAvatarUrl(user.avatar)}
                  alt={user.nickname}
                  width={48}
                  height={48}
                  className="rounded-full w-10 h-10 object-cover"
                />
                <span className="text-lg text-[#11295b] font-nunito">{user.nickname}</span>
              </div>
              <div style={{ borderBottom: '1px solid #e5e7eb' }}></div>
            </Link>
          ))}
        </div>
      )}

        {/* Footer */}
        <Footer />
      </main>
    </AuthGuard>
  );
}
