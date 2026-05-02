class InventoryStockValueModel {
  final int remainingUnits;
  final double remainingCostValue;
  final double soldCostValue;
  final double totalCostValue;

  const InventoryStockValueModel({
    required this.remainingUnits,
    required this.remainingCostValue,
    required this.soldCostValue,
    required this.totalCostValue,
  });
}