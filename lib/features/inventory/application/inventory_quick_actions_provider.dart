// lib/features/inventory/application/inventory_quick_actions_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_quick_action_model.dart';

final inventoryQuickActionsProvider =
    Provider<List<InventoryQuickActionModel>>((ref) {
  return const [
    InventoryQuickActionModel(
      title: 'Dead Stock Focus',
      subtitle: 'Open items with biggest dead-stock pressure',
      actionKey: 'dead_stock',
    ),
    InventoryQuickActionModel(
      title: 'Best Profit',
      subtitle: 'Open highest expected-profit items',
      actionKey: 'best_profit',
    ),
    InventoryQuickActionModel(
      title: 'Listed Only',
      subtitle: 'Show only listed inventory items',
      actionKey: 'listed_only',
    ),
    InventoryQuickActionModel(
      title: 'Resale Only',
      subtitle: 'Show only resale positions',
      actionKey: 'resale_only',
    ),
  ];
});
