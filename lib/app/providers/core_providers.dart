import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('sharedPreferencesProvider must be overridden in main.dart');
});

final inventoryRepositoryProvider = Provider((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return InventoryRepository(prefs);
});

final purchasesRepositoryProvider = Provider((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return PurchasesRepository(prefs);
});

final salesRepositoryProvider = Provider((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return SalesRepository(prefs);
});

final watchlistRepositoryProvider = Provider((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return WatchlistRepository(prefs);
});

final marketRepositoryProvider = Provider((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return MarketRepository(prefs);
});

final partOutRepositoryProvider = Provider((ref) => PartOutRepository());