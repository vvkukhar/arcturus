class InventorySaleAllocationModel {
  final String saleId;
  final String purchaseId;
  final String itemId;
  final int quantity;

  const InventorySaleAllocationModel({
    required this.saleId,
    required this.purchaseId,
    required this.itemId,
    required this.quantity,
  });

  factory InventorySaleAllocationModel.fromJson(Map<String, dynamic> json) {
    return InventorySaleAllocationModel(
      saleId: json['saleId'] as String? ?? '',
      purchaseId: json['purchaseId'] as String? ?? '',
      itemId: json['itemId'] as String? ?? '',
      quantity: (json['quantity'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'saleId': saleId,
      'purchaseId': purchaseId,
      'itemId': itemId,
      'quantity': quantity,
    };
  }
}