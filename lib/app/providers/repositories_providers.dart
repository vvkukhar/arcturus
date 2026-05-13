import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';
import 'package:lego_trading_manager/app/providers/core_providers.dart';

class CacheRepository {
  Future<String?> get(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  Future<void> set(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  Future<void> delete(String key) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }
}

final cacheRepositoryProvider = Provider((ref) => CacheRepository());
final inventoryRepositoryProvider = Provider((ref) => InventoryRepository(ref.watch(sharedPreferencesProvider)));
final purchasesRepositoryProvider = Provider((ref) => PurchasesRepository(ref.watch(sharedPreferencesProvider)));
final salesRepositoryProvider = Provider((ref) => SalesRepository(ref.watch(sharedPreferencesProvider)));
final watchlistRepositoryProvider = Provider((ref) => WatchlistRepository(ref.watch(sharedPreferencesProvider)));
final marketRepositoryProvider = Provider((ref) => MarketRepository(ref.watch(sharedPreferencesProvider)));
final partOutRepositoryProvider = Provider((ref) => PartOutRepository());