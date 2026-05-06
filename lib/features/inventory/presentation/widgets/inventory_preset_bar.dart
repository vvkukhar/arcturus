import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_preset_model.dart';

class InventoryPresetBar extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ...InventoryPresetModel.presets.map(
              (preset) => ChoiceChip(
                label: Text(i18n.t(preset.title)),
                selected: selectedPresetId == preset.id,
                onSelected: (_) => onApplyPreset(preset),
              ),
            ),
            if (selectedPresetId != null)
              TextButton(
                onPressed: onClearPreset,
                child: Text(i18n.t('Clear preset')),
              ),
          ],
        ),
      ),
    );
  }
}