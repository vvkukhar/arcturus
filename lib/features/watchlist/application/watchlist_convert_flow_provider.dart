import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_convert_flow_service.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_convert_provider.dart';

final watchlistConvertFlowProvider =
    Provider<WatchlistConvertFlowService>((ref) {
  return WatchlistConvertFlowService(
    ref.watch(watchlistConvertServiceProvider),
  );
});