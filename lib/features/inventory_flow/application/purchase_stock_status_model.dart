class PurchaseStockStatusModel {
  final String purchaseId;
  final String itemId;
  final int quantity;
  final int soldQuantity;
  final int remainingQuantity;
  final bool isFullySold;

  const PurchaseStockStatusModel({
    required this.purchaseId,
    required this.itemId,
    required this.quantity,
    required this.soldQuantity,
    required this.remainingQuantity,
    required this.isFullySold,
  });
}