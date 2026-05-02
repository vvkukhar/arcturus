import 'package:lego_trading_manager/core/enums/item_status.dart';

class InventoryStatusCounterModel {
  final ItemStatus status;
  final int count;

  const InventoryStatusCounterModel({
    required this.status,
    required this.count,
  });
}
