import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_priority_provider.dart';

final watchlistPriorityLabelByIdProvider =
    Provider.family<String?, String>((ref, id) {
  final items = ref.watch(watchlistPriorityProvider);

  for (final item in items) {
    if (item.id == id) return item.label;
  }

  return null;
});