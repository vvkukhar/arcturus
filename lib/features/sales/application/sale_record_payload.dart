import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SaleRecordPayload {
  final SaleModel sale;
  final ItemModel updatedItem;

  const SaleRecordPayload({
    required this.sale,
    required this.updatedItem,
  });
}