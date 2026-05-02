import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/flows/data/flows_api_repository_provider.dart';
import 'package:lego_trading_manager/features/flows/data/flows_cached_repository.dart';

final flowsCachedRepositoryProvider = Provider<FlowsCachedRepository>((ref) {
  final api = ref.watch(flowsApiRepositoryProvider);
  final cache = ref.watch(cacheRepositoryProvider);
  return FlowsCachedRepository(api, cache);
});
