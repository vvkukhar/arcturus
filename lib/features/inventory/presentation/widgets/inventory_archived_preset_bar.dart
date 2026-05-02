import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_archived_preset_model.dart';

class InventoryArchivedPresetBar extends StatelessWidget {
  final bool showArchived;
  final ValueChanged<bool> onChanged;

  const InventoryArchivedPresetBar({
    super.key,
    required this.showArchived,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: InventoryArchivedPresetModel.values.map((preset) {
        return ChoiceChip(
          label: Text(preset.title),
          selected: showArchived == preset.showArchived,
          onSelected: (_) => onChanged(preset.showArchived),
        );
      }).toList(),
    );
  }
}