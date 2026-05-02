// lib/features/inventory/application/inventory_reprice_service.dart

import 'package:lego_trading_manager/data/models/item_model.dart';

class InventoryRepriceService {
  ItemModel applyMarketAverage(ItemModel item) {
    final market = item.marketAverage;
    if (market == null || market <= 0) return item;

    return item.copyWith(expectedSalePrice: market);
  }

  ItemModel applyMarketMinusPercent(ItemModel item, double percent) {
    final market = item.marketAverage;
    if (market == null || market <= 0) return item;

    final next = market * (1 - percent / 100);
    return item.copyWith(expectedSalePrice: next);
  }

  ItemModel applyMarketPlusPercent(ItemModel item, double percent) {
    final market = item.marketAverage;
    if (market == null || market <= 0) return item;

    final next = market * (1 + percent / 100);
    return item.copyWith(expectedSalePrice: next);
  }
}
