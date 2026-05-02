// lib/features/analytics/application/analytics_best_expected_profit_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';

final analyticsBestExpectedProfitItemsProvider =
    Provider<List<ItemModel>>((ref) {
  final items = InventoryRepository().getAllItems();

  final sorted = [...items];
  sorted.sort((a, b) {
    final aProfit = (a.expectedSalePrice ?? 0) - a.totalCost;
    final bProfit = (b.expectedSalePrice ?? 0) - b.totalCost;
    return bProfit.compareTo(aProfit);
  });

  return sorted.take(10).toList();
});
