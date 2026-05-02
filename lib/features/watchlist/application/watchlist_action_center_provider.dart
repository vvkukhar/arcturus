import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_buy_decision_provider.dart';

class WatchlistActionCenterModel {
  final int readyToBuy;
  final int wait;
  final String topAction;

  const WatchlistActionCenterModel({
    required this.readyToBuy,
    required this.wait,
    required this.topAction,
  });
}

final watchlistActionCenterProvider =
    Provider<WatchlistActionCenterModel>((ref) {
  final decisions = ref.watch(watchlistBuyDecisionProvider);
  final readyToBuy = decisions.where((e) => e.decision == 'buy').length;
  final wait = decisions.length - readyToBuy;

  final topAction = readyToBuy > 0
      ? 'Buy queue available'
      : decisions.isEmpty
          ? 'No watchlist actions'
          : 'Wait for better entries';

  return WatchlistActionCenterModel(
    readyToBuy: readyToBuy,
    wait: wait,
    topAction: topAction,
  );
});