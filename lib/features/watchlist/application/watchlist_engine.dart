import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class WatchlistEngineState {
  final List<WatchlistItemModel> items;
  final String query;

  const WatchlistEngineState({
    required this.items,
    required this.query,
  });

  WatchlistEngineState copyWith({List<WatchlistItemModel>? items, String? query}) {
    return WatchlistEngineState(
      items: items ?? this.items,
      query: query ?? this.query,
    );
  }
}

class WatchlistEngine extends AsyncNotifier<WatchlistEngineState> {
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

    return _fetchData('');
  }

  Future<WatchlistEngineState> _fetchData(String query) async {
    final repo = ref.read(watchlistRepositoryProvider);
    final qParams = <String, dynamic>{'limit': 100};
    
    if (query.isNotEmpty) qParams['q'] = query;
    
    final items = await repo.fetchAll(query: qParams);
    return WatchlistEngineState(items: items, query: query);
  }

  void search(String query) async {
    state = const AsyncValue.loading();
    state = AsyncValue.data(await _fetchData(query));
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