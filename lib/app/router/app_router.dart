import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/pos/presentation/pos_terminal_screen.dart';
import 'package:lego_trading_manager/features/auth/presentation/login_screen.dart';
import 'package:lego_trading_manager/features/auth/presentation/register_screen.dart';
import 'package:lego_trading_manager/features/core/presentation/root_layout.dart';

class AppRouter {
  static final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  static const String home = '/';
  static const String login = '/login';
  static const String register = '/register';
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
  static const String marketLive = '/market-live';
  static const String pos = '/pos';
  static const String globalSearch = '/global-search';
  static const String flows = '/flows'; 

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    Widget page;
    
    switch (settings.name) {
      case '/':
      case '/dashboard':
        page = const RootLayout(); 
        break;
      case '/login':
        page = const LoginScreen();
        break;
      case '/register':
        page = const RegisterScreen();
        break;
      case '/pos':
        page = const PosTerminalScreen();
        break;
      default:
        page = const RootLayout();
    }

    return MaterialPageRoute(
      builder: (_) => page,
      settings: settings,
    );
  }
}