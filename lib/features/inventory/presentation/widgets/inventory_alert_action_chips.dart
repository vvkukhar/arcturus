import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryAlertActionChips extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        ActionChip(
          label: Text(i18n.t('Repricing')),
          onPressed: onOpenRepricing,
        ),
        ActionChip(
          label: Text(i18n.t('Oldest held')),
          onPressed: onOpenOldestHeld,
        ),
        ActionChip(
          label: Text(i18n.t('Low profit')),
          onPressed: onOpenLowProfit,
        ),
      ],
    );
  }
}