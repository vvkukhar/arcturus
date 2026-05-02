import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_center_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_workload_model.dart';

final inventoryReviewWorkloadProvider =
    Provider<InventoryReviewWorkloadModel>((ref) {
  final alerts = ref.watch(inventoryAlertCenterProvider);
  final itemIds = <String>{};
  int urgent = 0;
  int moderate = 0;

  for (final alert in alerts) {
    itemIds.add(alert.itemId);
    if (alert.severity >= 3) {
      urgent++;
    } else if (alert.severity == 2) {
      moderate++;
    }
  }

  final total = itemIds.length;
  final label = total == 0
      ? 'No review workload'
      : urgent >= 5
          ? 'Heavy review workload'
          : urgent >= 2 || moderate >= 4
              ? 'Moderate review workload'
              : 'Light review workload';

  return InventoryReviewWorkloadModel(
    totalReviewItems: total,
    urgentItems: urgent,
    moderateItems: moderate,
    label: label,
  );
});
