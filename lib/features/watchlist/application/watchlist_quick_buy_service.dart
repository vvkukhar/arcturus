import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/models/watchlist_item_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/purchases/application/purchases_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_controller.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_purchase_create_provider.dart';

class WatchlistQuickBuyService {
  final Ref ref;

  const WatchlistQuickBuyService(this.ref);

  Future<void> run(WatchlistItemModel item) async {
    final result = ref.read(watchlistPurchaseCreateProvider).build(item);

    ref.read(inventoryControllerProvider.notifier).addItem(result.item);
    ref.read(purchasesControllerProvider.notifier).addPurchase(result.purchase);

    ref.read(watchlistControllerProvider.notifier).updateItem(
          item.copyWith(isActive: false),
        );
  }
}