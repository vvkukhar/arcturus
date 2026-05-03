import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_type.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';

class InventoryBulkApplyService {
  final Ref ref;

  InventoryBulkApplyService(this.ref);

  Future<void> run({
    required Set<String> selectedIds,
    required InventoryBulkActionType action,
  }) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final items = repo.getAllItems();

    final next = ref.read(inventoryBulkActionProvider).apply(
          items: items,
          selectedIds: selectedIds,
          action: action,
        );

    await repo.replaceAll(next);
    ref.read(inventoryControllerProvider.notifier).loadItems();

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory bulk action',
          subtitle: '${action.name} | selected=${selectedIds.length}',
        );
  }
}