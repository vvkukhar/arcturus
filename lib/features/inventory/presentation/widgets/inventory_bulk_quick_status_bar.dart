import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryBulkQuickStatusBar extends ConsumerWidget {
  final int selectedCount;
  final ValueChanged<ItemStatus> onApplyStatus;

  const InventoryBulkQuickStatusBar({
    super.key,
    required this.selectedCount,
    required this.onApplyStatus,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (selectedCount == 0) return const SizedBox.shrink();
    final i18n = ref.watch(i18nProvider.notifier);

    final statuses = <ItemStatus>[
      ItemStatus.purchased,
      ItemStatus.listed,
      ItemStatus.reserved,
      ItemStatus.sold,
      ItemStatus.archived,
    ];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: statuses.map((status) {
            return FilledButton.tonal(
              onPressed: () => onApplyStatus(status),
              child: Text('${i18n.t('Set')} ${i18n.t(status.name)}'),
            );
          }).toList(),
        ),
      ),
    );
  }
}