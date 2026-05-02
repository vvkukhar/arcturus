import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_model.dart';
import 'package:lego_trading_manager/features/analytics/presentation/widgets/analytics_reprice_diff_badge.dart';

class MarketInventoryRepriceSuggestionCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
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
              'Current ${model.currentExpected.toStringAsFixed(2)} → '
              'Market ${model.marketAverage.toStringAsFixed(2)} → '
              'Suggested ${model.suggestedPrice.toStringAsFixed(2)}',
            ),
            const SizedBox(height: 8),
            Text(
              model.suggestedPrice >= model.currentExpected
                  ? 'Suggested price goes up'
                  : 'Suggested price goes down',
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
                label: const Text('Apply Suggested Price'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}