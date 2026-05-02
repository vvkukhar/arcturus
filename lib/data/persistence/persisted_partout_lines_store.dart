// lib/data/persistence/persisted_partout_lines_store.dart

import 'dart:convert';

import 'package:lego_trading_manager/data/models/partout_line_model.dart';
import 'package:lego_trading_manager/data/persistence/shared_prefs_json_store.dart';

class PersistedPartOutLinesStore {
  static const String _key = 'partout_lines';

  final SharedPrefsJsonStore _store = SharedPrefsJsonStore();

  Future<List<PartOutLineModel>> load() async {
    final raw = await _store.read(_key);
    if (raw == null || raw.trim().isEmpty) return const [];

    final decoded = jsonDecode(raw) as List;
    return decoded
        .map(
          (e) => PartOutLineModel.fromMap(Map<String, dynamic>.from(e as Map)),
        )
        .toList();
  }

  Future<void> save(List<PartOutLineModel> items) async {
    final data = items.map((e) => e.toMap()).toList();
    await _store.write(_key, jsonEncode(data));
  }

  Future<void> clear() async {
    await _store.remove(_key);
  }
}
