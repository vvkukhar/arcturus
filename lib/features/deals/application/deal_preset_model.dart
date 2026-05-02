class DealPresetModel {
  final String title;
  final double feePercent;
  final double shipping;
  final double extraCosts;

  const DealPresetModel({
    required this.title,
    required this.feePercent,
    required this.shipping,
    required this.extraCosts,
  });
}
