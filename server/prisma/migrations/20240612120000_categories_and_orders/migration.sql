-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "servings" TEXT NOT NULL,
    "categoryId" TEXT,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Seed default categories
INSERT INTO "Category" ("id", "name", "slug", "createdAt", "updatedAt") VALUES
    ('seed_cat_wedding', 'Wedding', 'wedding', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_cat_birthday', 'Birthday', 'birthday', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_cat_seasonal', 'Seasonal', 'seasonal', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('seed_cat_custom', 'Custom', 'custom', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add categoryId to Cake and migrate from string column
ALTER TABLE "Cake" ADD COLUMN "categoryId" TEXT;

UPDATE "Cake" SET "categoryId" = 'seed_cat_wedding' WHERE "category" = 'Wedding';
UPDATE "Cake" SET "categoryId" = 'seed_cat_birthday' WHERE "category" = 'Birthday';
UPDATE "Cake" SET "categoryId" = 'seed_cat_seasonal' WHERE "category" = 'Seasonal';
UPDATE "Cake" SET "categoryId" = 'seed_cat_custom' WHERE "category" = 'Custom';

ALTER TABLE "Cake" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "Cake" DROP COLUMN "category";

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "Cake" ADD CONSTRAINT "Cake_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
