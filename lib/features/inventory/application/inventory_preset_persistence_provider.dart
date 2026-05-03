import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventoryPresetPersistenceNotifier extends Notifier<String?> {
  @override
  String? build() {
    return null;
  }

  void save(String id) {
    state = id;
  }

  void clear() {
    state = null;
  }
}

final inventoryPresetPersistenceProvider =
    NotifierProvider<InventoryPresetPersistenceNotifier, String?>(
  InventoryPresetPersistenceNotifier.new,
);