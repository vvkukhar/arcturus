// lib/features/inventory/application/inventory_bulk_apply_service.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/activity/application/activity_log_helper_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_type.dart';

class InventoryBulkApplyService {
  final Ref ref;

  InventoryBulkApplyService(this.ref);

  Future<void> run({
    required Set<String> selectedIds,
    required InventoryBulkActionType action,
  }) async {
    final repo = InventoryRepository();
    final items = repo.getAllItems();

    final next = ref.read(inventoryBulkActionProvider).apply(
          items: items,
          selectedIds: selectedIds,
          action: action,
        );

    repo.replaceAll(next);

    await ref.read(activityLogHelperProvider).inventoryAction(
          title: 'Inventory bulk action',
          subtitle: '${action.name} | selected=${selectedIds.length}',
        );
  }
}
