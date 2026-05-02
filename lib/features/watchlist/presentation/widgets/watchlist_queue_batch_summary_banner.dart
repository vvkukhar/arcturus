import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_batch_summary_model.dart';

class WatchlistQueueBatchSummaryBanner extends StatelessWidget {
  final WatchlistQueueBatchSummaryModel model;

  const WatchlistQueueBatchSummaryBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model.selectedCount == 0) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.green.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        'Selected ${model.selectedCount} • market ${model.selectedMarketTotal.toStringAsFixed(2)} • max ${model.selectedMaxTotal.toStringAsFixed(2)}',
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}