import 'package:flutter/material.dart';

class WatchlistPriorityBadge extends StatelessWidget {
  final String label;

  const WatchlistPriorityBadge({
    super.key,
    required this.label,
  });

  Color _color() {
    switch (label) {
      case 'high':
        return Colors.green;
      case 'mid':
        return Colors.orange;
      default:
        return Colors.grey;
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