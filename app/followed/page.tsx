"use client";

import { Button } from '../../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FollowedPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('following');

  const handleBack = () => {
    router.back();
  };

  // Dummy data for users
  const users = [
    { id: 1, name: 'Miaham', avatar: '/img/avatar.png' },
    { id: 2, name: 'Miaham', avatar: '/img/avatar.png' },
    { id: 3, name: 'Miaham', avatar: '/img/avatar.png' },
    { id: 4, name: 'Miaham', avatar: '/img/avatar.png' },
  ];

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      {/* Header */}
      <Header
        showLanguage
        showSearch
        showUser
      />


      {/* Tabs for Following/Follower */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('following')}
            className={`text-lg font-semibold font-nunito px-6 py-2 rounded-full ${activeTab === 'following' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' : 'text-gray-500'}`}
          >
            {t('followedPage.following')}
          </button>
          <button
            onClick={() => setActiveTab('follower')}
            className={`text-lg font-semibold font-nunito px-4 py-2 rounded-full ${activeTab === 'follower' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm' : 'text-gray-500'}`}
          >
            {t('followedPage.follower')}
          </button>
        </div>
        <button onClick={handleBack} className="ml-auto mr-2 text-[#101729] hover:text-[#101729] font-nunito">
          <ChevronLeft className="h-7 w-7" />
        </button>
      </div>

      {/* User List */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {users.map((user) => (
          <Link href={`/personal`} key={user.id}>
            <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg">
              <Image
                src={user.avatar}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-full w-10 h-10 object-cover"
              />
              <span className="text-lg text-[#101729] font-nunito">{user.name}</span>
            </div>
            <div style={{ borderBottom: '1px solid #e5e7eb' }}></div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
