"use client";

import { Button } from '../../../components/ui/button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { Header } from '../../../components/Header';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
	const { t } = useLanguage();
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
	};

	return (
		<main className="container-page flex min-h-dvh flex-col">
			{/* 使用公共头部组件 */}
			<Header 
				showBackButton 
				backUrl="/"
				title={t('auth.createAccount')}
				transparent
			/>

			{/* 注册表单 */}
			<form onSubmit={handleSubmit} className="flex-1 space-y-6">
				{/* 邮箱输入 */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-white">E-mail</label>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<input
							type="email"
							value={formData.email}
							onChange={(e) => setFormData({...formData, email: e.target.value})}
							placeholder="E-mail"
							className="w-full rounded-lg bg-card/60 px-10 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
							required
						/>
					</div>
				</div>

				{/* 密码输入 */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-white">Password</label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<input
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={(e) => setFormData({...formData, password: e.target.value})}
							placeholder="Password"
							className="w-full rounded-lg bg-card/60 px-10 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</div>

				{/* 确认密码输入 */}
				<div className="space-y-2">
					<label className="text-sm font-medium text-white">Confirm Password</label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<input
							type={showConfirmPassword ? "text" : "password"}
							value={formData.confirmPassword}
							onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
							placeholder="Confirm Password"
							className="w-full rounded-lg bg-card/60 px-10 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
							required
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
						>
							{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</div>

				{/* 错误信息 */}
				{formData.password !== formData.confirmPassword && formData.confirmPassword && (
					<div className="flex items-center gap-2 text-red-400 text-sm">
						<div className="h-2 w-2 rounded-full bg-red-400"></div>
						<span>Passwords do not match</span>
					</div>
				)}

				{/* 条款同意 */}
				<div className="flex items-start gap-3">
					<input
						type="checkbox"
						id="acceptTerms"
						checked={formData.acceptTerms}
						onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
						className="mt-1 h-4 w-4 rounded border-gray-300 bg-card text-primary focus:ring-primary/60"
					/>
					<label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
						Read and accept the{' '}
						<Link href="/terms" className="underline hover:text-white">terms of use</Link>
						{' '}and{' '}
						<Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
					</label>
				</div>

				{/* 提交按钮 */}
				<Button 
					type="submit" 
					className="w-full btn-gradient text-white shadow-md" 
					size="lg"
					disabled={!formData.acceptTerms}
				>
					Submit
				</Button>

				{/* 登录链接 */}
				<div className="text-center">
					<Link href="/login" className="text-sm text-muted-foreground hover:text-white underline">
						I already have an account
					</Link>
				</div>
			</form>

			{/* 页脚 */}
			<footer className="mt-auto text-center text-xs text-muted-foreground py-4">
				<LanguageSwitcher />
				<div className="mt-2">
					{t('footer.links.about')}  {t('footer.links.privacy')}  {t('footer.copyright')}
				</div>
			</footer>
		</main>
	);
}
