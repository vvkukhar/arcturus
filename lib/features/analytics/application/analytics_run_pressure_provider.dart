import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_pressure_model.dart';

final analyticsRunPressureProvider = Provider<AnalyticsRunPressureModel>((ref) {
  final totals = ref.watch(analyticsExecutionTotalsProvider);

  final label = totals.totalRuns == 0
      ? 'No execution pressure'
      : totals.totalRuns <= 5
          ? 'Light execution pressure'
          : totals.totalRuns <= 12
              ? 'Stable execution pressure'
              : 'Heavy execution pressure';

  return AnalyticsRunPressureModel(
    label: label,
    totalRuns: totals.totalRuns,
    affectedItems: totals.totalAffectedItems,
  );
});