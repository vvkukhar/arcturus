import 'package:flutter/material.dart';

class DealResultBadge extends StatelessWidget {
  final String label;

  const DealResultBadge({
    super.key,
    required this.label,
  });

  Color _color() {
    switch (label) {
      case 'buy':
        return Colors.green;
      case 'consider':
        return Colors.orange;
      case 'skip':
        return Colors.redAccent;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _color();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
