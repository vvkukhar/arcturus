import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_confidence_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_heat_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_stability_provider.dart';

final inventoryExecutionConfidenceProvider =
    Provider<InventoryExecutionConfidenceModel>((ref) {
  final stability = ref.watch(inventoryReviewStabilityProvider);
  final heat = ref.watch(inventoryReviewHeatProvider);

  double score = stability.score - (heat.heatScore * 2);
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  final label = score >= 75
      ? 'high execution confidence'
      : score >= 50
          ? 'moderate execution confidence'
          : 'low execution confidence';

  return InventoryExecutionConfidenceModel(
    score: score,
    label: label,
  );
});