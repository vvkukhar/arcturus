import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:lego_trading_manager/core/storage/app_database.dart';
import 'package:lego_trading_manager/data/models/item_model.dart';

class InventoryLocalDatasource {
  final AppDatabase _db;

  InventoryLocalDatasource(this._db);

  Future<List<ItemModel>> getAll() async {
    final db = await _db.instance;
    final rows = await db.query('inventory_items');
    return rows.map((row) => _fromSqlRow(row)).toList();
  }

  Future<ItemModel?> getById(String id) async {
    final db = await _db.instance;
    final rows = await db.query('inventory_items', where: 'id = ?', whereArgs: [id]);
    if (rows.isEmpty) return null;
    return _fromSqlRow(rows.first);
  }

  Future<void> add(ItemModel item) async {
    final db = await _db.instance;
    await db.insert('inventory_items', _toSqlRow(item), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> update(ItemModel item) async {
    final db = await _db.instance;
    await db.update('inventory_items', _toSqlRow(item), where: 'id = ?', whereArgs: [item.id]);
  }

  Future<void> delete(String id) async {
    final db = await _db.instance;
    await db.delete('inventory_items', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> replaceAll(List<ItemModel> items) async {
    final db = await _db.instance;
    await db.transaction((txn) async {
      await txn.delete('inventory_items');
      for (final item in items) {
        await txn.insert('inventory_items', _toSqlRow(item));
      }
    });
  }

  Map<String, dynamic> _toSqlRow(ItemModel item) {
    final map = item.toMap();
    map['tags'] = jsonEncode(item.tags);
    map['photos'] = jsonEncode(item.photos);
    map['isTracked'] = item.isTracked ? 1 : 0;
    return map;
  }

  ItemModel _fromSqlRow(Map<String, dynamic> row) {
    final map = Map<String, dynamic>.from(row);
    map['tags'] = jsonDecode(row['tags'] as String);
    map['photos'] = jsonDecode(row['photos'] as String);
    map['isTracked'] = (row['isTracked'] as int) == 1;
    return ItemModel.fromMap(map);
  }
}