import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_pressure_summary_model.dart';

class WatchlistQueueExecutionPressureSummaryCard extends StatelessWidget {
  final WatchlistQueueExecutionPressureSummaryModel model;

  const WatchlistQueueExecutionPressureSummaryCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    if (model.selectedCount == 0) return const SizedBox.shrink();

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
              model.selectedCount.toString(),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}