import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';

class InventoryReserveToggleService {
  final Ref ref;

  InventoryReserveToggleService(this.ref);

  Future<void> toggle(String itemId) async {
    final repo = InventoryRepository();
    final item = repo.getById(itemId);
    if (item == null) return;

    final nextStatus = item.status == ItemStatus.reserved
        ? ItemStatus.purchased
        : ItemStatus.reserved;

    repo.updateItem(item.copyWith(status: nextStatus));

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Reserve toggled',
          subtitle: '${item.title} → ${nextStatus.name}',
        );
  }
}

final inventoryReserveToggleProvider =
    Provider<InventoryReserveToggleService>((ref) {
  return InventoryReserveToggleService(ref);
});