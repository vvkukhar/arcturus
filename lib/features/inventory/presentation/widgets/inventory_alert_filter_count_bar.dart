import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_counts_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_provider.dart';

class InventoryAlertFilterCountBar extends StatelessWidget {
  final InventoryAlertFilter value;
  final InventoryAlertFilterCountsModel counts;
  final ValueChanged<InventoryAlertFilter> onChanged;

  const InventoryAlertFilterCountBar({
    super.key,
    required this.value,
    required this.counts,
    required this.onChanged,
  });

  String _label(InventoryAlertFilter filter) {
    switch (filter) {
      case InventoryAlertFilter.all:
        return 'All';
      case InventoryAlertFilter.lowProfit:
        return 'Low profit';
      case InventoryAlertFilter.heldTooLong:
        return 'Held too long';
      case InventoryAlertFilter.repricing:
        return 'Repricing';
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
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: InventoryAlertFilter.values.map((filter) {
        return ChoiceChip(
          label: Text('${_label(filter)} (${_count(filter)})'),
          selected: value == filter,
          onSelected: (_) => onChanged(filter),
        );
      }).toList(),
    );
  }
}
