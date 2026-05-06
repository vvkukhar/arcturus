import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class DeadStockCenterBar extends ConsumerWidget {
  final VoidCallback onOpenInventory;
  final VoidCallback onSaveReport;

  const DeadStockCenterBar({
    super.key,
    required this.onOpenInventory,
    required this.onSaveReport,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.tonalIcon(
              onPressed: onOpenInventory,
              icon: const Icon(Icons.inventory_outlined),
              label: Text(i18n.t('Open Inventory')),
            ),
            FilledButton.tonalIcon(
              onPressed: onSaveReport,
              icon: const Icon(Icons.note_add_outlined),
              label: Text(i18n.t('Save Report')),
            ),
          ],
        ),
      ),
    );
  }
}