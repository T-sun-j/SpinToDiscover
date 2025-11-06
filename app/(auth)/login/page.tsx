"use client";

import { Button } from '../../../components/ui/button';
import { Mail, Lock, Eye, EyeOff, RefreshCw, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '../../../lib/auth';
import { useAuth } from '../../../contexts/AuthContext';

export default function LoginPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { setAuthInfo } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [errorMessage, setErrorMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// 获取重定向URL，并清理可能的循环重定向
	const getCleanRedirectUrl = () => {
		const rawRedirect = searchParams.get('redirect') || '/square';
		console.log('Login page - raw redirect parameter:', rawRedirect);
		
		try {
			// 解码URL参数
			const decodedRedirect = decodeURIComponent(rawRedirect);
			console.log('Login page - decoded redirect:', decodedRedirect);
			
			// 如果重定向URL包含登录页面或嵌套的重定向参数，则使用默认页面
			if (decodedRedirect.includes('/login') || 
			    decodedRedirect.includes('redirect=') ||
			    decodedRedirect.includes('%2Flogin') ||
			    decodedRedirect.includes('%252Flogin')) {
				console.log('Login page - detected loop, using default redirect');
				return '/square';
			}
			
			// 确保重定向URL是有效的路径
			if (decodedRedirect.startsWith('/') && 
			    !decodedRedirect.includes('?') &&
			    !decodedRedirect.includes('redirect=')) {
				console.log('Login page - using clean redirect:', decodedRedirect);
				return decodedRedirect;
			}
			
			console.log('Login page - invalid redirect, using default');
			return '/square';
		} catch (error) {
			console.warn('Login page - failed to parse redirect URL:', rawRedirect, error);
			return '/square';
		}
	};
	
	const redirectUrl = getCleanRedirectUrl();
	console.log('Login page - final redirect URL:', redirectUrl);

	// 基本密码验证 - 登录时只需要检查密码不为空
	const validatePassword = (password: string) => {
		return password && password.length > 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrorMessage('');

		// 验证邮箱格式
		if (!formData.email || !formData.email.includes('@')) {
			setErrorMessage(t('auth.loginErrorMessage'));
			setIsSubmitting(false);
			return;
		}

		// 验证密码
		if (!formData.password || !validatePassword(formData.password)) {
			setErrorMessage(t('auth.passwordRequirements'));
			setIsSubmitting(false);
			return;
		}

		try {
			// 调用登录API
			const response = await loginUser(
				formData.email,
				formData.password,
				'en' // 可以根据用户选择设置语言
			);
			
			if (response.success) {
				// 登录成功，存储认证信息
				if (response as any) {
					console.log('Login response:', response);
					setAuthInfo({
						userId: (response as any).data.userId || '',
						token: (response as any).token,
						email: (response as any).data.email || formData.email,
					});
				}
				
				// 跳转到重定向URL或广场页
				router.push(redirectUrl);
			} else {
				setErrorMessage(response.message || response.error || t('auth.loginError'));
			}
		} catch (error) {
			console.error('Login error:', error);
			setErrorMessage(error instanceof Error ? error.message : t('auth.loginError'));
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
			<main className=" flex min-h-[100vh] w-full flex-col">
				{/* 使用公共头部组件 */}
				<Header
					showLanguage
				/>

				{/* 页面标题和返回按钮 */}
				<div className="flex items-center justify-between px-6 py-4">
					<h1 className="text-xl font-poppins text-[#11295b]">{t('auth.loginTitle')}</h1>
					<button 
						onClick={handleBack}
						className="text-[#11295b] hover:text-[#11295b]"
					>
						<ChevronLeft className="h-7 w-7" />
					</button>
				</div>

				{/* 登录表单 */}
				<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6 font-inter">
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
						<div className="relative font-inter">
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
						<div className="flex items-center gap-2 text-red-500 text-sm font-inter">
							<RefreshCw className="h-4 w-4" />
							<span>{errorMessage}</span>
						</div>
					)}

					{/* 登录按钮 */}
					<Button
						type="submit"
						className="w-full bg-[#11295b] text-white shadow-md rounded-lg font-nunito font-bold"
						size="lg"
						disabled={isSubmitting}
					>
						{isSubmitting ? t('auth.loginSubmitting') : t('auth.login')}
					</Button>

					{/* 忘记密码链接 */}
					<div className="text-center">
						<Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800 font-bold font-nunito">
							{t('auth.forgetPassword')}
						</Link>
					</div>

					{/* 创建新账户链接 */}
					<div className="text-center">
						<Link href="/register" className="text-sm text-gray-600 hover:text-gray-800 font-bold font-nunito">
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
