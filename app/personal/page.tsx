"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthGuard } from '../../components/AuthGuard';

export default function PersonalPage() {
    const router = useRouter();
    const { authInfo } = useAuth();

    useEffect(() => {
        if (authInfo?.userId) {
            // 直接重定向到当前用户的个人页面，不显示任何内容
            router.replace(`/personal/${authInfo.userId}`);
        }
    }, [authInfo?.userId, router]);

    // 不渲染任何内容，直接重定向
    return null;
}
