import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class PurchasesEngineState {
  final List<PurchaseModel> purchases;
  final String query;

  const PurchasesEngineState({
    required this.purchases,
    required this.query,
  });

  PurchasesEngineState copyWith({List<PurchaseModel>? purchases, String? query}) {
    return PurchasesEngineState(
      purchases: purchases ?? this.purchases,
      query: query ?? this.query,
    );
  }
}

class PurchasesEngine extends AsyncNotifier<PurchasesEngineState> {
  @override
  Future<PurchasesEngineState> build() async {
    final eventBus = ref.watch(socketEventBusProvider);
    final sub = eventBus.events.listen((event) {
      final type = event['type'];
      final payloads = event['payloads'] as List?;

      if (['purchase_order.created', 'purchase_order.updated', 'purchase_order.received'].contains(type) && payloads != null) {
        final currentState = state.valueOrNull;
        if (currentState != null) {
          final itemsList = List<PurchaseModel>.from(currentState.purchases);
          
          for (final payload in payloads) {
            if (payload == null || payload['id'] == null) continue;

            final updatedItem = PurchaseModel.fromJson(Map<String, dynamic>.from(payload));
            final index = itemsList.indexWhere((i) => i.id == updatedItem.id);

            if (index != -1) {
               itemsList[index] = updatedItem;
            } else {
               itemsList.insert(0, updatedItem);
            }
          }
          
          state = AsyncValue.data(currentState.copyWith(purchases: itemsList));
        }
      }
    });
    ref.onDispose(() => sub.cancel());

    return _fetchData('');
  }

  Future<PurchasesEngineState> _fetchData(String query) async {
    final repo = ref.read(purchasesRepositoryProvider);
    final qParams = <String, dynamic>{'limit': 100};
    
    if (query.isNotEmpty) qParams['q'] = query;
    
    final purchases = await repo.fetchAll(query: qParams);
    return PurchasesEngineState(purchases: purchases, query: query);
  }

  void search(String query) async {
    state = const AsyncValue.loading();
    state = AsyncValue.data(await _fetchData(query));
  }

  Future<void> savePurchase(Map<String, dynamic> payload, {String? id}) async {
    final repo = ref.read(purchasesRepositoryProvider);
    if (id != null && id.isNotEmpty) {
      await repo.update(id, payload);
    } else {
      await repo.create(payload);
    }
  }

  Future<void> deletePurchase(String id) async {
    await ref.read(purchasesRepositoryProvider).delete(id);
    ref.invalidateSelf();
  }
}

final purchasesEngineProvider = AsyncNotifierProvider<PurchasesEngine, PurchasesEngineState>(PurchasesEngine.new);