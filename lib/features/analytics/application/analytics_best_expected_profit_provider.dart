import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

final analyticsBestExpectedProfitItemsProvider =
    Provider<List<ItemModel>>((ref) {
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();

  final sorted = [...items];
  sorted.sort((a, b) {
    final aProfit = (a.expectedSalePrice ?? 0) - a.totalCost;
    final bProfit = (b.expectedSalePrice ?? 0) - b.totalCost;
    return bProfit.compareTo(aProfit);
  });

  return sorted.take(10).toList();
});