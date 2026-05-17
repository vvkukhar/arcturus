import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class InventoryAnalysis {
  final List<dynamic> deadStock;
  final int deadStockCount;
  final List<dynamic> alerts;
  final int alertsCount;

  const InventoryAnalysis({
    this.deadStock = const [],
    this.deadStockCount = 0,
    this.alerts = const [],
    this.alertsCount = 0,
  });
}

class InventoryEngineState {
  final List<InventoryItemModel> items;
  final String query;
  final String? status;
  final String sort;
  final int offset;
  final bool hasMore;
  final bool isLoadingMore;
  final InventoryAnalysis analysis;

  const InventoryEngineState({
    required this.items,
    required this.query,
    this.status,
    required this.sort,
    this.offset = 0,
    this.hasMore = true,
    this.isLoadingMore = false,
    this.analysis = const InventoryAnalysis(),
  });

  InventoryEngineState copyWith({
    List<InventoryItemModel>? items, 
    String? query, 
    String? status, 
    String? sort,
    int? offset,
    bool? hasMore,
    bool? isLoadingMore,
    InventoryAnalysis? analysis,
  }) {
    return InventoryEngineState(
      items: items ?? this.items,
      query: query ?? this.query,
      status: status ?? this.status,
      sort: sort ?? this.sort,
      offset: offset ?? this.offset,
      hasMore: hasMore ?? this.hasMore,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      analysis: analysis ?? this.analysis,
    );
  }
}

class InventoryEngine extends AsyncNotifier<InventoryEngineState> {
  static const int _pageSize = 50;

  @override
  Future<InventoryEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      final type = event['type'];
      final payloads = event['payloads'] as List?; 

      if (type == 'inventory_updated' && payloads != null) {
        final currentState = state.valueOrNull;
        if (currentState != null) {
          final itemsList = List<InventoryItemModel>.from(currentState.items);
          
          for (final payload in payloads) {
            if (payload == null || payload['id'] == null) continue;
            
            final index = itemsList.indexWhere((i) => i.id == payload['id']);
            final isDeleted = payload['deleted'] == true;

            if (isDeleted && index != -1) {
               itemsList.removeAt(index);
            } else if (!isDeleted) {
               final updatedItem = InventoryItemModel.fromMap(Map<String, dynamic>.from(payload));
               if (index != -1) {
                 itemsList[index] = updatedItem;
               } else {
                 itemsList.insert(0, updatedItem);
               }
            }
          }
          
          state = AsyncValue.data(currentState.copyWith(items: itemsList));
        }
      } else if (type == 'sale_registered') {
        ref.invalidateSelf(); 
      }
    });
    ref.onDispose(() => sub.cancel());

    return _fetchData('', null, 'newest', 0);
  }

  Future<InventoryEngineState> _fetchData(String query, String? status, String sort, int offset) async {
    final repo = ref.read(inventoryRepositoryProvider);
    final qParams = <String, dynamic>{'limit': _pageSize, 'offset': offset};
    
    if (query.isNotEmpty) qParams['q'] = query;
    if (status != null) qParams['status'] = status;
    
    final items = await repo.fetchAll(query: qParams);
    
    if (sort == 'cost') {
      items.sort((a, b) => b.totalCost.compareTo(a.totalCost));
    } else if (sort == 'profit') {
      items.sort((a, b) => (b.expectedSalePriceManual ?? b.totalCost).compareTo(a.expectedSalePriceManual ?? a.totalCost));
    }

    return InventoryEngineState(
      items: items, 
      query: query, 
      status: status, 
      sort: sort,
      offset: offset,
      hasMore: items.length >= _pageSize,
    );
  }

  void search(String query) async {
    final curr = state.valueOrNull;
    state = const AsyncValue.loading();
    state = AsyncValue.data(await _fetchData(query, curr?.status, curr?.sort ?? 'newest', 0));
  }

  void updateFilters(String? status, String sort) async {
    final curr = state.valueOrNull;
    state = const AsyncValue.loading();
    state = AsyncValue.data(await _fetchData(curr?.query ?? '', status, sort, 0));
  }

  Future<void> loadMore() async {
    final curr = state.valueOrNull;
    if (curr == null || curr.isLoadingMore || !curr.hasMore) return;

    state = AsyncValue.data(curr.copyWith(isLoadingMore: true));
    
    try {
      final repo = ref.read(inventoryRepositoryProvider);
      final nextOffset = curr.offset + _pageSize;
      final qParams = <String, dynamic>{'limit': _pageSize, 'offset': nextOffset};
      
      if (curr.query.isNotEmpty) qParams['q'] = curr.query;
      if (curr.status != null) qParams['status'] = curr.status;

      final newItems = await repo.fetchAll(query: qParams);
      
      final allItems = [...curr.items, ...newItems];

      if (curr.sort == 'cost') {
        allItems.sort((a, b) => b.totalCost.compareTo(a.totalCost));
      } else if (curr.sort == 'profit') {
        allItems.sort((a, b) => (b.expectedSalePriceManual ?? b.totalCost).compareTo(a.expectedSalePriceManual ?? a.totalCost));
      }

      state = AsyncValue.data(curr.copyWith(
        items: allItems,
        offset: nextOffset,
        hasMore: newItems.length >= _pageSize,
        isLoadingMore: false,
      ));
    } catch (e) {
      state = AsyncValue.data(curr.copyWith(isLoadingMore: false));
    }
  }

  Future<void> saveItem(Map<String, dynamic> payload, {String? id}) async {
    final repo = ref.read(inventoryRepositoryProvider);
    if (id != null && id.isNotEmpty) {
      await repo.update(id, payload);
    } else {
      await repo.create(payload);
    }
  }

  Future<void> deleteImage(String imageId) async {}
  Future<void> setMainImage(String imageId) async {}
}

final inventoryEngineProvider = AsyncNotifierProvider<InventoryEngine, InventoryEngineState>(InventoryEngine.new);