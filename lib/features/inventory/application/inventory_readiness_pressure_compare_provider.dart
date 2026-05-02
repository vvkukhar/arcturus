import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_readiness_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_execution_pressure_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_readiness_pressure_compare_model.dart';

final inventoryReadinessPressureCompareProvider =
    Provider<InventoryReadinessPressureCompareModel>((ref) {
  final readiness = ref.watch(inventoryActionReadinessProvider);
  final pressure = ref.watch(inventoryExecutionPressureProvider);

  final label = readiness.score >= pressure.score
      ? 'readiness exceeds pressure'
      : 'pressure exceeds readiness';

  return InventoryReadinessPressureCompareModel(
    readiness: readiness.score,
    pressure: pressure.score,
    label: label,
  );
});
