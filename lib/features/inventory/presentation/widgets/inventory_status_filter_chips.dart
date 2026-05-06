import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class InventoryStatusFilterChips extends ConsumerWidget {
  final ItemStatus? value;
  final ValueChanged<ItemStatus?> onChanged;

  const InventoryStatusFilterChips({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    final allStatuses = <ItemStatus?>[null, ...ItemStatus.values];

    String label(ItemStatus? status) {
      if (status == null) return i18n.t('All');
      return i18n.t(status.name);
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: allStatuses.map((status) {
        return ChoiceChip(
          label: Text(label(status)),
          selected: value == status,
          onSelected: (_) => onChanged(status),
        );
      }).toList(),
    );
  }
}