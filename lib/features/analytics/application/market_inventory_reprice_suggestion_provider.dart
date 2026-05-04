import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_model.dart';

final marketInventoryRepriceSuggestionProvider =
    Provider<List<MarketInventoryRepriceSuggestionModel>>((ref) {
  final items = ref.watch(inventoryRepositoryProvider).getAllItems();

  final result = items
      .where((item) =>
          item.marketAverage != null && item.expectedSalePrice != null)
      .where(
          (item) => (item.expectedSalePrice! - item.marketAverage!).abs() >= 5)
      .map(
        (item) => MarketInventoryRepriceSuggestionModel(
          itemId: item.id,
          title: item.title,
          currentExpected: item.expectedSalePrice!,
          marketAverage: item.marketAverage!,
          suggestedPrice: item.marketAverage! * 0.98,
        ),
      )
      .toList();

  result.sort(
    (a, b) => (b.currentExpected - b.marketAverage)
        .abs()
        .compareTo((a.currentExpected - a.marketAverage).abs()),
  );

  return result;
});