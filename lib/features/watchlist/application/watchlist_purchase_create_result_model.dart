import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class WatchlistPurchaseCreateResultModel {
  final ItemModel item;
  final PurchaseModel purchase;

  const WatchlistPurchaseCreateResultModel({
    required this.item,
    required this.purchase,
  });
}