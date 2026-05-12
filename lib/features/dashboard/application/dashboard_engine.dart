import 'dart:async';
import 'dart:isolate';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class DashboardAction {
  final String title;
  final String subtitle;
  final String type; 
  const DashboardAction(this.title, this.subtitle, this.type);
}

class DashboardEngineState {
  final double totalInvested;
  final double inventoryValue;
  final double expectedOpenProfit;
  final int trackedCount;
  final int deadStockCount;
  final int activeOpportunities;
  final String headline;
  final String subline;
  final List<DashboardAction> priorityQueue;

  const DashboardEngineState({required this.totalInvested, required this.inventoryValue, required this.expectedOpenProfit, required this.trackedCount, required this.deadStockCount, required this.activeOpportunities, required this.headline, required this.subline, required this.priorityQueue});
}

class DashboardEngine extends AsyncNotifier<DashboardEngineState> {
  @override
  Future<DashboardEngineState> build() async {
    final network = ref.watch(networkCoreProvider);
    
    final sub = network.socketEvents.listen((event) {
      if (['dashboard_refresh', 'inventory_updated', 'sale_registered', 'watchlist_updated'].contains(event['type'])) {
        ref.invalidateSelf();
      }
    });
    ref.onDispose(() => sub.cancel());

    final items = ref.watch(inventoryRepositoryProvider).getAllItems();
    final watchlist = ref.watch(watchlistRepositoryProvider).getAll();
    return await Isolate.run(() => _compute(items, watchlist));
  }

  static DashboardEngineState _compute(List<ItemModel> items, List<WatchlistItemModel> watchlist) {
    double invested = 0, invValue = 0, expProfit = 0;
    int dead = 0, tracked = 0, opps = 0;
    final queue = <DashboardAction>[];

    for (final item in items) {
      if (item.ownershipType == OwnershipType.resale && item.isActive) {
        invested += item.totalCost;
        invValue += (item.marketAverage ?? 0);
        expProfit += ((item.expectedSalePrice ?? 0) - item.totalCost);
        if (item.isTracked) tracked++;

        final days = item.daysInInventory ?? 0;
        final profit = (item.expectedSalePrice ?? 0) - item.totalCost;

        if (days >= 30) {
          dead++;
          if (days >= 90) queue.add(DashboardAction('Reprice ${item.title}', 'Dead stock > 90 days', 'danger'));
        }
        if (profit > 500 && days <= 14) {
          queue.add(DashboardAction('Sell ${item.title}', 'High profit fast flip', 'good'));
        }
      }
    }

    for (final w in watchlist) {
      if (w.marketPrice != null && w.marketPrice! <= w.desiredBuyPrice) {
        opps++;
        queue.add(DashboardAction('Buy ${w.title}', 'Target hit: ${w.marketPrice}', 'good'));
      }
    }

    String head = opps > 0 ? 'Buy opportunities available' : dead > 0 ? 'Dead stock pressure' : 'System Stable';
    String sub = 'Tracked: $tracked • Dead: $dead • Opps: $opps';

    return DashboardEngineState(totalInvested: invested, inventoryValue: invValue, expectedOpenProfit: expProfit, trackedCount: tracked, deadStockCount: dead, activeOpportunities: opps, headline: head, subline: sub, priorityQueue: queue.take(8).toList());
  }
}

final dashboardEngineProvider = AsyncNotifierProvider<DashboardEngine, DashboardEngineState>(DashboardEngine.new);