import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_heat_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_lane_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_stability_model.dart';

final inventoryReviewStabilityProvider =
    Provider<InventoryReviewStabilityModel>((ref) {
  final heat = ref.watch(inventoryReviewHeatProvider);
  final lane = ref.watch(inventoryReviewLaneProvider);

  final total = lane.urgent + lane.normal + lane.backlog;
  final urgentRatio = total == 0 ? 0.0 : lane.urgent / total;
  final backlogRatio = total == 0 ? 0.0 : lane.backlog / total;

  double score = 100;
  score -= heat.heatScore * 2;
  score -= urgentRatio * 35;
  score -= backlogRatio * 20;

  if (score < 0) {
    score = 0;
  }

  final label = score >= 75
      ? 'stable review flow'
      : score >= 50
          ? 'moderately stable review flow'
          : score >= 25
              ? 'fragile review flow'
              : 'unstable review flow';

  return InventoryReviewStabilityModel(
    score: score,
    label: label,
  );
});