import 'package:flutter_riverpod/flutter_riverpod.dart';

class PurchasesSelectionController extends Notifier<Set<String>> {
  @override
  Set<String> build() {
    return const {};
  }

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
    state = const {};
  }
}

final purchasesSelectionControllerProvider =
    NotifierProvider<PurchasesSelectionController, Set<String>>(
  PurchasesSelectionController.new,
);