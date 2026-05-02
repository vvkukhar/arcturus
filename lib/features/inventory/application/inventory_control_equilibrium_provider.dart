import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_readiness_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_control_equilibrium_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_stability_provider.dart';

final inventoryControlEquilibriumProvider =
    Provider<InventoryControlEquilibriumModel>((ref) {
  final readiness = ref.watch(inventoryActionReadinessProvider);
  final stability = ref.watch(inventoryReviewStabilityProvider);

  final score = (readiness.score * 0.55) + (stability.score * 0.45);

  final label = score >= 75
      ? 'strong control equilibrium'
      : score >= 50
          ? 'moderate control equilibrium'
          : 'weak control equilibrium';

  return InventoryControlEquilibriumModel(
    score: score,
    label: label,
  );
});