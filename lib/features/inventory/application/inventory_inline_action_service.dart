import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';

class InventoryInlineActionService {
  final Ref ref;

  InventoryInlineActionService(this.ref);

  Future<void> markListed(String itemId) async {
    final repo = InventoryRepository();
    final item = repo.getById(itemId);
    if (item == null) return;

    repo.updateItem(item.copyWith(status: ItemStatus.listed));

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory quick action',
          subtitle: '${item.title} → listed',
        );
  }

  Future<void> markSold(String itemId) async {
    final repo = InventoryRepository();
    final item = repo.getById(itemId);
    if (item == null) return;

    repo.updateItem(item.copyWith(status: ItemStatus.sold));

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory quick action',
          subtitle: '${item.title} → sold',
        );
  }

  Future<void> archive(String itemId) async {
    final repo = InventoryRepository();
    final item = repo.getById(itemId);
    if (item == null) return;

    repo.updateItem(item.copyWith(status: ItemStatus.archived));

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory quick action',
          subtitle: '${item.title} → archived',
        );
  }
}