"use client";

import { Button } from '../../components/ui/button';
import { Search, MapPin, Bookmark, Heart, Share2, Filter, FileX, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSquareContentList, toggleLove, toggleCollect } from '../../lib/auth';
import { SquareContent, Publisher, Pagination, SERVER_CONFIG } from '../../lib/api';
import { LoadingSpinner, ErrorState } from '../../components/ui/LoadingStates';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { getCurrentLocationString, checkGeolocationPermission } from '../../lib/utils/geolocation';

export default function SquarePage() {
	const { t } = useLanguage();
	const { authInfo, isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState('recommend');
	const [posts, setPosts] = useState<SquareContent[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [userLocation, setUserLocation] = useState<string>('');
	const [filterLocation, setFilterLocation] = useState<string>(''); // 筛选的地址
	const [isGettingLocation, setIsGettingLocation] = useState(false);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	
	// 互动状态管理
	const [postInteractions, setPostInteractions] = useState<{[key: string]: {
		isLiked: boolean;
		isBookmarked: boolean;
		likes: number;
		bookmarks: number;
		isInteracting: boolean;
	}}>({});


	// 获取用户地理位置
	const getUserLocation = useCallback(async () => {
		setIsGettingLocation(true);
		try {
			// 检查地理位置权限
			const permission = await checkGeolocationPermission();
			
			if (permission === 'denied') {
				console.warn('用户拒绝了地理位置权限');
				setUserLocation(''); // 使用默认位置
				return '';
			}

			// 获取当前位置
			const location = await getCurrentLocationString();
			setUserLocation(location);
			return location;
		} catch (error) {
			console.warn('获取地理位置失败:', error);
			setUserLocation(''); // 使用默认位置
			return '';
		} finally {
			setIsGettingLocation(false);
		}
	}, []);

	// 加载广场内容
	const loadSquareContent = useCallback(async (location?: string, tab?: string) => {

		setIsLoading(true);
		setError('');
		
		try {
			// 使用传入的tab参数，如果没有则使用当前的activeTab
			const currentTab = tab || activeTab;
			
			// 优先使用传入的location参数，如果没有则根据tab类型决定使用哪个位置
			let currentLocation = '';
			if (location) {
				// 如果传入了location参数，直接使用
				currentLocation = location;
			} else {
				// 如果没有传入location参数，根据tab类型决定使用哪个位置
				if (currentTab === 'nearby') {
					// 附近页面使用定位地址
					currentLocation = userLocation || '';
				} else {
					// 推荐和关注页面使用筛选地址
					currentLocation = filterLocation || '';
				}
			}
			
			// 推荐页面不需要传递 token，其他页面需要
			const shouldPassToken = currentTab !== 'recommend';
			
			const response = await getSquareContentList({
				userId: shouldPassToken ? (authInfo?.userId || '') : '',
				token: shouldPassToken ? (authInfo?.token || '') : '',
				location: currentLocation, // 所有tab都使用location参数
				tab: currentTab,
				page: 1,
				limit: 999
			});

			if (response.success && response.data) {
				const newPosts = response.data.posts || [];
				setPosts(newPosts);
				setPagination(response.data.pagination || null);
				
				// 初始化互动状态
				const newInteractions: {[key: string]: any} = {};
				newPosts.forEach((post: SquareContent) => {
					newInteractions[post.id] = {
						isLiked: false, 
						isBookmarked: false, 
						likes: post.likes || 0, 
						bookmarks: post.collects || 0, 
						isInteracting: false
					};
				});
				setPostInteractions(newInteractions);
			} else {
				setError('加载内容失败');
			}
		} catch (error) {
			setError('加载内容时发生错误');
		} finally {
			setIsLoading(false);
		}
	}, [authInfo, userLocation, filterLocation, activeTab, router]);

	// 初始化页面：根据URL参数设置tab和location
	useEffect(() => {
		// 从URL参数获取tab和location
		const tab = searchParams.get('tab');
		const location = searchParams.get('location');
		
		if (tab) {
			setActiveTab(tab);
		}
		
		if (location) {
			// 根据当前tab设置对应的位置
			if (tab === 'nearby') {
				setUserLocation(location);
			} else {
				setFilterLocation(location);
			}
			// 如果有location参数，使用该location加载内容
			loadSquareContent(location);
		} else {
			// 默认加载推荐内容，不需要地理位置
			loadSquareContent();
		}
	}, [searchParams]); // 只依赖searchParams

	const handlePostClick = (postId: string) => {
		// 如果有认证信息，传递到详情页面
		if (authInfo?.userId && authInfo?.token) {
			router.push(`/square/${postId}?userId=${authInfo.userId}&token=${authInfo.token}`);
		} else {
			router.push(`/square/${postId}`);
		}
	};

	// 点赞功能
	const handleLike = async (postId: string, event: React.MouseEvent) => {
		event.stopPropagation(); // 阻止事件冒泡，避免触发帖子点击
		
		if (!authInfo?.userId || !authInfo?.token || !isAuthenticated) {
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
				isLove: currentInteraction?.isLiked ? 0 : 1
			});

			if (response.success) {
				setPostInteractions(prev => ({
					...prev,
					[postId]: {
						...prev[postId],
						isLiked: !prev[postId]?.isLiked,
						likes: (prev[postId]?.likes || 0) + (prev[postId]?.isLiked ? -1 : 1),
						isInteracting: false
					}
				}));
			} else {
				alert(t('square.operationFailed'));
			}
		} catch (error) {
			console.error('点赞失败:', error);
			alert(t('square.operationFailed'));
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
		
		if (!authInfo?.userId || !authInfo?.token || !isAuthenticated) {
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
				isCollect: currentInteraction?.isBookmarked ? 0 : 1
			});

			if (response.success) {
				setPostInteractions(prev => ({
					...prev,
					[postId]: {
						...prev[postId],
						isBookmarked: !prev[postId]?.isBookmarked,
						bookmarks: (prev[postId]?.bookmarks || 0) + (prev[postId]?.isBookmarked ? -1 : 1),
						isInteracting: false
					}
				}));
			} else {
				alert(t('square.operationFailed'));
			}
		} catch (error) {
			console.error('收藏失败:', error);
			alert(t('square.operationFailed'));
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

	// 清除筛选条件
	const clearLocationFilter = () => {
		if (activeTab === 'nearby') {
			setUserLocation('');
		} else {
			setFilterLocation('');
		}
		// 清除URL参数并重新加载内容
		router.push('/square');
		// 重新加载内容，不传递location参数
		loadSquareContent('');
	};

	// 分享功能
	const handleShare = async (post: SquareContent, event: React.MouseEvent) => {
		event.stopPropagation(); // 阻止事件冒泡，避免触发帖子点击
		
		try {
			if (navigator.share) {
				await navigator.share({
					title: post.title || 'Untitled',
					text: post.description || '',
					url: `${window.location.origin}/square/${post.id}`,
				});
				// 分享成功后更新分享数量
				setPosts(prevPosts => 
					prevPosts.map(p => 
						p.id === post.id 
							? { ...p, shares: (p.shares || 0) + 1 }
							: p
					)
				);
			} else {
				// 复制链接到剪贴板
				await navigator.clipboard.writeText(`${window.location.origin}/square/${post.id}`);
				alert(t('square.linkCopied'));
				// 复制成功后也更新分享数量
				setPosts(prevPosts => 
					prevPosts.map(p => 
						p.id === post.id 
							? { ...p, shares: (p.shares || 0) + 1 }
							: p
					)
				);
			}
		} catch (error) {
			console.error('分享失败:', error);
		}
	};

	return (
		<div className="min-h-screen bg-white">
			<main className=" flex min-h-[100vh] flex-col">
				{/* 使用公共头部组件 */}
				<Header
					showLanguage
					showSearch
					showUser
					userLink="/personal-center"
				/>

				{/* 导航区域 - 一行显示 */}
				<div className="flex items-center justify-between px-2 pt-3 pb-2 border-b">
					{/* 左侧：三个tab */}
					<div className="flex space-x-2">
						<button
							onClick={() => {
								const newTab = 'recommend';
								setActiveTab(newTab);
								// 推荐页面使用筛选地址
								loadSquareContent(filterLocation, newTab);
							}}
							className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all font-poppins ${
								activeTab === 'recommend' 
									? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{t('square.recommend')}
						</button>
						<button
							onClick={() => {
								// 检查登录状态
								if (!authInfo?.userId || !authInfo?.token) {
									router.push('/login');
									return;
								}
								const newTab = 'following';
								setActiveTab(newTab);
								// 关注页面使用筛选地址
								loadSquareContent(filterLocation, newTab);
							}}
							className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all font-poppins ${
								activeTab === 'following' 
									? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{t('square.following')}
						</button>
						<button
							onClick={async () => {
								// 检查登录状态
								if (!authInfo?.userId || !authInfo?.token) {
									router.push('/login');
									return;
								}
								const newTab = 'nearby';
								setActiveTab(newTab);
								
								// 切换到Nearby tab时获取地理位置
								const location = await getUserLocation();
								// 使用获取到的地理位置加载内容
								loadSquareContent(location, newTab);
							}}
							className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all font-poppins ${
								activeTab === 'nearby' 
									? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{t('square.nearby')}
						</button>
					</div>

					{/* 右侧：筛选按钮和地址 */}
					<div className="flex items-center">
						<Button 
							variant="ghost" 
							size="sm"
							onClick={() => router.push(`/region-select?from=square&tab=${activeTab}`)}
							className="text-gray-600 hover:text-gray-800 px-2 py-1"
						>
							<Filter className="h-4 w-4" />
						</Button>
						
						{/* 显示当前选择的地区 - 只显示三个字加省略号 */}
						{((activeTab === 'nearby' && userLocation) || (activeTab !== 'nearby' && filterLocation)) && (
							<div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-1 py-1 rounded-full max-w-20">
								<MapPin className="h-3 w-3 flex-shrink-0" />
								<span className="font-nunito truncate">
									{activeTab === 'nearby' ? userLocation : filterLocation}
								</span>
								<button
									onClick={clearLocationFilter}
									className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors flex-shrink-0"
									title={t('square.clearFilter')}
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						)}
					</div>
				</div>

				{/* 加载状态 */}
				{(isLoading || isGettingLocation) && (
					<div className="flex-1 flex items-center justify-center">
						<LoadingSpinner 
							size="lg" 
							text={isGettingLocation ? t('square.gettingLocation') : t('square.loading')} 
						/>
					</div>
				)}

				{/* 错误信息 */}
				{error && !isLoading && !isGettingLocation && (
					<div className="flex-1 flex items-center justify-center">
						<ErrorState 
							error={error}
							onRetry={() => isAuthenticated && loadSquareContent(userLocation)}
						/>
					</div>
				)}

				{/* 无数据状态 */}
				{!isLoading && !error && !isGettingLocation && posts.length === 0 && (
					<div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
						<FileX className="h-16 w-16 text-gray-300 mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">{t('square.noContent')}</h3>
						<p className="text-sm text-gray-500 text-center max-w-sm">
							{activeTab === 'recommend' 
								? t('square.noRecommendContent')
								: isAuthenticated 
									? t('square.noNearbyContent')
									: t('square.loginRequired')
							}
						</p>
					</div>
				)}

				{/* 瀑布流内容 */}
				{!isLoading && !error && !isGettingLocation && posts.length > 0 && (
					<div className="flex-1 px-2 py-2">
						<div className="space-y-0">
							{posts.map((post, index) => (
							<div key={post.id}>
								<div 
									className="bg-white p-4 cursor-pointer hover:shadow-sm transition-shadow"
									onClick={() => handlePostClick(post.id)}
								>
									{/* 位置信息 */}
									<div className="flex items-center gap-2 mb-3">
										<MapPin className="h-3 w-3 text-gray-500" />
										<span className="text-xs text-gray-600">{post.location}</span>
									</div>

									{/* 图片列表 */}
									<div className="flex gap-2 mb-3 overflow-x-auto">
										{post.images.map((image, imageIndex) => (
											<OptimizedImage
												key={imageIndex}
												src={`${SERVER_CONFIG.STATIC_URL}${image}`}
												alt={`Post ${post.id} image ${imageIndex + 1}`}
												className="w-34 h-24 object-cover rounded flex-shrink-0"
											/>
										))}
									</div>

									{/* 标题 */}
									<h3 className=" text-gray-900 mb-2 text-sm font-nunito font-semibold">{post.title}</h3>

									{/* 描述 */}
									<p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed font-inter">{post.description}</p>

									{/* 发布者信息和互动按钮 */}
									<div className="flex items-center justify-between">
										{/* 发布者信息 */}
										<div className="flex items-center gap-2">
											<img
												src={`${SERVER_CONFIG.STATIC_URL}${post.publisher.avatar}`}
												alt={post.publisher.nickname}
												className="w-8 h-8 object-cover rounded-full"
											/>
											<span className="text-sm text-gray-600 font-nunito">{post.publisher.nickname}</span>
										</div>

									{/* 互动按钮 */}
									<div className="flex items-center gap-3">
										<button 
											onClick={(e) => handleBookmark(post.id, e)}
											disabled={!isAuthenticated || postInteractions[post.id]?.isInteracting}
											className={`flex flex-col items-center gap-0.5 transition-colors ${
												postInteractions[post.id]?.isBookmarked 
													? 'text-blue-600' 
													: 'text-gray-500 hover:text-gray-700'
											} ${(!isAuthenticated || postInteractions[post.id]?.isInteracting) ? 'opacity-50 cursor-not-allowed' : ''}`}
											title={!isAuthenticated ? '请先登录' : ''}
										>
											<Bookmark className={`h-4 w-4 ${postInteractions[post.id]?.isBookmarked ? 'fill-current' : ''}`} />
											<span className="text-xs font-nunito">{postInteractions[post.id]?.bookmarks || post.collects || 0}</span>
										</button>
										<button 
											onClick={(e) => handleLike(post.id, e)}
											disabled={!isAuthenticated || postInteractions[post.id]?.isInteracting}
											className={`flex flex-col items-center gap-0.5 transition-colors ${
												postInteractions[post.id]?.isLiked 
													? 'text-red-500' 
													: 'text-gray-500 hover:text-red-500'
											} ${(!isAuthenticated || postInteractions[post.id]?.isInteracting) ? 'opacity-50 cursor-not-allowed' : ''}`}
											title={!isAuthenticated ? '请先登录' : ''}
										>
											<Heart className={`h-4 w-4 ${postInteractions[post.id]?.isLiked ? 'fill-current' : ''}`} />
											<span className="text-xs font-nunito">{postInteractions[post.id]?.likes || post.likes || 0}</span>
										</button>
										<button 
											onClick={(e) => handleShare(post, e)}
											className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700 transition-colors"
										>
											<Share2 className="h-4 w-4" />
											<span className="text-xs font-nunito">{post.shares || 0}</span>
										</button>
									</div>
									</div>
								</div>
								{/* 分隔线 */}
								{index < posts.length - 1 && (
									<div 
										className="mx-4 my-2" 
										style={{ borderBottom: '1px solid #e5e7eb' }}
									></div>
								)}
							</div>
						))}
						</div>
						
						{/* 分页信息 */}
						{pagination && (
							<div className="px-4 py-3 text-center text-xs text-gray-500">
								{t('square.pagination')
									.replace('{current}', pagination.currentPage.toString())
									.replace('{total}', pagination.totalPages.toString())
									.replace('{items}', pagination.totalItems.toString())
								}
							</div>
						)}
					</div>
				)}

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>
		</div>
	);
}
