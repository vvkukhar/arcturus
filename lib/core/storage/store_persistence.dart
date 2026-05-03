import 'package:lego_trading_manager/core/storage/json_store.dart';
import 'package:lego_trading_manager/core/storage/storage_keys.dart';
import 'package:lego_trading_manager/core/utils/isolate_json_helper.dart';
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

class StorePersistence {
  StorePersistence._();

  static final StorePersistence instance = StorePersistence._();
  final JsonStore _store = const JsonStore();

  Future<void> bootstrap() async {
    await _loadInventory();
    await _loadPurchases();
    await _loadSales();
    await _loadMarket();
    await _loadWatchlist();
    await _loadPartOut();
  }

  Future<void> saveAll() async {
    await _saveList<ItemModel>(
      key: StorageKeys.inventory,
      items: InventoryMemoryStore.items,
      mapper: (e) => e.toMap(),
    );

    await _saveList<PurchaseModel>(
      key: StorageKeys.purchases,
      items: PurchasesMemoryStore.purchases,
      mapper: (e) => e.toMap(),
    );

    await _saveList<SaleModel>(
      key: StorageKeys.sales,
      items: SalesMemoryStore.sales,
      mapper: (e) => e.toMap(),
    );

    await _saveList<MarketSnapshotModel>(
      key: StorageKeys.marketSnapshots,
      items: MarketMemoryStore.snapshots,
      mapper: (e) => e.toMap(),
    );

    await _saveList<WatchlistItemModel>(
      key: StorageKeys.watchlist,
      items: WatchlistMemoryStore.items,
      mapper: (e) => e.toMap(),
    );

    await _saveList<PartOutProjectModel>(
      key: StorageKeys.partOutProjects,
      items: PartOutMemoryStore.projects,
      mapper: (e) => e.toMap(),
    );

    await _saveList<PartOutLineModel>(
      key: StorageKeys.partOutLines,
      items: PartOutMemoryStore.lines,
      mapper: (e) => e.toMap(),
    );
  }

  Future<void> clearAll() async {
    await _store.remove(StorageKeys.inventory);
    await _store.remove(StorageKeys.purchases);
    await _store.remove(StorageKeys.sales);
    await _store.remove(StorageKeys.marketSnapshots);
    await _store.remove(StorageKeys.watchlist);
    await _store.remove(StorageKeys.partOutProjects);
    await _store.remove(StorageKeys.partOutLines);
  }

  Future<void> _loadInventory() async {
    final raw = await _store.read(StorageKeys.inventory);
    if (raw == null || raw.trim().isEmpty) return;

    final decoded = await IsolateJsonHelper.decode(raw) as List<dynamic>;
    final items = decoded.map((e) => ItemModel.fromMap(Map<String, dynamic>.from(e as Map))).toList();

    InventoryMemoryStore.replaceAll(items);
  }

  Future<void> _loadPurchases() async {
    final raw = await _store.read(StorageKeys.purchases);
    if (raw == null || raw.trim().isEmpty) return;

    final decoded = await IsolateJsonHelper.decode(raw) as List<dynamic>;
    final items = decoded.map((e) => PurchaseModel.fromMap(Map<String, dynamic>.from(e as Map))).toList();

    PurchasesMemoryStore.replaceAll(items);
  }

  Future<void> _loadSales() async {
    final raw = await _store.read(StorageKeys.sales);
    if (raw == null || raw.trim().isEmpty) return;

    final decoded = await IsolateJsonHelper.decode(raw) as List<dynamic>;
    final items = decoded.map((e) => SaleModel.fromMap(Map<String, dynamic>.from(e as Map))).toList();

    SalesMemoryStore.replaceAll(items);
  }

  Future<void> _loadMarket() async {
    final raw = await _store.read(StorageKeys.marketSnapshots);
    if (raw == null || raw.trim().isEmpty) return;

    final decoded = await IsolateJsonHelper.decode(raw) as List<dynamic>;
    final items = decoded.map((e) => MarketSnapshotModel.fromMap(Map<String, dynamic>.from(e as Map))).toList();

    MarketMemoryStore.replaceAll(items);
  }

  Future<void> _loadWatchlist() async {
    final raw = await _store.read(StorageKeys.watchlist);
    if (raw == null || raw.trim().isEmpty) return;

    final decoded = await IsolateJsonHelper.decode(raw) as List<dynamic>;
    final items = decoded.map((e) => WatchlistItemModel.fromMap(Map<String, dynamic>.from(e as Map))).toList();

    WatchlistMemoryStore.replaceAll(items);
  }

  Future<void> _loadPartOut() async {
    final projectsRaw = await _store.read(StorageKeys.partOutProjects);
    final linesRaw = await _store.read(StorageKeys.partOutLines);

    final projects = (projectsRaw == null || projectsRaw.trim().isEmpty)
        ? <PartOutProjectModel>[]
        : ((await IsolateJsonHelper.decode(projectsRaw)) as List<dynamic>)
            .map((e) => PartOutProjectModel.fromMap(Map<String, dynamic>.from(e as Map)))
            .toList();

    final lines = (linesRaw == null || linesRaw.trim().isEmpty)
        ? <PartOutLineModel>[]
        : ((await IsolateJsonHelper.decode(linesRaw)) as List<dynamic>)
            .map((e) => PartOutLineModel.fromMap(Map<String, dynamic>.from(e as Map)))
            .toList();

    if (projects.isEmpty && lines.isEmpty) return;
    PartOutMemoryStore.replaceAll(projects: projects, lines: lines);
  }

  Future<void> _saveList<T>({
    required String key,
    required List<T> items,
    required Map<String, dynamic> Function(T item) mapper,
  }) async {
    final mappedData = items.map(mapper).toList();
    final raw = await IsolateJsonHelper.encode(mappedData);
    await _store.write(key, raw);
  }
}