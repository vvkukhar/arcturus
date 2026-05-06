import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_rule_execution_history_entry_model.dart';

class AnalyticsRuleExecutionHistoryCard extends ConsumerWidget {
  final List<AnalyticsRuleExecutionHistoryEntryModel> items;
  final VoidCallback onClear;

  const AnalyticsRuleExecutionHistoryCard({
    super.key,
    required this.items,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    if (items.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Text(i18n.t('No rule execution history yet.')),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    i18n.t('Rule Execution History'),
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: onClear,
                  child: Text(i18n.t('common.clear')),
                ),
              ],
            ),
            const SizedBox(height: 10),
            ...items.take(5).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      '${item.createdAt.toIso8601String().split("T").first} • '
                      '${i18n.t('repriced')} ${item.repricedItems} • '
                      '${i18n.t('old stock')} ${item.highlightedOldStock} • '
                      '${i18n.t('priority')} ${item.profitPriorityEnabled ? i18n.t("on") : i18n.t("off")}',
                    ),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}