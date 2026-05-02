class AppDataIntegrityModel {
  final int purchasesCount;
  final int salesCount;
  final int allocationsCount;
  final int linksCount;
  final int orphanAllocationsCount;
  final int orphanLinksCount;
  final int overAllocatedSalesCount;
  final int overSoldPurchasesCount;
  final bool isHealthy;

  const AppDataIntegrityModel({
    required this.purchasesCount,
    required this.salesCount,
    required this.allocationsCount,
    required this.linksCount,
    required this.orphanAllocationsCount,
    required this.orphanLinksCount,
    required this.overAllocatedSalesCount,
    required this.overSoldPurchasesCount,
    required this.isHealthy,
  });
}