import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_lookup_service.dart';

final currencyLookupServiceProvider = Provider<CurrencyLookupService>((ref) {
  return CurrencyLookupService();
});
