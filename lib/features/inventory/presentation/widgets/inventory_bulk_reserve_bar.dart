import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryBulkReserveBar extends ConsumerWidget {
  final int selectedCount;
  final VoidCallback onReserve;
  final VoidCallback onUnreserve;

  const InventoryBulkReserveBar({
    super.key,
    required this.selectedCount,
    required this.onReserve,
    required this.onUnreserve,
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
            FilledButton.tonalIcon(
              onPressed: onReserve,
              icon: const Icon(Icons.lock_outline),
              label: Text(i18n.t('Reserve Selected')),
            ),
            FilledButton.tonalIcon(
              onPressed: onUnreserve,
              icon: const Icon(Icons.lock_open_outlined),
              label: Text(i18n.t('Unreserve Selected')),
            ),
          ],
        ),
      ),
    );
  }
}