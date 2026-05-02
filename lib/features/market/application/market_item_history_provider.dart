import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

final marketItemHistoryProvider =
    Provider.family<List<MarketSnapshotModel>, String>((ref, itemRef) {
  return ref.read(marketRepositoryProvider).getByItemRef(itemRef);
});
