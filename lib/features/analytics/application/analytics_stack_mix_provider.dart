import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_automation_confidence_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_mix_model.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_stack_pressure_provider.dart';

final analyticsStackMixProvider = Provider<AnalyticsStackMixModel>((ref) {
  final confidence = ref.watch(analyticsAutomationConfidenceProvider);
  final pressure = ref.watch(analyticsStackPressureProvider);
  double score = 0;

  if (confidence.label == 'Automation confidence is high') {
    score += 60;
  } else if (confidence.label == 'Automation confidence is building') {
    score += 40;
  } else {
    score += 20;
  }

  score -= pressure.score * 0.4;
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  final label = score >= 65
      ? 'stack mix is healthy'
      : score >= 40
          ? 'stack mix is acceptable'
          : 'stack mix is strained';

  return AnalyticsStackMixModel(
    score: score,
    label: label,
  );
});
