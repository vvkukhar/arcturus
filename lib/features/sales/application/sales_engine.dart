import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/network/socket_event_bus.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:lego_trading_manager/data/repositories/app_repositories.dart';

class SalesEngineState {
  final List<SaleModel> sales;
  final String query;

  const SalesEngineState({
    required this.sales,
    required this.query,
  });

  SalesEngineState copyWith({List<SaleModel>? sales, String? query}) {
    return SalesEngineState(
      sales: sales ?? this.sales,
      query: query ?? this.query,
    );
  }
}

class SalesEngine extends AsyncNotifier<SalesEngineState> {
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

    return _fetchData('');
  }

  Future<SalesEngineState> _fetchData(String query) async {
    final repo = ref.read(salesRepositoryProvider);
    final qParams = <String, dynamic>{'limit': 100};
    
    if (query.isNotEmpty) qParams['q'] = query;
    
    final sales = await repo.fetchAll(query: qParams);
    return SalesEngineState(sales: sales, query: query);
  }

  void search(String query) async {
    state = const AsyncValue.loading();
    state = AsyncValue.data(await _fetchData(query));
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