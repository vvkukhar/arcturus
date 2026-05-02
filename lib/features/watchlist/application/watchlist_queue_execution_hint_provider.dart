import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_actionable_summary_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_execution_hint_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_pressure_provider.dart';

final watchlistQueueExecutionHintProvider =
    Provider<WatchlistQueueExecutionHintModel>((ref) {
  final actionable = ref.watch(watchlistQueueActionableSummaryProvider);
  final pressure = ref.watch(watchlistQueuePressureProvider);

  if (actionable.selectedCount == 0) {
    return const WatchlistQueueExecutionHintModel(
      label: 'Select queue items to see execution guidance',
    );
  }

  if (pressure.label == 'heavy') {
    return const WatchlistQueueExecutionHintModel(
      label: 'Queue is heavy — split execution into smaller buys',
    );
  }

  if (pressure.label == 'tight') {
    return const WatchlistQueueExecutionHintModel(
      label: 'Queue is tight — prioritize strongest spread items first',
    );
  }

  return const WatchlistQueueExecutionHintModel(
    label: 'Queue is actionable — current selection looks manageable',
  );
});