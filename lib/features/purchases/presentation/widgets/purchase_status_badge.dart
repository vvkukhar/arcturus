import 'package:flutter/material.dart';

class PurchaseStatusBadge extends StatelessWidget {
  final String label;

  const PurchaseStatusBadge({
    super.key,
    required this.label,
  });

  Color _color() {
    switch (label) {
      case 'large':
        return Colors.orange;
      case 'normal':
        return Colors.green;
      case 'small':
        return Colors.blueGrey;
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