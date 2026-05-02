import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_bulk_selection_provider.dart';

class InventoryBulkSelectionSummary {
  final int count;
  final bool hasSelection;

  const InventoryBulkSelectionSummary({
    required this.count,
    required this.hasSelection,
  });
}

final inventoryBulkSelectionSummaryProvider =
    Provider<InventoryBulkSelectionSummary>((ref) {
  final selected = ref.watch(inventoryBulkSelectionProvider);

  return InventoryBulkSelectionSummary(
    count: selected.length,
    hasSelection: selected.isNotEmpty,
  );
});