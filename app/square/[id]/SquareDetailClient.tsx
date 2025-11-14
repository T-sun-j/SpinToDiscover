"use client";

import { Button } from '../../../components/ui/button';
import {
	Bookmark,
	Heart,
	Share2,
	ArrowLeft,
	MessageCircle,
	ChevronDown,
	Play,
	Expand,
	UserPlus,
	MapPin
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
	const [expandedImage, setExpandedImage] = useState<number | null>(null);
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [replyingTo, setReplyingTo] = useState<{ id: string; nickname: string } | null>(null);

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
				setError(t('square.loadDetailFailed'));
			}
		} catch (error) {
			setError(t('square.loadDetailError'));
		} finally {
			setIsLoading(false);
		}
	}, [authInfo]);

	// 加载详情数据
	useEffect(() => {
		loadSquareDetail(params.id);
	}, [params.id, loadSquareDetail]);

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

	const handleImageClick = (index: number) => {
		setExpandedImage(expandedImage === index ? null : index);
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
						<LoadingSpinner size="lg" text={t('common.loading')} />
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
							title={t('square.contentNotExist')}
							description={isAuthenticated
								? t('square.contentDeleted')
								: t('square.loginRequiredForDetail')
							}
							action={!isAuthenticated ? (
								<Button
									onClick={() => router.push('/login')}
									className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600"
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
	const displayedImages = showAllImages ? validImages : validImages.slice(0, 1);

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
						<stop offset="0%" stopColor="#f97316" />
						<stop offset="100%" stopColor="#ec4899" />
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
				<div className="flex items-center justify-between px-6 py-4 border-b">
					<h1 className="text-lg font-nunito text-[#11295b]">{post.title || 'Untitled'}</h1>
					<button
						onClick={handleBack}
						className="text-[#11295b] hover:text-[#11295b]"
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
								src={`${SERVER_CONFIG.STATIC_URL}${post.publisher?.avatar || ''}`}
								alt={post.publisher?.nickname || 'User'}
								className="w-8 h-8 rounded-full object-cover bg-gray-300"
							/>
							<span className="font-medium text-gray-900 font-nunito">{post.publisher?.nickname || 'Unknown User'}</span>
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

						<div className="flex items-center gap-1 ml-auto">
							<MapPin className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-600 font-nunito">{post.location || 'Unknown Location'}</span>
						</div>
					</div>

					{/* 描述文本 */}
					<p className="text-gray-700 leading-relaxed text-sm font-inter">{post.description || 'No description available'}</p>

					{/* 视频区域 */}
					{post.video && (
						<div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer" onClick={handleVideoPlay}>
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
								<button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
									<Play className="w-6 h-6 text-gray-800 ml-1" />
								</button>
							</div>
						</div>
					)}

					{/* 图片展示区域 */}
					{validImages.length > 0 && (
						<div className="space-y-4">
							{displayedImages.map((image, index) => {
								const imageUrl = `${SERVER_CONFIG.STATIC_URL}${image}`;
								return (
									<div key={index} className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer" onClick={() => handleImageClick(index)}>
										<OptimizedImage
											src={imageUrl}
											alt={`Gallery image ${index + 1}`}
											className="w-full h-full object-cover transition-transform group-hover:scale-105"
											onError={() => {
												console.error(`Failed to load image: ${imageUrl}`);
											}}
										/>
									</div>
								);
							})}

							{/* 展开/收起按钮 */}
							{validImages.length > 1 && (
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
					)}

					{/* 品牌信息 */}
					{post.brandInfo && (
						<div className="space-y-4">
							{/* 品牌网站 */}
							{post.brandInfo.website && (
								<div className="flex items-center gap-3">
									<img src="/img/Icon-website.svg" alt="Website" className="h-6 w-6" />
									<a
										href={post.brandInfo.website.startsWith('http') ? post.brandInfo.website : `https://${post.brandInfo.website}`}
										className="text-[#11295b] hover:underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										{post.brandInfo.website}
									</a>
									{post.brandInfo.logo && (
										<OptimizedImage
											src={`${SERVER_CONFIG.STATIC_URL}${post.brandInfo.logo}`}
											alt="Brand Logo"
											className="h-10 w-auto ml-2 min-w-12"
										/>
									)}
								</div>
							)}

							{/* 品牌介绍 */}
							{post.brandInfo.intro && (
								<div className="flex items-start gap-3">
									<img src="/img/Icon-introduction.svg" alt="Introduction" className="h-6 w-6" />
									<div className="flex-1">
										<p className="text-sm text-gray-700 font-nunito leading-relaxed">
											{post.brandInfo.intro}

										</p>
									</div>
								</div>
							)}
							{post.brandInfo.customerService?<p className="text-[12px] text-gray-700 font-inter ml-9">{t('personalPage.customerServiceHotline')}:{post.brandInfo.customerService}</p>:null}
							{post.brandInfo.workHour?<p className="text-[12px] text-gray-700 font-inter ml-9">{t('personalPage.workHour')}:{post.brandInfo.workHour}</p>:null}
							{post.brandInfo.email?<p className="text-[12px] text-gray-700 font-inter ml-9">{t('personalPage.email')}:{post.brandInfo.email}</p>:null}
							{post.brandInfo.address?<p className="text-[12px] text-gray-700 font-inter ml-9">{t('personalPage.address')}:{post.brandInfo.address}</p>:null}

						</div>
					)}

					{/* 互动按钮 */}
					<div className="flex items-center justify-between px-10 border-t border-b">
						<button
							onClick={handleBookmark}
							disabled={isInteracting || !isAuthenticated}
							className={`flex items-center gap-2 transition-colors ${isBookmarked 
								? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent' 
								: 'text-gray-600 hover:text-gray-800'
								} ${(isInteracting || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
							title={!isAuthenticated ? t('square.pleaseLoginFirst') : ''}
						>
							<Bookmark 
								className="h-8 w-8" 
								style={isBookmarked ? { fill: 'url(#bookmark-gradient)' } : {}}
							/>
							<span className={`text-sm font-nunito ${isBookmarked ? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent' : ''}`}>
								{bookmarks.toLocaleString()}
							</span>
						</button>
						<button
							onClick={handleLike}
							disabled={isInteracting || !isAuthenticated}
							className={`flex items-center gap-2 transition-colors ${isLiked 
								? 'bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent' 
								: 'text-gray-600 hover:text-red-500'
								} ${(isInteracting || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
							title={!isAuthenticated ? t('square.pleaseLoginFirst') : ''}
						>
							<Heart 
								className="h-8 w-8" 
								style={isLiked ? { fill: 'url(#heart-gradient)' } : {}}
							/>
							<span className={`text-sm font-nunito ${isLiked ? 'bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent' : ''}`}>
								{likes.toLocaleString()}
							</span>
						</button>
						<button
							onClick={handleShare}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
						>
							<Share2 className="h-6 w-6" />
							<span className="text-sm font-nunito">{shares.toLocaleString()}</span>
						</button>
					</div>

					{/* 评论区域 */}
					<div className="space-y-4">
						<div className="" style={{ borderBottom: '1px solid #e5e7eb' }}></div>
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-nunito text-gray-900">{t('square.comments')}</h3>
							<span className="text-sm text-gray-500 font-nunito">({(post.comments || []).length})</span>
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
												<OptimizedImage
													src={buildAvatarUrl(authorAvatar || post.publisher?.avatar)}
													alt="avatar"
													className="w-8 h-8 rounded-full flex-shrink-0"
												/>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="text-sm font-medium text-gray-900 font-inter">
															{authorNickname}
														</span>
														{createdAt && (
															<span className="text-xs text-gray-500 font-inter">
																{createdAt}
															</span>
														)}
													</div>
													<p className="text-gray-700 mb-2 text-sm font-inter leading-relaxed">{commentContent}</p>
													<button 
														onClick={() => {
															setReplyingTo({ id: commentId, nickname: authorNickname });
															// 滚动到输入框
															setTimeout(() => {
																const input = document.querySelector('input[type="text"]') as HTMLInputElement;
																input?.focus();
															}, 100);
														}}
														className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
													>
														<MessageCircle className="h-4 w-4" />
														<span className="font-inter">{t('square.reply')}</span>
														{repliesCount > 0 && (
															<span className="text-gray-400 font-inter">({repliesCount})</span>
														)}
													</button>
												</div>
											</div>

											{/* 回复列表 */}
											{Array.isArray(replyList) && replyList.length > 0 && (
												<div className="ml-11 space-y-3 border-l-2 border-gray-200 pl-4">
													{replyList.map((reply, replyIndex: number) => {
														const replyId = reply.id || `reply-${index}-${replyIndex}`;
														const replyAuthorNickname = reply.author?.nickname || 'Anonymous';
														const replyAuthorAvatar = reply.author?.avatar || '';
														const replyContent = reply.content || '';
														const replyCreatedAt = reply.createdAt || '';

														return (
															<div key={replyId} className="flex gap-3">
																<OptimizedImage
																	src={buildAvatarUrl(replyAuthorAvatar || post.publisher?.avatar)}
																	alt="avatar"
																	className="w-6 h-6 rounded-full flex-shrink-0"
																/>
																<div className="flex-1">
																	<div className="flex items-center gap-2 mb-1">
																		<span className="text-xs font-medium text-gray-900 font-inter">
																			{replyAuthorNickname}
																		</span>
																		{replyCreatedAt && (
																			<span className="text-xs text-gray-500 font-inter">
																				{replyCreatedAt}
																			</span>
																		)}
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
									<p className="text-gray-500 font-inter">{t('square.noComments')}</p>
								</div>
							)}
						</div>

						{/* 评论输入框 */}
						<div className="pt-4 border-t">
							{/* 回复提示 */}
							{replyingTo && (
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
							)}
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
									placeholder={isAuthenticated ? (replyingTo ? `${t('square.replyingTo')} ${replyingTo.nickname}：` : t('square.inputComments')) : t('square.pleaseLoginFirst')}
									disabled={!isAuthenticated || isSubmittingComment}
									onKeyPress={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleSubmitComment();
										}
									}}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-900 placeholder-gray-500"
									style={{
										border: '1px solid #d1d5db',
										backgroundColor: '#ffffff',
										color: '#111827'
									}}
								/>
								<button
									onClick={handleSubmitComment}
									disabled={!isAuthenticated || !comment.trim() || isSubmittingComment}
									className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${(!isAuthenticated || !comment.trim() || isSubmittingComment)
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-blue-500 text-white hover:bg-blue-600'
										}`}
								>
									{isSubmittingComment ? (
										<>
											<svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											{t('square.submittingComment')}
										</>
									) : (
										<>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
											</svg>
											{t('square.send')}
										</>
									)}
								</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>

			{/* 全屏视频播放弹窗 */}
			{isVideoPlaying && post.video && (
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
			)}
		</div>
	);
}
