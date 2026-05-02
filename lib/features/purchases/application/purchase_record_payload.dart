import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchaseRecordPayload {
  final PurchaseModel purchase;
  final ItemModel updatedItem;

  const PurchaseRecordPayload({
    required this.purchase,
    required this.updatedItem,
  });
}
