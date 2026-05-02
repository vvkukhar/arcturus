import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_schedule_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_best_preset_hint_model.dart';

final analyticsBestPresetHintProvider =
    Provider<AnalyticsBestPresetHintModel>((ref) {
  final schedule = ref.watch(analyticsRuleScheduleProvider);

  if (schedule.enabled && schedule.frequencyLabel == 'daily') {
    return const AnalyticsBestPresetHintModel(
      title: 'Balanced',
      reason: 'Daily cadence works best with stable rule pressure.',
    );
  }
  if (schedule.enabled && schedule.frequencyLabel == 'weekly') {
    return const AnalyticsBestPresetHintModel(
      title: 'Aggressive',
      reason: 'Weekly cadence fits bundled stronger changes.',
    );
  }

  return const AnalyticsBestPresetHintModel(
    title: 'Minimal',
    reason: 'Manual mode works best with minimal automation noise.',
  );
});
