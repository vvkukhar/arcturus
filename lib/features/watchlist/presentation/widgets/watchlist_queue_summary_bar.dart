import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_summary_model.dart';

class WatchlistQueueSummaryBar extends StatelessWidget {
  final WatchlistQueueSummaryModel model;

  const WatchlistQueueSummaryBar({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          children: [
            Chip(label: Text('Total: ${model.total}')),
            Chip(label: Text('Strong: ${model.strong}')),
            Chip(
              label: Text('Avg spread: ${model.avgSpread.toStringAsFixed(1)}'),
            ),
          ],
        ),
      ),
    );
  }
}