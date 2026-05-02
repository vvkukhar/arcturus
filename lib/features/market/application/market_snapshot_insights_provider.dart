import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_form_values_service.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_insights_service.dart';

final marketSnapshotInsightsServiceProvider =
    Provider<MarketSnapshotInsightsService>((ref) {
  return MarketSnapshotInsightsService();
});

final marketSnapshotFormValuesServiceProvider =
    Provider<MarketSnapshotFormValuesService>((ref) {
  return const MarketSnapshotFormValuesService();
});