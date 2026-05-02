import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

final inventoryAlertCenterProvider =
    Provider<List<InventoryAlertItemModel>>((ref) {
  final state = ref.watch(inventoryControllerProvider);
  final items = state.allItems;
  final alerts = <InventoryAlertItemModel>[];

  for (final item in items) {
    final expectedProfit = (item.expectedSalePrice ?? 0) - item.totalCost;
    final purchaseDate = item.purchaseDate ?? DateTime.now();
    final daysHeld = DateTime.now().difference(purchaseDate).inDays;

    if (expectedProfit <= 100) {
      alerts.add(
        InventoryAlertItemModel(
          itemId: item.id,
          title: item.title,
          reason: 'Low expected profit',
          severity: 2,
        ),
      );
    }

    if (daysHeld >= 60) {
      alerts.add(
        InventoryAlertItemModel(
          itemId: item.id,
          title: item.title,
          reason: 'Held too long',
          severity: 3,
        ),
      );
    }

    if (item.marketAverage != null &&
        item.expectedSalePrice != null &&
        (item.expectedSalePrice! - item.marketAverage!).abs() >= 10) {
      alerts.add(
        InventoryAlertItemModel(
          itemId: item.id,
          title: item.title,
          reason: 'Repricing recommended',
          severity: 1,
        ),
      );
    }
  }

  alerts.sort((a, b) => b.severity.compareTo(a.severity));
  return alerts;
});