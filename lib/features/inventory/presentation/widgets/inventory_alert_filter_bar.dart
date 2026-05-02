import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_provider.dart';

class InventoryAlertFilterBar extends StatelessWidget {
  final InventoryAlertFilter value;
  final ValueChanged<InventoryAlertFilter> onChanged;

  const InventoryAlertFilterBar({
    super.key,
    required this.value,
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

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: InventoryAlertFilter.values.map((filter) {
        return ChoiceChip(
          label: Text(_label(filter)),
          selected: value == filter,
          onSelected: (_) => onChanged(filter),
        );
      }).toList(),
    );
  }
}
