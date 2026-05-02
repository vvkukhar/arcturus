import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_affordability_summary_model.dart';

class WatchlistQueueAffordabilitySummaryCard extends StatelessWidget {
  final WatchlistQueueAffordabilitySummaryModel model;

  const WatchlistQueueAffordabilitySummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    final color = model.enoughCash ? Colors.green : Colors.orange;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                model.label,
                style: const TextStyle(
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            Text(
              model.remainingCash.toStringAsFixed(2),
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}