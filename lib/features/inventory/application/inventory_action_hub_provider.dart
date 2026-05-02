import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_detector_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_hub_entry_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunities_provider.dart';

final inventoryActionHubProvider =
    Provider<List<InventoryActionHubEntryModel>>((ref) {
  final deadStock = ref.watch(deadStockEntriesProvider);
  final opportunities = ref.watch(watchlistOpportunitiesProvider);

  return [
    InventoryActionHubEntryModel(
      title: 'Review dead stock',
      subtitle: '${deadStock.length} aging items need action',
      actionKey: 'dead_stock',
    ),
    InventoryActionHubEntryModel(
      title: 'Open buy opportunities',
      subtitle:
          '${opportunities.where((e) => e.underDesired).length} items hit desired price',
      actionKey: 'opportunities',
    ),
    InventoryActionHubEntryModel(
      title: 'Sort by highest profit',
      subtitle: 'Focus on best flips first',
      actionKey: 'profit_first',
    ),
    InventoryActionHubEntryModel(
      title: 'Sort by oldest inventory',
      subtitle: 'Free locked capital',
      actionKey: 'oldest_first',
    ),
  ];
});
