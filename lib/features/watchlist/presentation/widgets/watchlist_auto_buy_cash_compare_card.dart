import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_auto_buy_cash_compare_model.dart';

class WatchlistAutoBuyCashCompareCard extends StatelessWidget {
  final WatchlistAutoBuyCashCompareModel model;

  const WatchlistAutoBuyCashCompareCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.enoughCash ? Colors.green : Colors.orange;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Spend ${model.totalSpend.toStringAsFixed(2)}')),
            Chip(label: Text('Cash ${model.availableCash.toStringAsFixed(2)}')),
            Chip(
              label:
                  Text('Remaining ${model.remainingCash.toStringAsFixed(2)}'),
              backgroundColor: color.withValues(alpha: 0.15),
            ),
          ],
        ),
      ),
    );
  }
}
