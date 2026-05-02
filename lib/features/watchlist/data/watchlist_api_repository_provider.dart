import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/api_client_provider.dart';
import 'package:lego_trading_manager/features/watchlist/data/watchlist_api_repository.dart';

final watchlistApiRepositoryProvider = Provider<WatchlistApiRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return WatchlistApiRepository(apiClient);
});
