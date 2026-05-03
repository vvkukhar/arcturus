import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_selection_state.dart';

class WatchlistSelectionController extends Notifier<WatchlistSelectionState> {
  @override
  WatchlistSelectionState build() {
    return WatchlistSelectionState.initial();
  }

  void toggle(String id) {
    final next = {...state.selectedIds};
    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }
    state = state.copyWith(selectedIds: next);
  }

  void clear() {
    state = state.copyWith(selectedIds: {});
  }

  void selectAll(List<String> ids) {
    state = state.copyWith(selectedIds: ids.toSet());
  }

  bool isSelected(String id) {
    return state.selectedIds.contains(id);
  }
}

final watchlistSelectionControllerProvider =
    NotifierProvider<WatchlistSelectionController, WatchlistSelectionState>(
  WatchlistSelectionController.new,
);