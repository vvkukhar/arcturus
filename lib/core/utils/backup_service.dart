// lib/core/utils/backup_service.dart

import 'dart:convert';

import 'package:lego_trading_manager/core/utils/file_exporter.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/market_repository.dart';
import 'package:lego_trading_manager/data/repositories/partout_repository.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';

class BackupService {
  static Future<void> createFullBackup() async {
    final payload = {
      'inventory':
          InventoryRepository().getAllItems().map((e) => e.toMap()).toList(),
      'purchases': PurchasesRepository()
          .getAllPurchases()
          .map((e) => e.toMap())
          .toList(),
      'sales': SalesRepository().getAllSales().map((e) => e.toMap()).toList(),
      'watchlist':
          WatchlistRepository().getAll().map((e) => e.toMap()).toList(),
      'market': MarketRepository().getAll().map((e) => e.toMap()).toList(),
      'partoutProjects':
          PartOutRepository().getAllProjects().map((e) => e.toMap()).toList(),
      'partoutLines': PartOutRepository()
          .getAllProjects()
          .expand((p) => PartOutRepository().getLinesByProjectId(p.id))
          .map((e) => e.toMap())
          .toList(),
      'createdAt': DateTime.now().toIso8601String(),
    };

    await FileExporter.exportText(
      filename: 'full_backup.json',
      content: const JsonEncoder.withIndent('  ').convert(payload),
    );
  }
}
