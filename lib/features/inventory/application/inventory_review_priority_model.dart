class InventoryReviewPriorityModel {
  final String label;
  final int severeAlerts;
  final int highRiskItems;

  const InventoryReviewPriorityModel({
    required this.label,
    required this.severeAlerts,
    required this.highRiskItems,
  });
}
