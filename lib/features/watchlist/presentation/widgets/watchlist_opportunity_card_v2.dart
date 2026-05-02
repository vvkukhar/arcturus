import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunity_model.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/widgets/watchlist_opportunity_quick_bar.dart';

class WatchlistOpportunityCardV2 extends StatelessWidget {
  final WatchlistOpportunityModel item;
  final VoidCallback onQuickBuy;
  final VoidCallback onOpenWatchlist;

  const WatchlistOpportunityCardV2({
    super.key,
    required this.item,
    required this.onQuickBuy,
    required this.onOpenWatchlist,
  });

  Color _statusColor() {
    if (item.underDesired) return Colors.green;
    if (item.underMax) return Colors.orange;
    return Colors.grey;
  }

  String _statusText() {
    if (item.underDesired) return 'target hit';
    if (item.underMax) return 'under max';
    return 'watch';
  }

  @override
  Widget build(BuildContext context) {
    final color = _statusColor();

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
                    item.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
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
                    _statusText(),
                    style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text('Desired: ${item.desiredBuyPrice.toStringAsFixed(2)}'),
            Text('Max: ${item.maxBuyPrice.toStringAsFixed(2)}'),
            Text('Market: ${item.marketPrice.toStringAsFixed(2)}'),
            const SizedBox(height: 12),
            WatchlistOpportunityQuickBar(
              onQuickBuy: onQuickBuy,
              onOpenWatchlist: onOpenWatchlist,
            ),
          ],
        ),
      ),
    );
  }
}