import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_item_model.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_alert_action_chips.dart';

class InventoryAlertCenterCard extends StatelessWidget {
  final List<InventoryAlertItemModel> items;
  final VoidCallback? onOpenRepricing;
  final VoidCallback? onOpenOldestHeld;
  final VoidCallback? onOpenLowProfit;

  const InventoryAlertCenterCard({
    super.key,
    required this.items,
    this.onOpenRepricing,
    this.onOpenOldestHeld,
    this.onOpenLowProfit,
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(14),
          child: Text('No inventory alerts right now.'),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Alert Center',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            if (onOpenRepricing != null &&
                onOpenOldestHeld != null &&
                onOpenLowProfit != null) ...[
              const SizedBox(height: 10),
              InventoryAlertActionChips(
                onOpenRepricing: onOpenRepricing!,
                onOpenOldestHeld: onOpenOldestHeld!,
                onOpenLowProfit: onOpenLowProfit!,
              ),
            ],
            const SizedBox(height: 10),
            ...items.take(6).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text('${item.title} • ${item.reason}'),
                  ),
                ),
          ],
        ),
      ),
    );
  }
}