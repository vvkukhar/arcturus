import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';

class CommandCenterAction {
  final String id, title, subtitle, route;
  final int? badgeCount;
  const CommandCenterAction(this.id, this.title, this.subtitle, this.route, [this.badgeCount]);
}

class CommandCenterSection {
  final String title;
  final List<CommandCenterAction> actions;
  const CommandCenterSection(this.title, this.actions);
}

class CommandCenterEngineState {
  final List<CommandCenterSection> visibleSections;
  final String query;

  const CommandCenterEngineState({required this.visibleSections, required this.query});

  factory CommandCenterEngineState.compute(String query, int invCount, int watchCount, int purCount, int saleCount) {
    final allSections = [
      CommandCenterSection('Core', [
        CommandCenterAction('pos', 'POS Terminal', 'Point of Sale & Barcode Scanner', AppRouter.pos),
        CommandCenterAction('inventory', 'Inventory', 'Items, filters, bulk actions', AppRouter.inventory, invCount),
        CommandCenterAction('watchlist', 'Watchlist', 'Targets and opportunities', AppRouter.watchlist, watchCount),
        CommandCenterAction('market', 'Market', 'Snapshots and trends', AppRouter.market),
      ]),
      CommandCenterSection('Trading Operations', [
        CommandCenterAction('purchases', 'Purchases', 'Buy records and source costs', AppRouter.purchases, purCount),
        CommandCenterAction('sales', 'Sales', 'Sales, fees and net', AppRouter.sales, saleCount),
        CommandCenterAction('deal_eval', 'Deal Evaluator', 'Check new deals quickly', AppRouter.dealEvaluator),
      ]),
      CommandCenterSection('System & Analysis', [
        CommandCenterAction('analytics', 'Analytics', 'Financial overview and metrics', AppRouter.analytics),
        CommandCenterAction('activity', 'Activity Log', 'Recent events and saved actions', AppRouter.activityLog),
        CommandCenterAction('settings', 'Settings & Sync', 'System controls and tools', AppRouter.settings),
      ]),
    ];

    final q = query.trim().toLowerCase();
    if (q.isEmpty) return CommandCenterEngineState(visibleSections: allSections, query: query);

    final filtered = <CommandCenterSection>[];
    for (final sec in allSections) {
      final acts = sec.actions.where((a) => a.title.toLowerCase().contains(q) || a.subtitle.toLowerCase().contains(q)).toList();
      if (acts.isNotEmpty) filtered.add(CommandCenterSection(sec.title, acts));
    }

    return CommandCenterEngineState(visibleSections: filtered, query: query);
  }
}

class CommandCenterEngine extends Notifier<CommandCenterEngineState> {
  @override
  CommandCenterEngineState build() {
    return _computeState('');
  }

  CommandCenterEngineState _computeState(String query) {
    final inv = ref.watch(inventoryRepositoryProvider).getAllItems().length;
    final watch = ref.watch(watchlistRepositoryProvider).getAll().length;
    final pur = ref.watch(purchasesRepositoryProvider).getAllPurchases().length;
    final sale = ref.watch(salesRepositoryProvider).getAllSales().length;
    return CommandCenterEngineState.compute(query, inv, watch, pur, sale);
  }

  void search(String query) {
    state = _computeState(query);
  }
}

final commandCenterEngineProvider = NotifierProvider<CommandCenterEngine, CommandCenterEngineState>(CommandCenterEngine.new);