class SaleProfitModel {
  final String saleId;
  final String itemId;
  final int quantity;
  final double saleNet;
  final double unitNet;
  final double purchaseCost;
  final double unitCost;
  final double profit;
  final double unitProfit;
  final double roiPercent;
  final bool hasPurchaseCost;

  const SaleProfitModel({
    required this.saleId,
    required this.itemId,
    required this.quantity,
    required this.saleNet,
    required this.unitNet,
    required this.purchaseCost,
    required this.unitCost,
    required this.profit,
    required this.unitProfit,
    required this.roiPercent,
    required this.hasPurchaseCost,
  });
}