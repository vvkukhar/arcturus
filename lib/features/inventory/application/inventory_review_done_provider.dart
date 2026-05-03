import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventoryReviewDoneController extends Notifier<Set<String>> {
  @override
  Set<String> build() {
    return const {};
  }

  void markDone(String itemId) {
    state = {...state, itemId};
  }

  void unmark(String itemId) {
    final next = {...state}..remove(itemId);
    state = next;
  }
}

final inventoryReviewDoneProvider =
    NotifierProvider<InventoryReviewDoneController, Set<String>>(
  InventoryReviewDoneController.new,
);