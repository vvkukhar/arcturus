import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class SalesAnalysis {
  final int totalCount;
  final double totalNet, totalFees, averageNet;
  const SalesAnalysis(this.totalCount, this.totalNet, this.totalFees, this.averageNet);
}

class SalesEngineState {
  final List<SaleModel> allSales, visibleSales;
  final Set<String> selectedIds;
  final String query, sortOption;
  final SalesAnalysis analysis;

  const SalesEngineState({required this.allSales, required this.visibleSales, required this.selectedIds, required this.query, required this.sortOption, required this.analysis});
}

class SalesEngine extends AsyncNotifier<SalesEngineState> {
  @override
  Future<SalesEngineState> build() async {
    final network = ref.watch(networkCoreProvider);
    
    final sub = network.socketEvents.listen((event) {
      if (['sale_registered'].contains(event['type'])) {
        ref.invalidateSelf();
      }
    });
    ref.onDispose(() => sub.cancel());

    final list = ref.watch(salesRepositoryProvider).getAllSales();
    return _computeState(list, '', 'newest', const {});
  }

  static SalesEngineState _computeState(List<SaleModel> all, String q, String sort, Set<String> selected) {
    double net = 0, fees = 0;
    final qLower = q.trim().toLowerCase();
    var visible = <SaleModel>[];

    for (final s in all) {
      net += s.finalNet;
      fees += s.platformFee;

      if (qLower.isEmpty || s.platform.toLowerCase().contains(qLower) || s.itemId.toLowerCase().contains(qLower) || (s.buyerName ?? '').toLowerCase().contains(qLower)) {
        visible.add(s);
      }
    }

    switch (sort) {
      case 'newest': visible.sort((a, b) => b.saleDate.compareTo(a.saleDate)); break;
      case 'oldest': visible.sort((a, b) => a.saleDate.compareTo(b.saleDate)); break;
      case 'netHigh': visible.sort((a, b) => b.finalNet.compareTo(a.finalNet)); break;
      case 'netLow': visible.sort((a, b) => a.finalNet.compareTo(b.finalNet)); break;
    }

    return SalesEngineState(allSales: all, visibleSales: visible, selectedIds: selected, query: q, sortOption: sort, analysis: SalesAnalysis(all.length, net, fees, all.isEmpty ? 0 : net / all.length));
  }

  void _updateState(String q, String sort, Set<String> selected) {
    if (state.value == null) return;
    state = AsyncValue.data(_computeState(state.value!.allSales, q, sort, selected));
  }

  void search(String q) => _updateState(q, state.value!.sortOption, state.value!.selectedIds);
  void setSort(String sort) => _updateState(state.value!.query, sort, state.value!.selectedIds);
  
  void toggleSelection(String id) {
    final next = Set<String>.from(state.value!.selectedIds);
    if (!next.remove(id)) next.add(id);
    _updateState(state.value!.query, state.value!.sortOption, next);
  }
  
  void clearSelection() => _updateState(state.value!.query, state.value!.sortOption, const {});

  Future<void> saveSale(SaleModel sale) async {
    final repo = ref.read(salesRepositoryProvider);
    final exists = state.value!.allSales.any((e) => e.id == sale.id);
    
    if (exists) {
      await repo.update((e) => e.id == sale.id, sale);
    } else {
      await repo.add(sale);
      ref.read(syncEngineProvider.notifier).enqueueMutation('sale', '/sales', 'POST', {
        'inventoryItemId': sale.itemId,
        'sellPrice': sale.salePrice,
        'quantity': sale.quantity,
        'channel': sale.platform,
        'buyerName': sale.buyerName,
      });
    }
    
    state = AsyncValue.data(_computeState(repo.getAllSales(), state.value!.query, state.value!.sortOption, state.value!.selectedIds));
  }

  Future<void> deleteSelected() async {
    if (state.value!.selectedIds.isEmpty) return;
    final repo = ref.read(salesRepositoryProvider);
    
    for (final id in state.value!.selectedIds) {
      await repo.delete((e) => e.id == id);
      ref.read(syncEngineProvider.notifier).enqueueMutation('sale_delete', '/sales', 'DELETE', {'id': id});
    }
    
    state = AsyncValue.data(_computeState(repo.getAllSales(), state.value!.query, state.value!.sortOption, const {}));
  }
}

final salesEngineProvider = AsyncNotifierProvider<SalesEngine, SalesEngineState>(SalesEngine.new);