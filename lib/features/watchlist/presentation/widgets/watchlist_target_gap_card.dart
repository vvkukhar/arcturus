import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistTargetGapCard extends StatelessWidget {
  final WatchlistItemModel item;

  const WatchlistTargetGapCard({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    final market = item.marketPrice ?? 0;
    final desiredGap = market - item.desiredBuyPrice;
    final maxGap = market - item.maxBuyPrice;

    return Card(
      child: ListTile(
        title: Text(item.title),
        subtitle: Text(
          'Desired gap: ${desiredGap.toStringAsFixed(2)} | '
          'Max gap: ${maxGap.toStringAsFixed(2)}',
        ),
        trailing: Text(
          market.toStringAsFixed(2),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}