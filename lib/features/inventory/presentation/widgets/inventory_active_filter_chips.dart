import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_filter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';

class InventoryActiveFilterChips extends ConsumerWidget {
  final InventoryFilterModel filter;
  final InventorySortOption sort;
  final VoidCallback onClearAll;

  const InventoryActiveFilterChips({
    super.key,
    required this.filter,
    required this.sort,
    required this.onClearAll,
  });

  String _sortLabel(I18nNotifier i18n) {
    switch (sort) {
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
    final chips = <Widget>[
      Chip(label: Text('${i18n.t('Sort')}: ${_sortLabel(i18n)}')),
    ];

    if (filter.status != null) {
      chips.add(Chip(label: Text('${i18n.t('Status')}: ${i18n.t(filter.status!.name)}')));
    }
    if (filter.trackedOnly) {
      chips.add(Chip(label: Text(i18n.t('Tracked only'))));
    }
    if ((filter.themeContains ?? '').trim().isNotEmpty) {
      chips.add(Chip(label: Text('${i18n.t('Theme')}: ${filter.themeContains}')));
    }

    final hasExtraFilters = filter.status != null ||
        filter.trackedOnly ||
        (filter.themeContains ?? '').trim().isNotEmpty;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: chips,
            ),
            if (hasExtraFilters) ...[
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: onClearAll,
                  child: Text(i18n.t('Clear filters')),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}