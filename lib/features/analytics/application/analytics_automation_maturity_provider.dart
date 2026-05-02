import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_maturity_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rules_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_execution_totals_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_schedule_provider.dart';

final analyticsAutomationMaturityProvider =
    Provider<AnalyticsAutomationMaturityModel>((ref) {
  final rules = ref.watch(analyticsAutoRulesProvider);
  final totals = ref.watch(analyticsExecutionTotalsProvider);
  final schedule = ref.watch(analyticsRuleScheduleProvider);
  final enabled = rules.where((e) => e.enabled).length;

  final label = !schedule.enabled && enabled == 0
      ? 'Automation immature'
      : !schedule.enabled && enabled > 0
          ? 'Automation configured manually'
          : schedule.enabled && totals.totalRuns == 0
              ? 'Automation ready but unproven'
              : schedule.enabled && totals.totalRuns < 5
                  ? 'Automation early-stage'
                  : 'Automation maturing';

  return AnalyticsAutomationMaturityModel(
    label: label,
    enabledRules: enabled,
    scheduleEnabled: schedule.enabled,
    totalRuns: totals.totalRuns,
  );
});