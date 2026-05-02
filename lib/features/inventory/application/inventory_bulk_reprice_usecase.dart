import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_reprice_service.dart';

class InventoryBulkRepriceUsecase {
  final InventoryRepriceService service;

  InventoryBulkRepriceUsecase(this.service);

  void run({
    required Set<String> selectedIds,
    required String mode,
    required double percent,
  }) {
    final repo = InventoryRepository();
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

    repo.replaceAll(next);
  }
}