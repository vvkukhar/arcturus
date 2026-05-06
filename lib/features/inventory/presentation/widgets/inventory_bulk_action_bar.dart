import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_type.dart';

class InventoryBulkActionBar extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    if (selectedCount == 0) return const SizedBox.shrink();
    final i18n = ref.watch(i18nProvider.notifier);

    return PopupMenuButton<InventoryBulkActionType>(
      onSelected: onAction,
      itemBuilder: (context) => [
        PopupMenuItem(
          value: InventoryBulkActionType.markInStock,
          child: Text(i18n.t('Mark In Stock')),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.markListed,
          child: Text(i18n.t('Mark Listed')),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.markSold,
          child: Text(i18n.t('Mark Sold')),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.setMarketPrice,
          child: Text(i18n.t('Set = Market')),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.setMarketMinus5,
          child: Text(i18n.t('Set = Market -5%')),
        ),
        PopupMenuItem(
          value: InventoryBulkActionType.setMarketMinus10,
          child: Text(i18n.t('Set = Market -10%')),
        ),
      ],
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  '${i18n.t('Selected')}: $selectedCount',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
              TextButton(
                onPressed: onClear,
                child: Text(i18n.t('common.clear')),
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