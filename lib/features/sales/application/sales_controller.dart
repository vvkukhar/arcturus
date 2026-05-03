import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/data/sales_local_storage_provider.dart';

class SalesController extends Notifier<List<SaleModel>> {
  @override
  List<SaleModel> build() {
    return const [];
  }

  Future<void> load() async {
    final storage = ref.read(salesLocalStorageProvider);
    state = await storage.read();
  }

  Future<void> _save() async {
    final storage = ref.read(salesLocalStorageProvider);
    await storage.write(state);
  }

  Future<void> addSale(SaleModel sale) async {
    state = [...state, sale];
    await _save();
  }

  Future<void> updateSale(SaleModel updated) async {
    state = [
      for (final sale in state)
        if (sale.id == updated.id) updated else sale,
    ];
    await _save();
  }

  Future<void> deleteSale(String id) async {
    state = state.where((sale) => sale.id != id).toList();
    await _save();
  }

  Future<void> replaceAll(List<SaleModel> sales) async {
    state = sales;
    await _save();
  }

  Future<void> clear() async {
    state = const [];
    await _save();
  }
}

final salesControllerProvider =
    NotifierProvider<SalesController, List<SaleModel>>(
  SalesController.new,
);