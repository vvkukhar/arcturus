// lib/data/store/market_memory_store.dart

import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

class MarketMemoryStore {
  MarketMemoryStore._();

  static final List<MarketSnapshotModel> _snapshots = [];

  static List<MarketSnapshotModel> get snapshots => List.from(_snapshots);

  static void replaceAll(List<MarketSnapshotModel> items) {
    _snapshots
      ..clear()
      ..addAll(items);
  }

  static void hydrate(List<MarketSnapshotModel> items) {
    replaceAll(items);
  }

  static void add(MarketSnapshotModel snapshot) {
    _snapshots.insert(0, snapshot);
  }

  static void update(MarketSnapshotModel updatedSnapshot) {
    final index =
        _snapshots.indexWhere((snapshot) => snapshot.id == updatedSnapshot.id);
    if (index == -1) return;
    _snapshots[index] = updatedSnapshot;
  }

  static void delete(String id) {
    _snapshots.removeWhere((snapshot) => snapshot.id == id);
  }

  static MarketSnapshotModel? getById(String id) {
    try {
      return snapshots.firstWhere((snapshot) => snapshot.id == id);
    } catch (_) {
      return null;
    }
  }

  static List<MarketSnapshotModel> getByItemRef(String itemRef) {
    return _snapshots.where((snapshot) => snapshot.itemRef == itemRef).toList();
  }

  static void clear() {
    _snapshots.clear();
  }
}
