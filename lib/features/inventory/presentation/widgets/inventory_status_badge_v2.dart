import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';

class InventoryStatusBadgeV2 extends StatelessWidget {
  final ItemStatus status;

  const InventoryStatusBadgeV2({
    super.key,
    required this.status,
  });

  Color _color() {
    switch (status) {
      case ItemStatus.planned:
        return Colors.grey;
      case ItemStatus.purchased:
        return Colors.indigo;
      case ItemStatus.received:
        return Colors.blue;
      case ItemStatus.inDelivery:
        return Colors.cyan;
      case ItemStatus.restoring:
        return Colors.deepPurple;
      case ItemStatus.readyForSale:
        return Colors.teal;
      case ItemStatus.listed:
        return Colors.orange;
      case ItemStatus.reserved:
        return Colors.purple;
      case ItemStatus.sold:
        return Colors.green;
      case ItemStatus.archived:
        return Colors.blueGrey;
      case ItemStatus.found:
        return Colors.amber;
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
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}