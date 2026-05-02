class SalesStockFlowSummaryModel {
  final int totalSales;
  final int totalUnits;
  final int fullyAllocatedSales;
  final int partiallyAllocatedSales;
  final int openSales;
  final int overAllocatedSales;
  final int allocatedUnits;
  final int openUnits;

  const SalesStockFlowSummaryModel({
    required this.totalSales,
    required this.totalUnits,
    required this.fullyAllocatedSales,
    required this.partiallyAllocatedSales,
    required this.openSales,
    required this.overAllocatedSales,
    required this.allocatedUnits,
    required this.openUnits,
  });
}