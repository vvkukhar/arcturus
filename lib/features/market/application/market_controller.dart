import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/features/market/application/market_link_watchlist_service.dart';

class MarketController extends Notifier<List<MarketSnapshotModel>> {
  @override
  List<MarketSnapshotModel> build() {
    return ref.read(marketRepositoryProvider).getAll();
  }

  void load() {
    state = ref.read(marketRepositoryProvider).getAll();
  }

  void addSnapshot(MarketSnapshotModel snapshot) {
    ref.read(marketRepositoryProvider).add(snapshot);
    _syncWatchlistPrice(snapshot);
    load();
  }

  void updateSnapshot(MarketSnapshotModel snapshot) {
    ref.read(marketRepositoryProvider).update(snapshot);
    _syncWatchlistPrice(snapshot);
    load();
  }

  void deleteSnapshot(String id) {
    ref.read(marketRepositoryProvider).delete(id);
    load();
  }

  void _syncWatchlistPrice(MarketSnapshotModel snapshot) {
    final watchlistRepo = ref.read(watchlistRepositoryProvider);
    final service = MarketLinkWatchlistService(watchlistRepo);
    service.syncMarketPrice(
      itemRef: snapshot.itemRef,
      averagePrice: snapshot.averagePrice,
    );
  }
}

final marketControllerProvider =
    NotifierProvider<MarketController, List<MarketSnapshotModel>>(
  MarketController.new,
);