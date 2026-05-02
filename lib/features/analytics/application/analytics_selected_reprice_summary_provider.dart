import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_selection_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_selected_reprice_summary_model.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_provider.dart';

final analyticsSelectedRepriceSummaryProvider =
    Provider<AnalyticsSelectedRepriceSummaryModel>((ref) {
  final selected = ref.watch(analyticsRepriceSelectionProvider);
  final suggestions = ref.watch(marketInventoryRepriceSuggestionProvider);

  double currentTotal = 0;
  double suggestedTotal = 0;
  int count = 0;

  for (final item in suggestions) {
    if (!selected.contains(item.itemId)) {
      continue;
    }
    count++;
    currentTotal += item.currentExpected;
    suggestedTotal += item.suggestedPrice;
  }

  return AnalyticsSelectedRepriceSummaryModel(
    count: count,
    currentTotal: currentTotal,
    suggestedTotal: suggestedTotal,
    delta: suggestedTotal - currentTotal,
  );
});