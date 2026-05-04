import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
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
      count: ref.watch(inventoryRepositoryProvider).getAllItems().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.watchlist,
      count: ref.watch(watchlistRepositoryProvider).getAll().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.market,
      count: ref.watch(marketRepositoryProvider).getAll().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.purchases,
      count: ref.watch(purchasesRepositoryProvider).getAllPurchases().length,
    ),
    CommandCenterCounterModel(
      route: AppRouter.sales,
      count: ref.watch(salesRepositoryProvider).getAllSales().length,
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