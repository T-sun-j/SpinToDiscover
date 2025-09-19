"use client";

import { Button } from '../../components/ui/button';
import { Mail, Lock,ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: ''
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// 简单校验
		if (formData.password !== formData.confirmPassword) return;
		// 提交后进入个人中心
		router.push('/settings');
	};

	return (
		<main className="container-page flex min-h-dvh flex-col bg-white">
			<Header
				showLanguage
			/>
			{/* 页面标题 */}
			<div className="flex items-center justify-between px-6 py-4">
				<h1 className="text-xl text-[#101729]">{t('settings.setupTitle')}</h1>
				<button className="text-[#101729] hover:text-[#101729]">
					<ChevronLeft className="h-7 w-7" />
				</button>
			</div>

			<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6">
				{/* 邮箱 */}
				<div className="space-y-2">
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="email"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							placeholder={t('settings.newEmail')}
							className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
							required
						/>
					</div>
				</div>

				{/* 新密码 */}
				<div className="space-y-2">
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="password"
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							placeholder={t('settings.newPassword')}
							className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
							required
						/>
					</div>
				</div>

				{/* 确认密码 */}
				<div className="space-y-2">
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="password"
							value={formData.confirmPassword}
							onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
							placeholder={t('settings.confirmPassword')}
							className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
							required
						/>
					</div>
				</div>

				{/* 错误信息 */}
				{formData.password !== formData.confirmPassword && formData.confirmPassword && (
					<div className="flex items-center gap-2 text-red-500 text-sm">
						<div className="h-2 w-2 rounded-full bg-red-500"></div>
						<span>{t('settings.errorMessage')}</span>
					</div>
				)}

				{/* 提交按钮，点击后跳转到个人中心页 */}
				<Link href="/personal-center" passHref>
					<Button
						type="button"
						className="w-full bg-[#101729] text-white shadow-md rounded-lg"
						size="lg"
					>
						{t('settings.submit')}
					</Button>
				</Link>
			</form>
		</main>
	);
}
