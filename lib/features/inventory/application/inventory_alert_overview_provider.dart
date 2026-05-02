import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_center_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_overview_model.dart';

final inventoryAlertOverviewProvider =
    Provider<InventoryAlertOverviewModel>((ref) {
  final alerts = ref.watch(inventoryAlertCenterProvider);
  final itemIds = <String>{};
  int severe = 0;

  for (final alert in alerts) {
    itemIds.add(alert.itemId);
    if (alert.severity >= 3) severe++;
  }

  return InventoryAlertOverviewModel(
    totalAlerts: alerts.length,
    uniqueItems: itemIds.length,
    severeAlerts: severe,
  );
});
