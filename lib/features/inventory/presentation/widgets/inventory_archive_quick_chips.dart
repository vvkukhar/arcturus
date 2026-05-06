import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryArchiveQuickChips extends ConsumerWidget {
  final bool showArchived;
  final int archivedCount;
  final ValueChanged<bool> onChanged;

  const InventoryArchiveQuickChips({
    super.key,
    required this.showArchived,
    required this.archivedCount,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        FilterChip(
          label: Text(i18n.t('Active only')),
          selected: !showArchived,
          onSelected: (_) => onChanged(false),
        ),
        FilterChip(
          label: Text('${i18n.t('With archived')} ($archivedCount)'),
          selected: showArchived,
          onSelected: (_) => onChanged(true),
        ),
      ],
    );
  }
}