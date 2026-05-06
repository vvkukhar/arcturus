import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_action_model.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_section_model.dart';

final commandCenterSectionsProvider =
    Provider<List<CommandCenterSectionModel>>((ref) {
  return const [
    CommandCenterSectionModel(
      title: 'cc.core',
      actions: [
        CommandCenterActionModel(
          id: 'inventory',
          title: 'cc.inv',
          subtitle: 'cc.inv.sub',
          route: AppRouter.inventory,
        ),
        CommandCenterActionModel(
          id: 'watchlist',
          title: 'cc.watch',
          subtitle: 'cc.watch.sub',
          route: AppRouter.watchlist,
        ),
        CommandCenterActionModel(
          id: 'market',
          title: 'cc.market',
          subtitle: 'cc.market.sub',
          route: AppRouter.market,
        ),
      ],
    ),
    CommandCenterSectionModel(
      title: 'cc.trading',
      actions: [
        CommandCenterActionModel(
          id: 'purchases',
          title: 'cc.purchases',
          subtitle: 'cc.purchases.sub',
          route: AppRouter.purchases,
        ),
        CommandCenterActionModel(
          id: 'sales',
          title: 'cc.sales',
          subtitle: 'cc.sales.sub',
          route: AppRouter.sales,
        ),
        CommandCenterActionModel(
          id: 'deal_eval',
          title: 'cc.dealEval',
          subtitle: 'cc.dealEval.sub',
          route: AppRouter.dealEvaluator,
        ),
      ],
    ),
    CommandCenterSectionModel(
      title: 'cc.quickAdd',
      actions: [
        CommandCenterActionModel(
          id: 'create_item',
          title: 'cc.addItem',
          subtitle: 'cc.addItem.sub',
          route: AppRouter.addItem,
        ),
        CommandCenterActionModel(
          id: 'create_purchase',
          title: 'cc.addPurchase',
          subtitle: 'cc.addPurchase.sub',
          route: AppRouter.addPurchase,
        ),
        CommandCenterActionModel(
          id: 'create_sale',
          title: 'cc.addSale',
          subtitle: 'cc.addSale.sub',
          route: AppRouter.addSale,
        ),
      ],
    ),
    CommandCenterSectionModel(
      title: 'cc.system',
      actions: [
        CommandCenterActionModel(
          id: 'settings',
          title: 'cc.settings',
          subtitle: 'cc.settings.sub',
          route: AppRouter.settings,
        ),
        CommandCenterActionModel(
          id: 'activity',
          title: 'cc.activity',
          subtitle: 'cc.activity.sub',
          route: AppRouter.activityLog,
        ),
        CommandCenterActionModel(
          id: 'global_search',
          title: 'cc.searchGlob',
          subtitle: 'cc.searchGlob.sub',
          route: AppRouter.globalSearch,
        ),
      ],
    ),
  ];
});