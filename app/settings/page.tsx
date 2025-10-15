"use client";

import { Button } from '../../components/ui/button';
import { Mail, Lock, ChevronLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { AuthGuard } from '../../components/AuthGuard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { resetPassword } from '../../lib/auth';

export default function SettingsPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const { authInfo, getEmail, getUserId, getToken } = useAuth();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// 初始化邮箱为当前用户邮箱
	useEffect(() => {
		const currentEmail = getEmail();
		if (currentEmail) {
			setFormData(prev => ({ ...prev, email: currentEmail }));
		}
	}, [getEmail]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrorMessage('');
		setSuccessMessage('');

		// 验证密码匹配
		if (formData.password !== formData.confirmPassword) {
			setErrorMessage(t('settings.errorMessage') || 'Passwords do not match');
			setIsSubmitting(false);
			return;
		}

		// 验证密码长度
		if (formData.password.length < 6) {
			setErrorMessage(t('settings.passwordTooShort') || 'Password must be at least 6 characters');
			setIsSubmitting(false);
			return;
		}

		// 获取当前用户信息
		const userId = getUserId();
		const token = getToken();
		const email = getEmail();

		if (!userId || !token || !email) {
			setErrorMessage(t('settings.authError') || 'Authentication required');
			setIsSubmitting(false);
			return;
		}

		try {
			console.log('Reset password attempt for:', { email, userId, token: '***' });
			
			// 调用重置密码API
			const response = await resetPassword(
				email,
				formData.password,
				userId,
				token
			);
			
			console.log('Reset password response:', response);
			
			if (response.success) {
				setSuccessMessage(t('settings.resetSuccess') || 'Password reset successfully');
				// 清空表单
				setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
				// 3秒后跳转到个人中心
				setTimeout(() => {
					router.push('/personal-center');
				}, 3000);
			} else {
				setErrorMessage(response.message || response.error || t('settings.resetError') || 'Password reset failed');
			}
		} catch (error) {
			console.error('Reset password error:', error);
			setErrorMessage(error instanceof Error ? error.message : t('settings.resetError') || 'Password reset failed');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthGuard>
			<main className="flex min-h-dvh flex-col bg-white">
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
				{/* 邮箱 - 只读显示 */}
				<div className="space-y-2">
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="email"
							value={formData.email}
							placeholder={t('settings.currentEmail') || 'Current Email'}
							className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-not-allowed"
							readOnly
							disabled
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
						<div className="h-2 w-2 rounded-full bg-green-500"></div>
						<span>{successMessage}</span>
					</div>
				)}

				{/* 提交按钮 */}
				<Button
					type="submit"
					className="w-full bg-[#101729] text-white shadow-md rounded-lg font-nunito font-bold"
					size="lg"
					disabled={isSubmitting}
				>
					{isSubmitting ? t('settings.submitting') || 'Updating...' : t('settings.submit')}
				</Button>
				</form>
			</main>
		</AuthGuard>
	);
}
