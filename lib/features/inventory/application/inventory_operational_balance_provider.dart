import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_control_equilibrium_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_durability_provider.dart';

class InventoryOperationalBalanceModel {
  final double score;
  final String label;

  const InventoryOperationalBalanceModel({
    required this.score,
    required this.label,
  });
}

final inventoryOperationalBalanceProvider =
    Provider<InventoryOperationalBalanceModel>((ref) {
  final equilibrium = ref.watch(inventoryControlEquilibriumProvider);
  final durability = ref.watch(inventoryExecutionDurabilityProvider);
  final score = (equilibrium.score * 0.5) + (durability.score * 0.5);

  final label = score >= 75
      ? 'strong operational balance'
      : score >= 50
          ? 'moderate operational balance'
          : 'weak operational balance';

  return InventoryOperationalBalanceModel(
    score: score,
    label: label,
  );
});
