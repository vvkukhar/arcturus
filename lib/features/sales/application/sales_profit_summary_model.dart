class SalesProfitSummaryModel {
  final int totalSales;
  final int matchedSales;
  final int unmatchedSales;
  final int totalUnits;
  final int matchedUnits;
  final int unmatchedUnits;
  final double totalNet;
  final double totalPurchaseCost;
  final double totalProfit;
  final double averageRoiPercent;
  final double averageUnitProfit;

  const SalesProfitSummaryModel({
    required this.totalSales,
    required this.matchedSales,
    required this.unmatchedSales,
    required this.totalUnits,
    required this.matchedUnits,
    required this.unmatchedUnits,
    required this.totalNet,
    required this.totalPurchaseCost,
    required this.totalProfit,
    required this.averageRoiPercent,
    required this.averageUnitProfit,
  });
}