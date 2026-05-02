import 'package:flutter/material.dart';

class AnalyticsRepriceDiffBadge extends StatelessWidget {
  final double current;
  final double suggested;

  const AnalyticsRepriceDiffBadge({
    super.key,
    required this.current,
    required this.suggested,
  });

  @override
  Widget build(BuildContext context) {
    final diff = suggested - current;
    final positive = diff >= 0;
    final color = positive ? Colors.green : Colors.orange;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        '${positive ? '+' : ''}${diff.toStringAsFixed(2)}',
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
