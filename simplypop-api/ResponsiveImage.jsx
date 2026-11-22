/**
 * ResponsiveImage Component
 *
 * Drop this file into: /home/jgijon/simplypop-web/src/components/ResponsiveImage.jsx
 *
 * Usage:
 * import ResponsiveImage from '../components/ResponsiveImage';
 *
 * <ResponsiveImage
 *   thumbnail={item.thumbnail_url}
 *   medium={item.medium_url}
 *   large={item.large_url}
 *   alt={item.title}
 *   variant="medium"
 * />
 */

import React, { useState } from 'react';

const ResponsiveImage = ({
  thumbnail,
  medium,
  large,
  alt = '',
  variant = 'medium', // 'thumbnail', 'medium', 'large', or 'auto'
  className = '',
  onClick,
  lazy = true,
  showLoadingState = true,
  showErrorState = true
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  /**
   * Get the primary image source based on variant
   */
  const getImageSrc = () => {
    switch (variant) {
      case 'thumbnail':
        return `${API_BASE_URL}${thumbnail}`;
      case 'medium':
        return `${API_BASE_URL}${medium}`;
      case 'large':
        return `${API_BASE_URL}${large}`;
      case 'auto':
      default:
        // Default to medium for best balance
        return `${API_BASE_URL}${medium}`;
    }
  };

  /**
   * Create srcSet for responsive images
   * Lets the browser choose the best image based on viewport
   */
  const getSrcSet = () => {
    if (variant !== 'auto') return undefined;

    return `
      ${API_BASE_URL}${thumbnail} 200w,
      ${API_BASE_URL}${medium} 800w,
      ${API_BASE_URL}${large} 2000w
    `.trim();
  };

  /**
   * Sizes attribute for responsive images
   */
  const getSizes = () => {
    if (variant !== 'auto') return undefined;

    return '(max-width: 640px) 200px, (max-width: 1024px) 800px, 2000px';
  };

  return (
    <div className="relative">
      {/* Loading Skeleton */}
      {showLoadingState && !imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}

      {/* Error State */}
      {showErrorState && imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center text-gray-400 p-4">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs sm:text-sm">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Responsive Image */}
      {!imageError && (
        <img
          src={getImageSrc()}
          srcSet={getSrcSet()}
          sizes={getSizes()}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          onClick={onClick}
          className={`${className} ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        />
      )}
    </div>
  );
};

export default ResponsiveImage;
