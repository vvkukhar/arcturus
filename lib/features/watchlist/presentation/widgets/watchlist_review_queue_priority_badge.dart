import 'package:flutter/material.dart';

class WatchlistReviewQueuePriorityBadge extends StatelessWidget {
  final double market;
  final double max;

  const WatchlistReviewQueuePriorityBadge({
    super.key,
    required this.market,
    required this.max,
  });

  @override
  Widget build(BuildContext context) {
    final diff = max - market;
    final high = diff >= 10;
    final color = high ? Colors.green : Colors.orange;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        high ? 'strong' : 'review',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}