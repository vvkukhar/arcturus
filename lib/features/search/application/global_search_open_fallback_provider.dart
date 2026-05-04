// lib/features/search/application/global_search_open_fallback_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/local_datasources_provider.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/market_repository.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/search/application/global_search_pinned_result_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';

final globalSearchOpenFallbackProvider =
    Provider.family<GlobalSearchResultModel?, GlobalSearchPinnedResultModel>(
  (ref, pinned) {
    switch (pinned.type) {
      case 'inventory':
        final item = InventoryRepository(ref.read(inventoryLocalDatasourceProvider)).getById(pinned.id);
        if (item == null) return null;
        return GlobalSearchResultModel(
          title: pinned.title,
          subtitle: pinned.subtitle,
          type: pinned.type,
          route: '/inventory',
          id: pinned.id,
          payload: item,
        );

      case 'watchlist':
        final items = WatchlistRepository(ref.read(watchlistLocalDatasourceProvider)).getAll();
        dynamic item;
        try {
          item = items.firstWhere((e) => e.id == pinned.id);
        } catch (_) {
          item = null;
        }
        if (item == null) return null;
        return GlobalSearchResultModel(
          title: pinned.title,
          subtitle: pinned.subtitle,
          type: pinned.type,
          route: '/watchlist',
          id: pinned.id,
          payload: item,
        );

      case 'purchase':
        final items = PurchasesRepository(ref.read(purchasesLocalDatasourceProvider)).getAllPurchases();
        dynamic item;
        try {
          item = items.firstWhere((e) => e.id == pinned.id);
        } catch (_) {
          item = null;
        }
        if (item == null) return null;
        return GlobalSearchResultModel(
          title: pinned.title,
          subtitle: pinned.subtitle,
          type: pinned.type,
          route: '/purchases',
          id: pinned.id,
          payload: item,
        );

      case 'sale':
        final items = SalesRepository(ref.read(salesLocalDatasourceProvider)).getAllSales();
        dynamic item;
        try {
          item = items.firstWhere((e) => e.id == pinned.id);
        } catch (_) {
          item = null;
        }
        if (item == null) return null;
        return GlobalSearchResultModel(
          title: pinned.title,
          subtitle: pinned.subtitle,
          type: pinned.type,
          route: '/sales',
          id: pinned.id,
          payload: item,
        );

      case 'market':
        final items = MarketRepository(ref.read(marketLocalDatasourceProvider)).getAll();
        dynamic item;
        try {
          item = items.firstWhere((e) => e.id == pinned.id);
        } catch (_) {
          item = null;
        }
        if (item == null) return null;
        return GlobalSearchResultModel(
          title: pinned.title,
          subtitle: pinned.subtitle,
          type: pinned.type,
          route: '/market',
          id: pinned.id,
          payload: item,
        );

      default:
        return null;
    }
  },
);