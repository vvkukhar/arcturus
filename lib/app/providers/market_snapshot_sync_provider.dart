import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_snapshot_sync_service.dart';

final marketSnapshotSyncServiceProvider =
    Provider<MarketSnapshotSyncService>((ref) {
  return MarketSnapshotSyncService();
});
