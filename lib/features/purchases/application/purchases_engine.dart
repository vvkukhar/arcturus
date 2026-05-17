import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class PurchasesEngineState {
  final List<dynamic> purchases;
  final String query;
  final int offset;
  final bool hasMore;
  final bool isLoadingMore;

  const PurchasesEngineState({
    required this.purchases,
    required this.query,
    this.offset = 0,
    this.hasMore = true,
    this.isLoadingMore = false,
  });

  PurchasesEngineState copyWith({
    List<dynamic>? purchases, 
    String? query,
    int? offset,
    bool? hasMore,
    bool? isLoadingMore,
  }) {
    return PurchasesEngineState(
      purchases: purchases ?? this.purchases,
      query: query ?? this.query,
      offset: offset ?? this.offset,
      hasMore: hasMore ?? this.hasMore,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    );
  }
}

class PurchasesEngine extends AsyncNotifier<PurchasesEngineState> {
  static const int _pageSize = 50;

  @override
  Future<PurchasesEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      final type = event['type'];
      final payloads = event['payloads'] as List?;

      if (['purchase_order.created', 'purchase_order.updated', 'purchase_order.received'].contains(type) && payloads != null) {
        final currentState = state.valueOrNull;
        if (currentState != null) {
          final itemsList = List<dynamic>.from(currentState.purchases);
          
          for (final payload in payloads) {
            if (payload == null || payload['id'] == null) continue;
            final index = itemsList.indexWhere((i) => i['id'] == payload['id']);

            if (index != -1) {
               itemsList[index] = payload;
            } else {
               itemsList.insert(0, payload);
            }
          }
          
          state = AsyncValue.data(currentState.copyWith(purchases: itemsList));
        }
      }
    });
    ref.onDispose(() => sub.cancel());

    return _fetchData('', 0);
  }

  Future<PurchasesEngineState> _fetchData(String query, int offset) async {
    final repo = ref.read(purchasesRepositoryProvider);
    final qParams = <String, dynamic>{'limit': _pageSize, 'offset': offset};
    
    if (query.isNotEmpty) qParams['q'] = query;
    
    // Purchases repository returns dynamic List, keeping it consistent with original setup
    final purchasesRaw = await repo.network.request('GET', '/procurement', body: qParams);
    final purchases = purchasesRaw is List ? purchasesRaw : [];
    
    return PurchasesEngineState(
      purchases: purchases, 
      query: query,
      offset: offset,
      hasMore: purchases.length >= _pageSize,
    );
  }

  void search(String query) async {
    state = const AsyncValue.loading();
    state = AsyncValue.data(await _fetchData(query, 0));
  }

  Future<void> loadMore() async {
    final curr = state.valueOrNull;
    if (curr == null || curr.isLoadingMore || !curr.hasMore) return;

    state = AsyncValue.data(curr.copyWith(isLoadingMore: true));
    
    try {
      final repo = ref.read(purchasesRepositoryProvider);
      final nextOffset = curr.offset + _pageSize;
      final qParams = <String, dynamic>{'limit': _pageSize, 'offset': nextOffset};
      
      if (curr.query.isNotEmpty) qParams['q'] = curr.query;

      final purchasesRaw = await repo.network.request('GET', '/procurement', body: qParams);
      final newPurchases = purchasesRaw is List ? purchasesRaw : [];
      
      state = AsyncValue.data(curr.copyWith(
        purchases: [...curr.purchases, ...newPurchases],
        offset: nextOffset,
        hasMore: newPurchases.length >= _pageSize,
        isLoadingMore: false,
      ));
    } catch (e) {
      state = AsyncValue.data(curr.copyWith(isLoadingMore: false));
    }
  }

  Future<void> savePurchase(Map<String, dynamic> payload, {String? id}) async {
    final repo = ref.read(purchasesRepositoryProvider);
    if (id != null && id.isNotEmpty) {
      await repo.network.request('PATCH', '/procurement', body: {'id': id, ...payload});
    } else {
      await repo.network.request('POST', '/procurement', body: payload);
    }
  }

  Future<void> deletePurchase(String id) async {
    // Delete is not implemented natively for purchase orders on backend yet, dummy method kept for interface
  }
}

final purchasesEngineProvider = AsyncNotifierProvider<PurchasesEngine, PurchasesEngineState>(PurchasesEngine.new);