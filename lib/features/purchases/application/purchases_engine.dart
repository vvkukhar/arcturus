import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/core/enums/purchase_payment_method.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
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
    final repo = ref.read(purchasesRepositoryProvider);

    if (await network.isOnline()) {
      try {
        final res = await network.request('GET', '/procurement');
        if (res is List) {
          final mapped = res.map((e) => PurchaseModel(
            id: e['id'] ?? AppUtils.generateId(),
            itemId: e['itemId'] ?? '',
            source: e['sourceCode'] ?? 'Unknown',
            purchasePrice: (e['totalCost'] ?? 0).toDouble(),
            shippingCost: 0,
            additionalCosts: 0,
            finalTotal: (e['totalCost'] ?? 0).toDouble(),
            exchangeRate: 1,
            currency: 'UAH',
            paymentMethod: PurchasePaymentMethod.card,
            purchaseDate: e['createdAt'] != null ? DateTime.parse(e['createdAt']) : DateTime.now(),
            quantity: e['quantity'] ?? 1,
            soldQuantity: 0,
          )).toList();
          await repo.replaceAll(mapped);
        }
      } catch(e) { print("Init fetch error (Purchases): $e"); }
    }
    
    final sub = network.socketEvents.listen((event) {
      if (['purchase_order.updated', 'purchase_order.created'].contains(event['type'])) ref.invalidateSelf();
    });
    ref.onDispose(() => sub.cancel());

    final list = repo.getAllPurchases();
    return _computeState(list, '', 'newest', const {});
  }

  static PurchasesEngineState _computeState(List<PurchaseModel> all, String q, String sort, Set<String> selected) {
    double spend = 0, maxSpend = 0; String topC = '-';
    final sourceCounts = <String, int>{}, currencySpend = <String, double>{};
    final qLower = q.trim().toLowerCase();
    var visible = <PurchaseModel>[];

    for (final p in all) {
      spend += p.finalTotal;
      sourceCounts[p.source] = (sourceCounts[p.source] ?? 0) + 1;
      currencySpend[p.currency] = (currencySpend[p.currency] ?? 0) + p.finalTotal;
      if (qLower.isEmpty || p.source.toLowerCase().contains(qLower) || p.itemId.toLowerCase().contains(qLower) || (p.note ?? '').toLowerCase().contains(qLower)) visible.add(p);
    }
    currencySpend.forEach((k, v) { if (v > maxSpend) { maxSpend = v; topC = k; } });

    switch (sort) {
      case 'newest': visible.sort((a, b) => b.purchaseDate.compareTo(a.purchaseDate)); break;
      case 'totalHigh': visible.sort((a, b) => b.finalTotal.compareTo(a.finalTotal)); break;
    }
    return PurchasesEngineState(allPurchases: all, visiblePurchases: visible, selectedIds: selected, query: q, sortOption: sort, analysis: PurchasesAnalysis(all.length, spend, all.isEmpty ? 0 : spend / all.length, topC, sourceCounts, currencySpend));
  }

  Future<void> _updateState(String q, String sort, Set<String> selected) async {
    final currentState = await future;
    state = AsyncValue.data(_computeState(currentState.allPurchases, q, sort, selected));
  }

  void search(String q) async {
    final currentState = await future;
    _updateState(q, currentState.sortOption, currentState.selectedIds);
  }

  Future<void> savePurchase(PurchaseModel purchase) async {
    final currentState = await future;
    final network = ref.read(networkCoreProvider);
    final exists = currentState.allPurchases.any((e) => e.id == purchase.id);
    
    try {
      // ІДЕАЛЬНИЙ ПЕЙЛОАД ДЛЯ PRISMA PurchaseOrder (Без currency)
      final payload = {
        'titleSnapshot': purchase.source, 
        'sourceCode': purchase.source,
        'totalCost': purchase.finalTotal,
        'quantity': purchase.quantity,
        'status': 'planned',
        'notes': purchase.note,
      };

      if (purchase.itemId.isNotEmpty) {
        payload['itemId'] = purchase.itemId;
      } else {
        final itemRes = await network.request('POST', '/items', body: {
          'title': purchase.source,
          'kind': 'set',
        });
        payload['itemId'] = itemRes['id'];
      }

      final res = await network.request(exists ? 'PATCH' : 'POST', '/procurement', body: exists ? {'id': purchase.id, ...payload} : payload);

      final newPurchase = exists ? purchase : purchase.copyWith(id: res['id']);
      final repo = ref.read(purchasesRepositoryProvider);
      if (exists) await repo.update((e) => e.id == purchase.id, newPurchase);
      else await repo.add(newPurchase);
      
      state = AsyncValue.data(_computeState(repo.getAllPurchases(), currentState.query, currentState.sortOption, currentState.selectedIds));
    } catch (e) {
      print('CRITICAL SYNC ERROR (Purchases): $e');
      throw Exception(e);
    }
  }

  Future<void> deleteSelected() async {
    final currentState = await future;
    if (currentState.selectedIds.isEmpty) return;
    final repo = ref.read(purchasesRepositoryProvider);
    
    for (final id in currentState.selectedIds) {
      await repo.delete((e) => e.id == id);
      ref.read(syncEngineProvider.notifier).enqueueMutation('purchase_delete', '/procurement/status', 'PATCH', {'id': id, 'status': 'cancelled'});
    }
    state = AsyncValue.data(_computeState(repo.getAllPurchases(), currentState.query, currentState.sortOption, const {}));
  }
}

final purchasesEngineProvider = AsyncNotifierProvider<PurchasesEngine, PurchasesEngineState>(PurchasesEngine.new);