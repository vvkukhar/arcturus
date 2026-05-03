import 'package:flutter_riverpod/flutter_riverpod.dart';

class RepriceSelectionController extends Notifier<Set<String>> {
  @override
  Set<String> build() {
    return const {};
  }

  void toggle(String id) {
    if (state.contains(id)) {
      state = {...state}..remove(id);
    } else {
      state = {...state, id};
    }
  }

  void setAll(Set<String> ids) {
    state = {...ids};
  }

  void clear() {
    state = const {};
  }
}

final analyticsRepriceSelectionProvider =
    NotifierProvider<RepriceSelectionController, Set<String>>(
  RepriceSelectionController.new,
);