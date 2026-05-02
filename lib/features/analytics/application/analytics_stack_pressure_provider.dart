import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_pressure_summary_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_pressure_model.dart';

final analyticsStackPressureProvider =
    Provider<AnalyticsStackPressureModel>((ref) {
  final pressure = ref.watch(analyticsAutomationPressureSummaryProvider);
  final totals = ref.watch(analyticsExecutionTotalsProvider);

  double score = 0;
  score += pressure.enabledRules * 18;
  score += totals.totalRuns * 2;
  if (pressure.scheduleEnabled) {
    score += 12;
  }

  final label = score >= 70
      ? 'high stack pressure'
      : score >= 40
          ? 'moderate stack pressure'
          : score > 0
              ? 'light stack pressure'
              : 'no stack pressure';

  return AnalyticsStackPressureModel(
    score: score,
    label: label,
  );
});