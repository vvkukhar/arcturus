// lib/app/providers/currency_dashboard_service_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_dashboard_service.dart';

final currencyDashboardServiceProvider =
    Provider<CurrencyDashboardService>((ref) {
  return CurrencyDashboardService();
});
