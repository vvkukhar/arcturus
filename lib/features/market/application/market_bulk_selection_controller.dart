import 'package:flutter_riverpod/flutter_riverpod.dart';

class MarketBulkSelectionController extends StateNotifier<Set<String>> {
  MarketBulkSelectionController() : super(<String>{});

  void toggle(String id) {
    final next = <String>{...state};

    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }

    state = next;
  }

  void selectAll(Iterable<String> ids) {
    state = {...ids};
  }

  void clear() {
    state = <String>{};
  }

  void removeMissing(Iterable<String> validIds) {
    final valid = validIds.toSet();
    state = state.where(valid.contains).toSet();
  }

  bool isSelected(String id) => state.contains(id);

  int get selectedCount => state.length;

  bool get hasSelection => state.isNotEmpty;
}

final marketBulkSelectionProvider =
    StateNotifierProvider<MarketBulkSelectionController, Set<String>>(
  (ref) => MarketBulkSelectionController(),
);