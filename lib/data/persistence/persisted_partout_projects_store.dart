import 'package:lego_trading_manager/core/utils/isolate_json_helper.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/data/persistence/shared_prefs_json_store.dart';

class PersistedPartOutProjectsStore {
  static const String _key = 'partout_projects';
  final SharedPrefsJsonStore _store = SharedPrefsJsonStore();

  Future<List<PartOutProjectModel>> load() async {
    final raw = await _store.read(_key);
    if (raw == null || raw.trim().isEmpty) return const [];

    final decoded = await IsolateJsonHelper.decode(raw) as List;
    return decoded
        .map(
          (e) =>
              PartOutProjectModel.fromMap(Map<String, dynamic>.from(e as Map)),
        )
        .toList();
  }

  Future<void> save(List<PartOutProjectModel> items) async {
    final data = items.map((e) => e.toMap()).toList();
    final raw = await IsolateJsonHelper.encode(data);
    await _store.write(_key, raw);
  }

  Future<void> clear() async {
    await _store.remove(_key);
  }
}