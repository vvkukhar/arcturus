import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_commit_hint_model.dart';

class WatchlistQueueCommitHintBanner extends StatelessWidget {
  final WatchlistQueueCommitHintModel model;

  const WatchlistQueueCommitHintBanner({
    super.key,
    required this.model,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.blue.withValues(alpha: 0.12),
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