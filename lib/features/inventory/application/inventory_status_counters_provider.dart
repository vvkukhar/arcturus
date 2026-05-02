import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_status_counter_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_visible_items_provider.dart';

final inventoryStatusCountersProvider =
    Provider<List<InventoryStatusCounterModel>>((ref) {
  final items = ref.watch(inventoryVisibleItemsProvider);

  return ItemStatus.values.map((status) {
    return InventoryStatusCounterModel(
      status: status,
      count: items.where((e) => e.status == status).length,
    );
  }).toList();
});