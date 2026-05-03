import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventorySelectedPresetNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void set(String? value) {
    state = value;
  }
}

final inventorySelectedPresetProvider =
    NotifierProvider<InventorySelectedPresetNotifier, String?>(
  InventorySelectedPresetNotifier.new,
);