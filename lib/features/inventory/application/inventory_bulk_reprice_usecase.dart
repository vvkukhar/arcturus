import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reprice_service.dart';

class InventoryBulkRepriceUsecase {
  final Ref ref;
  final InventoryRepriceService service;

  InventoryBulkRepriceUsecase(this.ref, this.service);

  Future<void> run({
    required Set<String> selectedIds,
    required String mode,
    required double percent,
  }) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final items = repo.getAllItems();

    final next = items.map((item) {
      if (!selectedIds.contains(item.id)) {
        return item;
      }

      switch (mode) {
        case 'minus':
          return service.applyMarketMinusPercent(item, percent);
        case 'plus':
          return service.applyMarketPlusPercent(item, percent);
        default:
          return service.applyMarketAverage(item);
      }
    }).toList();

    await repo.replaceAll(next);
  }
}