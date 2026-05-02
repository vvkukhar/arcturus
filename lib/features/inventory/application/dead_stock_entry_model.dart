// lib/features/inventory/application/dead_stock_entry_model.dart

class DeadStockEntryModel {
  final String itemId;
  final String title;
  final int days;
  final double capital;
  final String severity;

  const DeadStockEntryModel({
    required this.itemId,
    required this.title,
    required this.days,
    required this.capital,
    required this.severity,
  });
}
