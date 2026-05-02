import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/data/repositories/market_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/market/application/market_link_watchlist_service.dart';

class MarketController extends StateNotifier<List<MarketSnapshotModel>> {
  final MarketRepository repository;
  final MarketLinkWatchlistService linkWatchlistService;

  MarketController({
    required this.repository,
    required this.linkWatchlistService,
  }) : super([]) {
    load();
  }

  void load() {
    state = repository.getAll();
  }

  void addSnapshot(MarketSnapshotModel snapshot) {
    repository.add(snapshot);

    linkWatchlistService.syncMarketPrice(
      itemRef: snapshot.itemRef,
      averagePrice: snapshot.averagePrice,
    );

    load();
  }

  void updateSnapshot(MarketSnapshotModel snapshot) {
    repository.update(snapshot);

    linkWatchlistService.syncMarketPrice(
      itemRef: snapshot.itemRef,
      averagePrice: snapshot.averagePrice,
    );

    load();
  }

  void deleteSnapshot(String id) {
    repository.delete(id);
    load();
  }
}

final marketControllerProvider =
    StateNotifierProvider<MarketController, List<MarketSnapshotModel>>((ref) {
  final marketRepository = ref.read(marketRepositoryProvider);
  final watchlistRepository = ref.read(watchlistRepositoryProvider);

  return MarketController(
    repository: marketRepository,
    linkWatchlistService: MarketLinkWatchlistService(
      watchlistRepository,
    ),
  );
});