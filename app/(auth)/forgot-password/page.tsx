"use client";

import { Button } from '../../../components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// 邮箱格式验证
	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrorMessage('');

		// 邮箱格式验证
		if (!email || !validateEmail(email)) {
			setErrorMessage(t('auth.errorMessage') || 'Invalid email format');
			setIsSubmitting(false);
			return;
		}

		try {
			// 模拟API调用
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// 成功后跳转到修改密码页面
			router.push('/change-password');
		} catch (error) {
			setErrorMessage(t('auth.errorMessage') || 'Failed to send reset email');
		} finally {
			setIsSubmitting(false);
		}
	};

	// 处理返回
	const handleBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-white">
			<main className=" flex min-h-[100vh] flex-col">
				{/* 使用公共头部组件 */}
				<Header
					showLanguage
				/>

				{/* 页面标题和返回按钮 */}
				<div className="flex items-center justify-between px-6 py-4">
					<h1 className="text-xl font-semibold text-[#101729]">{t('auth.forgotPasswordTitle')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#101729] hover:text-[#101729]"
					>
						<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
				</div>

				{/* 忘记密码表单 */}
				<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6">
					{/* 邮箱输入 */}
					<div className="space-y-2">
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder={t('auth.email')}
								className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
								required
							/>
						</div>
					</div>

					{/* 错误信息显示 */}
					{errorMessage && (
						<div className="flex items-center gap-2 text-red-500 text-sm">
							<RefreshCw className="h-4 w-4" />
							<span>{errorMessage}</span>
						</div>
					)}

					{/* 提交按钮 */}
					<Button
						type="submit"
						className="w-full bg-[#101729] text-white shadow-md rounded-lg"
						size="lg"
						disabled={isSubmitting}
					>
						{isSubmitting ? t('auth.submitting') || 'Submitting...' : t('auth.submit')}
					</Button>
				</form>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>
		</div>
	);
}
