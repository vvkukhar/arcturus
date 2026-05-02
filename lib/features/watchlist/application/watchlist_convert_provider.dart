import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_convert_service.dart';

final watchlistConvertServiceProvider =
    Provider<WatchlistConvertService>((ref) {
  return const WatchlistConvertService();
});