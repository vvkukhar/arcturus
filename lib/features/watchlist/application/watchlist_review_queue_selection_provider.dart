import 'package:flutter_riverpod/flutter_riverpod.dart';

class WatchlistReviewQueueSelectionController
    extends StateNotifier<Set<String>> {
  WatchlistReviewQueueSelectionController() : super({});

  void toggle(String id) {
    final next = {...state};
    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }
    state = next;
  }

  void clear() {
    state = {};
  }

  void selectAll(Iterable<String> ids) {
    state = ids.toSet();
  }
}

final watchlistReviewQueueSelectionProvider =
    StateNotifierProvider<WatchlistReviewQueueSelectionController, Set<String>>(
  (ref) => WatchlistReviewQueueSelectionController(),
);