// lib/features/analytics/application/auto_price_suggestion_service.dart

import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/analytics/application/auto_price_suggestion_model.dart';

class AutoPriceSuggestionService {
  AutoPriceSuggestionModel? build(ItemModel item) {
    final market = item.marketAverage;
    if (market == null || market <= 0) return null;

    final expected = item.expectedSalePrice ?? 0;
    final days = item.daysInInventory ?? 0;

    double suggested = market;
    String reason = 'Match market average';

    if (days > 90) {
      suggested = market * 0.93;
      reason = 'Long time in inventory → discount';
    } else if (days > 45) {
      suggested = market * 0.97;
      reason = 'Medium age → slight reduction';
    } else if (days <= 14) {
      suggested = market * 1.03;
      reason = 'Fresh item → small premium';
    }

    return AutoPriceSuggestionModel(
      itemId: item.id,
      title: item.title,
      currentExpected: expected,
      suggestedPrice: suggested,
      marketAverage: market,
      reason: reason,
    );
  }
}
