"use client";

import { Button } from '../../components/ui/button';
import { Search, MapPin, Bookmark, Heart, Share2, Filter } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SquarePage() {
	const { t } = useLanguage();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('recommend');

	// 模拟数据
	const posts = [
		{
			id: 1,
			location: t('square.location'),
			title: t('square.titleContent'),
			description: t('square.description'),
			publisher: t('square.publisher'),
			likes: 562,
			shares: 1210,
			images: [
				'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=200&fit=crop'
			]
		},
		{
			id: 2,
			location: t('square.location'),
			title: t('square.titleContent'),
			description: t('square.description'),
			publisher: t('square.publisher'),
			likes: 423,
			shares: 890,
			images: [
				'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop'
			]
		},
		{
			id: 3,
			location: t('square.location'),
			title: t('square.titleContent'),
			description: t('square.description'),
			publisher: t('square.publisher'),
			likes: 789,
			shares: 1567,
			images: [
				'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop'
			]
		},
		{
			id: 4,
			location: t('square.location'),
			title: t('square.titleContent'),
			description: t('square.description'),
			publisher: t('square.publisher'),
			likes: 234,
			shares: 456,
			images: [
				'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
			]
		},
		{
			id: 5,
			location: t('square.location'),
			title: t('square.titleContent'),
			description: t('square.description'),
			publisher: t('square.publisher'),
			likes: 901,
			shares: 2345,
			images: [
				'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop'
			]
		},
		{
			id: 6,
			location: t('square.location'),
			title: t('square.titleContent'),
			description: t('square.description'),
			publisher: t('square.publisher'),
			likes: 345,
			shares: 678,
			images: [
				'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
				'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop'
			]
		}
	];

	const handlePostClick = (postId: number) => {
		router.push(`/square/${postId}`);
	};

	return (
		<div className="min-h-screen bg-white">
			<main className=" flex min-h-[100vh] flex-col">
				{/* 使用公共头部组件 */}
				<Header
					showLanguage
					showSearch
					showUser
				/>

				{/* 排序标签 */}
				<div className="flex items-center justify-between px-4 pt-4 border-b">
					<div className="flex space-x-3">
						<button
							onClick={() => setActiveTab('recommend')}
							className={`text-sm font-medium px-4 py-2 rounded-full transition-all font-poppins ${
								activeTab === 'recommend' 
									? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{t('square.recommend')}
						</button>
						<button
							onClick={() => setActiveTab('following')}
							className={`text-sm font-medium px-4 py-2 rounded-full transition-all font-poppins ${
								activeTab === 'following' 
									? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' 
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							{t('square.following')}
						</button>
						<button
							onClick={() => setActiveTab('nearby')}
							className={`text-sm font-medium px-4 py-2 rounded-full transition-all font-poppins ${
								activeTab === 'nearby' 
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

				{/* 瀑布流内容 */}
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
											<img
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
												src={post.images[0]}
												alt="avatar"
												className="w-8 h-8 object-cover rounded-full"
											/>
											<span className="text-sm text-gray-600 font-nunito">{post.publisher}</span>
										</div>

										{/* 互动按钮 */}
										<div className="flex items-center gap-3">
											<button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700">
												<Bookmark className="h-4 w-4" />
												<span className="text-xs font-nunito">{post.likes}</span>
											</button>
											<button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-red-500">
												<Heart className="h-4 w-4" />
												<span className="text-xs font-nunito">{post.shares}</span>
											</button>
											<button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700">
												<Share2 className="h-4 w-4" />
												<span className="text-xs font-nunito">{t('square.share')}</span>
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
				</div>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>
		</div>
	);
}
