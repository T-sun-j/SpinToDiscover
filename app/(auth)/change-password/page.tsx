"use client";

import { Button } from '../../../components/ui/button';
import { Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '../../../lib/auth';

export default function ChangePasswordPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		newPassword: '',
		confirmPassword: ''
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resetParams, setResetParams] = useState({
		email: '',
		userId: '',
		token: ''
	});

	// 从URL参数中获取重置密码所需的参数
	useEffect(() => {
		const email = searchParams.get('email');
		const userId = searchParams.get('userId');
		const token = searchParams.get('token');
		
		if (email && userId && token) {
			setResetParams({ email, userId, token });
		} else {
			// 如果没有必要的参数，显示错误或跳转
			setErrorMessage(t('auth.invalidResetLink'));
		}
	}, [searchParams]);

	// 密码验证
	const validatePassword = (password: string) => {
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumbers = /\d/.test(password);
		const hasMinLength = password.length >= 8;
		
		return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrorMessage('');
		setSuccessMessage('');

		// 验证重置参数
		if (!resetParams.email || !resetParams.userId || !resetParams.token) {
			setErrorMessage(t('auth.invalidResetLink'));
			setIsSubmitting(false);
			return;
		}

		// 验证新密码
		if (!formData.newPassword || !validatePassword(formData.newPassword)) {
			setErrorMessage(t('auth.passwordRequirements'));
			setIsSubmitting(false);
			return;
		}

		// 验证确认密码
		if (formData.newPassword !== formData.confirmPassword) {
			setErrorMessage(t('auth.passwordsNotMatch'));
			setIsSubmitting(false);
			return;
		}

		try {
			// 调用重置密码API
			const response = await resetPassword(
				resetParams.email,
				formData.newPassword,
				resetParams.userId,
				resetParams.token
			);
			
			if (response.success) {
				setSuccessMessage(t('auth.resetPasswordSuccessMessage'));
				// 成功后跳转到登录页面
				setTimeout(() => {
					router.push('/login');
				}, 2000);
			} else {
				setErrorMessage(response.message || t('auth.resetPasswordError'));
			}
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : t('auth.resetPasswordError'));
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
					showUser
				/>

				{/* 页面标题和返回按钮 */}
				<div className="flex items-center justify-between px-6 py-4">
					<h1 className="text-xl font-poppins text-[#101729]">{t('auth.resetPasswordTitle')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#101729] hover:text-[#101729]"
					>
						<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
				</div>

				{/* 修改密码表单 */}
				<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6 font-inter">
					{/* 新密码输入 */}
					<div className="space-y-2">
						<div className="relative font-inter">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type={showNewPassword ? "text" : "password"}
								value={formData.newPassword}
								onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
								placeholder={t('auth.newPassword')}
								className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
								required
							/>
							<button
								type="button"
								onClick={() => setShowNewPassword(!showNewPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					{/* 确认密码输入 */}
					<div className="space-y-2">
						<div className="relative font-inter">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type={showConfirmPassword ? "text" : "password"}
								value={formData.confirmPassword}
								onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
								placeholder={t('auth.confirmNewPassword')}
								className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
								required
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					{/* 错误信息显示 */}
					{errorMessage && (
						<div className="flex items-center gap-2 text-red-500 text-sm font-inter">
							<RefreshCw className="h-4 w-4" />
							<span>{errorMessage}</span>
						</div>
					)}

					{/* 提交按钮 */}
					<Button
						type="submit"
						className="w-full bg-[#101729] text-white shadow-md rounded-lg font-nunito font-bold"
						size="lg"
						disabled={isSubmitting || !!successMessage}
					>
						{isSubmitting 
							? t('auth.resetPasswordSubmitting') 
							: successMessage 
								? t('auth.resetPasswordSuccess')
								: t('auth.submit')
						}
					</Button>
				</form>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>
		</div>
	);
}
