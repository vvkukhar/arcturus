import 'package:flutter/material.dart';

class SaleStatusBadge extends StatelessWidget {
  final String label;

  const SaleStatusBadge({
    super.key,
    required this.label,
  });

  Color _color() {
    switch (label) {
      case 'high profit':
        return Colors.green;
      case 'normal':
        return Colors.orange;
      case 'low':
        return Colors.redAccent;
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