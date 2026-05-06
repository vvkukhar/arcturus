import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_action_type.dart';

class MarketBulkActionBar extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    if (selectedCount == 0) return const SizedBox.shrink();
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilledButton.tonal(
              onPressed: () => onAction(MarketBulkActionType.delete),
              child: Text(i18n.t('Delete selected')),
            ),
            FilledButton.tonal(
              onPressed: () => onAction(MarketBulkActionType.duplicate),
              child: Text(i18n.t('Duplicate selected')),
            ),
            OutlinedButton(
              onPressed: onClear,
              child: Text(i18n.t('common.clear')),
            ),
          ],
        ),
      ),
    );
  }
}