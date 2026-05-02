class InventoryAlertOverviewModel {
  final int totalAlerts;
  final int uniqueItems;
  final int severeAlerts;

  const InventoryAlertOverviewModel({
    required this.totalAlerts,
    required this.uniqueItems,
    required this.severeAlerts,
  });
}
