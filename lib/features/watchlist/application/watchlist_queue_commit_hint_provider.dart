import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_action_confidence_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_commit_hint_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_queue_readiness_score_provider.dart';

final watchlistQueueCommitHintProvider =
    Provider<WatchlistQueueCommitHintModel>((ref) {
  final confidence = ref.watch(watchlistQueueActionConfidenceProvider);
  final readiness = ref.watch(watchlistQueueReadinessScoreProvider);

  final label =
      readiness.label == 'ready' && confidence.label == 'high confidence'
          ? 'You can commit current queue selection'
          : readiness.label == 'partial'
              ? 'Commit only strongest queue items first'
              : 'Do not commit yet — refine queue selection';

  return WatchlistQueueCommitHintModel(label: label);
});