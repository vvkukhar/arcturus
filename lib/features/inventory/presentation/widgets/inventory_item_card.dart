import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/widgets/status_badge.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_item_profit_row.dart';
import 'package:lego_trading_manager/features/settings/application/app_settings_controller.dart';

class InventoryItemCard extends ConsumerWidget {
  final ItemModel item;
  final VoidCallback onTap;
  final VoidCallback? onLongPress;
  final bool isSelectionMode;
  final bool isSelected;

  const InventoryItemCard({
    super.key,
    required this.item,
    required this.onTap,
    this.onLongPress,
    this.isSelectionMode = false,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final expectedProfit = (item.expectedSalePrice ?? 0) - item.totalCost;
    final currency = ref.watch(appSettingsControllerProvider).baseCurrency;

    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      onLongPress: onLongPress,
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: isSelected
              ? BorderSide(
                  color: Theme.of(context).colorScheme.primary,
                  width: 1.5,
                )
              : BorderSide.none,
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  if (isSelectionMode) ...[
                    Icon(
                      isSelected
                          ? Icons.check_circle
                          : Icons.radio_button_unchecked,
                    ),
                    const SizedBox(width: 10),
                  ],
                  Expanded(
                    child: Text(
                      item.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  StatusBadge(status: item.status),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                '${item.type.name} • ${item.theme ?? '-'} • ${item.ownershipType.name}',
              ),
              const SizedBox(height: 8),
              InventoryItemProfitRow(
                cost: item.totalCost,
                marketAverage: item.marketAverage ?? 0,
                expectedProfit: expectedProfit,
                days: item.daysInInventory ?? 0,
                currency: currency,
              ),
              if (item.tags.isNotEmpty) ...[
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: item.tags
                      .map(
                        (tag) => Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white10,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(tag),
                        ),
                      )
                      .toList(),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}