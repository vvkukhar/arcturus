import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class AppDatabase {
  Database? _database;

  Future<Database> get instance async {
    if (_database != null) {
      return _database!;
    }

    final databasesPath = await databaseFactory.getDatabasesPath();
    final dbPath = join(databasesPath, 'arcturus_app.db');

    _database = await databaseFactory.openDatabase(
      dbPath,
      options: OpenDatabaseOptions(
        version: 1,
        onCreate: (db, version) async {
          await db.execute('''
            CREATE TABLE cache_entries (
              cache_key TEXT PRIMARY KEY,
              payload TEXT NOT NULL,
              updated_at TEXT NOT NULL
            )
          ''');

          await db.execute('''
            CREATE TABLE sync_queue (
              id TEXT PRIMARY KEY,
              queue_type TEXT NOT NULL,
              endpoint TEXT NOT NULL,
              method TEXT NOT NULL,
              body_json TEXT NOT NULL,
              status TEXT NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              retry_count INTEGER NOT NULL
            )
          ''');

          await db.execute('''
            CREATE TABLE conflict_entries (
              id TEXT PRIMARY KEY,
              entity_type TEXT NOT NULL,
              entity_id TEXT NOT NULL,
              local_json TEXT NOT NULL,
              remote_json TEXT NOT NULL,
              status TEXT NOT NULL,
              created_at TEXT NOT NULL
            )
          ''');
        },
      ),
    );

    return _database!;
  }
}