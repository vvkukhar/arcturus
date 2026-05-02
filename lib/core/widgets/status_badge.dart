// lib/core/widgets/status_badge.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';

class StatusBadge extends StatelessWidget {
  final ItemStatus status;

  const StatusBadge({
    super.key,
    required this.status,
  });

  Color _color() {
    switch (status) {
      case ItemStatus.sold:
        return Colors.green;
      case ItemStatus.listed:
        return Colors.blue;
      case ItemStatus.archived:
        return Colors.grey;
      default:
        return Colors.orange;
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
        status.name,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
