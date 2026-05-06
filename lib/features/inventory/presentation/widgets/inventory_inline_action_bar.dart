import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryInlineActionBar extends ConsumerWidget {
  final VoidCallback? onMarkListed;
  final VoidCallback? onMarkSold;
  final VoidCallback? onArchive;

  const InventoryInlineActionBar({
    super.key,
    this.onMarkListed,
    this.onMarkSold,
    this.onArchive,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilledButton.tonalIcon(
          onPressed: onMarkListed,
          icon: const Icon(Icons.sell_outlined),
          label: Text(i18n.t('List')),
        ),
        FilledButton.tonalIcon(
          onPressed: onMarkSold,
          icon: const Icon(Icons.check_circle_outline),
          label: Text(i18n.t('Sold')),
        ),
        FilledButton.tonalIcon(
          onPressed: onArchive,
          icon: const Icon(Icons.archive_outlined),
          label: Text(i18n.t('Archive')),
        ),
      ],
    );
  }
}