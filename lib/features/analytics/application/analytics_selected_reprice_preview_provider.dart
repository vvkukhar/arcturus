import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_selection_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_selected_reprice_preview_model.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_provider.dart';

final analyticsSelectedRepricePreviewProvider =
    Provider<AnalyticsSelectedRepricePreviewModel>((ref) {
  final selected = ref.watch(analyticsRepriceSelectionProvider);
  final suggestions = ref.watch(marketInventoryRepriceSuggestionProvider);
  final titles = <String>[];
  for (final item in suggestions) {
    if (selected.contains(item.itemId)) {
      titles.add(item.title);
    }
  }
  return AnalyticsSelectedRepricePreviewModel(
    count: titles.length,
    titles: titles,
  );
});
