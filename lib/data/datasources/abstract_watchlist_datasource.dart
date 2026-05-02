// lib/data/datasources/abstract_watchlist_datasource.dart

import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

abstract class AbstractWatchlistDatasource {
  Future<List<WatchlistItemModel>> getAll();
  Future<void> add(WatchlistItemModel item);
  Future<void> delete(String id);
}
