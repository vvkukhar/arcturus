// lib/features/settings/application/export_bundle_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/market_repository.dart';
import 'package:lego_trading_manager/data/repositories/partout_repository.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/settings/application/export_bundle_model.dart';

final exportBundleProvider = Provider<List<ExportBundleModel>>((ref) {
  return [
    ExportBundleModel(
      title: 'Inventory',
      fileName: 'inventory.json',
      recordCount: InventoryRepository().getAllItems().length,
    ),
    ExportBundleModel(
      title: 'Purchases',
      fileName: 'purchases.json',
      recordCount: PurchasesRepository().getAllPurchases().length,
    ),
    ExportBundleModel(
      title: 'Sales',
      fileName: 'sales.json',
      recordCount: SalesRepository().getAllSales().length,
    ),
    ExportBundleModel(
      title: 'Market',
      fileName: 'market.json',
      recordCount: MarketRepository().getAll().length,
    ),
    ExportBundleModel(
      title: 'Part-out Projects',
      fileName: 'partout.json',
      recordCount: PartOutRepository().getAllProjects().length,
    ),
    ExportBundleModel(
      title: 'Watchlist',
      fileName: 'watchlist.json',
      recordCount: WatchlistRepository().getAll().length,
    ),
  ];
});
