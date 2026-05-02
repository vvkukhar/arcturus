import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_action_center_provider.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_action_center_provider.dart';

class DashboardActionCenterModel {
  final String headline;
  final String subline;

  const DashboardActionCenterModel({
    required this.headline,
    required this.subline,
  });
}

final dashboardActionCenterProvider =
    Provider<DashboardActionCenterModel>((ref) {
  final inventory = ref.watch(inventoryActionCenterProvider);
  final watchlist = ref.watch(watchlistActionCenterProvider);
  final headline = watchlist.readyToBuy > 0
      ? 'There are items ready to buy'
      : inventory.reprice > 0
          ? 'Repricing opportunities found'
          : inventory.review > 0
              ? 'Manual review needed'
              : 'System is calm';
  final subline =
      'Buy ${watchlist.readyToBuy} • Sell ${inventory.sell} • Reprice ${inventory.reprice} • Review ${inventory.review}';
  return DashboardActionCenterModel(
    headline: headline,
    subline: subline,
  );
});
