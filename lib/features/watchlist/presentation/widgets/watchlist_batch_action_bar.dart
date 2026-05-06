import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class WatchlistBatchActionBar extends ConsumerWidget {
  final int selectedCount;
  final VoidCallback onClear;
  final VoidCallback onBuy;

  const WatchlistBatchActionBar({
    super.key,
    required this.selectedCount,
    required this.onClear,
    required this.onBuy,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (selectedCount == 0) return const SizedBox.shrink();

    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Expanded(
              child: Text(
                '${i18n.t('Selected')}: $selectedCount',
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
            TextButton(
              onPressed: onClear,
              child: Text(i18n.t('common.clear')),
            ),
            const SizedBox(width: 8),
            FilledButton(
              onPressed: onBuy,
              child: Text(i18n.t('Buy All')),
            ),
          ],
        ),
      ),
    );
  }
}