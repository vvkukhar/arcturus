class InventoryAlertFilterCountsModel {
  final int all;
  final int lowProfit;
  final int heldTooLong;
  final int repricing;

  const InventoryAlertFilterCountsModel({
    required this.all,
    required this.lowProfit,
    required this.heldTooLong,
    required this.repricing,
  });
}
