import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_breakdown_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_priority_breakdown_card.dart';

class WatchlistPriorityCard extends StatelessWidget {
  final WatchlistPriorityModel model;
  final WatchlistPriorityBreakdownModel? breakdown;
  final VoidCallback? onQuickBuy;
  final VoidCallback? onReview;

  const WatchlistPriorityCard({
    super.key,
    required this.model,
    this.breakdown,
    this.onQuickBuy,
    this.onReview,
  });

  Color _color() {
    switch (model.label) {
      case 'high':
        return Colors.green;
      case 'mid':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

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
                    model.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    model.label,
                    style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text('Priority score: ${model.score.toStringAsFixed(1)}'),
            if (breakdown != null) ...[
              const SizedBox(height: 12),
              WatchlistPriorityBreakdownCard(model: breakdown!),
            ],
            if (onQuickBuy != null || onReview != null) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  if (onQuickBuy != null)
                    FilledButton.tonalIcon(
                      onPressed: onQuickBuy,
                      icon: const Icon(Icons.shopping_bag_outlined),
                      label: const Text('Quick Buy'),
                    ),
                  if (onReview != null)
                    FilledButton.tonalIcon(
                      onPressed: onReview,
                      icon: const Icon(Icons.open_in_new),
                      label: const Text('Review'),
                    ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}