// lib/features/item_details/application/item_insights_service.dart

import 'package:lego_trading_manager/data/models/item_model.dart';

class ItemInsightsService {
  String expectedProfit(ItemModel item) {
    return ((item.expectedSalePrice ?? 0) - item.totalCost).toStringAsFixed(2);
  }

  String marketSpread(ItemModel item) {
    return ((item.marketAverage ?? 0) - item.totalCost).toStringAsFixed(2);
  }

  String age(ItemModel item) {
    return (item.daysInInventory ?? 0).toString();
  }
}
