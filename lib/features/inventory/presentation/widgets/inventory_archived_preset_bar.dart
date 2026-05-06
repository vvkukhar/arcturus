import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_archived_preset_model.dart';

class InventoryArchivedPresetBar extends ConsumerWidget {
  final bool showArchived;
  final ValueChanged<bool> onChanged;

  const InventoryArchivedPresetBar({
    super.key,
    required this.showArchived,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: InventoryArchivedPresetModel.values.map((preset) {
        return ChoiceChip(
          label: Text(i18n.t(preset.title)),
          selected: showArchived == preset.showArchived,
          onSelected: (_) => onChanged(preset.showArchived),
        );
      }).toList(),
    );
  }
}