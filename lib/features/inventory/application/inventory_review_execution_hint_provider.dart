import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_execution_hint_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_heat_provider.dart';

final inventoryReviewExecutionHintProvider =
    Provider<InventoryReviewExecutionHintModel>((ref) {
  final heat = ref.watch(inventoryReviewHeatProvider);

  final label = heat.heatScore >= 25
      ? 'Start with urgent inventory items immediately'
      : heat.heatScore >= 12
          ? 'Review urgent items first, then backlog'
          : 'Keep steady review cadence across normal lane';

  return InventoryReviewExecutionHintModel(
    label: label,
  );
});