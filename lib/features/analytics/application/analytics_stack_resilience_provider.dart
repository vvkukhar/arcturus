import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_mix_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_resilience_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_readiness_provider.dart';

final analyticsStackResilienceProvider =
    Provider<AnalyticsStackResilienceModel>((ref) {
  final mix = ref.watch(analyticsStackMixProvider);
  final readiness = ref.watch(analyticsStackReadinessProvider);

  double score = (mix.score * 0.6) + (readiness.score * 0.4);
  final label = score >= 75
      ? 'high stack resilience'
      : score >= 50
          ? 'moderate stack resilience'
          : 'low stack resilience';

  return AnalyticsStackResilienceModel(
    score: score,
    label: label,
  );
});
