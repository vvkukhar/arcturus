import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rules_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_schedule_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_stack_summary_model.dart';

final analyticsRuleStackSummaryProvider =
    Provider<AnalyticsRuleStackSummaryModel>((ref) {
  final rules = ref.watch(analyticsAutoRulesProvider);
  final schedule = ref.watch(analyticsRuleScheduleProvider);
  final enabledRules = rules.where((rule) => rule.enabled).length;

  final label = !schedule.enabled && enabledRules == 0
      ? 'No active rules in manual mode'
      : !schedule.enabled
          ? '$enabledRules active rules in manual mode'
          : '$enabledRules active rules on ${schedule.frequencyLabel} cadence';

  return AnalyticsRuleStackSummaryModel(
    enabledRules: enabledRules,
    scheduleEnabled: schedule.enabled,
    frequency: schedule.frequencyLabel,
    label: label,
  );
});