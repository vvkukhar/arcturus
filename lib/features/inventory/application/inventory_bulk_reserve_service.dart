import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';

class InventoryBulkReserveService {
  final Ref ref;

  InventoryBulkReserveService(this.ref);

  Future<int> reserve(Set<String> ids) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final items = repo.getAllItems();

    int affected = 0;
    final next = items.map((item) {
      if (!ids.contains(item.id)) return item;
      affected++;
      return item.copyWith(status: ItemStatus.reserved);
    }).toList();

    for (final item in next) {
      await repo.updateItem(item);
    }

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory bulk reserve',
          subtitle: 'reserved $affected items',
        );

    return affected;
  }

  Future<int> unreserve(Set<String> ids) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final items = repo.getAllItems();

    int affected = 0;
    final next = items.map((item) {
      if (!ids.contains(item.id)) return item;
      if (item.status != ItemStatus.reserved) return item;
      affected++;
      return item.copyWith(status: ItemStatus.purchased);
    }).toList();

    for (final item in next) {
      await repo.updateItem(item);
    }

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory bulk unreserve',
          subtitle: 'unreserved $affected items',
        );

    return affected;
  }
}

final inventoryBulkReserveProvider =
    Provider<InventoryBulkReserveService>((ref) {
  return InventoryBulkReserveService(ref);
});