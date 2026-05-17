import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class WatchlistEngineState {
  final List<WatchlistItemModel> items;
  final String query;
  final int offset;
  final bool hasMore;
  final bool isLoadingMore;

  const WatchlistEngineState({
    required this.items,
    required this.query,
    this.offset = 0,
    this.hasMore = true,
    this.isLoadingMore = false,
  });

  WatchlistEngineState copyWith({
    List<WatchlistItemModel>? items, 
    String? query,
    int? offset,
    bool? hasMore,
    bool? isLoadingMore,
  }) {
    return WatchlistEngineState(
      items: items ?? this.items,
      query: query ?? this.query,
      offset: offset ?? this.offset,
      hasMore: hasMore ?? this.hasMore,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    );
  }
}

class WatchlistEngine extends AsyncNotifier<WatchlistEngineState> {
  static const int _pageSize = 50;

  @override
  Future<WatchlistEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      final type = event['type'];
      final payloads = event['payloads'] as List?;

      if (type == 'watchlist_updated' && payloads != null) {
        final currentState = state.valueOrNull;
        if (currentState != null) {
          final itemsList = List<WatchlistItemModel>.from(currentState.items);
          
          for (final payload in payloads) {
            if (payload == null || payload['id'] == null) continue;

            final index = itemsList.indexWhere((i) => i.id == payload['id']);
            final isDeleted = payload['deleted'] == true;

            if (isDeleted && index != -1) {
               itemsList.removeAt(index);
            } else if (!isDeleted) {
               final updatedItem = WatchlistItemModel.fromMap(Map<String, dynamic>.from(payload));
               if (index != -1) {
                 itemsList[index] = updatedItem;
               } else {
                 itemsList.insert(0, updatedItem);
               }
            }
          }
          
          itemsList.sort((a, b) => b.priority.compareTo(a.priority));
          state = AsyncValue.data(currentState.copyWith(items: itemsList));
        }
      }
    });
    ref.onDispose(() => sub.cancel());

    return _fetchData('', 0);
  }

  Future<WatchlistEngineState> _fetchData(String query, int offset) async {
    final repo = ref.read(watchlistRepositoryProvider);
    final qParams = <String, dynamic>{'limit': _pageSize, 'offset': offset};
    
    if (query.isNotEmpty) qParams['q'] = query;
    
    final items = await repo.fetchAll(query: qParams);
    return WatchlistEngineState(
      items: items, 
      query: query,
      offset: offset,
      hasMore: items.length >= _pageSize,
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
      final repo = ref.read(watchlistRepositoryProvider);
      final nextOffset = curr.offset + _pageSize;
      final qParams = <String, dynamic>{'limit': _pageSize, 'offset': nextOffset};
      
      if (curr.query.isNotEmpty) qParams['q'] = curr.query;

      final newItems = await repo.fetchAll(query: qParams);
      
      final allItems = [...curr.items, ...newItems];
      allItems.sort((a, b) => b.priority.compareTo(a.priority));

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
    final repo = ref.read(watchlistRepositoryProvider);
    if (id != null && id.isNotEmpty) {
      await repo.update(id, payload);
    } else {
      await repo.create(payload);
    }
  }

  Future<void> deleteItem(String id) async {
    await ref.read(watchlistRepositoryProvider).delete(id);
  }
}

final watchlistEngineProvider = AsyncNotifierProvider<WatchlistEngine, WatchlistEngineState>(WatchlistEngine.new);