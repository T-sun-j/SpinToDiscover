"use client";

import { Button } from '../../components/ui/button';
import { Search, MapPin, Bookmark, Heart, SquareArrowOutUpRight, Filter, FileX, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSquareContentList, toggleLove, toggleCollect, shareContent } from '../../lib/auth';
import { SquareContent, Publisher, Pagination, SERVER_CONFIG } from '../../lib/api';
import { LoadingSpinner, ErrorState } from '../../components/ui/LoadingStates';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { getCurrentLocationString, checkGeolocationPermission } from '../../lib/utils/geolocation';
import Image from 'next/image';

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
	const [postInteractions, setPostInteractions] = useState<{
		[key: string]: {
			isLove: boolean;
			isCollect: boolean;
			likes: number;
			bookmarks: number;
			isInteracting: boolean;
		}
	}>({});

	// 视频播放状态
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

	// 图片预览状态
	const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);


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

			// 推荐页面：如果已登录则传递 userId 和 token，未登录则不传递
			// 其他页面：始终传递 userId 和 token（如果有的话）
			const shouldPassToken = currentTab === 'recommend' ? (authInfo?.userId && authInfo?.token) : true;
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
				const newInteractions: { [key: string]: any } = {};
				newPosts.forEach((post: SquareContent) => {
					// 直接使用 API 返回的字段 isLove 和 isCollect
					newInteractions[post.id] = {
						isLove: post.isLove === true || post.isLove === 1 || false,
						isCollect: post.isCollect === true || post.isCollect === 1 || false,
						likes: post.likes || 0,
						bookmarks: post.collects || 0,
						isInteracting: false
					};
				});
				setPostInteractions(newInteractions);
			} else {
				setError(t('square.loadDetailFailed') as string);
			}
		} catch (error) {
			setError(t('square.loadDetailError') as string);
		} finally {
			setIsLoading(false);
		}
	}, [authInfo, userLocation, filterLocation, activeTab, router, t]);

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

	// 视频播放功能
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

	// 分享功能
	const handleShare = async (post: SquareContent, event: React.MouseEvent) => {
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
				setPosts(prevPosts =>
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
				alert(t('square.linkCopied'));
			}
		} catch (error) {
			// 用户取消分享时不显示错误
			if ((error as Error).name !== 'AbortError') {
				console.error('分享失败:', error);
			}
		}
	};

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
			<main className=" flex min-h-[100vh] flex-col">
				{/* 使用公共头部组件 */}
				<Header
					showSearch
					showUser
					userLink="/personal-center"
				/>

				{/* 导航区域 - 一行显示 */}
				<div className="flex items-center justify-between px-2 pt-3 pb-2  z-100">
					{/* 左侧：三个tab */}
					<div className="flex space-x-2">
						<button
							onClick={() => {
								const newTab = 'recommend';
								setActiveTab(newTab);
								// 推荐页面使用筛选地址
								loadSquareContent('', newTab);
							}}
							className={`text-sm  px-3 py-1 rounded-full transition-all font-poppins ${activeTab === 'recommend'
								? 'w-36 h-7 bg-gradient-to-r from-[#FD9507] to-[#CE14B0] text-white shadow-sm font-semibold'
								: 'font-semibold text-[#0F1728] hover:text-gray-800'
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
								loadSquareContent('', newTab);
							}}
							className={`text-sm  px-3 py-1 rounded-full transition-all font-poppins ${activeTab === 'following'
								? 'w-36 h-7 bg-gradient-to-r from-[#FD9507] to-[#CE14B0] text-white shadow-sm font-semibold'
								: 'font-semibold text-[#0F1728] hover:text-gray-800'
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
							className={`text-sm font-medium px-3 py-1 rounded-full transition-all font-poppins ${activeTab === 'nearby'
								? 'w-36 h-7 bg-gradient-to-r from-[#FD9507] to-[#CE14B0] text-white shadow-sm font-semibold'
								: 'font-semibold text-[#0F1728] hover:text-gray-800'
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
							onClick={() => router.push(`/region-select?from=square&filterLocation=${filterLocation}`)}
							className="text-gray-600 hover:text-gray-800 py-1"
						>
							<Image src="/img/Filter.png" alt="Filter" width={16} height={16} className='w-6 h-6' />
						</Button>

						{/* 显示当前选择的地区 - 只显示三个字加省略号 */}
						{/* {((activeTab === 'nearby' && userLocation) || (activeTab !== 'nearby' && filterLocation)) && (
							<div className="flex items-center text-xs text-gray-600 bg-gray-100 py-1 rounded-full max-w-20">
								<MapPin className="h-3 w-3 flex-shrink-0" />
								<span className="font-nunito truncate">
									{activeTab === 'nearby' ? userLocation : filterLocation}
								</span>
								<button
									onClick={clearLocationFilter}
									className="hover:bg-gray-200 rounded-full p-0.5 transition-colors flex-shrink-0"
									title={t('square.clearFilter') as string}
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						)} */}
					</div>
				</div>

				{/* 加载状态 */}
				{(isLoading || isGettingLocation) && (
					<div className="flex-1 flex items-center justify-center">
						<LoadingSpinner
							size="lg"
							text={isGettingLocation ? t('square.gettingLocation') as string : t('square.loading') as string}
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
					<div className="flex-1 ">
						<div className="space-y-0">
							{posts.map((post, index) => (
								<div key={post.id}>
									<div
										className="bg-white px-4 pt-2 cursor-pointer hover:shadow-sm transition-shadow"
										onClick={() => handlePostClick(post.id)}
									>
										<div className="flex items-center gap-2 mb-4" >
											{/* 发布者信息 */}
											<div className="flex items-center gap-2">
												<img
													src={`${SERVER_CONFIG.STATIC_URL}${post.publisher.avatar}`}
													alt={post.publisher.nickname}
													className="w-9 h-9 object-cover rounded-full"
												/>
												<span className="text-sm text-[#0F1728] leading-9 font-nunito">{post.publisher.nickname}</span>
											</div>
										</div>



										{/* 标题 */}
										<h3 className=" text-[#12295B] text-lg italic font-nunito font-semibold mb-1">{post.title}</h3>

										{/* 描述三行省略 + Read More 效果 */}
										<div className="relative">
											<p
												className="text-base text-[#20313B] font-inter line-clamp-3 break-words"
											>
												{post.description}
											</p>
											{/* 如果描述长度超过一定字符数，显示 Read More */}
											{post.description && post.description.length > 80 && (
												<div className="mt-1 flex justify-end">
													<span
														className="text-xs text-[#12295B] bg-white pl-2 cursor-pointer select-none font-inter"
													>
														{t('square.readMore')}
													</span>
												</div>
											)}
										</div>
										{/* 图片列表 */}
										<div className="flex gap-2 overflow-x-auto my-2">
											{/* 如果有视频，显示视频第一帧 */}
											{post.video && (
												<div
													className="relative w-34 h-48 rounded flex-shrink-0 bg-gray-200 overflow-hidden cursor-pointer"
													onClick={(e) => {
														e.stopPropagation(); // 阻止事件冒泡，避免触发父元素的点击事件
														handleVideoPlay(`${SERVER_CONFIG.STATIC_URL}${post.video}`);
													}}
												>
													<video
														src={`${SERVER_CONFIG.STATIC_URL}${post.video}`}
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
											{post.images.map((image, imageIndex) => {
												const imageUrl = `${SERVER_CONFIG.STATIC_URL}${image}`;
												const allImages = post.images.map(img => `${SERVER_CONFIG.STATIC_URL}${img}`);
												return (
													<div
														key={imageIndex}
														className="relative w-36 h-48 rounded flex-shrink-0 bg-gray-100 overflow-hidden cursor-pointer"
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
													<span className="text-xs text-gray-500">
														{post.updatedAt}
													</span>
												)}
												{post.location && (<div className="flex items-center gap-2 mt-2">
													<MapPin className="h-4 w-4 text-[#0F1728] font-semibold" />
													<span className="text-sm text-gray-500">{post.location}</span>
												</div>)}

											</div>

											{/* 互动按钮 */}
											<div className="flex items-center gap-3 mt-2">

												<button
													onClick={(e) => handleBookmark(post.id, e)}
													disabled={!isAuthenticated || postInteractions[post.id]?.isInteracting}
													className={`flex flex-col items-center gap-0.5 transition-colors ${postInteractions[post.id]?.isCollect
														? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent'
														: 'text-[#0F1728] hover:text-gray-700'
														} ${(!isAuthenticated || postInteractions[post.id]?.isInteracting) ? 'opacity-50 cursor-not-allowed' : ''}`}
													title={!isAuthenticated ? (t('square.pleaseLoginFirst') as string) : ''}
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
													disabled={!isAuthenticated || postInteractions[post.id]?.isInteracting}
													className={`flex flex-col items-center gap-0.5 transition-colors ${postInteractions[post.id]?.isLove
														? 'bg-gradient-to-r from-[#FD9507] to-[#CE14B0] bg-clip-text text-transparent'
														: 'text-[#0F1728] hover:text-red-500'
														} ${(!isAuthenticated || postInteractions[post.id]?.isInteracting) ? 'opacity-50 cursor-not-allowed' : ''}`}
													title={!isAuthenticated ? (t('square.pleaseLoginFirst') as string) : ''}
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
													className="flex flex-col items-center gap-0.5 text-[#0F1728] hover:text-gray-700 transition-colors"
												>
													<SquareArrowOutUpRight className="h-6 w-6 font-semibold" />
													<span className="text-xs font-nunito">{post.shares || t('square.share')}</span>
												</button>
											</div>
										</div>
									</div>
									{/* 分隔线 */}
									{index < posts.length - 1 && (
										<div
											className="mx-4 my-6"
											style={{ borderBottom: '1px solid #e5e7eb' }}
										></div>
									)}
								</div>
							))}
						</div>

						{/* 分页信息 */}
						{pagination && (
							<div className="px-4 py-3 text-center text-xs text-gray-500">
								{(t('square.pagination') as string)
									.replace('{items}', pagination.totalItems.toString() as string)
								}
							</div>
						)}
					</div>
				)}

				{/* 使用公共页脚组件 */}
				<Footer />

				{/* 全屏视频播放弹窗 */}
				{isVideoPlaying && playingVideoUrl && (
					<div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center z-200">
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
						className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center z-200"
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
								className="max-w-full max-h-full flex items-center justify-center"
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
