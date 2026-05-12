import 'dart:async';
import 'dart:isolate';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

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
    
    final sub = network.socketEvents.listen((event) {
      if (['watchlist_updated'].contains(event['type'])) {
        ref.invalidateSelf();
      }
    });
    ref.onDispose(() => sub.cancel());

    final list = ref.watch(watchlistRepositoryProvider).getAll();
    return await Isolate.run(() => _computeState(list, '', 'newest', const {}, false));
  }

  static WatchlistEngineState _computeState(List<WatchlistItemModel> all, String q, String sort, Set<String> selected, bool activeOnly) {
    int active = 0, hits = 0, acceptable = 0, high = 0;
    double spread = 0;
    final qLower = q.trim().toLowerCase();
    var visible = <WatchlistItemModel>[];

    for (final w in all) {
      if (w.isActive) active++;
      
      if (w.marketPrice != null) {
        if (w.marketPrice! <= w.desiredBuyPrice) {
          hits++;
        } else if (w.marketPrice! <= w.maxBuyPrice) {
          acceptable++;
        } else {
          high++;
        }
        
        if (w.isActive && w.marketPrice! <= w.maxBuyPrice) {
          spread += (w.maxBuyPrice - w.marketPrice!);
        }
      }

      bool matches = !activeOnly || w.isActive;
      if (matches && qLower.isNotEmpty) {
        matches = w.title.toLowerCase().contains(qLower) || (w.theme ?? '').toLowerCase().contains(qLower) || (w.refId ?? '').toLowerCase().contains(qLower);
      }
      
      if (matches) visible.add(w);
    }

    switch (sort) {
      case 'newest': visible.sort((a, b) => b.createdAt.compareTo(a.createdAt)); break;
      case 'oldest': visible.sort((a, b) => a.createdAt.compareTo(b.createdAt)); break;
      case 'spread': visible.sort((a, b) => ((b.maxBuyPrice - (b.marketPrice ?? b.maxBuyPrice)).compareTo(a.maxBuyPrice - (a.marketPrice ?? a.maxBuyPrice)))); break;
    }

    return WatchlistEngineState(allItems: all, visibleItems: visible, selectedIds: selected, query: q, sortOption: sort, activeOnly: activeOnly, analysis: WatchlistAnalysis(active, hits, acceptable, high, spread));
  }

  Future<void> _updateState(String q, String sort, Set<String> selected, bool activeOnly) async {
    if (state.value == null) return;
    state = AsyncValue.data(await Isolate.run(() => _computeState(state.value!.allItems, q, sort, selected, activeOnly)));
  }

  void search(String q) => _updateState(q, state.value!.sortOption, state.value!.selectedIds, state.value!.activeOnly);
  void setSort(String sort) => _updateState(state.value!.query, sort, state.value!.selectedIds, state.value!.activeOnly);
  void toggleActiveFilter() => _updateState(state.value!.query, state.value!.sortOption, state.value!.selectedIds, !state.value!.activeOnly);
  
  void toggleSelection(String id) {
    final next = Set<String>.from(state.value!.selectedIds);
    if (!next.remove(id)) next.add(id);
    _updateState(state.value!.query, state.value!.sortOption, next, state.value!.activeOnly);
  }
  
  void clearSelection() => _updateState(state.value!.query, state.value!.sortOption, const {}, state.value!.activeOnly);

  Future<void> saveItem(WatchlistItemModel item) async {
    final repo = ref.read(watchlistRepositoryProvider);
    final exists = state.value!.allItems.any((e) => e.id == item.id);
    
    if (exists) {
      await repo.update((e) => e.id == item.id, item);
    } else {
      await repo.add(item);
    }
    
    ref.read(syncEngineProvider.notifier).enqueueMutation('watchlist', '/watchlist', exists ? 'PATCH' : 'POST', item.toMap());
    state = AsyncValue.data(await Isolate.run(() => _computeState(repo.getAll(), state.value!.query, state.value!.sortOption, state.value!.selectedIds, state.value!.activeOnly)));
  }

  Future<void> deleteSelected() async {
    if (state.value!.selectedIds.isEmpty) return;
    final repo = ref.read(watchlistRepositoryProvider);
    
    for (final id in state.value!.selectedIds) {
      await repo.delete((e) => e.id == id);
    }
    
    ref.read(syncEngineProvider.notifier).enqueueMutation('watchlist_bulk', '/watchlist/bulk-delete', 'DELETE', {'ids': state.value!.selectedIds.toList()});
    state = AsyncValue.data(await Isolate.run(() => _computeState(repo.getAll(), state.value!.query, state.value!.sortOption, const {}, state.value!.activeOnly)));
  }
}

final watchlistEngineProvider = AsyncNotifierProvider<WatchlistEngine, WatchlistEngineState>(WatchlistEngine.new);