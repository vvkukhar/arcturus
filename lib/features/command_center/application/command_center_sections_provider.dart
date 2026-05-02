// lib/features/command_center/application/command_center_sections_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_action_model.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_section_model.dart';

final commandCenterSectionsProvider =
    Provider<List<CommandCenterSectionModel>>((ref) {
  return const [
    CommandCenterSectionModel(
      title: 'Core',
      actions: [
        CommandCenterActionModel(
          id: 'inventory',
          title: 'Inventory',
          subtitle: 'Items, filters, bulk actions',
          route: AppRouter.inventory,
        ),
        CommandCenterActionModel(
          id: 'watchlist',
          title: 'Watchlist',
          subtitle: 'Targets and opportunities',
          route: AppRouter.watchlist,
        ),
        CommandCenterActionModel(
          id: 'market',
          title: 'Market',
          subtitle: 'Snapshots and trends',
          route: AppRouter.market,
        ),
      ],
    ),
    CommandCenterSectionModel(
      title: 'Trading',
      actions: [
        CommandCenterActionModel(
          id: 'purchases',
          title: 'Purchases',
          subtitle: 'Buy records and source costs',
          route: AppRouter.purchases,
        ),
        CommandCenterActionModel(
          id: 'sales',
          title: 'Sales',
          subtitle: 'Sales, fees and net',
          route: AppRouter.sales,
        ),
        CommandCenterActionModel(
          id: 'deal_eval',
          title: 'Deal Evaluator',
          subtitle: 'Check new deals quickly',
          route: AppRouter.dealEvaluator,
        ),
      ],
    ),
    CommandCenterSectionModel(
      title: 'Quick Create',
      actions: [
        CommandCenterActionModel(
          id: 'create_item',
          title: 'Create Item',
          subtitle: 'Open add item form',
          route: AppRouter.addItem,
        ),
        CommandCenterActionModel(
          id: 'create_purchase',
          title: 'Create Purchase',
          subtitle: 'Open add purchase form',
          route: AppRouter.addPurchase,
        ),
        CommandCenterActionModel(
          id: 'create_sale',
          title: 'Create Sale',
          subtitle: 'Open add sale form',
          route: AppRouter.addSale,
        ),
      ],
    ),
    CommandCenterSectionModel(
      title: 'System',
      actions: [
        CommandCenterActionModel(
          id: 'settings',
          title: 'Settings',
          subtitle: 'System controls and tools',
          route: AppRouter.settings,
        ),
        CommandCenterActionModel(
          id: 'activity',
          title: 'Activity Log',
          subtitle: 'Recent events and saved actions',
          route: AppRouter.activityLog,
        ),
        CommandCenterActionModel(
          id: 'global_search',
          title: 'Global Search',
          subtitle: 'Find across the whole local system',
          route: AppRouter.globalSearch,
        ),
      ],
    ),
  ];
});
