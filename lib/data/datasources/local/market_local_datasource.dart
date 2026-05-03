import 'package:sqflite/sqflite.dart';
import 'package:lego_trading_manager/core/storage/app_database.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

class MarketLocalDatasource {
  final AppDatabase _db;

  MarketLocalDatasource(this._db);

  Future<List<MarketSnapshotModel>> getAll() async {
    final db = await _db.instance;
    final rows = await db.query('market_snapshots');
    return rows.map((row) => MarketSnapshotModel.fromMap(row)).toList();
  }

  Future<List<MarketSnapshotModel>> getByItemRef(String itemRef) async {
    final db = await _db.instance;
    final rows = await db.query('market_snapshots', where: 'itemRef = ?', whereArgs: [itemRef]);
    return rows.map((row) => MarketSnapshotModel.fromMap(row)).toList();
  }

  Future<void> add(MarketSnapshotModel snapshot) async {
    final db = await _db.instance;
    await db.insert('market_snapshots', snapshot.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> update(MarketSnapshotModel snapshot) async {
    final db = await _db.instance;
    await db.update('market_snapshots', snapshot.toMap(), where: 'id = ?', whereArgs: [snapshot.id]);
  }

  Future<void> delete(String id) async {
    final db = await _db.instance;
    await db.delete('market_snapshots', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> replaceAll(List<MarketSnapshotModel> snapshots) async {
    final db = await _db.instance;
    await db.transaction((txn) async {
      await txn.delete('market_snapshots');
      for (final s in snapshots) {
        await txn.insert('market_snapshots', s.toMap());
      }
    });
  }
}