import type { Config } from 'tailwindcss';

export default {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./contexts/**/*.{js,ts,jsx,tsx,mdx}',
		'./lib/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				'poppins': ['var(--font-poppins)'],
				'inter': ['var(--font-inter)'],
				'nunito': ['var(--font-nunito)'],
			},
			colors: {
				background: 'hsl(var(--color-background))',
				foreground: 'hsl(var(--color-foreground))',
				card: 'hsl(var(--color-card))',
				'card-foreground': 'hsl(var(--color-card-foreground))',
				muted: 'hsl(var(--color-muted))',
				'muted-foreground': 'hsl(var(--color-muted-foreground))',
				primary: 'hsl(var(--color-primary))',
				'primary-foreground': 'hsl(var(--color-primary-foreground))',
				secondary: 'hsl(var(--color-secondary))',
				'secondary-foreground': 'hsl(var(--color-secondary-foreground))',
				border: 'hsl(var(--color-border))',
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
			},
		},
	},
	plugins: [],
} satisfies Config;
