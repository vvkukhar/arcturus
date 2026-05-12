import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/activity/presentation/activity_log_screen.dart';
import 'package:lego_trading_manager/features/analytics/presentation/analytics_screen.dart';
import 'package:lego_trading_manager/features/command_center/presentation/command_center_screen.dart';
import 'package:lego_trading_manager/features/dashboard/presentation/dashboard_live_screen.dart';
import 'package:lego_trading_manager/features/deals/presentation/deal_evaluator_screen.dart';
import 'package:lego_trading_manager/features/deals/presentation/deal_history_screen.dart';
import 'package:lego_trading_manager/features/inventory/presentation/inventory_screen.dart';
import 'package:lego_trading_manager/features/purchases/presentation/purchases_screen.dart';
import 'package:lego_trading_manager/features/sales/presentation/sales_screen.dart';
import 'package:lego_trading_manager/features/watchlist/presentation/watchlist_screen.dart';
import 'package:lego_trading_manager/features/settings/presentation/settings_hub_screen.dart';
import 'package:lego_trading_manager/features/market/presentation/market_screen.dart';
import 'package:lego_trading_manager/features/pos/presentation/pos_terminal_screen.dart';

class AppRouter {
  static const home = '/';
  static const dashboard = '/dashboard';
  static const inventory = '/inventory';
  static const purchases = '/purchases';
  static const sales = '/sales';
  static const watchlist = '/watchlist';
  static const analytics = '/analytics';
  static const activityLog = '/activity-log';
  static const dealEvaluator = '/deal-evaluator';
  static const dealHistory = '/deal-history';
  static const commandCenter = '/command-center';
  static const settings = '/settings';
  static const market = '/market';
  static const pos = '/pos';

  static final Map<String, WidgetBuilder> _routes = {
    home: (_) => const DashboardLiveScreen(),
    dashboard: (_) => const DashboardLiveScreen(),
    inventory: (_) => const InventoryScreen(),
    purchases: (_) => const PurchasesScreen(),
    sales: (_) => const SalesScreen(),
    watchlist: (_) => const WatchlistScreen(),
    analytics: (_) => const AnalyticsScreen(),
    activityLog: (_) => const ActivityLogScreen(),
    dealEvaluator: (_) => const DealEvaluatorScreen(),
    dealHistory: (_) => const DealHistoryScreen(),
    commandCenter: (_) => const CommandCenterScreen(),
    settings: (_) => const SettingsHubScreen(),
    market: (_) => const MarketScreen(),
    pos: (_) => const PosTerminalScreen(),
  };

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final builder = _routes[settings.name];
    if (builder != null) {
      return MaterialPageRoute(
        builder: builder,
        settings: settings,
      );
    }
    return MaterialPageRoute(
      builder: (_) => const DashboardLiveScreen(),
    );
  }
}