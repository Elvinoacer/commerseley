

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "_WishlistToproduct" DROP CONSTRAINT "_WishlistToproduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_WishlistToproduct" DROP CONSTRAINT "_WishlistToproduct_B_fkey";

-- Step 1: Add new columns as nullable first
ALTER TABLE "Wishlist" ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Wishlist" ADD COLUMN "productId" TEXT;
ALTER TABLE "Wishlist" ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Step 2: Set default values for existing records
-- For productId, we need to select an existing product ID
UPDATE "Wishlist" w
SET 
  "productId" = (SELECT id FROM "product" LIMIT 1),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "productId" IS NULL;

-- Step 3: Now make the columns required
ALTER TABLE "Wishlist" ALTER COLUMN "productId" SET NOT NULL;
ALTER TABLE "Wishlist" ALTER COLUMN "updatedAt" SET NOT NULL;

-- Step 4: Handle the many-to-many table migration
-- First get all existing wishlist-product relationships
CREATE TEMPORARY TABLE "temp_wishlist_products" AS
SELECT "_WishlistToproduct"."A" as "wishlistId", "_WishlistToproduct"."B" as "productId"
FROM "_WishlistToproduct";

-- Update the productId in Wishlist table with correct relationships
UPDATE "Wishlist" w
SET "productId" = twp."productId"
FROM "temp_wishlist_products" twp
WHERE w."id" = twp."wishlistId";

-- Clean up temporary table
DROP TABLE "temp_wishlist_products";

-- Step 5: Now drop the many-to-many table
DROP TABLE "_WishlistToproduct";

-- Step 6: Create indexes
CREATE UNIQUE INDEX "Wishlist_userId_productId_key" ON "Wishlist"("userId", "productId");
CREATE INDEX "product_categoryId_idx" ON "product"("categoryId");

-- Step 7: Add foreign key constraints with CASCADE
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" 
FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" 
FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;