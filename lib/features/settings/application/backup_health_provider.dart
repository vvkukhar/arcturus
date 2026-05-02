import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/features/settings/application/backup_health_model.dart';

final backupHealthProvider = Provider<BackupHealthModel>((ref) {
  return BackupHealthModel(
    hasInventory: InventoryRepository().getAllItems().isNotEmpty,
    hasSales: SalesRepository().getAllSales().isNotEmpty,
    hasPurchases: PurchasesRepository().getAllPurchases().isNotEmpty,
  );
});