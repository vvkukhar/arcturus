// lib/features/settings/application/currency_summary_text_service.dart

import 'package:lego_trading_manager/data/models/currency_dashboard_model.dart';

class CurrencySummaryTextService {
  String build(CurrencyDashboardModel model) {
    return 'Base: ${model.baseCurrency}, official: ${model.officialRateCount}, manual: ${model.manualRateCount}';
  }
}
