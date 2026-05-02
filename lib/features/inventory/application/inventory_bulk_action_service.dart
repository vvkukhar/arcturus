import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_action_type.dart';

class InventoryBulkActionService {
  List<ItemModel> apply({
    required List<ItemModel> items,
    required Set<String> selectedIds,
    required InventoryBulkActionType action,
  }) {
    return items.map((item) {
      if (!selectedIds.contains(item.id)) return item;

      switch (action) {
        case InventoryBulkActionType.markInStock:
          return item.copyWith(status: ItemStatus.purchased);
        case InventoryBulkActionType.markListed:
          return item.copyWith(status: ItemStatus.listed);
        case InventoryBulkActionType.markSold:
          return item.copyWith(status: ItemStatus.sold);
        case InventoryBulkActionType.setMarketPrice:
          return item.marketAverage == null
              ? item
              : item.copyWith(expectedSalePrice: item.marketAverage);
        case InventoryBulkActionType.setMarketMinus5:
          return item.marketAverage == null
              ? item
              : item.copyWith(expectedSalePrice: item.marketAverage! * 0.95);
        case InventoryBulkActionType.setMarketMinus10:
          return item.marketAverage == null
              ? item
              : item.copyWith(expectedSalePrice: item.marketAverage! * 0.90);
      }
    }).toList();
  }
}