// lib/data/datasources/abstract_items_datasource.dart

import 'package:lego_trading_manager/data/models/item_model.dart';

abstract class AbstractItemsDatasource {
  Future<List<ItemModel>> getAllItems();
  Future<ItemModel?> getById(String id);
  Future<void> addItem(ItemModel item);
  Future<void> updateItem(ItemModel item);
  Future<void> deleteItem(String id);
}
