// lib/features/settings/application/currency_dashboard_service.dart

import 'package:lego_trading_manager/data/models/currency_dashboard_model.dart';

class CurrencyDashboardService {
  CurrencyDashboardModel build({
    required String baseCurrency,
    required int officialRateCount,
    required int manualRateCount,
    required DateTime? lastOfficialSync,
    required bool officialModeEnabled,
  }) {
    return CurrencyDashboardModel(
      baseCurrency: baseCurrency,
      officialRateCount: officialRateCount,
      manualRateCount: manualRateCount,
      lastOfficialSync: lastOfficialSync,
      officialModeEnabled: officialModeEnabled,
    );
  }
}
