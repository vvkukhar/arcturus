import 'package:flutter_riverpod/flutter_riverpod.dart';

class PurchaseFlowConfirmController extends Notifier<Set<String>> {
  @override
  Set<String> build() {
    return const {};
  }

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
    NotifierProvider<PurchaseFlowConfirmController, Set<String>>(
  PurchaseFlowConfirmController.new,
);