import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/item_timeline_event_model.dart';

class ItemTimelineCard extends StatelessWidget {
  final ItemTimelineEventModel event;

  const ItemTimelineCard({
    super.key,
    required this.event,
  });

  IconData _icon() {
    switch (event.type) {
      case 'purchase':
        return Icons.shopping_cart_checkout_outlined;
      case 'sale':
        return Icons.sell_outlined;
      case 'market':
        return Icons.query_stats_outlined;
      default:
        return Icons.inventory_2_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateText = event.date == null
        ? '-'
        : event.date!.toIso8601String().split('T').first;

    return Card(
      child: ListTile(
        leading: Icon(_icon()),
        title: Text(event.title),
        subtitle: Text(event.subtitle),
        trailing: Text(dateText),
      ),
    );
  }
}