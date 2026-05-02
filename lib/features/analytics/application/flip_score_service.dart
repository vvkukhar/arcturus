// lib/features/analytics/application/flip_score_service.dart

import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/analytics/application/flip_score_model.dart';

class FlipScoreService {
  double calculateScore(ItemModel item) {
    final expectedProfit = (item.expectedSalePrice ?? 0) - item.totalCost;
    final days = (item.daysInInventory ?? 0).toDouble();

    final profitPart = expectedProfit <= 0 ? 0 : expectedProfit;
    final speedPenalty = days * 0.35;
    final base = profitPart - speedPenalty;

    return base < 0 ? 0 : base;
  }

  FlipScoreModel build(ItemModel item) {
    return FlipScoreModel(
      itemId: item.id,
      title: item.title,
      score: calculateScore(item),
      expectedProfit: (item.expectedSalePrice ?? 0) - item.totalCost,
      daysInInventory: item.daysInInventory ?? 0,
    );
  }
}
