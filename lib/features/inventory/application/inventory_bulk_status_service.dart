import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

class InventoryBulkStatusService {
  final Ref ref;

  InventoryBulkStatusService(this.ref);

  Future<int> apply({
    required Set<String> ids,
    required ItemStatus status,
  }) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final items = repo.getAllItems();
    int affected = 0;
    
    final next = items.map((item) {
      if (!ids.contains(item.id)) return item;
      affected++;
      return item.copyWith(status: status);
    }).toList();
    
    await repo.replaceAll(next);
    ref.read(inventoryControllerProvider.notifier).loadItems();

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory bulk status',
          subtitle: '${status.name} -> $affected items',
        );
    return affected;
  }
}

final inventoryBulkStatusProvider = Provider<InventoryBulkStatusService>((ref) {
  return InventoryBulkStatusService(ref);
});