import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'strategy_api_repository.dart';

final strategyApiRepositoryProvider = Provider<StrategyApiRepository>((ref) {
  final api = ref.watch(apiClientProvider);
  return StrategyApiRepository(api);
});