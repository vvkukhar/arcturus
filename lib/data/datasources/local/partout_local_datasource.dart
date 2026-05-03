import 'package:sqflite/sqflite.dart';
import 'package:lego_trading_manager/core/storage/app_database.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';

class PartOutLocalDatasource {
  final AppDatabase _db;

  PartOutLocalDatasource(this._db);

  Future<List<PartOutProjectModel>> getAllProjects() async {
    final db = await _db.instance;
    final rows = await db.query('partout_projects');
    return rows.map((row) => PartOutProjectModel.fromMap(row)).toList();
  }

  Future<List<PartOutLineModel>> getAllLines() async {
    final db = await _db.instance;
    final rows = await db.query('partout_lines');
    return rows.map((row) => PartOutLineModel.fromMap(row)).toList();
  }

  Future<void> addProject(PartOutProjectModel project) async {
    final db = await _db.instance;
    await db.insert('partout_projects', project.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> updateProject(PartOutProjectModel project) async {
    final db = await _db.instance;
    await db.update('partout_projects', project.toMap(), where: 'id = ?', whereArgs: [project.id]);
  }

  Future<void> deleteProject(String id) async {
    final db = await _db.instance;
    await db.delete('partout_projects', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> addLine(PartOutLineModel line) async {
    final db = await _db.instance;
    await db.insert('partout_lines', line.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> updateLine(PartOutLineModel line) async {
    final db = await _db.instance;
    await db.update('partout_lines', line.toMap(), where: 'id = ?', whereArgs: [line.id]);
  }

  Future<void> deleteLine(String id) async {
    final db = await _db.instance;
    await db.delete('partout_lines', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> replaceAllProjects(List<PartOutProjectModel> projects) async {
    final db = await _db.instance;
    await db.transaction((txn) async {
      await txn.delete('partout_projects');
      for (final p in projects) {
        await txn.insert('partout_projects', p.toMap());
      }
    });
  }

  Future<void> replaceAllLines(List<PartOutLineModel> lines) async {
    final db = await _db.instance;
    await db.transaction((txn) async {
      await txn.delete('partout_lines');
      for (final l in lines) {
        await txn.insert('partout_lines', l.toMap());
      }
    });
  }
}