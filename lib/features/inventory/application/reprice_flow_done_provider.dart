import 'package:flutter_riverpod/flutter_riverpod.dart';

class RepriceFlowDoneController extends StateNotifier<Set<String>> {
  RepriceFlowDoneController() : super(const {});

  void markDone(String id) {
    state = {...state, id};
  }

  void unmark(String id) {
    final next = {...state}..remove(id);
    state = next;
  }
}

final repriceFlowDoneProvider =
    StateNotifierProvider<RepriceFlowDoneController, Set<String>>(
  (ref) => RepriceFlowDoneController(),
);
