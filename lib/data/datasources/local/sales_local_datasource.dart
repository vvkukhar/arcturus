import 'package:sqflite/sqflite.dart';
import 'package:lego_trading_manager/core/storage/app_database.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';

class SalesLocalDatasource {
  final AppDatabase _db;

  SalesLocalDatasource(this._db);

  Future<List<SaleModel>> getAll() async {
    final db = await _db.instance;
    final rows = await db.query('sales');
    return rows.map((row) => SaleModel.fromJson(row)).toList();
  }

  Future<SaleModel?> getByItemId(String itemId) async {
    final db = await _db.instance;
    final rows = await db.query('sales', where: 'itemId = ?', whereArgs: [itemId]);
    if (rows.isEmpty) return null;
    return SaleModel.fromJson(rows.first);
  }

  Future<void> add(SaleModel sale) async {
    final db = await _db.instance;
    await db.insert('sales', sale.toJson(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> update(SaleModel sale) async {
    final db = await _db.instance;
    await db.update('sales', sale.toJson(), where: 'id = ?', whereArgs: [sale.id]);
  }

  Future<void> delete(String id) async {
    final db = await _db.instance;
    await db.delete('sales', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> replaceAll(List<SaleModel> sales) async {
    final db = await _db.instance;
    await db.transaction((txn) async {
      await txn.delete('sales');
      for (final sale in sales) {
        await txn.insert('sales', sale.toJson());
      }
    });
  }
}