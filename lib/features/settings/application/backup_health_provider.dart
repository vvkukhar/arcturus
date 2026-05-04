// lib/features/settings/application/backup_health_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/settings/application/backup_health_model.dart';

final backupHealthProvider = Provider<BackupHealthModel>((ref) {
  final inventory = ref.watch(inventoryRepositoryProvider).getAllItems();
  final sales = ref.watch(salesRepositoryProvider).getAllSales();
  final purchases = ref.watch(purchasesRepositoryProvider).getAllPurchases();

  return BackupHealthModel(
    hasInventory: inventory.isNotEmpty,
    hasSales: sales.isNotEmpty,
    hasPurchases: purchases.isNotEmpty,
  );
});