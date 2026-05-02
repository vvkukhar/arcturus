import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';

final settingsQuickLinksProvider = Provider<List<Map<String, String>>>((ref) {
  return const [
    {
      'title': 'Currency Hub',
      'route': AppRouter.currencyHub,
    },
    {
      'title': 'Default Fees',
      'route': AppRouter.defaultFees,
    },
    {
      'title': 'Currency History',
      'route': AppRouter.currencyHistory,
    },
    {
      'title': 'Export',
      'route': AppRouter.export,
    },
    {
      'title': 'Import Restore',
      'route': AppRouter.importRestore,
    },
  ];
});