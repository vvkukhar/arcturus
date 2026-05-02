import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_center_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_item_model.dart';

final inventoryFilteredAlertCenterProvider =
    Provider<List<InventoryAlertItemModel>>((ref) {
  final alerts = ref.watch(inventoryAlertCenterProvider);
  final filter = ref.watch(inventoryAlertFilterProvider);

  switch (filter) {
    case InventoryAlertFilter.all:
      return alerts;
    case InventoryAlertFilter.lowProfit:
      return alerts.where((e) => e.reason == 'Low expected profit').toList();
    case InventoryAlertFilter.heldTooLong:
      return alerts.where((e) => e.reason == 'Held too long').toList();
    case InventoryAlertFilter.repricing:
      return alerts.where((e) => e.reason == 'Repricing recommended').toList();
  }
});