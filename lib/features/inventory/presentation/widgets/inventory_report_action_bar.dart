import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryReportActionBar extends ConsumerWidget {
  final VoidCallback onSaveInventoryReport;
  final VoidCallback onSaveDeadStockReport;

  const InventoryReportActionBar({
    super.key,
    required this.onSaveInventoryReport,
    required this.onSaveDeadStockReport,
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
              onPressed: onSaveInventoryReport,
              icon: const Icon(Icons.note_alt_outlined),
              label: Text(i18n.t('Inventory Report')),
            ),
            FilledButton.tonalIcon(
              onPressed: onSaveDeadStockReport,
              icon: const Icon(Icons.warning_amber_outlined),
              label: Text(i18n.t('Dead Stock Report')),
            ),
          ],
        ),
      ),
    );
  }
}