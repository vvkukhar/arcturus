import 'package:sqflite/sqflite.dart';
import 'package:lego_trading_manager/core/storage/app_database.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class PurchasesLocalDatasource {
  final AppDatabase _db;

  PurchasesLocalDatasource(this._db);

  Future<List<PurchaseModel>> getAll() async {
    final db = await _db.instance;
    final rows = await db.query('purchases');
    return rows.map((row) => PurchaseModel.fromMap(row)).toList();
  }

  Future<List<PurchaseModel>> getByItemId(String itemId) async {
    final db = await _db.instance;
    final rows = await db.query('purchases', where: 'itemId = ?', whereArgs: [itemId]);
    return rows.map((row) => PurchaseModel.fromMap(row)).toList();
  }

  Future<void> add(PurchaseModel purchase) async {
    final db = await _db.instance;
    await db.insert('purchases', purchase.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> update(PurchaseModel purchase) async {
    final db = await _db.instance;
    await db.update('purchases', purchase.toMap(), where: 'id = ?', whereArgs: [purchase.id]);
  }

  Future<void> delete(String id) async {
    final db = await _db.instance;
    await db.delete('purchases', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> replaceAll(List<PurchaseModel> purchases) async {
    final db = await _db.instance;
    await db.transaction((txn) async {
      await txn.delete('purchases');
      for (final purchase in purchases) {
        await txn.insert('purchases', purchase.toMap());
      }
    });
  }
}