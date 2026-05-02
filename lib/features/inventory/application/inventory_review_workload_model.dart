class InventoryReviewWorkloadModel {
  final int totalReviewItems;
  final int urgentItems;
  final int moderateItems;
  final String label;

  const InventoryReviewWorkloadModel({
    required this.totalReviewItems,
    required this.urgentItems,
    required this.moderateItems,
    required this.label,
  });
}
