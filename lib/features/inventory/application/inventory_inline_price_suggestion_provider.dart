import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_inline_price_suggestion_model.dart';

final inventoryInlinePriceSuggestionProvider =
    Provider.family<InventoryInlinePriceSuggestionModel?, String>(
  (ref, itemId) {
    final state = ref.watch(inventoryControllerProvider);
    final items = state.allItems;

    for (final item in items) {
      if (item.id != itemId) {
        continue;
      }

      final currentExpected = item.expectedSalePrice ?? 0;
      final market = item.marketAverage;

      if (market == null) {
        return InventoryInlinePriceSuggestionModel(
          itemId: itemId,
          currentExpected: currentExpected,
          suggestedPrice: currentExpected,
          delta: 0,
          hasSuggestion: false,
        );
      }

      final suggested = market * 0.98;
      final delta = suggested - currentExpected;
      final hasSuggestion = delta.abs() >= 5;

      return InventoryInlinePriceSuggestionModel(
        itemId: itemId,
        currentExpected: currentExpected,
        suggestedPrice: suggested,
        delta: delta,
        hasSuggestion: hasSuggestion,
      );
    }

    return null;
  },
);