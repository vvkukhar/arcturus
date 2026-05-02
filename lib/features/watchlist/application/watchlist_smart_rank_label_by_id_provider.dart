import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_smart_rank_provider.dart';

final watchlistSmartRankLabelByIdProvider =
    Provider.family<String?, String>((ref, id) {
  final items = ref.watch(watchlistSmartRankProvider);

  for (final item in items) {
    if (item.id != id) continue;
    if (item.score >= 40) return 'top';
    if (item.score >= 20) return 'good';
    return 'watch';
  }

  return null;
});