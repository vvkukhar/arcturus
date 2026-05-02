import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

final watchlistItemByIdProvider =
    Provider.family<WatchlistItemModel?, String>((ref, id) {
  final items = ref.watch(watchlistControllerProvider).allItems;

  for (final item in items) {
    if (item.id == id) return item;
  }

  return null;
});