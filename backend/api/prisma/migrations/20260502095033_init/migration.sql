/*
  Warnings:

  - You are about to drop the column `storagePath` on the `InventoryImage` table. All the data in the column will be lost.
  - You are about to drop the column `acquiredAt` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `boxState` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `completenessPercent` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `extraCosts` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `instructionsState` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `externalRef` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `subtheme` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `extractedSetNo` on the `MarketListing` table. All the data in the column will be lost.
  - You are about to drop the column `normalizedTitle` on the `MarketListing` table. All the data in the column will be lost.
  - You are about to drop the column `selectedSource` on the `PurchaseFlowItem` table. All the data in the column will be lost.
  - You are about to drop the column `operatorNote` on the `UnresolvedMatchQueue` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetectedDeal` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceCode` to the `MarketListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `MarketListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MarketListing` table without a default value. This is not possible if the table is not empty.
  - Made the column `confidenceScore` on table `MarketSnapshot` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costBasis` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roiPercent` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Made the column `soldAt` on table `SoldComp` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DetectedDeal" DROP CONSTRAINT "DetectedDeal_listingId_fkey";

-- DropForeignKey
ALTER TABLE "DetectedDeal" DROP CONSTRAINT "DetectedDeal_watchlistItemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "MarketListing" DROP CONSTRAINT "MarketListing_itemId_fkey";

-- DropForeignKey
ALTER TABLE "MarketListing" DROP CONSTRAINT "MarketListing_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "UnresolvedMatchQueue" DROP CONSTRAINT "UnresolvedMatchQueue_listingId_fkey";

-- DropForeignKey
ALTER TABLE "WatchlistItem" DROP CONSTRAINT "WatchlistItem_itemId_fkey";

-- DropIndex
DROP INDEX "DecisionSnapshot_contextType_contextId_idx";

-- DropIndex
DROP INDEX "Item_createdAt_idx";

-- DropIndex
DROP INDEX "MarketListing_extractedSetNo_idx";

-- DropIndex
DROP INDEX "MarketListing_sourceId_externalListingId_key";

-- DropIndex
DROP INDEX "SoldComp_createdAt_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "DecisionSnapshot" ADD COLUMN     "executedAt" TIMESTAMP(3),
ADD COLUMN     "executionStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "ignoredAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryImage" DROP COLUMN "storagePath",
ADD COLUMN     "altText" TEXT;

-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "acquiredAt",
DROP COLUMN "boxState",
DROP COLUMN "completenessPercent",
DROP COLUMN "extraCosts",
DROP COLUMN "instructionsState",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "purchaseUrl" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "storageLocation" TEXT,
ADD COLUMN     "storageLocationId" TEXT,
ADD COLUMN     "warehouseId" TEXT,
ALTER COLUMN "condition" SET DEFAULT 'used',
ALTER COLUMN "sealed" SET DEFAULT false,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "externalRef",
DROP COLUMN "subtheme",
DROP COLUMN "year",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "conditionDefault" SET DEFAULT 'used';

-- AlterTable
ALTER TABLE "MarketListing" DROP COLUMN "extractedSetNo",
DROP COLUMN "normalizedTitle",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "sourceCode" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'UAH',
ALTER COLUMN "status" SET DEFAULT 'active',
ALTER COLUMN "fetchedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MarketSnapshot" ALTER COLUMN "scope" SET DEFAULT 'ua',
ALTER COLUMN "listingsCount" SET DEFAULT 0,
ALTER COLUMN "confidenceScore" SET NOT NULL,
ALTER COLUMN "confidenceScore" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "payloadJson" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseFlowItem" DROP COLUMN "selectedSource",
ADD COLUMN     "reason" TEXT,
ALTER COLUMN "selectedPrice" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "RepriceFlowItem" ADD COLUMN     "reason" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "ReviewFlowItem" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "buyerName" TEXT,
ADD COLUMN     "channel" TEXT,
ADD COLUMN     "costBasis" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "roiPercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ScanJob" ADD COLUMN     "errorMessage" TEXT,
ALTER COLUMN "query" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SoldComp" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'UAH',
ADD COLUMN     "itemId" TEXT,
ALTER COLUMN "soldAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "SourceRunLog" ALTER COLUMN "startedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'running';

-- AlterTable
ALTER TABLE "UnresolvedMatchQueue" DROP COLUMN "operatorNote",
ADD COLUMN     "resolutionNote" TEXT,
ADD COLUMN     "resolvedItemId" TEXT,
ALTER COLUMN "normalizedTitle" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "DetectedDeal";

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageLocation" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zone" TEXT,
    "shelf" TEXT,
    "box" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "warehouseId" TEXT,
    "fromStorageLocationId" TEXT,
    "toStorageLocationId" TEXT,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "watchlistItemId" TEXT,
    "inventoryItemId" TEXT,
    "assignedUserId" TEXT,
    "titleSnapshot" TEXT NOT NULL,
    "sourceCode" TEXT,
    "supplierName" TEXT,
    "sourceUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "plannedPrice" DOUBLE PRECISION,
    "actualPrice" DOUBLE PRECISION,
    "shippingPrice" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION,
    "targetSellPrice" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "condition" TEXT NOT NULL DEFAULT 'used',
    "sealed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "purchasedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "watchlistItemId" TEXT NOT NULL,
    "buyPrice" DOUBLE PRECISION NOT NULL,
    "targetSellPrice" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "roiPercent" DOUBLE PRECISION NOT NULL,
    "action" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "reserveRequestId" TEXT,
    "inventoryItemId" TEXT,
    "saleId" TEXT,
    "productTitle" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sellPrice" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "channel" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnRequest" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "orderId" TEXT,
    "inventoryItemId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "reason" TEXT,
    "refundAmount" DOUBLE PRECISION,
    "restock" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "adminNote" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReturnRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UAH',
    "description" TEXT,
    "inventoryItemId" TEXT,
    "purchaseOrderId" TEXT,
    "saleId" TEXT,
    "orderId" TEXT,
    "assignedUserId" TEXT,
    "incurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSnapshot" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupSnapshot" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'manual',
    "status" TEXT NOT NULL DEFAULT 'created',
    "payloadJson" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackupSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "payloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_token_key" ON "UserSession"("token");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- CreateIndex
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_code_key" ON "Warehouse"("code");

-- CreateIndex
CREATE INDEX "Warehouse_active_idx" ON "Warehouse"("active");

-- CreateIndex
CREATE INDEX "StorageLocation_warehouseId_idx" ON "StorageLocation"("warehouseId");

-- CreateIndex
CREATE INDEX "StorageLocation_active_idx" ON "StorageLocation"("active");

-- CreateIndex
CREATE INDEX "StorageLocation_zone_idx" ON "StorageLocation"("zone");

-- CreateIndex
CREATE UNIQUE INDEX "StorageLocation_warehouseId_code_key" ON "StorageLocation"("warehouseId", "code");

-- CreateIndex
CREATE INDEX "StockMovement_inventoryItemId_idx" ON "StockMovement"("inventoryItemId");

-- CreateIndex
CREATE INDEX "StockMovement_warehouseId_idx" ON "StockMovement"("warehouseId");

-- CreateIndex
CREATE INDEX "StockMovement_type_idx" ON "StockMovement"("type");

-- CreateIndex
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");

-- CreateIndex
CREATE INDEX "PurchaseOrder_itemId_idx" ON "PurchaseOrder"("itemId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_watchlistItemId_idx" ON "PurchaseOrder"("watchlistItemId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_inventoryItemId_idx" ON "PurchaseOrder"("inventoryItemId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_assignedUserId_idx" ON "PurchaseOrder"("assignedUserId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");

-- CreateIndex
CREATE INDEX "PurchaseOrder_sourceCode_idx" ON "PurchaseOrder"("sourceCode");

-- CreateIndex
CREATE INDEX "PurchaseOrder_createdAt_idx" ON "PurchaseOrder"("createdAt");

-- CreateIndex
CREATE INDEX "Deal_listingId_idx" ON "Deal"("listingId");

-- CreateIndex
CREATE INDEX "Deal_watchlistItemId_idx" ON "Deal"("watchlistItemId");

-- CreateIndex
CREATE INDEX "Deal_action_idx" ON "Deal"("action");

-- CreateIndex
CREATE INDEX "Deal_status_idx" ON "Deal"("status");

-- CreateIndex
CREATE INDEX "Deal_score_idx" ON "Deal"("score");

-- CreateIndex
CREATE INDEX "Deal_createdAt_idx" ON "Deal"("createdAt");

-- CreateIndex
CREATE INDEX "Order_reserveRequestId_idx" ON "Order"("reserveRequestId");

-- CreateIndex
CREATE INDEX "Order_inventoryItemId_idx" ON "Order"("inventoryItemId");

-- CreateIndex
CREATE INDEX "Order_saleId_idx" ON "Order"("saleId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "ReturnRequest_saleId_idx" ON "ReturnRequest"("saleId");

-- CreateIndex
CREATE INDEX "ReturnRequest_orderId_idx" ON "ReturnRequest"("orderId");

-- CreateIndex
CREATE INDEX "ReturnRequest_inventoryItemId_idx" ON "ReturnRequest"("inventoryItemId");

-- CreateIndex
CREATE INDEX "ReturnRequest_status_idx" ON "ReturnRequest"("status");

-- CreateIndex
CREATE INDEX "ReturnRequest_createdAt_idx" ON "ReturnRequest"("createdAt");

-- CreateIndex
CREATE INDEX "Expense_type_idx" ON "Expense"("type");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- CreateIndex
CREATE INDEX "Expense_inventoryItemId_idx" ON "Expense"("inventoryItemId");

-- CreateIndex
CREATE INDEX "Expense_purchaseOrderId_idx" ON "Expense"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "Expense_saleId_idx" ON "Expense"("saleId");

-- CreateIndex
CREATE INDEX "Expense_orderId_idx" ON "Expense"("orderId");

-- CreateIndex
CREATE INDEX "Expense_assignedUserId_idx" ON "Expense"("assignedUserId");

-- CreateIndex
CREATE INDEX "Expense_incurredAt_idx" ON "Expense"("incurredAt");

-- CreateIndex
CREATE INDEX "ReportSnapshot_type_idx" ON "ReportSnapshot"("type");

-- CreateIndex
CREATE INDEX "ReportSnapshot_periodStart_idx" ON "ReportSnapshot"("periodStart");

-- CreateIndex
CREATE INDEX "ReportSnapshot_periodEnd_idx" ON "ReportSnapshot"("periodEnd");

-- CreateIndex
CREATE INDEX "ReportSnapshot_createdAt_idx" ON "ReportSnapshot"("createdAt");

-- CreateIndex
CREATE INDEX "BackupSnapshot_type_idx" ON "BackupSnapshot"("type");

-- CreateIndex
CREATE INDEX "BackupSnapshot_status_idx" ON "BackupSnapshot"("status");

-- CreateIndex
CREATE INDEX "BackupSnapshot_createdAt_idx" ON "BackupSnapshot"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "DecisionSnapshot_contextType_idx" ON "DecisionSnapshot"("contextType");

-- CreateIndex
CREATE INDEX "DecisionSnapshot_contextId_idx" ON "DecisionSnapshot"("contextId");

-- CreateIndex
CREATE INDEX "DecisionSnapshot_action_idx" ON "DecisionSnapshot"("action");

-- CreateIndex
CREATE INDEX "DecisionSnapshot_score_idx" ON "DecisionSnapshot"("score");

-- CreateIndex
CREATE INDEX "DecisionSnapshot_executionStatus_idx" ON "DecisionSnapshot"("executionStatus");

-- CreateIndex
CREATE INDEX "InventoryItem_storageLocationId_idx" ON "InventoryItem"("storageLocationId");

-- CreateIndex
CREATE INDEX "InventoryItem_warehouseId_idx" ON "InventoryItem"("warehouseId");

-- CreateIndex
CREATE INDEX "InventoryItem_quantity_idx" ON "InventoryItem"("quantity");

-- CreateIndex
CREATE INDEX "InventoryItem_priority_idx" ON "InventoryItem"("priority");

-- CreateIndex
CREATE INDEX "Item_title_idx" ON "Item"("title");

-- CreateIndex
CREATE INDEX "MarketListing_sourceCode_idx" ON "MarketListing"("sourceCode");

-- CreateIndex
CREATE INDEX "MarketListing_price_idx" ON "MarketListing"("price");

-- CreateIndex
CREATE INDEX "MarketListing_lastSeenAt_idx" ON "MarketListing"("lastSeenAt");

-- CreateIndex
CREATE INDEX "MarketSnapshot_scope_idx" ON "MarketSnapshot"("scope");

-- CreateIndex
CREATE INDEX "Sale_itemId_idx" ON "Sale"("itemId");

-- CreateIndex
CREATE INDEX "SoldComp_externalId_idx" ON "SoldComp"("externalId");

-- CreateIndex
CREATE INDEX "SoldComp_itemId_idx" ON "SoldComp"("itemId");

-- CreateIndex
CREATE INDEX "SyncErrorLog_referenceId_idx" ON "SyncErrorLog"("referenceId");

-- CreateIndex
CREATE INDEX "UnresolvedMatchQueue_extractedSetNo_idx" ON "UnresolvedMatchQueue"("extractedSetNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_active_idx" ON "User"("active");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageLocation" ADD CONSTRAINT "StorageLocation_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "StorageLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_watchlistItemId_fkey" FOREIGN KEY ("watchlistItemId") REFERENCES "WatchlistItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketListing" ADD CONSTRAINT "MarketListing_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "MarketSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketListing" ADD CONSTRAINT "MarketListing_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionSnapshot" ADD CONSTRAINT "DecisionSnapshot_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MarketListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_watchlistItemId_fkey" FOREIGN KEY ("watchlistItemId") REFERENCES "WatchlistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_reserveRequestId_fkey" FOREIGN KEY ("reserveRequestId") REFERENCES "ReserveRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldComp" ADD CONSTRAINT "SoldComp_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReserveRequest" ADD CONSTRAINT "ReserveRequest_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
