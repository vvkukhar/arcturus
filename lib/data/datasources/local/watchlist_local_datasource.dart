import 'package:sqflite/sqflite.dart';
import 'package:lego_trading_manager/core/storage/app_database.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';

class WatchlistLocalDatasource {
  final AppDatabase _db;

  WatchlistLocalDatasource(this._db);

  Future<List<WatchlistItemModel>> getAll() async {
    final db = await _db.instance;
    final rows = await db.query('watchlist');
    return rows.map((row) => _fromSqlRow(row)).toList();
  }

  Future<WatchlistItemModel?> getById(String id) async {
    final db = await _db.instance;
    final rows = await db.query('watchlist', where: 'id = ?', whereArgs: [id]);
    if (rows.isEmpty) return null;
    return _fromSqlRow(rows.first);
  }

  Future<void> add(WatchlistItemModel item) async {
    final db = await _db.instance;
    await db.insert('watchlist', _toSqlRow(item), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> update(WatchlistItemModel item) async {
    final db = await _db.instance;
    await db.update('watchlist', _toSqlRow(item), where: 'id = ?', whereArgs: [item.id]);
  }

  Future<void> delete(String id) async {
    final db = await _db.instance;
    await db.delete('watchlist', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> replaceAll(List<WatchlistItemModel> items) async {
    final db = await _db.instance;
    await db.transaction((txn) async {
      await txn.delete('watchlist');
      for (final item in items) {
        await txn.insert('watchlist', _toSqlRow(item));
      }
    });
  }

  Map<String, dynamic> _toSqlRow(WatchlistItemModel item) {
    final map = item.toMap();
    map['isActive'] = item.isActive ? 1 : 0;
    return map;
  }

  WatchlistItemModel _fromSqlRow(Map<String, dynamic> row) {
    final map = Map<String, dynamic>.from(row);
    map['isActive'] = (row['isActive'] as int) == 1;
    return WatchlistItemModel.fromMap(map);
  }
}