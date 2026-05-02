import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_review_queue_provider.dart';

final watchlistReviewQueueCountProvider = Provider<int>((ref) {
  final items = ref.watch(watchlistReviewQueueProvider);
  return items.length;
});