import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_counts_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_provider.dart';

class InventoryAlertFilterCountBar extends ConsumerWidget {
  final InventoryAlertFilter value;
  final InventoryAlertFilterCountsModel counts;
  final ValueChanged<InventoryAlertFilter> onChanged;

  const InventoryAlertFilterCountBar({
    super.key,
    required this.value,
    required this.counts,
    required this.onChanged,
  });

  String _label(InventoryAlertFilter filter, I18nNotifier i18n) {
    switch (filter) {
      case InventoryAlertFilter.all:
        return i18n.t('All');
      case InventoryAlertFilter.lowProfit:
        return i18n.t('Low profit');
      case InventoryAlertFilter.heldTooLong:
        return i18n.t('Held too long');
      case InventoryAlertFilter.repricing:
        return i18n.t('Repricing');
    }
  }

  int _count(InventoryAlertFilter filter) {
    switch (filter) {
      case InventoryAlertFilter.all:
        return counts.all;
      case InventoryAlertFilter.lowProfit:
        return counts.lowProfit;
      case InventoryAlertFilter.heldTooLong:
        return counts.heldTooLong;
      case InventoryAlertFilter.repricing:
        return counts.repricing;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: InventoryAlertFilter.values.map((filter) {
        return ChoiceChip(
          label: Text('${_label(filter, i18n)} (${_count(filter)})'),
          selected: value == filter,
          onSelected: (_) => onChanged(filter),
        );
      }).toList(),
    );
  }
}