import 'package:flutter_riverpod/flutter_riverpod.dart';

enum InventoryAlertFilter {
  all,
  lowProfit,
  heldTooLong,
  repricing,
}

class InventoryAlertFilterNotifier extends Notifier<InventoryAlertFilter> {
  @override
  InventoryAlertFilter build() => InventoryAlertFilter.all;

  void set(InventoryAlertFilter value) {
    state = value;
  }
}

final inventoryAlertFilterProvider =
    NotifierProvider<InventoryAlertFilterNotifier, InventoryAlertFilter>(
  InventoryAlertFilterNotifier.new,
);