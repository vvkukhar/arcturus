import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_pressure_summary_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_stack_summary_provider.dart';

final analyticsAutomationPressureSummaryProvider =
    Provider<AnalyticsAutomationPressureSummaryModel>((ref) {
  final stack = ref.watch(analyticsRuleStackSummaryProvider);

  final label = !stack.scheduleEnabled && stack.enabledRules == 0
      ? 'No automation pressure'
      : !stack.scheduleEnabled && stack.enabledRules > 0
          ? 'Manual automation pressure'
          : stack.enabledRules <= 1
              ? 'Low automation pressure'
              : stack.enabledRules <= 2
                  ? 'Stable automation pressure'
                  : 'High automation pressure';

  return AnalyticsAutomationPressureSummaryModel(
    enabledRules: stack.enabledRules,
    scheduleEnabled: stack.scheduleEnabled,
    label: label,
  );
});