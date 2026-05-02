import 'package:lego_trading_manager/data/models/item_model.dart';

class ItemQuickRepriceService {
  ItemModel toMarketAverage(ItemModel item) {
    if (item.marketAverage == null) return item;
    return item.copyWith(expectedSalePrice: item.marketAverage);
  }

  ItemModel toMarketMinus5(ItemModel item) {
    if (item.marketAverage == null) return item;
    return item.copyWith(expectedSalePrice: item.marketAverage! * 0.95);
  }

  ItemModel toMarketMinus10(ItemModel item) {
    if (item.marketAverage == null) return item;
    return item.copyWith(expectedSalePrice: item.marketAverage! * 0.90);
  }

  ItemModel toMarketPlus3(ItemModel item) {
    if (item.marketAverage == null) return item;
    return item.copyWith(expectedSalePrice: item.marketAverage! * 1.03);
  }
}
