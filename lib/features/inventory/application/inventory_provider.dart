import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/data/inventory_cached_repository_provider.dart';

class InventoryItemModel {
  final String id;
  final String itemId;
  final String title;
  final double purchasePrice;
  const InventoryItemModel({
    required this.id,
    required this.itemId,
    required this.title,
    required this.purchasePrice,
  });
  factory InventoryItemModel.fromJson(Map<String, dynamic> json) {
    return InventoryItemModel(
      id: json['id'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      purchasePrice: (json['purchasePrice'] as num?)?.toDouble() ?? 0,
    );
  }
}

final inventoryProvider = FutureProvider<List<InventoryItemModel>>((ref) async {
  final repo = ref.watch(inventoryCachedRepositoryProvider);
  final json = await repo.getInventory();
  return json.map(InventoryItemModel.fromJson).toList();
});
