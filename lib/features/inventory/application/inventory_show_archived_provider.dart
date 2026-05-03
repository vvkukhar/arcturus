import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventoryShowArchivedNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  void toggle() {
    state = !state;
  }
  
  void set(bool value) {
    state = value;
  }
}

final inventoryShowArchivedProvider =
    NotifierProvider<InventoryShowArchivedNotifier, bool>(
  InventoryShowArchivedNotifier.new,
);