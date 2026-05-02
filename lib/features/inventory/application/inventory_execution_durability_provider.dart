import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_readiness_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_confidence_provider.dart';

class InventoryExecutionDurabilityModel {
  final double score;
  final String label;

  const InventoryExecutionDurabilityModel({
    required this.score,
    required this.label,
  });
}

final inventoryExecutionDurabilityProvider =
    Provider<InventoryExecutionDurabilityModel>((ref) {
  final readiness = ref.watch(inventoryActionReadinessProvider);
  final confidence = ref.watch(inventoryExecutionConfidenceProvider);

  double score = (readiness.score * 0.55) + (confidence.score * 0.45);
  final label = score >= 75
      ? 'high execution durability'
      : score >= 50
          ? 'moderate execution durability'
          : 'low execution durability';

  return InventoryExecutionDurabilityModel(
    score: score,
    label: label,
  );
});
