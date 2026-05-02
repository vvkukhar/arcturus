class AppDataSnapshot {
  final List<Map<String, dynamic>> purchases;
  final List<Map<String, dynamic>> sales;
  final List<Map<String, dynamic>> inventoryAllocations;
  final List<Map<String, dynamic>> salePurchaseLinks;

  const AppDataSnapshot({
    required this.purchases,
    required this.sales,
    required this.inventoryAllocations,
    required this.salePurchaseLinks,
  });

  factory AppDataSnapshot.fromJson(Map<String, dynamic> json) {
    List<Map<String, dynamic>> readList(String key) {
      final value = json[key];

      if (value is! List) return const [];

      return value
          .whereType<Map>()
          .map((item) => Map<String, dynamic>.from(item))
          .toList();
    }

    return AppDataSnapshot(
      purchases: readList('purchases'),
      sales: readList('sales'),
      inventoryAllocations: readList('inventoryAllocations'),
      salePurchaseLinks: readList('salePurchaseLinks'),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'purchases': purchases,
      'sales': sales,
      'inventoryAllocations': inventoryAllocations,
      'salePurchaseLinks': salePurchaseLinks,
    };
  }
}