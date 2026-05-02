// lib/features/inventory/application/inventory_top_profit_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

final inventoryTopProfitProvider = Provider<List<ItemModel>>((ref) {
  final items = ref.watch(inventoryControllerProvider).allItems;

  final sorted = [...items];
  sorted.sort((a, b) {
    final aProfit = (a.expectedSalePrice ?? 0) - a.totalCost;
    final bProfit = (b.expectedSalePrice ?? 0) - b.totalCost;
    return bProfit.compareTo(aProfit);
  });

  return sorted.take(5).toList();
});
