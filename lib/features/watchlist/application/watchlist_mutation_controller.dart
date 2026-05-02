import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/offline/offline_mutation_service_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_provider.dart';
import 'package:lego_trading_manager/features/watchlist/data/watchlist_cached_repository_provider.dart';

class WatchlistMutationController {
  final Ref ref;

  WatchlistMutationController(this.ref);

  String _tempId() {
    return 'watch-${DateTime.now().millisecondsSinceEpoch}-${Random().nextInt(99999)}';
  }

  Future<void> addOptimistic({
    required String itemId,
    required String title,
  }) async {
    final repo = ref.read(watchlistCachedRepositoryProvider);
    final offline = ref.read(offlineMutationServiceProvider);
    final current = await repo.getWatchlist();

    final optimistic = [
      ...current,
      {
        'id': _tempId(),
        'itemId': itemId,
        'title': title,
        'targetSellPrice': null,
      },
    ];

    await repo.putWatchlistCache(optimistic);

    await offline.run(
      queueType: 'watchlist',
      endpoint: '/watchlist/add',
      method: 'POST',
      body: {
        'itemId': itemId,
        'title': title,
      },
    );

    ref.invalidate(watchlistProvider);
  }
}

final watchlistMutationControllerProvider =
    Provider<WatchlistMutationController>((ref) {
  return WatchlistMutationController(ref);
});