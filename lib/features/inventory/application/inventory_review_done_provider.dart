import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventoryReviewDoneController extends StateNotifier<Set<String>> {
  InventoryReviewDoneController() : super(const {});

  void markDone(String itemId) {
    state = {...state, itemId};
  }

  void unmark(String itemId) {
    final next = {...state}..remove(itemId);
    state = next;
  }
}

final inventoryReviewDoneProvider =
    StateNotifierProvider<InventoryReviewDoneController, Set<String>>(
  (ref) => InventoryReviewDoneController(),
);
