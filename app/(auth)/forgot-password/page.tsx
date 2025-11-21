"use client";

import { Button } from '../../../components/ui/button';
import { Mail, RefreshCw, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '../../../lib/auth';

export default function ForgotPasswordPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
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
		setSuccessMessage('');

		// 邮箱格式验证
		if (!email || !validateEmail(email)) {
			setErrorMessage(t('auth.emailValidation') as string);
			setIsSubmitting(false);
			return;
		}

		try {
			// 调用忘记密码API
			const response = await forgotPassword(email);
			
			if (response.success) {
				setSuccessMessage(t('auth.forgotPasswordSuccessMessage') as string);
				// 可以选择跳转到登录页面或显示成功信息
				// router.push('/login');
			} else {
				setErrorMessage(response.message || t('auth.forgotPasswordErrorMessage') as string);
			}
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : t('auth.forgotPasswordErrorMessage') as string);
		} finally {
			setIsSubmitting(false);
		}
	};

	// 处理返回
	const handleBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-white">
			<main className="w-full flex min-h-[100vh] flex-col">
				{/* 使用公共头部组件 */}
				<Header/>

				{/* 页面标题和返回按钮 */}
				<div className="flex items-center justify-between px-6 py-4 z-100">
					<h1 className="text-xl font-poppins text-[#0F1728] font-semibold">{t('auth.forgotPasswordTitle')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#0F1728] hover:text-[#0F1728]"
					>
						<ChevronLeft className="h-7 w-7 z-100" />
					</button>
				</div>

				{/* 忘记密码表单 */}
				<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6 font-inter">
					{/* 邮箱输入 */}
					<div className="space-y-2">
						<div className="relative font-inter">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder={t('auth.email') as string}
								className="w-full rounded-full bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
								required
							/>
						</div>
					</div>

					{/* 错误信息显示 */}
					{errorMessage && (
						<div className="flex items-center gap-2 text-red-500 text-sm font-inter">
							<RefreshCw className="h-4 w-4" />
							<span>{errorMessage}</span>
						</div>
					)}

					{/* 成功信息显示 */}
					{successMessage && (
						<div className="flex items-center gap-2 text-green-500 text-sm font-inter">
							<Mail className="h-4 w-4" />
							<span>{successMessage}</span>
						</div>
					)}

					{/* 提交按钮 */}
					<Button
						type="submit"
						className="w-full bg-[#11295b] text-white shadow-md rounded-lg text-[17px] font-poppins font-semibold"
						size="lg"
						disabled={isSubmitting || !!successMessage}
					>
						{isSubmitting 
							? t('auth.forgotPasswordSubmitting') as string
							: successMessage 
								? t('auth.forgotPasswordSuccess') as string
								: t('auth.submit') as string
						}
					</Button>
				</form>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>
		</div>
	);
}
