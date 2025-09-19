"use client";

import { Button } from '../../../components/ui/button';
import { Mail, Lock, Eye, EyeOff, RefreshCw, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: ''
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

		// 验证邮箱格式
		if (!formData.email || !formData.email.includes('@')) {
			setErrorMessage(t('auth.errorMessage') || 'Invalid email format');
			setIsSubmitting(false);
			return;
		}

		// 验证密码
		if (!formData.password || !validatePassword(formData.password)) {
			setErrorMessage(t('auth.errorMessage') || 'Password does not meet requirements');
			setIsSubmitting(false);
			return;
		}

		try {
			// 模拟API调用
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// 登录成功后跳转到广场页（首页）
			router.push('/');
		} catch (error) {
			setErrorMessage(t('auth.errorMessage') || 'Login failed');
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
					<h1 className="text-xl font-semibold text-[#101729]">{t('auth.loginTitle')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#101729] hover:text-[#101729]"
					>
						<ChevronLeft className="h-7 w-7" />
					</button>
				</div>

				{/* 登录表单 */}
				<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6">
					{/* 邮箱输入 */}
					<div className="space-y-2">
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type="email"
								value={formData.email}
								onChange={(e) => setFormData({...formData, email: e.target.value})}
								placeholder={t('auth.email')}
								className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
								required
							/>
						</div>
					</div>

					{/* 密码输入 */}
					<div className="space-y-2">
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type={showPassword ? "text" : "password"}
								value={formData.password}
								onChange={(e) => setFormData({...formData, password: e.target.value})}
								placeholder={t('auth.password')}
								className="w-full rounded-lg bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

					{/* 登录按钮 */}
					<Button
						type="submit"
						className="w-full bg-[#101729] text-white shadow-md rounded-lg"
						size="lg"
						disabled={isSubmitting}
					>
						{isSubmitting ? t('auth.submitting') || 'Logging in...' : t('auth.login')}
					</Button>

					{/* 忘记密码链接 */}
					<div className="text-center">
						<Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800 font-bold">
							{t('auth.forgetPassword')}
						</Link>
					</div>

					{/* 创建新账户链接 */}
					<div className="text-center">
						<Link href="/register" className="text-sm text-gray-600 hover:text-gray-800 font-bold">
							{t('auth.createAccount')}
						</Link>
					</div>
				</form>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>
		</div>
	);
}
