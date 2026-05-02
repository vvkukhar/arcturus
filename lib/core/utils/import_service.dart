// lib/core/utils/import_service.dart

import 'dart:convert';

import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/data/store/inventory_memory_store.dart';
import 'package:lego_trading_manager/data/store/market_memory_store.dart';
import 'package:lego_trading_manager/data/store/partout_memory_store.dart';
import 'package:lego_trading_manager/data/store/purchases_memory_store.dart';
import 'package:lego_trading_manager/data/store/sales_memory_store.dart';
import 'package:lego_trading_manager/data/store/watchlist_memory_store.dart';

class ImportReport {
  final int totalImported;

  const ImportReport({
    required this.totalImported,
  });
}

class ImportService {
  static Future<ImportReport> importFromJsonText(String raw) async {
    final decoded = jsonDecode(raw) as Map<String, dynamic>;

    final inventory = ((decoded['inventory'] ?? []) as List)
        .map((e) => ItemModel.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();

    final purchases = ((decoded['purchases'] ?? []) as List)
        .map((e) => PurchaseModel.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();

    final sales = ((decoded['sales'] ?? []) as List)
        .map((e) => SaleModel.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();

    final watchlist = ((decoded['watchlist'] ?? []) as List)
        .map((e) =>
            WatchlistItemModel.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();

    final market = ((decoded['market'] ?? []) as List)
        .map((e) =>
            MarketSnapshotModel.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();

    final projects = ((decoded['partoutProjects'] ?? []) as List)
        .map((e) =>
            PartOutProjectModel.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();

    final lines = ((decoded['partoutLines'] ?? []) as List)
        .map((e) =>
            PartOutLineModel.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();

    InventoryMemoryStore.replaceAll(inventory);
    PurchasesMemoryStore.replaceAll(purchases);
    SalesMemoryStore.replaceAll(sales);
    WatchlistMemoryStore.replaceAll(watchlist);
    MarketMemoryStore.replaceAll(market);
    PartOutMemoryStore.replaceAll(projects: projects, lines: lines);

    final totalImported = inventory.length +
        purchases.length +
        sales.length +
        watchlist.length +
        market.length +
        projects.length +
        lines.length;

    return ImportReport(totalImported: totalImported);
  }
}
