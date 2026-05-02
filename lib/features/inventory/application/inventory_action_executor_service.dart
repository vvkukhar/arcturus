import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_controller.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';

class InventoryActionExecutorService {
  final Ref ref;

  InventoryActionExecutorService(this.ref);

  void applyLocalAction(String actionKey) {
    final controller = ref.read(inventoryControllerProvider.notifier);
    switch (actionKey) {
      case 'profit_first':
        controller.setSort(InventorySortOption.expectedProfitHighToLow);
        break;
      case 'oldest_first':
      case 'dead_stock':
        controller.setSort(InventorySortOption.daysInInventoryHighToLow);
        break;
    }
  }

  String? routeFor(String actionKey) {
    switch (actionKey) {
      case 'opportunities':
        return AppRouter.opportunityCenter;
      case 'dead_stock':
        return AppRouter.deadStockCenter;
      default:
        return null;
    }
  }
}
