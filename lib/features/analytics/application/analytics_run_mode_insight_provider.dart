import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_mode_insight_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_run_split_stats_provider.dart';

final analyticsRunModeInsightProvider =
    Provider<AnalyticsRunModeInsightModel>((ref) {
  final stats = ref.watch(analyticsRunSplitStatsProvider);

  if (stats.manualRuns == 0 && stats.scheduledRuns == 0) {
    return const AnalyticsRunModeInsightModel(
      label: 'No execution history yet',
    );
  }

  if (stats.manualRuns > stats.scheduledRuns) {
    return const AnalyticsRunModeInsightModel(
      label: 'Manual execution dominates',
    );
  }

  if (stats.scheduledRuns > stats.manualRuns) {
    return const AnalyticsRunModeInsightModel(
      label: 'Scheduled execution dominates',
    );
  }

  return const AnalyticsRunModeInsightModel(
    label: 'Manual and scheduled usage balanced',
  );
});