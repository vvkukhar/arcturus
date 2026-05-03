import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventoryBulkSelectionController extends Notifier<Set<String>> {
  @override
  Set<String> build() {
    return const {};
  }

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
    state = const {};
  }

  void selectAll(Iterable<String> ids) {
    state = ids.toSet();
  }

  bool isSelected(String id) => state.contains(id);
}

final inventoryBulkSelectionProvider =
    NotifierProvider<InventoryBulkSelectionController, Set<String>>(
  InventoryBulkSelectionController.new,
);