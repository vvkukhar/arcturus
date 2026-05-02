class SalesFilterModel {
  final String? platformContains;
  final String? buyerContains;
  final double? minNet;
  final double? maxNet;

  const SalesFilterModel({
    this.platformContains,
    this.buyerContains,
    this.minNet,
    this.maxNet,
  });

  static const empty = SalesFilterModel();

  bool get hasAnyFilter {
    return (platformContains?.trim().isNotEmpty ?? false) ||
        (buyerContains?.trim().isNotEmpty ?? false) ||
        minNet != null ||
        maxNet != null;
  }
}