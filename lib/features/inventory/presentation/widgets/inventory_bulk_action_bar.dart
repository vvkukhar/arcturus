// lib/features/inventory/presentation/widgets/inventory_bulk_action_bar.dart
import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_type.dart';

class InventoryBulkActionBar extends StatelessWidget {
  final int selectedCount;
  final ValueChanged<InventoryBulkActionType> onAction;
  final VoidCallback onClear;

  const InventoryBulkActionBar({
    super.key,
    required this.selectedCount,
    required this.onAction,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedCount == 0) return const SizedBox.shrink();

    return PopupMenuButton<InventoryBulkActionType>(
      onSelected: onAction,
      itemBuilder: (context) => const [
        PopupMenuItem(
          value: InventoryBulkActionType.markInStock,
          child: Text('Mark In Stock'),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.markListed,
          child: Text('Mark Listed'),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.markSold,
          child: Text('Mark Sold'),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.setMarketPrice,
          child: Text('Set = Market'),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.setMarketMinus5,
          child: Text('Set = Market -5%'),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.setMarketMinus10,
          child: Text('Set = Market -10%'),
        ),
      ],
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  'Selected: $selectedCount',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
              TextButton(
                onPressed: onClear,
                child: const Text('Clear'),
              ),
              const SizedBox(width: 8),
              const Icon(Icons.tune),
            ],
          ),
        ),
      ),
    );
  }
}
