// lib/data/store/store_persistence_manager.dart

import 'package:lego_trading_manager/data/persistence/persisted_inventory_store.dart';
import 'package:lego_trading_manager/data/persistence/persisted_market_store.dart';
import 'package:lego_trading_manager/data/persistence/persisted_partout_lines_store.dart';
import 'package:lego_trading_manager/data/persistence/persisted_partout_projects_store.dart';
import 'package:lego_trading_manager/data/persistence/persisted_purchases_store.dart';
import 'package:lego_trading_manager/data/persistence/persisted_sales_store.dart';
import 'package:lego_trading_manager/data/persistence/persisted_watchlist_store.dart';
import 'package:lego_trading_manager/data/store/inventory_memory_store.dart';
import 'package:lego_trading_manager/data/store/market_memory_store.dart';
import 'package:lego_trading_manager/data/store/partout_memory_store.dart';
import 'package:lego_trading_manager/data/store/purchases_memory_store.dart';
import 'package:lego_trading_manager/data/store/sales_memory_store.dart';
import 'package:lego_trading_manager/data/store/watchlist_memory_store.dart';

class StorePersistenceManager {
  final PersistedInventoryStore inventoryStore = PersistedInventoryStore();
  final PersistedPurchasesStore purchasesStore = PersistedPurchasesStore();
  final PersistedSalesStore salesStore = PersistedSalesStore();
  final PersistedWatchlistStore watchlistStore = PersistedWatchlistStore();
  final PersistedMarketStore marketStore = PersistedMarketStore();
  final PersistedPartOutProjectsStore partOutProjectsStore =
      PersistedPartOutProjectsStore();
  final PersistedPartOutLinesStore partOutLinesStore =
      PersistedPartOutLinesStore();

  Future<void> bootstrap() async {
    final inventory = await inventoryStore.load();
    if (inventory.isNotEmpty) {
      InventoryMemoryStore.replaceAll(inventory);
    }

    final purchases = await purchasesStore.load();
    if (purchases.isNotEmpty) {
      PurchasesMemoryStore.replaceAll(purchases);
    }

    final sales = await salesStore.load();
    if (sales.isNotEmpty) {
      SalesMemoryStore.replaceAll(sales);
    }

    final watchlist = await watchlistStore.load();
    if (watchlist.isNotEmpty) {
      WatchlistMemoryStore.replaceAll(watchlist);
    }

    final market = await marketStore.load();
    if (market.isNotEmpty) {
      MarketMemoryStore.replaceAll(market);
    }

    final projects = await partOutProjectsStore.load();
    final lines = await partOutLinesStore.load();
    if (projects.isNotEmpty || lines.isNotEmpty) {
      PartOutMemoryStore.replaceAll(
        projects: projects,
        lines: lines,
      );
    }
  }

  Future<void> persistAll() async {
    await inventoryStore.save(InventoryMemoryStore.items);
    await purchasesStore.save(PurchasesMemoryStore.purchases);
    await salesStore.save(SalesMemoryStore.sales);
    await watchlistStore.save(WatchlistMemoryStore.items);
    await marketStore.save(MarketMemoryStore.snapshots);
    await partOutProjectsStore.save(PartOutMemoryStore.projects);
    await partOutLinesStore.save(PartOutMemoryStore.lines);
  }

  Future<void> clearAll() async {
    await inventoryStore.clear();
    await purchasesStore.clear();
    await salesStore.clear();
    await watchlistStore.clear();
    await marketStore.clear();
    await partOutProjectsStore.clear();
    await partOutLinesStore.clear();
  }
}
