import 'package:flutter/foundation.dart';
import 'package:lego_trading_manager/core/services/app_bootstrap_report.dart';

class AppBootstrapLogger {
  static void log(AppBootstrapReport report) {
    debugPrint(
      'Bootstrap: inventory=${report.inventoryLoaded}, '
      'purchases=${report.purchasesLoaded}, '
      'sales=${report.salesLoaded}, '
      'watchlist=${report.watchlistLoaded}, '
      'market=${report.marketLoaded}, '
      'partout=${report.partoutLoaded}',
    );
  }
}
