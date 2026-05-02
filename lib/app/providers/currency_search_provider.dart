import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_search_service.dart';

final currencySearchServiceProvider = Provider<CurrencySearchService>((ref) {
  return CurrencySearchService();
});
