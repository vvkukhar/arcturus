import 'package:lego_trading_manager/core/utils/isolate_json_helper.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/data/persistence/shared_prefs_json_store.dart';

class PersistedWatchlistStore {
  static const String _key = 'watchlist';
  final SharedPrefsJsonStore _store = SharedPrefsJsonStore();

  Future<List<WatchlistItemModel>> load() async {
    final raw = await _store.read(_key);
    if (raw == null || raw.trim().isEmpty) return const [];

    final decoded = await IsolateJsonHelper.decode(raw) as List;
    return decoded
        .map((e) => WatchlistItemModel.fromMap(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<void> save(List<WatchlistItemModel> items) async {
    final data = items.map((e) => e.toMap()).toList();
    final raw = await IsolateJsonHelper.encode(data);
    await _store.write(_key, raw);
  }

  Future<void> clear() async {
    await _store.remove(_key);
  }
}