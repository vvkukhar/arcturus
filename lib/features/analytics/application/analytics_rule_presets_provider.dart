import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_presets_service.dart';

final analyticsRulePresetsProvider =
    Provider<AnalyticsRulePresetsService>((ref) {
  return AnalyticsRulePresetsService(ref);
});