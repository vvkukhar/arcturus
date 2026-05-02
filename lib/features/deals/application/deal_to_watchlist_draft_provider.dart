import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/deals/application/deal_to_watchlist_draft_service.dart';

final dealToWatchlistDraftProvider =
    Provider<DealToWatchlistDraftService>((ref) {
  return DealToWatchlistDraftService();
});
