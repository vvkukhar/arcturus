import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_next_best_action_model.dart';

class WatchlistQueueNextBestActionBanner extends StatelessWidget {
  final WatchlistQueueNextBestActionModel model;

  const WatchlistQueueNextBestActionBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.teal.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        model.label,
        style: const TextStyle(
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}