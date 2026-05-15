import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
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
    final repo = ref.read(salesRepositoryProvider);

    if (await network.isOnline()) {
      try {
        final res = await network.request('GET', '/sales');
        if (res is List) {
          final mapped = res.map((e) => SaleModel(
            id: e['id'] ?? AppUtils.generateId(),
            itemId: e['inventoryItemId'] ?? e['itemId'] ?? '',
            platform: e['channel'] ?? 'Unknown',
            salePrice: (e['sellPrice'] ?? 0).toDouble(),
            platformFee: 0.0,
            shippingPaidByMe: 0.0,
            shippingPaidByBuyer: 0,
            finalNet: (e['profit'] ?? 0).toDouble(),
            currency: 'UAH',
            saleDate: e['createdAt'] != null ? DateTime.parse(e['createdAt']) : DateTime.now(),
            quantity: e['quantity'] ?? 1,
          )).toList();
          await repo.replaceAll(mapped);
        }
      } catch(e) { print("Init fetch error (Sales): $e"); }
    }
    
    final sub = network.socketEvents.listen((event) {
      if (['sale_registered'].contains(event['type'])) ref.invalidateSelf();
    });
    ref.onDispose(() => sub.cancel());

    final list = repo.getAllSales();
    return _computeState(list, '', 'newest', const {});
  }

  static SalesEngineState _computeState(List<SaleModel> all, String q, String sort, Set<String> selected) {
    double net = 0, fees = 0;
    final qLower = q.trim().toLowerCase();
    var visible = <SaleModel>[];

    for (final s in all) {
      net += s.finalNet; fees += s.platformFee;
      if (qLower.isEmpty || s.platform.toLowerCase().contains(qLower) || s.itemId.toLowerCase().contains(qLower) || (s.buyerName ?? '').toLowerCase().contains(qLower)) visible.add(s);
    }
    switch (sort) {
      case 'newest': visible.sort((a, b) => b.saleDate.compareTo(a.saleDate)); break;
      case 'netHigh': visible.sort((a, b) => b.finalNet.compareTo(a.finalNet)); break;
    }
    return SalesEngineState(allSales: all, visibleSales: visible, selectedIds: selected, query: q, sortOption: sort, analysis: SalesAnalysis(all.length, net, fees, all.isEmpty ? 0 : net / all.length));
  }

  Future<void> saveSale(SaleModel sale) async {
    final currentState = await future;
    final network = ref.read(networkCoreProvider);
    final exists = currentState.allSales.any((e) => e.id == sale.id);
    
    try {
      // ІДЕАЛЬНИЙ ПЕЙЛОАД ДЛЯ PRISMA Sale
      final payload = {
        'sellPrice': sale.salePrice,
        'quantity': sale.quantity,
        'channel': sale.platform,
        'buyerName': sale.buyerName ?? 'Buyer',
        'costBasis': 0, // Mock
        'profit': sale.finalNet,
        'roiPercent': 0,
        'notes': sale.note,
      };

      if (sale.itemId.isNotEmpty) {
        payload['inventoryItemId'] = sale.itemId;
        payload['itemId'] = sale.itemId; 
      } else {
        final itemRes = await network.request('POST', '/items', body: {'title': 'Sale Item', 'kind': 'set'});
        payload['itemId'] = itemRes['id'];
        payload['inventoryItemId'] = itemRes['id'];
      }

      final res = await network.request(exists ? 'PATCH' : 'POST', '/sales', body: exists ? {'id': sale.id, ...payload} : payload);

      final newSale = exists ? sale : sale.copyWith(id: res['id']);
      final repo = ref.read(salesRepositoryProvider);
      if (exists) await repo.update((e) => e.id == sale.id, newSale);
      else await repo.add(newSale);
      
      state = AsyncValue.data(_computeState(repo.getAllSales(), currentState.query, currentState.sortOption, currentState.selectedIds));
    } catch (e) {
      print('CRITICAL SYNC ERROR (Sales): $e');
      throw Exception(e);
    }
  }

  void search(String q) async {
    final currentState = await future;
    state = AsyncValue.data(_computeState(currentState.allSales, q, currentState.sortOption, currentState.selectedIds));
  }
}

final salesEngineProvider = AsyncNotifierProvider<SalesEngine, SalesEngineState>(SalesEngine.new);