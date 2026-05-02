import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_action_type.dart';

class MarketBulkActionBar extends StatelessWidget {
  final int selectedCount;
  final ValueChanged<MarketBulkActionType> onAction;
  final VoidCallback onClear;

  const MarketBulkActionBar({
    super.key,
    required this.selectedCount,
    required this.onAction,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedCount == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilledButton.tonal(
              onPressed: () => onAction(MarketBulkActionType.delete),
              child: const Text('Delete selected'),
            ),
            FilledButton.tonal(
              onPressed: () => onAction(MarketBulkActionType.duplicate),
              child: const Text('Duplicate selected'),
            ),
            OutlinedButton(
              onPressed: onClear,
              child: const Text('Clear'),
            ),
          ],
        ),
      ),
    );
  }
}