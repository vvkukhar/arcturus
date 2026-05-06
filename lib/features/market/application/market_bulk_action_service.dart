import 'package:lego_trading_manager/data/models/market_snapshot_model.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_action_type.dart';
import 'package:lego_trading_manager/features/market/application/market_duplicate_service.dart';

class MarketBulkActionService {
  final MarketDuplicateService duplicateService;

  MarketBulkActionService(this.duplicateService);

  List<MarketSnapshotModel> apply({
    required List<MarketSnapshotModel> snapshots,
    required Set<String> selectedIds,
    required MarketBulkActionType action,
  }) {
    switch (action) {
      case MarketBulkActionType.delete:
        return snapshots
            .where((item) => !selectedIds.contains(item.id))
            .toList();
      case MarketBulkActionType.duplicate:
        final selected =
            snapshots.where((item) => selectedIds.contains(item.id));
        return [
          ...snapshots,
          ...selected.map(duplicateService.duplicate),
        ];
    }
  }
}