class SaleAllocationLotViewModel {
  final String purchaseId;
  final String itemId;
  final String source;
  final int quantity;
  final double unitCost;
  final double totalCost;
  final String currency;

  const SaleAllocationLotViewModel({
    required this.purchaseId,
    required this.itemId,
    required this.source,
    required this.quantity,
    required this.unitCost,
    required this.totalCost,
    required this.currency,
  });
}