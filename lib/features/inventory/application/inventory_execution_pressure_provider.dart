import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_confidence_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_pressure_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_review_heat_provider.dart';

final inventoryExecutionPressureProvider =
    Provider<InventoryExecutionPressureModel>((ref) {
  final confidence = ref.watch(inventoryExecutionConfidenceProvider);
  final heat = ref.watch(inventoryReviewHeatProvider);

  final score = heat.heatScore + (100 - confidence.score) / 5;

  final label = score >= 25
      ? 'High execution pressure'
      : score >= 15
          ? 'Moderate execution pressure'
          : score > 0
              ? 'Controlled execution pressure'
              : 'No execution pressure';

  return InventoryExecutionPressureModel(
    label: label,
    score: score,
  );
});