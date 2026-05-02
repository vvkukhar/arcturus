import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

final watchlistItemResolverProvider =
    Provider<WatchlistItemResolver>((ref) {
  final items = ref.watch(watchlistControllerProvider).allItems;
  return WatchlistItemResolver(items);
});

class WatchlistItemResolver {
  final List<WatchlistItemModel> items;

  const WatchlistItemResolver(this.items);

  WatchlistItemModel? byId(String id) {
    for (final item in items) {
      if (item.id == id) return item;
    }
    return null;
  }
}