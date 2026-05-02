import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/features/market/application/market_trend_deep_model.dart';

final marketTrendDeepProvider = Provider<List<MarketTrendDeepModel>>((ref) {
  final marketRepository = ref.read(marketRepositoryProvider);
  final inventoryRepository = ref.read(inventoryRepositoryProvider);

  final snapshots = marketRepository.getAll();
  final grouped = <String, List<MarketSnapshotModel>>{};

  for (final snapshot in snapshots) {
    grouped.putIfAbsent(snapshot.itemRef, () => []).add(snapshot);
  }

  final result = grouped.entries.map((entry) {
    final list = entry.value;

    double low = list.first.lowPrice;
    double high = list.first.highPrice;
    double average = 0;

    for (final snapshot in list) {
      if (snapshot.lowPrice < low) low = snapshot.lowPrice;
      if (snapshot.highPrice > high) high = snapshot.highPrice;
      average += snapshot.averagePrice;
    }

    average = average / list.length;

    final title =
        inventoryRepository.getById(entry.key)?.title ?? 'Unknown item';

    return MarketTrendDeepModel(
      itemTitle: title,
      low: low,
      average: average,
      high: high,
      spread: high - low,
      snapshots: list.length,
    );
  }).toList();

  result.sort((a, b) => b.spread.compareTo(a.spread));
  return result;
});