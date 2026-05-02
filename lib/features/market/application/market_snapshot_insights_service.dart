import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

class MarketSnapshotInsightsService {
  String spread(MarketSnapshotModel snapshot) {
    return (snapshot.highPrice - snapshot.lowPrice).toStringAsFixed(2);
  }

  String midpoint(MarketSnapshotModel snapshot) {
    return ((snapshot.highPrice + snapshot.lowPrice) / 2).toStringAsFixed(2);
  }

  String avgVsLow(MarketSnapshotModel snapshot) {
    if (snapshot.lowPrice <= 0) return '0.0';
    return (((snapshot.averagePrice - snapshot.lowPrice) / snapshot.lowPrice) *
            100)
        .toStringAsFixed(1);
  }
}