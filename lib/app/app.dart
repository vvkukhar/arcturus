import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/activity/presentation/activity_log_screen.dart';
import 'package:lego_trading_manager/features/activity/presentation/activity_timeline_screen.dart';
import 'package:lego_trading_manager/features/analytics/presentation/analytics_screen.dart';
import 'package:lego_trading_manager/features/command_center/presentation/command_center_screen.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/dashboard_screen.dart';
import 'package:lego_trading_manager/features/deals/presentation/deal_evaluator_screen.dart';
import 'package:lego_trading_manager/features/deals/presentation/deal_history_screen.dart';
import 'package:lego_trading_manager/features/home/presentation/home_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/add_item_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/dead_stock_action_center_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/inventory_action_center_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/inventory_screen.dart';
import 'package:lego_trading_manager/features/market/presentation/market_notes_center_screen.dart';
import 'package:lego_trading_manager/features/market/presentation/market_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/add_purchase_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchases_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/add_sale_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sales_screen.dart';
import 'package:lego_trading_manager/features/search/presentation/global_search_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/backup_history_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/export_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/import_restore_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/manual_action_reports_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/settings_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/system_health_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/opportunity_center_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_screen.dart';

class LegoTradingApp extends ConsumerWidget {
  const LegoTradingApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'LEGO Trading Manager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(useMaterial3: true),
      initialRoute: AppRouter.home,
      routes: {
        AppRouter.home: (_) => const HomeScreen(),
        AppRouter.dashboard: (_) => const DashboardScreen(),
        AppRouter.inventory: (_) => const InventoryScreen(),
        AppRouter.addItem: (_) => const AddItemScreen(),
        AppRouter.watchlist: (_) => const WatchlistScreen(),
        AppRouter.market: (_) => const MarketScreen(),
        AppRouter.marketNotesCenter: (_) => const MarketNotesCenterScreen(),
        AppRouter.purchases: (_) => const PurchasesScreen(),
        AppRouter.addPurchase: (_) => const AddPurchaseScreen(),
        AppRouter.sales: (_) => const SalesScreen(),
        AppRouter.addSale: (_) => const AddSaleScreen(),
        AppRouter.analytics: (_) => const AnalyticsScreen(),
        AppRouter.settings: (_) => const SettingsScreen(),
        AppRouter.export: (_) => const ExportScreen(),
        AppRouter.importRestore: (_) => const ImportRestoreScreen(),
        AppRouter.backupHistory: (_) => const BackupHistoryScreen(),
        AppRouter.commandCenter: (_) => const CommandCenterScreen(),
        AppRouter.systemHealth: (_) => const SystemHealthScreen(),
        AppRouter.manualActionReports: (_) => const ManualActionReportsScreen(),
        AppRouter.activityLog: (_) => const ActivityLogScreen(),
        AppRouter.activityTimeline: (_) => const ActivityTimelineScreen(),
        AppRouter.globalSearch: (_) => const GlobalSearchScreen(),
        AppRouter.deadStockCenter: (_) => const DeadStockActionCenterScreen(),
        AppRouter.inventoryActionCenter: (_) =>
            const InventoryActionCenterScreen(),
        AppRouter.opportunityCenter: (_) => const OpportunityCenterScreen(),
        AppRouter.dealEvaluator: (_) => const DealEvaluatorScreen(),
        AppRouter.dealHistory: (_) => const DealHistoryScreen(),
      },
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}