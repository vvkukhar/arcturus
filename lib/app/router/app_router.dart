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
import 'package:lego_trading_manager/features/search/presentation/global_search_screen.dart';
import 'package:lego_trading_manager/features/auth/presentation/login_screen.dart';

class AppRouter {
  static const String home = '/';
  static const String login = '/login';
  static const String dashboard = '/dashboard';
  static const String inventory = '/inventory';
  static const String purchases = '/purchases';
  static const String sales = '/sales';
  static const String watchlist = '/watchlist';
  static const String analytics = '/analytics';
  static const String activityLog = '/activity-log';
  static const String dealEvaluator = '/deal-evaluator';
  static const String dealHistory = '/deal-history';
  static const String commandCenter = '/command-center';
  static const String settings = '/settings';
  static const String market = '/market';
  static const String pos = '/pos';
  static const String globalSearch = '/global-search';

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    Widget page;
    
    switch (settings.name) {
      case '/':
      case '/dashboard':
        page = const DashboardLiveScreen();
        break;
      case '/login':
        page = const LoginScreen();
        break;
      case '/inventory':
        page = const InventoryScreen();
        break;
      case '/purchases':
        page = const PurchasesScreen();
        break;
      case '/sales':
        page = const SalesScreen();
        break;
      case '/watchlist':
        page = const WatchlistScreen();
        break;
      case '/analytics':
        page = const AnalyticsScreen();
        break;
      case '/activity-log':
        page = const ActivityLogScreen();
        break;
      case '/deal-evaluator':
        page = const DealEvaluatorScreen();
        break;
      case '/deal-history':
        page = const DealHistoryScreen();
        break;
      case '/command-center':
        page = const CommandCenterScreen();
        break;
      case '/settings':
        page = const SettingsHubScreen();
        break;
      case '/market':
        page = const MarketScreen();
        break;
      case '/pos':
        page = const PosTerminalScreen();
        break;
      case '/global-search':
        page = const GlobalSearchScreen();
        break;
      default:
        page = const DashboardLiveScreen();
    }

    return MaterialPageRoute(
      builder: (_) => page,
      settings: settings,
    );
  }
}