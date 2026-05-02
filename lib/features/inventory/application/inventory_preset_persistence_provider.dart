import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventoryPresetPersistence extends StateNotifier<String?> {
  InventoryPresetPersistence() : super(null);

  void save(String id) {
    state = id;
  }

  void clear() {
    state = null;
  }
}

final inventoryPresetPersistenceProvider =
    StateNotifierProvider<InventoryPresetPersistence, String?>(
  (ref) => InventoryPresetPersistence(),
);
