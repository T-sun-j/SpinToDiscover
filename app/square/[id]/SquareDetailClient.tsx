"use client";

import { Button } from '../../../components/ui/button';
import { 
	MapPin, 
	Bookmark, 
	Heart, 
	Share2, 
	ArrowLeft, 
	MessageCircle,
	Globe,
	Clock,
	Phone,
	Mail,
	ChevronDown,
	Play,
	Expand,
	UserPlus
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSquareContentDetail, toggleLove, toggleCollect, toggleFollowUser } from '../../../lib/auth';
import { SquareContent } from '../../../lib/api';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/ui/LoadingStates';
import { OptimizedImage } from '../../../components/ui/OptimizedImage';

interface SquareDetailClientProps {
	params: { id: string };
}

export default function SquareDetailClient({ params }: SquareDetailClientProps) {
	const { t } = useLanguage();
	const { authInfo, isAuthenticated } = useAuth();
	const router = useRouter();
	const [showAllImages, setShowAllImages] = useState(false);
	const [comment, setComment] = useState('');
	const [isLiked, setIsLiked] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isFollowed, setIsFollowed] = useState(false);
	const [likes, setLikes] = useState(0);
	const [bookmarks, setBookmarks] = useState(0);
	const [isInteracting, setIsInteracting] = useState(false);
	const [expandedImage, setExpandedImage] = useState<number | null>(null);
	
	// API相关状态
	const [post, setPost] = useState<SquareContent | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');


	// 加载广场详情
	const loadSquareDetail = useCallback(async (postId: string) => {
		if (!authInfo?.userId || !authInfo?.token) {
			setPost(null);
			return;
		}

		setIsLoading(true);
		setError('');
		
		try {
			const response = await getSquareContentDetail({
				userId: authInfo.userId,
				token: authInfo.token,
				postId
			});

			if (response.success && response.data) {
				setPost(response.data);
				// 设置初始互动状态
				setLikes(response.data.likes || 0);
				setBookmarks(response.data.collects || 0);
				// 注意：这里需要根据实际API响应来设置isLiked, isBookmarked, isFollowed状态
				// 如果API返回用户是否已点赞/收藏/关注的状态，可以在这里设置
			} else {
				setError('加载详情失败');
			}
		} catch (error) {
			setError('加载详情时发生错误');
		} finally {
			setIsLoading(false);
		}
	}, [authInfo]);

	// 加载详情数据
	useEffect(() => {
		loadSquareDetail(params.id);
	}, [params.id, loadSquareDetail]);

	// 模拟数据（用于扩展功能）
	const mockData = {
		video: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
		brandWebsite: t('square.brandWebsite'),
		brandLogo: t('square.brandLogo'),
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

	const handleBack = () => {
		router.back();
	};

	const handleSubmitComment = () => {
		if (comment.trim()) {
			// 模拟提交评论
			console.log('New comment:', comment);
			setComment('');
		}
	};

	const handleLike = async () => {
		if (!authInfo?.userId || !authInfo?.token || isInteracting) {
			return;
		}

		setIsInteracting(true);
		try {
			const response = await toggleLove({
				userId: authInfo.userId,
				token: authInfo.token,
				productId: params.id,
				isLove: isLiked ? 0 : 1
			});

			if (response.success) {
				setIsLiked(!isLiked);
				setLikes(prev => isLiked ? prev - 1 : prev + 1);
			} else {
				alert('操作失败，请重试');
			}
		} catch (error) {
			console.error('点赞失败:', error);
			alert('操作失败，请重试');
		} finally {
			setIsInteracting(false);
		}
	};

	const handleBookmark = async () => {
		if (!authInfo?.userId || !authInfo?.token || isInteracting) {
			return;
		}

		setIsInteracting(true);
		try {
			const response = await toggleCollect({
				userId: authInfo.userId,
				token: authInfo.token,
				productId: params.id,
				isCollect: isBookmarked ? 0 : 1
			});

			if (response.success) {
				setIsBookmarked(!isBookmarked);
				setBookmarks(prev => isBookmarked ? prev - 1 : prev + 1);
			} else {
				alert('操作失败，请重试');
			}
		} catch (error) {
			console.error('收藏失败:', error);
			alert('操作失败，请重试');
		} finally {
			setIsInteracting(false);
		}
	};

	const handleShare = () => {
		if (post && navigator.share) {
			navigator.share({
				title: post.title,
				text: post.description,
				url: window.location.href,
			});
		} else {
			// 复制链接到剪贴板
			navigator.clipboard.writeText(window.location.href);
			alert('链接已复制到剪贴板');
		}
	};

	const handleImageClick = (index: number) => {
		setExpandedImage(expandedImage === index ? null : index);
	};

	const handlePublisherClick = () => {
		// 跳转到发布者个人页面
		if (post) {
			router.push(`/user/${post.publisher.id}`);
		}
	};

	const handleFollowAuthor = async () => {
		if (!authInfo?.userId || !authInfo?.token || !post || isInteracting) {
			return;
		}

		setIsInteracting(true);
		try {
			const response = await toggleFollowUser({
				userId: authInfo.userId,
				token: authInfo.token,
				authorId: post.publisher.id,
				isCollect: isFollowed ? 0 : 1
			});

			if (response.success) {
				setIsFollowed(!isFollowed);
			} else {
				alert('操作失败，请重试');
			}
		} catch (error) {
			console.error('关注失败:', error);
			alert('操作失败，请重试');
		} finally {
			setIsInteracting(false);
		}
	};

	// 加载状态
	if (isLoading) {
		return (
			<div className="min-h-screen bg-white">
				<main className="flex min-h-[100vh] flex-col">
					<Header showLanguage showSearch showUser logoLink="/square" />
					<div className="flex-1 flex items-center justify-center">
						<LoadingSpinner size="lg" text="加载中..." />
					</div>
					<Footer />
				</main>
			</div>
		);
	}

	// 错误状态
	if (error && !post) {
		return (
			<div className="min-h-screen bg-white">
				<main className="flex min-h-[100vh] flex-col">
					<Header showLanguage showSearch showUser logoLink="/square" />
					<div className="flex-1 flex items-center justify-center">
						<ErrorState 
							error={error}
							onRetry={() => isAuthenticated && loadSquareDetail(params.id)}
						/>
					</div>
					<Footer />
				</main>
			</div>
		);
	}

	// 空状态
	if (!post && !isLoading && !error) {
		return (
			<div className="min-h-screen bg-white">
				<main className="flex min-h-[100vh] flex-col">
					<Header showLanguage showSearch showUser logoLink="/square" />
					<div className="flex-1 flex items-center justify-center">
						<EmptyState 
							title="内容不存在"
							description={isAuthenticated 
								? "您访问的内容可能已被删除或不存在" 
								: "请先登录以查看内容详情"
							}
						/>
					</div>
					<Footer />
				</main>
			</div>
		);
	}

	// 如果没有post数据，不渲染内容
	if (!post) {
		return null;
	}

	const displayedImages = showAllImages ? post.images : post.images.slice(0, 2);

	return (
		<div className="min-h-screen bg-white">
			<main className=" flex min-h-[100vh] flex-col">
				{/* 使用公共头部组件 */}
				<Header
					showLanguage
					showSearch
					showUser
					logoLink="/square"
				/>

				{/* 标题和返回按钮 */}
				<div className="flex items-center justify-between px-6 py-4 border-b">
					<h1 className="text-lg font-nunito text-[#101729]">{post.title}</h1>
					<button 
						onClick={handleBack}
						className="text-[#101729] hover:text-[#101729]"
					>
						<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
				</div>

				{/* 主要内容 */}
				<div className="flex-1 px-6 py-4 space-y-5">
					{/* 发布者信息 */}
					<div className="flex items-center gap-3">
						<button 
							onClick={handlePublisherClick}
							className="flex items-center gap-3 hover:opacity-80 transition-opacity"
						>
							<img
								src={post.publisher.avatar}
								alt={post.publisher.nickname}
								className="w-8 h-8 rounded-full object-cover bg-gray-300"
							/>
							<span className="font-medium text-gray-900 font-nunito">{post.publisher.nickname}</span>
						</button>
						
						{/* 关注按钮 */}
						{isAuthenticated && (
							<button
								onClick={handleFollowAuthor}
								disabled={isInteracting}
								className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
									isFollowed 
										? 'bg-green-100 text-green-600 hover:bg-green-200' 
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
								} ${isInteracting ? 'opacity-50 cursor-not-allowed' : ''}`}
							>
								<UserPlus className={`h-3 w-3 ${isFollowed ? 'fill-current' : ''}`} />
								<span>{isFollowed ? '已关注' : '关注'}</span>
							</button>
						)}
						
						<div className="flex items-center gap-1 ml-auto">
							<MapPin className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-600 font-nunito">{post.location}</span>
						</div>
					</div>

					{/* 描述文本 */}
					<p className="text-gray-700 leading-relaxed text-sm font-inter">{post.description}</p>

					{/* 视频区域 */}
					<div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
						<OptimizedImage
							src={mockData.video}
							alt="Video thumbnail"
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
							<button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
								<Play className="w-6 h-6 text-gray-800 ml-1" />
							</button>
						</div>
					</div>

					{/* 图片展示区域 */}
					<div className="space-y-4">
						{displayedImages.map((image, index) => (
							<div key={index} className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer" onClick={() => handleImageClick(index)}>
								<OptimizedImage
									src={image}
									alt={`Gallery image ${index + 1}`}
									className="w-full h-full object-cover transition-transform group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
									<Expand className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
							</div>
						))}
						
						{/* 展开/收起按钮 */}
						{post.images.length > 2 && (
							<div className="flex justify-center">
								<button
									onClick={() => setShowAllImages(!showAllImages)}
									className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
								>
									<ChevronDown className={`h-5 w-5 transition-transform ${showAllImages ? 'rotate-180' : ''}`} />
									<span className="text-sm font-inter">
										{showAllImages ? t('square.collapse') : t('square.showAll')}
									</span>
								</button>
							</div>
						)}
					</div>

					{/* 品牌信息 */}
					<div className="space-y-4">
						{/* 品牌网站 */}
						<div className="flex items-center gap-3">
							<Globe className="h-6 w-6 text-gray-500" />
							<a href={`https://${mockData.brandWebsite}`} className="text-[#101729] hover:underline">
								{mockData.brandWebsite}
							</a>
						</div>

						{/* 营业时间 */}
						<div className="flex items-start gap-3">
							<Clock className="h-6 w-6 text-gray-500" />
							<div className="flex-1">
								<p className="text-sm text-gray-700 font-nunito leading-relaxed">{post.operatingHours}</p>
								<div className="flex items-center gap-2 mt-3">
									{/* 品牌Logo - 使用实际的Logo图片 */}
									<div className="flex items-center gap-2">
										<OptimizedImage 
											src="/img/band.png" 
											alt="Brand Logo" 
											className="h-8 w-auto"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* 客服热线 */}
						<div className="flex items-center gap-3 ml-8">
							<Phone className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-700 font-inter">{post.customerService}</span>
						</div>

						{/* 工作时间 */}
						<div className="flex items-center gap-3 ml-8">
							<Clock className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-700 font-inter">{post.workingHours}</span>
						</div>

						{/* 邮箱 */}
						<div className="flex items-center gap-3 ml-8">
							<Mail className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-700 font-inter">{mockData.email}</span>
						</div>
					</div>

					{/* 互动按钮 */}
					<div className="flex items-center justify-center gap-6 py-4 border-t border-b">
						<button 
							onClick={handleBookmark}
							disabled={isInteracting || !isAuthenticated}
							className={`flex items-center gap-2 transition-colors ${
								isBookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
							} ${(isInteracting || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
							title={!isAuthenticated ? '请先登录' : ''}
						>
							<Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} />
							<span className="text-sm font-nunito">{bookmarks.toLocaleString()}</span>
						</button>
						<button 
							onClick={handleLike}
							disabled={isInteracting || !isAuthenticated}
							className={`flex items-center gap-2 transition-colors ${
								isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
							} ${(isInteracting || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
							title={!isAuthenticated ? '请先登录' : ''}
						>
							<Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
							<span className="text-sm font-nunito">{likes.toLocaleString()}</span>
						</button>
						<button 
							onClick={handleShare}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
						>
							<Share2 className="h-6 w-6" />
							<span className="text-sm font-nunito">{t('square.share')}</span>
						</button>
					</div>

					{/* 评论区域 */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-nunito text-gray-900">{t('square.comments')}</h3>
							<span className="text-sm text-gray-500 font-nunito">({mockData.comments.length})</span>
						</div>
						
						{/* 评论列表 */}
						<div className="space-y-4">
							{mockData.comments.map((comment) => (
								<div key={comment.id} className="flex gap-3">
									<OptimizedImage
										src={post.images[0]}
										alt="avatar"
										className="w-8 h-8 rounded-full flex-shrink-0"
									/>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-sm text-gray-900 font-inter">{comment.author}</span>
										</div>
										<p className="text-gray-700 mb-2 font-inter">{comment.content}</p>
										<button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
											<MessageCircle className="h-6 w-6" />
											<span className="text-sm font-inter">{t('square.reply')}</span>
											{comment.replies > 0 && (
												<span className="text-sm text-gray-400 font-inter">({comment.replies})</span>
											)}
										</button>
									</div>
								</div>
							))}
						</div>

						{/* 评论输入框 */}
						<div className="flex gap-3 pt-4 border-t">
							<OptimizedImage
								src={post.images[0]}
								alt="avatar"
								className="w-8 h-8 object-cover rounded-full flex-shrink-0"
							/>
							<div className="flex-1 flex gap-2">
								<input
									type="text"
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									placeholder={t('square.inputComments')}
									style={{
										flex: 1,
										padding: '0.5rem 0.75rem',
										border: '1px solid #d1d5db',
										borderRadius: '0.5rem',
										outline: 'none',
										boxSizing: 'border-box'
									}}
									onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px #3b82f6'}
									onBlur={e => e.currentTarget.style.boxShadow = 'none'}
								/>
								<button
									onClick={handleSubmitComment}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
									</svg>
									{t('square.send')}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>
		</div>
	);
}
