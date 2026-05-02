import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

class MarketSnapshotSyncService {
  ItemModel applySnapshotToItem({
    required ItemModel item,
    required MarketSnapshotModel snapshot,
  }) {
    return item.copyWith(
      marketLow: snapshot.lowPrice,
      marketAverage: snapshot.averagePrice,
    );
  }
}
