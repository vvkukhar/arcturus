import 'dart:convert';

import 'package:lego_trading_manager/core/storage/app_data_snapshot.dart';
import 'package:lego_trading_manager/core/storage/local_json_storage.dart';
import 'package:lego_trading_manager/core/storage/storage_keys.dart';

class AppDataBackupService {
  final LocalJsonStorage storage;

  const AppDataBackupService(this.storage);

  Future<AppDataSnapshot> exportSnapshot() async {
    return AppDataSnapshot(
      purchases: await storage.readList(StorageKeys.purchases),
      sales: await storage.readList(StorageKeys.sales),
      inventoryAllocations:
          await storage.readList(StorageKeys.inventoryAllocations),
      salePurchaseLinks: await storage.readList(StorageKeys.salePurchaseLinks),
    );
  }

  Future<String> exportJsonString() async {
    final snapshot = await exportSnapshot();
    return const JsonEncoder.withIndent('  ').convert(snapshot.toJson());
  }

  Future<void> importSnapshot(AppDataSnapshot snapshot) async {
    await storage.writeList(StorageKeys.purchases, snapshot.purchases);
    await storage.writeList(StorageKeys.sales, snapshot.sales);
    await storage.writeList(
      StorageKeys.inventoryAllocations,
      snapshot.inventoryAllocations,
    );
    await storage.writeList(
      StorageKeys.salePurchaseLinks,
      snapshot.salePurchaseLinks,
    );
  }

  Future<void> importJsonString(String raw) async {
    final decoded = jsonDecode(raw);

    if (decoded is! Map) {
      throw const FormatException('Backup JSON must be an object');
    }

    final snapshot = AppDataSnapshot.fromJson(
      Map<String, dynamic>.from(decoded),
    );

    await importSnapshot(snapshot);
  }

  Future<void> resetAll() async {
    await storage.clearKeys([
      StorageKeys.purchases,
      StorageKeys.sales,
      StorageKeys.inventoryAllocations,
      StorageKeys.salePurchaseLinks,
    ]);
  }
}