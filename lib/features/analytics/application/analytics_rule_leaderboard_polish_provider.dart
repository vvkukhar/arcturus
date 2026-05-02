import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rules_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_leaderboard_polish_model.dart';

final analyticsRuleLeaderboardPolishProvider =
    Provider<List<AnalyticsRuleLeaderboardPolishModel>>((ref) {
  final items = ref.watch(analyticsAutoRulesProvider);
  return items.map((item) {
    final badge = item.enabled ? 'active' : 'idle';
    return AnalyticsRuleLeaderboardPolishModel(
      title: item.title,
      enabled: item.enabled,
      badge: badge,
    );
  }).toList();
});
