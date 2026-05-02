import 'package:flutter/material.dart';

class WatchlistQueueAffordabilityBadge extends StatelessWidget {
  final String label;

  const WatchlistQueueAffordabilityBadge({
    super.key,
    required this.label,
  });

  Color _color() {
    switch (label) {
      case 'affordable':
        return Colors.green;
      case 'tight':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}