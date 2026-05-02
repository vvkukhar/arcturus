import 'package:flutter/material.dart';

class InventoryAlertActionChips extends StatelessWidget {
  final VoidCallback onOpenRepricing;
  final VoidCallback onOpenOldestHeld;
  final VoidCallback onOpenLowProfit;

  const InventoryAlertActionChips({
    super.key,
    required this.onOpenRepricing,
    required this.onOpenOldestHeld,
    required this.onOpenLowProfit,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        ActionChip(
          label: const Text('Repricing'),
          onPressed: onOpenRepricing,
        ),
        ActionChip(
          label: const Text('Oldest held'),
          onPressed: onOpenOldestHeld,
        ),
        ActionChip(
          label: const Text('Low profit'),
          onPressed: onOpenLowProfit,
        ),
      ],
    );
  }
}
