import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';

class InventorySortDropdown extends ConsumerWidget {
  final InventorySortOption value;
  final ValueChanged<InventorySortOption?> onChanged;

  const InventorySortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(InventorySortOption option, I18nNotifier i18n) {
    switch (option) {
      case InventorySortOption.newest:
        return i18n.t('Newest');
      case InventorySortOption.oldest:
        return i18n.t('Oldest');
      case InventorySortOption.titleAsc:
        return i18n.t('Title A-Z');
      case InventorySortOption.costHighToLow:
        return i18n.t('Cost High-Low');
      case InventorySortOption.costLowToHigh:
        return i18n.t('Cost Low-High');
      case InventorySortOption.expectedProfitHighToLow:
        return i18n.t('Profit High-Low');
      case InventorySortOption.daysInInventoryHighToLow:
        return i18n.t('Oldest Held');
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return DropdownButtonFormField<InventorySortOption>(
      value: value,
      decoration: InputDecoration(labelText: i18n.t('Sort')),
      items: InventorySortOption.values
          .map(
            (option) => DropdownMenuItem(
              value: option,
              child: Text(_label(option, i18n)),
            ),
          )
          .toList(),
      onChanged: onChanged,
    );
  }
}