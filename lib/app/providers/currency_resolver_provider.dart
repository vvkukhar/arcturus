import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/application/currency_resolver_service.dart';

final currencyResolverServiceProvider =
    Provider<CurrencyResolverService>((ref) {
  return CurrencyResolverService();
});
