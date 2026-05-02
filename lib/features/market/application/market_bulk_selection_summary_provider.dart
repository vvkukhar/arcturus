import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/market/application/market_bulk_selection_controller.dart';

class MarketBulkSelectionSummaryModel {
  final int selectedCount;
  final bool hasSelection;

  const MarketBulkSelectionSummaryModel({
    required this.selectedCount,
    required this.hasSelection,
  });
}

final marketBulkSelectionSummaryProvider =
    Provider<MarketBulkSelectionSummaryModel>((ref) {
  final selected = ref.watch(marketBulkSelectionProvider);

  return MarketBulkSelectionSummaryModel(
    selectedCount: selected.length,
    hasSelection: selected.isNotEmpty,
  );
});