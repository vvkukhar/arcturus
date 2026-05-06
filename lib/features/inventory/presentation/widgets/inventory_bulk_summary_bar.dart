import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryBulkSummaryBar extends ConsumerWidget {
  final int selectedCount;
  final int totalVisibleCount;
  final VoidCallback onSelectAll;
  final VoidCallback onClear;

  const InventoryBulkSummaryBar({
    super.key,
    required this.selectedCount,
    required this.totalVisibleCount,
    required this.onSelectAll,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                const Icon(Icons.checklist_rtl),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    '${i18n.t('Selected')}: $selectedCount / $totalVisibleCount',
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                OutlinedButton.icon(
                  onPressed: onSelectAll,
                  icon: const Icon(Icons.select_all),
                  label: Text(i18n.t('Select All Visible')),
                ),
                OutlinedButton.icon(
                  onPressed: onClear,
                  icon: const Icon(Icons.clear_all),
                  label: Text(i18n.t('common.clear')),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}