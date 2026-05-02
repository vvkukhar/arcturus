import 'dart:convert';

import 'package:lego_trading_manager/core/utils/import_exception.dart';
import 'package:lego_trading_manager/core/utils/import_report.dart';
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

class BackupRestoreService {
  ImportReport importFullBackup(String jsonText) {
    final parsed = jsonDecode(jsonText);
    if (parsed is! Map) {
      throw const ImportException('Backup root must be an object');
    }

    final map = Map<String, dynamic>.from(parsed);

    final inventory = (map['inventory'] as List? ?? const [])
        .whereType<Map>()
        .map((e) => ItemModel.fromMap(Map<String, dynamic>.from(e)))
        .toList();

    final purchases = (map['purchases'] as List? ?? const [])
        .whereType<Map>()
        .map((e) => PurchaseModel.fromMap(Map<String, dynamic>.from(e)))
        .toList();

    final sales = (map['sales'] as List? ?? const [])
        .whereType<Map>()
        .map((e) => SaleModel.fromMap(Map<String, dynamic>.from(e)))
        .toList();

    final watchlist = (map['watchlist'] as List? ?? const [])
        .whereType<Map>()
        .map((e) => WatchlistItemModel.fromMap(Map<String, dynamic>.from(e)))
        .toList();

    final market = (map['market'] as List? ?? const [])
        .whereType<Map>()
        .map((e) => MarketSnapshotModel.fromMap(Map<String, dynamic>.from(e)))
        .toList();

    final projects = (map['partoutProjects'] as List? ?? const [])
        .whereType<Map>()
        .map((e) => PartOutProjectModel.fromMap(Map<String, dynamic>.from(e)))
        .toList();

    final lines = (map['partoutLines'] as List? ?? const [])
        .whereType<Map>()
        .map((e) => PartOutLineModel.fromMap(Map<String, dynamic>.from(e)))
        .toList();

    InventoryMemoryStore.replaceAll(inventory);
    PurchasesMemoryStore.replaceAll(purchases);
    SalesMemoryStore.replaceAll(sales);
    WatchlistMemoryStore.replaceAll(watchlist);
    MarketMemoryStore.replaceAll(market);
    PartOutMemoryStore.replaceAll(
      projects: projects,
      lines: lines,
    );

    return ImportReport(
      importedInventory: inventory.length,
      importedPurchases: purchases.length,
      importedSales: sales.length,
      importedWatchlist: watchlist.length,
      importedMarketSnapshots: market.length,
      importedPartOutProjects: projects.length,
      importedPartOutLines: lines.length,
    );
  }
}
