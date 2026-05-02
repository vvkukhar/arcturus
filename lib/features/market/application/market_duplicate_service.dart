// lib/features/market/application/market_duplicate_service.dart

import 'package:lego_trading_manager/core/utils/id_generator.dart';
import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';

class MarketDuplicateService {
  MarketSnapshotModel duplicate(MarketSnapshotModel snapshot) {
    return snapshot.copyWith(
      id: IdGenerator.next(),
      capturedAt: DateTime.now(),
    );
  }
}
