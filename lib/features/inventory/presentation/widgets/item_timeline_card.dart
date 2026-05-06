import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/item_timeline_event_model.dart';

class ItemTimelineCard extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final dateText = event.date == null
        ? '-'
        : event.date!.toIso8601String().split('T').first;

    return Card(
      child: ListTile(
        leading: Icon(_icon()),
        title: Text(i18n.t(event.title)),
        subtitle: Text(i18n.t(event.subtitle)),
        trailing: Text(dateText),
      ),
    );
  }
}