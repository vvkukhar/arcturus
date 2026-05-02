import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/inventory/data/inventory_api_repository_provider.dart';
import 'package:lego_trading_manager/features/inventory/data/inventory_cached_repository.dart';

final inventoryCachedRepositoryProvider =
    Provider<InventoryCachedRepository>((ref) {
  final api = ref.watch(inventoryApiRepositoryProvider);
  final cache = ref.watch(cacheRepositoryProvider);
  return InventoryCachedRepository(api, cache);
});
