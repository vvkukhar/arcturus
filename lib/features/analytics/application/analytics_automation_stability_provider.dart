import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_stability_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_schedule_provider.dart';

final analyticsAutomationStabilityProvider =
    Provider<AnalyticsAutomationStabilityModel>((ref) {
  final totals = ref.watch(analyticsExecutionTotalsProvider);
  final schedule = ref.watch(analyticsRuleScheduleProvider);

  String label;
  if (!schedule.enabled) {
    label = 'Automation schedule disabled';
  } else if (totals.totalRuns == 0) {
    label = 'Automation enabled but untested';
  } else if (totals.totalRuns < 5) {
    label = 'Automation stability emerging';
  } else if (totals.totalRuns < 12) {
    label = 'Automation stability forming';
  } else {
    label = 'Automation stability strong';
  }

  return AnalyticsAutomationStabilityModel(
    label: label,
    totalRuns: totals.totalRuns,
    scheduleEnabled: schedule.enabled,
  );
});