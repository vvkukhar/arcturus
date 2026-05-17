import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';
import 'package:lego_trading_manager/data/models/app_models.dart';
import 'package:url_launcher/url_launcher.dart';

class PosCartItem {
  final InventoryItemModel item;
  final int quantity;
  
  PosCartItem({required this.item, required this.quantity});
  
  PosCartItem copyWith({int? quantity}) {
    return PosCartItem(item: item, quantity: quantity ?? this.quantity);
  }
}

class PosCart extends Notifier<List<PosCartItem>> {
  @override
  List<PosCartItem> build() => [];

  void addItem(InventoryItemModel item) {
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
    
    final network = ref.read(networkCoreProvider);

    final payload = {
      'paymentMethod': paymentMethod,
      'items': state.map((c) => {
        'inventoryItemId': c.item.id,
        'quantity': c.quantity,
        'price': c.item.expectedSalePriceManual ?? c.item.totalCost,
      }).toList(),
    };

    try {
      final response = await network.request('POST', '/pos/checkout', body: payload);
      
      if (paymentMethod == 'card' && response is Map && response['url'] != null) {
        final url = Uri.parse(response['url']);
        if (await canLaunchUrl(url)) {
          await launchUrl(url, mode: LaunchMode.externalApplication);
        }
      }
      state = [];
    } catch (e) {
      throw Exception('Checkout failed: $e');
    }
  }
}

final posCartProvider = NotifierProvider<PosCart, List<PosCartItem>>(PosCart.new);