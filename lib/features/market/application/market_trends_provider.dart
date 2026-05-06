import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/features/market/application/market_trend_model.dart';

final marketTrendsProvider = Provider<List<MarketTrendModel>>((ref) {
  final repo = ref.read(marketRepositoryProvider);
  final all = repo.getAll();

  final grouped = <String, List<MarketSnapshotModel>>{};

  for (final snapshot in all) {
    grouped.putIfAbsent(snapshot.itemRef, () => []).add(snapshot);
  }

  final trends = <MarketTrendModel>[];

  for (final entry in grouped.entries) {
    final items = [...entry.value];
    items.sort((a, b) => b.capturedAt.compareTo(a.capturedAt));

    if (items.length < 2) continue;

    final latest = items[0];
    final previous = items[1];

    trends.add(
      MarketTrendModel(
        itemRef: entry.key,
        latestAverage: latest.averagePrice,
        previousAverage: previous.averagePrice,
        delta: latest.averagePrice - previous.averagePrice,
      ),
    );
  }

  trends.sort((a, b) => b.delta.abs().compareTo(a.delta.abs()));
  return trends;
});