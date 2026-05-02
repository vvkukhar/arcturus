class BackupHealthModel {
  final bool hasInventory;
  final bool hasSales;
  final bool hasPurchases;

  const BackupHealthModel({
    required this.hasInventory,
    required this.hasSales,
    required this.hasPurchases,
  });

  bool get looksHealthy => hasInventory || hasSales || hasPurchases;
}