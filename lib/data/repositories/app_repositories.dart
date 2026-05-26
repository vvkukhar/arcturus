import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/network_core.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';

class ApiRepository<T> {
  final NetworkCore network;
  final String endpoint;
  final T Function(Map<String, dynamic>) fromMap;

  ApiRepository(this.network, this.endpoint, this.fromMap);

  Future<List<T>> fetchAll({Map<String, dynamic>? query}) async {
    final response = await network.request('GET', endpoint, body: query);
    if (response is List) {
      return response.map((e) => fromMap(Map<String, dynamic>.from(e))).toList();
    }
    return [];
  }

  Future<T> fetchById(String id) async {
    final response = await network.request('GET', '$endpoint/$id');
    return fromMap(Map<String, dynamic>.from(response));
  }

  Future<T> create(Map<String, dynamic> data) async {
    final response = await network.request('POST', endpoint, body: data);
    return fromMap(Map<String, dynamic>.from(response));
  }

  Future<T> update(String id, Map<String, dynamic> data) async {
    final response = await network.request('PATCH', endpoint, body: {'id': id, ...data});
    return fromMap(Map<String, dynamic>.from(response));
  }

  Future<void> delete(String id) async {
    await network.request('DELETE', endpoint, body: {'id': id});
  }
}

final inventoryRepositoryProvider = Provider((ref) => ApiRepository<InventoryItemModel>(
  ref.watch(networkCoreProvider), 
  '/inventory', 
  InventoryItemModel.fromMap
));

final salesRepositoryProvider = Provider((ref) => ApiRepository<SaleModel>(
  ref.watch(networkCoreProvider), 
  '/sales', 
  SaleModel.fromMap
));

final watchlistRepositoryProvider = Provider((ref) => ApiRepository<WatchlistItemModel>(
  ref.watch(networkCoreProvider), 
  '/watchlist', 
  WatchlistItemModel.fromMap
));

final purchasesRepositoryProvider = Provider((ref) => ApiRepository<dynamic>(
  ref.watch(networkCoreProvider), 
  '/procurement', 
  (map) => map
));

final marketRepositoryProvider = Provider((ref) => ApiRepository<dynamic>(
  ref.watch(networkCoreProvider), 
  '/market', 
  (map) => map
));

final partOutRepositoryProvider = Provider((ref) => ApiRepository<dynamic>(
  ref.watch(networkCoreProvider), 
  '/partout', 
  (map) => map
));

final ordersRepositoryProvider = Provider((ref) => ApiRepository<dynamic>(
  ref.watch(networkCoreProvider), 
  '/orders', 
  (map) => map
));

final scoutsRepositoryProvider = Provider((ref) => ApiRepository<dynamic>(
  ref.watch(networkCoreProvider), 
  '/scout/leads', 
  (map) => map
));

final monetizationRepositoryProvider = Provider((ref) => ApiRepository<dynamic>(
  ref.watch(networkCoreProvider), 
  '/monetization/mystery-boxes', 
  (map) => map
));