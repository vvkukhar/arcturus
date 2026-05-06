-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'operator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "meta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "targetUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'set',
    "setNumber" TEXT,
    "externalRef" TEXT,
    "title" TEXT NOT NULL,
    "theme" TEXT,
    "subtheme" TEXT,
    "year" INTEGER,
    "conditionDefault" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "assignedUserId" TEXT,
    "titleSnapshot" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "completenessPercent" INTEGER NOT NULL,
    "sealed" BOOLEAN NOT NULL,
    "boxState" TEXT,
    "instructionsState" TEXT,
    "quantity" INTEGER NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "extraCosts" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "expectedSalePriceManual" DOUBLE PRECISION,
    "notes" TEXT,
    "acquiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryImage" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "assignedUserId" TEXT,
    "titleSnapshot" TEXT NOT NULL,
    "desiredBuyPrice" DOUBLE PRECISION NOT NULL,
    "maxBuyPrice" DOUBLE PRECISION NOT NULL,
    "targetSellPrice" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketSource" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'manual',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketListing" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "externalListingId" TEXT NOT NULL,
    "titleRaw" TEXT NOT NULL,
    "normalizedTitle" TEXT,
    "extractedSetNo" TEXT,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sellerName" TEXT,
    "sellerRating" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "shippingPrice" DOUBLE PRECISION,
    "shippingCurrency" TEXT,
    "country" TEXT,
    "condition" TEXT,
    "sealed" BOOLEAN,
    "completenessPercent" INTEGER,
    "quantityAvailable" INTEGER,
    "status" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketSnapshot" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "listingsCount" INTEGER NOT NULL,
    "lowestPrice" DOUBLE PRECISION,
    "lowestPriceWithShipping" DOUBLE PRECISION,
    "avgPrice" DOUBLE PRECISION,
    "medianPrice" DOUBLE PRECISION,
    "avgShipping" DOUBLE PRECISION,
    "minShipping" DOUBLE PRECISION,
    "maxShipping" DOUBLE PRECISION,
    "sealedAvgPrice" DOUBLE PRECISION,
    "usedAvgPrice" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionSnapshot" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "contextType" TEXT NOT NULL,
    "contextId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasonPrimary" TEXT NOT NULL,
    "reasonSecondary" TEXT,
    "payloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseFlowItem" (
    "id" TEXT NOT NULL,
    "watchlistItemId" TEXT NOT NULL,
    "selectedPrice" DOUBLE PRECISION NOT NULL,
    "selectedSource" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseFlowItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepriceFlowItem" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "currentPrice" DOUBLE PRECISION,
    "suggestedPrice" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepriceFlowItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewFlowItem" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewFlowItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetectedDeal" (
    "id" TEXT NOT NULL,
    "watchlistItemId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyPrice" DOUBLE PRECISION NOT NULL,
    "targetSellPrice" DOUBLE PRECISION,
    "roiPercent" DOUBLE PRECISION NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetectedDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "sellPrice" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoldComp" (
    "id" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "extractedSetNo" TEXT,
    "soldPrice" DOUBLE PRECISION NOT NULL,
    "soldAt" TIMESTAMP(3),
    "url" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoldComp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReserveRequest" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT,
    "productTitle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReserveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanJob" (
    "id" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceRunLog" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "itemsSeen" INTEGER NOT NULL DEFAULT 0,
    "itemsMatched" INTEGER NOT NULL DEFAULT 0,
    "itemsInserted" INTEGER NOT NULL DEFAULT 0,
    "itemsUpdated" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceRunLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncErrorLog" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "referenceId" TEXT,
    "sourceCode" TEXT,
    "message" TEXT NOT NULL,
    "detailsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnresolvedMatchQueue" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "titleRaw" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "extractedSetNo" TEXT,
    "suggestedItemId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "operatorNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnresolvedMatchQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Activity_action_idx" ON "Activity"("action");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_targetUserId_idx" ON "Notification"("targetUserId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Item_kind_idx" ON "Item"("kind");

-- CreateIndex
CREATE INDEX "Item_setNumber_idx" ON "Item"("setNumber");

-- CreateIndex
CREATE INDEX "Item_theme_idx" ON "Item"("theme");

-- CreateIndex
CREATE INDEX "Item_createdAt_idx" ON "Item"("createdAt");

-- CreateIndex
CREATE INDEX "InventoryItem_itemId_idx" ON "InventoryItem"("itemId");

-- CreateIndex
CREATE INDEX "InventoryItem_assignedUserId_idx" ON "InventoryItem"("assignedUserId");

-- CreateIndex
CREATE INDEX "InventoryItem_createdAt_idx" ON "InventoryItem"("createdAt");

-- CreateIndex
CREATE INDEX "InventoryImage_inventoryItemId_idx" ON "InventoryImage"("inventoryItemId");

-- CreateIndex
CREATE INDEX "InventoryImage_isPrimary_idx" ON "InventoryImage"("isPrimary");

-- CreateIndex
CREATE INDEX "InventoryImage_sortOrder_idx" ON "InventoryImage"("sortOrder");

-- CreateIndex
CREATE INDEX "WatchlistItem_itemId_idx" ON "WatchlistItem"("itemId");

-- CreateIndex
CREATE INDEX "WatchlistItem_assignedUserId_idx" ON "WatchlistItem"("assignedUserId");

-- CreateIndex
CREATE INDEX "WatchlistItem_active_idx" ON "WatchlistItem"("active");

-- CreateIndex
CREATE INDEX "WatchlistItem_priority_idx" ON "WatchlistItem"("priority");

-- CreateIndex
CREATE INDEX "WatchlistItem_createdAt_idx" ON "WatchlistItem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MarketSource_code_key" ON "MarketSource"("code");

-- CreateIndex
CREATE INDEX "MarketSource_enabled_idx" ON "MarketSource"("enabled");

-- CreateIndex
CREATE INDEX "MarketSource_type_idx" ON "MarketSource"("type");

-- CreateIndex
CREATE INDEX "MarketListing_sourceId_idx" ON "MarketListing"("sourceId");

-- CreateIndex
CREATE INDEX "MarketListing_itemId_idx" ON "MarketListing"("itemId");

-- CreateIndex
CREATE INDEX "MarketListing_externalListingId_idx" ON "MarketListing"("externalListingId");

-- CreateIndex
CREATE INDEX "MarketListing_extractedSetNo_idx" ON "MarketListing"("extractedSetNo");

-- CreateIndex
CREATE INDEX "MarketListing_status_idx" ON "MarketListing"("status");

-- CreateIndex
CREATE INDEX "MarketListing_fetchedAt_idx" ON "MarketListing"("fetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MarketListing_sourceId_externalListingId_key" ON "MarketListing"("sourceId", "externalListingId");

-- CreateIndex
CREATE INDEX "MarketSnapshot_itemId_idx" ON "MarketSnapshot"("itemId");

-- CreateIndex
CREATE INDEX "MarketSnapshot_computedAt_idx" ON "MarketSnapshot"("computedAt");

-- CreateIndex
CREATE INDEX "DecisionSnapshot_itemId_idx" ON "DecisionSnapshot"("itemId");

-- CreateIndex
CREATE INDEX "DecisionSnapshot_contextType_contextId_idx" ON "DecisionSnapshot"("contextType", "contextId");

-- CreateIndex
CREATE INDEX "DecisionSnapshot_createdAt_idx" ON "DecisionSnapshot"("createdAt");

-- CreateIndex
CREATE INDEX "PurchaseFlowItem_watchlistItemId_idx" ON "PurchaseFlowItem"("watchlistItemId");

-- CreateIndex
CREATE INDEX "PurchaseFlowItem_status_idx" ON "PurchaseFlowItem"("status");

-- CreateIndex
CREATE INDEX "PurchaseFlowItem_createdAt_idx" ON "PurchaseFlowItem"("createdAt");

-- CreateIndex
CREATE INDEX "RepriceFlowItem_inventoryItemId_idx" ON "RepriceFlowItem"("inventoryItemId");

-- CreateIndex
CREATE INDEX "RepriceFlowItem_status_idx" ON "RepriceFlowItem"("status");

-- CreateIndex
CREATE INDEX "RepriceFlowItem_createdAt_idx" ON "RepriceFlowItem"("createdAt");

-- CreateIndex
CREATE INDEX "ReviewFlowItem_inventoryItemId_idx" ON "ReviewFlowItem"("inventoryItemId");

-- CreateIndex
CREATE INDEX "ReviewFlowItem_status_idx" ON "ReviewFlowItem"("status");

-- CreateIndex
CREATE INDEX "ReviewFlowItem_createdAt_idx" ON "ReviewFlowItem"("createdAt");

-- CreateIndex
CREATE INDEX "DetectedDeal_watchlistItemId_idx" ON "DetectedDeal"("watchlistItemId");

-- CreateIndex
CREATE INDEX "DetectedDeal_listingId_idx" ON "DetectedDeal"("listingId");

-- CreateIndex
CREATE INDEX "DetectedDeal_roiPercent_idx" ON "DetectedDeal"("roiPercent");

-- CreateIndex
CREATE INDEX "DetectedDeal_action_idx" ON "DetectedDeal"("action");

-- CreateIndex
CREATE UNIQUE INDEX "DetectedDeal_watchlistItemId_listingId_key" ON "DetectedDeal"("watchlistItemId", "listingId");

-- CreateIndex
CREATE INDEX "Sale_inventoryItemId_idx" ON "Sale"("inventoryItemId");

-- CreateIndex
CREATE INDEX "Sale_createdAt_idx" ON "Sale"("createdAt");

-- CreateIndex
CREATE INDEX "SoldComp_sourceCode_idx" ON "SoldComp"("sourceCode");

-- CreateIndex
CREATE INDEX "SoldComp_extractedSetNo_idx" ON "SoldComp"("extractedSetNo");

-- CreateIndex
CREATE INDEX "SoldComp_soldAt_idx" ON "SoldComp"("soldAt");

-- CreateIndex
CREATE INDEX "SoldComp_createdAt_idx" ON "SoldComp"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SoldComp_sourceCode_externalId_key" ON "SoldComp"("sourceCode", "externalId");

-- CreateIndex
CREATE INDEX "ReserveRequest_inventoryItemId_idx" ON "ReserveRequest"("inventoryItemId");

-- CreateIndex
CREATE INDEX "ReserveRequest_status_idx" ON "ReserveRequest"("status");

-- CreateIndex
CREATE INDEX "ReserveRequest_createdAt_idx" ON "ReserveRequest"("createdAt");

-- CreateIndex
CREATE INDEX "ScanJob_sourceCode_idx" ON "ScanJob"("sourceCode");

-- CreateIndex
CREATE INDEX "ScanJob_status_idx" ON "ScanJob"("status");

-- CreateIndex
CREATE INDEX "ScanJob_createdAt_idx" ON "ScanJob"("createdAt");

-- CreateIndex
CREATE INDEX "SourceRunLog_sourceId_idx" ON "SourceRunLog"("sourceId");

-- CreateIndex
CREATE INDEX "SourceRunLog_startedAt_idx" ON "SourceRunLog"("startedAt");

-- CreateIndex
CREATE INDEX "SourceRunLog_status_idx" ON "SourceRunLog"("status");

-- CreateIndex
CREATE INDEX "SyncErrorLog_scope_idx" ON "SyncErrorLog"("scope");

-- CreateIndex
CREATE INDEX "SyncErrorLog_sourceCode_idx" ON "SyncErrorLog"("sourceCode");

-- CreateIndex
CREATE INDEX "SyncErrorLog_createdAt_idx" ON "SyncErrorLog"("createdAt");

-- CreateIndex
CREATE INDEX "UnresolvedMatchQueue_listingId_idx" ON "UnresolvedMatchQueue"("listingId");

-- CreateIndex
CREATE INDEX "UnresolvedMatchQueue_sourceCode_idx" ON "UnresolvedMatchQueue"("sourceCode");

-- CreateIndex
CREATE INDEX "UnresolvedMatchQueue_status_idx" ON "UnresolvedMatchQueue"("status");

-- CreateIndex
CREATE INDEX "UnresolvedMatchQueue_createdAt_idx" ON "UnresolvedMatchQueue"("createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryImage" ADD CONSTRAINT "InventoryImage_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketListing" ADD CONSTRAINT "MarketListing_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "MarketSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketListing" ADD CONSTRAINT "MarketListing_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketSnapshot" ADD CONSTRAINT "MarketSnapshot_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseFlowItem" ADD CONSTRAINT "PurchaseFlowItem_watchlistItemId_fkey" FOREIGN KEY ("watchlistItemId") REFERENCES "WatchlistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepriceFlowItem" ADD CONSTRAINT "RepriceFlowItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewFlowItem" ADD CONSTRAINT "ReviewFlowItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectedDeal" ADD CONSTRAINT "DetectedDeal_watchlistItemId_fkey" FOREIGN KEY ("watchlistItemId") REFERENCES "WatchlistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectedDeal" ADD CONSTRAINT "DetectedDeal_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MarketListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceRunLog" ADD CONSTRAINT "SourceRunLog_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "MarketSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnresolvedMatchQueue" ADD CONSTRAINT "UnresolvedMatchQueue_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MarketListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
