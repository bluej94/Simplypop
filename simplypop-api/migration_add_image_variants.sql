-- Migration: Add Image Variant Columns to Gallery Table
-- Date: 2025-11-04
-- Description: Adds thumbnail_url, medium_url, and large_url columns to support multiple image sizes

-- Step 1: Add new columns
ALTER TABLE gallery
ADD COLUMN thumbnail_url VARCHAR(255),
ADD COLUMN medium_url VARCHAR(255),
ADD COLUMN large_url VARCHAR(255);

-- Step 2: Set defaults for existing records (backward compatibility)
-- This ensures old records still work by using image_url as fallback
UPDATE gallery
SET thumbnail_url = image_url,
    medium_url = image_url,
    large_url = image_url
WHERE thumbnail_url IS NULL;

-- Step 3: Verify the changes
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'gallery'
  AND column_name IN ('image_url', 'thumbnail_url', 'medium_url', 'large_url')
ORDER BY column_name;

-- Expected output:
-- column_name    | data_type      | character_maximum_length | is_nullable
-- ---------------|----------------|--------------------------|------------
-- image_url      | varchar        | 255                      | YES
-- large_url      | varchar        | 255                      | YES
-- medium_url     | varchar        | 255                      | YES
-- thumbnail_url  | varchar        | 255                      | YES

-- Step 4: Test the migration
-- Check a sample record to ensure it has all variant URLs
SELECT id, title, image_url, thumbnail_url, medium_url, large_url
FROM gallery
LIMIT 1;

-- All done! Your database is now ready for multi-variant images.
