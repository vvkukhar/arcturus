import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/items/data/items_api_repository_provider.dart';
import 'package:lego_trading_manager/features/items/data/items_cached_repository.dart';

final itemsCachedRepositoryProvider = Provider<ItemsCachedRepository>((ref) {
  final api = ref.watch(itemsApiRepositoryProvider);
  final cache = ref.watch(cacheRepositoryProvider);
  return ItemsCachedRepository(api, cache);
});
