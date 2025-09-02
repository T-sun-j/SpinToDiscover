import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 btn-ring",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:opacity-90",
				outline: "border bg-transparent hover:bg-secondary/40",
				ghost: "hover:bg-secondary/50",
				gradient: "btn-gradient text-white",
			},
			size: {
				default: "h-11 px-5",
				sm: "h-9 px-4 text-xs",
				lg: "h-12 px-6 text-base",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
		);
	}
);
Button.displayName = 'Button';
