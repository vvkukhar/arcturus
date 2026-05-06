import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_sort_option.dart';

class MarketSortDropdown extends ConsumerWidget {
  final MarketSortOption value;
  final ValueChanged<MarketSortOption?> onChanged;

  const MarketSortDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  String _label(MarketSortOption option, I18nNotifier i18n) {
    switch (option) {
      case MarketSortOption.newest:
        return i18n.t('Newest');
      case MarketSortOption.oldest:
        return i18n.t('Oldest');
      case MarketSortOption.averageHighToLow:
        return i18n.t('Average High-Low');
      case MarketSortOption.lowHighToLow:
        return i18n.t('Low High-Low');
      case MarketSortOption.highHighToLow:
        return i18n.t('High High-Low');
      case MarketSortOption.sourceAsc:
        return i18n.t('Source A-Z');
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return DropdownButtonFormField<MarketSortOption>(
      value: value,
      decoration: InputDecoration(labelText: i18n.t('Sort')),
      items: MarketSortOption.values
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