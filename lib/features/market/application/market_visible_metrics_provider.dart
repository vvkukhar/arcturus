// lib/features/market/application/market_visible_metrics_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_visible_snapshots_provider.dart';

class MarketVisibleMetricsModel {
  final int visibleCount;
  final double averageLow;
  final double averageMid;
  final double averageHigh;
  final int withUrlCount;

  const MarketVisibleMetricsModel({
    required this.visibleCount,
    required this.averageLow,
    required this.averageMid,
    required this.averageHigh,
    required this.withUrlCount,
  });
}

final marketVisibleMetricsProvider = Provider<MarketVisibleMetricsModel>((ref) {
  final items = ref.watch(marketVisibleSnapshotsProvider);

  if (items.isEmpty) {
    return const MarketVisibleMetricsModel(
      visibleCount: 0,
      averageLow: 0,
      averageMid: 0,
      averageHigh: 0,
      withUrlCount: 0,
    );
  }

  final totalLow = items.fold<double>(0, (sum, item) => sum + item.lowPrice);
  final totalMid =
      items.fold<double>(0, (sum, item) => sum + item.averagePrice);
  final totalHigh = items.fold<double>(0, (sum, item) => sum + item.highPrice);

  return MarketVisibleMetricsModel(
    visibleCount: items.length,
    averageLow: totalLow / items.length,
    averageMid: totalMid / items.length,
    averageHigh: totalHigh / items.length,
    withUrlCount:
        items.where((item) => (item.url ?? '').trim().isNotEmpty).length,
  );
});
