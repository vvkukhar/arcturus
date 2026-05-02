import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/store/inventory_memory_store.dart';

class InventoryRepository {
  List<ItemModel> getAllItems() {
    return List<ItemModel>.from(InventoryMemoryStore.items);
  }

  List<ItemModel> getResaleItems() {
    return InventoryMemoryStore.items
        .where((item) => item.ownershipType == OwnershipType.resale)
        .toList();
  }

  List<ItemModel> getCollectionItems() {
    return InventoryMemoryStore.items
        .where((item) => item.ownershipType == OwnershipType.collection)
        .toList();
  }

  List<ItemModel> getActiveItems() {
    return InventoryMemoryStore.items.where((item) => item.isActive).toList();
  }

  List<ItemModel> getListedItems() {
    return InventoryMemoryStore.items
        .where((item) => item.status == ItemStatus.listed)
        .toList();
  }

  List<ItemModel> getSoldItems() {
    return InventoryMemoryStore.items
        .where((item) => item.status == ItemStatus.sold)
        .toList();
  }

  List<ItemModel> searchItems(String query) {
    final normalized = query.trim().toLowerCase();

    if (normalized.isEmpty) {
      return getAllItems();
    }

    return InventoryMemoryStore.items.where((item) {
      final titleMatch = item.title.toLowerCase().contains(normalized);
      final themeMatch = (item.theme ?? '').toLowerCase().contains(normalized);
      final subthemeMatch =
          (item.subtheme ?? '').toLowerCase().contains(normalized);
      final legoNumberMatch =
          (item.legoNumber ?? '').toLowerCase().contains(normalized);
      final minifigIdMatch =
          (item.minifigId ?? '').toLowerCase().contains(normalized);
      final tagsMatch = item.tags.any(
        (tag) => tag.toString().toLowerCase().contains(normalized),
      );
      final notesMatch = (item.notes ?? '').toLowerCase().contains(normalized);

      return titleMatch ||
          themeMatch ||
          subthemeMatch ||
          legoNumberMatch ||
          minifigIdMatch ||
          tagsMatch ||
          notesMatch;
    }).toList();
  }

  ItemModel? getById(String id) {
    return InventoryMemoryStore.getById(id);
  }

  void addItem(ItemModel item) {
    InventoryMemoryStore.addItem(item);
  }

  void updateItem(ItemModel item) {
    InventoryMemoryStore.updateItem(item);
  }

  void deleteItem(String id) {
    InventoryMemoryStore.deleteItem(id);
  }

  void replaceAll(List<ItemModel> items) {
    InventoryMemoryStore.items
      ..clear()
      ..addAll(items);
  }
}