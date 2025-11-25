"use client";

import { Button } from '../../../components/ui/button';
import {
	Bookmark,
	Heart,
	SquareArrowOutUpRight,
	ArrowLeft,
	Expand,
	UserPlus,
	MapPin,
	ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSquareContentDetail, toggleLove, toggleCollect, toggleFollowUser, postComment, shareContent } from '../../../lib/auth';
import { SquareContent, SERVER_CONFIG, buildAvatarUrl } from '../../../lib/api';
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
	const [shares, setShares] = useState(0);
	const [isInteracting, setIsInteracting] = useState(false);
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [replyingTo, setReplyingTo] = useState<{ id: string; nickname: string } | null>(null);

	// 图片预览状态
	const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
				// 确保comments数组存在
				if (!Array.isArray(response.data.comments)) {
					response.data.comments = [];
				}
				setPost(response.data);
				// 设置初始互动状态
				setLikes(response.data.interactions?.likes || 0);
				setBookmarks(response.data.interactions?.collects || 0);
				setShares(response.data.interactions?.shares || response.data.shares || 0);
				setIsLiked(response.data.interactions?.userLiked || false);
				setIsBookmarked(response.data.interactions?.userCollected || false);
			} else {
				setError(t('square.loadDetailFailed') as string);
			}
		} catch (error) {
			setError(t('square.loadDetailError') as string);
		} finally {
			setIsLoading(false);
		}
	}, [authInfo]);

	// 加载详情数据
	useEffect(() => {
		loadSquareDetail(params.id);
	}, [params.id, loadSquareDetail]);

	// 管理 body 滚动状态：当图片预览或视频播放时禁用滚动
	useEffect(() => {
		if (isImagePreviewOpen || isVideoPlaying) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		// 组件卸载时恢复滚动
		return () => {
			document.body.style.overflow = '';
		};
	}, [isImagePreviewOpen, isVideoPlaying]);

	const handleBack = () => {
		router.back();
	};

	const handleSubmitComment = async () => {
		if (!comment.trim() || !authInfo?.userId || !authInfo?.token || isSubmittingComment) {
			return;
		}

		setIsSubmittingComment(true);
		try {
			const response = await postComment({
				userId: authInfo.userId,
				token: authInfo.token,
				productId: params.id,
				parentId: replyingTo?.id,
				content: comment.trim(),
			});

			if (response.success) {
				// 评论提交成功，清空输入框和回复状态
				setComment('');
				setReplyingTo(null);
				// 重新加载详情以获取最新评论
				loadSquareDetail(params.id);
			} else {
				alert(t('square.commentSubmitFailed'));
			}
		} catch (error) {
			console.error('评论提交失败:', error);
			alert(t('square.commentSubmitFailed'));
		} finally {
			setIsSubmittingComment(false);
		}
	};

	const handleLike = async () => {
		if (!authInfo?.userId || !authInfo?.token || isInteracting) {
			return;
		}

		setIsInteracting(true);
		try {
			console.log('isLiked', isLiked);
			const response = await toggleLove({
				userId: authInfo.userId,
				token: authInfo.token,
				productId: params.id,
				isLove: isLiked ? 1 : 0
			});

			if (response.success) {
				setIsLiked(!isLiked);
				setLikes(prev => isLiked ? prev - 1 : prev + 1);
			} else {
				alert(t('square.operationFailed'));
			}
		} catch (error) {
			console.error('点赞失败:', error);
			alert(t('square.operationFailed'));
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
				isCollect: isBookmarked ? 1 : 0
			});

			if (response.success) {
				setIsBookmarked(!isBookmarked);
				setBookmarks(prev => isBookmarked ? prev - 1 : prev + 1);
			} else {
				alert(t('square.operationFailed'));
			}
		} catch (error) {
			console.error('收藏失败:', error);
			alert(t('square.operationFailed'));
		} finally {
			setIsInteracting(false);
		}
	};

	const handleShare = async () => {
		// 先调用分享接口增加分享次数
		if (authInfo?.userId && authInfo?.token) {
			try {
				await shareContent({
					userId: authInfo.userId,
					token: authInfo.token,
					productId: params.id,
				});
				// 分享接口调用成功后更新分享数量
				setShares(prev => prev + 1);
			} catch (error) {
				console.error('分享接口调用失败:', error);
				// 即使接口调用失败，也继续执行分享功能
			}
		}

		// 继续原有的分享链接功能
		if (post && navigator.share) {
			try {
				await navigator.share({
					title: post.title || 'Untitled',
					text: post.description || '',
					url: window.location.href,
				});
			} catch (error) {
				// 用户取消分享时不显示错误
				if ((error as Error).name !== 'AbortError') {
					console.error('分享失败:', error);
				}
			}
		} else {
			// 复制链接到剪贴板
			try {
				await navigator.clipboard.writeText(window.location.href);
				alert(t('square.linkCopied'));
			} catch (error) {
				console.error('复制链接失败:', error);
			}
		}
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

	const handleVideoPlay = () => {
		setIsVideoPlaying(true);
	};

	const handleVideoClose = () => {
		setIsVideoPlaying(false);
	};

	const handlePublisherClick = () => {
		// 跳转到发布者个人页面
		if (post && post.publisher?.id) {
			router.push(`/personal/${post.publisher.id}`);
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
				authorId: post.publisher?.id || '',
				isCollect: isFollowed ? 0 : 1
			});

			if (response.success) {
				setIsFollowed(!isFollowed);
			} else {
				alert(t('square.operationFailed'));
			}
		} catch (error) {
			console.error('关注失败:', error);
			alert(t('square.operationFailed'));
		} finally {
			setIsInteracting(false);
		}
	};

	// 加载状态
	if (isLoading) {
		return (
			<div className="min-h-screen bg-white">
				<main className="flex min-h-[100vh] flex-col">
					<Header showSearch showUser logoLink="/square" />
					<div className="flex-1 flex items-center justify-center">
						<LoadingSpinner size="lg" text={t('common.loading') as string} />
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
					<Header showSearch showUser logoLink="/square" />
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
					<Header showSearch showUser logoLink="/square" />
					<div className="flex-1 flex items-center justify-center">
						<EmptyState
							title={''}
							// description={isAuthenticated
							// 	? (t('square.contentDeleted') as string)
							// 	: (t('square.loginRequiredForDetail') as string)
							// }
							action={!isAuthenticated ? (
								<Button
									onClick={() => router.push('/login')}
									className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 text-[17px] font-poppins font-semibold"
								>
									{t('square.loginRequiredForDetail')}
								</Button>
							) : undefined}
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

	// 过滤掉空图片
	const validImages = (post.images || []).filter(img => !!img && img.trim() !== "");
	// 如果没有视频，折叠状态下显示两张图片；否则显示一张
	const imageCountToShow = !post.video && !showAllImages ? 2 : (showAllImages ? validImages.length : 1);
	const displayedImages = showAllImages ? validImages : validImages.slice(0, imageCountToShow);

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
					logoLink="/square"
				/>

				{/* 标题和返回按钮 */}
				<div className="flex items-start justify-between px-4 py-4">
					<h1 className="text-xl font-poppins text-[#12295B] italic font-semibold leading-tight">{post.title || 'Untitled'}</h1>
					<button
						onClick={handleBack}
						className="text-[#0F1728] hover:text-[#0F1728] mt-0"
						style={{ alignSelf: 'flex-start' }}
					>
						<ChevronLeft className="h-7 w-7 z-10" />
					</button>
				</div>

				{/* 主要内容 */}
				<div className="flex-1 px-4 space-y-5">
				{/* 发布者信息 */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button
							onClick={handlePublisherClick}
							className="flex items-center gap-3 hover:opacity-80 transition-opacity"
						>
							<Image
								src={`${SERVER_CONFIG.STATIC_URL}${post.publisher?.avatar || ''}`}
								alt={post.publisher?.nickname || 'User'}
								width={9}
								height={9}
								className="w-9 h-9 rounded-full object-cover bg-gray-300"
							/>
							<span className="font-sm text-[#0F1728] font-nunito">{post.publisher?.nickname || 'Unknown User'}</span>
						</button>

						{/* 关注按钮 - 只有当前用户不是发布者时才显示 */}
						{/* {isAuthenticated && authInfo?.userId !== post.publisher?.id && (
							<button
								onClick={handleFollowAuthor}
								disabled={isInteracting}
								className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isFollowed
										? 'bg-green-100 text-green-600 hover:bg-green-200'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
									} ${isInteracting ? 'opacity-50 cursor-not-allowed' : ''}`}
							>
								<UserPlus className={`h-3 w-3 ${isFollowed ? 'fill-current' : ''}`} />
								<span>{isFollowed ? t('square.followed') : t('square.follow')}</span>
							</button>
						)} */}
					</div>

					{post.location && (
						<div className="flex items-center gap-2">
							<MapPin className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-600 font-nunito">{post.location}</span>
						</div>
					)}
				</div>

					{/* 描述文本 */}
					<p className="text-[#20313B] leading-relaxed text-base font-inter">{post.description}</p>

					{/* 视频区域 */}
					{post.video && (
						<div className="relative w-full h-64 bg-gray-200 rounded-sm overflow-hidden cursor-pointer" onClick={handleVideoPlay}>
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
							<div className="absolute inset-0 flex items-center justify-center bg-opacity-30">
								<div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
									<svg className="w-8 h-8 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M8 5v14l11-7z" />
									</svg>
								</div>
							</div>
						</div>
					)}

					{/* 图片展示区域 */}
					{validImages.length > 0 && (
						<div className="space-y-4">
							{displayedImages.map((image, index) => {
								const imageUrl = `${SERVER_CONFIG.STATIC_URL}${image}`;
								const allImages = validImages.map(img => `${SERVER_CONFIG.STATIC_URL}${img}`);
								// 计算实际索引（displayedImages是从validImages中slice出来的，所以索引对应）
								const actualIndex = index;
								// 在折叠状态下，在最后一张显示的图片上显示覆盖层（表示还有更多图片）
								const isLastDisplayedImage = index === displayedImages.length - 1;
								const showOverlay = !showAllImages && validImages.length > displayedImages.length && isLastDisplayedImage;
								return (
									<div
										key={index}
										className="relative w-full h-64 rounded-sm bg-gray-200 overflow-hidden group cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											handleImagePreview(imageUrl, allImages, actualIndex);
										}}
									>
										<OptimizedImage
											src={imageUrl}
											alt={`Gallery image ${index + 1}`}
											className="w-full h-full object-cover transition-transform group-hover:scale-105"
											onError={() => {
												console.error(`Failed to load image: ${imageUrl}`);
											}}
										/>
										{/* 折叠状态下的渐变透明白色覆盖层 */}
										{showOverlay && (
											<div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent pointer-events-none" />
										)}
									</div>
								);
							})}

							{/* 展开/收起按钮 */}
							{/* 只有在有未显示的图片（折叠状态）或已展开状态时才显示按钮 */}
							{(showAllImages || validImages.length > displayedImages.length) && (
								<div className="flex justify-center">
									<button
										onClick={() => setShowAllImages(!showAllImages)}
										className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
									>
										<Image
											src="/img/show.png"
											alt="Show"
											width={20}
											height={20}
											className={`h-9 w-9 transition-transform ${showAllImages ? 'rotate-180' : ''}`}
										/>
									</button>
								</div>
							)}
						</div>
					)}

					{/* 品牌信息 */}
					{post.brandInfo && (
						<div className="space-y-4">
							{/* 品牌网站 */}
							{post.brandInfo.website && (
								<div className="flex items-center gap-3">
									<img src="/img/Icon-website.svg" alt="Website" className="h-9 w-9" />
									<a
										href={post.brandInfo.website.startsWith('http') ? post.brandInfo.website : `https://${post.brandInfo.website}`}
										className="text-[#0F1728] hover:underline text-sm font-semibold font-poppins"
										target="_blank"
										rel="noopener noreferrer"
									>
										{post.brandInfo.website}
									</a>
								</div>
							)}

							{/* 品牌介绍 */}
							{post.brandInfo && (
								<div className="flex items-start gap-3">
									{post.brandInfo.intro && <img src="/img/Icon-introduction.svg" alt="Introduction" className="h-9 w-9 pl-1" />}
									<div className="flex-1">
										{post.brandInfo.intro && <p className="text-xs text-[#0F1728] font-normal font-inter pt-1 leading-relaxed">
											{post.brandInfo.intro}
										</p>}
										{post.brandInfo.customerService ? <p className="text-xs mt-6 text-[#0F1728] font-inter"><span className="font-semibold mr-1">{t('personalPage.customerServiceHotline')}:</span>{post.brandInfo.customerService}</p> : null}
										{post.brandInfo.workHour ? <p className="text-xs text-[#0F1728] font-inter"><span className="font-semibold mr-1">{t('personalPage.workHour')}:</span>{post.brandInfo.workHour}</p> : null}
										{post.brandInfo.email ? <p className="text-xs text-[#0F1728] font-inter"><span className="font-semibold mr-1">{t('personalPage.email')}:</span>{post.brandInfo.email}</p> : null}
										{post.brandInfo.address ? <p className="text-xs text-[#0F1728] font-inter"><span className="font-semibold mr-1">{t('personalPage.address')}:</span>{post.brandInfo.address}</p> : null}
									</div>
								</div>
							)}


						</div>
					)}

					{/* 互动按钮 */}
					<div className="flex items-center justify-center gap-8 px-10 ">
						<button
							onClick={handleBookmark}
							disabled={isInteracting || !isAuthenticated}
							className={`flex items-center gap-2 transition-colors ${isBookmarked
								? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent'
								: 'text-[#0F1728] hover:text-gray-800'
								} ${(isInteracting || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
							title={!isAuthenticated ? (t('square.pleaseLoginFirst') as string) : ''}
						>
							<Bookmark
								className="h-6 w-6"
								style={isBookmarked ? { fill: 'url(#bookmark-gradient)' } : {}}
							/>
							<span className={`text-sm font-nunito ${isBookmarked ? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent' : ''}`}>
								{bookmarks.toLocaleString()}
							</span>
						</button>
						{/* 分割线 */}
						<div className="h-2 w-px bg-gray-600" />
						<button
							onClick={handleLike}
							disabled={isInteracting || !isAuthenticated}
							className={`flex items-center gap-2 transition-colors ${isLiked
								? 'bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent'
								: 'text-[#0F1728] hover:text-red-500'
								} ${(isInteracting || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
							title={!isAuthenticated ? (t('square.pleaseLoginFirst') as string) : ''}
						>
							<Heart
								className="h-6 w-6"
								style={isLiked ? { fill: 'url(#heart-gradient)' } : {}}
							/>
							<span className={`text-sm font-nunito ${isLiked ? 'bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent' : ''}`}>
								{likes.toLocaleString()}
							</span>
						</button>
						{/* 分割线 */}
						<div className="h-2 w-px bg-gray-600" />
						<button
							onClick={handleShare}
							className="flex items-center gap-2 text-[#0F1728] hover:text-gray-800 transition-colors"
						>
							<SquareArrowOutUpRight className="h-6 w-6" />
							<span className="text-sm font-nunito text-[#0F1728]">{shares || t('square.share')}</span>
						</button>
					</div>

					{/* 评论区域 */}
					<div className="space-y-4">
						<div className="" style={{ borderBottom: '1px solid #e5e7eb' }}></div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<h3 className="text-sm font-nunito text-gray-900">{t('square.comments')}</h3>
								<span className="text-sm text-gray-500 font-nunito">({(post.comments || []).length})</span>
							</div>
							<Image
								src="/img/chat.png"
								alt="Chat"
								width={24}
								height={24}
								className="h-5 w-5"
								onClick={() => {
									setReplyingTo(null);
									setComment('');
									// 滚动到输入框
									setTimeout(() => {
										const input = document.querySelector('input[type="text"]') as HTMLInputElement;
										input?.focus();
									}, 100);
								}}
							/>
						</div>

						{/* 评论列表 */}
						<div className="space-y-4">
							{Array.isArray(post.comments) && post.comments.length > 0 ? (
								post.comments.map((comment, index: number) => {
									const commentId = comment.id || `comment-${index}`;
									const authorNickname = comment.author?.nickname || 'Anonymous';
									const authorAvatar = comment.author?.avatar || '';
									const commentContent = comment.content || '';
									const repliesCount = comment.replies || 0;
									const replyList = comment.replyList || [];
									const createdAt = comment.createdAt || '';

									return (
										<div key={commentId} className="space-y-3">
											{/* 主评论 */}
											<div className="flex gap-3">
												<Image
													src={buildAvatarUrl(authorAvatar || post.publisher?.avatar)}
													alt="avatar"
													width={16}
													height={16}
													className="w-9 h-9 rounded-full flex-shrink-0"
												/>
												<div className="flex-1">
													<div className="flex items-center justify-between mb-1">
														<div className="flex items-center gap-2">
															<span className="text-sm font-medium text-gray-900 font-inter">
																{authorNickname}
															</span>
															{createdAt && (
																<span className="text-xs text-gray-500 font-inter">
																	{createdAt}
																</span>
															)}
														</div>
														<button
															onClick={() => {
																setReplyingTo({ id: commentId, nickname: authorNickname });
																// 滚动到输入框
																setTimeout(() => {
																	const input = document.querySelector('input[type="text"]') as HTMLInputElement;
																	input?.focus();
																}, 100);
															}}
															className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs"
														>
															<Image
																src="/img/chat.png"
																alt="Reply"
																width={16}
																height={16}
																className="h-5 w-5"
															/>

															{repliesCount > 0 && (
																<span className="text-gray-400 font-inter">({repliesCount})</span>
															)}
														</button>
													</div>
													<p className="text-gray-700 mb-2 text-xs font-inter leading-relaxed">{commentContent}</p>
												</div>
											</div>

											{/* 回复列表 */}
											{Array.isArray(replyList) && replyList.length > 0 && (
												<div className="ml-11 space-y-3 pl-4">
													{replyList.map((reply, replyIndex: number) => {
														const replyId = reply.id || `reply-${index}-${replyIndex}`;
														const replyAuthorNickname = reply.author?.nickname || 'Anonymous';
														const replyAuthorAvatar = reply.author?.avatar || '';
														const replyContent = reply.content || '';
														const replyCreatedAt = reply.createdAt || '';

														return (
															<div key={replyId} className="flex gap-3">
																<Image
																	src={buildAvatarUrl(replyAuthorAvatar || post.publisher?.avatar)}
																	alt="avatar"
																	width={16}
																	height={16}
																	className="w-9 h-9 rounded-full flex-shrink-0"
																/>
																<div className="flex-1">
																	<div className="flex items-center justify-between mb-1">
																		<div className="flex items-center gap-2">
																			<span className="text-sm font-medium text-gray-900 font-inter">
																				{replyAuthorNickname}
																			</span>
																			{replyCreatedAt && (
																				<span className="text-xs text-gray-500 font-inter">
																					{replyCreatedAt}
																				</span>
																			)}
																		</div>
																		{/* <button
																		onClick={() => {
																			setReplyingTo({ id: replyId, nickname: replyAuthorNickname });
																			// 滚动到输入框
																			setTimeout(() => {
																				const input = document.querySelector('input[type="text"]') as HTMLInputElement;
																				input?.focus();
																			}, 100);
																		}}
																		className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs"
																	>
																		<Image
																			src="/img/chat.png"
																			alt="Reply"
																			width={16}
																			height={16}
																			className="h-5 w-5"
																		/>
																	</button> */}
																	</div>
																	<p className="text-gray-700 text-xs font-inter leading-relaxed">{replyContent}</p>
																</div>
															</div>
														);
													})}
												</div>
											)}
										</div>
									);
								})
							) : (
								<div className="text-center py-8">
									<p className="text-gray-500 font-inter text-base">{t('square.noComments')}</p>
								</div>
							)}
						</div>

						{/* 评论输入框 */}
						<div className="pt-4 ">
							{/* 回复提示 */}
							{/* {replyingTo && (
								<div className="mb-2 flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
									<span className="text-sm text-blue-700 font-inter">
										{t('square.replyingTo')} {replyingTo.nickname}：
									</span>
									<button
										onClick={() => setReplyingTo(null)}
										className="text-blue-500 hover:text-blue-700 text-sm font-bold"
									>
										×
									</button>
								</div>
							)} */}
							<div className="flex gap-3">
								<div className="flex-1 flex gap-2">
									<input
										type="text"
										value={replyingTo ? `${t('square.replyingTo')} ${replyingTo.nickname}：${comment}` : comment}
										onChange={(e) => {
											if (replyingTo) {
												const prefix = `${t('square.replyingTo')} ${replyingTo.nickname}：`;
												// 如果输入值包含前缀，提取实际内容
												if (e.target.value.startsWith(prefix)) {
													setComment(e.target.value.slice(prefix.length));
												} else if (e.target.value.length < prefix.length) {
													// 如果用户尝试删除前缀，阻止删除
													return;
												} else {
													// 如果前缀被修改，保持前缀不变，只更新后续内容
													setComment(e.target.value.slice(prefix.length));
												}
											} else {
												setComment(e.target.value);
											}
										}}
										onKeyDown={(e) => {
											if (replyingTo) {
												const prefix = `${t('square.replyingTo')} ${replyingTo.nickname}：`;
												const input = e.currentTarget;
												// 如果光标在前缀范围内，阻止删除
												if (input.selectionStart !== null && input.selectionStart < prefix.length) {
													if (e.key === 'Backspace' || e.key === 'Delete') {
														e.preventDefault();
														// 将光标移到前缀之后
														setTimeout(() => {
															input.setSelectionRange(prefix.length, prefix.length);
														}, 0);
													}
												}
											}
										}}
										placeholder={isAuthenticated ? (replyingTo ? `${t('square.replyingTo') as string} ${replyingTo.nickname}：` : (t('square.inputComments') as string)) : (t('square.pleaseLoginFirst') as string)}
										disabled={!isAuthenticated || isSubmittingComment}
										onKeyPress={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault();
												handleSubmitComment();
											}
										}}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-900 placeholder-gray-500"
										style={{
											border: '1px solid #d1d5db',
											backgroundColor: '#f3f4f6',
											color: '#111827'
										}}
									/>
									<button
										onClick={handleSubmitComment}
										disabled={!isAuthenticated || !comment.trim() || isSubmittingComment}
										className={`flex items-center justify-center transition-opacity ${(!isAuthenticated || !comment.trim() || isSubmittingComment)
											? 'cursor-not-allowed'
											: ''
											}`}
									>
										{/* {isSubmittingComment ? (
											<>
												<svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												<span className="ml-2">{t('square.submittingComment')}</span>
											</>
										) : ( */}
										<Image
											src="/img/send.png"
											alt="Send"
											width={24}
											height={24}
											className="h-6 w-6"
										/>
										{/* )} */}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main >

			{/* 全屏视频播放弹窗 */}
			{
				isVideoPlaying && post.video && (
					<div className="fixed inset-0 z-[9998] bg-black bg-opacity-90 w-full h-full flex items-center justify-center overflow-hidden"
						style={{ touchAction: 'none' }}>
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
								src={`${SERVER_CONFIG.STATIC_URL}${post.video}`}
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
				)
			}

			{/* 图片预览弹窗 */}
			{
				isImagePreviewOpen && previewImageUrl && (
					<div
						className="fixed inset-0 z-[9999] bg-black bg-opacity-90 h-full w-full flex items-center justify-center overflow-hidden"
						onClick={handleImagePreviewClose}
						style={{ touchAction: 'none' }}
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
				)
			}
		</div >
	);
}
