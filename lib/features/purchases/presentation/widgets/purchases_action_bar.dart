import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class PurchasesActionBar extends ConsumerWidget {
  final VoidCallback onAdd;
  final VoidCallback onExport;
  final VoidCallback onSaveReport;

  const PurchasesActionBar({
    super.key,
    required this.onAdd,
    required this.onExport,
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
            FilledButton.icon(
              onPressed: onAdd,
              icon: const Icon(Icons.add),
              label: Text(i18n.t('Add Purchase')),
            ),
            FilledButton.tonalIcon(
              onPressed: onExport,
              icon: const Icon(Icons.file_download_outlined),
              label: Text(i18n.t('Export')),
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