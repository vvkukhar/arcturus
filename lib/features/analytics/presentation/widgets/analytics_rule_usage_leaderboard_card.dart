import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_usage_leaderboard_item_model.dart';

class AnalyticsRuleUsageLeaderboardCard extends ConsumerWidget {
  final List<AnalyticsRuleUsageLeaderboardItemModel> items;

  const AnalyticsRuleUsageLeaderboardCard({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              i18n.t('Rule Leaderboard'),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 10),
            ...items.map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      '${i18n.t(item.title)} • ${item.enabledCount > 0 ? i18n.t("enabled") : i18n.t("disabled")}',
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}