import 'dart:convert';
import 'package:lego_trading_manager/core/storage/app_database.dart';
import 'package:sqflite/sqflite.dart';

class SyncQueueRepository {
  final AppDatabase _database;
  SyncQueueRepository(this._database);
  Future<void> enqueue({
    required String id,
    required String queueType,
    required String endpoint,
    required String method,
    required Map<String, dynamic> body,
  }) async {
    final db = await _database.instance;
    await db.insert(
      'sync_queue',
      {
        'id': id,
        'queue_type': queueType,
        'endpoint': endpoint,
        'method': method,
        'body_json': jsonEncode(body),
        'status': 'pending',
        'created_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
        'retry_count': 0,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<Map<String, dynamic>>> getPending() async {
    final db = await _database.instance;
    final rows = await db.query(
      'sync_queue',
      where: 'status = ?',
      whereArgs: ['pending'],
      orderBy: 'created_at ASC',
    );
    return rows
        .map((row) => {
              'id': row['id'],
              'queueType': row['queue_type'],
              'endpoint': row['endpoint'],
              'method': row['method'],
              'body': jsonDecode(row['body_json'] as String),
              'status': row['status'],
              'retryCount': row['retry_count'],
            })
        .toList();
  }

  Future<void> markDone(String id) async {
    final db = await _database.instance;
    await db.update(
      'sync_queue',
      {
        'status': 'done',
        'updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> markRetry(String id, int retryCount) async {
    final db = await _database.instance;
    await db.update(
      'sync_queue',
      {
        'status': 'pending',
        'retry_count': retryCount,
        'updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> markFailed(String id) async {
    final db = await _database.instance;
    await db.update(
      'sync_queue',
      {
        'status': 'failed',
        'updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}
