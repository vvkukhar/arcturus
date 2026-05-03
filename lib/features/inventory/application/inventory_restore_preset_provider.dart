import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_preset_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_preset_persistence_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_selected_preset_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_ui_controller.dart';

final inventoryRestorePresetProvider = Provider<void Function()>((ref) {
  return () {
    final savedId = ref.read(inventoryPresetPersistenceProvider);
    if (savedId == null) return;

    for (final preset in InventoryPresetModel.presets) {
      if (preset.id != savedId) continue;

      ref.read(inventoryUiControllerProvider.notifier).setFilter(preset.filter);
      ref.read(inventoryUiControllerProvider.notifier).setSort(preset.sort);
      ref.read(inventorySelectedPresetProvider.notifier).set(preset.id);
      break;
    }
  };
});