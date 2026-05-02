import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

final inventoryArchivedCounterProvider = Provider<int>((ref) {
  final state = ref.watch(inventoryControllerProvider);
  return state.allItems.where((e) => e.status == ItemStatus.archived).length;
});