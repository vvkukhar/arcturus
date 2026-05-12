import 'dart:async';
import 'dart:isolate';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/features/activity/application/activity_engine.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class PurchasesAnalysis {
  final int totalCount;
  final double totalSpend, averageSpend;
  final String topCurrency;
  final Map<String, int> sourceCounts;
  final Map<String, double> currencySpend;

  const PurchasesAnalysis(this.totalCount, this.totalSpend, this.averageSpend, this.topCurrency, this.sourceCounts, this.currencySpend);
}

class PurchasesEngineState {
  final List<PurchaseModel> allPurchases, visiblePurchases;
  final Set<String> selectedIds;
  final String query, sortOption;
  final PurchasesAnalysis analysis;

  const PurchasesEngineState({required this.allPurchases, required this.visiblePurchases, required this.selectedIds, required this.query, required this.sortOption, required this.analysis});
}

class PurchasesEngine extends AsyncNotifier<PurchasesEngineState> {
  @override
  Future<PurchasesEngineState> build() async {
    final network = ref.watch(networkCoreProvider);
    
    final sub = network.socketEvents.listen((event) {
      if (['purchase_order.updated', 'purchase_order.created'].contains(event['type'])) {
        ref.invalidateSelf();
      }
    });
    ref.onDispose(() => sub.cancel());

    final list = ref.watch(purchasesRepositoryProvider).getAllPurchases();
    return await Isolate.run(() => _computeState(list, '', 'newest', const {}));
  }

  static PurchasesEngineState _computeState(List<PurchaseModel> all, String q, String sort, Set<String> selected) {
    double spend = 0, maxSpend = 0;
    String topC = '-';
    final sourceCounts = <String, int>{}, currencySpend = <String, double>{};
    final qLower = q.trim().toLowerCase();
    var visible = <PurchaseModel>[];

    for (final p in all) {
      spend += p.finalTotal;
      sourceCounts[p.source] = (sourceCounts[p.source] ?? 0) + 1;
      currencySpend[p.currency] = (currencySpend[p.currency] ?? 0) + p.finalTotal;

      if (qLower.isEmpty || p.source.toLowerCase().contains(qLower) || p.itemId.toLowerCase().contains(qLower) || (p.note ?? '').toLowerCase().contains(qLower)) {
        visible.add(p);
      }
    }

    currencySpend.forEach((k, v) { 
      if (v > maxSpend) { 
        maxSpend = v; 
        topC = k; 
      }
    });

    switch (sort) {
      case 'newest': visible.sort((a, b) => b.purchaseDate.compareTo(a.purchaseDate)); break;
      case 'oldest': visible.sort((a, b) => a.purchaseDate.compareTo(b.purchaseDate)); break;
      case 'totalHigh': visible.sort((a, b) => b.finalTotal.compareTo(a.finalTotal)); break;
      case 'totalLow': visible.sort((a, b) => a.finalTotal.compareTo(b.finalTotal)); break;
    }

    return PurchasesEngineState(allPurchases: all, visiblePurchases: visible, selectedIds: selected, query: q, sortOption: sort, analysis: PurchasesAnalysis(all.length, spend, all.isEmpty ? 0 : spend / all.length, topC, sourceCounts, currencySpend));
  }

  Future<void> _updateState(String q, String sort, Set<String> selected) async {
    if (state.value == null) return;
    state = AsyncValue.data(await Isolate.run(() => _computeState(state.value!.allPurchases, q, sort, selected)));
  }

  void search(String q) => _updateState(q, state.value!.sortOption, state.value!.selectedIds);
  void setSort(String sort) => _updateState(state.value!.query, sort, state.value!.selectedIds);
  
  void toggleSelection(String id) {
    final next = Set<String>.from(state.value!.selectedIds);
    if (!next.remove(id)) next.add(id);
    _updateState(state.value!.query, state.value!.sortOption, next);
  }
  
  void clearSelection() => _updateState(state.value!.query, state.value!.sortOption, const {});

  Future<void> savePurchase(PurchaseModel purchase) async {
    final repo = ref.read(purchasesRepositoryProvider);
    final exists = state.value!.allPurchases.any((e) => e.id == purchase.id);
    
    if (exists) {
      await repo.update((e) => e.id == purchase.id, purchase);
    } else {
      await repo.add(purchase);
    }
    
    ref.read(syncEngineProvider.notifier).enqueueMutation('purchase', '/procurement', exists ? 'PATCH' : 'POST', purchase.toJson());
    state = AsyncValue.data(await Isolate.run(() => _computeState(repo.getAllPurchases(), state.value!.query, state.value!.sortOption, state.value!.selectedIds)));
  }

  Future<void> deleteSelected() async {
    if (state.value!.selectedIds.isEmpty) return;
    final repo = ref.read(purchasesRepositoryProvider);
    
    for (final id in state.value!.selectedIds) {
      await repo.delete((e) => e.id == id);
      ref.read(syncEngineProvider.notifier).enqueueMutation('purchase_delete', '/procurement/status', 'PATCH', {'id': id, 'status': 'cancelled'});
    }
    
    state = AsyncValue.data(await Isolate.run(() => _computeState(repo.getAllPurchases(), state.value!.query, state.value!.sortOption, const {})));
  }
}

final purchasesEngineProvider = AsyncNotifierProvider<PurchasesEngine, PurchasesEngineState>(PurchasesEngine.new);