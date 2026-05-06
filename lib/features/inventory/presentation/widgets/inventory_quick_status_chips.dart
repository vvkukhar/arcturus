import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryQuickStatusChips extends ConsumerWidget {
  final ItemStatus current;
  final ValueChanged<ItemStatus> onChanged;

  const InventoryQuickStatusChips({
    super.key,
    required this.current,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final allowed = <ItemStatus>[
      ItemStatus.purchased,
      ItemStatus.listed,
      ItemStatus.reserved,
      ItemStatus.sold,
      ItemStatus.archived,
    ];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: allowed.map((status) {
        return ChoiceChip(
          label: Text(i18n.t(status.name)),
          selected: current == status,
          onSelected: (_) => onChanged(status),
        );
      }).toList(),
    );
  }
}