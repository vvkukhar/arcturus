class SalesAllocatedProfitSummaryModel {
  final int totalSales;
  final int allocatedSales;
  final int unallocatedSales;
  final int totalUnits;
  final int allocatedUnits;
  final int unallocatedUnits;
  final double totalNet;
  final double allocatedCost;
  final double allocatedProfit;
  final double averageAllocatedRoiPercent;
  final double averageUnitProfit;

  const SalesAllocatedProfitSummaryModel({
    required this.totalSales,
    required this.allocatedSales,
    required this.unallocatedSales,
    required this.totalUnits,
    required this.allocatedUnits,
    required this.unallocatedUnits,
    required this.totalNet,
    required this.allocatedCost,
    required this.allocatedProfit,
    required this.averageAllocatedRoiPercent,
    required this.averageUnitProfit,
  });
}