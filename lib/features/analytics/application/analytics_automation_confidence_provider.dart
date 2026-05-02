import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_confidence_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_provider.dart';

final analyticsAutomationConfidenceProvider =
    Provider<AnalyticsAutomationConfidenceModel>((ref) {
  final totals = ref.watch(analyticsExecutionTotalsProvider);

  final label = totals.totalRuns >= 50
      ? 'Automation confidence is high'
      : totals.totalRuns >= 15
          ? 'Automation confidence is building'
          : totals.totalRuns > 0
              ? 'Automation confidence is low'
              : 'Automation confidence is unproven';

  return AnalyticsAutomationConfidenceModel(
    label: label,
  );
});