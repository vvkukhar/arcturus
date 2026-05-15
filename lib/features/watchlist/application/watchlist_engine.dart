import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/core/enums/item_type.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/features/activity/application/activity_engine.dart'; // ІМПОРТ

class WatchlistAnalysis {
  final int activeCount, targetHits, acceptableBuys, tooHigh;
  final double estimatedSpread;
  const WatchlistAnalysis(this.activeCount, this.targetHits, this.acceptableBuys, this.tooHigh, this.estimatedSpread);
}

class WatchlistEngineState {
  final List<WatchlistItemModel> allItems, visibleItems;
  final Set<String> selectedIds;
  final String query, sortOption;
  final bool activeOnly;
  final WatchlistAnalysis analysis;
  const WatchlistEngineState({required this.allItems, required this.visibleItems, required this.selectedIds, required this.query, required this.sortOption, required this.activeOnly, required this.analysis});
}

class WatchlistEngine extends AsyncNotifier<WatchlistEngineState> {
  @override
  Future<WatchlistEngineState> build() async {
    final network = ref.watch(networkCoreProvider);
    final repo = ref.read(watchlistRepositoryProvider);

    if (await network.isOnline()) {
      try {
        final res = await network.request('GET', '/watchlist');
        if (res is List) {
          final mapped = res.map((e) => WatchlistItemModel(
            id: e['id'] ?? AppUtils.generateId(),
            title: e['titleSnapshot'] ?? 'Unknown',
            type: ItemType.set,
            desiredBuyPrice: (e['desiredBuyPrice'] ?? 0).toDouble(),
            maxBuyPrice: (e['maxBuyPrice'] ?? 0).toDouble(),
            marketPrice: null,
            isActive: e['active'] ?? true,
            createdAt: e['createdAt'] != null ? DateTime.parse(e['createdAt']) : DateTime.now(),
          )).toList();
          await repo.replaceAll(mapped);
        }
      } catch(e) { print("Init fetch error (Watchlist): $e"); }
    }

    final sub = network.socketEvents.listen((event) {
      if (['watchlist_updated'].contains(event['type'])) ref.invalidateSelf();
    });
    ref.onDispose(() => sub.cancel());

    final list = repo.getAll();
    return _computeState(list, '', 'newest', const {}, false);
  }

  static WatchlistEngineState _computeState(List<WatchlistItemModel> all, String q, String sort, Set<String> selected, bool activeOnly) {
    int active = 0, hits = 0, acceptable = 0, high = 0; double spread = 0;
    final qLower = q.trim().toLowerCase(); var visible = <WatchlistItemModel>[];

    for (final w in all) {
      if (w.isActive) active++;
      bool matches = !activeOnly || w.isActive;
      if (matches && qLower.isNotEmpty) matches = w.title.toLowerCase().contains(qLower);
      if (matches) visible.add(w);
    }
    return WatchlistEngineState(allItems: all, visibleItems: visible, selectedIds: selected, query: q, sortOption: sort, activeOnly: activeOnly, analysis: WatchlistAnalysis(active, hits, acceptable, high, spread));
  }

  Future<void> saveItem(WatchlistItemModel item) async {
    final currentState = await future;
    final network = ref.read(networkCoreProvider);
    final exists = currentState.allItems.any((e) => e.id == item.id);
    
    try {
      final payload = {
        'titleSnapshot': item.title,
        'desiredBuyPrice': item.desiredBuyPrice,
        'maxBuyPrice': item.maxBuyPrice,
        'active': item.isActive,
        'notes': item.comment,
      };

      if (!exists) {
        final itemRes = await network.request('POST', '/items', body: {'title': item.title, 'kind': 'set'});
        payload['itemId'] = itemRes['id'];
      }

      final res = await network.request(exists ? 'PATCH' : 'POST', '/watchlist', body: exists ? {'id': item.id, ...payload} : payload);

      final newItem = exists ? item : item.copyWith(id: res['id']);
      final repo = ref.read(watchlistRepositoryProvider);
      if (exists) await repo.update((e) => e.id == item.id, newItem);
      else await repo.add(newItem);
      
      // ФІКС: Записуємо в Activity Log!
      ref.read(activityEngineProvider.notifier).logAction(
        exists ? 'Watchlist Target Updated' : 'Watchlist Target Created', 
        item.title, 
        'watchlist'
      );

      state = AsyncValue.data(_computeState(repo.getAll(), currentState.query, currentState.sortOption, currentState.selectedIds, currentState.activeOnly));
    } catch (e) {
      throw Exception(e);
    }
  }

  // ФІКС: Метод для видалення
  Future<void> deleteItem(String id) async {
    final currentState = await future;
    final repo = ref.read(watchlistRepositoryProvider);
    
    await repo.delete((e) => e.id == id);
    
    ref.read(activityEngineProvider.notifier).logAction('Watchlist Target Deleted', 'ID: $id', 'watchlist');
    ref.read(syncEngineProvider.notifier).enqueueMutation('watchlist_delete', '/watchlist', 'DELETE', {'id': id});

    state = AsyncValue.data(_computeState(repo.getAll(), currentState.query, currentState.sortOption, currentState.selectedIds, currentState.activeOnly));
  }

  void search(String q) async {
    final currentState = await future;
    state = AsyncValue.data(_computeState(currentState.allItems, q, currentState.sortOption, currentState.selectedIds, currentState.activeOnly));
  }
}

final watchlistEngineProvider = AsyncNotifierProvider<WatchlistEngine, WatchlistEngineState>(WatchlistEngine.new);