import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class SalesEngineState {
  final List<SaleModel> sales;
  final String query;
  final int offset;
  final bool hasMore;
  final bool isLoadingMore;

  const SalesEngineState({
    required this.sales,
    required this.query,
    this.offset = 0,
    this.hasMore = true,
    this.isLoadingMore = false,
  });

  SalesEngineState copyWith({
    List<SaleModel>? sales, 
    String? query,
    int? offset,
    bool? hasMore,
    bool? isLoadingMore,
  }) {
    return SalesEngineState(
      sales: sales ?? this.sales,
      query: query ?? this.query,
      offset: offset ?? this.offset,
      hasMore: hasMore ?? this.hasMore,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    );
  }
}

class SalesEngine extends AsyncNotifier<SalesEngineState> {
  static const int _pageSize = 50;

  @override
  Future<SalesEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      final type = event['type'];
      final payloads = event['payloads'] as List?;

      if (payloads == null) return;

      if (type == 'sale_registered') {
        final currentState = state.valueOrNull;
        if (currentState != null) {
          final itemsList = List<SaleModel>.from(currentState.sales);
          for (final payload in payloads) {
            if (payload == null || payload['id'] == null) continue;
            final updatedItem = SaleModel.fromMap(Map<String, dynamic>.from(payload));
            itemsList.insert(0, updatedItem);
          }
          state = AsyncValue.data(currentState.copyWith(sales: itemsList));
        }
      } else if (type == 'sale_deleted') {
         final currentState = state.valueOrNull;
         if (currentState != null) {
           final itemsList = List<SaleModel>.from(currentState.sales);
           for (final payload in payloads) {
             if (payload == null || payload['id'] == null) continue;
             itemsList.removeWhere((i) => i.id == payload['id']);
           }
           state = AsyncValue.data(currentState.copyWith(sales: itemsList));
         }
      }
    });
    ref.onDispose(() => sub.cancel());

    return _fetchData('', 0);
  }

  Future<SalesEngineState> _fetchData(String query, int offset) async {
    final repo = ref.read(salesRepositoryProvider);
    final qParams = <String, dynamic>{'limit': _pageSize, 'offset': offset};
    
    if (query.isNotEmpty) qParams['q'] = query;
    
    final sales = await repo.fetchAll(query: qParams);
    return SalesEngineState(
      sales: sales, 
      query: query, 
      offset: offset,
      hasMore: sales.length >= _pageSize,
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
      final repo = ref.read(salesRepositoryProvider);
      final nextOffset = curr.offset + _pageSize;
      final qParams = <String, dynamic>{'limit': _pageSize, 'offset': nextOffset};
      
      if (curr.query.isNotEmpty) qParams['q'] = curr.query;

      final newSales = await repo.fetchAll(query: qParams);
      
      state = AsyncValue.data(curr.copyWith(
        sales: [...curr.sales, ...newSales],
        offset: nextOffset,
        hasMore: newSales.length >= _pageSize,
        isLoadingMore: false,
      ));
    } catch (e) {
      state = AsyncValue.data(curr.copyWith(isLoadingMore: false));
    }
  }

  Future<void> saveSale(Map<String, dynamic> payload, {String? id}) async {
    final repo = ref.read(salesRepositoryProvider);
    if (id != null && id.isNotEmpty) {
      await repo.update(id, payload);
    } else {
      await repo.create(payload);
    }
  }

  Future<void> deleteSale(String id) async {
    await ref.read(salesRepositoryProvider).delete(id);
  }
}

final salesEngineProvider = AsyncNotifierProvider<SalesEngine, SalesEngineState>(SalesEngine.new);