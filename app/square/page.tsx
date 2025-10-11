"use client";

import { Button } from '../../components/ui/button';
import { Search, MapPin, Bookmark, Heart, Share2, Filter, FileX } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSquareContentList } from '../../lib/auth';
import { SquareContent, Publisher, Pagination } from '../../lib/api';
import { LoadingSpinner, ErrorState } from '../../components/ui/LoadingStates';
import { OptimizedImage } from '../../components/ui/OptimizedImage';
import { getCurrentLocationString, checkGeolocationPermission } from '../../lib/utils/geolocation';

export default function SquarePage() {
	const { t } = useLanguage();
	const { authInfo, isAuthenticated } = useAuth();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('recommend');
	const [posts, setPosts] = useState<SquareContent[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [userLocation, setUserLocation] = useState<string>('');
	const [isGettingLocation, setIsGettingLocation] = useState(false);
	const [pagination, setPagination] = useState<Pagination | null>(null);


	// 获取用户地理位置
	const getUserLocation = useCallback(async () => {
		setIsGettingLocation(true);
		try {
			// 检查地理位置权限
			const permission = await checkGeolocationPermission();
			
			if (permission === 'denied') {
				console.warn('用户拒绝了地理位置权限');
				setUserLocation('中国，北京'); // 使用默认位置
				return '中国，北京';
			}

			// 获取当前位置
			const location = await getCurrentLocationString();
			setUserLocation(location);
			return location;
		} catch (error) {
			console.warn('获取地理位置失败:', error);
			setUserLocation('中国，北京'); // 使用默认位置
			return '中国，北京';
		} finally {
			setIsGettingLocation(false);
		}
	}, []);

	// 加载广场内容
	const loadSquareContent = useCallback(async (location?: string) => {
		if (!authInfo?.userId || !authInfo?.token) {
			setPosts([]);
			setPagination(null);
			return;
		}

		setIsLoading(true);
		setError('');
		
		try {
			// 如果没有提供位置，使用当前用户位置或默认位置
			const currentLocation = location || userLocation || '中国，北京';
			
			const response = await getSquareContentList({
				userId: authInfo.userId,
				token: authInfo.token,
				location: currentLocation,
				tab: activeTab,
				page: 1,
				limit: 20
			});

			if (response.success && response.data) {
				setPosts(response.data.posts || []);
				setPagination(response.data.pagination || null);
			} else {
				setError('加载内容失败');
			}
		} catch (error) {
			setError('加载内容时发生错误');
		} finally {
			setIsLoading(false);
		}
	}, [authInfo, userLocation, activeTab]);

	// 初始化页面：获取地理位置并加载内容
	useEffect(() => {
		const initializePage = async () => {
			// 首先获取用户地理位置
			const location = await getUserLocation();
			
			// 加载内容（如果已认证）
			loadSquareContent(location);
		};

		initializePage();
	}, [loadSquareContent, getUserLocation]);

	const handlePostClick = (postId: string) => {
		// 如果有认证信息，传递到详情页面
		if (authInfo?.userId && authInfo?.token) {
			router.push(`/square/${postId}?userId=${authInfo.userId}&token=${authInfo.token}`);
		} else {
			router.push(`/square/${postId}`);
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

				{/* 排序标签 */}
				<div className="flex items-center justify-between px-4 pt-2 border-b">
					<div className="flex space-x-3">
						<button
							onClick={() => setActiveTab('Recommend')}
							className={`text-sm font-medium px-4 py-2 rounded-full transition-all font-poppins ${
								activeTab === 'Recommend' 
									? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{t('square.recommend')}
						</button>
						<button
							onClick={() => setActiveTab('Following')}
							className={`text-sm font-medium px-4 py-2 rounded-full transition-all font-poppins ${
								activeTab === 'Following' 
									? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{t('square.following')}
						</button>
						<button
							onClick={() => setActiveTab('Nearby')}
							className={`text-sm font-medium px-4 py-2 rounded-full transition-all font-poppins ${
								activeTab === 'Nearby' 
									? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{t('square.nearby')}
						</button>
					</div>
					<Button variant="ghost" size="sm">
						<Filter className="h-4 w-4" />
					</Button>
				</div>

				{/* 加载状态 */}
				{(isLoading || isGettingLocation) && (
					<div className="flex-1 flex items-center justify-center">
						<LoadingSpinner 
							size="lg" 
							text={isGettingLocation ? "正在获取位置信息..." : "加载中..."} 
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
						<h3 className="text-lg font-medium text-gray-900 mb-2">暂无内容</h3>
						<p className="text-sm text-gray-500 text-center max-w-sm">
							{isAuthenticated 
								? '当前位置暂无发现内容，换个地方试试吧！' 
								: '请先登录以查看个性化内容推荐'
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
												src={image}
												alt={`Post ${post.id} image ${imageIndex + 1}`}
												className="w-34 h-24 object-cover rounded flex-shrink-0"
											/>
										))}
									</div>

									{/* 标题 */}
									<h3 className=" text-gray-900 mb-2 text-sm font-nunito">{post.title}</h3>

									{/* 描述 */}
									<p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed font-inter">{post.description}</p>

									{/* 发布者信息和互动按钮 */}
									<div className="flex items-center justify-between">
										{/* 发布者信息 */}
										<div className="flex items-center gap-2">
											<img
												src={post.publisher.avatar}
												alt={post.publisher.nickname}
												className="w-8 h-8 object-cover rounded-full"
											/>
											<span className="text-sm text-gray-600 font-nunito">{post.publisher.nickname}</span>
										</div>

										{/* 互动按钮 */}
										<div className="flex items-center gap-3">
											<button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700">
												<Bookmark className="h-4 w-4" />
												<span className="text-xs font-nunito">{post.collects}</span>
											</button>
											<button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-red-500">
												<Heart className="h-4 w-4" />
												<span className="text-xs font-nunito">{post.likes}</span>
											</button>
											<button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700">
												<Share2 className="h-4 w-4" />
												<span className="text-xs font-nunito">{post.shares}</span>
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
								第 {pagination.currentPage} 页，共 {pagination.totalPages} 页，总计 {pagination.totalItems} 条内容
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
