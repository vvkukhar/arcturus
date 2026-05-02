import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_center_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_severity_summary_model.dart';

final inventoryAlertSeveritySummaryProvider =
    Provider<InventoryAlertSeveritySummaryModel>((ref) {
  final alerts = ref.watch(inventoryAlertCenterProvider);
  int low = 0;
  int medium = 0;
  int high = 0;
  for (final item in alerts) {
    if (item.severity <= 1) {
      low++;
    } else if (item.severity == 2) {
      medium++;
    } else {
      high++;
    }
  }
  return InventoryAlertSeveritySummaryModel(
    low: low,
    medium: medium,
    high: high,
  );
});
