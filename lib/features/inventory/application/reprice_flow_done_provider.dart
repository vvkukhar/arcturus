import 'package:flutter_riverpod/flutter_riverpod.dart';

class RepriceFlowDoneController extends Notifier<Set<String>> {
  @override
  Set<String> build() {
    return const {};
  }

  void markDone(String id) {
    state = {...state, id};
  }

  void unmark(String id) {
    final next = {...state}..remove(id);
    state = next;
  }
}

final repriceFlowDoneProvider =
    NotifierProvider<RepriceFlowDoneController, Set<String>>(
  RepriceFlowDoneController.new,
);