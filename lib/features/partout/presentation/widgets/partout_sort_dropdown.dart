import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/partout/application/partout_sort_option.dart';

class PartOutSortDropdown extends ConsumerWidget {
  final PartOutSortOption value;
  final ValueChanged<PartOutSortOption?> onChanged;

  const PartOutSortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(PartOutSortOption option, I18nNotifier i18n) {
    switch (option) {
      case PartOutSortOption.newest:
        return i18n.t('Newest');
      case PartOutSortOption.oldest:
        return i18n.t('Oldest');
      case PartOutSortOption.titleAsc:
        return i18n.t('Title A-Z');
      case PartOutSortOption.titleDesc:
        return i18n.t('Title Z-A');
      case PartOutSortOption.costHighToLow:
        return i18n.t('Cost High-Low');
      case PartOutSortOption.expectedHighToLow:
        return i18n.t('Expected High-Low');
      case PartOutSortOption.actualHighToLow:
        return i18n.t('Actual High-Low');
      case PartOutSortOption.profitExpectedHighToLow:
        return i18n.t('Expected Profit');
      case PartOutSortOption.profitActualHighToLow:
        return i18n.t('Actual Profit');
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return DropdownButtonFormField<PartOutSortOption>(
      value: value,
      decoration: InputDecoration(labelText: i18n.t('Sort')),
      items: PartOutSortOption.values
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