import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

final watchlistActiveCountProvider = Provider<int>((ref) {
  final items = ref.watch(watchlistControllerProvider).allItems;
  return items.where((item) => item.isActive).length;
});

final watchlistInactiveCountProvider = Provider<int>((ref) {
  final items = ref.watch(watchlistControllerProvider).allItems;
  return items.where((item) => !item.isActive).length;
});

final watchlistWithMarketPriceCountProvider = Provider<int>((ref) {
  final items = ref.watch(watchlistControllerProvider).allItems;
  return items.where((item) => item.marketPrice != null).length;
});