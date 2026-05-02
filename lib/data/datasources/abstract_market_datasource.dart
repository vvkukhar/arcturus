// lib/data/datasources/abstract_market_datasource.dart

import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

abstract class AbstractMarketDatasource {
  Future<List<MarketSnapshotModel>> getAll();
  Future<List<MarketSnapshotModel>> getByItemRef(String itemRef);
  Future<void> add(MarketSnapshotModel snapshot);
  Future<void> delete(String id);
}
