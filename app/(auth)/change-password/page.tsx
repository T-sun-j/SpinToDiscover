"use client";

import { Button } from '../../../components/ui/button';
import { Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		newPassword: '',
		confirmPassword: ''
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

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

		// 验证新密码
		if (!formData.newPassword || !validatePassword(formData.newPassword)) {
			setErrorMessage(t('auth.errorMessage') || 'Password does not meet requirements');
			setIsSubmitting(false);
			return;
		}

		// 验证确认密码
		if (formData.newPassword !== formData.confirmPassword) {
			setErrorMessage(t('auth.passwordsNotMatch') || 'Passwords do not match');
			setIsSubmitting(false);
			return;
		}

		try {
			// 模拟API调用
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// 成功后跳转到登录页面
			router.push('/login');
		} catch (error) {
			setErrorMessage(t('auth.errorMessage') || 'Failed to change password');
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
					<h1 className="text-xl font-semibold text-[#093966]">{t('auth.changePasswordTitle')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#093966] hover:text-[#093966]"
					>
						<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
				</div>

				{/* 修改密码表单 */}
				<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6">
					{/* 新密码输入 */}
					<div className="space-y-2">
						<div className="relative">
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
						<div className="relative">
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
						<div className="flex items-center gap-2 text-red-500 text-sm">
							<RefreshCw className="h-4 w-4" />
							<span>{errorMessage}</span>
						</div>
					)}

					{/* 提交按钮 */}
					<Button
						type="submit"
						className="w-full bg-[#093966] text-white shadow-md rounded-lg"
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
