import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_status_counter_model.dart';

class InventoryStatusCounterBar extends ConsumerWidget {
  final List<InventoryStatusCounterModel> counters;

  const InventoryStatusCounterBar({
    super.key,
    required this.counters,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: counters
              .map(
                (item) => Chip(
                  label: Text('${i18n.t(item.status.name)}: ${item.count}'),
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}