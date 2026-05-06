import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_provider.dart';

class InventoryAlertFilterBar extends ConsumerWidget {
  final InventoryAlertFilter value;
  final ValueChanged<InventoryAlertFilter> onChanged;

  const InventoryAlertFilterBar({
    super.key,
    required this.value,
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

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: InventoryAlertFilter.values.map((filter) {
        return ChoiceChip(
          label: Text(_label(filter, i18n)),
          selected: value == filter,
          onSelected: (_) => onChanged(filter),
        );
      }).toList(),
    );
  }
}