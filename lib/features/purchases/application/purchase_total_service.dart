class PurchaseTotalService {
  const PurchaseTotalService();

  double calculate({
    required double purchasePrice,
    required double shippingCost,
    required double additionalCosts,
  }) {
    return purchasePrice + shippingCost + additionalCosts;
  }
}