import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_readiness_score_model.dart';

class WatchlistQueueReadinessScoreCard extends StatelessWidget {
  final WatchlistQueueReadinessScoreModel model;

  const WatchlistQueueReadinessScoreCard({
    super.key,
    required this.model,
  });

  Color _color() {
    switch (model.label) {
      case 'ready':
        return Colors.green;
      case 'partial':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            const Expanded(
              child: Text(
                'Queue readiness',
                style: TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                '${model.label} • ${model.score.toStringAsFixed(0)}',
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}