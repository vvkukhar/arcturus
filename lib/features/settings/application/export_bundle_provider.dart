import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/settings/application/export_bundle_model.dart';

final exportBundleProvider = Provider<List<ExportBundleModel>>((ref) {
  final inventoryCount = ref.watch(inventoryRepositoryProvider).getAllItems().length;
  final purchasesCount = ref.watch(purchasesRepositoryProvider).getAllPurchases().length;
  final salesCount = ref.watch(salesRepositoryProvider).getAllSales().length;
  final marketCount = ref.watch(marketRepositoryProvider).getAllSnapshots().length;
  final partOutCount = ref.watch(partOutRepositoryProvider).getAllProjects().length;
  final watchlistCount = ref.watch(watchlistRepositoryProvider).getAll().length;

  return [
    ExportBundleModel(title: 'Inventory Bundle', fileName: 'inventory.json', recordCount: inventoryCount),
    ExportBundleModel(title: 'Purchases Bundle', fileName: 'purchases.json', recordCount: purchasesCount),
    ExportBundleModel(title: 'Sales Bundle', fileName: 'sales.json', recordCount: salesCount),
    ExportBundleModel(title: 'Market Snapshots', fileName: 'market.json', recordCount: marketCount),
    ExportBundleModel(title: 'Part-Out Projects', fileName: 'partout.json', recordCount: partOutCount),
    ExportBundleModel(title: 'Watchlist Items', fileName: 'watchlist.json', recordCount: watchlistCount),
  ];
});