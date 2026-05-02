class SaleAllocationSummaryModel {
  final String saleId;
  final int allocatedQuantity;
  final double allocatedCost;
  final bool hasAllocation;

  const SaleAllocationSummaryModel({
    required this.saleId,
    required this.allocatedQuantity,
    required this.allocatedCost,
    required this.hasAllocation,
  });
}