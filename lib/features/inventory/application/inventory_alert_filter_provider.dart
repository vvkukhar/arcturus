import 'package:flutter_riverpod/flutter_riverpod.dart';

enum InventoryAlertFilter {
  all,
  lowProfit,
  heldTooLong,
  repricing,
}

final inventoryAlertFilterProvider = StateProvider<InventoryAlertFilter>((ref) {
  return InventoryAlertFilter.all;
});
