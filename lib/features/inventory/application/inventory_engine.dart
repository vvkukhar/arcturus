import 'dart:async';
import 'dart:isolate';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class InventoryAnalysis {
  final int activeCount, soldCount, deadStockCount, alertsCount;
  final double totalCost, expectedProfit;
  final List<ItemModel> deadStock, alerts;

  const InventoryAnalysis(this.activeCount, this.soldCount, this.deadStockCount, this.alertsCount, this.totalCost, this.expectedProfit, this.deadStock, this.alerts);
}

class InventoryEngineState {
  final List<ItemModel> allItems;
  final List<ItemModel> visibleItems;
  final Set<String> selectedIds;
  final String query;
  final ItemStatus? filterStatus;
  final String sortOption;
  final InventoryAnalysis analysis;

  const InventoryEngineState({required this.allItems, required this.visibleItems, required this.selectedIds, required this.query, this.filterStatus, required this.sortOption, required this.analysis});
}

class InventoryEngine extends AsyncNotifier<InventoryEngineState> {
  @override
  Future<InventoryEngineState> build() async {
    final network = ref.watch(networkCoreProvider);
    
    final sub = network.socketEvents.listen((event) {
      if (['inventory_updated', 'sale_registered'].contains(event['type'])) {
        ref.invalidateSelf();
      }
    });
    ref.onDispose(() => sub.cancel());

    final items = ref.watch(inventoryRepositoryProvider).getAllItems();
    return await Isolate.run(() => _computeState(items, '', null, 'newest', const {}));
  }

  static InventoryEngineState _computeState(List<ItemModel> all, String q, ItemStatus? status, String sort, Set<String> selected) {
    int active = 0, sold = 0, dead = 0, alertCount = 0;
    double tCost = 0, eProfit = 0;
    final deadList = <ItemModel>[], alertList = <ItemModel>[];
    final qLower = q.trim().toLowerCase();
    var visible = <ItemModel>[];

    for (final item in all) {
      if (item.status == ItemStatus.sold) {
        sold++;
      } else if (item.isActive) {
        active++;
        final profit = (item.expectedSalePrice ?? 0) - (item.totalCost);
        final days = item.daysInInventory ?? 0;
        
        if (days >= 30) { 
          dead++; 
          deadList.add(item); 
        }
        if (profit <= 100 || days >= 60) { 
          alertCount++; 
          alertList.add(item); 
        }
      }

      bool matches = status == null || item.status == status;
      if (matches && qLower.isNotEmpty) {
        matches = item.title.toLowerCase().contains(qLower) || (item.setId ?? '').toLowerCase().contains(qLower);
      }

      if (matches) {
        visible.add(item);
        tCost += item.totalCost;
        eProfit += ((item.expectedSalePrice ?? 0) - item.totalCost);
      }
    }

    deadList.sort((a, b) => (b.daysInInventory ?? 0).compareTo(a.daysInInventory ?? 0));
    
    switch (sort) {
      case 'newest': visible.sort((a, b) => (b.purchaseDate ?? DateTime(2000)).compareTo(a.purchaseDate ?? DateTime(2000))); break;
      case 'cost': visible.sort((a, b) => (b.totalCost).compareTo(a.totalCost)); break;
      case 'profit': visible.sort((a, b) => ((b.expectedSalePrice ?? 0) - b.totalCost).compareTo((a.expectedSalePrice ?? 0) - a.totalCost)); break;
    }

    return InventoryEngineState(allItems: all, visibleItems: visible, selectedIds: selected, query: q, filterStatus: status, sortOption: sort, analysis: InventoryAnalysis(active, sold, dead, alertCount, tCost, eProfit, deadList, alertList));
  }

  Future<void> saveItem(ItemModel item) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final exists = state.value!.allItems.any((e) => e.id == item.id);
    if (exists) {
      await repo.updateItem(item);
    } else {
      await repo.addItem(item);
    }
    
    ref.read(syncEngineProvider.notifier).enqueueMutation('inventory', '/inventory', exists ? 'PATCH' : 'POST', item.toMap());
    state = AsyncValue.data(await Isolate.run(() => _computeState(repo.getAllItems(), state.value!.query, state.value!.filterStatus, state.value!.sortOption, state.value!.selectedIds)));
  }

  void search(String query) async {
    if (state.value == null) return;
    state = AsyncValue.data(await Isolate.run(() => _computeState(state.value!.allItems, query, state.value!.filterStatus, state.value!.sortOption, state.value!.selectedIds)));
  }
}

final inventoryEngineProvider = AsyncNotifierProvider<InventoryEngine, InventoryEngineState>(InventoryEngine.new);