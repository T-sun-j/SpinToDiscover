"use client";

import { Button } from '../../../components/ui/button';
import { Mail, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../../lib/auth';
import { RegisterRequest } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function RegisterPage() {
	const { t } = useLanguage();
	const router = useRouter();
	const { setAuthInfo } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		acceptTerms: false
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [userLocation, setUserLocation] = useState('');
	const [isGettingLocation, setIsGettingLocation] = useState(false);

	// 获取用户位置
	const getUserLocation = async () => {
		if (!navigator.geolocation) {
			console.log('Geolocation is not supported by this browser.');
			setUserLocation('');
			return;
		}

		setIsGettingLocation(true);

		try {
			const position = await new Promise<GeolocationPosition>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000 // 5分钟缓存
				});
			});

			const { latitude, longitude } = position.coords;
			
			// 使用反向地理编码获取地址信息
			try {
				const response = await fetch(
					`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
				);
				const data = await response.json();
				
				if (data.city && data.countryName) {
					setUserLocation(`${data.city}, ${data.countryName}`);
				} else if (data.locality && data.countryName) {
					setUserLocation(`${data.locality}, ${data.countryName}`);
				} else {
					setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
				}
			} catch (geocodeError) {
				// 如果反向地理编码失败，使用坐标
				setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
			}
		} catch (error) {
			console.log('Error getting location:', error);
			// 用户拒绝授权或其他错误，设置为空值
			setUserLocation('');
		} finally {
			setIsGettingLocation(false);
		}
	};

	// 组件挂载时获取位置
	useEffect(() => {
		getUserLocation();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess(false);
		setIsLoading(true);

		try {
			// 验证密码匹配
			if (formData.password !== formData.confirmPassword) {
				setError(t('auth.passwordMismatch') as string);
				setIsLoading(false);
				return;
			}

			// 准备注册数据
			const registerData: RegisterRequest = {
				email: formData.email,
				password: formData.password,
				language: 'en', // 可以根据用户选择设置
				acceptTerms: formData.acceptTerms,
				location: userLocation || '', // 使用获取到的用户位置，如果为空则传空字符串
			};

			// 调用注册API
			const response = await registerUser(registerData);
			
			if (response.success && response.data) {
				// 注册成功，存储认证信息
				const authData = {
					userId: response.data.userId,
					token: response.data.token,
					email: response.data.email
				};
				
				// 存储到AuthContext（会自动存储到localStorage和cookie）
				setAuthInfo(authData);
				
				// 显示成功消息
				setSuccess(true);
				setIsLoading(false);
				
				// 延迟跳转到个人化页面，让用户看到成功消息
				setTimeout(() => {
					router.push('/personalization?from=register');
				}, 2000);
			} else {
				setError(response.message || t('auth.registerErrorMessage'));
			}
		} catch (error) {
			setError(error instanceof Error ? error.message : t('auth.registerError'));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-white">
			<main className="w-full flex min-h-[100vh] flex-col">
				{/* 使用公共头部组件 */}
				<Header/>

				{/* 页面标题 */}
				<div className="flex items-center justify-between px-4 py-4 z-100">
					<h1 className="text-xl font-poppins text-[#0F1728] font-semibold">{t('auth.createAccount')}</h1>
					<button className="text-[#0F1728] hover:text-[#0F1728]">
						<Link href="/">
							<ChevronLeft className="h-7 w-7" />
						</Link>
					</button>
				</div>

				{/* 注册表单 */}
				<form onSubmit={handleSubmit} className="flex-1 space-y-6 px-4">
					{/* 邮箱输入 */}
					<div className="space-y-2">
						<div className="relative font-inter">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<input
								type="email"
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								placeholder={t('auth.email') as string}
								className="w-full rounded-full bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
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
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								placeholder={t('auth.password') as string}
								className="w-full rounded-full bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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
								onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
								placeholder={t('auth.confirmPassword') as string}
								className="w-full rounded-full bg-gray-100 px-10 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
								required
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
							</button>
						</div>
					</div>

					{/* 错误信息 */}
					{formData.password !== formData.confirmPassword && formData.confirmPassword && (
						<div className="flex items-center gap-2 text-red-500 text-sm font-inter">
							<div className="h-2 w-2 rounded-full bg-red-500"></div>
							<span>{t('auth.passwordsNotMatch')}</span>
						</div>
					)}
					
					{/* API错误信息 */}
					{error && (
						<div className="flex items-center gap-2 text-red-500 text-sm font-inter">
							<div className="h-2 w-2 rounded-full bg-red-500"></div>
							<span>{error}</span>
						</div>
					)}

					{/* 成功信息 */}
					{/* {success && (
						<div className="flex items-center justify-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm font-inter">
							<svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
							<div className="text-center">
								<div className="font-semibold">{t('auth.registerSuccess')}</div>
								<div className="flex items-center justify-center gap-2 text-xs text-green-600 mt-1">
									<svg className="h-3 w-3 animate-spin text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
									</svg>
									{t('auth.registerSuccess')}
								</div>
							</div>
						</div>
					)} */}

					{/* 位置状态信息（使用小图标展示） */}
					{isGettingLocation && (
						<div className="flex items-center gap-2 text-blue-500 text-sm font-inter">
							<svg className="h-4 w-4 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
							</svg>
							<span>{t('auth.gettingLocation')}</span>
						</div>
					)}
					
					{!isGettingLocation && userLocation && (
						<div className="flex items-center gap-2 text-green-500 text-sm font-inter">
							<svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
							</svg>
							<span>{t('auth.defaultLocation')}: {userLocation}</span>
						</div>
					)}
					
					{!isGettingLocation && !userLocation && (
						<div className="flex items-center gap-2 text-gray-500 text-sm font-inter">
							<svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
								<line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
							</svg>
							<span>{t('auth.locationPermissionDenied')}</span>
						</div>
					)}

					{/* 条款同意 */}
					<div className="flex items-start gap-3">
						<label className="relative h-4 w-4 flex items-center">
							<input
								type="checkbox"
								id="acceptTerms"
								checked={formData.acceptTerms}
								onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
								className="peer h-4 w-4 appearance-none border-1 rounded border-gray-300 text-primary focus:ring-primary/60 checked:border-[#11295b] outline-none"
							/>
							<span className={
								"pointer-events-none absolute left-0 top-0 h-4 w-4 flex items-center justify-center " +
								(formData.acceptTerms ? "" : "hidden")
							}>
								{/* Checkmark SVG */}
								<svg className="h-3 w-3 text-[#11295b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
								</svg>
							</span>
						</label>
						<label htmlFor="acceptTerms" className="text-sm text-gray-600 font-inter text-[12px]">
							{t('auth.acceptTerms')}{' '}
							<Link href="/about" className="underline hover:text-gray-800">{t('auth.termsOfUse')}</Link>
							{' '}{t('auth.termsAnd')}{' '}
							<Link href="/privacy" className="underline hover:text-gray-800">{t('auth.privacyPolicy')}</Link>
						</label>
					</div>

					{/* 提交按钮 */}
					<Button
						type="submit"
						className={`w-full shadow-md rounded-lg text-[17px] font-poppins font-semibold ${
							success 
								? 'bg-green-500 text-white' 
								: 'bg-[#11295b] text-white'
						}`}
						size="lg"
						disabled={!formData.acceptTerms || isLoading || success}
					>
						{success ? t('auth.registerSuccess') : 
						 isLoading ? t('auth.registerSubmitting') : 
						 t('auth.submit')}
					</Button>

					{/* 登录链接 */}
					<div className="text-center">
						<Link href="/login" className="text-sm text-[#0F1728] font-semibold font-poppins">
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
