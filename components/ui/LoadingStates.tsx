/**
 * Loading and Error State Components
 * 加载和错误状态组件
 */

import { Button } from './button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  text = '加载中...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-[#101729] ${sizeClasses[size]} mb-2`}></div>
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorState({ 
  error, 
  onRetry, 
  retryText = '重试',
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-red-500 mb-4 text-center">{error}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {retryText}
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
