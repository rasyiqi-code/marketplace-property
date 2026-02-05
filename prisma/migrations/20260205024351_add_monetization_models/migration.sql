/*
  Warnings:

  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `agentId` on the `Property` table. All the data in the column will be lost.
  - Made the column `userId` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Agent_email_key";

-- AlterTable
ALTER TABLE "PropertyImage" ADD COLUMN "hash" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Agent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AccountUpgradeRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "requestedType" TEXT NOT NULL,
    "currentType" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AccountUpgradeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListingPackage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "listingLimit" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL DEFAULT 30,
    "type" TEXT NOT NULL DEFAULT 'SUBSCRIPTION',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "snapToken" TEXT,
    "snapUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "ListingPackage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "area" REAL NOT NULL,
    "landArea" REAL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "latitude" REAL,
    "longitude" REAL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "certificate" TEXT,
    "condition" TEXT,
    "furnishing" TEXT,
    "floors" INTEGER,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mapsEmbed" TEXT,
    "videoUrl" TEXT,
    "virtualTourUrl" TEXT,
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "area", "bathrooms", "bedrooms", "certificate", "condition", "createdAt", "description", "featured", "floors", "furnishing", "id", "images", "landArea", "latitude", "location", "longitude", "price", "status", "title", "type", "updatedAt", "userId", "views") SELECT "address", "area", "bathrooms", "bedrooms", "certificate", "condition", "createdAt", "description", "featured", "floors", "furnishing", "id", "images", "landArea", "latitude", "location", "longitude", "price", "status", "title", "type", "updatedAt", "userId", "views" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bankAccount" TEXT,
    "bankHolder" TEXT,
    "bankName" TEXT,
    "whatsappMessage" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "company" TEXT,
    "photo" TEXT,
    "listingLimit" INTEGER NOT NULL DEFAULT 1,
    "packageExpiry" DATETIME
);
INSERT INTO "new_User" ("createdAt", "email", "id", "image", "name", "password", "phone", "role", "updatedAt") SELECT "createdAt", "email", "id", "image", "name", "password", "phone", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AccountUpgradeRequest_userId_idx" ON "AccountUpgradeRequest"("userId");

-- CreateIndex
CREATE INDEX "AccountUpgradeRequest_status_idx" ON "AccountUpgradeRequest"("status");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_packageId_idx" ON "Order"("packageId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");
