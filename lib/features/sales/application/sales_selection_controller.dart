import 'package:flutter_riverpod/flutter_riverpod.dart';

class SalesSelectionController extends Notifier<Set<String>> {
  @override
  Set<String> build() {
    return <String>{};
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
    state = <String>{};
  }
}

final salesSelectionControllerProvider =
    NotifierProvider<SalesSelectionController, Set<String>>(
  SalesSelectionController.new,
);