import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_efficiency_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_provider.dart';

final analyticsExecutionEfficiencyProvider =
    Provider<AnalyticsExecutionEfficiencyModel>((ref) {
  final totals = ref.watch(analyticsExecutionTotalsProvider);

  final double avg = totals.totalRuns == 0
      ? 0.0
      : totals.totalAffectedItems / totals.totalRuns.toDouble();

  return AnalyticsExecutionEfficiencyModel(
    totalRuns: totals.totalRuns,
    totalAffected: totals.totalAffectedItems,
    avgAffectedPerRun: avg,
  );
});