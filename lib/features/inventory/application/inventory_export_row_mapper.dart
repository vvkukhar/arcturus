import 'package:lego_trading_manager/data/models/item_model.dart';

class InventoryExportRowMapper {
  static List<String> map(ItemModel item) {
    return [
      item.id,
      item.title,
      item.type.name,
      item.theme ?? '',
      item.subtheme ?? '',
      item.legoNumber ?? '',
      item.totalCost.toString(),
      (item.marketAverage ?? 0).toString(),
      item.status.name,
    ];
  }
}
