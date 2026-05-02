import 'dart:convert';

import 'package:sqflite/sqflite.dart';
import 'package:lego_trading_manager/core/storage/app_database.dart';

class CacheRepository {
  final AppDatabase _database;

  CacheRepository(this._database);

  Future<void> put(String key, Object value) async {
    final db = await _database.instance;
    await db.insert(
      'cache_entries',
      {
        'cache_key': key,
        'payload': jsonEncode(value),
        'updated_at': DateTime.now().toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<Map<String, dynamic>?> getMap(String key) async {
    final db = await _database.instance;
    final rows = await db.query(
      'cache_entries',
      where: 'cache_key = ?',
      whereArgs: [key],
      limit: 1,
    );

    if (rows.isEmpty) {
      return null;
    }

    return Map<String, dynamic>.from(
      jsonDecode(rows.first['payload'] as String) as Map,
    );
  }

  Future<List<Map<String, dynamic>>?> getList(String key) async {
    final db = await _database.instance;
    final rows = await db.query(
      'cache_entries',
      where: 'cache_key = ?',
      whereArgs: [key],
      limit: 1,
    );

    if (rows.isEmpty) {
      return null;
    }

    final decoded = jsonDecode(rows.first['payload'] as String) as List;
    return decoded
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<void> remove(String key) async {
    final db = await _database.instance;
    await db.delete(
      'cache_entries',
      where: 'cache_key = ?',
      whereArgs: [key],
    );
  }
}