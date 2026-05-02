import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/storage/cache_repository_provider.dart';
import 'package:lego_trading_manager/features/operator/data/operator_api_repository_provider.dart';
import 'package:lego_trading_manager/features/operator/data/operator_cached_repository.dart';

final operatorCachedRepositoryProvider =
    Provider<OperatorCachedRepository>((ref) {
  final api = ref.watch(operatorApiRepositoryProvider);
  final cache = ref.watch(cacheRepositoryProvider);
  return OperatorCachedRepository(api, cache);
});
