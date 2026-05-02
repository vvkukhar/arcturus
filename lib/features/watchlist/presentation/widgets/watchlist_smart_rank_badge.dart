import 'package:flutter/material.dart';

class WatchlistSmartRankBadge extends StatelessWidget {
  final String label;

  const WatchlistSmartRankBadge({
    super.key,
    required this.label,
  });

  Color _color() {
    switch (label) {
      case 'top':
        return Colors.green;
      case 'good':
        return Colors.orange;
      default:
        return Colors.blueGrey;
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