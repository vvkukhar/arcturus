import 'package:lego_trading_manager/data/models/item_model.dart';

class ItemDetailActionResult {
  final ItemModel? duplicatedItem;
  final bool deleted;

  const ItemDetailActionResult({
    this.duplicatedItem,
    this.deleted = false,
  });
}