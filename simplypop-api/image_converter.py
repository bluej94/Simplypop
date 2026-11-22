"""
Image Conversion Utility for WebP Optimization
Converts JPEG, JPG, and PNG images to WebP format with multiple size variants
"""
from pathlib import Path
from typing import Optional, Tuple, Dict, List
from PIL import Image
import os
from dataclasses import dataclass


@dataclass
class ImageVariant:
    """Configuration for an image size variant"""
    name: str
    max_dimension: int
    quality: int
    suffix: str  # Filename suffix (e.g., '_thumb', '_medium')


class ImageConverter:
    """Handles image conversion to WebP format with optimization and multiple size variants"""

    # Default WebP quality (0-100, higher = better quality but larger file)
    DEFAULT_QUALITY = 85

    # Predefined image variants
    VARIANTS = {
        'thumbnail': ImageVariant(name='thumbnail', max_dimension=300, quality=80, suffix='_thumb'),
        'medium': ImageVariant(name='medium', max_dimension=800, quality=85, suffix='_medium'),
        'large': ImageVariant(name='large', max_dimension=2000, quality=90, suffix='_large'),
        'original': ImageVariant(name='original', max_dimension=None, quality=95, suffix=''),
    }

    # Maximum dimension for single conversion (backwards compatibility)
    MAX_DIMENSION = 2000

    @staticmethod
    def convert_to_webp(
        source_path: Path,
        quality: int = DEFAULT_QUALITY,
        delete_original: bool = True,
        max_dimension: Optional[int] = MAX_DIMENSION
    ) -> Tuple[Path, int, int]:
        """
        Convert an image to WebP format

        Args:
            source_path: Path to the original image file
            quality: WebP quality (0-100, default 85)
            delete_original: Whether to delete the original file after conversion
            max_dimension: Maximum width or height (None to preserve original size)

        Returns:
            Tuple of (webp_path, original_size_bytes, new_size_bytes)

        Raises:
            FileNotFoundError: If source file doesn't exist
            ValueError: If file format is not supported
        """
        if not source_path.exists():
            raise FileNotFoundError(f"Source file not found: {source_path}")

        # Check if file is an image we want to convert
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        if source_path.suffix.lower() not in allowed_extensions:
            raise ValueError(f"Unsupported file type: {source_path.suffix}")

        # Get original file size
        original_size = source_path.stat().st_size

        # Open and process image
        with Image.open(source_path) as img:
            # Convert RGBA to RGB if necessary (WebP supports RGBA, but for consistency)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create a white background for transparency
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            # Resize if necessary
            if max_dimension:
                img = ImageConverter._resize_if_needed(img, max_dimension)

            # Generate WebP filename (replace extension)
            webp_path = source_path.with_suffix('.webp')

            # Save as WebP
            img.save(
                webp_path,
                'WEBP',
                quality=quality,
                method=6  # Slower compression but better quality/size ratio
            )

        # Get new file size
        new_size = webp_path.stat().st_size

        # Delete original if requested
        if delete_original and source_path.exists():
            source_path.unlink()

        return webp_path, original_size, new_size

    @staticmethod
    def _resize_if_needed(img: Image.Image, max_dimension: int) -> Image.Image:
        """
        Resize image if either dimension exceeds max_dimension
        Maintains aspect ratio
        """
        width, height = img.size

        if width <= max_dimension and height <= max_dimension:
            return img

        # Calculate new dimensions maintaining aspect ratio
        if width > height:
            new_width = max_dimension
            new_height = int((max_dimension / width) * height)
        else:
            new_height = max_dimension
            new_width = int((max_dimension / height) * width)

        return img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    @staticmethod
    def convert_to_webp_variants(
        source_path: Path,
        variants: Optional[List[str]] = None,
        delete_original: bool = True
    ) -> Dict[str, Dict]:
        """
        Convert an image to multiple WebP variants (thumbnail, medium, large, original)

        Args:
            source_path: Path to the original image file
            variants: List of variant names to generate (default: ['thumbnail', 'medium', 'large'])
                     Options: 'thumbnail', 'medium', 'large', 'original'
            delete_original: Whether to delete the original file after conversion

        Returns:
            Dictionary mapping variant names to their details:
            {
                'thumbnail': {
                    'path': Path,
                    'url': str,
                    'size': int,
                    'dimensions': (width, height)
                },
                ...
            }

        Raises:
            FileNotFoundError: If source file doesn't exist
            ValueError: If file format is not supported
        """
        if not source_path.exists():
            raise FileNotFoundError(f"Source file not found: {source_path}")

        # Check if file is an image we want to convert
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        if source_path.suffix.lower() not in allowed_extensions:
            raise ValueError(f"Unsupported file type: {source_path.suffix}")

        # Default to all variants except original
        if variants is None:
            variants = ['thumbnail', 'medium', 'large']

        # Validate variants
        for variant_name in variants:
            if variant_name not in ImageConverter.VARIANTS:
                raise ValueError(f"Unknown variant: {variant_name}. Available: {list(ImageConverter.VARIANTS.keys())}")

        # Get original file size
        original_size = source_path.stat().st_size

        results = {}

        # Open image once and create all variants
        with Image.open(source_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            # Create each variant
            for variant_name in variants:
                variant = ImageConverter.VARIANTS[variant_name]

                # Resize if needed
                variant_img = img.copy()
                if variant.max_dimension:
                    variant_img = ImageConverter._resize_if_needed(variant_img, variant.max_dimension)

                # Generate WebP filename with suffix
                base_name = source_path.stem
                webp_filename = f"{base_name}{variant.suffix}.webp"
                webp_path = source_path.parent / webp_filename

                # Save as WebP
                variant_img.save(
                    webp_path,
                    'WEBP',
                    quality=variant.quality,
                    method=6
                )

                # Get file info
                file_size = webp_path.stat().st_size
                dimensions = variant_img.size

                # Generate URL path
                parent_name = webp_path.parent.name
                url = f"/{parent_name}/{webp_filename}"

                results[variant_name] = {
                    'path': webp_path,
                    'url': url,
                    'size': file_size,
                    'size_formatted': ImageConverter.format_size(file_size),
                    'dimensions': dimensions,
                    'quality': variant.quality
                }

        # Delete original if requested
        if delete_original and source_path.exists():
            source_path.unlink()

        # Add original file stats for comparison
        results['_stats'] = {
            'original_size': original_size,
            'original_size_formatted': ImageConverter.format_size(original_size),
            'total_variants': len(variants),
            'total_size': sum(v['size'] for v in results.values() if isinstance(v, dict) and 'size' in v),
        }

        return results

    @staticmethod
    def get_webp_filename(original_filename: str) -> str:
        """
        Convert a filename to WebP extension

        Args:
            original_filename: Original filename (e.g., "image.jpg")

        Returns:
            Filename with .webp extension (e.g., "image.webp")
        """
        return Path(original_filename).with_suffix('.webp').name

    @staticmethod
    def format_size(size_bytes: int) -> str:
        """
        Format file size in human-readable format

        Args:
            size_bytes: Size in bytes

        Returns:
            Formatted string (e.g., "1.5 MB")
        """
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.1f} TB"

    @staticmethod
    def calculate_savings(original_size: int, new_size: int) -> dict:
        """
        Calculate size reduction statistics

        Args:
            original_size: Original file size in bytes
            new_size: New file size in bytes

        Returns:
            Dictionary with savings information
        """
        savings_bytes = original_size - new_size
        savings_percent = (savings_bytes / original_size) * 100 if original_size > 0 else 0

        return {
            'original_size': ImageConverter.format_size(original_size),
            'new_size': ImageConverter.format_size(new_size),
            'savings_bytes': savings_bytes,
            'savings_formatted': ImageConverter.format_size(savings_bytes),
            'savings_percent': f"{savings_percent:.1f}%",
            'compression_ratio': f"{(new_size / original_size * 100):.1f}%" if original_size > 0 else "0%"
        }


def convert_image_to_webp(
    file_path: Path,
    quality: int = 85,
    delete_original: bool = True
) -> Tuple[str, dict]:
    """
    Convenience function to convert an image to WebP and return the new URL path
    (Legacy function - consider using convert_image_to_webp_variants for multiple sizes)

    Args:
        file_path: Path to the image file
        quality: WebP quality (0-100)
        delete_original: Whether to delete the original file

    Returns:
        Tuple of (new_url_path, savings_stats)

    Example:
        new_url, stats = convert_image_to_webp(
            Path("/app/simplypop/gallery/gallery_20241020_abc123.jpg")
        )
        # Returns: ("/gallery/gallery_20241020_abc123.webp", {...})
    """
    converter = ImageConverter()
    webp_path, original_size, new_size = converter.convert_to_webp(
        file_path,
        quality=quality,
        delete_original=delete_original
    )

    # Generate URL path (extract the directory and filename)
    # Assumes structure like /app/simplypop/gallery/filename.webp -> /gallery/filename.webp
    filename = webp_path.name
    parent_name = webp_path.parent.name  # 'gallery' or 'client'
    new_url = f"/{parent_name}/{filename}"

    # Calculate savings stats
    savings_stats = ImageConverter.calculate_savings(original_size, new_size)

    return new_url, savings_stats


def convert_image_to_webp_variants(
    file_path: Path,
    variants: Optional[List[str]] = None,
    delete_original: bool = True
) -> Dict[str, Dict]:
    """
    Convert an image to multiple WebP variants (thumbnail, medium, large)

    Args:
        file_path: Path to the image file
        variants: List of variant names to generate (default: ['thumbnail', 'medium', 'large'])
                 Options: 'thumbnail' (200px), 'medium' (800px), 'large' (2000px), 'original' (no resize)
        delete_original: Whether to delete the original file

    Returns:
        Dictionary with variant information and statistics:
        {
            'thumbnail': {'url': str, 'path': Path, 'size': int, 'dimensions': (w, h), 'quality': int},
            'medium': {...},
            'large': {...},
            '_stats': {'original_size': int, 'total_variants': int, ...}
        }

    Example:
        results = convert_image_to_webp_variants(
            Path("/app/simplypop/gallery/gallery_20241020_abc123.jpg")
        )
        thumb_url = results['thumbnail']['url']
        # Returns: "/gallery/gallery_20241020_abc123_thumb.webp"
        large_url = results['large']['url']
        # Returns: "/gallery/gallery_20241020_abc123_large.webp"
    """
    converter = ImageConverter()
    return converter.convert_to_webp_variants(
        file_path,
        variants=variants,
        delete_original=delete_original
    )
