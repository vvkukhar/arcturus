import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_model.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_reprice_diff_badge.dart';

class MarketInventoryRepriceSuggestionCard extends ConsumerWidget {
  final MarketInventoryRepriceSuggestionModel model;
  final bool selected;
  final ValueChanged<bool?>? onSelect;
  final VoidCallback? onApply;

  const MarketInventoryRepriceSuggestionCard({
    super.key,
    required this.model,
    this.selected = false,
    this.onSelect,
    this.onApply,
  });

  Color _deltaColor() {
    return model.suggestedPrice >= model.currentExpected
        ? Colors.green
        : Colors.orange;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final deltaColor = _deltaColor();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (onSelect != null)
                  Checkbox(
                    value: selected,
                    onChanged: onSelect,
                  ),
                Expanded(
                  child: Text(
                    model.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                    ),
                  ),
                ),
                AnalyticsRepriceDiffBadge(
                  current: model.currentExpected,
                  suggested: model.suggestedPrice,
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '${i18n.t('Current')} ${model.currentExpected.toStringAsFixed(2)} → '
              '${i18n.t('Market')} ${model.marketAverage.toStringAsFixed(2)} → '
              '${i18n.t('Suggested')} ${model.suggestedPrice.toStringAsFixed(2)}',
            ),
            const SizedBox(height: 8),
            Text(
              model.suggestedPrice >= model.currentExpected
                  ? i18n.t('Suggested price goes up')
                  : i18n.t('Suggested price goes down'),
              style: TextStyle(
                color: deltaColor,
                fontWeight: FontWeight.w700,
              ),
            ),
            if (onApply != null) ...[
              const SizedBox(height: 12),
              FilledButton.tonalIcon(
                onPressed: onApply,
                icon: const Icon(Icons.auto_fix_high_outlined),
                label: Text(i18n.t('Apply Suggested Price')),
              ),
            ],
          ],
        ),
      ),
    );
  }
}