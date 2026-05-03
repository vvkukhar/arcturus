import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/features/market/application/market_controller.dart';
import 'package:lego_trading_manager/features/market/application/market_sort_option.dart';
import 'package:lego_trading_manager/features/market/application/market_ui_controller.dart';

final marketVisibleSnapshotsProvider = Provider<List<MarketSnapshotModel>>((ref) {
  final snapshots = ref.watch(marketControllerProvider);
  final ui = ref.watch(marketUiControllerProvider);
  final inventoryRepository = ref.read(inventoryRepositoryProvider);

  final query = ui.query.trim().toLowerCase();
  final filter = ui.filter;
  final filterSource = filter.sourceContains?.trim().toLowerCase() ?? '';
  final filterTitle = filter.itemTitleContains?.trim().toLowerCase() ?? '';

  // Для позитивного тренду прекалькулюємо айдішніки ОДИН раз до циклу, 
  // щоб не рахувати історію для кожного елемента окремо всередині where()
  Set<String> positiveItemRefs = {};
  if (filter.positiveTrendOnly) {
    final grouped = <String, List<MarketSnapshotModel>>{};
    for (final snapshot in snapshots) {
      grouped.putIfAbsent(snapshot.itemRef, () => []).add(snapshot);
    }
    for (final entry in grouped.entries) {
      final history = [...entry.value]..sort((a, b) => b.capturedAt.compareTo(a.capturedAt));
      if (history.length > 1 && history[0].averagePrice > history[1].averagePrice) {
        positiveItemRefs.add(entry.key);
      }
    }
  }

  // ОПТИМІЗАЦІЯ: Один прохід для фільтрації
  var result = snapshots.where((snapshot) {
    final itemTitle = inventoryRepository.getById(snapshot.itemRef)?.title ?? '';

    if (query.isNotEmpty) {
      final matchesQuery = snapshot.source.toLowerCase().contains(query) ||
          itemTitle.toLowerCase().contains(query) ||
          (snapshot.url ?? '').toLowerCase().contains(query);
      if (!matchesQuery) return false;
    }

    if (filterSource.isNotEmpty && !snapshot.source.toLowerCase().contains(filterSource)) {
      return false;
    }

    if (filterTitle.isNotEmpty && !itemTitle.toLowerCase().contains(filterTitle)) {
      return false;
    }

    if (filter.withUrlOnly && (snapshot.url ?? '').trim().isEmpty) {
      return false;
    }

    if (filter.positiveTrendOnly && !positiveItemRefs.contains(snapshot.itemRef)) {
      return false;
    }

    return true;
  }).toList();

  switch (ui.sortOption) {
    case MarketSortOption.newest:
      result.sort((a, b) => b.capturedAt.compareTo(a.capturedAt));
      break;
    case MarketSortOption.oldest:
      result.sort((a, b) => a.capturedAt.compareTo(b.capturedAt));
      break;
    case MarketSortOption.averageHighToLow:
      result.sort((a, b) => b.averagePrice.compareTo(a.averagePrice));
      break;
    case MarketSortOption.lowHighToLow:
      result.sort((a, b) => b.lowPrice.compareTo(a.lowPrice));
      break;
    case MarketSortOption.highHighToLow:
      result.sort((a, b) => b.highPrice.compareTo(a.highPrice));
      break;
    case MarketSortOption.sourceAsc:
      result.sort((a, b) => a.source.toLowerCase().compareTo(b.source.toLowerCase()));
      break;
  }

  return result;
});