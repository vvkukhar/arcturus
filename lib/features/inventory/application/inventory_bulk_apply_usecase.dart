import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_type.dart';

class InventoryBulkApplyUsecase {
  final Ref ref;

  InventoryBulkApplyUsecase(this.ref);

  Future<void> run({
    required Set<String> selectedIds,
    required InventoryBulkActionType action,
  }) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final current = repo.getAllItems();

    final next = ref.read(inventoryBulkActionProvider).apply(
          items: current,
          selectedIds: selectedIds,
          action: action,
        );

    await repo.replaceAll(next);
  }
}