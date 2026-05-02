import 'package:flutter_riverpod/flutter_riverpod.dart';

class PurchaseFlowConfirmController extends StateNotifier<Set<String>> {
  PurchaseFlowConfirmController() : super(const {});

  void confirm(String id) {
    state = {...state, id};
  }

  void unconfirm(String id) {
    final next = {...state}..remove(id);
    state = next;
  }

  void clear() {
    state = const {};
  }
}

final purchaseFlowConfirmProvider =
    StateNotifierProvider<PurchaseFlowConfirmController, Set<String>>(
  (ref) => PurchaseFlowConfirmController(),
);