import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/data/store/market_memory_store.dart';

class MarketRepository {
  List<MarketSnapshotModel> getAll() {
    return List<MarketSnapshotModel>.from(MarketMemoryStore.snapshots);
  }

  MarketSnapshotModel? getById(String id) {
    return MarketMemoryStore.getById(id);
  }

  List<MarketSnapshotModel> getByItemRef(String itemRef) {
    final items = MarketMemoryStore.getByItemRef(itemRef);
    items.sort((a, b) => b.capturedAt.compareTo(a.capturedAt));
    return items;
  }

  void add(MarketSnapshotModel snapshot) {
    MarketMemoryStore.add(snapshot);
  }

  void update(MarketSnapshotModel snapshot) {
    MarketMemoryStore.update(snapshot);
  }

  void delete(String id) {
    MarketMemoryStore.delete(id);
  }

  void replaceAll(List<MarketSnapshotModel> snapshots) {
    MarketMemoryStore.snapshots
      ..clear()
      ..addAll(snapshots);
  }
}