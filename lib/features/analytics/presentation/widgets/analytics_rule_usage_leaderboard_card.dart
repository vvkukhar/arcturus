import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_usage_leaderboard_item_model.dart';

class AnalyticsRuleUsageLeaderboardCard extends StatelessWidget {
  final List<AnalyticsRuleUsageLeaderboardItemModel> items;

  const AnalyticsRuleUsageLeaderboardCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Rule Leaderboard',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      '${item.title} • ${item.enabledCount > 0 ? "enabled" : "disabled"}',
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}