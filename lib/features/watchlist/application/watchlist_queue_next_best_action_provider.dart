import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_next_best_action_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_pressure_provider.dart';

final watchlistQueueNextBestActionProvider =
    Provider<WatchlistQueueNextBestActionModel>((ref) {
  final actionable = ref.watch(watchlistQueueActionableSummaryProvider);
  final pressure = ref.watch(watchlistQueuePressureProvider);

  if (actionable.selectedCount == 0) {
    return const WatchlistQueueNextBestActionModel(
      label: 'Select items from queue first',
    );
  }

  if (pressure.label == 'heavy') {
    return const WatchlistQueueNextBestActionModel(
      label: 'Execute in chunks and start from highest spread items',
    );
  }

  if (pressure.label == 'tight') {
    return const WatchlistQueueNextBestActionModel(
      label: 'Trim weaker items before buying',
    );
  }

  return const WatchlistQueueNextBestActionModel(
    label: 'Current queue selection is ready to execute',
  );
});