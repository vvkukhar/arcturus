import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_confidence_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_stack_summary_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_readiness_model.dart';

final analyticsStackReadinessProvider =
    Provider<AnalyticsStackReadinessModel>((ref) {
  final stack = ref.watch(analyticsRuleStackSummaryProvider);
  final confidence = ref.watch(analyticsAutomationConfidenceProvider);

  double score = 0;
  if (stack.scheduleEnabled) score += 35;
  if (stack.enabledRules >= 1) score += 25;
  if (stack.enabledRules >= 2) score += 15;

  if (confidence.label == 'Automation confidence is high') {
    score += 25;
  } else if (confidence.label == 'Automation confidence is building') {
    score += 15;
  }

  final label = score >= 80
      ? 'stack ready'
      : score >= 55
          ? 'stack forming'
          : 'stack early';

  return AnalyticsStackReadinessModel(
    score: score,
    label: label,
  );
});