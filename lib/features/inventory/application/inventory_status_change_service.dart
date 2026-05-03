import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

class InventoryStatusChangeService {
  final Ref ref;

  InventoryStatusChangeService(this.ref);

  Future<void> setStatus({
    required String itemId,
    required ItemStatus status,
  }) async {
    final controller = ref.read(inventoryControllerProvider.notifier);
    final item = controller.getById(itemId);
    if (item == null) return;
    
    await controller.updateItem(item.copyWith(status: status));
    
    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory status changed',
          subtitle: '${item.title} -> ${status.name}',
        );
  }
}

final inventoryStatusChangeProvider = Provider<InventoryStatusChangeService>((ref) {
  return InventoryStatusChangeService(ref);
});