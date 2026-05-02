import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/features/market/application/market_controller.dart';
import 'package:lego_trading_manager/features/market/application/market_sort_option.dart';
import 'package:lego_trading_manager/features/market/application/market_ui_controller.dart';

final marketVisibleSnapshotsProvider =
    Provider<List<MarketSnapshotModel>>((ref) {
  final snapshots = ref.watch(marketControllerProvider);
  final ui = ref.watch(marketUiControllerProvider);
  final inventoryRepository = ref.read(inventoryRepositoryProvider);

  var result = [...snapshots];

  final query = ui.query.trim().toLowerCase();
  if (query.isNotEmpty) {
    result = result.where((snapshot) {
      final itemTitle =
          inventoryRepository.getById(snapshot.itemRef)?.title ?? '';

      return snapshot.source.toLowerCase().contains(query) ||
          itemTitle.toLowerCase().contains(query) ||
          (snapshot.url ?? '').toLowerCase().contains(query);
    }).toList();
  }

  final filter = ui.filter;

  if ((filter.sourceContains ?? '').trim().isNotEmpty) {
    final sourceQuery = filter.sourceContains!.trim().toLowerCase();
    result = result.where((snapshot) {
      return snapshot.source.toLowerCase().contains(sourceQuery);
    }).toList();
  }

  if ((filter.itemTitleContains ?? '').trim().isNotEmpty) {
    final titleQuery = filter.itemTitleContains!.trim().toLowerCase();
    result = result.where((snapshot) {
      final itemTitle =
          inventoryRepository.getById(snapshot.itemRef)?.title ?? '';
      return itemTitle.toLowerCase().contains(titleQuery);
    }).toList();
  }

  if (filter.withUrlOnly) {
    result = result
        .where((snapshot) => (snapshot.url ?? '').trim().isNotEmpty)
        .toList();
  }

  if (filter.positiveTrendOnly) {
    final grouped = <String, List<MarketSnapshotModel>>{};

    for (final snapshot in snapshots) {
      grouped.putIfAbsent(snapshot.itemRef, () => []).add(snapshot);
    }

    final positiveItemRefs = <String>{};

    for (final entry in grouped.entries) {
      final history = [...entry.value];
      history.sort((a, b) => b.capturedAt.compareTo(a.capturedAt));

      if (history.length < 2) continue;

      final latest = history[0];
      final previous = history[1];

      if (latest.averagePrice > previous.averagePrice) {
        positiveItemRefs.add(entry.key);
      }
    }

    result = result.where((snapshot) {
      return positiveItemRefs.contains(snapshot.itemRef);
    }).toList();
  }

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
      result.sort(
        (a, b) => a.source.toLowerCase().compareTo(b.source.toLowerCase()),
      );
      break;
  }

  return result;
});