import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_auto_rules_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_usage_leaderboard_item_model.dart';

final analyticsRuleUsageLeaderboardProvider =
    Provider<List<AnalyticsRuleUsageLeaderboardItemModel>>((ref) {
  final items = ref.watch(analyticsAutoRulesProvider);
  final result = items
      .map(
        (item) => AnalyticsRuleUsageLeaderboardItemModel(
          title: item.title,
          enabledCount: item.enabled ? 1 : 0,
        ),
      )
      .toList();
  result.sort((a, b) => b.enabledCount.compareTo(a.enabledCount));
  return result;
});
