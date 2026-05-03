import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_alert_filter_provider.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_sort_option.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_ui_controller.dart';

class InventoryAlertQuickOpenService {
  final Ref ref;

  InventoryAlertQuickOpenService(this.ref);

  void openRepricing() {
    ref.read(inventoryAlertFilterProvider.notifier).set(InventoryAlertFilter.repricing);
    ref.read(inventoryUiControllerProvider.notifier).setSort(InventorySortOption.expectedProfitHighToLow);
  }

  void openHeldTooLong() {
    ref.read(inventoryAlertFilterProvider.notifier).set(InventoryAlertFilter.heldTooLong);
    ref.read(inventoryUiControllerProvider.notifier).setSort(InventorySortOption.daysInInventoryHighToLow);
  }

  void openLowProfit() {
    ref.read(inventoryAlertFilterProvider.notifier).set(InventoryAlertFilter.lowProfit);
    ref.read(inventoryUiControllerProvider.notifier).setSort(InventorySortOption.costLowToHigh);
  }
}

final inventoryAlertQuickOpenProvider = Provider<InventoryAlertQuickOpenService>((ref) {
  return InventoryAlertQuickOpenService(ref);
});