import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/core/utils/core_utils.dart';
import 'package:lego_trading_manager/features/sales/application/sales_engine.dart';

class PosCartItem {
  final ItemModel item;
  final int quantity;
  
  PosCartItem({required this.item, required this.quantity});
  
  PosCartItem copyWith({int? quantity}) {
    return PosCartItem(item: item, quantity: quantity ?? this.quantity);
  }
}

class PosCart extends Notifier<List<PosCartItem>> {
  @override
  List<PosCartItem> build() => [];

  void addItem(ItemModel item) {
    if (!item.isActive || item.quantity <= 0) return;
    
    final existingIdx = state.indexWhere((i) => i.item.id == item.id);
    if (existingIdx >= 0) {
      final current = state[existingIdx];
      if (current.quantity < item.quantity) {
        final next = List<PosCartItem>.from(state);
        next[existingIdx] = current.copyWith(quantity: current.quantity + 1);
        state = next;
      }
    } else {
      state = [...state, PosCartItem(item: item, quantity: 1)];
    }
  }

  void updateQuantity(String itemId, int qty) {
    if (qty <= 0) {
      state = state.where((i) => i.item.id != itemId).toList();
      return;
    }
    state = state.map((i) {
      if (i.item.id == itemId) {
        return i.copyWith(quantity: qty > i.item.quantity ? i.item.quantity : qty);
      }
      return i;
    }).toList();
  }

  void removeItem(String itemId) {
    state = state.where((i) => i.item.id != itemId).toList();
  }

  Future<void> checkout(String paymentMethod) async {
    if (state.isEmpty) return;
    
    final salesEngine = ref.read(salesEngineProvider.notifier);
    final invRepo = ref.read(inventoryRepositoryProvider);

    for (final cartItem in state) {
      final item = cartItem.item;
      final salePrice = item.expectedSalePrice ?? item.totalCost;
      final unitCost = item.totalCost / (item.quantity > 0 ? item.quantity : 1);
      
      final sale = SaleModel(
        id: AppUtils.generateId(),
        itemId: item.id,
        platform: 'POS ($paymentMethod)',
        salePrice: salePrice * cartItem.quantity,
        platformFee: 0,
        shippingPaidByMe: 0,
        shippingPaidByBuyer: 0,
        finalNet: (salePrice * cartItem.quantity) - (unitCost * cartItem.quantity),
        currency: 'UAH',
        saleDate: DateTime.now(),
        quantity: cartItem.quantity,
      );

      await salesEngine.saveSale(sale);
      
      final updatedQty = item.quantity - cartItem.quantity;
      final updatedItem = item.copyWith(
        status: updatedQty <= 0 ? ItemStatus.sold : item.status,
        quantity: updatedQty
      );
      
      await invRepo.updateItem(updatedItem);
    }
    state = [];
  }
}

final posCartProvider = NotifierProvider<PosCart, List<PosCartItem>>(PosCart.new);