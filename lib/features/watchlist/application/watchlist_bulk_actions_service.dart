import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';

class WatchlistBulkActionsService {
  final WatchlistRepository repository;

  WatchlistBulkActionsService(this.repository);

  void setActiveForIds({
    required List<String> ids,
    required bool isActive,
  }) {
    if (ids.isEmpty) {
      return;
    }

    final all = repository.getAll();

    for (final item in all) {
      if (ids.contains(item.id)) {
        repository.update(item.copyWith(isActive: isActive));
      }
    }
  }

  void deleteByIds(List<String> ids) {
    if (ids.isEmpty) {
      return;
    }

    for (final id in ids) {
      repository.delete(id);
    }
  }
}