import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';

class WatchlistBatchActionsService {
  final Ref ref;

  const WatchlistBatchActionsService(this.ref);

  void activateSelected(Set<String> ids) {
    final controller = ref.read(watchlistControllerProvider.notifier);
    for (final id in ids) {
      controller.activate(id);
    }
  }

  void deactivateSelected(Set<String> ids) {
    final controller = ref.read(watchlistControllerProvider.notifier);
    for (final id in ids) {
      controller.deactivate(id);
    }
  }

  void deleteSelected(Set<String> ids) {
    final controller = ref.read(watchlistControllerProvider.notifier);
    for (final id in ids) {
      controller.deleteItem(id);
    }
  }
}

final watchlistBatchActionsProvider = Provider<WatchlistBatchActionsService>(
  (ref) => WatchlistBatchActionsService(ref),
);