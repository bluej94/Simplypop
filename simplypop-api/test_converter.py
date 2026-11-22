"""
Test script for image converter
Run this to verify WebP conversion is working correctly
"""
from pathlib import Path
from image_converter import ImageConverter, convert_image_to_webp


def test_converter():
    """Test the image converter functionality"""

    print("=" * 60)
    print("Image Converter Test Suite")
    print("=" * 60)

    # Test 1: Check if ImageConverter class is accessible
    print("\n[Test 1] Checking ImageConverter class...")
    converter = ImageConverter()
    print("✓ ImageConverter class initialized successfully")

    # Test 2: Test filename conversion
    print("\n[Test 2] Testing filename conversion...")
    test_files = [
        "image.jpg",
        "photo.jpeg",
        "picture.png",
        "animation.gif"
    ]

    for filename in test_files:
        webp_name = converter.get_webp_filename(filename)
        expected = filename.replace('.jpg', '.webp').replace('.jpeg', '.webp').replace('.png', '.webp').replace('.gif', '.webp')
        assert webp_name == expected, f"Failed: {filename} -> {webp_name} (expected {expected})"
        print(f"  ✓ {filename} -> {webp_name}")

    # Test 3: Test size formatting
    print("\n[Test 3] Testing size formatting...")
    test_sizes = [
        (500, "500.0 B"),
        (1024, "1.0 KB"),
        (1048576, "1.0 MB"),
        (2097152, "2.0 MB"),
    ]

    for size_bytes, expected in test_sizes:
        formatted = converter.format_size(size_bytes)
        assert formatted == expected, f"Failed: {size_bytes} -> {formatted} (expected {expected})"
        print(f"  ✓ {size_bytes} bytes -> {formatted}")

    # Test 4: Test savings calculation
    print("\n[Test 4] Testing savings calculation...")
    original = 1000000  # 1MB
    new = 300000  # 300KB
    stats = converter.calculate_savings(original, new)

    print(f"  Original: {stats['original_size']}")
    print(f"  New: {stats['new_size']}")
    print(f"  Savings: {stats['savings_formatted']} ({stats['savings_percent']})")
    print(f"  Compression ratio: {stats['compression_ratio']}")

    assert stats['savings_percent'] == "70.0%", f"Savings calculation failed"
    print("  ✓ Savings calculation correct")

    print("\n" + "=" * 60)
    print("All tests passed! ✓")
    print("=" * 60)
    print("\nNote: To test actual image conversion, you'll need to:")
    print("1. Install Pillow: pip install Pillow")
    print("2. Upload an image through the gallery endpoint")
    print("3. Check the /app/simplypop/gallery directory for .webp files")
    print("\n")


if __name__ == "__main__":
    test_converter()
