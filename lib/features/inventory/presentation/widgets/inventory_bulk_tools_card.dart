import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryBulkToolsCard extends ConsumerWidget {
  final int selectedCount;
  final VoidCallback onOpenReprice;
  final VoidCallback onSelectAllVisible;
  final VoidCallback onClearSelection;

  const InventoryBulkToolsCard({
    super.key,
    required this.selectedCount,
    required this.onOpenReprice,
    required this.onSelectAllVisible,
    required this.onClearSelection,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (selectedCount == 0) return const SizedBox.shrink();
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            FilledButton.tonalIcon(
              onPressed: onOpenReprice,
              icon: const Icon(Icons.sell_outlined),
              label: Text(i18n.t('Bulk Reprice')),
            ),
            FilledButton.tonalIcon(
              onPressed: onSelectAllVisible,
              icon: const Icon(Icons.select_all),
              label: Text(i18n.t('Select Visible')),
            ),
            FilledButton.tonalIcon(
              onPressed: onClearSelection,
              icon: const Icon(Icons.clear_all),
              label: Text(i18n.t('Clear Selection')),
            ),
          ],
        ),
      ),
    );
  }
}