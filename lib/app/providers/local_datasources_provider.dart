import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/app_database_provider.dart';
import 'package:lego_trading_manager/data/datasources/local/inventory_local_datasource.dart';
import 'package:lego_trading_manager/data/datasources/local/purchases_local_datasource.dart';
import 'package:lego_trading_manager/data/datasources/local/sales_local_datasource.dart';
import 'package:lego_trading_manager/data/datasources/local/watchlist_local_datasource.dart';
import 'package:lego_trading_manager/data/datasources/local/market_local_datasource.dart';
import 'package:lego_trading_manager/data/datasources/local/partout_local_datasource.dart';

final inventoryLocalDatasourceProvider = Provider<InventoryLocalDatasource>((ref) {
  return InventoryLocalDatasource(ref.watch(appDatabaseProvider));
});

final purchasesLocalDatasourceProvider = Provider<PurchasesLocalDatasource>((ref) {
  return PurchasesLocalDatasource(ref.watch(appDatabaseProvider));
});

final salesLocalDatasourceProvider = Provider<SalesLocalDatasource>((ref) {
  return SalesLocalDatasource(ref.watch(appDatabaseProvider));
});

final watchlistLocalDatasourceProvider = Provider<WatchlistLocalDatasource>((ref) {
  return WatchlistLocalDatasource(ref.watch(appDatabaseProvider));
});

final marketLocalDatasourceProvider = Provider<MarketLocalDatasource>((ref) {
  return MarketLocalDatasource(ref.watch(appDatabaseProvider));
});

final partoutLocalDatasourceProvider = Provider<PartOutLocalDatasource>((ref) {
  return PartOutLocalDatasource(ref.watch(appDatabaseProvider));
});