import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_hint_model.dart';

class WatchlistQueueExecutionHintCard extends StatelessWidget {
  final WatchlistQueueExecutionHintModel model;

  const WatchlistQueueExecutionHintCard({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Text(
          model.label,
          style: const TextStyle(
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}