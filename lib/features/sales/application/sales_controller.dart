import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/sale_model.dart';
import 'package:lego_trading_manager/features/sales/data/sales_local_storage_provider.dart';

class SalesController extends StateNotifier<List<SaleModel>> {
  final Ref ref;

  SalesController(this.ref) : super(const []);

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
    state = state.map((sale) {
      if (sale.id == updated.id) return updated;
      return sale;
    }).toList();

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
    StateNotifierProvider<SalesController, List<SaleModel>>((ref) {
  return SalesController(ref);
});