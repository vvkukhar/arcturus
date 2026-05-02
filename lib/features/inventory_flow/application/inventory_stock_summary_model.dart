class InventoryStockSummaryModel {
  final int totalPurchasedUnits;
  final int totalSoldUnits;
  final int totalRemainingUnits;
  final int openPurchaseLots;
  final int fullySoldLots;

  const InventoryStockSummaryModel({
    required this.totalPurchasedUnits,
    required this.totalSoldUnits,
    required this.totalRemainingUnits,
    required this.openPurchaseLots,
    required this.fullySoldLots,
  });
}