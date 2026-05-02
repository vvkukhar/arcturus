import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/services/item_profit_snapshot_service.dart';

final itemProfitSnapshotServiceProvider =
    Provider<ItemProfitSnapshotService>((ref) {
  return ItemProfitSnapshotService();
});
