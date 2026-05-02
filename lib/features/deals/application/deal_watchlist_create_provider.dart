import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deal_watchlist_create_service.dart';

final dealWatchlistCreateProvider = Provider<DealWatchlistCreateService>((ref) {
  return DealWatchlistCreateService();
});
