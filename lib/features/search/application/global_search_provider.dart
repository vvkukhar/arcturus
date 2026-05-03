import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/search/application/global_search_fuzzy_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_query_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_result_model.dart';
import 'package:lego_trading_manager/features/search/application/global_search_scope_boost_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_scope_provider.dart';
import 'package:lego_trading_manager/features/search/application/global_search_type_filter_provider.dart';

final globalSearchProvider = Provider<List<GlobalSearchResultModel>>((ref) {
  final query = ref.watch(globalSearchQueryProvider).trim().toLowerCase();
  final typeFilter = ref.watch(globalSearchTypeFilterProvider);
  final scope = ref.watch(globalSearchScopeProvider);
  final fuzzy = ref.watch(globalSearchFuzzyProvider);
  final scopeBoost = ref.watch(globalSearchScopeBoostProvider);

  if (query.isEmpty) return const [];

  final inventoryRepo = ref.read(inventoryRepositoryProvider);
  final watchlistRepo = ref.read(watchlistRepositoryProvider);
  final purchasesRepo = ref.read(purchasesRepositoryProvider);
  final salesRepo = ref.read(salesRepositoryProvider);
  final marketRepo = ref.read(marketRepositoryProvider);

  final results = <GlobalSearchResultModel>[];

  if (typeFilter == null || typeFilter == 'inventory') {
    for (final item in inventoryRepo.getAllItems()) {
      int score = fuzzy.score(query: query, text: item.title);
      score += fuzzy.score(query: query, text: item.legoNumber ?? '') ~/ 2;
      if (score > 0) {
        score += scopeBoost.boost(selectedScope: scope, itemType: 'inventory');
        results.add(GlobalSearchResultModel(
          title: item.title,
          subtitle: 'Inventory • ${item.status.name}',
          type: 'inventory',
          route: '/inventory',
          id: item.id,
          payload: item,
          priorityScore: score,
        ));
      }
    }
  }

  if (typeFilter == null || typeFilter == 'watchlist') {
    for (final item in watchlistRepo.getAll()) {
      int score = fuzzy.score(query: query, text: item.title);
      score += fuzzy.score(query: query, text: item.refId ?? '') ~/ 2;
      if (score > 0) {
        score += scopeBoost.boost(selectedScope: scope, itemType: 'watchlist');
        results.add(GlobalSearchResultModel(
          title: item.title,
          subtitle: 'Watchlist • Target ${item.desiredBuyPrice}',
          type: 'watchlist',
          route: '/watchlist',
          id: item.id,
          payload: item,
          priorityScore: score,
        ));
      }
    }
  }

  if (typeFilter == null || typeFilter == 'purchase') {
    for (final purchase in purchasesRepo.getAllPurchases()) {
      int score = fuzzy.score(query: query, text: purchase.source);
      score += fuzzy.score(query: query, text: purchase.itemId) ~/ 2;
      score += fuzzy.score(query: query, text: purchase.sellerName ?? '') ~/ 2;
      if (score > 0) {
        score += scopeBoost.boost(selectedScope: scope, itemType: 'purchase');
        results.add(GlobalSearchResultModel(
          title: 'Purchase • ${purchase.source}',
          subtitle: 'Total: ${purchase.finalTotal.toStringAsFixed(2)} ${purchase.currency}',
          type: 'purchase',
          route: '/purchases',
          id: purchase.id,
          payload: purchase,
          priorityScore: score,
        ));
      }
    }
  }

  if (typeFilter == null || typeFilter == 'sale') {
    for (final sale in salesRepo.getAllSales()) {
      int score = fuzzy.score(query: query, text: sale.platform);
      score += fuzzy.score(query: query, text: sale.itemId) ~/ 2;
      score += fuzzy.score(query: query, text: sale.buyerName ?? '') ~/ 2;
      if (score > 0) {
        score += scopeBoost.boost(selectedScope: scope, itemType: 'sale');
        results.add(GlobalSearchResultModel(
          title: 'Sale • ${sale.platform}',
          subtitle: 'Net: ${sale.finalNet.toStringAsFixed(2)} ${sale.currency}',
          type: 'sale',
          route: '/sales',
          id: sale.id,
          payload: sale,
          priorityScore: score,
        ));
      }
    }
  }

  if (typeFilter == null || typeFilter == 'market') {
    for (final snapshot in marketRepo.getAll()) {
      int score = fuzzy.score(query: query, text: snapshot.source);
      score += fuzzy.score(query: query, text: snapshot.itemRef) ~/ 2;
      if (score > 0) {
        score += scopeBoost.boost(selectedScope: scope, itemType: 'market');
        results.add(GlobalSearchResultModel(
          title: 'Market • ${snapshot.source}',
          subtitle: 'Ref: ${snapshot.itemRef} • Avg: ${snapshot.averagePrice}',
          type: 'market',
          route: '/market',
          id: snapshot.id,
          payload: snapshot,
          priorityScore: score,
        ));
      }
    }
  }

  results.sort((a, b) => b.priorityScore.compareTo(a.priorityScore));
  return results;
});