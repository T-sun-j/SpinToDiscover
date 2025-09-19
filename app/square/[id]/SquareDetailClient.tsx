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
	Expand
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SquareDetailClientProps {
	params: { id: string };
}

export default function SquareDetailClient({ params }: SquareDetailClientProps) {
	const { t } = useLanguage();
	const router = useRouter();
	const [showAllImages, setShowAllImages] = useState(false);
	const [comment, setComment] = useState('');
	const [isLiked, setIsLiked] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [likes, setLikes] = useState(23565);
	const [bookmarks, setBookmarks] = useState(1232);
	const [expandedImage, setExpandedImage] = useState<number | null>(null);

	// 模拟数据
	const post = {
		id: params.id,
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

	const handleLike = () => {
		setIsLiked(!isLiked);
		setLikes(prev => isLiked ? prev - 1 : prev + 1);
	};

	const handleBookmark = () => {
		setIsBookmarked(!isBookmarked);
		setBookmarks(prev => isBookmarked ? prev - 1 : prev + 1);
	};

	const handleShare = () => {
		if (navigator.share) {
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
		router.push(`/user/${post.publisher}`);
	};

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
								src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
								alt="avatar"
								className="w-8 h-8 rounded-full object-cover bg-gray-300"
							/>
							<span className="font-medium text-gray-900 font-nunito">{post.publisher}</span>
						</button>
						<div className="flex items-center gap-1 ml-auto">
							<MapPin className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-600 font-nunito">{post.location}</span>
						</div>
					</div>

					{/* 描述文本 */}
					<p className="text-gray-700 leading-relaxed text-sm font-inter">{post.description}</p>

					{/* 视频区域 */}
					<div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
						<img
							src={post.video}
							alt="Video thumbnail"
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
							<button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
								<svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8 5v14l11-7z"/>
								</svg>
							</button>
						</div>
					</div>

					{/* 图片展示区域 */}
					<div className="space-y-4">
						{displayedImages.map((image, index) => (
							<div key={index} className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer" onClick={() => handleImageClick(index)}>
								<img
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
							<img src="/img/Icon-website.png" alt="Globe" className="h-6 w-6" />
							<a href={`https://${post.brandWebsite}`} className="text-[#101729] hover:underline">
								{post.brandWebsite}
							</a>
						</div>

						{/* 营业时间 */}
						<div className="flex items-start gap-3">
							<img src="/img/Icon-introduction.png" alt="Clock" className="h-6 w-6" />
							<div className="flex-1">
								<p className="text-sm text-gray-700 font-nunito leading-relaxed">{post.operatingHours}</p>
								<div className="flex items-center gap-2 mt-3">
									{/* 品牌Logo - 使用实际的Logo图片 */}
									<div className="flex items-center gap-2">
										<img 
											src="/img/band.png" 
											alt="Loro Piana Logo" 
											className="h-8 w-auto"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* 客服热线 */}
						<div className="flex items-center gap-3 ml-8">
							<span className="text-sm text-gray-700 font-inter">{post.customerService}</span>
						</div>

						{/* 工作时间 */}
						<div className="flex items-center gap-3 ml-8">
							<span className="text-sm text-gray-700 font-inter">{post.workingHours}</span>
						</div>

						{/* 邮箱 */}
						<div className="flex items-center gap-3 ml-8">
							<span className="text-sm text-gray-700 font-inter">{post.email}</span>
						</div>
					</div>

					{/* 互动按钮 */}
					<div className="flex items-center justify-center gap-6 py-4 border-t border-b">
						<button 
							onClick={handleBookmark}
							className={`flex items-center gap-2 transition-colors ${isBookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
						>
							<Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} />
							<span className="text-sm font-nunito">{bookmarks.toLocaleString()}</span>
						</button>
						<button 
							onClick={handleLike}
							className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
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
							<span className="text-sm text-gray-500 font-nunito">({post.comments.length})</span>
						</div>
						
						{/* 评论列表 */}
						<div className="space-y-4">
							{post.comments.map((comment) => (
								<div key={comment.id} className="flex gap-3">
									<div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
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
							<img
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
