import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_preset_model.dart';

class InventoryPresetBar extends StatelessWidget {
  final String? selectedPresetId;
  final ValueChanged<InventoryPresetModel> onApplyPreset;
  final VoidCallback onClearPreset;

  const InventoryPresetBar({
    super.key,
    required this.selectedPresetId,
    required this.onApplyPreset,
    required this.onClearPreset,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ...InventoryPresetModel.presets.map(
              (preset) => ChoiceChip(
                label: Text(preset.title),
                selected: selectedPresetId == preset.id,
                onSelected: (_) => onApplyPreset(preset),
              ),
            ),
            if (selectedPresetId != null)
              TextButton(
                onPressed: onClearPreset,
                child: const Text('Clear preset'),
              ),
          ],
        ),
      ),
    );
  }
}