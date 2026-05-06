import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class WatchlistBulkActionBar extends ConsumerWidget {
  final int selectedCount;
  final VoidCallback onActivate;
  final VoidCallback onDeactivate;
  final VoidCallback onDelete;
  final VoidCallback onClear;

  const WatchlistBulkActionBar({
    super.key,
    required this.selectedCount,
    required this.onActivate,
    required this.onDeactivate,
    required this.onDelete,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (selectedCount == 0) return const SizedBox.shrink();

    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    '${i18n.t('Selected')}: $selectedCount',
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: onClear,
                  child: Text(i18n.t('common.clear')),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                FilledButton.tonalIcon(
                  onPressed: onActivate,
                  icon: const Icon(Icons.check_circle_outline),
                  label: Text(i18n.t('Activate')),
                ),
                FilledButton.tonalIcon(
                  onPressed: onDeactivate,
                  icon: const Icon(Icons.pause_circle_outline),
                  label: Text(i18n.t('Deactivate')),
                ),
                FilledButton.tonalIcon(
                  onPressed: onDelete,
                  icon: const Icon(Icons.delete_outline),
                  label: Text(i18n.t('common.delete')),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}