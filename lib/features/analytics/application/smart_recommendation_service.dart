// lib/features/analytics/application/smart_recommendation_service.dart

import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/analytics/application/smart_recommendation_model.dart';

class SmartRecommendationService {
  List<SmartRecommendationModel> build({
    required List<ItemModel> inventory,
    required List<WatchlistItemModel> watchlist,
  }) {
    final result = <SmartRecommendationModel>[];

    final deadStock =
        inventory.where((item) => (item.daysInInventory ?? 0) > 90).length;
    if (deadStock > 0) {
      result.add(
        SmartRecommendationModel(
          title: 'Dead stock pressure',
          message:
              '$deadStock items are older than 90 days. Consider repricing.',
          severity: 'warning',
        ),
      );
    }

    final underDesired = watchlist.where((item) {
      final market = item.marketPrice;
      if (market == null) return false;
      return market <= item.desiredBuyPrice;
    }).length;

    if (underDesired > 0) {
      result.add(
        SmartRecommendationModel(
          title: 'Buy opportunities',
          message:
              '$underDesired watchlist items are already under desired price.',
          severity: 'good',
        ),
      );
    }

    final negativeExpected = inventory.where((item) {
      return ((item.expectedSalePrice ?? 0) - item.totalCost) < 0;
    }).length;

    if (negativeExpected > 0) {
      result.add(
        SmartRecommendationModel(
          title: 'Negative expected profit',
          message: '$negativeExpected items currently look unprofitable.',
          severity: 'danger',
        ),
      );
    }

    if (result.isEmpty) {
      result.add(
        const SmartRecommendationModel(
          title: 'Stable state',
          message: 'No major alerts detected right now.',
          severity: 'neutral',
        ),
      );
    }

    return result;
  }
}
