class ProfitMetrics {
  final double totalCost;
  final double netProfit;
  final double roi;
  final double margin;

  const ProfitMetrics({
    required this.totalCost,
    required this.netProfit,
    required this.roi,
    required this.margin,
  });
}

class DealPreview {
  final double totalCost;
  final double expectedProfit;
  final double roi;
  final double margin;
  final String rating;
  final String decision;

  const DealPreview({
    required this.totalCost,
    required this.expectedProfit,
    required this.roi,
    required this.margin,
    required this.rating,
    required this.decision,
  });
}

class ProfitCalculator {
  static double calculateTotalCost({
    required double purchasePrice,
    required double shippingToMe,
    required double extraCosts,
  }) {
    return purchasePrice + shippingToMe + extraCosts;
  }

  static ProfitMetrics calculateSaleMetrics({
    required double purchasePrice,
    required double shippingToMe,
    required double extraCosts,
    required double actualSalePrice,
    required double platformFee,
    required double shippingPaidByMe,
  }) {
    final double totalCost = calculateTotalCost(
      purchasePrice: purchasePrice,
      shippingToMe: shippingToMe,
      extraCosts: extraCosts,
    );

    final double netProfit =
        actualSalePrice - platformFee - shippingPaidByMe - totalCost;

    final double roi =
        totalCost <= 0 ? 0.0 : ((netProfit / totalCost) * 100.0).toDouble();

    final double margin = actualSalePrice <= 0
        ? 0.0
        : ((netProfit / actualSalePrice) * 100.0).toDouble();

    return ProfitMetrics(
      totalCost: totalCost,
      netProfit: netProfit,
      roi: roi,
      margin: margin,
    );
  }

  static DealPreview evaluateDeal({
    required double buyPrice,
    required double shipping,
    required double extraCosts,
    required double targetSalePrice,
    required double estimatedFees,
    required double estimatedShipping,
  }) {
    final double totalCost = buyPrice + shipping + extraCosts;
    final double expectedProfit =
        targetSalePrice - estimatedFees - estimatedShipping - totalCost;

    final double roi = totalCost <= 0
        ? 0.0
        : ((expectedProfit / totalCost) * 100.0).toDouble();

    final double margin = targetSalePrice <= 0
        ? 0.0
        : ((expectedProfit / targetSalePrice) * 100.0).toDouble();

    String rating;
    String decision;

    if (expectedProfit >= 1000 && roi >= 30) {
      rating = 'strong';
      decision = 'buy';
    } else if (expectedProfit >= 300 && roi >= 15) {
      rating = 'medium';
      decision = 'consider';
    } else {
      rating = 'weak';
      decision = 'skip';
    }

    return DealPreview(
      totalCost: totalCost,
      expectedProfit: expectedProfit,
      roi: roi,
      margin: margin,
      rating: rating,
      decision: decision,
    );
  }
}
