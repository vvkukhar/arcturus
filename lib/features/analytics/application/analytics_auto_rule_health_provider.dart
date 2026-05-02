import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rule_health_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rules_provider.dart';

final analyticsAutoRuleHealthProvider =
    Provider<AnalyticsAutoRuleHealthModel>((ref) {
  final rules = ref.watch(analyticsAutoRulesProvider);
  final enabled = rules.where((e) => e.enabled).length;
  final disabled = rules.length - enabled;
  final label = enabled == 0
      ? 'Automation is idle'
      : enabled == 1
          ? 'Automation is light'
          : enabled <= 2
              ? 'Automation is balanced'
              : 'Automation is aggressive';

  return AnalyticsAutoRuleHealthModel(
    enabledRules: enabled,
    disabledRules: disabled,
    label: label,
  );
});
