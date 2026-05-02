import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_center_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_counts_model.dart';

final inventoryAlertFilterCountsProvider =
    Provider<InventoryAlertFilterCountsModel>((ref) {
  final alerts = ref.watch(inventoryAlertCenterProvider);

  int lowProfit = 0;
  int heldTooLong = 0;
  int repricing = 0;

  for (final item in alerts) {
    if (item.reason == 'Low expected profit') lowProfit++;
    if (item.reason == 'Held too long') heldTooLong++;
    if (item.reason == 'Repricing recommended') repricing++;
  }

  return InventoryAlertFilterCountsModel(
    all: alerts.length,
    lowProfit: lowProfit,
    heldTooLong: heldTooLong,
    repricing: repricing,
  );
});