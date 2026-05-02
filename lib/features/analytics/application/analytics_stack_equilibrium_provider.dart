import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_equilibrium_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_mix_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_resilience_provider.dart';

final analyticsStackEquilibriumProvider =
    Provider<AnalyticsStackEquilibriumModel>((ref) {
  final mix = ref.watch(analyticsStackMixProvider);
  final resilience = ref.watch(analyticsStackResilienceProvider);

  double score = (mix.score * 0.5) + (resilience.score * 0.5);
  final label = score >= 75
      ? 'stack equilibrium is strong'
      : score >= 50
          ? 'stack equilibrium is acceptable'
          : 'stack equilibrium is unstable';

  return AnalyticsStackEquilibriumModel(
    score: score,
    label: label,
  );
});
