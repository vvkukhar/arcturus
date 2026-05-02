import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_profit_bucket_model.dart';

final inventoryProfitBucketProvider =
    Provider<InventoryProfitBucketModel>((ref) {
  final state = ref.watch(inventoryControllerProvider);
  final items = state.allItems;

  int low = 0;
  int medium = 0;
  int high = 0;

  for (final item in items) {
    final profit = (item.expectedSalePrice ?? 0) - item.totalCost;

    if (profit <= 100) {
      low++;
    } else if (profit <= 300) {
      medium++;
    } else {
      high++;
    }
  }

  return InventoryProfitBucketModel(
    low: low,
    medium: medium,
    high: high,
  );
});