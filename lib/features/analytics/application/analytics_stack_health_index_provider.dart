import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_durability_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_equilibrium_provider.dart';

class AnalyticsStackHealthIndexModel {
  final double score;
  final String label;

  const AnalyticsStackHealthIndexModel({
    required this.score,
    required this.label,
  });
}

final analyticsStackHealthIndexProvider =
    Provider<AnalyticsStackHealthIndexModel>((ref) {
  final durability = ref.watch(analyticsStackDurabilityProvider);
  final equilibrium = ref.watch(analyticsStackEquilibriumProvider);

  double score = (durability.score * 0.55) + (equilibrium.score * 0.45);
  final label = score >= 75
      ? 'high stack health'
      : score >= 50
          ? 'moderate stack health'
          : 'low stack health';

  return AnalyticsStackHealthIndexModel(
    score: score,
    label: label,
  );
});
