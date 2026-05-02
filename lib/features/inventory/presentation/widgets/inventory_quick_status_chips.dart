import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';

class InventoryQuickStatusChips extends StatelessWidget {
  final ItemStatus current;
  final ValueChanged<ItemStatus> onChanged;

  const InventoryQuickStatusChips({
    super.key,
    required this.current,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
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
          label: Text(status.name),
          selected: current == status,
          onSelected: (_) => onChanged(status),
        );
      }).toList(),
    );
  }
}