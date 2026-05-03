import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

class InventoryInlineActionService {
  final Ref ref;

  InventoryInlineActionService(this.ref);

  Future<void> markListed(String itemId) async {
    final controller = ref.read(inventoryControllerProvider.notifier);
    final item = controller.getById(itemId);
    if (item == null) return;

    await controller.updateItem(item.copyWith(status: ItemStatus.listed));

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory quick action',
          subtitle: '${item.title} -> listed',
        );
  }

  Future<void> markSold(String itemId) async {
    final controller = ref.read(inventoryControllerProvider.notifier);
    final item = controller.getById(itemId);
    if (item == null) return;

    await controller.updateItem(item.copyWith(status: ItemStatus.sold));

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory quick action',
          subtitle: '${item.title} -> sold',
        );
  }

  Future<void> archive(String itemId) async {
    final controller = ref.read(inventoryControllerProvider.notifier);
    final item = controller.getById(itemId);
    if (item == null) return;

    await controller.updateItem(item.copyWith(status: ItemStatus.archived));

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory quick action',
          subtitle: '${item.title} -> archived',
        );
  }
}