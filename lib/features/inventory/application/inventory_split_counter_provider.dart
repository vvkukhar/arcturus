import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_split_counter_model.dart';

final inventorySplitCounterProvider =
    Provider<InventorySplitCounterModel>((ref) {
  final state = ref.watch(inventoryControllerProvider);

  final active =
      state.allItems.where((e) => e.status != ItemStatus.archived).length;

  final archived =
      state.allItems.where((e) => e.status == ItemStatus.archived).length;

  return InventorySplitCounterModel(
    active: active,
    archived: archived,
  );
});