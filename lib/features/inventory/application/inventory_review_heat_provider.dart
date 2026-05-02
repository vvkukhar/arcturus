import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_heat_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_lane_provider.dart';

final inventoryReviewHeatProvider = Provider<InventoryReviewHeatModel>((ref) {
  final lane = ref.watch(inventoryReviewLaneProvider);
  final heatScore =
      (lane.urgent * 3.0) + (lane.backlog * 1.5) + (lane.normal * 0.5);

  final label = heatScore >= 25
      ? 'High review heat'
      : heatScore >= 12
          ? 'Moderate review heat'
          : heatScore > 0
              ? 'Low review heat'
              : 'No review heat';

  return InventoryReviewHeatModel(
    heatScore: heatScore,
    label: label,
  );
});