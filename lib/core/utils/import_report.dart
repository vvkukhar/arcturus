class ImportReport {
  final int importedInventory;
  final int importedPurchases;
  final int importedSales;
  final int importedWatchlist;
  final int importedMarketSnapshots;
  final int importedPartOutProjects;
  final int importedPartOutLines;

  const ImportReport({
    required this.importedInventory,
    required this.importedPurchases,
    required this.importedSales,
    required this.importedWatchlist,
    required this.importedMarketSnapshots,
    required this.importedPartOutProjects,
    required this.importedPartOutLines,
  });

  int get totalImported =>
      importedInventory +
      importedPurchases +
      importedSales +
      importedWatchlist +
      importedMarketSnapshots +
      importedPartOutProjects +
      importedPartOutLines;
}
