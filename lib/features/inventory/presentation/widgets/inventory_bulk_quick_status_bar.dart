import 'package:flutter/material.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';

class InventoryBulkQuickStatusBar extends StatelessWidget {
  final int selectedCount;
  final ValueChanged<ItemStatus> onApplyStatus;

  const InventoryBulkQuickStatusBar({
    super.key,
    required this.selectedCount,
    required this.onApplyStatus,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedCount == 0) return const SizedBox.shrink();

    final statuses = <ItemStatus>[
      ItemStatus.purchased,
      ItemStatus.listed,
      ItemStatus.reserved,
      ItemStatus.sold,
      ItemStatus.archived,
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: statuses.map((status) {
            return FilledButton.tonal(
              onPressed: () => onApplyStatus(status),
              child: Text('Set ${status.name}'),
            );
          }).toList(),
        ),
      ),
    );
  }
}