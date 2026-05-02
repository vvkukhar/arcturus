class SaleStockFlowStatusModel {
  final String saleId;
  final int saleQuantity;
  final int allocatedQuantity;
  final bool isFullyAllocated;
  final bool isOverAllocated;
  final String label;

  const SaleStockFlowStatusModel({
    required this.saleId,
    required this.saleQuantity,
    required this.allocatedQuantity,
    required this.isFullyAllocated,
    required this.isOverAllocated,
    required this.label,
  });
}