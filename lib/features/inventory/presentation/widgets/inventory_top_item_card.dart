import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class InventoryTopItemCard extends ConsumerWidget {
  final ItemModel item;
  final String subtitle;
  final String trailing;

  const InventoryTopItemCard({
    super.key,
    required this.item,
    required this.subtitle,
    required this.trailing,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      child: ListTile(
        title: Text(item.title),
        subtitle: Text(subtitle),
        trailing: Text(
          trailing,
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}