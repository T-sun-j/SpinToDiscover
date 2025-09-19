"use client";

import { Button } from '../../components/ui/button';
import { ArrowLeft, Edit, EyeOff, Trash2, MapPin, Heart, Share2, ChevronLeft, Plus, CirclePlus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PersonalPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isFollowing, setIsFollowing] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
    };

    // Dummy data for posts (similar to SquarePage)
    const posts = [
        {
            id: 1,
            location: 'Istanbul',
            title: 'Title or central idea content text',
            description: 'This is an introduction text about some brand stories and features of this product, which is edited and uploaded to the system by each buyer, and published after being reviewed by the administrator.',
            publisher: 'Miaham',
            likes: 562,
            shares: 1210,
            images: [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
                'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=200&fit=crop'
            ]
        }
    ];

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
        <main className="flex min-h-dvh flex-col bg-white">
            {/* Header */}
            <Header
                showLanguage
                showSearch
                showUser
            />

            {/* User and Brand Info */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/img/avatar.png"
                            alt="User Avatar"
                            width={16}
                            height={16}
                            className="rounded-full w-10 h-10 object-cover"
                        />
                        <div>
                            <h2 className="text-lg text-[#101729] font-poppins">Miaham</h2>
                        </div>
                    </div>
                    {/* Edit and Settings buttons */}
                    <div className="flex items-center gap-2">
                        <Link href="/personal-center">
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-7 w-7 text-[#101729]" />
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
            <div className="px-6 py-4">
                <h2 className="text-lg  text-[#101729] font-poppins ">{t('personalPage.myPosts')}</h2>
                <div className="grid grid-cols-1 gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className=" bg-white">
                            <div className="py-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-600">{post.location}</span>
                                </div>
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
                                <h3 className="text-gray-900 mb-2 text-sm font-nunito">{post.title}</h3>
                                <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed font-inter">{post.description}</p>
                                <div className="flex items-center justify-between">
                                    {/* <div className="flex items-center gap-2">
                    <Image
                      src={post.images[0]}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                    <span className="text-sm text-gray-600 font-nunito">{post.publisher}</span>
                  </div> */}
                                    <div className="flex items-center gap-3">
                                        {/* <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-red-500">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs font-nunito">{post.likes}</span>
                    </button>
                    <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700">
                      <Share2 className="h-4 w-4" />
                      <span className="text-xs font-nunito">{post.shares}</span>
                    </button> */}
                                        <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="text-xs font-nunito">{t('personalPage.delete')}</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-700">
                                            <EyeOff className="h-4 w-4" />
                                            <span className="text-xs font-nunito">{t('personalPage.hide')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div style={{ borderBottom: '1px solid #e5e7eb' }}></div>
                </div>

                <div className="px-6 py-4 mt-8">
                    <div className="flex items-center justify-center gap-4">
                        {/* Post button */}
                        <Link href="/release">
                            <Button
                                className="bg-white text-[#101729] rounded-full h-16 w-16 flex flex-col items-center justify-center gap-1 font-nunito text-lg font-bold "
                                size="lg"
                            >
                                <CirclePlus className="h-48 w-48" />
                                <span className="text-xs font-semibold">{t('personalCenter.post.button')}</span>
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
