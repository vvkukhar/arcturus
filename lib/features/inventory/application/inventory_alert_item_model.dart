class InventoryAlertItemModel {
  final String itemId;
  final String title;
  final String reason;
  final int severity;

  const InventoryAlertItemModel({
    required this.itemId,
    required this.title,
    required this.reason,
    required this.severity,
  });
}
