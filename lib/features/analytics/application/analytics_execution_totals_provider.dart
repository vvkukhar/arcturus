import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_execution_history_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_scheduled_run_log_provider.dart';

final analyticsExecutionTotalsProvider =
    Provider<AnalyticsExecutionTotalsModel>((ref) {
  final manualHistory = ref.watch(analyticsRuleExecutionHistoryProvider);
  final scheduledHistory = ref.watch(analyticsScheduledRunLogProvider);

  final manualRuns = manualHistory.length;
  final scheduledRuns = scheduledHistory.length;

  final manualAffected = manualHistory.fold<int>(
    0,
    (sum, item) => sum + item.repricedItems,
  );

  final scheduledAffected = scheduledHistory.fold<int>(
    0,
    (sum, item) => sum + item.affectedItems,
  );

  return AnalyticsExecutionTotalsModel(
    manualRuns: manualRuns,
    scheduledRuns: scheduledRuns,
    totalRuns: manualRuns + scheduledRuns,
    totalAffectedItems: manualAffected + scheduledAffected,
  );
});