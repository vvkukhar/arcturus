import 'package:flutter_riverpod/flutter_riverpod.dart';
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
        final item = InventoryRepository().getById(pinned.id);
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
        final items = WatchlistRepository().getAll();
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
        final items = PurchasesRepository().getAllPurchases();
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
        final items = SalesRepository().getAllSales();
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
        final items = MarketRepository().getAll();
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