import 'package:flutter_riverpod/flutter_riverpod.dart';

class RepriceSelectionController extends StateNotifier<Set<String>> {
  RepriceSelectionController() : super({});

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
    state = {};
  }
}

final analyticsRepriceSelectionProvider =
    StateNotifierProvider<RepriceSelectionController, Set<String>>(
  (ref) => RepriceSelectionController(),
);