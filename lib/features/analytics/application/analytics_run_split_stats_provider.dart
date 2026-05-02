import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_execution_history_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_split_stats_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_scheduled_run_log_provider.dart';

final analyticsRunSplitStatsProvider =
    Provider<AnalyticsRunSplitStatsModel>((ref) {
  final manualRuns = ref.watch(analyticsRuleExecutionHistoryProvider).length;
  final scheduledRuns = ref.watch(analyticsScheduledRunLogProvider).length;

  return AnalyticsRunSplitStatsModel(
    manualRuns: manualRuns,
    scheduledRuns: scheduledRuns,
  );
});