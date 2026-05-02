import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_builder.dart';

final watchlistQueueProvider =
    Provider<List<WatchlistItemModel>>((ref) {
  final items = ref.watch(watchlistControllerProvider).allItems;

  return const WatchlistQueueBuilder().build(items);
});