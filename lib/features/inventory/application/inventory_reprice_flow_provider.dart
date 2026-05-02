import 'package:flutter_riverpod/flutter_riverpod.dart';

class InventoryRepriceFlowItemModel {
  final String itemId;
  final String title;
  final double score;
  final String reason;

  const InventoryRepriceFlowItemModel({
    required this.itemId,
    required this.title,
    required this.score,
    required this.reason,
  });
}

class InventoryRepriceFlowController
    extends StateNotifier<List<InventoryRepriceFlowItemModel>> {
  InventoryRepriceFlowController() : super(const []);

  void addItem(InventoryRepriceFlowItemModel item) {
    final exists = state.any((e) => e.itemId == item.itemId);
    if (exists) return;
    state = [...state, item];
  }

  void removeItem(String itemId) {
    state = state.where((e) => e.itemId != itemId).toList();
  }

  void clear() {
    state = const [];
  }
}

final inventoryRepriceFlowProvider = StateNotifierProvider<
    InventoryRepriceFlowController, List<InventoryRepriceFlowItemModel>>(
  (ref) => InventoryRepriceFlowController(),
);
