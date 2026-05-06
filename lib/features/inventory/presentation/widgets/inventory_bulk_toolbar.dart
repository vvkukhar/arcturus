import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryBulkToolbar extends ConsumerWidget {
  final int totalCount;
  final int selectedCount;
  final VoidCallback onSelectAll;
  final VoidCallback onClearSelection;

  const InventoryBulkToolbar({
    super.key,
    required this.totalCount,
    required this.selectedCount,
    required this.onSelectAll,
    required this.onClearSelection,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                '${i18n.t('Selected')} $selectedCount ${i18n.t('of')} $totalCount',
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            TextButton(
              onPressed: onSelectAll,
              child: Text(i18n.t('Select all')),
            ),
            TextButton(
              onPressed: onClearSelection,
              child: Text(i18n.t('common.clear')),
            ),
          ],
        ),
      ),
    );
  }
}