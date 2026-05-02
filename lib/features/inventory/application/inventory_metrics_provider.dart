import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_visible_items_provider.dart';

class InventoryMetricsModel {
  final int visibleCount;
  final int soldCount;
  final int activeCount;
  final double totalCost;
  final double totalMarketValue;
  final double totalExpectedProfit;

  const InventoryMetricsModel({
    required this.visibleCount,
    required this.soldCount,
    required this.activeCount,
    required this.totalCost,
    required this.totalMarketValue,
    required this.totalExpectedProfit,
  });
}

final inventoryMetricsProvider = Provider<InventoryMetricsModel>((ref) {
  final allItems = ref.watch(inventoryControllerProvider).allItems;
  final visibleItems = ref.watch(inventoryVisibleItemsProvider);

  final soldCount =
      allItems.where((item) => item.status == ItemStatus.sold).length;

  final activeCount = allItems.where((item) => item.isActive).length;

  final totalCost =
      visibleItems.fold<double>(0, (sum, item) => sum + item.totalCost);

  final totalMarketValue = visibleItems.fold<double>(
    0,
    (sum, item) => sum + (item.marketAverage ?? 0),
  );

  final totalExpectedProfit = visibleItems.fold<double>(
    0,
    (sum, item) => sum + ((item.expectedSalePrice ?? 0) - item.totalCost),
  );

  return InventoryMetricsModel(
    visibleCount: visibleItems.length,
    soldCount: soldCount,
    activeCount: activeCount,
    totalCost: totalCost,
    totalMarketValue: totalMarketValue,
    totalExpectedProfit: totalExpectedProfit,
  );
});