/**
 * Optimized Image Component
 * 优化的图片组件
 */

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/img/band.png',
  loading = 'lazy',
  onError,
  onLoad,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setImageLoading(false);
    onLoad?.();
  };

  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}

interface ImageGalleryProps {
  images: string[];
  className?: string;
  imageClassName?: string;
  maxImages?: number;
}

export function ImageGallery({
  images,
  className = '',
  imageClassName = 'w-full h-64 object-cover rounded-lg',
  maxImages = 5,
}: ImageGalleryProps) {
  const displayImages = images.slice(0, maxImages);
  const remainingCount = images.length - maxImages;

  return (
    <div className={`space-y-2 ${className}`}>
      {displayImages.map((image, index) => (
        <OptimizedImage
          key={index}
          src={image}
          alt={`Gallery image ${index + 1}`}
          className={imageClassName}
        />
      ))}
      {remainingCount > 0 && (
        <div className="text-center text-gray-500 text-sm">
          还有 {remainingCount} 张图片
        </div>
      )}
    </div>
  );
}
