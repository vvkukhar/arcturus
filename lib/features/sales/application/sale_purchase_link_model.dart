class SalePurchaseLinkModel {
  final String saleId;
  final String purchaseId;

  const SalePurchaseLinkModel({
    required this.saleId,
    required this.purchaseId,
  });

  factory SalePurchaseLinkModel.fromJson(Map<String, dynamic> json) {
    return SalePurchaseLinkModel(
      saleId: json['saleId'] as String? ?? '',
      purchaseId: json['purchaseId'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'saleId': saleId,
      'purchaseId': purchaseId,
    };
  }
}