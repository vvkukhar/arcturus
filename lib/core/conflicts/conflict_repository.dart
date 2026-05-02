import 'dart:convert';
import 'package:lego_trading_manager/core/storage/app_database.dart';
import 'package:sqflite/sqflite.dart';

class ConflictRepository {
  final AppDatabase _database;
  ConflictRepository(this._database);
  Future<void> create({
    required String id,
    required String entityType,
    required String entityId,
    required Map<String, dynamic> localJson,
    required Map<String, dynamic> remoteJson,
  }) async {
    final db = await _database.instance;
    await db.insert(
      'conflict_entries',
      {
        'id': id,
        'entity_type': entityType,
        'entity_id': entityId,
        'local_json': jsonEncode(localJson),
        'remote_json': jsonEncode(remoteJson),
        'status': 'pending',
        'created_at': DateTime.now().toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<Map<String, dynamic>>> getPending() async {
    final db = await _database.instance;
    final rows = await db.query(
      'conflict_entries',
      where: 'status = ?',
      whereArgs: ['pending'],
      orderBy: 'created_at ASC',
    );
    return rows
        .map(
          (row) => {
            'id': row['id'],
            'entityType': row['entity_type'],
            'entityId': row['entity_id'],
            'localJson': jsonDecode(row['local_json'] as String),
            'remoteJson': jsonDecode(row['remote_json'] as String),
            'status': row['status'],
          },
        )
        .toList();
  }

  Future<void> resolve(String id) async {
    final db = await _database.instance;
    await db.update(
      'conflict_entries',
      {'status': 'resolved'},
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}
