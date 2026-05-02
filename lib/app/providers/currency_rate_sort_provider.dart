import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_rate_sort_service.dart';

final currencyRateSortServiceProvider =
    Provider<CurrencyRateSortService>((ref) {
  return CurrencyRateSortService();
});
