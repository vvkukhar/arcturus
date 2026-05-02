import 'package:lego_trading_manager/data/models/item_model.dart';

class ItemProfitSnapshotService {
  double expectedProfit(ItemModel item) {
    return (item.expectedSalePrice ?? 0) - item.totalCost;
  }

  double realizedProfit(ItemModel item) {
    return (item.actualSalePrice ?? 0) - item.totalCost;
  }
}
