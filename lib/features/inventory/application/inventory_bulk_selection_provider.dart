import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventoryBulkSelectionController extends StateNotifier<Set<String>> {
  InventoryBulkSelectionController() : super(<String>{});

  void toggle(String id) {
    final next = <String>{...state};
    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }
    state = next;
  }

  void clear() {
    state = <String>{};
  }

  void selectAll(Iterable<String> ids) {
    state = ids.toSet();
  }

  bool isSelected(String id) => state.contains(id);
}

final inventoryBulkSelectionProvider =
    StateNotifierProvider<InventoryBulkSelectionController, Set<String>>(
  (ref) => InventoryBulkSelectionController(),
);