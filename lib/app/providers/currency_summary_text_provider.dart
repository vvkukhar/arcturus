import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_summary_text_service.dart';

final currencySummaryTextServiceProvider =
    Provider<CurrencySummaryTextService>((ref) {
  return CurrencySummaryTextService();
});
