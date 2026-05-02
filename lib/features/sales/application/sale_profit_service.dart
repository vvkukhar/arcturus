class SaleProfitService {
  const SaleProfitService();

  double profit({
    required double saleNet,
    required double purchaseCost,
  }) {
    return saleNet - purchaseCost;
  }

  double roiPercent({
    required double profit,
    required double purchaseCost,
  }) {
    if (purchaseCost <= 0) return 0;
    return profit / purchaseCost * 100;
  }
}