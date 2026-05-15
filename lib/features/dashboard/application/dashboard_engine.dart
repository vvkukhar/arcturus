import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/core_providers.dart';
import 'package:lego_trading_manager/core/services/currency_converter.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_engine.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_engine.dart';

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
  final String currency;
  final List<DashboardAction> priorityQueue;

  const DashboardEngineState({required this.totalInvested, required this.inventoryValue, required this.expectedOpenProfit, required this.trackedCount, required this.deadStockCount, required this.activeOpportunities, required this.headline, required this.subline, required this.currency, required this.priorityQueue});
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

    // ФІКС: Дашборд тепер автоматично стежить за локальними змінами в Інвентарі та Списку спостереження
    final invState = ref.watch(inventoryEngineProvider).valueOrNull;
    final watchState = ref.watch(watchlistEngineProvider).valueOrNull;

    final items = invState?.allItems ?? [];
    final watchlist = watchState?.allItems ?? [];
    final converter = ref.watch(currencyConverterProvider);
    
    return _compute(items, watchlist, converter);
  }

  static DashboardEngineState _compute(List<ItemModel> items, List<WatchlistItemModel> watchlist, CurrencyConverter converter) {
    double invested = 0, invValue = 0, expProfit = 0;
    int dead = 0, tracked = 0, opps = 0;
    final queue = <DashboardAction>[];

    for (final item in items) {
      if (item.ownershipType == OwnershipType.resale && item.isActive) {
        final costConv = converter(item.totalCost);
        final marketConv = item.marketAverage != null ? converter(item.marketAverage!) : 0.0;
        final expSaleConv = item.expectedSalePrice != null ? converter(item.expectedSalePrice!) : 0.0;

        invested += costConv;
        invValue += marketConv;
        expProfit += (expSaleConv - costConv);
        
        if (item.isTracked) tracked++;

        final days = item.daysInInventory ?? 0;
        final profitConv = expSaleConv - costConv;

        if (days >= 30) {
          dead++;
          if (days >= 90) queue.add(DashboardAction('Reprice ${item.title}', 'Dead stock > 90 days', 'danger'));
        }
        if (profitConv > converter(500) && days <= 14) {
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

    return DashboardEngineState(totalInvested: invested, inventoryValue: invValue, expectedOpenProfit: expProfit, trackedCount: tracked, deadStockCount: dead, activeOpportunities: opps, headline: head, subline: sub, currency: converter.baseCurrency, priorityQueue: queue.take(8).toList());
  }
}

final dashboardEngineProvider = AsyncNotifierProvider<DashboardEngine, DashboardEngineState>(DashboardEngine.new);