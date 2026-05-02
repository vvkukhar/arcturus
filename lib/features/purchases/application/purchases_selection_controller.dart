import 'package:flutter_riverpod/flutter_riverpod.dart';

class PurchasesSelectionController extends StateNotifier<Set<String>> {
  PurchasesSelectionController() : super(<String>{});

  bool isSelected(String id) => state.contains(id);

  void toggle(String id) {
    final next = {...state};

    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }

    state = next;
  }

  void selectAll(Iterable<String> ids) {
    state = ids.toSet();
  }

  void clear() {
    state = <String>{};
  }
}

final purchasesSelectionControllerProvider =
    StateNotifierProvider<PurchasesSelectionController, Set<String>>((ref) {
  return PurchasesSelectionController();
});