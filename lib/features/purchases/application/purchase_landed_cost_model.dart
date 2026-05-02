class PurchaseLandedCostModel {
  final double purchasePrice;
  final double shippingCost;
  final double additionalCosts;
  final double finalTotal;
  final double shippingSharePercent;
  final double extraSharePercent;

  const PurchaseLandedCostModel({
    required this.purchasePrice,
    required this.shippingCost,
    required this.additionalCosts,
    required this.finalTotal,
    required this.shippingSharePercent,
    required this.extraSharePercent,
  });
}