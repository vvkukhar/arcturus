import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/presentation/widgets/inventory_filter_button.dart';

class InventoryToolbar extends StatelessWidget {
  final VoidCallback onOpenFilters;
  final Widget sortDropdown;

  const InventoryToolbar({
    super.key,
    required this.onOpenFilters,
    required this.sortDropdown,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: sortDropdown),
        const SizedBox(width: 12),
        InventoryFilterButton(onTap: onOpenFilters),
      ],
    );
  }
}