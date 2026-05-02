import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_apply_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/analytics_reprice_selection_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/market_inventory_reprice_suggestion_provider.dart';

class AnalyticsApplySelectedRepriceService {
  final Ref ref;

  AnalyticsApplySelectedRepriceService(this.ref);

  Future<int> run() async {
    final selected = ref.read(analyticsRepriceSelectionProvider);
    final suggestions = ref.read(marketInventoryRepriceSuggestionProvider);

    int affected = 0;
    for (final item in suggestions) {
      if (!selected.contains(item.itemId)) {
        continue;
      }

      await ref.read(analyticsRepriceApplyProvider).applySuggestedPrice(
            itemId: item.itemId,
            suggestedPrice: item.suggestedPrice,
            title: item.title,
          );
      affected++;
    }

    ref.read(analyticsRepriceSelectionProvider.notifier).clear();
    return affected;
  }
}

final analyticsApplySelectedRepriceProvider =
    Provider<AnalyticsApplySelectedRepriceService>((ref) {
  return AnalyticsApplySelectedRepriceService(ref);
});