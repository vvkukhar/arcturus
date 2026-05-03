import 'package:lego_trading_manager/data/models/item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_entry_model.dart';

class DeadStockDetectorService {
  List<DeadStockEntryModel> build(List<ItemModel> items) {
    final result = items
        .where((item) => item.isActive && (item.daysInInventory ?? 0) >= 30)
        .map((item) {
      final days = item.daysInInventory ?? 0;
      String severity;
      
      if (days >= 120) {
        severity = 'critical';
      } else if (days >= 60) {
        severity = 'warning';
      } else {
        severity = 'watch';
      }

      return DeadStockEntryModel(
        itemId: item.id,
        title: item.title,
        days: days,
        capital: item.totalCost,
        severity: severity,
      );
    }).toList();

    result.sort((a, b) => b.days.compareTo(a.days));
    return result;
  }
}