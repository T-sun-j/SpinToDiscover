"use client";

import { Button } from '../../../components/ui/button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		acceptTerms: false
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// 处理注册逻辑
		console.log('注册数据:', formData);

		// 注册成功后跳转到个人化页面
		router.push('/personalization');
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-white">
			<main className=" flex min-h-[100vh] flex-col">
				{/* 使用公共头部组件 */}
				<Header
					showLanguage
				/>

				{/* 页面标题 */}
				<div className="flex items-center justify-between px-6 py-4">
					<h1 className="text-xl font-semibold text-[#101729]">{t('auth.createAccount')}</h1>
					<button className="text-[#101729] hover:text-[#101729]">
						<Link href="/">
							<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</Link>
					</button>
				</div>

				{/* 注册表单 */}
				<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6">
					{/* 邮箱输入 */}
					<div className="space-y-2">
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type="email"
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

					{/* 确认密码输入 */}
					<div className="space-y-2">
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type={showConfirmPassword ? "text" : "password"}
								value={formData.confirmPassword}
								onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
								placeholder={t('auth.confirmPassword')}
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

					{/* 错误信息 */}
					{formData.password !== formData.confirmPassword && formData.confirmPassword && (
						<div className="flex items-center gap-2 text-red-500 text-sm">
							<div className="h-2 w-2 rounded-full bg-red-500"></div>
							<span>{t('auth.passwordsNotMatch')}</span>
						</div>
					)}

					{/* 条款同意 */}
					<div className="flex items-start gap-3">
						<input
							type="checkbox"
							id="acceptTerms"
							checked={formData.acceptTerms}
							onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
							className="mt-1 h-4 w-4 rounded border-gray-300 bg-white text-primary focus:ring-primary/60"
						/>
						<label htmlFor="acceptTerms" className="text-sm text-gray-600">
							{t('auth.acceptTerms')}{' '}
							<Link href="/terms" className="underline hover:text-gray-800">{t('auth.termsOfUse')}</Link>
							{' '}and{' '}
							<Link href="/privacy" className="underline hover:text-gray-800">{t('auth.privacyPolicy')}</Link>
						</label>
					</div>

					{/* 提交按钮 */}
					<Button
						type="submit"
						className="w-full bg-[#101729] text-white shadow-md rounded-lg"
						size="lg"
						disabled={!formData.acceptTerms}
					>
						{t('auth.submit')}
					</Button>

					{/* 登录链接 */}
					<div className="text-center">
						<Link href="/login" className="text-sm text-gray-600 hover:text-gray-800 font-bold ">
							{t('auth.alreadyHaveAccount')}
						</Link>
					</div>
				</form>

				{/* 使用公共页脚组件 */}
				<Footer />
			</main>
		</div>
	);
}
