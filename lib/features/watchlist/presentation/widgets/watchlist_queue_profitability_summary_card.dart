import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_profitability_summary_model.dart';

class WatchlistQueueProfitabilitySummaryCard extends StatelessWidget {
  final WatchlistQueueProfitabilitySummaryModel model;

  const WatchlistQueueProfitabilitySummaryCard({
    super.key,
    required this.model,
  });

  Widget _cell(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                _cell('Queue', model.total.toString()),
                _cell('Buy cost', model.estimatedBuyCost.toStringAsFixed(2)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _cell('Max value', model.estimatedMaxValue.toStringAsFixed(2)),
                _cell('Gap', model.estimatedProfitGap.toStringAsFixed(2)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}