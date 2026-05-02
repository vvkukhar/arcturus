class SaleNetBreakdownModel {
  final double salePrice;
  final double platformFee;
  final double shippingByMe;
  final double finalNet;
  final int quantity;
  final double unitNet;
  final double feeSharePercent;
  final double shippingSharePercent;
  final double netSharePercent;

  const SaleNetBreakdownModel({
    required this.salePrice,
    required this.platformFee,
    required this.shippingByMe,
    required this.finalNet,
    required this.quantity,
    required this.unitNet,
    required this.feeSharePercent,
    required this.shippingSharePercent,
    required this.netSharePercent,
  });
}