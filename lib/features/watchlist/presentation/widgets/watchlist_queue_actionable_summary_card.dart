import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_model.dart';

class WatchlistQueueActionableSummaryCard extends StatelessWidget {
  final WatchlistQueueActionableSummaryModel model;

  const WatchlistQueueActionableSummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model.selectedCount == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              model.label,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Selected ${model.selectedCount} • spend ${model.selectedSpend.toStringAsFixed(2)} • gap ${model.selectedGap.toStringAsFixed(2)}',
            ),
          ],
        ),
      ),
    );
  }
}