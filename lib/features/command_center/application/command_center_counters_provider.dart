import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/market_repository.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/activity/application/latest_activity_provider.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_counter_model.dart';

final commandCenterCountersProvider =
    Provider<List<CommandCenterCounterModel>>((ref) {
  final latestActivity = ref.watch(latestActivityProvider).maybeWhen(
        data: (items) => items.length,
        orElse: () => 0,
      );

  return [
    CommandCenterCounterModel(
      route: AppRouter.inventory,
      count: InventoryRepository().getAllItems().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.watchlist,
      count: WatchlistRepository().getAll().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.market,
      count: MarketRepository().getAll().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.purchases,
      count: PurchasesRepository().getAllPurchases().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.sales,
      count: SalesRepository().getAllSales().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.activityLog,
      count: latestActivity,
    ),
    CommandCenterCounterModel(
      route: AppRouter.activityTimeline,
      count: latestActivity,
    ),
  ];
});
