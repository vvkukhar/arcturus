class FeeDefaultsModel {
  final double saleFeePercent;
  final double shippingByMe;
  final double shippingByBuyer;
  final double purchaseShipping;
  final double purchaseExtraCosts;

  const FeeDefaultsModel({
    required this.saleFeePercent,
    required this.shippingByMe,
    required this.shippingByBuyer,
    required this.purchaseShipping,
    required this.purchaseExtraCosts,
  });
}