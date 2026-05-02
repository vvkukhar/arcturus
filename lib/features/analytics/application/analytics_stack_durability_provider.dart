import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_stability_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_equilibrium_provider.dart';

class AnalyticsStackDurabilityModel {
  final double score;
  final String label;

  const AnalyticsStackDurabilityModel({
    required this.score,
    required this.label,
  });
}

final analyticsStackDurabilityProvider =
    Provider<AnalyticsStackDurabilityModel>((ref) {
  final equilibrium = ref.watch(analyticsStackEquilibriumProvider);
  final stability = ref.watch(analyticsAutomationStabilityProvider);

  double score = equilibrium.score;
  if (stability.label == 'Automation stability strong') {
    score += 15;
  } else if (stability.label == 'Automation stability forming') {
    score += 8;
  } else if (stability.label == 'Automation stability emerging') {
    score += 4;
  } else if (stability.label == 'Automation enabled but untested') {
    score -= 8;
  } else {
    score -= 15;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  final label = score >= 75
      ? 'high stack durability'
      : score >= 50
          ? 'moderate stack durability'
          : 'low stack durability';

  return AnalyticsStackDurabilityModel(
    score: score,
    label: label,
  );
});
