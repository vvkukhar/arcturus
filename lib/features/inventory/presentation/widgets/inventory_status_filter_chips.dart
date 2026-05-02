import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';

class InventoryStatusFilterChips extends StatelessWidget {
  final ItemStatus? value;
  final ValueChanged<ItemStatus?> onChanged;

  const InventoryStatusFilterChips({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final allStatuses = <ItemStatus?>[null, ...ItemStatus.values];

    String label(ItemStatus? status) {
      if (status == null) return 'All';
      return status.name;
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: allStatuses.map((status) {
        return ChoiceChip(
          label: Text(label(status)),
          selected: value == status,
          onSelected: (_) => onChanged(status),
        );
      }).toList(),
    );
  }
}
