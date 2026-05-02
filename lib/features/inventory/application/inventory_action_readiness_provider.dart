import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_readiness_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_confidence_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_pressure_provider.dart';

final inventoryActionReadinessProvider =
    Provider<InventoryActionReadinessModel>((ref) {
  final confidence = ref.watch(inventoryExecutionConfidenceProvider);
  final pressure = ref.watch(inventoryExecutionPressureProvider);

  double score = confidence.score - pressure.score;
  if (score < 0) {
    score = 0;
  }
  if (score > 100) {
    score = 100;
  }

  final label = score >= 65
      ? 'ready for action'
      : score >= 40
          ? 'partially ready'
          : 'not ready yet';

  return InventoryActionReadinessModel(
    score: score,
    label: label,
  );
});