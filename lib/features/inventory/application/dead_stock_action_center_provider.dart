import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_action_model.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_detector_provider.dart';

final deadStockActionCenterProvider =
    Provider<List<DeadStockActionModel>>((ref) {
  final entries = ref.watch(deadStockEntriesProvider);

  if (entries.isEmpty) {
    return const [
      DeadStockActionModel(
        title: 'No dead stock pressure',
        subtitle: 'Nothing urgent right now',
        actionKey: 'none',
      ),
    ];
  }

  final critical = entries.where((e) => e.severity == 'critical').length;
  final warning = entries.where((e) => e.severity == 'warning').length;

  return [
    DeadStockActionModel(
      title: 'Reprice critical stock',
      subtitle: '$critical items are heavily overdue',
      actionKey: 'critical_reprice',
    ),
    DeadStockActionModel(
      title: 'Review warning stock',
      subtitle: '$warning items need review',
      actionKey: 'warning_review',
    ),
    DeadStockActionModel(
      title: 'Open inventory sorted by aging',
      subtitle: 'Start with oldest items first',
      actionKey: 'open_inventory_aging',
    ),
  ];
});
