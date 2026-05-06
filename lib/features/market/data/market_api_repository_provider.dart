import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/market/data/market_api_repository.dart';

final marketApiRepositoryProvider = Provider<MarketApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return MarketApiRepository(apiClient);
});