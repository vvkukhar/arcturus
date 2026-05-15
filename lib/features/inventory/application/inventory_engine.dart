import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/enums/item_condition.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/core/enums/item_completeness.dart';
import 'package:lego_trading_manager/core/enums/ownership_type.dart';
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
    final repo = ref.read(inventoryRepositoryProvider);
    
    if (await network.isOnline()) {
      try {
        final res = await network.request('GET', '/inventory');
        if (res is List) {
          final mappedItems = res.map((e) {
            return ItemModel(
               id: e['id']?.toString() ?? AppUtils.generateId(),
               title: e['titleSnapshot']?.toString() ?? e['item']?['title'] ?? 'Unknown Item',
               type: ItemType.set,
               condition: ItemCondition.newSealed,
               completeness: ItemCompleteness.complete,
               ownershipType: OwnershipType.resale,
               purchasePrice: (e['purchasePrice'] ?? 0).toDouble(),
               shippingToMe: 0.0,
               extraCosts: 0.0,
               totalCost: (e['totalCost'] ?? 0).toDouble(),
               marketAverage: e['marketAverage']?.toDouble(),
               expectedSalePrice: e['expectedSalePriceManual']?.toDouble(),
               actualSalePrice: e['actualSalePrice']?.toDouble(),
               status: ItemStatus.purchased,
               quantity: e['quantity'] ?? 1,
               isTracked: true,
            );
          }).toList();
          await repo.replaceAll(mappedItems);
        }
      } catch (e) {}
    }

    final sub = network.socketEvents.listen((event) {
      if (['inventory_updated', 'sale_registered'].contains(event['type'])) {
        ref.invalidateSelf();
      }
    });
    ref.onDispose(() => sub.cancel());

    final items = repo.getAllItems();
    return _computeState(items, '', null, 'newest', const {});
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
        if (days >= 30) { dead++; deadList.add(item); }
        if (profit <= 100 || days >= 60) { alertCount++; alertList.add(item); }
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
    final currentState = await future; 
    final network = ref.read(networkCoreProvider);
    final exists = currentState.allItems.any((e) => e.id == item.id);
    
    try {
      final payload = {
        'titleSnapshot': item.title,
        'purchasePrice': item.purchasePrice,
        'totalCost': item.totalCost,
        'quantity': item.quantity,
        'condition': item.condition.name,
        'sealed': item.condition == ItemCondition.newSealed,
        'expectedSalePriceManual': item.expectedSalePrice,
        'notes': item.notes,
      };

      if (exists) {
        await network.request('PATCH', '/inventory', body: { 'id': item.id, ...payload });
      } else {
        // ФІКС: Надсилаємо setNumber/theme тільки якщо вони РЕАЛЬНО заповнені
        final itemRes = await network.request('POST', '/items', body: {
          'title': item.title,
          if (item.setId != null && item.setId!.trim().isNotEmpty) 'setNumber': item.setId!.trim(),
          if (item.theme != null && item.theme!.trim().isNotEmpty) 'theme': item.theme!.trim(),
          'kind': item.type.name,
        });
        payload['itemId'] = itemRes['id'];
        final invRes = await network.request('POST', '/inventory', body: payload);
        item = item.copyWith(id: invRes['id']); 
      }

      final repo = ref.read(inventoryRepositoryProvider);
      if (exists) await repo.updateItem(item);
      else await repo.addItem(item);
      
      state = AsyncValue.data(_computeState(repo.getAllItems(), currentState.query, currentState.filterStatus, currentState.sortOption, currentState.selectedIds));
    } catch (e) {
      throw Exception(e.toString().replaceAll('Exception: ', ''));
    }
  }

  void search(String query) async {
    final currentState = await future;
    state = AsyncValue.data(_computeState(currentState.allItems, query, currentState.filterStatus, currentState.sortOption, currentState.selectedIds));
  }
}

final inventoryEngineProvider = AsyncNotifierProvider<InventoryEngine, InventoryEngineState>(InventoryEngine.new);