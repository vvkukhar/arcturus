// lib/core/utils/partout_calculator.dart

import 'package:lego_trading_manager/data/models/partout_line_model.dart';

class PartOutCalculator {
  static double totalCost({
    required double purchaseCost,
    required double shippingCost,
    required double extraCosts,
  }) {
    return purchaseCost + shippingCost + extraCosts;
  }

  static double expectedPartOutValue(List<PartOutLineModel> lines) {
    return lines.fold<double>(0, (sum, line) => sum + line.expectedTotalPrice);
  }

  static double actualPartOutValue(List<PartOutLineModel> lines) {
    return lines.fold<double>(0, (sum, line) => sum + line.actualTotalPrice);
  }

  static double expectedProfit({
    required double totalCost,
    required double expectedPartOutValue,
  }) {
    return expectedPartOutValue - totalCost;
  }

  static double actualProfit({
    required double totalCost,
    required double actualPartOutValue,
  }) {
    return actualPartOutValue - totalCost;
  }
}
